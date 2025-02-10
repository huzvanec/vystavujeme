<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import { ModelDialog } from '$lib/components/model-dialog';
	import text from '$lib/texts/mapa-cest-moreplavcu.html?raw';
	import { useGltf } from '$lib/utils';

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
			Plane: THREE.Mesh;
		};
		materials: {
			Material: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/voyages-map.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.Plane.geometry}
			material={gltf.materials.Material}
			scale={[1.89, 1, 1]}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
