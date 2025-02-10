<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/obchod-s-amerikou.html?raw';
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
			Mesh_0002_Material001_0: THREE.Mesh;
			Plane001_Material002_0: THREE.Mesh;
		};
		materials: {
			['Material.001']: THREE.MeshStandardMaterial;
			['Material.002']: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/horse.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group scale={0.01}>
			<T.Mesh
				geometry={gltf.nodes.Mesh_0002_Material001_0.geometry}
				material={gltf.materials['Material.001']}
				rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
				scale={100}
			/>
			<T.Mesh
				geometry={gltf.nodes.Plane001_Material002_0.geometry}
				material={gltf.materials['Material.002']}
				position={[28.79, 367.64, -441.55]}
				rotation={[-0.89, Math.PI / 2, 0]}
				scale={100}
			/>
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
