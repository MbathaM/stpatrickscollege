"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface AssetsByStatusProps {
  className?: string;
}

export function AssetsByStatus({ className }: AssetsByStatusProps) {
  const statuses = useQuery(api.asset_status.list) || [];
  const assets = useQuery(api.asset.list) || [];

  // Count assets by status
  const assetsByStatus = statuses.map((status) => {
    const count = assets.filter(
      (asset) => asset.statusId === status._id
    ).length;
    return {
      name: status.status,
      value: count,
    };
  });

  // Filter out statuses with no assets
  const filteredData = assetsByStatus.filter((item) => item.value > 0);

  // Add unassigned if there are assets without a status
  const unassignedCount = assets.filter(
    (asset) => !asset.statusId
  ).length;
  if (unassignedCount > 0) {
    filteredData.push({
      name: "Unassigned",
      value: unassignedCount,
    });
  }

  // Colors for the pie chart
  const COLORS = [
    "#4CAF50", // Green for active/deployed
    "#FFC107", // Yellow for maintenance
    "#F44336", // Red for retired/broken
    "#9C27B0", // Purple for in storage
    "#2196F3", // Blue for other statuses
    "#607D8B", // Gray for unassigned
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Assets by Status</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredData.length === 0 ? (
          <div className="flex justify-center items-center h-[300px] text-muted-foreground">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {filteredData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} assets`, "Count"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}