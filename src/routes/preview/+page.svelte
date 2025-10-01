<script lang="ts">
	import type { Subpart, Part, Problem, Marks } from './marks';
	import { getTotalMarks, getMarks } from './marks';
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';

	marked.use(markedKatex({ throwOnError: false }));

	let problems: any = $state(null);
	let marks: Marks = $state({ problems: [] });

	async function handleFile(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];
		if (!(file instanceof File)) {
			problems = { error: 'bad file' };
			return;
		}
		try {
			const fileText = await file.text();
			problems = JSON.parse(fileText);
		} catch {
			problems = { error: 'invalid json' };
		}
		marks = { problems: [] };
		for (let problem of problems) {
			let problem_object: Problem = { id: String(problem.number), parts: [] };
			for (let part of problem.parts) {
				let part_object: Part = { id: part.number, subparts: [] };
				for (let subpart of part.subparts) {
					let subpart_object: Subpart = {
						marks: subpart.points,
						parentSubpartId: subpart.parentSubpartId,
						checked: false
					};
					part_object.subparts.push(subpart_object);
				}
				problem_object.parts.push(part_object);
			}
			marks.problems.push(problem_object);
		}
	}

	let problem_index = $state(0);
	let problem = $derived(problems ? problems[problem_index] : null);

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

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</svelte:head>

<div class="mt-12">
	<input type="file" accept="application/json" onchange={handleFile} />

	{#if problems}
		<div>
			{#each problems as p, p_index}
				<input
					type="radio"
					name="problem_tab"
					aria-label={'Problem ' + p.number}
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
				<h2>
					{@html marked.parse(
						`${part.number.length !== 0 ? part.number + '\\. ' : ''}${part.description}`
					)}
				</h2>
				{truncateNumber(getMarks(marks.problems[problem_index].parts[part_index]))}/{truncateNumber(
					getTotalMarks(marks.problems[problem_index].parts[part_index])
				)}
			</div>
			<p>{@html marked.parse(part.solution)}</p>
			{#each part.subparts as subpart, subpartIndex}
				<div class="flex justify-between">
					<p>
						{@html marked.parse(
							`${part.number.length !== 0 ? part.number + '\\.' : ''}${Number(subpartIndex + 1)}\\. ${subpart.description}`
						)}
					</p>
					{#if subpart.type === 'closed'}
						<label>
							{subpart.points}
							<input
								type="checkbox"
								bind:checked={
									marks.problems[problem_index].parts[part_index].subparts[subpartIndex].checked
								}
							/>
						</label>
					{:else}
						{subpart.points}
						<input type="number" />
					{/if}
					{#each subpart.childSubparts as childSubpart, childSubpartIndex}
						<p>
							child
							{@html marked.parse(
								part.number +
									'.' +
									Number(subpartIndex + 1) +
									'.' +
									Number(childSubpartIndex + 1) +
									'. ' +
									childSubpart.description
							)}
						</p>
						{#if subpart.type === 'closed'}
							<label>
								{subpart.points}
								<input
									type="checkbox"
									bind:checked={
										marks.problems[problem_index].parts[part_index].subparts[subpartIndex].checked
									}
								/>
							</label>
						{:else}
							{subpart.points}
							<input type="number" />
						{/if}
					{/each}
				</div>
			{/each}
		{/each}
	{/if}
</div>
