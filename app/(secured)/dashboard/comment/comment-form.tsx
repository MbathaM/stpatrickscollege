"use client";

import { SetStateAction, useState } from "react";

import { client } from "@/api/client";
import { CopyableContent } from "@/components/copyable-content";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CharacterCountTextarea } from "@/components/ui/character-count-textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { DataModel } from "@/convex/_generated/dataModel";

type Profile = DataModel["profile"]["document"] | null;
type Grade = DataModel["grade"]["document"][];
type Subject = DataModel["subject"]["document"][];

export function CommentForm({
  users,
  profile,
  grades,
  subjects,
}: {
  users: Option[];
  profile: Profile;
  grades: Grade;
  subjects: Subject;
}) {
  const teacherSubjects =
    subjects?.filter((subject) => profile?.subjectIds?.includes(subject._id)) ||
    [];

  const teacherGrades =
    grades?.filter((grade) => profile?.gradeIds?.includes(grade._id)) || [];

  // Form state
  const [student, setStudent] = useState<string>("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [prompt, setPrompt] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await client.api.comment.$post({
        json: {
          grade,
          subject,
          student,
          marks,
          prompt,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate comment");
      }

      const data = await response.json();
      console.log(data);
      setComment(data.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Student Comment Generator</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate Comment</CardTitle>
            <CardDescription>
              Fill in the details below to generate a personalized comment for a
              student.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="student">Student Name</Label>
                {/* <UserAutocompleteName
                  users={users}
                  onSelect={setStudent}
                  placeholder="Select student..."
                  disabled={loading}
                /> */}
                <AutoComplete
                  options={users}
                  emptyMessage="No results."
                  placeholder="Select student..."
                  // isLoading={isLoading}
                  onValueChange={(value) => setStudent(value.value)}
                  value={
                    student
                      ? {
                          value: student,
                          label:
                            users.find((u) => u.value === student)?.label ||
                            student,
                        }
                      : undefined
                  }
                  // disabled={isDisabled}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="grade">Grade</Label>
                  <Select
                    value={grade}
                    onValueChange={setGrade}
                    disabled={loading || teacherGrades.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherGrades.map((g) => (
                        <SelectItem key={String(g._id)} value={String(g.name)}>
                          {g.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="subject">Subject</Label>
                  <Select
                    value={subject}
                    onValueChange={setSubject}
                    disabled={loading || teacherSubjects.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherSubjects.map((s) => (
                        <SelectItem key={s._id} value={s.name}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="marks">Marks (optional)</Label>
                <Input
                  id="marks"
                  placeholder="e.g. 85%"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="prompt">Additional Context</Label>
                <CharacterCountTextarea
                  id="prompt"
                  placeholder="Provide additional context about the student's performance..."
                  value={prompt}
                  onChange={(e: {
                    target: { value: SetStateAction<string> };
                  }) => setPrompt(e.target.value)}
                  disabled={loading}
                  maxLength={400}
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStudent("");
                  setGrade("");
                  setSubject("");
                  setMarks("");
                  setPrompt("");
                  setComment("");
                }}
                disabled={loading}
              >
                Reset
              </Button>
              <Button
                type="submit"
                disabled={loading || !student || !grade || !subject}
              >
                {loading ? "Generating..." : "Generate Comment"}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-6">
          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md">
              {error}
            </div>
          )}

          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generated Comment</CardTitle>
              <CardDescription>
                Copy this comment to use in your reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[95%]" />
                  <Skeleton className="h-4 w-[85%]" />
                  <Skeleton className="h-4 w-[90%]" />
                </div>
              ) : comment ? (
                <CopyableContent content={comment} />
              ) : (
                <div className="text-muted-foreground text-center py-8">
                  Fill in the form and click Generate to create a comment
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
