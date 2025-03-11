"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ArrowLeft, Loader2, Pencil } from "lucide-react";

export default function ExamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const examId = params.id as Id<"exam">;
  
  // Fetch exam and related data
  const exam = useQuery(api.exams.getById, { id: examId });
  const grade = exam ? useQuery(api.grade.getById, { id: exam.gradeId }) : null;
  const subject = exam ? useQuery(api.subject.getById, { id: exam.subjectId }) : null;
  const teacher = exam ? useQuery(api.profile.getById, { id: exam.teacherId }) : null;
  const users = useQuery(api.ad_user.list);
  
  // Loading state
  if (!exam || !grade || !subject || !teacher || !users) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exams
        </Button>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{exam.name}</h1>
        <div className="flex space-x-2">
          <Link href={`/admin/exams/${examId}/edit`}>
            <Button variant="outline">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
            <CardDescription>
              Basic information about the exam
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{exam.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{format(new Date(exam.date), "PPP")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="font-medium">{exam.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">{format(new Date(exam.createdAt), "PPP")}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Related Information</CardTitle>
            <CardDescription>
              Grade, subject, and teacher details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Grade:</span>
              <Link href={`/admin/grades/${grade._id}`} className="font-medium text-primary hover:underline">
                {grade.name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subject:</span>
              <Link href={`/admin/subjects/${subject._id}`} className="font-medium text-primary hover:underline">
                {subject.name}
              </Link>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teacher:</span>
              <Link href={`/admin/teachers/${teacher._id}`} className="font-medium text-primary hover:underline">
                {users.find(u => u._id === teacher.userId)?.displayName || "Unknown Teacher"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}