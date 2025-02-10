<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import { useGltf } from '$lib/utils';
	import { ModelDialog } from '$lib/components/model-dialog';
	import text from '$lib/texts/hernan-cortes.html?raw';

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
			mona_lisa002: THREE.Mesh;
			mona_lisa000: THREE.Mesh;
			mona_lisa001: THREE.Mesh;
			mona_lisa026: THREE.Mesh;
			Plane: THREE.Mesh;
		};
		materials: {
			Frame: THREE.MeshStandardMaterial;
			Image: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/hernan-cortes-painting.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.mona_lisa002.geometry}
			material={gltf.materials.Frame}
			position={[-0.53, -0.79, -0.05]}
			rotation={[-1.56, 0, -3.14]}
			scale={[1.21, 1.9, 1.76]}
		/>
		<T.Mesh
			geometry={gltf.nodes.mona_lisa000.geometry}
			material={gltf.materials.Frame}
			position={[-0.53, 0.84, -0.04]}
			rotation={[1.58, 0, 0]}
			scale={[1.21, 1.9, 1.76]}
		/>
		<T.Mesh
			geometry={gltf.nodes.mona_lisa001.geometry}
			material={gltf.materials.Frame}
			position={[-1.14, 0.03, -0.05]}
			rotation={[-2.83, 1.57, -1.88]}
			scale={[1.76, 1.9, 1.9]}
		/>
		<T.Mesh
			geometry={gltf.nodes.mona_lisa026.geometry}
			material={gltf.materials.Frame}
			position={[0.01, 0.49, -0.02]}
			rotation={[0.32, -1.57, -1.26]}
			scale={[1.76, 1.9, 1.9]}
		/>
		<T.Mesh
			geometry={gltf.nodes.Plane.geometry}
			material={gltf.materials.Image}
			position={[-0.53, 0.03, -0.11]}
			rotation={[Math.PI / 2, 0, 0]}
			scale={[0.47, 0.47, 0.68]}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
