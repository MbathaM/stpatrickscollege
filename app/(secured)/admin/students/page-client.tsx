"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Id, DataModel } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";

type Profile = DataModel["profile"]["document"] []
type User = DataModel["ad_user"]["document"] []

export function PageClient({ profiles, users }: { profiles: Profile, users: User }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteProfile = useMutation(api.profile.remove);

 // Loading state
 if (!profiles || !users) {
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Students</h1>
        <Skeleton className="h-10 w-32" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

// Combine profiles with user data
const students = profiles.map(profile => {
  const user = users.find(u => u._id === profile.userId);
  return {
    ...profile,
    displayName: user?.displayName || "Unknown",
    email: user?.email || "Unknown",
  };
});

const handleDelete = async () => {
  if (deleteId) {
    await deleteProfile({ id: deleteId as Id<"profile"> });
    setDeleteId(null);
    router.refresh();
  }
};

return (
  <div className="container py-10">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Students</h1>
      <Button asChild>
        <Link href="/admin/teachers/new">
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Link>
      </Button>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Students List</CardTitle>
        <CardDescription>
          Manage all students in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        {students.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No students found. Add a new student to get started.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Grades</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id}>
                  <TableCell className="font-medium">{student.displayName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.subjectIds?.length || 0} subjects</TableCell>
                  <TableCell>{student.gradeIds?.length || 0} grades</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/admin/teachers/${student._id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setDeleteId(student._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the teacher profile. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteId(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  </div>
);
}