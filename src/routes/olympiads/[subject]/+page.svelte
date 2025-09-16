<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.olympiadNames as olympiadName}
		<li>
			<a href="/olympiads/{data.subjectName}/{olympiadName.toLowerCase()}">{olympiadName}</a>
		</li>
	{/each}
</ul>
