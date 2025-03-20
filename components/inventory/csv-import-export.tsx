"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { assetsToCSV, csvToAssets } from "@/lib/csv-utils";
import { Download, Upload } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CsvImportExport() {
  const assets = useQuery(api.asset.list) || [];
  const createAsset = useMutation(api.asset.create);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Handle CSV export
  const handleExport = () => {
    try {
      setIsExporting(true);
      
      // Convert assets to CSV
      const csv = assetsToCSV(assets);
      
      // Create a blob and download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set up download attributes
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `assets-export-${date}.csv`);
      
      // Trigger download and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Assets exported successfully");
    } catch (error) {
      console.error("Error exporting assets:", error);
      toast.error("Failed to export assets");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Handle CSV import
  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      setIsImporting(true);
      
      // Read the file
      const text = await file.text();
      
      // Parse CSV to assets
      const importedAssets = csvToAssets(text);
      
      if (importedAssets.length === 0) {
        toast.error("No valid assets found in the CSV file");
        return;
      }

      // Import each asset
      let successCount = 0;
      let errorCount = 0;

      for (const asset of importedAssets) {
        try {
          // Ensure required fields are present
          if (!asset.assetName || !asset.assetTag || !asset.model) {
            errorCount++;
            continue;
          }

          // Create the asset
          await createAsset({
            company: asset.company,
            assetName: asset.assetName,
            assetTag: asset.assetTag,
            model: asset.model,
            modelNo: asset.modelNo,
            serialNumber: asset.serialNumber,
            purchasedDate: asset.purchasedDate,
            cost: asset.cost,
            eol: asset.eol,
            orderNumber: asset.orderNumber,
            notes: asset.notes,
            newBattery: asset.newBattery,
            newStudent: asset.newStudent,
            class: asset.class,
            grade: asset.grade,
          });

          successCount++;
        } catch (error) {
          console.error("Error importing asset:", error);
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} assets`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} assets`);
      }

      // Close dialog and reset state
      setImportDialogOpen(false);
      setFile(null);
    } catch (error) {
      console.error("Error importing assets:", error);
      toast.error("Failed to import assets");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={isExporting || assets.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? "Exporting..." : "Export CSV"}
      </Button>

      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Assets from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import assets. The CSV should have headers matching the asset fields.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isImporting}
              />
              <p className="text-sm text-muted-foreground">
                Required fields: Asset Name, Asset Tag, Model
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              onClick={handleImport}
              disabled={!file || isImporting}
            >
              {isImporting ? "Importing..." : "Import Assets"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}