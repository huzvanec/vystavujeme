<script lang="ts">
	import { cn } from '$lib/utils';
	import { store } from '$lib/scene-store.svelte.js';
	import { PlusIcon } from 'lucide-svelte';
</script>

<PlusIcon
	class={cn(
		'absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-3xl text-white',
		store.crosshairActive && 'text-orange-500'
	)}
/>
