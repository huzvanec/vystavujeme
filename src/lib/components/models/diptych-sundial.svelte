<script lang="ts">
	import type * as THREE from 'three';

	import type { Snippet } from 'svelte';
	import { T, type Props } from '@threlte/core';
	import { useSuspense } from '@threlte/extras';
	import text from '$lib/texts/slunecni-diptychove-hodiny.html?raw';
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
			Mechanics: THREE.Mesh;
			Arrow: THREE.Mesh;
			Roping: THREE.Mesh;
			obj4: THREE.Mesh;
			obj4_1: THREE.Mesh;
			obj4_2: THREE.Mesh;
			obj4_3: THREE.Mesh;
			obj4_4: THREE.Mesh;
			Dot: THREE.Mesh;
			obj6: THREE.Mesh;
			obj6_1: THREE.Mesh;
			obj6_2: THREE.Mesh;
			obj6_3: THREE.Mesh;
		};
		materials: {
			Metal: THREE.MeshStandardMaterial;
			Arrow: THREE.MeshStandardMaterial;
			Rope: THREE.MeshStandardMaterial;
			Body: THREE.MeshStandardMaterial;
			Horizontal: THREE.MeshStandardMaterial;
			['Horizontal Back']: THREE.MeshStandardMaterial;
			Vertical: THREE.MeshStandardMaterial;
			['Vertical Back']: THREE.MeshStandardMaterial;
			['Compass Rose']: THREE.MeshStandardMaterial;
			['Time Disk']: THREE.MeshStandardMaterial;
			['Lunar Vovelle']: THREE.MeshStandardMaterial;
		};
	};

	const gltf = suspend(useGltf<GLTFResult>('/models/diptych-sundial.glb'));
</script>

<ModelDialog model={ref} {text} />

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.Mechanics.geometry}
			material={gltf.materials.Metal}
			position={[0, 72.32, -1.15]}
			rotation={[Math.PI / 2, 0, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.Arrow.geometry}
			material={gltf.materials.Arrow}
			position={[0, 72.32, -1.15]}
			rotation={[Math.PI / 2, 0, 0]}
		/>
		<T.Mesh
			geometry={gltf.nodes.Roping.geometry}
			material={gltf.materials.Rope}
			position={[0, 72.32, -1.15]}
			rotation={[Math.PI / 2, 0, 0]}
		/>
		<T.Group position={[0, 71.51, 0]} rotation={[Math.PI / 2, 0, 0]}>
			<T.Mesh geometry={gltf.nodes.obj4.geometry} material={gltf.materials.Body} />
			<T.Mesh geometry={gltf.nodes.obj4_1.geometry} material={gltf.materials.Horizontal} />
			<T.Mesh geometry={gltf.nodes.obj4_2.geometry} material={gltf.materials['Horizontal Back']} />
			<T.Mesh geometry={gltf.nodes.obj4_3.geometry} material={gltf.materials.Vertical} />
			<T.Mesh geometry={gltf.nodes.obj4_4.geometry} material={gltf.materials['Vertical Back']} />
		</T.Group>
		<T.Mesh
			geometry={gltf.nodes.Dot.geometry}
			material={gltf.materials.Metal}
			position={[0, 72.32, -1.15]}
			rotation={[Math.PI / 2, 0, 0]}
		/>
		<T.Group position={[0, 72.32, -1.15]} rotation={[Math.PI / 2, 0, 0]}>
			<T.Mesh geometry={gltf.nodes.obj6.geometry} material={gltf.materials.Body} />
			<T.Mesh geometry={gltf.nodes.obj6_1.geometry} material={gltf.materials['Compass Rose']} />
			<T.Mesh geometry={gltf.nodes.obj6_2.geometry} material={gltf.materials['Time Disk']} />
			<T.Mesh geometry={gltf.nodes.obj6_3.geometry} material={gltf.materials['Lunar Vovelle']} />
		</T.Group>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
