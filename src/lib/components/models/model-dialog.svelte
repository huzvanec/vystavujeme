<script lang="ts" module>
	import type { Object3D } from 'three';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithoutChildren } from 'bits-ui';

	export interface ModelDialogProps extends WithoutChildren<HTMLAttributes<HTMLDivElement>> {
		model?: Object3D;
		text: string;
	}
</script>

<script lang="ts">
	import {
		Dialog,
		DialogContent,
		DialogTitle,
		DialogClose,
		DialogFooter
	} from '$lib/components/ui/dialog';
	import { onMount } from 'svelte';
	import { registerRaycast } from '$lib/raycasting';
	import { store } from '$lib/scene-store.svelte';
	import { Button } from '$lib/components/ui/button';
	import { XIcon } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { cn } from '$lib/utils';

	let { model, text, class: className, ...restProps }: ModelDialogProps = $props();
	let open = $state<boolean>(false);

	const split = text.split('\n');
	const title = split[0];
	const content = split.slice(1).join('\n');

	onMount(() => {
		registerRaycast(model!, () => {
			open = true;
			store.controls!.unlockPointer();
		});
	});
</script>

<Dialog
	bind:open
	onOpenChange={(newOpen) => {
		if (!newOpen) store.controls?.lockPointer();
	}}
>
	<DialogContent
		class="flex h-[75%] max-w-[75%] flex-col"
		escapeKeydownBehavior="ignore"
		onOpenAutoFocus={(event) => event.preventDefault()}
	>
		<DialogTitle class="text-4xl">{title}</DialogTitle>
		<ScrollArea class="h-full" type="always">
			<div class={cn('text mr-4 flex flex-col gap-2 text-xl', className)} {...restProps}>
				{@html content}
			</div>
		</ScrollArea>
		<DialogFooter>
			<DialogClose>
				<Button>
					<XIcon /> Zavřít
				</Button>
			</DialogClose>
		</DialogFooter>
	</DialogContent>
</Dialog>

<style lang="postcss">
	.text :global(h1),
	.text :global(h2),
	.text :global(h3) {
		@apply mt-4 font-semibold;
	}

	.text :global(h1) {
		@apply text-3xl;
	}

	.text :global(h2) {
		@apply text-2xl;
	}

	.text :global(h3) {
		@apply text-xl;
	}
</style>
