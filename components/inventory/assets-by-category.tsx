"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface AssetsByCategoryProps {
  className?: string;
}

export function AssetsByCategory({ className }: AssetsByCategoryProps) {
  const categories = useQuery(api.asset_category.list) || [];
  const assets = useQuery(api.asset.list) || [];

  // Count assets by category
  const assetsByCategory = categories.map((category) => {
    const count = assets.filter(
      (asset) => asset.categoryId === category._id
    ).length;
    return {
      name: category.category,
      value: count,
    };
  });

  // Filter out categories with no assets
  const filteredData = assetsByCategory.filter((item) => item.value > 0);

  // Add uncategorized if there are assets without a category
  const uncategorizedCount = assets.filter(
    (asset) => !asset.categoryId
  ).length;
  if (uncategorizedCount > 0) {
    filteredData.push({
      name: "Uncategorized",
      value: uncategorizedCount,
    });
  }

  // Colors for the pie chart
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#FF6B6B",
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Assets by Category</CardTitle>
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