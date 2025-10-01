<script lang="ts">
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';
	import type { PartPoints, Problem } from '$lib/server/db/schema';
	import { beforeNavigate } from '$app/navigation';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import AccordionContent from '$lib/components/ui/accordion/accordion-content.svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	marked.use(markedKatex({ throwOnError: false }));

	let {
		data
	}: {
		data: {
			problem: Problem;
			userScore: { userId: string; problemId: number; problemPoints: number; scores: PartPoints[] };
			allProblems: { number: number; name: string }[];
		};
	} = $props();
	let problem: Problem = data.problem;
	let userScore: {
		userId: string;
		problemId: number;
		problemPoints: number;
		scores: PartPoints[];
	} = $state(data.userScore);
	let allProblems: { number: number; name: string }[] = data.allProblems;

	let isSaving = false;

	async function saveScores() {
		if (isSaving) return;
		isSaving = true;
		try {
			await fetch('/api/save', {
				method: 'POST',
				body: JSON.stringify(userScore),
				headers: {
					'Content-Type': 'application/json'
				},
				keepalive: true
			});
		} finally {
			isSaving = false;
		}
	}

	beforeNavigate(({ willUnload }) => {
		if (willUnload && !isSaving) {
			const blob = new Blob([JSON.stringify(userScore)], { type: 'application/json' });
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
		if (target.value === '') return;
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
		if (target.value === '') return;
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
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</svelte:head>

<Sidebar.Provider>
	<Sidebar.Root>
		<Sidebar.Header />
		<Sidebar.Content class="mx-2 mt-12">
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each allProblems as otherProblem}
							{#if otherProblem.number !== problem.number}
								<Sidebar.MenuItem>
									<a
										class="text-zinc-700 decoration-2 hover:underline"
										href="./{otherProblem.number}"
										data-sveltekit-reload
										>{otherProblem.number}. {otherProblem.name !== ''
											? otherProblem.name
											: `Problem ${otherProblem.number}`}</a
									>
								</Sidebar.MenuItem>
							{:else if problem.parts[0].number.length !== 0}
								<Collapsible.Root open class="group/collapsible">
									<Sidebar.MenuItem>
										<Collapsible.Trigger>
											<p class="font-semibold tracking-tight text-left">
												{otherProblem.number}. {otherProblem.name !== ''
													? otherProblem.name
													: `Problem ${otherProblem.number}`}
											</p>
										</Collapsible.Trigger>
										<Collapsible.Content>
											<Sidebar.MenuSub>
												{#each problem.parts as part, partIndex}
													<Sidebar.MenuSubItem class="justify-between flex">
														<a class="hover:underline decoration-2" href="#part-{part.number}">Part {part.number}.</a>
														<Badge variant="outline"
															>{userScore.scores[partIndex].obtainedPoints}/{part.maxPoints}</Badge
														>
													</Sidebar.MenuSubItem>
												{/each}
											</Sidebar.MenuSub>
										</Collapsible.Content>
									</Sidebar.MenuItem>
								</Collapsible.Root>
							{:else}
								<Sidebar.Item>
									<p class="font-semibold tracking-tight">
										{otherProblem.number}. {otherProblem.name !== ''
											? otherProblem.name
											: `Problem ${otherProblem.number}`}
									</p>
								</Sidebar.Item>
							{/if}
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		  <Sidebar.Separator />
		<Sidebar.Footer class="mx-2 my-4">
			<div class="justify-left flex">
				<Label class="text-xl">Points:</Label>
				<Badge class="ml-2 text-xl">{userScore.problemPoints}/{problem.maxPoints}</Badge>
			</div>
			{#if problem.maxPoints !== problem.weightedMaxPoints}
				<div class="justify-left flex">
					<Label class="text-xl">Weighted:</Label>
					<Badge class="ml-2 text-xl"
						>{((userScore.problemPoints * problem.weightedMaxPoints) / problem.maxPoints).toFixed(
							2
						)}/{problem.weightedMaxPoints}</Badge
					>
				</div>
			{/if}
		</Sidebar.Footer>
	</Sidebar.Root>
	<main>
		<div class="mx-5 mt-16">
			<div class="flex justify-between">
				<h1 class="mb-4 text-3xl">Problem {problem.number}. {problem.name}</h1>
			</div>
			{#each problem.parts as part, partIndex}
				<Card.Root class="my-4">
					<Accordion.Root id="part-{part.number}" class="mx-6 scroll-mt-12" type="single" value="1">
						<Accordion.Item value="item-1">
							<Accordion.Trigger class="cursor-pointer hover:no-underline">
								<Card.Title class="w-[150%] font-normal">
									<div class="items-top flex justify-between">
										<h3 class="text-lg flex-none max-w-[90%]">
											{@html marked.parse(
												`${part.number.length !== 0 ? part.number + '\\. ' : ''}${part.description}`
											)}
										</h3>
										<Badge class="flex-grow mx-4 md:mr-0 h-6 max-w-16 text-center text-md"
											>{userScore.scores[partIndex].obtainedPoints}/{part.maxPoints}</Badge
										>
									</div>
								</Card.Title>
							</Accordion.Trigger>
							<AccordionContent>
								<Card.Description class="mx-4 text-neutral-900 max-w-[100%]">
									<p class="text-md">{@html marked.parse(part.solution)}</p>
								</Card.Description>
							</AccordionContent>
						</Accordion.Item>
					</Accordion.Root>
					<hr />
					<Card.Content class="space-y-2">
						{#each part.subparts as subpart, subpartIndex}
							<div class="flex justify-between">
								<p>
									{@html marked.parse(
										`${part.number.length !== 0 ? part.number + '\\.' : ''}${Number(subpartIndex + 1)}\\. ${subpart.description}`
									)}
								</p>
								<div class="flex items-center space-x-2">
									<Label>
										{subpart.points}
									</Label>
									{#if subpart.type === 'closed'}
										<Checkbox
											class="ml-2 h-6 w-6 cursor-pointer"
											disabled={childSubpartsUsed(partIndex, subpartIndex)}
											checked={userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints ===
												subpart.points}
											onCheckedChange={() =>
												updateClosedSubpart(partIndex, subpartIndex, subpart.points)}
										/>
									{:else if subpart.type === 'open'}
										<Input
											class="rounded-small ml-2 h-6 w-14 text-center"
											type="numeric"
											disabled={childSubpartsUsed(partIndex, subpartIndex)}
											value={userScore.scores[partIndex].subparts[subpartIndex].obtainedPoints}
											oninput={(event) =>
												updateOpenSubpart(partIndex, subpartIndex, subpart.points, event)}
										/>
									{/if}
								</div>
							</div>
							{#each subpart.childSubparts as childSubpart, childSubpartIndex}
								<div class="flex justify-between">
									<p>
										{@html marked.parse(
											`${part.number.length !== 0 ? part.number + '\\.' : ''}${Number(subpartIndex + 1)}\\.${Number(childSubpartIndex + 1)}\\. ${childSubpart.description}`
										)}
									</p>
									<div class="flex items-center space-x-2">
										<Label>
											{childSubpart.points}
										</Label>
										{#if childSubpart.type === 'closed'}
											<Checkbox
												class="ml-2 h-6 w-6 cursor-pointer"
												disabled={userScore.scores[partIndex].subparts[subpartIndex]
													.obtainedPoints > 0 && childSubpart.points > 0}
												checked={userScore.scores[partIndex].subparts[subpartIndex].childSubparts[
													childSubpartIndex
												].obtainedPoints === childSubpart.points}
												onCheckedChange={() =>
													updateClosedChildSubpart(
														partIndex,
														subpartIndex,
														childSubpartIndex,
														childSubpart.points
													)}
											/>
										{:else}
											<Input
												class="rounded-small ml-2 h-6 w-12 text-center"
												type="numeric"
												disabled={userScore.scores[partIndex].subparts[subpartIndex]
													.obtainedPoints > 0 && childSubpart.points > 0}
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
									</div>
								</div>
							{/each}
						{/each}
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</main>
</Sidebar.Provider>
