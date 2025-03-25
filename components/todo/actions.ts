import { api } from "@/convex/_generated/api";
import { DataModel, Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";

// type Notes = DataModel["note"]["document"];
export function createTodo(data: any, userId: Id<"profile">) {
  return fetchMutation(api.todo.create, {
    title: data.title,
    description: data.description,
    userId,
    dueDate: data.dueDate,
    priority: data.priority,
    relatedSubjectId: data.relatedSubjectId,
    isShared: false,
  });
}
export function updateTodo(data: any, id: Id<"todo">) {
  return fetchMutation(api.todo.update, {
    id,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    relatedSubjectId: data.relatedSubjectId,
  });
}

// const createTodo = useMutation(api.todo.create);
// const updateTodo = useMutation(api.todo.update);
