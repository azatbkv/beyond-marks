<script lang="ts">
    import problems from "$lib/assets/ipho2025.json";
    import {marked} from "marked";
    import markedKatex from "marked-katex-extension";

    const options = {
        throwOnError: false
    };
    marked.use(markedKatex(options))

    let current_problem = $state("problem_1");
    let number_of_problems = $derived(problems.length);
    // number of the problem - 1
    let problem_index = $derived(Number(current_problem[current_problem.length - 1]) - 1);
    let problem = $derived(problems[problem_index]);
    let marks = [];
    for (const problem of problems) {
        const parts = [];
        for (const part of problem.parts) {
            const subparts = [];
            for (const subpart of part.subparts) {
                const subpartObject = {
                    marks: subpart.marks,
                    checked: false
                }
                subparts.push(subpartObject)
            }
            const partObject = {
                part_id: part.part_id,
                part_marks: 0,
                subparts: subparts
            }
            parts.push(partObject);
        }
        const problemObject = {
            problem_id: problem.id,
            problem_marks: 0,
            parts: parts
        }
        marks.push(problemObject);
    }
</script>

<div role="tablist" class="tabs tabs-border">
    {#each problems as problem}
        <input
            type="radio"
            class="tab"
            name="problem_tab"
            aria-label={problem.id.replaceAll("_", " ").replace("p", "P")}
            value={problem.id}
            bind:group={current_problem}
        />
    {/each}
</div>

<h1>{problem.name}</h1>
{#each problem.parts as part, part_index}
    <div class="flex justify-between">
        <h2>{@html marked.parse(part.part_id + ". " + part.description)}</h2>
        
    </div>
    {#each part.solution as paragraph}
        <p>{@html marked.parse(paragraph)}</p>
    {/each}
    {#each part.subparts as subpart, subpart_index}
        <div class="flex justify-between">
            <p>{@html marked.parse(subpart.description)}</p>
            <label>
                {subpart.marks}
                <input type="checkbox" bind:checked={marks[problem_index].parts[part_index].subparts[subpart_index].checked}>
            </label>
        </div>
    {/each}
{/each}