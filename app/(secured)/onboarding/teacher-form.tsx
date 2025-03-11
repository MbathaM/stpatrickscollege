"use client";

import { MultiGradeSelector } from "@/components/shared/multi-grade-selector";
import { SubjectSelector } from "@/components/shared/subject-selector";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";


const FormSchema = z.object({
  classroom: z.string().min(1, "Classroom number is required"),
  grades: z.array(z.string()).min(1, "Grade selection is required"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject")
});

export function OnboardingTeacherForm({email}: {email: string}) {
  const router = useRouter();
  const createTeacherProfile = useMutation(api.profile.create);
  const ad_user = useQuery(api.ad_user.getByUserEmail, {email: email});
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classroom: "",
      grades: [],
      subjects: []
    }
  });

async function onSubmit(data: z.infer<typeof FormSchema>) {
  try {
    // Check if we have the Convex user ID
    if (!ad_user || !ad_user._id) {
      toast.error("User information not found");
      return;
    }

    const profileData = {
      classroom: parseInt(data.classroom),
      gradeIds: data.grades as string[],
      subjectIds: data.subjects as string[],
      role: "teacher",
      userId: ad_user._id,  // Use the _id property which is the document ID
      permissions: ["teacher"] // Set default teacher permission
    };

await createTeacherProfile({
  ...profileData,
  gradeIds: profileData.gradeIds as unknown as Id<"grade">[],
  subjectIds: profileData.subjectIds as unknown as Id<"subject">[],
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
          <FormField
            control={form.control}
            name="classroom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Classroom Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your classroom number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the number of your assigned classroom
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <MultiGradeSelector 
            control={form.control}
            name="grades"
            label="Grade Level"
            description="Select the grade level you primarily teach"
          />

          <SubjectSelector
            control={form.control}
            name="subjects"
            label="Subjects"
            description="Select the subjects you teach"
          />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Loading..." : "Complete Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}