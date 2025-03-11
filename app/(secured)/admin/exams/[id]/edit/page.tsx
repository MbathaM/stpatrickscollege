import EditExamClient from "./edit-exam-client";

export default async function EditExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditExamClient id={id} />;
}
