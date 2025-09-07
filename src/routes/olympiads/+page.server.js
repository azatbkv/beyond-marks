export async function load({ fetch }) {
    const res = await fetch("/olympiads/olympiads.json");
    const subjects = await res.json();
    return { subject_names: subjects.map(subject => subject.name) };
}