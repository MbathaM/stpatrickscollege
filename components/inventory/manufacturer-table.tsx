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

export function ManufacturerTable() {
  const manufacturers = useQuery(api.manufacturer.list);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {manufacturers?.map((manufacturer) => (
            <TableRow key={manufacturer._id}>
              <TableCell>{manufacturer.name}</TableCell>
              <TableCell>{manufacturer.description}</TableCell>
              <TableCell>{manufacturer.contact}</TableCell>
              <TableCell>
                {new Date(manufacturer._creationTime).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}