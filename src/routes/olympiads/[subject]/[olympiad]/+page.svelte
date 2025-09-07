<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.year_names as year_name}
		<li>
			<a
				href="/olympiads/{data.subject_name.toLowerCase()}/{data.olympiad_name.toLowerCase()}/{year_name}"
				>{year_name}</a
			>
		</li>
	{/each}
</ul>
