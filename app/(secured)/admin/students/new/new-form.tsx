"use client";

import { toast } from "@/components/ui/sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function NewStudentForm({ users }: { users: Option[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  // Get subjects and grades for selection
  const subjects = useQuery(api.subject.list) || [];
  const grades = useQuery(api.grade.list) || [];

  // Create student profile mutation
  const createProfile = useMutation(api.profile.create);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const handleGradeSelect = (gradeId: string) => {
    setSelectedGrade(gradeId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }

    if (selectedSubjects.length === 0) {
      toast.error("Please select at least one subject");
      return;
    }

    if (!selectedGrade) {
      toast.error("Please select a grade");
      return;
    }

    try {
      setLoading(true);

      await createProfile({
        userId: selectedUserId as Id<"ad_user">,
        role: "student",
        subjectIds: selectedSubjects as Id<"subject">[],
        gradeIds: [selectedGrade as Id<"grade">],
      });

      toast.success("Student profile created successfully");
      router.push("/admin/students");
    } catch (error) {
      console.error("Error creating student profile:", error);
      toast.error("Failed to create student profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Student</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user">Select User *</Label>
              <AutoComplete
                options={users}
                emptyMessage="No results."
                placeholder="Select student..."
                onValueChange={(value) => value && handleUserSelect(value.value)}
              />
              <p className="text-sm text-muted-foreground">
                Select an Azure AD user to create a student profile for.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Grade *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {grades.map((grade) => (
                  <div key={grade._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade._id}`}
                      checked={selectedGrade === grade._id}
                      onCheckedChange={() => handleGradeSelect(grade._id)}
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`grade-${grade._id}`}
                      className="cursor-pointer"
                    >
                      {grade.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Subjects *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {subjects.map((subject) => (
                  <div
                    key={subject._id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`subject-${subject._id}`}
                      checked={selectedSubjects.includes(subject._id)}
                      onCheckedChange={() => handleSubjectToggle(subject._id)}
                      disabled={loading}
                    />
                    <Label
                      htmlFor={`subject-${subject._id}`}
                      className="cursor-pointer"
                    >
                      {subject.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Student"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}