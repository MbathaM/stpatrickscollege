/**
 * Utility functions for CSV export and import
 */

import { type Doc } from "@/convex/_generated/dataModel";

type Asset = Doc<"asset">;

/**
 * Convert assets data to CSV string
 */
export function assetsToCSV(assets: Asset[], includeHeader: boolean = true): string {
  // Define CSV headers based on the asset fields
  const headers = [
    "Company",
    "Asset Name",
    "Asset Tag",
    "Model",
    "Model No.",
    "Category",
    "Manufacturer",
    "Serial",
    "Purchased",
    "Cost",
    "EOL",
    "Order Number",
    "Supplier",
    "Location",
    "Status",
    "Warranty Months",
    "Warranty Expires",
    "Value",
    "Notes",
    "User",
    "Contract Option",
    "Installment Period",
    "Installment Amount",
    "Contracted End Date",
    "New Battery",
    "New Student",
    "Class",
    "Grade"
  ];

  // Start with headers if includeHeader is true
  let csvContent = includeHeader ? headers.join(",") + "\n" : "";

  // Add each asset as a row
  assets.forEach(asset => {
    const row = [
      escapeCsvValue(asset.company || ""),
      escapeCsvValue(asset.assetName || ""),
      escapeCsvValue(asset.assetTag || ""),
      escapeCsvValue(asset.model || ""),
      escapeCsvValue(asset.modelNo || ""),
      escapeCsvValue(asset.categoryId ? asset.categoryId : ""), // This would need to be replaced with actual category name
      escapeCsvValue(asset.manufacturerId ? asset.manufacturerId : ""), // This would need to be replaced with actual manufacturer name
      escapeCsvValue(asset.serialNumber || ""),
      escapeCsvValue(asset.purchasedDate || ""),
      asset.cost ? asset.cost.toString() : "",
      escapeCsvValue(asset.eol || ""),
      asset.orderNumber ? asset.orderNumber.toString() : "",
      escapeCsvValue(asset.supplierId ? asset.supplierId : ""), // This would need to be replaced with actual supplier name
      escapeCsvValue(asset.locationId ? asset.locationId : ""), // This would need to be replaced with actual location name
      escapeCsvValue(asset.statusId ? asset.statusId : ""), // This would need to be replaced with actual status name
      asset.warrantyMonths ? asset.warrantyMonths.toString() : "",
      escapeCsvValue(asset.warrantyExpires || ""),
      asset.value ? asset.value.toString() : "",
      escapeCsvValue(asset.notes || ""),
      escapeCsvValue(asset.userId ? asset.userId : ""), // This would need to be replaced with actual user name
      escapeCsvValue(asset.contractId ? "Contract ID" : ""), // This would need to be replaced with actual contract option
      "", // Installment Period - would need to be fetched from contract
      "", // Installment Amount - would need to be fetched from contract
      "", // Contracted End Date - would need to be fetched from contract
      asset.newBattery ? "Yes" : "No",
      asset.newStudent ? "Yes" : "No",
      escapeCsvValue(asset.class || ""),
      escapeCsvValue(asset.grade || "")
    ];
    
    csvContent += row.join(",") + "\n";
  });

  return csvContent;
}

/**
 * Parse CSV string to asset data objects
 */
export function csvToAssets(csvContent: string): any[] {
  const lines = csvContent.split("\n");
  const headers = lines[0].split(",").map(header => header.trim().replace(/^"|"$/g, ""));
  
  const assets = [];
  
  // Start from index 1 to skip the header row
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue; // Skip empty lines
    
    const values = parseCSVLine(lines[i]);
    const asset: any = {};
    
    // Map CSV values to asset properties
    headers.forEach((header, index) => {
      if (index < values.length) {
        const value = values[index].trim().replace(/^"|"$/g, "");
        
        switch(header) {
          case "Company":
            asset.company = value;
            break;
          case "Asset Name":
            asset.assetName = value;
            break;
          case "Asset Tag":
            asset.assetTag = value;
            break;
          case "Model":
            asset.model = value;
            break;
          case "Model No.":
            asset.modelNo = value;
            break;
          case "Serial":
            asset.serialNumber = value;
            break;
          case "Purchased":
            asset.purchasedDate = value;
            break;
          case "Cost":
            asset.cost = value ? parseFloat(value.replace(/,/g, "")) : undefined;
            break;
          case "EOL":
            asset.eol = value;
            break;
          case "Order Number":
            asset.orderNumber = value ? parseInt(value) : undefined;
            break;
          case "Notes":
            asset.notes = value;
            break;
          case "New Battery":
            asset.newBattery = value.toLowerCase() === "yes";
            break;
          case "New Student":
            asset.newStudent = value.toLowerCase() === "yes";
            break;
          case "Class":
            asset.class = value;
            break;
          case "Grade":
            asset.grade = value;
            break;
          // Other fields would need special handling for IDs
        }
      }
    });
    
    assets.push(asset);
  }
  
  return assets;
}

/**
 * Escape CSV value to handle commas, quotes, and newlines
 */
function escapeCsvValue(value: string): string {
  if (!value) return "";
  
  // If the value contains a comma, a double quote, or a newline, wrap it in double quotes
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    // Replace any double quotes with two double quotes
    return '"' + value.replace(/"/g, '""') + '"';
  }
  
  return value;
}

/**
 * Parse a CSV line respecting quoted values
 */
function parseCSVLine(line: string): string[] {
  const result = [];
  let current = "";
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        // Double quotes inside quotes - add a single quote
        current += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  
  return result;
}