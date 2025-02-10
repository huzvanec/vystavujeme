<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/pocatky-kolonizace.html?raw';
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
			pCylinder15_Kanat_1_pCylinder15_Kanat_0: THREE.Mesh;
			pCylinder15_Kanat_1_Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061_0: THREE.Mesh;
			pCylinder15_Kanat_1_Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061_0_1: THREE.Mesh;
			pCylinder15_Kanat_1_Diff_3_Side_01_polySurface3870_0: THREE.Mesh;
			pCylinder15_Kanat_1_Kanat_nurbsToPoly215_0: THREE.Mesh;
			pCylinder15_Kanat_1_Diff_4_Sail_parusa_07_0: THREE.Mesh;
			pCylinder15_Kanat_1_Diff_1_Deck_26_0: THREE.Mesh;
			pCylinder15_Kanat_1_Diff_4_Flag_01_0: THREE.Mesh;
		};
		materials: {
			pCylinder15_Kanat: THREE.MeshStandardMaterial;
			Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061: THREE.MeshStandardMaterial;
			Diff_3_Side_01_polySurface3870: THREE.MeshStandardMaterial;
			Kanat_nurbsToPoly215: THREE.MeshStandardMaterial;
			Diff_4_Sail_parusa_07: THREE.MeshStandardMaterial;
			Diff_1_Deck_26: THREE.MeshStandardMaterial;
			Diff_4_Flag_01: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/santa-maria.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.pCylinder15_Kanat_1_pCylinder15_Kanat_0.geometry}
			material={gltf.materials.pCylinder15_Kanat}
		/>
		<T.Mesh
			geometry={gltf.nodes
				.pCylinder15_Kanat_1_Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061_0
				.geometry}
			material={gltf.materials
				.Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061}
		/>
		<T.Mesh
			geometry={gltf.nodes
				.pCylinder15_Kanat_1_Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061_0_1
				.geometry}
			material={gltf.materials
				.Kanat_polySurface1707_polySurface1702_polySurface1699_polySurface517_pCylinder56_polySurface3061}
		/>
		<T.Mesh
			geometry={gltf.nodes.pCylinder15_Kanat_1_Diff_3_Side_01_polySurface3870_0.geometry}
			material={gltf.materials.Diff_3_Side_01_polySurface3870}
		/>
		<T.Mesh
			geometry={gltf.nodes.pCylinder15_Kanat_1_Kanat_nurbsToPoly215_0.geometry}
			material={gltf.materials.Kanat_nurbsToPoly215}
		/>
		<T.Mesh
			geometry={gltf.nodes.pCylinder15_Kanat_1_Diff_4_Sail_parusa_07_0.geometry}
			material={gltf.materials.Diff_4_Sail_parusa_07}
		/>
		<T.Mesh
			geometry={gltf.nodes.pCylinder15_Kanat_1_Diff_1_Deck_26_0.geometry}
			material={gltf.materials.Diff_1_Deck_26}
		/>
		<T.Mesh
			geometry={gltf.nodes.pCylinder15_Kanat_1_Diff_4_Flag_01_0.geometry}
			material={gltf.materials.Diff_4_Flag_01}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
