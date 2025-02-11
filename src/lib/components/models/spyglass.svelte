<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/cockovy-dalekohled.html?raw';
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
			SpyglassGlassBig_Spyglass_Glass_0: THREE.Mesh;
			SpyglassGlassSmall_Spyglass_Glass_0: THREE.Mesh;
			Spyglass_Spyglass_0: THREE.Mesh;
		};
		materials: {
			Spyglass_Glass: THREE.MeshStandardMaterial;
			Spyglass: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/spyglass.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Group rotation={[-2.34, 0, 0]} scale={0.35}>
			<T.Group rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
				<T.Mesh
					geometry={gltf.nodes.SpyglassGlassBig_Spyglass_Glass_0.geometry}
					material={gltf.materials.Spyglass_Glass}
					position={[-189.88, 10.4, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
					scale={100}
				/>
				<T.Mesh
					geometry={gltf.nodes.SpyglassGlassSmall_Spyglass_Glass_0.geometry}
					material={gltf.materials.Spyglass_Glass}
					position={[-55.23, 10.4, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
					scale={100}
				/>
				<T.Mesh
					geometry={gltf.nodes.Spyglass_Spyglass_0.geometry}
					material={gltf.materials.Spyglass}
					position={[-126.72, 10.4, 0]}
					rotation={[-Math.PI / 2, 0, 0]}
					scale={100}
				/>
			</T.Group>
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
