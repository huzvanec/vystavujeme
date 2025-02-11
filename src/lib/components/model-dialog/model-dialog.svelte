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
	import { store } from '$lib/scene-store.svelte';
	import { Button } from '$lib/components/ui/button';
	import { XIcon } from 'lucide-svelte';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { registerClick } from '$lib/components/camera-raycasting';
	import { cn } from '$lib/utils';
	import { DialogDescription } from '$lib/components/ui/dialog/index.js';

	let { model, text, class: className, ...restProps }: ModelDialogProps = $props();
	let open = $state<boolean>(false);

	const content = $derived.by<{
		title: string;
		description: string;
		body: string;
	}>(() => {
		const split: string[] = text.split('\n');
		const titleSplit: string[] = split[0].split('|');
		return {
			title: titleSplit[0],
			description: titleSplit.slice(1).join('\n'),
			body: split.slice(1).join('\n')
		};
	});

	onMount(() => {
		registerClick(model!, () => {
			open = true;
			store.controls!.unlockPointer();
		});
	});

	$effect(() => {
		store.visitingObject = open;
	})
</script>

<Dialog
	bind:open
	onOpenChange={(newOpen) => {
		if (!newOpen) store.controls?.lockPointer();
	}}
>
	<DialogContent
		class="flex max-w-[75%] flex-col"
		escapeKeydownBehavior="ignore"
		onOpenAutoFocus={(event) => event.preventDefault()}
	>
		<DialogTitle class="text-4xl">{content.title}</DialogTitle>
		<DialogDescription class="whitespace-pre text-wrap text-lg">
			{content.description}
		</DialogDescription>
		<div class="h-full">
			<ScrollArea class="h-full" type="always">
				<div
					class={cn('text mr-4 flex max-h-[65svh] flex-col gap-2 text-xl', className)}
					{...restProps}
				>
					{@html content.body}
				</div>
			</ScrollArea>
		</div>
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
