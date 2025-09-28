<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.subjectNames as subjectName}
		<li><a href="/olympiads/{subjectName.toLowerCase()}">{subjectName}</a></li>
	{/each}
</ul>
