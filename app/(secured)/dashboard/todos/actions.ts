import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";

export function deleteTodo(id: Id<"todo">){
    return fetchMutation(api.todo.remove, { id});
}
export function shareTodo(id: Id<"todo">){
    return fetchMutation(api.todo.share, {
        id
    });
}

export function toggleComplete(id: Id<"todo">,  isCompleted: boolean){
    return fetchMutation(api.todo.toggleComplete, {id, isCompleted });
}
// const deleteTodo = useMutation(api.todo.remove);
// const shareTodo = useMutation(api.todo.share);
// const toggleComplete = useMutation(api.todo.toggleComplete);