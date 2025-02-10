import { type Intersection, type Object3D, Raycaster, Vector3 } from 'three';
import { useTask } from '@threlte/core';
import { store } from '$lib/scene-store.svelte';

let init: boolean = false;

const objects: Object3D[] = [];
const callbacks: (() => void)[] = [];
const raycaster = new Raycaster();
const cameraRot = new Vector3();
const intersections: Intersection[] = [];

let mouseDown: boolean = false;

const start = () => {
	console.log('init');
	init = true;
	const canvasWrapper: HTMLDivElement = store.canvasWrapper!;
	canvasWrapper.addEventListener('mousedown', (event) => {
		if (event.button === 0) mouseDown = true;
	});

	canvasWrapper.addEventListener('mouseup', (event) => {
		if (event.button === 0) mouseDown = false;
	});

	useTask((): void => {
		const camera = store.camera!;
		camera.getWorldDirection(cameraRot);
		raycaster.set(camera.position, cameraRot);
		intersections.length = 0;
		raycaster.intersectObjects(objects, true, intersections);
		const intersection = intersections[0];
		if (!intersection || intersection.distance > 4) {
			store.crosshairActive = false;
			return;
		}
		let current: Object3D | null = intersection.object;
		while (current) {
			const currentIndex = objects.indexOf(current);
			if (currentIndex !== -1) {
				store.crosshairActive = true;
				if (mouseDown && store.cursorLocked) {
					mouseDown = false;
					callbacks[currentIndex]();
				}
				return;
			}
			current = current.parent;
		}
		throw Error('Object is not a child of any objects the raycaster was supposed to intersect!');
	});
};

export const registerRaycast = (obj: Object3D, onClick: () => void) => {
	console.log('registered');
	objects.push(obj);
	callbacks.push(onClick);
	if (!init) start();
};
