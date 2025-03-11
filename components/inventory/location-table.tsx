"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

export function LocationTable() {
  const locations = useQuery(api.location.list);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations?.map((location) => (
            <TableRow key={location._id}>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.description || '-'}</TableCell>
              <TableCell>{location.city || '-'}</TableCell>
              <TableCell>
                {new Date(location._creationTime).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}