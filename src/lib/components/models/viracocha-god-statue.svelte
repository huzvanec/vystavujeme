<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/kolonizace.html?raw';
	import { useGltf } from '$lib/utils';
	import { ModelDialog } from '$lib/components/model-dialog/index.js';

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
			model_0: THREE.Mesh;
			model_1: THREE.Mesh;
		};
		materials: {
			Material: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/viracocha-god-statue.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.model_0.geometry}
			material={gltf.materials.Material}
			scale={0.37}
		/>
		<T.Mesh
			geometry={gltf.nodes.model_1.geometry}
			material={gltf.materials.Material}
			scale={0.37}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
