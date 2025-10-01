<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { invalidateAll } from '$app/navigation';
	let { data } = $props();
</script>

<div class="px-20">
	<h1>Go to <a href="/olympiads">Olympiads</a> to start using the website!</h1>
</div>
