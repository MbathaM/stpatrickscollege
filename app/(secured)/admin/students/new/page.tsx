'use client';

import { getAdUsers } from "@/helpers/get-ad-user";
import { AzureUser } from "@/types";
import { NewStudentForm } from "./new-form";

async function getAzureUsers(): Promise<AzureUser[]> {
  const data = await getAdUsers();
  return data;
}

export default async function NewStudentPage() {
  const data = await getAzureUsers();

  const users = data.map((user) => ({
    value: user.id,
    label: user.displayName,
  }));
  return <NewStudentForm users={users} />;
}