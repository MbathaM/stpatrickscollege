import ExamDetailClient from "./exam-detail-client";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExamDetailClient id={id} />
}