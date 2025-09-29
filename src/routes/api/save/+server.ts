import { userScores, type PartPoints } from '$lib/server/db/schema.js';
import { error, json } from '@sveltejs/kit';

export async function POST({ request, locals }) {
	if (!locals.user) throw error(401, 'unauthorized');
	const authenticatedUserId = locals.user.id;
	const data: { userId: string; problemId: number; problemPoints: number; scores: PartPoints[] } =
		await request.json();
	if (authenticatedUserId !== data.userId) throw error(401, 'unauthorized');
	try {
		await locals.db
			.insert(userScores)
			.values(data)
			.onConflictDoUpdate({
				target: [userScores.problemId, userScores.userId],
				set: { problemPoints: data.problemPoints, scores: data.scores }
			});
		return json({ success: true });
	} catch (error) {
		console.error('failed to save scores', error);
		return json({ success: false }, { status: 500 });
	}
}
