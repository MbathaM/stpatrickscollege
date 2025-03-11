"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function ExamsPage() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Id<"exam"> | null>(null);

  // Fetch exams, grades, subjects, teachers, and users
  const exams = useQuery(api.exams.list) || [];
  const grades = useQuery(api.grade.list) || [];
  const subjects = useQuery(api.subject.list) || [];
  const teachers = useQuery(api.profile.listByRole, { role: "teacher" }) || [];
  const users = useQuery(api.ad_user.list) || [];
  
  const deleteExam = useMutation(api.exams.remove);

  // Loading state
  if (!exams || !grades.length || !subjects.length || !teachers.length || !users.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Helper functions to get names
  const getGradeName = (gradeId: Id<"grade">) => {
    const grade = grades.find((g) => g._id === gradeId);
    return grade ? grade.name : "Unknown Grade";
  };

  const getSubjectName = (subjectId: Id<"subject">) => {
    const subject = subjects.find((s) => s._id === subjectId);
    return subject ? subject.name : "Unknown Subject";
  };

  const getTeacherName = (teacherId: Id<"profile">) => {
    const teacher = teachers.find((t) => t._id === teacherId);
    if (!teacher) return "Unknown Teacher";
    
    const user = users.find((u) => u._id === teacher.userId);
    return user ? user.displayName : "Unknown Teacher";
  };

  const handleDeleteClick = (examId: Id<"exam">) => {
    setExamToDelete(examId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!examToDelete) return;
    
    try {
      await deleteExam({ id: examToDelete });
      toast.success("Exam deleted successfully");
      setDeleteDialogOpen(false);
      setExamToDelete(null);
    } catch (error) {
      console.error("Failed to delete exam:", error);
      toast.error("Failed to delete exam");
    }
  };

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Exams Management</h1>
        <Link href="/admin/exams/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Exam
          </Button>
        </Link>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground mb-4">No exams found</p>
          <Link href="/admin/exams/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule your first exam
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exam Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Duration (min)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam._id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{getGradeName(exam.gradeId)}</TableCell>
                  <TableCell>{getSubjectName(exam.subjectId)}</TableCell>
                  <TableCell>{getTeacherName(exam.teacherId)}</TableCell>
                  <TableCell>{format(new Date(exam.date), "PPP")}</TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/exams/${exam._id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push(`/admin/exams/${exam._id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(exam._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this exam? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}