import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { LocationDialog } from "@/components/inventory/location-dialog";
import { LocationTable } from "@/components/inventory/location-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations",
  description: "Manage locations",
};

export default function LocationsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Locations" text="Manage locations">
        <LocationDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </LocationDialog>
      </DashboardHeader>
      <div className="mt-8">
        <LocationTable />
      </div>
    </DashboardShell>
  );
}