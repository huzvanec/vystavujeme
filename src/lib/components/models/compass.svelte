<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/stolni-buzola.html?raw';
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
			defaultMaterial: THREE.Mesh;
			defaultMaterial_1: THREE.Mesh;
			defaultMaterial_2: THREE.Mesh;
			defaultMaterial_3: THREE.Mesh;
		};
		materials: {
			Compass: THREE.MeshStandardMaterial;
			Glass: THREE.MeshStandardMaterial;
			Middle: THREE.MeshStandardMaterial;
			Rotate: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/compass.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 0, 0]}>
			<T.Group rotation={[Math.PI / 2, 0, 0]}>
				<T.Mesh geometry={gltf.nodes.defaultMaterial.geometry} material={gltf.materials.Compass} />
				<T.Mesh geometry={gltf.nodes.defaultMaterial_1.geometry} material={gltf.materials.Glass} />
				<T.Mesh geometry={gltf.nodes.defaultMaterial_2.geometry} material={gltf.materials.Middle} />
				<T.Mesh geometry={gltf.nodes.defaultMaterial_3.geometry} material={gltf.materials.Rotate} />
			</T.Group>
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
