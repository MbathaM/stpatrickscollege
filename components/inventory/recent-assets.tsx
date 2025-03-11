"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";

export function RecentAssets() {
  const assets = useQuery(api.asset.getRecent) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No recent assets found.
                </TableCell>
              </TableRow>
            ) : (
              assets.map((asset) => (
                <TableRow key={asset._id}>
                  <TableCell className="font-medium">{asset.assetName}</TableCell>
                  <TableCell>{asset.model}</TableCell>
                  <TableCell>{asset.statusId ? "Active" : "Unknown"}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(asset._creationTime), {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}