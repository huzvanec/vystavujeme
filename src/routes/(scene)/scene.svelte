<script lang="ts" module>
	// room settings
	const roomSize = { x: 20, y: 6, z: 40 } as const;
	const wallWidth = 1;
	// camera settings
	const cameraStartPosition = { x: 0, z: 18 } as const;
	const cameraHeight = 1.8;
	const cameraStartRotation = { azimuth: 0, polar: Math.PI / 2 } as const; // radians
	const cameraRotationSpeed = 0.6;
	const cameraMovementSpeed = 5;
	const cameraZoomMin = 1;
	const cameraZoomMax = 4;
	const cameraZoomSpeed = 2;
	// collision settings
	const cameraCollision = 1e-3; // how much to move the camera from the wall when it collides
	const wallSpace = 0.1; // how far is the wall from the collision point
</script>

<script lang="ts">
	import { T, useLoader, useTask, useThrelte } from '@threlte/core';
	import { AntiqueGlobe, Cortes, FlatEarth, TadeasHaenke } from '$lib/components/models';
	import { store } from '$lib/scene-store.svelte';
	import { PerspectiveCamera, RepeatWrapping, TextureLoader } from 'three';
	import { CameraControls } from '$lib/camera-controls';
	import { CameraMovement, movement } from '$lib/components/camera-movement';
	import { CameraRaycasting } from '$lib/components/camera-raycasting';
	import { onMount } from 'svelte';
	import { useSuspense } from '@threlte/extras';
	import { Ignatius, Mexico } from '$lib/components/models/index.js';

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

			if (x <= -xBoundary) controls.moveTo(-xBoundary + cameraCollision, y, z);
			else if (x >= xBoundary) controls.moveTo(xBoundary - cameraCollision, y, z);
			else if (z <= -zBoundary) controls.moveTo(x, y, -zBoundary + cameraCollision);
			else if (z >= zBoundary) controls.moveTo(x, y, zBoundary - cameraCollision);
			if (controls.update(delta)) invalidate();
		},
		{ autoInvalidate: false }
	);

	const suspend = useSuspense();

	const floor = suspend(useLoader(TextureLoader).load('/textures/floor.jpg'));
	floor.then((texture) => {
		texture.wrapS = texture.wrapT = RepeatWrapping;
		texture.repeat.set(roomSize.x / 4, roomSize.z / 8);
	});

	const wallX = suspend(useLoader(TextureLoader).load('/textures/wall-x.jpg'));
	wallX.then((texture) => {
		texture.wrapS = texture.wrapT = RepeatWrapping;
		texture.repeat.set(roomSize.x / 10, 1);
	});

	const wallZ = suspend(useLoader(TextureLoader).load('/textures/wall-z.jpg'));
	wallZ.then((texture) => {
		texture.wrapS = texture.wrapT = RepeatWrapping;
		texture.repeat.set(roomSize.z / 10, 1);
	});
</script>

<!-- Camera -->
<CameraMovement />
<CameraRaycasting />
<T is={camera} makeDefault />

<!-- Exhibition -->
<T.DirectionalLight position={[0, 10, 0]} intensity={0.2} />
<T.AmbientLight intensity={0.8} />
<T.Group>
	<AntiqueGlobe scale={10} position={[-7, 3, 0]} />
	<FlatEarth position={[5, 1, 5]} />
	<TadeasHaenke position={[-9.93, 2.5, 18]} scale={1.5} rotation={[0, Math.PI / 2, 0]} />
	<Ignatius position={[-9.93, 2.5, 15]} scale={1.5} rotation={[0, Math.PI / 2, 0]} />
	<Mexico position={[-10.1, 1, 11]} scale={2} rotation={[0, Math.PI / 2, 0]} />
	<Cortes position={[-9.93, 2.5, 5.3]} scale={1.5} rotation={[0, Math.PI / 2, 0]} />
</T.Group>

<!-- Floor -->
{#if $floor}
	<T.Mesh receiveShadow>
		<T.BoxGeometry args={[roomSize.x + wallSpace * 2, 0.01, roomSize.z + wallSpace * 2]} />
		<T.MeshStandardMaterial map={$floor} />
	</T.Mesh>
{/if}

<!-- Walls -->
{#if $wallZ && $wallX}
	<T.Mesh receiveShadow position={[-roomSize.x / 2 - wallWidth / 2 - wallSpace, roomSize.y / 2, 0]}>
		<T.BoxGeometry args={[wallWidth, roomSize.y, roomSize.z + wallWidth * 2]} />
		<T.MeshStandardMaterial map={$wallZ} />
	</T.Mesh>
	<T.Mesh receiveShadow position={[roomSize.x / 2 + wallWidth / 2 + wallSpace, roomSize.y / 2, 0]}>
		<T.BoxGeometry args={[wallWidth, roomSize.y, roomSize.z + wallWidth * 2]} />
		<T.MeshStandardMaterial map={$wallZ} />
	</T.Mesh>
	<T.Mesh receiveShadow position={[0, roomSize.y / 2, -roomSize.z / 2 - wallWidth / 2 - wallSpace]}>
		<T.BoxGeometry args={[roomSize.x + wallWidth * 2, roomSize.y, wallWidth]} />
		<T.MeshStandardMaterial map={$wallX} />
	</T.Mesh>
	<T.Mesh receiveShadow position={[0, roomSize.y / 2, roomSize.z / 2 + wallWidth / 2 + wallSpace]}>
		<T.BoxGeometry args={[roomSize.x + wallWidth * 2, roomSize.y, wallWidth]} />
		<T.MeshStandardMaterial map={$wallX} />
	</T.Mesh>
{/if}
