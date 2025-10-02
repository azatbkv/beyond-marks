export interface Subpart {
  marks: number;
  parentSubpartId: number;
  checked: boolean;
}
export interface Part {
  id: string;
  subparts: Subpart[];
}
export interface Problem {
  id: string;
  parts: Part[];
}
export interface Marks {
  problems: Problem[];
}
export function getTotalMarks(item: Part | Problem): number {
  if ('subparts' in item) {
    return item.subparts.reduce((total, subpart) => total + subpart.marks, 0);
  } else if ('parts' in item) {
    return item.parts.reduce((total, part) => total + getTotalMarks(part), 0);
  } else {
    return 0;
  }
}
export function getMarks(item: Part | Problem): number {
  if ('subparts' in item) {
    return item.subparts.reduce((total, subpart) => {
      return total + (subpart.checked ? subpart.marks : 0);
    }, 0);
  } else if ('parts' in item) {
    return item.parts.reduce((total, part) => total + getMarks(part), 0);
  } else {
    return 0;
  }
}
