import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { permission } from "process";

export default defineSchema({
  // ================Auth tables ====================
  user: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    image: v.optional(v.string()),
    name: v.string(),
    updatedAt: v.string(),
  }),
  session: defineTable({
    expiresAt: v.string(),
    ipAddress: v.string(),
    token: v.string(),
    updatedAt: v.string(),
    userAgent: v.string(),
    userId: v.id("user"),
  }),
  verification: defineTable({
    expiresAt: v.string(),
    identifier: v.string(),
    updatedAt: v.string(),
    value: v.string(),
  }),
  account: defineTable({
    accessToken: v.string(),
    accessTokenExpiresAt: v.string(),
    accountId: v.string(),
    idToken: v.string(),
    providerId: v.string(),
    scope: v.string(),
    updatedAt: v.string(),
    userId: v.id("user"),
  }),
  ad_user: defineTable({
    userId: v.id("user"),
    intraId: v.string(),
    displayName: v.string(),
    givenName: v.string(),
    surname: v.string(),
    email: v.string(),
    mobilePhone: v.optional(v.string()),
  }),

  // ================Profile tables ====================
  profile: defineTable({
    userId: v.id("ad_user"), //link it to ad user becouse ad user is alread link to users table
    role: v.string(), // "teacher" or "student"
    classroom: v.optional(v.number()), //this is only if is teacher and its the teachers classrom number 1,2,3,4,...
    gradeIds: v.optional(v.array(v.id("grade"))), //teachers will have morethen one grade but student will have one
    subjectIds: v.optional(v.array(v.id("subject"))), // both teachers and stdudent can havve multiple grades
    permissions: v.optional(v.array(v.string())), // ["teacher", "inventory"], ["student"], ["admin"]
    hasConcession: v.optional(v.boolean()), //true or false if the student has been granted learning accomodation
    concessionType: v.optional(v.string()), //reader, scriber, both, none (if hasConcession is false)
    concessionTime: v.optional(v.number()), // in minutes 10,15,20 or empty if hasConcession is true
    isComplete: v.boolean(),
  }),

  // ================School tables ====================
  grade: defineTable({
    name: v.number(), // only a number 1..12
  }),

  subject: defineTable({
    name: v.string(),
  }),

  exam: defineTable({
    name: v.string(),
    duration: v.number(), // duration in minutes
    gradeId: v.id("grade"), // link to grade table
    subjectId: v.id("subject"), // link to subject table
    teacherId: v.id("profile"), // link to profile table (teacher)
    date: v.string(), // date of the exam
    createdAt: v.string(),
    updatedAt: v.string(),
  }),

  // ================Notes and Todos tables ====================
  note: defineTable({
    title: v.string(),
    content: v.string(),
    userId: v.id("profile"), // link to profile table (owner)
    isShared: v.boolean(), // whether the note is shared with others
    sharedWith: v.optional(v.array(v.id("profile"))), // profiles this note is shared with
    color: v.optional(v.string()), // for UI customization
    tags: v.optional(v.array(v.string())), // for categorization
    createdAt: v.string(),
    updatedAt: v.string(),
  }),

  todo: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    userId: v.id("profile"), // link to profile table (owner)
    isCompleted: v.boolean(),
    dueDate: v.optional(v.string()),
    priority: v.optional(v.string()), // "low", "medium", "high"
    isShared: v.boolean(), // whether the todo is shared with others
    sharedWith: v.optional(v.array(v.id("profile"))), // profiles this todo is shared with
    relatedSubjectId: v.optional(v.id("subject")), // optional link to a subject
    createdAt: v.string(),
    updatedAt: v.string(),
  }),

  // ================Invventory tables ====================
  manufacturer: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    contact: v.optional(v.string()),
  }),

  supplier: defineTable({
    name: v.string(),
  }),

  location: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    city: v.optional(v.string()),
    country: v.optional(v.string()),
  }),

  contract: defineTable({
    contractOption: v.optional(v.string()),
    installmentPeriod: v.optional(v.number()),
    installmentAmount: v.optional(v.string()),
    contractedEndDate: v.optional(v.string()),
  }),

  asset_status: defineTable({
    status: v.string(),
  }),

  asset_category: defineTable({
    category: v.string(),
  }),

  asset: defineTable({
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
    checkedOut: v.optional(v.boolean()),
    checkedOutBy: v.optional(v.id("ad_user")),
    statusId: v.optional(v.id("asset_status")),
    warrantyMonths: v.optional(v.number()),
    warrantyExpires: v.optional(v.string()),
    value: v.optional(v.number()),
    checkoutDate: v.optional(v.string()),
    expectedCheckinDate: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    notes: v.optional(v.string()),
    userId: v.optional(v.id("ad_user")),
    contractId: v.optional(v.id("contract")),
    newBattery: v.optional(v.boolean()),
    newStudent: v.optional(v.boolean()),
    class: v.optional(v.string()),
    grade: v.optional(v.string()),
  }),
});
