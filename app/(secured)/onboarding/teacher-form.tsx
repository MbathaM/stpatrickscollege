"use client";

import { MultiGradeSelector } from "@/components/shared/multi-grade-selector";
import { SubjectSelector } from "@/components/shared/subject-selector";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { DataModel } from "@/convex/_generated/dataModel";
import { completeProfile } from "@/utils/complete-profile";
import { emailOTP } from "better-auth/plugins";

type Grade = DataModel["grade"]["document"][];
type Subject = DataModel["subject"]["document"][];
type ADUser = DataModel["ad_user"]["document"];

const FormSchema = z.object({
  classroom: z.string().min(1, "Classroom number is required"),
  grades: z.array(z.string()).min(1, "Grade selection is required"),
  subjects: z.array(z.string()).min(1, "Please select at least one subject"),
});

export function OnboardingTeacherForm({
  subjects,
  grades,
  ad_user,
}: {
  subjects: Subject;
  grades: Grade;
  ad_user: ADUser;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classroom: "",
      grades: [],
      subjects: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Check if we have the Convex user ID
      if (!ad_user || !ad_user._id) {
        toast.error("User information not found");
        return;
      }

      await completeProfile(
        {
          role: "teacher",
          userId: ad_user._id,
          classroom: parseInt(data.classroom),
          grades: data.grades,
          subjects: data.subjects,
        },
        ad_user.email
      );
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
        <p className="text-muted-foreground">
          Please complete your profile information
        </p>
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
            grades={grades}
            control={form.control}
            name="grades"
            label="Grade Level"
            description="Select the grade level you primarily teach"
          />

          <SubjectSelector
            subjects={subjects}
            control={form.control}
            name="subjects"
            label="Subjects"
            description="Select the subjects you teach"
          />

          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Loading..." : "Complete Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
