"use client";

import { toast } from "@/components/ui/sonner";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubjectSelector } from "@/components/shared/subject-selector";
import { MultiGradeSelector } from "@/components/shared/multi-grade-selector";
import { SingleGradeSelector } from "@/components/shared/single-grade-selector";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Id, DataModel } from "@/convex/_generated/dataModel";
import { useEffect, useState } from "react";

type Profile = DataModel["profile"]["document"];
type Grade = DataModel["grade"]["document"];
type Subject = DataModel["subject"]["document"];

const formSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string(),
  classroom: z.number().optional(),
  gradeIds: z.array(z.string()).optional(),
  subjectIds: z.array(z.string()).optional(),
  hasConcession: z.boolean().optional(),
  concessionType: z.string().optional(),
  concessionTime: z.number().optional(),
});

export function ProfilePageClient({
  email,
  name,
  profile,
  role,
  grades,
  subjects,
}: {
  email: string;
  name: string;
  profile: Profile;
  role: string;
  grades: Grade[];
  subjects: Subject[];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
      role: role,
      classroom: profile?.classroom || 0,
      gradeIds: profile?.gradeIds || [],
      subjectIds: profile?.subjectIds || [],
      hasConcession: profile?.hasConcession || false,
      concessionType: profile?.concessionType || "",
      concessionTime: profile?.concessionTime || 0,
    },
  });

  const [loading, setLoading] = useState(false);

  const updateProfile = useMutation(api.profile.update);

  useEffect(() => {
    if (profile) {
      form.reset({
        classroom: profile.classroom || 0,
        gradeIds: profile.gradeIds || [],
        subjectIds: profile.subjectIds || [],
        hasConcession: profile.hasConcession || false,
        concessionType: profile.concessionType || "",
        concessionTime: profile.concessionTime || 0,
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      if (profile?._id) {
        await updateProfile({
          id: profile._id,
          classroom: values.classroom || 0,
          gradeIds: values.gradeIds as Id<"grade">[],
          subjectIds: values.subjectIds as Id<"subject">[],
          hasConcession: values.hasConcession || false,
          concessionType: values.concessionType || "",
          concessionTime: values.concessionTime || 0,
        });

        toast.success("Profile updated", {
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (error: any) {
      toast.error("Update failed", {
        description:
          error.message || "There was an error updating your profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile || !role) {
    return (
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>
            View and update your profile information
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} value={name} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} value={email} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={role === "teacher" ? "Teacher" : "Student"}
                            disabled
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {role === "student" && (
                    <FormField
                      control={form.control}
                      name="classroom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Classroom</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              {/* Role-specific Information */}
              {role === "teacher" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Teaching Information</h3>

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
                </div>
              )}

              {role === "student" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Concession Information
                  </h3>

                  <FormField
                    control={form.control}
                    name="hasConcession"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <FormLabel>Has Concession</FormLabel>
                      </FormItem>
                    )}
                  />

                  {form.watch("hasConcession") && (
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="concessionType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Concession Type</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="concessionTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Extra Time (minutes)</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(parseInt(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
