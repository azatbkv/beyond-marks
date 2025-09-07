<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.olympiad_names as olympiad_name}
		<li>
			<a href="/olympiads/{data.subject_name.toLowerCase()}/{olympiad_name.toLowerCase()}"
				>{olympiad_name}</a
			>
		</li>
	{/each}
</ul>
