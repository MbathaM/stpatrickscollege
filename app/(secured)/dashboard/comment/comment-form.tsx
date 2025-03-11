"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";

import { CopyableContent } from "@/components/copyable-content";
import { AutoComplete, type Option } from "@/components/ui/autocomplete";
import { Skeleton } from "@/components/ui/skeleton";
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
import { authClient } from "@/lib/auth-client";
import { client } from "@/api/client";

export function CommentForm({ users }: { users: Option[] }) {
  const { data } = authClient.useSession();
  const email = data?.user?.email || "";

  // Get teacher profile
  const profile = useQuery(api.profile.getByEmail, email ? { email } : "skip");

  // Get grades and subjects
  const grades = useQuery(api.grade.list);
  const subjects = useQuery(api.subject.list);

  // Filter subjects and grades based on teacher's profile
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
      // const response = await fetch("/api/v1/comment", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     grade,
      //     subject,
      //     student,
      //     marks,
      //     prompt,
      //   }),
      // });
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
                        <SelectItem key={g._id} value={g.name}>
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
                  onChange={(e) => setPrompt(e.target.value)}
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
