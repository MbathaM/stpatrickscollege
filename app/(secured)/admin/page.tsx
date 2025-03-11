"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";
import { Users, GraduationCap, BookOpen, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { data } = authClient.useSession();
  const email = data?.user?.email || "";
  const name = data?.user?.name || "";
  
  // Get counts for dashboard
  const teacherCount = useQuery(api.profile.countByRole, { role: "teacher" });
  const studentCount = useQuery(api.profile.countByRole, { role: "student" });
  const subjectCount = useQuery(api.subject.count);
  const gradeCount = useQuery(api.grade.count);
  const examCount = useQuery(api.exams.count);
  
  // Loading state
  if (teacherCount === undefined || studentCount === undefined || 
      subjectCount === undefined || gradeCount === undefined || 
      examCount === undefined) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Dashboard stats cards
  const statsCards = [
    {
      title: "Teachers",
      value: teacherCount,
      description: "Total registered teachers",
      icon: Users,
      href: "/admin/teachers",
    },
    {
      title: "Students",
      value: studentCount,
      description: "Total registered students",
      icon: GraduationCap,
      href: "/admin/students",
    },
    {
      title: "Subjects",
      value: subjectCount,
      description: "Available subjects",
      icon: BookOpen,
      href: "/admin/subjects",
    },
    // {
    //   title: "Grades",
    //   value: gradeCount,
    //   description: "Available grades",
    //   icon: GraduationCap,
    //   href: "/admin/grades",
    // },
    {
      title: "Exams",
      value: examCount,
      description: "Scheduled exams",
      icon: FileText,
      href: "/admin/exams",
    },
  ];

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-10">
        {statsCards.map((card) => (
          <Link href={card.href} key={card.title}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link 
              href="/admin/teachers/new" 
              className="block p-3 hover:bg-muted rounded-md transition-colors"
            >
              Add New Teacher
            </Link>
            <Link 
              href="/admin/students/new" 
              className="block p-3 hover:bg-muted rounded-md transition-colors"
            >
              Add New Student
            </Link>
            <Link 
              href="/admin/subjects/new" 
              className="block p-3 hover:bg-muted rounded-md transition-colors"
            >
              Add New Subject
            </Link>
            <Link 
              href="/admin/exams/new" 
              className="block p-3 hover:bg-muted rounded-md transition-colors"
            >
              Schedule New Exam
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              School management system details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Administrator:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">Administrator</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}