import { AssetDetails } from "@/components/inventory/asset-details";
import { DashboardHeader } from "@/components/inventory/dashboard-header";
import { DashboardShell } from "@/components/inventory/dashboard-shell";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Asset Details",
  description: "View and manage asset details",
};

export default async function AssetDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Asset Details"
        text="View and manage asset details"
      />
      <div className="mt-8">
        <AssetDetails id={id} />
      </div>
    </DashboardShell>
  );
}
