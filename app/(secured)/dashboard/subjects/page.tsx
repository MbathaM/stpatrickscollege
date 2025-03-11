"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubjectsPage() {
  const { data } = authClient.useSession();
  const email = data?.user?.email || "";
  
  // Get user profile
  const profile = useQuery(api.profile.getByEmail, email ? { email } : "skip");
  
  // Get role
  const role = useQuery(api.profile.determineRoleFromEmail, email ? { email } : "skip");
  
  // Redirect if not a student
  if (role === "teacher") {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
        <p>This page is only available to students.</p>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Subjects</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Mock subjects for now - in a real app, these would come from the database
  const studentSubjects = [
    { id: 1, name: "Mathematics", teacher: "Mr. Smith", grade: "Grade 10" },
    { id: 2, name: "English", teacher: "Mrs. Johnson", grade: "Grade 10" },
    { id: 3, name: "Science", teacher: "Dr. Brown", grade: "Grade 10" },
    { id: 4, name: "History", teacher: "Ms. Davis", grade: "Grade 10" },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Your Subjects</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {studentSubjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle>{subject.name}</CardTitle>
              <CardDescription>
                {subject.grade} • {subject.teacher}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View your assignments, resources, and progress for this subject.
              </p>
              <div className="mt-4">
                <a 
                  href={`/dashboard/subjects/${subject.id}`}
                  className="text-primary hover:underline font-medium"
                >
                  View Details →
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}