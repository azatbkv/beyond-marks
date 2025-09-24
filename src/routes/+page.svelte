<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { invalidateAll } from '$app/navigation';
	let { data } = $props();
</script>

{#if data.user}
	<img src={data.user.image} alt={data.user.name} />
	Hello {data.user.name}

	<button
		onclick={async () => {
			await authClient.signOut();
			invalidateAll();
		}}
	>
		Sign Out
	</button>
{:else}
	<a href="/login">Login</a>
{/if}
