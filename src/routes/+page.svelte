<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './(scene)/scene.svelte';
	import Crosshair from './(scene)/crosshair.svelte';
	import { cn, inject } from '$lib/utils';
	import { onMount } from 'svelte';
	import { store } from '$lib/scene-store.svelte';
	import { Suspense } from '@threlte/extras';
	import { Loader } from '$lib/components/ui/loader';

	onMount(() => {
		store.canvasWrapper!.addEventListener('click', () => {
			if (store.cursorLocked) return;
			store.controls?.lockPointer();
		});

		document.onpointerlockchange = () => (store.cursorLocked = !!document.pointerLockElement);
	});
</script>

<div
	class={cn(
		'absolute left-0 top-0 z-20 flex size-full items-center justify-center bg-background/80 transition-opacity',
		true /*locked*/ && 'pointer-events-none opacity-0'
	)}
>
	Klikněte pro ovládání 3D pohledu.
</div>

<div class="size-full" bind:this={store.canvasWrapper}>
	<Canvas>
		<Suspense final>
			{#snippet fallback()}
				<div
					class="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-8 bg-background"
					use:inject
				>
					<Loader />
					<h1 class="text-4xl font-bold">Načítání...</h1>
				</div>
			{/snippet}
			{#snippet error()}
				<div
					class="absolute left-0 top-0 flex size-full flex-col items-center justify-center gap-4 bg-background text-red-500"
					use:inject
				>
					<h1 class="text-6xl font-bold">Něco se rozbilo 😥</h1>
					<p class="text-2xl">Nepodařilo se načíst 3D výstavu.</p>
				</div>
			{/snippet}
			<Scene />
		</Suspense>
	</Canvas>
</div>

<Crosshair />
