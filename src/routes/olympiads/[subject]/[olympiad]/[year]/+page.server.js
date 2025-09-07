export async function load({ fetch, params }) {
    const problems_path = "/olympiads/" + params.subject + "/" + params.olympiad + "/" + params.year + ".json";
    const res = await fetch(problems_path);
    const problems = await res.json();
    return {
        problems
    };
}