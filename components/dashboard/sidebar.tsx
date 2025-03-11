"use client";

import { cn } from "@/lib/utils";
import { BookOpen, Home, LucideIcon, MessageSquare, Settings, User, FileText, Globe, MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  role: "teacher" | "student";
}

interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roleAccess: ("teacher" | "student")[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: Home,
    roleAccess: ["teacher", "student"],
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
    roleAccess: ["teacher", "student"],
  },
  {
    title: "Comments",
    href: "/dashboard/comment",
    icon: MessageSquare,
    roleAccess: ["teacher"],
  },
  {
    title: "Summarize",
    href: "/dashboard/summarize",
    icon: FileText,
    roleAccess: ["teacher", "student"],
  },
  {
    title: "Translate",
    href: "/dashboard/translate",
    icon: Globe,
    roleAccess: ["teacher", "student"],
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageCircle,
    roleAccess: ["teacher", "student"],
  },
  {
    title: "Subjects",
    href: "/dashboard/subjects",
    icon: BookOpen,
    roleAccess: ["student"],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    roleAccess: ["teacher", "student"],
  },
];

export function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  
  // Filter items based on user role
  const filteredItems = sidebarItems.filter(item => 
    item.roleAccess.includes(role)
  );

  return (
    <div className="h-full w-64 border-r bg-background">
      <div className="flex flex-col h-full p-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold mb-4 px-2">
            {role === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}
          </h2>
          <nav className="space-y-1">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
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