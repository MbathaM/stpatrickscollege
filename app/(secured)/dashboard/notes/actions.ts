import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchMutation } from "convex/nextjs";

export function deleteNote(id: Id<"note">){
    return fetchMutation(api.notes.remove, { id: id as Id<"note"> });
}
export function shareNote(id: Id<"note">, userId: Id<"profile">){
    return fetchMutation(api.notes.addUserToShare, {
        userId,
        id,
    });
}
// 
//   const deleteNote = useMutation(api.notes.remove);
//   const shareNote = useMutation(api.notes.addUserToShare);