<script lang="ts">
	import type { Subpart, Part, Problem, Marks } from './marks.ts';
	import { getTotalMarks, getMarks } from './marks.ts';
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';

	marked.use(markedKatex({ throwOnError: false }));

	let { data } = $props();
	const problems = data.problems;

	let problem_index = $state(0);
	let problem = $derived(problems[problem_index]);

	let marks: Marks = $state({ problems: [] });
	for (let problem of problems) {
		let problem_object: Problem = { id: problem.id, parts: [] };
		for (let part of problem.parts) {
			let part_object: Part = { id: part.id, subparts: [] };
			for (let subpart of part.subparts) {
				let subpart_object: Subpart = { marks: subpart.marks, checked: false };
				part_object.subparts.push(subpart_object);
			}
			problem_object.parts.push(part_object);
		}
		marks.problems.push(problem_object);
	}

	function truncateNumber(num: number): string {
		const s = String(Math.round(num * 100) / 100);
		const parts = s.split('.');
		if (parts.length === 1 || parts[1].length <= 1) {
			return num.toFixed(1);
		} else {
			return num.toFixed(2);
		}
	}
</script>

<div>
	{#each problems as p, p_index}
		<input
			type="radio"
			name="problem_tab"
			aria-label={p.id.replaceAll('_', ' ').replace('p', 'P')}
			value={p_index}
			bind:group={problem_index}
		/>
	{/each}
</div>

<div class="flex justify-between">
	<h1>{problem.name}</h1>
	{truncateNumber(getMarks(marks.problems[problem_index]))}/{truncateNumber(
		getTotalMarks(marks.problems[problem_index])
	)}
</div>
{#each problem.parts as part, part_index}
	<div class="mt-4 flex justify-between">
		<h2>{@html marked.parse(part.id + '. ' + part.description)}</h2>
		{truncateNumber(getMarks(marks.problems[problem_index].parts[part_index]))}/{truncateNumber(
			getTotalMarks(marks.problems[problem_index].parts[part_index])
		)}
	</div>
	{#each part.solution as paragraph}
		<p>{@html marked.parse(paragraph)}</p>
	{/each}
	{#each part.subparts as subpart, subpart_index}
		<div class="flex justify-between">
			<p>
				{@html marked.parse(part.id + '.' + Number(subpart_index + 1) + '. ' + subpart.description)}
			</p>
			<label>
				{subpart.marks}
				<input
					type="checkbox"
					bind:checked={
						marks.problems[problem_index].parts[part_index].subparts[subpart_index].checked
					}
				/>
			</label>
		</div>
	{/each}
{/each}
