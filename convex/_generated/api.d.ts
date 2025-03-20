/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ad_user from "../ad_user.js";
import type * as asset from "../asset.js";
import type * as asset_category from "../asset_category.js";
import type * as asset_status from "../asset_status.js";
import type * as betterAuth from "../betterAuth.js";
import type * as category from "../category.js";
import type * as contract from "../contract.js";
import type * as exams from "../exams.js";
import type * as grade from "../grade.js";
import type * as init_grades from "../init_grades.js";
import type * as init_subjects from "../init_subjects.js";
import type * as location from "../location.js";
import type * as manufacturer from "../manufacturer.js";
import type * as notes from "../notes.js";
import type * as profile from "../profile.js";
import type * as subject from "../subject.js";
import type * as supplier from "../supplier.js";
import type * as timer from "../timer.js";
import type * as todo from "../todo.js";
import type * as user from "../user.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ad_user: typeof ad_user;
  asset: typeof asset;
  asset_category: typeof asset_category;
  asset_status: typeof asset_status;
  betterAuth: typeof betterAuth;
  category: typeof category;
  contract: typeof contract;
  exams: typeof exams;
  grade: typeof grade;
  init_grades: typeof init_grades;
  init_subjects: typeof init_subjects;
  location: typeof location;
  manufacturer: typeof manufacturer;
  notes: typeof notes;
  profile: typeof profile;
  subject: typeof subject;
  supplier: typeof supplier;
  timer: typeof timer;
  todo: typeof todo;
  user: typeof user;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
