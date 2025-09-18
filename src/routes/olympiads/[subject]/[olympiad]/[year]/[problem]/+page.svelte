<script lang="ts">
	import { marked } from 'marked';
	import markedKatex from 'marked-katex-extension';
	import type { PageProps } from '../$types';
	import type { PartWithSubs } from './+page.server';
	import type { Problem } from '$lib/server/db/schema';

	marked.use(markedKatex({ throwOnError: false }));

	let { data }: PageProps = $props();
	let problem: Problem & PartWithSubs = data.problem;
</script>

<div class="flex justify-between">
	<h1>{problem.name}</h1>
	{problem.maxPoints}
</div>
