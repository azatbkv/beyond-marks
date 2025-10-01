<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button/index';

	async function loginWithGoogle() {
		await authClient.signIn.social(
			{
				provider: 'google',
				callbackURL: '/',
				errorCallbackURL: '/',
				newUserCallbackURL: '/'
			},
			{
				onSuccess: async () => {
					await goto('/');
				}
			}
		);
	}

	async function loginWithGithub() {
		await authClient.signIn.social(
			{
				provider: 'github',
				callbackURL: '/',
				errorCallbackURL: '/',
				newUserCallbackURL: '/'
			},
			{
				onSuccess: async () => {
					await goto('/');
				}
			}
		);
	}
</script>

<div class="mt-40 flex flex-col items-center justify-center">
	<h1 class="mb-4 text-xl font-semibold tracking-tight">Sign in to your account</h1>
	<h2 class="mb-8 text-sm text-neutral-600">Choose your preferred sign-in method</h2>
	<Button
		variant="outline"
		class="mb-4 w-80 cursor-pointer bg-emerald-500 hover:bg-emerald-600"
		onclick={loginWithGoogle}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="mr-2 h-4 w-4"
		>
			<circle cx="12" cy="12" r="10"></circle>
			<circle cx="12" cy="12" r="4"></circle>
			<line x1="21.17" y1="8" x2="12" y2="8"></line>
			<line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
			<line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
		</svg>
		Login with Google
	</Button>
	<Button
		variant="outline"
		class="w-80 cursor-pointer bg-neutral-800 text-neutral-100 hover:bg-neutral-700 hover:text-neutral-100"
		onclick={loginWithGithub}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="mr-2 h-4 w-4"
		>
			<path
				d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
			></path>
			<path d="M9 18c-4.51 2-5-2-7-2"></path>
		</svg>
		Login with GitHub
	</Button>
</div>
