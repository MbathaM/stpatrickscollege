
import { api } from '@/convex/_generated/api';
import { preloadedQueryResult, preloadQuery } from 'convex/nextjs';
import TodosPageClient from './page-client';

export default async function TodosPage() {
    const todos = preloadedQueryResult(await preloadQuery(api.todo.list));
    const subjects = preloadedQueryResult(await preloadQuery(api.subject.list));
 return <TodosPageClient subjects={subjects} todos={todos}/>
}