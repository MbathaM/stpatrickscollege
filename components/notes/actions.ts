import { api } from "@/convex/_generated/api";
import { DataModel, Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";

// type Notes = DataModel["note"]["document"];
export function createNote(data: any, userId: Id<"profile">) {
  return fetchMutation(api.notes.create, {
    title: data.title,
    content: data.content,
    userId,
    color: data.color,
    tags: data.tags,
    isShared: false,
  });
}
export function updateNote(data: any, id: Id<"note">) {
  return fetchMutation(api.notes.update, {
    id,
    title: data.title,
    content: data.content,
    color: data.color,
    tags: data.tags,
  });
}

// const createNote = useMutation(api.notes.create);
// const updateNote = useMutation(api.notes.update);
