<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/obchod-s-asii.html?raw';
	import { useGltf } from '$lib/utils';
	import { ModelDialog } from '$lib/components/model-dialog';

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
			mesh_Model_7: THREE.Mesh;
		};
		materials: {
			mesh_Model_7: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/spice.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh geometry={gltf.nodes.mesh_Model_7.geometry} material={gltf.materials.mesh_Model_7} />
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
