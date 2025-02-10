import type { Camera } from '$types/camera';
import type { CameraControls } from '$lib/camera-controls';

export const store = $state<{
	camera?: Camera;
	controls?: CameraControls;
	crosshairActive: boolean;
	canvasWrapper?: HTMLDivElement;
	cursorLocked: boolean;
}>({
	cursorLocked: false,
	crosshairActive: false
});
