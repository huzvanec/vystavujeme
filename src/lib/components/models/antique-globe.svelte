<script lang="ts">
	import type * as THREE from 'three';

	import { type Snippet } from 'svelte';
	import { type Props, T } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import { useGltf } from '$lib/utils';
	import { ModelDialog } from '$lib/components/model-dialog';
	import text from '$lib/texts/cesty-moreplavcu.html?raw';

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
			Globe_Base_low001_Globe_Base_0: THREE.Mesh;
			Globe_low001_Globe003_0: THREE.Mesh;
		};
		materials: {
			Globe_Base: THREE.MeshStandardMaterial;
			['Globe.003']: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/antique-globe.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 0, 0]} scale={0.13}>
			<T.Group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
				<T.Mesh
					geometry={gltf.nodes.Globe_Base_low001_Globe_Base_0.geometry}
					material={gltf.materials.Globe_Base}
					position={[567.69, -207.55, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
					scale={100}
				/>
				<T.Mesh
					geometry={gltf.nodes.Globe_low001_Globe003_0.geometry}
					material={gltf.materials['Globe.003']}
					position={[564.61, 4.65, 0]}
					rotation={[-1.77, 0.04, -0.42]}
					scale={100}
				/>
			</T.Group>
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
