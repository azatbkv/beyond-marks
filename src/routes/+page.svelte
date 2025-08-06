<script lang="ts">
    import solutions from "$lib/assets/ipho2025.json";

    let current_problem = $state("problem_1");
    // number of the problem - 1
    let current_problem_index = $derived(Number(current_problem[current_problem.length - 1]) - 1);
    let problem = $derived(solutions[current_problem_index]);
</script>

<h1>{problem.name}</h1>
{#each problem.parts as part}
    <h2>{part.part_id}. {part.description}</h2>
    {#each part.solution as paragraph}
        <p>{paragraph}</p>
    {/each}
    {#each part.subparts as subpart}
        <p>{subpart.description}</p>
        <label>
            <input type="checkbox">
            {subpart.marks}
        </label>
    {/each}
{/each}