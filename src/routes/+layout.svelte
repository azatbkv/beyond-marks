<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index';
	import * as Avatar from '$lib/components/ui/avatar/index';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
	import { authClient } from '$lib/auth-client';
	import { goto, invalidateAll } from '$app/navigation';
	const session = authClient.useSession();

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="fixed top-0 z-50 flex h-12 w-full items-center justify-end border-b-1 bg-zinc-50">
	<NavigationMenu.Root>
		<NavigationMenu.List>
			<NavigationMenu.Item class="pr-12">
				<NavigationMenu.Link href="/olympiads" class="text-base hover:bg-indigo-50">
					Olympiads
				</NavigationMenu.Link>
			</NavigationMenu.Item>
			{#if $session.data}
				<NavigationMenu.Item class="pr-4">
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Avatar.Root>
								<Avatar.Image src={$session.data.user.image} alt="User avatar" />
								<Avatar.Fallback>{$session.data.user.name.charAt(0)}</Avatar.Fallback>
							</Avatar.Root>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Label>{$session.data.user.name}</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item
									class="cursor-pointer"
									onSelect={async () => {
										await authClient.signOut({
											fetchOptions: {
												onRequest: async () => {},
												onSuccess: async () => {
													await goto('/login');
													invalidateAll();
												}
											}
										});
									}}
								>
									Log Out
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				</NavigationMenu.Item>
			{:else}
				<NavigationMenu.Item class="pr-4">
					<NavigationMenu.Link href="/login" class="text-base hover:bg-indigo-50">
						Login
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			{/if}
		</NavigationMenu.List>
	</NavigationMenu.Root>
</nav>

{@render children?.()}
