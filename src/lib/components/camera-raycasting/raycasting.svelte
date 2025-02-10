<script lang="ts" module>
	import { type Intersection, type Object3D, Raycaster, Vector3 } from 'three';

	export type ClickCallback = () => void;

	const objects: Object3D[] = [];
	const callbacks: ClickCallback[] = [];
	const raycaster = new Raycaster();
	const cameraRot = new Vector3();
	const intersections: Intersection[] = [];
	let mouseDown = false;

	export const registerClick = (obj: Object3D, onClick: ClickCallback) => {
		objects.push(obj);
		callbacks.push(onClick);
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { store } from '$lib/scene-store.svelte';
	import { useTask } from '@threlte/core';

	const onMouseDown = (event: MouseEvent) => {
		if (event.button === 0) mouseDown = true;
	};

	const onMouseUp = (event: MouseEvent) => {
		if (event.button === 0) mouseDown = false;
	};

	onMount(() => {
		const wrapper: HTMLDivElement = store.canvasWrapper!;

		wrapper.addEventListener('mousedown', onMouseDown);
		wrapper.addEventListener('mouseup', onMouseUp);

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

		return () => {
			wrapper.removeEventListener('mousedown', onMouseDown);
			wrapper.removeEventListener('mouseup', onMouseUp);
		};
	});
</script>
