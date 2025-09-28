<script lang="ts">
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<form method="POST" use:enhance enctype="multipart/form-data">
	<div>
		<label for="subject">Subject</label>
		<input id="subject" type="text" name="subject" required />
	</div>
	<div>
		<label for="olympiad">Olympiad</label>
		<input id="olympiad" type="text" name="olympiad" required />
	</div>
	<div>
		<label for="year">Year</label>
		<input id="year" type="number" name="year" required />
	</div>
	<div>
		<label for="grade">Grade</label>
		<input id="grade" type="number" name="grade" />
	</div>
	<div>
		<label for="file">JSON file</label>
		<input id="file" type="file" name="file" required />
	</div>
	<button type="submit">Upload</button>
</form>

{#if form?.error}
	<p>{form.error}</p>
{/if}
