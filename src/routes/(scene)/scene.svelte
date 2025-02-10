<script lang="ts" module>
	// room settings
	const roomSize = { x: 20, y: 10, z: 40 } as const;
	// camera settings
	const cameraStartPosition = { x: 0, z: 18 } as const;
	const cameraHeight = 1.8;
	const cameraStartRotation = { azimuth: 0, polar: Math.PI / 2 } as const; // radians
	const cameraRotationSpeed = 0.6;
	const cameraMovementSpeed = 5;
	const cameraZoomMin = 1;
	const cameraZoomMax = 4;
	const cameraZoomSpeed = 2;
</script>

<script lang="ts">
	import { T, useLoader, useTask, useThrelte } from '@threlte/core';
	import { AntiqueGlobe, FlatEarth, TadeasHaenke } from '$lib/components/models';
	import { store } from '$lib/scene-store.svelte';
	import { PerspectiveCamera, RepeatWrapping, TextureLoader } from 'three';
	import { CameraControls } from '$lib/camera-controls';
	import { CameraMovement, movement } from '$lib/components/camera-movement';
	import { CameraRaycasting } from '$lib/components/camera-raycasting';
	import { onMount } from 'svelte';
	import { useSuspense } from '@threlte/extras';

	const { dom, invalidate } = useThrelte();

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
	controls.draggingSmoothTime = 0;
	controls.minZoom = cameraZoomMin;
	controls.maxZoom = cameraZoomMax;
	controls.dollySpeed = cameraZoomSpeed;
	controls.moveTo(cameraStartPosition.x, cameraHeight, cameraStartPosition.z);
	controls.rotateTo(cameraStartRotation.azimuth, cameraStartRotation.polar);
	store.camera = camera;
	store.controls = controls;

	// Dispose camera controls on unmount
	onMount(() => () => controls.dispose());

	$effect(() => {
		const touchMode = !store.cursorLocked;
		controls.azimuthRotateSpeed = controls.polarRotateSpeed =
			cameraRotationSpeed * (touchMode ? -1 : 1);
	});

	useTask(
		(delta) => {
			const distance: number = delta * cameraMovementSpeed;
			switch (movement.lateral) {
				case 'right':
					controls.truck(distance, 0, true);
					break;
				case 'left':
					controls.truck(-distance, 0, true);
					break;
			}
			switch (movement.longitudinal) {
				case 'forwards':
					controls.forward(distance, true);
					break;
				case 'backwards':
					controls.forward(-distance, true);
					break;
			}

			const x = camera.position.x;
			const y = camera.position.y;
			const z = camera.position.z;

			const xBoundary = roomSize.x / 2;
			const zBoundary = roomSize.z / 2;
			const collision = 1e-3;

			if (x <= -xBoundary) controls.moveTo(-xBoundary + collision, y, z);
			else if (x >= xBoundary) controls.moveTo(xBoundary - collision, y, z);
			else if (z <= -zBoundary) controls.moveTo(x, y, -zBoundary + collision);
			else if (z >= zBoundary) controls.moveTo(x, y, zBoundary - collision);
			if (controls.update(delta)) invalidate();
		},
		{ autoInvalidate: false }
	);

	const suspend = useSuspense();

	const floor = suspend(useLoader(TextureLoader).load('/textures/floor.png'));
	floor.then((texture) => {
		texture.wrapS = texture.wrapT = RepeatWrapping;
		texture.repeat.set(5, 5);
	});
</script>

<!-- Camera -->
<CameraMovement />
<CameraRaycasting />
<T is={camera} makeDefault />

<!-- Exhibition -->
<T.DirectionalLight position={[0, 10, 0]} intensity={1} />
<T.AmbientLight intensity={0.3} />
<T.Group>
	<AntiqueGlobe scale={10} position={[-7, 3, 0]} />
	<FlatEarth position={[5, 1, 5]} />
	<TadeasHaenke position={[-5, 2, 5]} rotation={[0, Math.PI / 2, 0]} />
</T.Group>

<!-- Floor -->
{#if $floor}
	<T.Mesh receiveShadow>
		<T.BoxGeometry args={[roomSize.x, 0.01, roomSize.z]} />
		<T.MeshStandardMaterial map={$floor} />
	</T.Mesh>
{/if}
