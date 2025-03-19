'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Search, Plus } from 'lucide-react';
import { TodoItem } from '@/components/todo/todo-item';
import { TodoForm } from '@/components/todo/todo-form';
import { authClient } from '@/lib/auth-client';

export default function TodosPage() {
  const { data } = authClient.useSession();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  const todos = useQuery(api.todo.list);
  const deleteTodo = useMutation(api.todo.remove);
  const shareTodo = useMutation(api.todo.share);
  const toggleComplete = useMutation(api.todo.toggleComplete);

  const userId = data?.user?.id as Id<"profile"> 

  const filteredTodos = todos?.filter(todo =>
    todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (todo.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleDelete = async (id: Id<'todo'>) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo({ id });
        toast.success('Todo deleted successfully');
      } catch (error) {
        console.error('Error deleting todo:', error);
        toast.error('Failed to delete todo');
      }
    }
  };

  const handleShare = async (id: Id<'todo'>) => {
    try {
      await shareTodo({ id });
      toast.success('Todo shared successfully');
    } catch (error) {
      console.error('Error sharing todo:', error);
      toast.error('Failed to share todo');
    }
  };

  const handleToggleComplete = async (id: Id<'todo'>, isCompleted: boolean) => {
    try {
      await toggleComplete({ id, isCompleted });
      toast.success(`Todo marked as ${isCompleted ? 'completed' : 'incomplete'}`);
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  };

  const handleEdit = (id: Id<'todo'>) => {
    const todo = todos?.find(t => t._id === id);
    if (todo) {
      setCurrentTodo(todo as any); // Type assertion to resolve type mismatch
      setIsEditDialogOpen(true);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">My Todos</CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Todo
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center py-4\">
            <div className="relative max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search todos..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo._id}
                id={todo._id}
                title={todo.title}
                description={todo.description}
                isCompleted={todo.isCompleted}
                dueDate={todo.dueDate}
                priority={todo.priority}
                isShared={todo.isShared}
                updatedAt={todo._creationTime.toString()}
                onToggleComplete={(id, isCompleted) => handleToggleComplete(id as Id<'todo'>, isCompleted)}
                onEdit={(id) => handleEdit(id as Id<'todo'>)}
                onDelete={(id) => handleDelete(id as Id<'todo'>)}
                onShare={(id) => handleShare(id as Id<'todo'>)}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <TodoForm userId={userId}
            // Remove userId prop as it's not defined or needed
            onSuccess={() => setIsAddDialogOpen(false)}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <TodoForm
            userId={userId}
            todo={currentTodo || undefined}
            onSuccess={() => setIsEditDialogOpen(false)}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}