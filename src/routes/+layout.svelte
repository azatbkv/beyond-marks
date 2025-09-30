<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import * as NavigationMenu from "$lib/components/ui/navigation-menu/index";

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav class="w-full bg-zinc-50 h-16 border-b-1 flex items-center justify-end pr-12">
<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item>
        <NavigationMenu.Link class="text-base hover:bg-indigo-50">
			<a href="/olympiads">Olympiads</a>
		</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root></nav>

{@render children?.()}
