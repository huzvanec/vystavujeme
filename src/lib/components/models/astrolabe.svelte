<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/geodeticky-kruh.html?raw';
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
			Object_3: THREE.Mesh;
		};
		materials: {
			UNIVERSAL: THREE.LineBasicMaterial;
			UNIVERSAL: THREE.MeshPhysicalMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/astrolabe.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 1.02, -0.88]}>
			<T.LineSegments geometry={gltf.nodes.Object_2.geometry} material={gltf.materials.UNIVERSAL} />
			<T.Mesh geometry={gltf.nodes.Object_3.geometry} material={gltf.materials.UNIVERSAL} />
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
