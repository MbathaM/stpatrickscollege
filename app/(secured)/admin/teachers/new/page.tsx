import { getAdUsers } from "@/helpers/get-ad-user";
import { AzureUser } from "@/types";
import { NewTeacherForm } from "./new-form";

async function getAzureUsers(): Promise<AzureUser[]> {
  const data = await getAdUsers();
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
