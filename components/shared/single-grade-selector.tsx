"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Remove the client-side imports
// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
import { Control } from "react-hook-form";

interface GradeSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  // Add grades as a required prop
  grades: any[];
}

export function SingleGradeSelector({ control, name, label = "Grade", description, grades }: GradeSelectorProps) {
  // Remove the useQuery hook since we're now passing grades as a prop
  // const grades = useQuery(api.grade.list);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a grade" />
              </SelectTrigger>
              <SelectContent>
                {grades?.map((grade) => (
                  <SelectItem key={grade._id} value={grade._id}>
                    Grade {grade.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}