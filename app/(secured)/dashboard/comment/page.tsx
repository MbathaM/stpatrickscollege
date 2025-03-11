import { getAdUsers } from "@/helpers/get-ad-user";
import { AzureUser } from "@/types";
import { CommentForm } from "./comment-form";

async function getAzureUsers(): Promise<AzureUser[]> {
  const data = await getAdUsers();
  // console.log(data);
  return data;
}
export default async function CommentPage() {
  const data = await getAzureUsers();

  const users = data.map((user) => ({
    value: user.id,
    label: user.displayName,
  }));

  return <CommentForm users={users} />;
}
