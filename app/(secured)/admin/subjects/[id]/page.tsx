import { preloadQuery, preloadedQueryResult } from "convex/nextjs";

export default async function Page({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {
    const { id } = await params as { id: string };
    return <div>My Subject: {id}</div>
  }