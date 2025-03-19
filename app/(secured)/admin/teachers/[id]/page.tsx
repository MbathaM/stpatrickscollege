import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params 
    const userId = id as Id<"profile">
    const profile = preloadedQueryResult(await preloadQuery(api.profile.getById, { id: userId }));
    return <pre>{JSON.stringify(profile, null, 2)}</pre>
  }