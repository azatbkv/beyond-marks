<script lang="ts">
  import * as Card from '$lib/components/ui/card/index';
  import * as Breadcrumb from '$lib/components/ui/breadcrumb/index';

  let { data } = $props();
</script>

<div class="mx-10 mt-12 md:mx-20">
  <Breadcrumb.Root>
    <Breadcrumb.List class="mb-8 pt-20">
      <Breadcrumb.Item>
        <Breadcrumb.Link
          class="text-4xl text-zinc-700 decoration-2 hover:underline"
          href="/olympiads/{data.subjectName.toLowerCase()}">{data.subjectName}</Breadcrumb.Link
        >
      </Breadcrumb.Item>
      <Breadcrumb.Separator />

      <Breadcrumb.Item>
        <Breadcrumb.Page class="text-4xl font-semibold tracking-tight"
          >{data.olympiadName}</Breadcrumb.Page
        >
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>

  <h1 class="mb-4 text-2xl tracking-tight">Years</h1>
  <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 text-sm">
    {#each data.yearDates as yearDate}
      <a href="{data.olympiadName.toLowerCase()}/{yearDate}">
        <Card.Root class="rounded-xs shadow-none hover:border-zinc-400">
          <Card.Content class="flex h-0 items-center justify-center">
            <span class="text-base">{yearDate}</span>
          </Card.Content>
        </Card.Root>
      </a>
    {/each}
  </div>
</div>
