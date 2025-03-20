import { AssetTable } from "@/components/inventory/asset-table";
import { CsvImportExport } from "@/components/inventory/csv-import-export";
import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Assets",
  description: "Manage your assets",
};

export default function AssetsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Assets" text="Manage your assets">
        <div className="flex space-x-2">
          <CsvImportExport />
          <Link href="/inventory/assets/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Asset
            </Button>
          </Link>
        </div>
      </DashboardHeader>
      <div className="mt-8">
        <AssetTable />
      </div>
    </DashboardShell>
  );
}