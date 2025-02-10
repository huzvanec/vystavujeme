<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/krestansky-kriz.html?raw';
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
			Object_2: THREE.Mesh;
			Object_3: THREE.Mesh;
			Object_4: THREE.Mesh;
		};
		materials: {
			Object001_mtl: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/cross.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 0, 0]}>
			<T.Mesh geometry={gltf.nodes.Object_2.geometry} material={gltf.materials.Object001_mtl} />
			<T.Mesh geometry={gltf.nodes.Object_3.geometry} material={gltf.materials.Object001_mtl} />
			<T.Mesh geometry={gltf.nodes.Object_4.geometry} material={gltf.materials.Object001_mtl} />
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
