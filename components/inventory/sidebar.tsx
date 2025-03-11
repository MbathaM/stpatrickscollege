"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Box,
  Factory,
  Home,
  MapPin,
  Package,
  Truck
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/inventory",
    icon: BarChart3,
  },
  {
    title: "Assets",
    href: "/inventory/assets",
    icon: Box,
  },
  {
    title: "Categories",
    href: "/inventory/categories",
    icon: Package,
  },
  {
    title: "Manufacturers",
    href: "/inventory/manufacturers",
    icon: Factory,
  },
  {
    title: "Suppliers",
    href: "/inventory/suppliers",
    icon: Truck,
  },
  {
    title: "Locations",
    href: "/inventory/locations",
    icon: MapPin,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-background border-r min-h-screen p-4">
      <div className="flex items-center mb-8 pl-2">
        <Home className="h-6 w-6 mr-2" />
        <h1 className="text-xl font-bold">Inventory</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground",
              pathname === item.href
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.icon && (
              <item.icon className="mr-2 h-4 w-4" />
            )}
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}