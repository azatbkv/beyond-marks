import { error } from '@sveltejs/kit';
import subjects from "$lib/assets/olympiads.json";

export function load({ params }) {
    const subject = subjects.find((subject) => subject.name.toLowerCase() === params.subject);
    if (!subject) error(404);
    return {
        subject_name: subject.name,
        olympiad_names: subject.olympiads.map(olympiad => olympiad.name)
    };
}