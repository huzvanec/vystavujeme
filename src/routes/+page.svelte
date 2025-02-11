<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './scene.svelte';
	import Crosshair from './crosshair.svelte';
	import { inject } from '$lib/utils';
	import { onMount } from 'svelte';
	import { store } from '$lib/scene-store.svelte';
	import { Suspense } from '@threlte/extras';
	import { Loader } from '$lib/components/ui/loader';
	import WelcomeDialog from './welcome.svelte';

	onMount(() => {
		store.canvasWrapper?.addEventListener('click', () => {
			if (store.cursorLocked) return;
			store.controls?.lockPointer();
		});

		document.onpointerlockchange = () => (store.cursorLocked = !!document.pointerLockElement);
	});

	const pc: boolean = window.matchMedia('(pointer:fine)').matches;

	let welcome = $state<boolean>(false);
</script>

{#if pc}
	<WelcomeDialog open={welcome} />
	<div class="size-full" bind:this={store.canvasWrapper}>
		<Canvas>
			<Suspense final onload={() => (welcome = true)}>
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
{:else}
	<h1
		class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-6xl font-bold text-red-500"
	>
		Dotyková zařízení nejsou podporována.
	</h1>
{/if}
