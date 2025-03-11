"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

export default function SetupPage() {
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const initGrades = useMutation(api.init_grades.initGrades);
  const initSubjects = useMutation(api.init_subjects.initSubjects);

  const handleInitGrades = async () => {
    try {
      setIsLoadingGrades(true);
      const result = await initGrades();
      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "skipped") {
        toast.info(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize grades");
    } finally {
      setIsLoadingGrades(false);
    }
  };

  const handleInitSubjects = async () => {
    try {
      setIsLoadingSubjects(true);
      const result = await initSubjects();
      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "skipped") {
        toast.info(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to initialize subjects");
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">System Setup</h1>
        <div className="flex flex-col items-center space-y-2">
          <Button
            onClick={handleInitGrades}
            disabled={isLoadingGrades}
            className="w-[200px]"
          >
            {isLoadingGrades ? "Initializing Grades..." : "Initialize Grades"}
          </Button>
          <p className="text-sm text-muted-foreground">
            This will create grade entries from Grade 1 to Grade 12
          </p>
          <Button
            onClick={handleInitSubjects}
            disabled={isLoadingSubjects}
            className="w-[200px] mt-4"
          >
            {isLoadingSubjects ? "Initializing Subjects..." : "Initialize Subjects"}
          </Button>
          <p className="text-sm text-muted-foreground">
            This will create entries for all school subjects
          </p>
        </div>
      </div>
    </div>
  );
}