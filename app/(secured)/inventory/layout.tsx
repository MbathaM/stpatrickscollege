import { Sidebar } from "@/components/inventory/sidebar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Management",
  description: "Manage your school assets and inventory",
};

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-auto">{children}</div>
      </div>
      <SiteFooter />
    </div>
  );
}