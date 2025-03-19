
import { TimerPageClient } from "./timer-page-client"
import { preloadQuery, preloadedQueryResult } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function TimerPage() {
    // Get the current date in the format expected by the API
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Preload the query to get students with exams for today
    const data = preloadedQueryResult(await preloadQuery(api.timer.getStudentsWithExamsByDate, { date: currentDate }));
    
    // Pass the data to the client component
    return <TimerPageClient data={data as any}/>
}