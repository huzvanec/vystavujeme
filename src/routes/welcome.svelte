<script lang="ts">
	import {
		Dialog,
		DialogClose,
		DialogContent,
		DialogFooter,
		DialogHeader,
		DialogTitle
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { FootprintsIcon } from 'lucide-svelte';
	import CreditsDialog from './credits.svelte';
	import { store } from '$lib/scene-store.svelte.js';

	let { open: openProp }: { open: boolean } = $props();

	const open = $derived(openProp && !store.cursorLocked && !store.visitingObject);
</script>

<Dialog
	{open}
	onOpenChange={(newOpen) => {
		if (!newOpen) store.controls?.lockPointer();
	}}
>
	<DialogContent
		class="max-w-[60%]"
		escapeKeydownBehavior="ignore"
		onOpenAutoFocus={(event) => event.preventDefault()}
	>
		<DialogHeader>
			<DialogTitle class="text-4xl">
				Vítejte ve virtuální výstavě Čas zámořských objevů!
			</DialogTitle>
		</DialogHeader>
		<ul class="text-xl">
			<li>Otáčejte se pomocí myši.</li>
			<li>Pohybujte se pomocí kláves WASD nebo šipek.</li>
			<li>Kliknutím na vystavený předmět se dozvíte více informací.</li>
			<li>Pro uvolnění myši stiskněte klávesu Escape.</li>
		</ul>
		<DialogFooter>
			<CreditsDialog>
				<Button variant="outline">Autoři projektu</Button>
			</CreditsDialog>
			<DialogClose>
				<Button>
					<FootprintsIcon /> Procházet výstavu
				</Button>
			</DialogClose>
		</DialogFooter>
	</DialogContent>
</Dialog>
