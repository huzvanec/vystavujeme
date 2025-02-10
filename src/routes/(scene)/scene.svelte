<script lang="ts">
	// noinspection ES6UnusedImports
	import { T, useLoader, useTask, useThrelte } from '@threlte/core';
	import { interactivity } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { AntiqueGlobe, FlatEarth } from '$lib/components/models';
	import { store } from '$lib/scene-store.svelte';
	import { TadeasHaenke } from '$lib/components/models/index.js';
	import { PerspectiveCamera, RepeatWrapping, TextureLoader } from 'three';
	import { CameraControls } from '$lib/camera-controls';

	interactivity();

	const { dom, invalidate } = useThrelte();

	const scale: Spring<number> = new Spring(1);

	const camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 100);
	camera.position.set(0, 0, 1e-5);
	const controls = new CameraControls(dom, camera);
	controls.saveState();
	controls.minDistance = controls.maxDistance = 1;
	controls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
	controls.mouseButtons.left =
		controls.mouseButtons.middle =
		controls.mouseButtons.right =
			CameraControls.ACTION.ROTATE;
	controls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_TRUCK;
	controls.touches.three = CameraControls.ACTION.NONE;
	controls.dollySpeed = 2;
	controls.draggingSmoothTime = 0;
	controls.minZoom = 1;
	controls.maxZoom = 4;
	controls.moveTo(2, 2, 2);
	store.camera = camera;
	store.controls = controls;

	// Dispose camera controls on unmount
	$effect(() => () => controls.dispose());

	$effect(() => {
		const touchMode = !store.cursorLocked;
		controls.azimuthRotateSpeed = controls.polarRotateSpeed = 0.6 * (touchMode ? -1 : 1);
	});

	const speed = 5;

	useTask(
		(delta) => {
			switch (lateral) {
				case 'right':
					controls.truck(delta * speed, 0, true);
					break;
				case 'left':
					controls.truck(-delta * speed, 0, true);
					break;
			}
			switch (longitudinal) {
				case 'forwards':
					controls.forward(delta * speed, true);
					break;
				case 'backwards':
					controls.forward(-delta * speed, true);
					break;
			}
			const x = camera.position.x;
			const z = camera.position.z;
			const limit = 10;
			if (x <= -limit || x >= limit || z <= -limit || z >= limit) controls.moveTo(0, 2, 0, true);
			if (controls.update(delta)) invalidate();
		},
		{ autoInvalidate: false }
	);

	// let gltf = $state<ThrelteGltf>();
	//
	// loading = true;
	// useGltf('/animated/AnimatedCube.gltf').then((result) => {
	// 	gltf = result;
	// loading = false;
	// });

	let longitudinal = $state<'forwards' | 'backwards' | null>(null);
	let lateral = $state<'left' | 'right' | null>(null);

	addEventListener('keydown', (event) => {
		switch (event.key) {
			case 'w':
			case 'ArrowUp':
				longitudinal = 'forwards';
				event.preventDefault();
				break;
			case 'a':
			case 'ArrowLeft':
				lateral = 'left';
				event.preventDefault();
				break;
			case 'd':
			case 'ArrowRight':
				lateral = 'right';
				event.preventDefault();
				break;
			case 's':
			case 'ArrowDown':
				longitudinal = 'backwards';
				event.preventDefault();
				break;
		}
	});

	addEventListener('keyup', (event) => {
		switch (event.key) {
			case 'w':
			case 'ArrowUp':
				if (longitudinal === 'forwards') longitudinal = null;
				event.preventDefault();
				break;
			case 's':
			case 'ArrowDown':
				if (longitudinal === 'backwards') longitudinal = null;
				event.preventDefault();
				break;
			case 'a':
			case 'ArrowLeft':
				if (lateral === 'left') lateral = null;
				event.preventDefault();
				break;
			case 'd':
			case 'ArrowRight':
				if (lateral === 'right') lateral = null;
				event.preventDefault();
				break;
		}
	});

	const floor = useLoader(TextureLoader).load('/textures/floor.png');
	floor.then((texture) => {
		texture.wrapS = texture.wrapT = RepeatWrapping;
		texture.repeat.set(5, 5);
	});
</script>

<!--<T.PerspectiveCamera makeDefault position={[10, 10, 10]}>-->
<!--	<OrbitControls />-->
<!--</T.PerspectiveCamera>-->

<T is={camera} makeDefault />

<T.DirectionalLight position={[0, 10, 0]} intensity={1} />
<T.AmbientLight intensity={0.3} />
<T.Group onpointerenter={() => (scale.target = 1.5)} onpointerleave={() => (scale.target = 1)}>
	<!--{#if gltf}-->
	<!--	<T is={gltf.scene} scale={0.01} />-->
	<!--{/if}-->
	<!--	<GLTF scale={0.1} position={[0, 0.3, 0]} url="/marco polo-transformed.glb" bind:gltf={$gltf} />-->
	<!--	<Polo scale={0.09} />-->
	<AntiqueGlobe scale={10} position={[-7, 3, 0]} />
	<FlatEarth position={[5, 1, 5]} />
	<TadeasHaenke position={[-5, 2, 5]} rotation={[0, Math.PI / 2, 0]} />
	<!--	<T.DirectionalLight position={[-5, 10, 5]} intensity={Math.PI * 3} />-->
	<!--	<T.Mesh position.y={1}>-->
	<!--		<T.SphereGeometry args={[1]} />-->
	<!--		<T.MeshStandardMaterial color="#FE3D00" toneMapped={false} />-->
	<!--	</T.Mesh>-->
</T.Group>

<T.Mesh position={[10, 0, 0]}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="red" />
</T.Mesh>
<T.Mesh position={[-10, 0, 0]}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="green" />
</T.Mesh>
<T.Mesh position={[0, 0, 10]}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="yellow" />
</T.Mesh>
<T.Mesh position={[0, 0, -10]}>
	<T.BoxGeometry args={[1, 1, 1]} />
	<T.MeshStandardMaterial color="blue" />
</T.Mesh>
<!--<Grid cellColor="#FE3D00" sectionColor="#FE3D00" />-->
{#if $floor}
	<T.Mesh receiveShadow>
		<T.BoxGeometry args={[20, 0.01, 20]} />
		<T.MeshStandardMaterial map={$floor} />
	</T.Mesh>
{/if}
