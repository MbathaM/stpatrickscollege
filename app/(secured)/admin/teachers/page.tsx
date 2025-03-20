import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import {PageClient} from "./page-client";

export default async function Page() {
  // Fetch students and users server-side
  const profiles = preloadedQueryResult(await preloadQuery(api.profile.listByRole, { role: "teacher" }));
  const users = preloadedQueryResult(await preloadQuery(api.ad_user.list));

  return <PageClient profiles={profiles} users={users} />;
}
