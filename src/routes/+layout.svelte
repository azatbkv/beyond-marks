<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import * as NavigationMenu from '$lib/components/ui/navigation-menu/index';
  import * as Avatar from '$lib/components/ui/avatar/index';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index';
  import { HamburgerMenuIcon } from '@radix-ui/react-icons';
  import { authClient } from '$lib/auth-client';
  import { goto, invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  const session = authClient.useSession();

  let { children } = $props();
  let isMobileSidebarOpen = $state(false);
  
  // Function to check if screen is mobile
  let isMobile = $state(false);
  
  onMount(() => {
    const checkMobile = () => {
      isMobile = window.innerWidth < 768; // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="fixed top-0 z-50 flex h-12 w-full items-center justify-between border-b-1 bg-zinc-50 px-4">
  <div class="md:hidden">
    <button 
      class="p-2 rounded-md hover:bg-zinc-100"
      on:click={() => {
        // Dispatch event to toggle sidebar in the page component
        document.dispatchEvent(new CustomEvent('toggleMobileSidebar'));
      }}
      aria-label="Toggle sidebar"
    >
      <HamburgerMenuIcon class="w-5 h-5" />
    </button>
  </div>
  <div class="flex-1 flex justify-center">
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item class="pr-12">
          <NavigationMenu.Link href="/olympiads" class="text-base hover:bg-indigo-50">
            Olympiads
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>
  <div>
    {#if $session.data}
      <NavigationMenu.Item class="pr-4">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger class="cursor-pointer">
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
  </div>
</nav>

{@render children?.()}
