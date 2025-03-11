import { getUsers } from "@/helpers/get-users";
import { NewTeacherForm } from "./new-form";
import { AzureUser } from "@/types";

async function getAzureUsers(): Promise<AzureUser[]> {
  const data = await getUsers();
  // console.log(data);
  return data;
}

export default async function NewTeacherPage() {
  const data = await getAzureUsers();

  const users = data.map((user) => ({
    value: user.id,
    label: user.displayName,
  }));
  return <NewTeacherForm users={users} />;
}
