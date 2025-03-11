import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    company: v.optional(v.string()),
    assetName: v.string(),
    assetTag: v.string(),
    model: v.string(),
    modelNo: v.optional(v.string()),
    categoryId: v.optional(v.id("asset_category")),
    manufacturerId: v.optional(v.id("manufacturer")),
    serialNumber: v.optional(v.string()),
    purchasedDate: v.optional(v.string()),
    cost: v.optional(v.number()),
    eol: v.optional(v.string()),
    orderNumber: v.optional(v.number()),
    supplierId: v.optional(v.id("supplier")),
    locationId: v.optional(v.id("location")),
    defaultLocation: v.optional(v.string()),
    statusId: v.optional(v.id("asset_status")),
    warrantyMonths: v.optional(v.number()),
    warrantyExpires: v.optional(v.string()),
    value: v.optional(v.number()),
    notes: v.optional(v.string()),
    userId: v.optional(v.id("ad_user")),
    contractId: v.optional(v.id("contract")),
    newBattery: v.optional(v.boolean()),
    newStudent: v.optional(v.boolean()),
    class: v.optional(v.string()),
    grade: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentDate = new Date().toISOString();
    return await ctx.db.insert("asset", {
      ...args,
      checkedOut: false,
      createdAt: currentDate,
      updatedAt: currentDate,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("asset").collect();
  },
});

export const getById = query({
  args: { id: v.id("asset") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const update = mutation({
  args: {
    id: v.id("asset"),
    company: v.optional(v.string()),
    assetName: v.optional(v.string()),
    assetTag: v.optional(v.string()),
    model: v.optional(v.string()),
    modelNo: v.optional(v.string()),
    categoryId: v.optional(v.id("asset_category")),
    manufacturerId: v.optional(v.id("manufacturer")),
    serialNumber: v.optional(v.string()),
    purchasedDate: v.optional(v.string()),
    cost: v.optional(v.number()),
    eol: v.optional(v.string()),
    orderNumber: v.optional(v.number()),
    supplierId: v.optional(v.id("supplier")),
    locationId: v.optional(v.id("location")),
    defaultLocation: v.optional(v.string()),
    checkedOut: v.optional(v.boolean()),
    checkedOutBy: v.optional(v.id("ad_user")),
    statusId: v.optional(v.id("asset_status")),
    warrantyMonths: v.optional(v.number()),
    warrantyExpires: v.optional(v.string()),
    value: v.optional(v.number()),
    checkoutDate: v.optional(v.string()),
    expectedCheckinDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    userId: v.optional(v.id("ad_user")),
    contractId: v.optional(v.id("contract")),
    newBattery: v.optional(v.boolean()),
    newStudent: v.optional(v.boolean()),
    class: v.optional(v.string()),
    grade: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    return await ctx.db.patch(id, {
      ...fields,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("asset") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

export const checkout = mutation({
  args: {
    id: v.id("asset"),
    userId: v.id("ad_user"),
    expectedCheckinDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, userId, expectedCheckinDate, notes } = args;
    const currentDate = new Date().toISOString();
    return await ctx.db.patch(id, {
      checkedOut: true,
      checkedOutBy: userId,
      checkoutDate: currentDate,
      expectedCheckinDate,
      notes,
      updatedAt: currentDate,
    });
  },
});

export const checkin = mutation({
  args: {
    id: v.id("asset"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, notes } = args;
    const currentDate = new Date().toISOString();
    return await ctx.db.patch(id, {
      checkedOut: false,
      checkedOutBy: undefined,
      checkoutDate: undefined,
      expectedCheckinDate: undefined,
      notes,
      updatedAt: currentDate,
    });
  },
});

export const getRecent = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("asset")
      .order("desc")
      .take(5);
  },
});

export const count = query({
  handler: async (ctx) => {
    return (await ctx.db.query("asset").collect()).length;
  },
});