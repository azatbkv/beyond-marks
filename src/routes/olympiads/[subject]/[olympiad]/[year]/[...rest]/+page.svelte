<script lang="ts">
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';
	import type { PartPoints, Problem } from '$lib/server/db/schema';
	import { beforeNavigate } from '$app/navigation';

	marked.use(markedKatex({ throwOnError: false }));

	let {
		data
	}: {
		data: {
			problem: Problem;
			userScore: { userId: string, problemId: number, problemPoints: number; scores: PartPoints[] };
			allProblems: { number: number; name: string }[];
		};
	} = $props();
	let problem: Problem = data.problem;
	let userScore: { userId: string, problemId: number, problemPoints: number; scores: PartPoints[] } = $state(data.userScore);
	let allProblems: { number: number; name: string }[] = data.allProblems;

	let isSaving = false;

	async function saveScores() {
		if (isSaving) return;
		isSaving = true;
		try { await fetch('/api/save', {
			method: 'POST',
			body: JSON.stringify(userScore),
			headers: {
				'Content-Type': 'application/json'
			},
			keepalive: true
		}) } finally {
			isSaving = false;
		}
	}
	
	beforeNavigate(({ willUnload }) => {
		if (willUnload && !isSaving) {
			const blob = new Blob([JSON.stringify(userScore)], {type: 'application/json'});
			navigator.sendBeacon('/api/save', blob);
		} else if (!isSaving) {
			saveScores();
		}
	});

	function updateClosedSubpart(partIndex: number, subpartIndex: number, maxPoints: number) {
		const part = userScore.scores[partIndex];
		const subpart = part.subparts[subpartIndex];
		const initialPoints = subpart.obtainedPoints;
		for (let i = 0; i < subpart.childSubparts.length; i++) {
			if (subpart.childSubparts[i].obtainedPoints !== 0) return;
		}
		if (initialPoints === maxPoints) {
			subpart.obtainedPoints = 0;
		} else {
			subpart.obtainedPoints = maxPoints;
		}
		const changeInPoints = subpart.obtainedPoints - initialPoints;
		part.obtainedPoints = cleanNumber(part.obtainedPoints + changeInPoints);
		userScore.problemPoints = cleanNumber(userScore.problemPoints + changeInPoints);
	}

	function updateClosedChildSubpart(
		partIndex: number,
		subpartIndex: number,
		childSubpartIndex: number,
		maxPoints: number
	) {
		const part = userScore.scores[partIndex];
		const subpart = part.subparts[subpartIndex];
		const childSubpart = subpart.childSubparts[childSubpartIndex];
		const initialPoints = childSubpart.obtainedPoints;
		if (subpart.obtainedPoints !== 0 && maxPoints > 0) return;
		if (initialPoints === maxPoints) {
			childSubpart.obtainedPoints = 0;
		} else {
			childSubpart.obtainedPoints = maxPoints;
		}
		const changeInPoints = childSubpart.obtainedPoints - initialPoints;
		part.obtainedPoints = cleanNumber(part.obtainedPoints + changeInPoints);
		userScore.problemPoints = cleanNumber(userScore.problemPoints + changeInPoints);
	}

	function updateOpenSubpart(
		partIndex: number,
		subpartIndex: number,
		maxPoints: number,
		event: Event
	) {
		const part = userScore.scores[partIndex];
		const subpart = part.subparts[subpartIndex];
		const initialPoints = subpart.obtainedPoints;
		const target = event.target as HTMLInputElement;
		let newPoints;
		try {
			newPoints = parseFloat(target.value);
		} catch {
			target.value = initialPoints.toString();
			return;
		}
		if (newPoints > Math.abs(maxPoints)) {
			target.value = initialPoints.toString();
			return;
		}
		subpart.obtainedPoints = newPoints;
		const changeInPoints = subpart.obtainedPoints - initialPoints;
		part.obtainedPoints = cleanNumber(part.obtainedPoints + changeInPoints);
		userScore.problemPoints = cleanNumber(userScore.problemPoints + changeInPoints);
	}

	function updateOpenChildSubpart(
		partIndex: number,
		subpartIndex: number,
		childSubpartIndex: number,
		maxPoints: number,
		event: Event
	) {
		const part = userScore.scores[partIndex];
		const subpart = part.subparts[subpartIndex];
		const childSubpart = subpart.childSubparts[childSubpartIndex];
		const initialPoints = childSubpart.obtainedPoints;
		const target = event.target as HTMLInputElement;
		if (subpart.obtainedPoints !== 0 && maxPoints > 0) {
			target.value = initialPoints.toString();
			return;
		}
		let newPoints;
		try {
			newPoints = parseFloat(target.value);
		} catch {
			target.value = initialPoints.toString();
			return;
		}
		if (newPoints > Math.abs(maxPoints)) {
			target.value = initialPoints.toString();
			return;
		}
		childSubpart.obtainedPoints = newPoints;
		const changeInPoints = childSubpart.obtainedPoints - initialPoints;
		part.obtainedPoints = cleanNumber(part.obtainedPoints + changeInPoints);
		userScore.problemPoints = cleanNumber(userScore.problemPoints + changeInPoints);
	}

	function childSubpartsUsed(partIndex: number, subpartIndex: number): boolean {
		const part = userScore.scores[partIndex];
		const subpart = part.subparts[subpartIndex];
		for (let i = 0; i < subpart.childSubparts.length; i++) {
			if (subpart.childSubparts[i].obtainedPoints > 0) return true;
		}
		return false;
	}

	// to get rid of floating point inaccuracy
	function cleanNumber(number: number, digits = 5): number {
		return parseFloat(number.toFixed(digits));
	}

	// 0.1 => 0.1, 2 => 2.0, but 0.15 => 0.15
	function truncateNumber(number: number): string {
		const result = number.toFixed(2);
		return result.endsWith('0') ? parseFloat(result).toFixed(1) : result;
	}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</svelte:head>
<hr />
{#each allProblems as otherProblem}
	<ol>
		{#if otherProblem.number !== problem.number}
			<li>
				<a href="./{otherProblem.number}" data-sveltekit-reload
					>Problem {otherProblem.number}. {otherProblem.name}</a
				>
			</li>
		{:else}
			<li>
				<p>Problem {otherProblem.number}. {otherProblem.name}</p>
			</li>
		{/if}
	</ol>
{/each}

<hr />

<div class="flex justify-between">
	<h1>{problem.name}</h1>
	{truncateNumber(userScore.problemPoints)}/{truncateNumber(problem.maxPoints)}
</div>

<hr />

{#each problem.parts as part, partIndex}
	<div class="flex justify-between">
		<h2>{@html marked.parse(`${part.number}\\. ${part.description}`)}</h2>
		{truncateNumber(userScore.scores[partIndex].obtainedPoints)}/{truncateNumber(part.maxPoints)}
	</div>
	<p>{@html marked.parse(part.solution)}</p>
	{#each part.subparts as subpart, subpartIndex}
		<div class="flex justify-between">
			<p>
				{@html marked.parse(
					`${part.number}\\.${Number(subpartIndex + 1)}\\. ${subpart.description}`
				)}
			</p>
			{#if subpart.type === 'closed'}
				<label>
					{truncateNumber(
						userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints
					)}/{truncateNumber(subpart.points)}
					<input
						type="checkbox"
						disabled={childSubpartsUsed(partIndex, subpartIndex)}
						checked={userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints ===
							subpart.points}
						onchange={() => updateClosedSubpart(partIndex, subpartIndex, subpart.points)}
					/>
				</label>
			{:else if subpart.type === 'open'}
				<label>
					{truncateNumber(
						userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints
					)}/{truncateNumber(subpart.points)}
					<input
						type="number"
						disabled={childSubpartsUsed(partIndex, subpartIndex)}
						value={userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints}
						oninput={(event) => updateOpenSubpart(partIndex, subpartIndex, subpart.points, event)}
					/>
				</label>
			{/if}
		</div>
		<div class="flex justify-between">
			{#each subpart.childSubparts as childSubpart, childSubpartIndex}
				<p>
					{@html marked.parse(
						`${part.number}\\.${Number(subpartIndex + 1)}\\.${Number(childSubpartIndex + 1)}\\. ${childSubpart.description}`
					)}
				</p>
				{#if childSubpart.type === 'closed'}
					<label>
						{truncateNumber(
							userScore.scores[partIndex].subparts[subpartIndex].childSubparts[childSubpartIndex]
								.obtainedPoints
						)}/{truncateNumber(childSubpart.points)}
						<input
							type="checkbox"
							disabled={userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints > 0 &&
								childSubpart.points > 0}
							checked={userScore.scores[partIndex].subparts[subpartIndex].childSubparts[
								childSubpartIndex
							].obtainedPoints === childSubpart.points}
							onchange={() =>
								updateClosedChildSubpart(
									partIndex,
									subpartIndex,
									childSubpartIndex,
									childSubpart.points
								)}
						/>
					</label>
				{:else}
					{truncateNumber(
						userScore.scores[partIndex].subparts[subpartIndex].childSubparts[childSubpartIndex]
							.obtainedPoints
					)}/{truncateNumber(childSubpart.points)}
					<input
						type="number"
						disabled={userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints > 0 &&
							childSubpart.points > 0}
						value={userScore.scores[partIndex].subparts[subpartIndex].childSubparts[
							childSubpartIndex
						].obtainedPoints}
						oninput={(event) =>
							updateOpenChildSubpart(
								partIndex,
								subpartIndex,
								childSubpartIndex,
								subpart.points,
								event
							)}
					/>
				{/if}
			{/each}
		</div>
	{/each}
	<hr />
{/each}
