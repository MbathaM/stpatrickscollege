'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, ClipboardList, Package, GraduationCap, BookCheck, Calendar } from "lucide-react";

interface ResourceCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const resources: ResourceCard[] = [
  {
    title: "Notes",
    description: "Create, organize, and share your study notes with classmates. Add tags for easy categorization and access your notes anywhere.",
    icon: <BookOpen className="h-8 w-8" />,
    href: "/dashboard/notes"
  },
  {
    title: "Todo Lists",
    description: "Stay organized with personal todo lists. Set priorities, due dates, and track your progress on assignments and tasks.",
    icon: <ClipboardList className="h-8 w-8" />,
    href: "/dashboard/todos"
  },
  {
    title: "Inventory Management",
    description: "Track and manage school assets, equipment, and supplies. Monitor status, location, and maintenance schedules.",
    icon: <Package className="h-8 w-8" />,
    href: "/inventory"
  },
  {
    title: "Student Management",
    description: "Access student profiles, academic records, and enrollment information. Manage grades and track academic progress.",
    icon: <GraduationCap className="h-8 w-8" />,
    href: "/admin/students"
  },
  {
    title: "Subject Management",
    description: "Browse available subjects, access course materials, and manage subject-specific resources and requirements.",
    icon: <BookCheck className="h-8 w-8" />,
    href: "/admin/subjects"
  },
  {
    title: "Events & Schedule",
    description: "Stay updated with school events, academic calendar, and important dates. Never miss a deadline or school activity.",
    icon: <Calendar className="h-8 w-8" />,
    href: "/dashboard/calendar"
  }
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">School Resources</h1>
        <p className="text-muted-foreground text-lg">
          Quick access to all the tools and features available in our school management system
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource, index) => (
          <Card key={index} className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {resource.icon}
                </div>
                <CardTitle className="text-xl">{resource.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base mb-4">
                {resource.description}
              </CardDescription>
              <Link href={resource.href}>
                <Button className="w-full">Access {resource.title}</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}