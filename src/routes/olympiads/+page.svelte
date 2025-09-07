<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.subject_names as subject_name}
		<li><a href="/olympiads/{subject_name.toLowerCase()}">{subject_name}</a></li>
	{/each}
</ul>
