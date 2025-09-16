<script lang="ts">
	import type { PageProps } from '../$types';

	let { data }: PageProps = $props();
</script>

<ul>
	{#each data.subjectNames as subjectName}
		<li><a href="/olympiads/{subjectName.toLowerCase()}">{subjectName}</a></li>
	{/each}
</ul>
