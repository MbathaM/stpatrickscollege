import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { updateNote, createNote } from "./actions";

const FormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  color: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

interface NoteEditorProps {
  userId: Id<"profile">;
  note?: {
    _id: Id<"note">;
    title: string;
    content: string;
    color?: string;
    tags?: string[];
    isShared: boolean;
    sharedWith?: Id<"profile">[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const colorOptions = [
  { value: "bg-card", label: "Default" },
  { value: "bg-blue-50", label: "Blue" },
  { value: "bg-green-50", label: "Green" },
  { value: "bg-yellow-50", label: "Yellow" },
  { value: "bg-purple-50", label: "Purple" },
  { value: "bg-pink-50", label: "Pink" },
];

export function NoteEditor({
  userId,
  note,
  onSuccess,
  onCancel,
}: NoteEditorProps) {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: note?.title || "",
      content: note?.content || "",
      color: note?.color || "bg-card",
      tags: note?.tags || [],
    },
  });

  const isEditing = !!note;
  const tags = form.watch("tags") || [];

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      form.setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      if (isEditing && note) {
        await updateNote(
          {
            title: data.title,
            content: data.content,
            color: data.color,
            tags: data.tags,
          },
          note._id
        );
        toast.success("Note updated successfully");
      } else {
        await createNote(
          {
            title: data.title,
            content: data.content,
            color: data.color,
            tags: data.tags,
            isShared: false,
          },
          userId
        );
        toast.success("Note created successfully");
      }

      if (onSuccess) onSuccess();
      form.reset();
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
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
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your note here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${color.value} ${field.value === color.value ? "border-primary" : "border-transparent"}`}
                    onClick={() => form.setValue("color", color.value)}
                    title={color.label}
                  />
                ))}
              </div>
              <FormDescription>Select a color for your note</FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex items-center space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Add tags to categorize your note
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">{isEditing ? "Update" : "Create"} Note</Button>
        </div>
      </form>
    </Form>
  );
}
