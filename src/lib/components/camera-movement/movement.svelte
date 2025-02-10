<script lang="ts" module>
	export type Longitudinal = 'forwards' | 'backwards';
	export type Lateral = 'left' | 'right';

	export const movement = $state<{
		longitudinal: Longitudinal | null;
		lateral: Lateral | null;
	}>({
		longitudinal: null,
		lateral: null
	});

	export const keys: Record<Longitudinal | Lateral, string[]> = {
		forwards: ['w', 'W', 'ArrowUp'],
		backwards: ['s', 'S', 'ArrowDown'],
		left: ['a', 'A', 'ArrowLeft'],
		right: ['d', 'D', 'ArrowRight']
	} as const;

	type MovementEntry =
		| { type: 'longitudinal'; value: Longitudinal }
		| { type: 'lateral'; value: Lateral };

	const keyMap = new Map<string, MovementEntry>();

	for (const key of keys.forwards) {
		keyMap.set(key, { type: 'longitudinal', value: 'forwards' });
	}
	for (const key of keys.backwards) {
		keyMap.set(key, { type: 'longitudinal', value: 'backwards' });
	}
	for (const key of keys.left) {
		keyMap.set(key, { type: 'lateral', value: 'left' });
	}
	for (const key of keys.right) {
		keyMap.set(key, { type: 'lateral', value: 'right' });
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	const onKeyDown = (event: KeyboardEvent) => {
		const entry = keyMap.get(event.key);
		if (!entry) return;
		movement[entry.type] = entry.value as never;
		event.preventDefault();
	};

	const onKeyUp = (event: KeyboardEvent) => {
		const entry = keyMap.get(event.key);
		if (!entry) return;
		if (movement[entry.type] === entry.value) movement[entry.type] = null;
		event.preventDefault();
	};

	onMount(() => {
		addEventListener('keydown', onKeyDown);
		addEventListener('keyup', onKeyUp);

		return () => {
			removeEventListener('keydown', onKeyDown);
			removeEventListener('keyup', onKeyUp);
		};
	});
</script>
