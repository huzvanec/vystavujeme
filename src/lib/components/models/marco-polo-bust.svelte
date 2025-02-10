<script lang="ts">
	import type * as THREE from 'three';
	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import { ModelDialog } from '$lib/components/model-dialog';
	import text from '$lib/texts/marco-polo.html?raw';
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
			model_0: THREE.Mesh;
			model_1: THREE.Mesh;
			model_2: THREE.Mesh;
			model_3: THREE.Mesh;
		};
		materials: {
			['Marco Polo']: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/marco-polo-bust.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.model_0.geometry}
			material={gltf.materials['Marco Polo']}
			position={[0, 10.7, 0]}
			rotation={[-Math.PI, 0, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.model_1.geometry}
			material={gltf.materials['Marco Polo']}
			position={[0, 10.7, 0]}
			rotation={[-Math.PI, 0, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.model_2.geometry}
			material={gltf.materials['Marco Polo']}
			position={[0, 10.7, 0]}
			rotation={[-Math.PI, 0, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.model_3.geometry}
			material={gltf.materials['Marco Polo']}
			position={[0, 10.7, 0]}
			rotation={[-Math.PI, 0, 0]}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
