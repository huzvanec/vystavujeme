<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import { useGltf } from '$lib/utils';
	import { ModelDialog } from '$lib/components/model-dialog';
	import text from '$lib/texts/kruzidlo-umerne-se-slunecnimi-hodinami.html?raw';

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

	type GLTFResult = {
		nodes: {
			Legs: THREE.Mesh;
			Circle: THREE.Mesh;
			Plane: THREE.Mesh;
		};
		materials: {
			Material: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/proportional-compass.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.Legs.geometry}
			material={gltf.materials.Material}
			scale={[2.37, 1, 1]}
		/>
		<T.Mesh
			geometry={gltf.nodes.Circle.geometry}
			material={gltf.materials.Material}
			position={[0, -0.09, 0]}
			scale={[2.37, 1.72, 1]}
		/>
		<T.Mesh
			geometry={gltf.nodes.Plane.geometry}
			material={gltf.materials.Material}
			position={[0, 0.02, 0]}
			scale={[2.37, 1, 1]}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
