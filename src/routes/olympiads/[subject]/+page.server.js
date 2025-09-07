import { error } from '@sveltejs/kit';

export async function load({ fetch, params }) {
    const res = await fetch("/olympiads/olympiads.json");
    const subjects = await res.json();
    const subject = subjects.find((subject) => subject.name.toLowerCase() === params.subject);
    if (!subject) error(404);
    return {
        subject_name: subject.name,
        olympiad_names: subject.olympiads.map(olympiad => olympiad.name)
    };
}