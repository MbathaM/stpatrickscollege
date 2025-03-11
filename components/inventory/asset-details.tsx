"use client";
/* eslint-disable react-hooks/rules-of-hooks */
import { AssetForm } from "@/components/inventory/asset-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";

export function AssetDetails({ id }: { id: string }) {
  
  const asset = useQuery(api.asset.getById, { id: id as Id<"asset"> });
  const category = asset?.categoryId ? useQuery(api.asset_category.getById, { id: asset.categoryId }) : null;
  const manufacturer = asset?.manufacturerId ? useQuery(api.manufacturer.getById, { id: asset.manufacturerId }) : null;
  const location = asset?.locationId ? useQuery(api.location.getById, { id: asset.locationId }) : null;
  const supplier = asset?.supplierId ? useQuery(api.supplier.getById, { id: asset.supplierId }) : null;
  const status = asset?.statusId ? useQuery(api.asset_status.getById, { id: asset.statusId }) : null;
  const user = asset?.userId ? useQuery(api.ad_user.getById, { id: asset.userId }) : null;

  if (!asset) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Loading asset details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{asset.assetName}</h2>
          <p className="text-muted-foreground">
            Asset Tag: {asset.assetTag} | Model: {asset.model}
          </p>
        </div>
        {status && (
          <Badge variant="outline" className="text-sm">
            {status.status}
          </Badge>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Model</p>
                <p className="text-sm text-muted-foreground">{asset.model}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Model Number</p>
                <p className="text-sm text-muted-foreground">
                  {asset.modelNo || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Serial Number</p>
                <p className="text-sm text-muted-foreground">
                  {asset.serialNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground">
                  {category ? category.category : "Uncategorized"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Manufacturer</p>
                <p className="text-sm text-muted-foreground">
                  {manufacturer ? manufacturer.name : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Supplier</p>
                <p className="text-sm text-muted-foreground">
                  {supplier ? supplier.name : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{asset.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />

        <Card>
          <CardHeader>
            <CardTitle>Location & Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {location ? location.name : asset.defaultLocation || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm text-muted-foreground">
                  {user ? user.displayName : "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {asset.checkedOut ? "Checked Out" : "Available"}
                </p>
              </div>
              {asset.checkedOut && (
                <>
                  <div>
                    <p className="text-sm font-medium">Checkout Date</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.checkoutDate || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected Return</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.expectedCheckinDate || "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{asset.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {asset.createdAt
                    ? formatDistanceToNow(new Date(asset.createdAt), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {asset.updatedAt
                    ? formatDistanceToNow(new Date(asset.updatedAt), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </p>
              </div>
              {asset.class && (
                <div>
                  <p className="text-sm font-medium">Class</p>
                  <p className="text-sm text-muted-foreground">{asset.class}</p>
                </div>
              )}
              {asset.grade && (
                <div>
                  <p className="text-sm font-medium">Grade</p>
                  <p className="text-sm text-muted-foreground">{asset.grade}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">New Battery</p>
                <p className="text-sm text-muted-foreground">
                  {asset.newBattery ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">New Student</p>
                <p className="text-sm text-muted-foreground">
                  {asset.newStudent ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{asset.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />

        <Card>
          <CardHeader>
            <CardTitle>Purchase & Warranty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Purchase Date</p>
                <p className="text-sm text-muted-foreground">
                  {asset.purchasedDate || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Cost</p>
                <p className="text-sm text-muted-foreground">
                  {asset.cost ? `$${asset.cost.toFixed(2)}` : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Order Number</p>
                <p className="text-sm text-muted-foreground">
                  {asset.orderNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Warranty Expires</p>
                <p className="text-sm text-muted-foreground">
                  {asset.warrantyExpires || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">EOL</p>
                <p className="text-sm text-muted-foreground">
                  {asset.eol || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Current Value</p>
                <p className="text-sm text-muted-foreground">
                  {asset.value ? `$${asset.value.toFixed(2)}` : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{asset.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />

        <Card>
          <CardHeader>
            <CardTitle>Location & Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {location ? location.name : asset.defaultLocation || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Assigned To</p>
                <p className="text-sm text-muted-foreground">
                  {user ? user.displayName : "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground">
                  {asset.checkedOut ? "Checked Out" : "Available"}
                </p>
              </div>
              {asset.checkedOut && (
                <>
                  <div>
                    <p className="text-sm font-medium">Checkout Date</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.checkoutDate || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Expected Return</p>
                    <p className="text-sm text-muted-foreground">
                      {asset.expectedCheckinDate || "N/A"}
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{asset.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />

        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">
                  {asset.createdAt
                    ? formatDistanceToNow(new Date(asset.createdAt), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-sm text-muted-foreground">
                  {asset.updatedAt
                    ? formatDistanceToNow(new Date(asset.updatedAt), {
                        addSuffix: true,
                      })
                    : "N/A"}
                </p>
              </div>
              {asset.class && (
                <div>
                  <p className="text-sm font-medium">Class</p>
                  <p className="text-sm text-muted-foreground">{asset.class}</p>
                </div>
              )}
              {asset.grade && (
                <div>
                  <p className="text-sm font-medium">Grade</p>
                  <p className="text-sm text-muted-foreground">{asset.grade}</p>
                </div>
              )}
              <div>
                <p className="text-sm font-medium">New Battery</p>
                <p className="text-sm text-muted-foreground">
                  {asset.newBattery ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">New Student</p>
                <p className="text-sm text-muted-foreground">
                  {asset.newStudent ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {asset.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{asset.notes}</p>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Edit Asset</h3>
        <AssetForm assetId={id} />
      </div>
    </div>
  );
}