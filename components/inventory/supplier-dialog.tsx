"use client";

import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { Id } from "@/convex/_generated/dataModel";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Supplier name must be at least 2 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface SupplierDialogProps {
  children: React.ReactNode;
  defaultValues?: FormValues;
  id?: string;
}

export function SupplierDialog({
  children,
  defaultValues,
  id,
}: SupplierDialogProps) {
  const [open, setOpen] = useState(false);
  const createSupplier = useMutation(api.supplier.create);
  const updateSupplier = useMutation(api.supplier.update);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      if (id) {
        await updateSupplier({ 
          id: id as Id<"supplier">, // Type assertion to handle type
          ...data 
        });
        toast(
         "Supplier updated",{
          description: "The supplier has been updated successfully.",
        });
      } else {
        await createSupplier(data);
        toast(
         "Supplier created",{
          description: "The supplier has been created successfully.",
        });
      }
      form.reset();
      setOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(
    "Error",{
        description: error.message || "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{id ? "Edit Supplier" : "Add Supplier"}</DialogTitle>
          <DialogDescription>
            {id
              ? "Edit the supplier details below."
              : "Add a new supplier to your inventory."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter supplier name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {id ? "Update Supplier" : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}