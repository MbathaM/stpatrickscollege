import { AssetTable } from "@/components/inventory/asset-table";
import { AssetsByCategory } from "@/components/inventory/assets-by-category";
import { AssetsByStatus } from "@/components/inventory/assets-by-status";
import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { InventoryOverview } from "@/components/inventory/inventory-overview";
import { RecentAssets } from "@/components/inventory/recent-assets";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Dashboard",
  description: "Overview of your inventory and assets",
};

export default function InventoryDashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Inventory Dashboard"
        text="Manage and monitor your school assets"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <InventoryOverview />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-3">
        <AssetsByCategory className="col-span-2" />
        <AssetsByStatus />
      </div>
      <div className="mt-4">
        <RecentAssets />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">All Assets</h2>
        <AssetTable />
      </div>
    </DashboardShell>
  );
}