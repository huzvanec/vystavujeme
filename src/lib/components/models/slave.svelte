<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/obchod-s-afrikou.html?raw';
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
			Object_5: THREE.Mesh;
			Object_6: THREE.Mesh;
			Object_7: THREE.Mesh;
			Object_8: THREE.Mesh;
			Object_9: THREE.Mesh;
			Object_10: THREE.Mesh;
			Object_11: THREE.Mesh;
			Object_12: THREE.Mesh;
			Object_13: THREE.Mesh;
			Object_14: THREE.Mesh;
			Object_15: THREE.Mesh;
			Object_16: THREE.Mesh;
			Object_17: THREE.Mesh;
			Object_18: THREE.Mesh;
			Object_19: THREE.Mesh;
			Object_20: THREE.Mesh;
			Object_21: THREE.Mesh;
			Object_22: THREE.Mesh;
		};
		materials: {
			Material: THREE.MeshStandardMaterial;
			Material__56: THREE.MeshStandardMaterial;
			Material__69: THREE.MeshStandardMaterial;
			Material__73: THREE.MeshStandardMaterial;
			Material__57: THREE.MeshStandardMaterial;
			Material__72: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/slave.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group rotation={[-Math.PI / 2, 0, 0]}>
			<T.Mesh geometry={gltf.nodes.Object_2.geometry} material={gltf.materials.Material} />
			<T.Mesh geometry={gltf.nodes.Object_3.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_4.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_5.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_6.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_7.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_8.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_9.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_10.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_11.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_12.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_13.geometry} material={gltf.materials.Material__56} />
			<T.Mesh geometry={gltf.nodes.Object_14.geometry} material={gltf.materials.Material__69} />
			<T.Mesh geometry={gltf.nodes.Object_15.geometry} material={gltf.materials.Material__73} />
			<T.Mesh geometry={gltf.nodes.Object_16.geometry} material={gltf.materials.Material__57} />
			<T.Mesh geometry={gltf.nodes.Object_17.geometry} material={gltf.materials.Material__57} />
			<T.Mesh geometry={gltf.nodes.Object_18.geometry} material={gltf.materials.Material__57} />
			<T.Mesh geometry={gltf.nodes.Object_19.geometry} material={gltf.materials.Material__57} />
			<T.Mesh geometry={gltf.nodes.Object_20.geometry} material={gltf.materials.Material__57} />
			<T.Mesh geometry={gltf.nodes.Object_21.geometry} material={gltf.materials.Material__57} />
			<T.Mesh geometry={gltf.nodes.Object_22.geometry} material={gltf.materials.Material__72} />
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
