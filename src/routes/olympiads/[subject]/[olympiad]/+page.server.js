import { error } from '@sveltejs/kit';
import subjects from "$lib/assets/olympiads.json";

export function load({ params }) {
    const subject = subjects.find((subject) => subject.name.toLowerCase() === params.subject);
    if (!subject) error(404);
    const olympiad = subject.olympiads.find((olympiad) => olympiad.name.toLowerCase() === params.olympiad);
    if (!olympiad) error(404);
    return {
        subject_name: subject.name,
        olympiad_name: olympiad.name,
        year_names: olympiad.years.map(year => year.year)
    };
}