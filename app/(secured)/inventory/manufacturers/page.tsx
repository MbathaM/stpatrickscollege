import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { ManufacturerDialog } from "@/components/inventory/manufacturer-dialog";
import { ManufacturerTable } from "@/components/inventory/manufacturer-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manufacturers",
  description: "Manage manufacturers",
};

export default function ManufacturersPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Manufacturers" text="Manage manufacturers">
        <ManufacturerDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Manufacturer
          </Button>
        </ManufacturerDialog>
      </DashboardHeader>
      <div className="mt-8">
        <ManufacturerTable />
      </div>
    </DashboardShell>
  );
}