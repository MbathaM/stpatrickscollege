"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { csvToAssets } from "@/lib/csv-utils";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function importCSV(csvText: string) {
  try {
    const importedAssets = csvToAssets(csvText);

    let successCount = 0;
    let errorCount = 0;

    for (const asset of importedAssets) {
      if (!asset.assetName || !asset.assetTag || !asset.model) {
        errorCount++;
        continue;
      }

      let manufacturerId;
      if (asset.manufacturer) {
        const existing = await convex.query(api.manufacturer.getByName, { name: asset.manufacturer });
        manufacturerId = existing?._id ?? await convex.mutation(api.manufacturer.create, { name: asset.manufacturer });
      }

      let supplierId;
      if (asset.supplier) {
        const existing = await convex.query(api.supplier.getByName, { name: asset.supplier });
        supplierId = existing?.[0]?._id ?? await convex.mutation(api.supplier.create, { name: asset.supplier });
      }

      let locationId;
      if (asset.location) {
        const existing = await convex.query(api.location.getByName, { name: asset.location });
        locationId = existing?._id ?? await convex.mutation(api.location.create, { name: asset.location });
      }

      let checkedOutBy;
      if (asset.checkedOutBy) {
        const email = `${asset.checkedOutBy}@stpatrickscollege.co.za`;
        const user = await convex.query(api.ad_user.getByUserEmail, { email });
        checkedOutBy = user?._id;
      }

      await convex.mutation(api.asset.create, {
        ...asset,
        manufacturerId,
        supplierId,
        locationId,
        checkedOutBy,
      });
      successCount++;
    }

    return { successCount, errorCount };
  } catch (error) {
    console.error("Error importing CSV:", error);
    throw new Error("Failed to import CSV");
  }
}