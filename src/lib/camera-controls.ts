import CC from 'camera-controls';
import * as THREE from 'three';
import type { Camera } from '$types/camera';

export class CameraControls extends CC {
	static installed: boolean = false;
	constructor(element: HTMLElement, camera: Camera) {
		if (!CameraControls.installed) {
			CC.install({ THREE });
			CameraControls.installed = true;
		}

		super(camera, element);
	}
}
