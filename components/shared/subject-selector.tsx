"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
// Remove the client-side imports
// import { api } from "@/convex/_generated/api";
// import { useQuery } from "convex/react";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Control } from "react-hook-form";

interface SubjectSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
  // Add subjects as a required prop
  subjects: any[];
}

export function SubjectSelector({ control, name, label = "Subjects", description, subjects }: SubjectSelectorProps) {
  // Remove the useQuery hook since we're now passing subjects as a prop
  // const subjects = useQuery(api.subject.list);
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {field.value.length > 3 ? (
                          <Badge variant="secondary">{field.value.length} subjects selected</Badge>
                        ) : (
                          subjects
                            ?.filter((subject) => field.value.includes(subject._id))
                            .map((subject) => (
                              <Badge key={subject._id} variant="secondary">
                                {subject.name}
                              </Badge>
                            ))
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Select subjects</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="h-[100vh]">
                  <SheetHeader>
                    <SheetTitle>Select Subjects</SheetTitle>
                    <SheetDescription>
                      Choose the subjects you teach or study
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(50vh-8rem)] mt-4 rounded-md border p-4">
                    <div className="space-y-4">
                      {subjects?.map((subject) => (
                        <div key={subject._id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`subject-${subject._id}`}
                            checked={field.value?.includes(subject._id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), subject._id]
                                : (field.value || []).filter((id: string) => id !== subject._id);
                              field.onChange(updatedValue);
                            }}
                          />
                          <label
                            htmlFor={`subject-${subject._id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {subject.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setOpen(false)}>Done</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </FormControl>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}