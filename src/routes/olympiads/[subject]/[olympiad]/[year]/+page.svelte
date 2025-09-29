<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.grades as grade}
		<li>
			<a href="/olympiads/{data.subjectName}/{data.olympiadName}/{data.yearDate}/{grade}/1"
				>{grade}</a
			>
		</li>
	{/each}
</ul>
