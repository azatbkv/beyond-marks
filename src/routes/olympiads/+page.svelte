<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';
	let { data } = $props();
</script>

<div class="px-20">
	<h1 class="mt-20 mb-4 text-4xl font-semibold">Olympiads</h1>
	<h2 class="mb-16 text-xl text-neutral-600">Past olympiads with solutions and mark schemes</h2>
	<h3 class="text-2xl mb-4">Subjects</h3>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 text-sm">
		{#each data.subjectNames as subjectName}
			<a href="/olympiads/{subjectName.toLowerCase()}">
				<Card.Root class="rounded-xs shadow-none hover:border-zinc-400">
					<Card.Content class="flex justify-center items-center h-0">
						<span>{subjectName}</span>
					</Card.Content>
				</Card.Root>
			</a>
		{/each}
	</div>
</div>
