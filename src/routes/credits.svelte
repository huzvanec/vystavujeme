<script lang="ts">
	import {
		Dialog,
		DialogClose,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger
	} from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { XIcon } from 'lucide-svelte';
	import type { DialogTriggerProps } from 'bits-ui';
	import { ScrollArea } from '$lib/components/ui/scroll-area';

	const { ...restProps }: DialogTriggerProps = $props();
</script>

<Dialog>
	<DialogTrigger {...restProps} />
	<DialogContent
		onOpenAutoFocus={(event) => event.preventDefault()}
		class="w-[50%] min-w-[600px] max-w-full"
	>
		<DialogHeader>
			<DialogTitle class="text-4xl">Autoři</DialogTitle>
			<DialogDescription class="text-xl">
				Poděkování všem, kteří svým dílem přispěli na tomto projektu.
			</DialogDescription>
		</DialogHeader>
		<ScrollArea class="h-full" type="always">
			<div class="mr-4 flex max-h-[70svh] flex-col text-xl">
				<h1>Autoři textů</h1>
				<p>Jan Střítezský</p>
				<p>Jaroslav Žemlička</p>
				<p>Lukáš Janoštík</p>
				<p>Lukáš Javorek</p>
				<p>Matěj Hochman</p>
				<p>Michal Diviš</p>
				<p>Vilém Srb</p>
				<h1>Tvorba webových stránek</h1>
				<p>
					Lukáš Javorek (<a target="_blank" href="https://github.com/huzvanec/vystavujeme"
						>zdrojový kód</a
					>)
				</p>

				<div class="flex flex-col text-gray-400">
					<h1>Autoři modelů</h1>
					<p>Lukáš Javorek: Model úměrného kružidla se slunečními hodinami</p>
					<p>Lukáš Javorek: Model středověké církevní představy země</p>
					<a target="_blank" href="https://free3d.com/3d-model/frame-75994.html">
						3db7zan7: Model rámů obrazů
					</a>
					<a target="_blank" href="https://skfb.ly/oyuws">pgonarg: Model koně</a>
					<a target="_blank" href="https://skfb.ly/oMDtE">Breizh Iz Air: Model busty Marca Pola</a>
					<a target="_blank" href="https://skfb.ly/6WUnr">Teresa Nguyen: Model kompasu</a>
					<a target="_blank" href="https://www.turbosquid.com/3d-models/compasses-circle-244905">
						Stephan Friedrich: Model odpichovátka
					</a>
					<a target="_blank" href="https://grabcad.com/library/diptych-sundial-1">
						Bill: Model diptychových slunečních hodin
					</a>
					<a target="_blank" href="https://skfb.ly/ovswJ">
						Virtual Museums of Małopolska: Model astrolábu
					</a>
					<a target="_blank" href="https://skfb.ly/pqPCD">Rylae Shylna: Model dalekohledu</a>
					<a target="_blank" href="https://skfb.ly/6Zxnq">Zoltanfood: Model pepře</a>
					<a target="_blank" href="https://skfb.ly/E6ZY">mortaleiros: Model otroka</a>
					<a target="_blank" href="https://skfb.ly/o7DV6">
						Northern Heritage Network: Model lebky s příznaky syfilis
					</a>
					<a target="_blank" href="https://skfb.ly/6ysGB">dsv86: Model Inckého boha Virakočy</a>
					<a target="_blank" href="https://skfb.ly/DNOJ">artministry: Model kříže</a>
					<a target="_blank" href="https://skfb.ly/ov8UO">Matthew Collings: Model globusu</a>
					<a target="_blank" href="https://skfb.ly/6VKpL">e-sfera: Model lodi Santa Maria</a>

					<h1>Autoři textur</h1>
					<a
						target="_blank"
						href="https://www.britannica.com/animal/horse/Behaviour#/media/1/272156/11736"
					>
						Scott Smudsky: Foto koně
					</a>
					<a target="_blank" href="https://collections.library.yale.edu/catalog/2007580">
						Henricus Martellus Germanus: Mapa světa Kryštofa Kolumba
					</a>
					<a target="_blank" href="https://www.esbirky.cz/predmet/4571684">
						Národní muzeum: Textura kružidla
					</a>
					<a target="_blank" href="https://www.esbirky.cz/predmet/7256810">
						José María Velasco: Obraz Údolí Ciudad de México z hory Santa Isabel
					</a>
					<a target="_blank" href="https://onb.digital/result/BAG_7563820">
						Vinzenz Raimund Grüner: Podobizna Tadeáše Haenke
					</a>
					<p>Anthonis Mor: Podobizna Hernána Cortéze</p>
				</div>
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
	h1 {
		@apply mt-4 text-2xl font-bold;
	}
	a {
		@apply underline;
	}
</style>
