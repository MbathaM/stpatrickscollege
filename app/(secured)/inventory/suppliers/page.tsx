import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { SupplierDialog } from "@/components/inventory/supplier-dialog";
import { SupplierTable } from "@/components/inventory/supplier-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suppliers",
  description: "Manage suppliers",
};

export default function SuppliersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Suppliers" text="Manage suppliers">
        <SupplierDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Supplier
          </Button>
        </SupplierDialog>
      </DashboardHeader>
      <div className="mt-8">
        <SupplierTable />
      </div>
    </DashboardShell>
  );
}