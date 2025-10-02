<script lang="ts">
  import * as Card from '$lib/components/ui/card/index';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

  let { data } = $props();
</script>

<a
  href="./"
  class="absolute mx-10 mt-7 flex items-center text-xl text-indigo-500 decoration-1 hover:underline md:mx-20"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="mr-1 size-6"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
    />
  </svg>
  <span>Back</span>
</a>

<div class="mx-10 mt-12 md:mx-20">
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Page class="mb-8 pt-20 text-4xl font-semibold tracking-tight"
          >{data.subjectName}</Breadcrumb.Page
        >
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
  <h1 class="mb-4 text-2xl tracking-tight">Olympiads</h1>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 text-sm">
    {#each data.olympiadNames as olympiadName}
      <a href="{data.subjectName.toLowerCase()}/{olympiadName.toLowerCase()}">
        <Card.Root class="rounded-xs shadow-none hover:border-zinc-400">
          <Card.Content class="flex h-0 items-center justify-center">
            <span class="text-base">{olympiadName}</span>
          </Card.Content>
        </Card.Root>
      </a>
    {/each}
  </div>
</div>
