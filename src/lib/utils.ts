import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDraco, useGltf as _useGltf } from '@threlte/extras';
// @ts-expect-error import is valid
import type { SceneGraph } from '@threlte/extras/dist/lib/buildSceneGraph';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const useGltf = <Graph extends SceneGraph = undefined>(url: string) =>
	_useGltf<Graph>(url, { dracoLoader: useDraco() });

export const inject = (node: Element, argument = 'body') => {
	const targetNode = document.querySelector(argument);
	targetNode!.appendChild(node);

	return {
		destroy() {
			node.remove();
		}
	};
};
