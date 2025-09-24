<script lang="ts">
	import { authClient } from '$lib/auth-client';

	async function loginWithGoogle() {
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/',
			errorCallbackURL: '/',
			newUserCallbackURL: '/'
		});
	}
</script>

<button onclick={loginWithGoogle}> Login with Google </button>
