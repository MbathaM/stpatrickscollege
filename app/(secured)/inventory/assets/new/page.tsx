import { AssetForm } from "@/components/inventory/asset-form";
import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Asset",
  description: "Add a new asset to your inventory",
};

export default function NewAssetPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Create Asset"
        text="Add a new asset to your inventory"
      />
      <div className="mt-8">
        <AssetForm />
      </div>
    </DashboardShell>
  );
}