import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.string().default("medium"),
  relatedSubjectId: z.string().optional(),
});

interface TodoFormProps {
  userId: Id<"profile">;
  todo?: {
    _id: Id<"todo">;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    relatedSubjectId?: Id<"subject">;
    isShared: boolean;
    sharedWith?: Id<"profile">[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TodoForm({ userId, todo, onSuccess, onCancel }: TodoFormProps) {
  const createTodo = useMutation(api.todo.create);
  const updateTodo = useMutation(api.todo.update);
  const subjects = useQuery(api.subject.list) || [];
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: todo?.title || "",
      description: todo?.description || "",
      dueDate: todo?.dueDate ? new Date(todo.dueDate) : undefined,
      priority: todo?.priority || "medium",
      relatedSubjectId: todo?.relatedSubjectId ? todo.relatedSubjectId : undefined,
    },
  });

  const isEditing = !!todo;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const formattedData = {
        ...data,
        dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
        relatedSubjectId: data.relatedSubjectId ? data.relatedSubjectId as Id<"subject"> : undefined,
      };

      if (isEditing && todo) {
        await updateTodo({
          id: todo._id,
          title: formattedData.title,
          description: formattedData.description,
          dueDate: formattedData.dueDate,
          priority: formattedData.priority,
          relatedSubjectId: formattedData.relatedSubjectId,
        });
        toast.success("Todo updated successfully");
      } else {
        await createTodo({
          title: formattedData.title,
          description: formattedData.description,
          userId,
          dueDate: formattedData.dueDate,
          priority: formattedData.priority,
          relatedSubjectId: formattedData.relatedSubjectId,
          isShared: false,
        });
        toast.success("Todo created successfully");
      }
      
      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving todo:", error);
      toast.error("Failed to save todo");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Todo title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add details about your todo..." 
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select a due date for your todo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Set the priority level for this todo
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="relatedSubjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Subject</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value} 
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject._id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Optionally link this todo to a subject
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? "Update" : "Create"} Todo
          </Button>
        </div>
      </form>
    </Form>
  );
}