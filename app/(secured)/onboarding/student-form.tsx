"use client";

import { SingleGradeSelector } from "@/components/shared/single-grade-selector";
import { SubjectSelector } from "@/components/shared/subject-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { query } from "@/convex/_generated/server";
import { AzureUser } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const FormSchema = z.object({
  gradeId: z.string().min(1, "Grade selection is required"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
  hasConcession: z.boolean(),
  concessionType: z.string().optional(),
  concessionTime: z.number().optional()
});

export function OnboardingStudentForm({email}: {email: string}) {
  const router = useRouter();
  const createProfile = useMutation(api.profile.create);
  const ad_user = useQuery(api.ad_user.getByUserEmail, {email: email});

  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      gradeId: "",
      subjects: [],
      hasConcession: false,
      concessionType: undefined,
      concessionTime: undefined
    }
  });

async function onSubmit(data: z.infer<typeof FormSchema>) {
  try {
    // Check if we have the Convex user ID
    if (!ad_user || !ad_user._id) {
      toast.error("User information not found");
      return;
    }
  
    await createProfile({
      ...data,
      role: "student",
      userId: ad_user._id, // Use the _id property which is the document ID
      gradeIds: [data.gradeId as Id<"grade">], // Convert single gradeId to array with one element
      subjectIds: data.subjects.map(id => id as Id<"subject">),
      permissions: ["student"] // Set default student permission
    });
    toast.success("Profile completed successfully");
    router.push("/dashboard");
  } catch (error) {
    console.error(error);
    toast.error("Failed to complete profile");
  }
}

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl capitalise font-bold">
          {ad_user ? `Hey ${ad_user.givenName} ${ad_user.surname}` : "Welcome"}
        </h1>
        <p className="text-muted-foreground">Please complete your profile information</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <SingleGradeSelector 
            control={form.control}
            name="gradeId"
            label="Grade"
            description="Select your current grade"
          />

          <SubjectSelector
            control={form.control}
            name="subjects"
            label="Subjects"
            description="Select the subjects you are taking"
          />

          <FormField
            control={form.control}
            name="hasConcession"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learning Accommodation</FormLabel>
                <FormControl>
                  <Select onValueChange={(value) => field.onChange(value === "true")} defaultValue={field.value.toString()}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you have a learning accommodation?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  Indicate if you have been granted a learning accommodation
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("hasConcession") && (
            <>
              <FormField
                control={form.control}
                name="concessionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accommodation Type</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accommodation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reader">Reader</SelectItem>
                          <SelectItem value="scriber">Scriber</SelectItem>
                          <SelectItem value="both">Both Reader and Scriber</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the type of accommodation you have been granted
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="concessionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extra Time (Minutes)</FormLabel>
                    <FormControl>
                      <Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select extra time granted" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 Minutes</SelectItem>
                          <SelectItem value="15">15 Minutes</SelectItem>
                          <SelectItem value="20">20 Minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the amount of extra time granted
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

<Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Loading..." : "Complete Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}