<script lang="ts">
	import * as Card from '$lib/components/ui/card/index';

	let { data } = $props();
</script>

<a href="./" class="flex items-center px-20 mt-7 absolute text-indigo-500 text-xl hover:underline decoration-1">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 mr-1">
  		<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
	</svg>
	<span>Back</span>
</a>

<div class="px-20">
	<h1 class="mt-20 mb-8 text-4xl font-semibold flex items-center">
		<span>{data.subjectName}</span>
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 mx-2">
  			<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
		</svg>
		<span>{data.olympiadName}</span>
	</h1>

	<h3 class="text-2xl mb-4">Years</h3>
	<div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 text-sm">
		{#each data.yearDates as yearDate}
			<a href="{data.olympiadName.toLowerCase()}/{yearDate}">
				<Card.Root class="rounded-xs shadow-none hover:border-zinc-400">
					<Card.Content class="flex justify-center items-center h-0">
						<span>{yearDate}</span>
					</Card.Content>
				</Card.Root>
			</a>
		{/each}
	</div>
</div>

