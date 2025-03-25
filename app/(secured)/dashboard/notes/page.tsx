import { api } from "@/convex/_generated/api";
import NotesPageClient from "./page-client";
import {
    preloadQuery,
    preloadedQueryResult,
  } from "convex/nextjs";

export default async function NotesPage() {

    const notes = preloadedQueryResult(await preloadQuery(api.notes.list));
 return <NotesPageClient notes={notes}/>
}