export async function load({ platform, params }) {
	const problems_path =
		'/olympiads/' + params.subject + '/' + params.olympiad + '/' + params.year + '.json';
	const result = await platform?.env.ASSETS.fetch(problems_path);
	const problems = result?.json();
	return {
		problems
	};
}
