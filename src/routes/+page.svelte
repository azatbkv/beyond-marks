<script lang="ts">
    import problems from "$lib/assets/ipho2025v2.json";
    import {marked} from "marked";
    import markedKatex from "marked-katex-extension";

    marked.use(markedKatex({throwOnError: false}));

    let problem_id = $state("problem_1");
    // takes the number i from "problem_i"
    let problem_index = $derived(Number(problem_id[problem_id.length - 1]) - 1);
    let problem = $derived(problems[problem_index]);
</script>

<div role="tablist" class="tabs tabs-border">
    {#each problems as p}
        <input
            type="radio"
            class="tab"
            name="problem_tab"
            aria-label={p.id.replaceAll("_", " ").replace("p", "P")}
            value={p.id}
            bind:group={problem_id}
        />
    {/each}
</div>

<h1>{problem.name}</h1>
{#each problem.parts as part, part_index}
    <div class="flex justify-between">
        <h2>{@html marked.parse(part.id + ". " + part.description)}</h2>
    </div>
    {#each part.solution as paragraph}
        <p>{@html marked.parse(paragraph)}</p>
    {/each}
    {#each part.subparts as subpart, subpart_index}
        <div class="flex justify-between">
            <p>{@html marked.parse(part.id + "." + Number(subpart_index + 1) + ". " + subpart.description)}</p>
            <label>
                {subpart.marks}
                <input type="checkbox">
            </label>
        </div>
    {/each}
{/each}