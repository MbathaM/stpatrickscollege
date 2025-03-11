"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Control } from "react-hook-form";

interface GradeSelectorProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  description?: string;
}

export function MultiGradeSelector({
  control,
  name,
  label = "Grades",
  description,
}: GradeSelectorProps) {
  const grades = useQuery(api.grade.list);
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
                          <Badge variant="secondary">
                            {field.value.length} grades selected
                          </Badge>
                        ) : (
                          grades
                            ?.filter((grade) => field.value.includes(grade._id))
                            .map((grade) => (
                              <Badge key={grade._id} variant="secondary">
                                Grade {grade.name}
                              </Badge>
                            ))
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        Select grades
                      </span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="h-[100vh]">
                  <SheetHeader>
                    <SheetTitle>Select Grades</SheetTitle>
                    <SheetDescription>
                      Choose the grades you teach
                    </SheetDescription>
                  </SheetHeader>
                  <ScrollArea className="h-[calc(50vh-8rem)] mt-4 rounded-md border p-4">
                    <div className="space-y-4">
                      {grades?.map((grade) => (
                        <div
                          key={grade._id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`grade-${grade._id}`}
                            checked={field.value?.includes(grade._id)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), grade._id]
                                : (field.value || []).filter(
                                    (id: string) => id !== grade._id
                                  );
                              field.onChange(updatedValue);
                            }}
                          />
                          <label
                            htmlFor={`grade-${grade._id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Grade {grade.name}
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
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
