import subjects from "$lib/assets/olympiads.json"

export function load() {
    return { subject_names: subjects.map(subject => subject.name) };
}