<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/nemoci.html?raw';
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
			Object_2: THREE.Mesh;
			Object_3: THREE.Mesh;
			Object_4: THREE.Mesh;
			Object_5: THREE.Mesh;
			Object_6: THREE.Mesh;
			Object_7: THREE.Mesh;
			Object_8: THREE.Mesh;
			Object_9: THREE.Mesh;
			Object_10: THREE.Mesh;
			Object_11: THREE.Mesh;
			Object_12: THREE.Mesh;
		};
		materials: {
			Skull3: THREE.MeshStandardMaterial;
			Skull31: THREE.MeshStandardMaterial;
			Skull32: THREE.MeshStandardMaterial;
			Skull33: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/syphilis-skull.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group position={[-6.34, 4.13, -4.26]} rotation={[-2.02, 0.35, -0.94]}>
			<T.Mesh geometry={gltf.nodes.Object_2.geometry} material={gltf.materials.Skull3} />
			<T.Mesh geometry={gltf.nodes.Object_3.geometry} material={gltf.materials.Skull3} />
			<T.Mesh geometry={gltf.nodes.Object_4.geometry} material={gltf.materials.Skull3} />
			<T.Mesh geometry={gltf.nodes.Object_5.geometry} material={gltf.materials.Skull3} />
			<T.Mesh geometry={gltf.nodes.Object_6.geometry} material={gltf.materials.Skull31} />
			<T.Mesh geometry={gltf.nodes.Object_7.geometry} material={gltf.materials.Skull31} />
			<T.Mesh geometry={gltf.nodes.Object_8.geometry} material={gltf.materials.Skull31} />
			<T.Mesh geometry={gltf.nodes.Object_9.geometry} material={gltf.materials.Skull32} />
			<T.Mesh geometry={gltf.nodes.Object_10.geometry} material={gltf.materials.Skull32} />
			<T.Mesh geometry={gltf.nodes.Object_11.geometry} material={gltf.materials.Skull33} />
			<T.Mesh geometry={gltf.nodes.Object_12.geometry} material={gltf.materials.Skull33} />
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
