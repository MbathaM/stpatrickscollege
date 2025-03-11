"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Box, MapPin, Package, Truck } from "lucide-react";

interface OverviewCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function OverviewCard({ title, value, icon }: OverviewCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function InventoryOverview() {
  const assets = useQuery(api.asset.count) || 0;
  const categories = useQuery(api.asset_category.count) || 0;
  const suppliers = useQuery(api.supplier.count) || 0;
  const locations = useQuery(api.location.count) || 0;

  return (
    <>
      <OverviewCard
        title="Total Assets"
        value={assets}
        icon={<Box className="h-4 w-4 text-muted-foreground" />}
      />
      <OverviewCard
        title="Categories"
        value={categories}
        icon={<Package className="h-4 w-4 text-muted-foreground" />}
      />
      <OverviewCard
        title="Suppliers"
        value={suppliers}
        icon={<Truck className="h-4 w-4 text-muted-foreground" />}
      />
      <OverviewCard
        title="Locations"
        value={locations}
        icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
      />
    </>
  );
}