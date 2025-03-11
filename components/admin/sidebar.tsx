"use client";

import { cn } from "@/lib/utils";
import {
  BookOpen,
  ClipboardList,
  FileText,
  GraduationCap,
  Home,
  LucideIcon,
  MessageSquare,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {}

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: Users,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Grades",
    href: "/admin/grades",
    icon: ClipboardList,
  },
  {
    title: "Exams",
    href: "/admin/exams",
    icon: FileText,
  },
  {
    title: "Generator",
    href: "/admin/generator",
    icon: MessageSquare,
  },
];

export function AdminSidebar({}: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="h-full w-64 border-r bg-background">
      <div className="flex flex-col h-full p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold mb-4 px-2">
            Admin Dashboard
          </h2>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-primary"
                  )}
                >
                  <Icon className={cn("mr-3 h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}