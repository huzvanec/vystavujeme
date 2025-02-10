<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './(scene)/scene.svelte';
	import Crosshair from './(scene)/crosshair.svelte';
	import { cn } from '$lib/utils';
	import { Loader2Icon } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { store } from '$lib/scene-store.svelte';

	let loading = $state<boolean>(false);

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
		'absolute left-0 top-0 z-50 flex size-full items-center justify-center bg-background',
		!loading && 'hidden'
	)}
>
	<Loader2Icon class="size-[10%] animate-spin" />
</div>

<div
	class={cn(
		'absolute left-0 top-0 z-20 flex size-full items-center justify-center bg-background/80 transition-opacity',
		true /*locked*/ && 'pointer-events-none opacity-0'
	)}
>
	Klikněte pro ovládání 3D pohledu.
</div>

<!--<Button class="absolute">Butt</Button>-->

<div class="size-full" bind:this={store.canvasWrapper}>
	<Canvas>
		<Scene />
	</Canvas>
</div>

<Crosshair />
