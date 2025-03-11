"use client";

import { toast } from "@/components/ui/sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";

export function NewTeacherForm({ users }: { users: Option[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);

  // Get subjects and grades for selection
  const subjects = useQuery(api.subject.list) || [];
  const grades = useQuery(api.grade.list) || [];

  // Create teacher profile mutation
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

  const handleGradeToggle = (gradeId: string) => {
    setSelectedGrades((prev) =>
      prev.includes(gradeId)
        ? prev.filter((id) => id !== gradeId)
        : [...prev, gradeId]
    );
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

    if (selectedGrades.length === 0) {
      toast.error("Please select at least one grade");
      return;
    }

    try {
      setLoading(true);

      await createProfile({
        userId: selectedUserId as Id<"ad_user">,
        role: "teacher",
        subjectIds: selectedSubjects as Id<"subject">[],
        gradeIds: selectedGrades as Id<"grade">[],
      });

      toast.success("Teacher profile created successfully");
      router.push("/admin/teachers");
    } catch (error) {
      console.error("Error creating teacher profile:", error);
      toast.error("Failed to create teacher profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Teacher</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="user">Select User *</Label>
              {/* <UserAutocompleteId
                onSelect={handleUserSelect}
                placeholder="Search for a user..."
                disabled={loading}
              /> */}
              <AutoComplete
                  options={users}
                  emptyMessage="No results."
                  placeholder="Select student..."
                  // isLoading={isLoading}
                  onValueChange={(value) => value && handleUserSelect(value.value)}
                  // value=
                  // disabled={isDisabled}
                />
              <p className="text-sm text-muted-foreground">
                Select an Azure AD user to create a teacher profile for.
              </p>
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

            <div className="space-y-2">
              <Label>Grades *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {grades.map((grade) => (
                  <div key={grade._id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`grade-${grade._id}`}
                      checked={selectedGrades.includes(grade._id)}
                      onCheckedChange={() => handleGradeToggle(grade._id)}
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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Teacher"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
