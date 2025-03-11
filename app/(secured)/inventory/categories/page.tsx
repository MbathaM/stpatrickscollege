import { CategoryDialog } from "@/components/inventory/category-dialog";
import { CategoryTable } from "@/components/inventory/category-table";
import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asset Categories",
  description: "Manage asset categories",
};

export default function CategoriesPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Asset Categories" text="Manage asset categories">
        <CategoryDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </CategoryDialog>
      </DashboardHeader>
      <div className="mt-8">
        <CategoryTable />
      </div>
    </DashboardShell>
  );
}