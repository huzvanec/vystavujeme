<script lang="ts">
	import type * as THREE from 'three';
	import { Group } from 'three';
	import { type Snippet } from 'svelte';
	import { type Props, T } from '@threlte/core';
	import { useGltfAnimations, useSuspense } from '@threlte/extras';
	import { useGltf } from '$lib/utils';
	import { ModelDialog } from '$lib/components/model-dialog';
	import text from '$lib/texts/stredoveka-predstava-zeme.html?raw';

	let {
		fallback,
		error,
		children,
		ref = $bindable(),
		...props
	}: Props<THREE.Group> & {
		ref?: THREE.Group;
		children?: Snippet<[{ ref: THREE.Group }]>;
		fallback?: Snippet;
		error?: Snippet<[{ error: Error }]>;
	} = $props();

	const suspend = useSuspense();

	ref = new Group();

	type ActionName = 'Animation';
	type GLTFResult = {
		nodes: {
			Cube003: THREE.Mesh;
			Cube003_1: THREE.Mesh;
			Sun: THREE.Mesh;
			Moon: THREE.Mesh;
		};
		materials: {
			Map: THREE.MeshStandardMaterial;
			Rock: THREE.MeshStandardMaterial;
			Sun: THREE.MeshStandardMaterial;
			Moon: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/geocentric-flat-earth.glb'));

	export const { actions, mixer } = useGltfAnimations<ActionName>(gltf, ref);

	$effect(() => {
		$actions['Animation']?.play();
	});
</script>

<ModelDialog model={ref} {text} />

<T is={ref} dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group name="Scene">
			<T.Group name="Earth" position={[0, 1.02, 0]}>
				<T.Mesh
					name="Cube003"
					geometry={gltf.nodes.Cube003.geometry}
					material={gltf.materials.Map}
				/>
				<T.Mesh
					name="Cube003_1"
					geometry={gltf.nodes.Cube003_1.geometry}
					material={gltf.materials.Rock}
				/>
			</T.Group>
			<T.Mesh
				name="Sun"
				geometry={gltf.nodes.Sun.geometry}
				material={gltf.materials.Sun}
				position={[0.07, 2.21, 0.22]}
				rotation={[-Math.PI / 2, 0, 0]}
				scale={0.19}
			/>
			<T.Mesh
				name="Moon"
				geometry={gltf.nodes.Moon.geometry}
				material={gltf.materials.Moon}
				position={[-0.25, -1.28, 0.22]}
				rotation={[-Math.PI / 2, 0, 0]}
				scale={0.11}
			/>
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T>
