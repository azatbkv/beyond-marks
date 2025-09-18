<script lang="ts">
	let { data } = $props();
</script>

<ul>
	{#each data.yearDates as yearDate}
		<li>
			<a href="/olympiads/{data.subjectName}/{data.olympiadName}/{yearDate}/1">{yearDate}</a>
		</li>
	{/each}
</ul>
