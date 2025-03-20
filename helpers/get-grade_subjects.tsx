import { api } from "@/convex/_generated/api";
import {
  preloadQuery,
  preloadedQueryResult,
} from "convex/nextjs";
export async function getGrades() {
  // const grades = useQuery(api.grade.list);
  const grades = preloadedQueryResult(await preloadQuery(api.grade.list));
  return grades;
}

export async function getSubjects() {
  // const subject = useQuery(api.subject.list);
  const subjects = preloadedQueryResult(await preloadQuery(api.subject.list));
  return subjects;
}
