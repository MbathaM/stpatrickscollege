"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { getAdUsers } from "@/helpers/get-ad-user";
import { manualCreateUser } from "@/utils/manual-create-user";

export default function SetupPage() {
  const [isLoadingGrades, setIsLoadingGrades] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(false);
  const [isGeneratingUsers, setIsGeneratingUsers] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
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

  const handleGenerateUsers = async () => {
    try {
      setIsGeneratingUsers(true);
      setProgress({ current: 0, total: 0 });
      
      // Fetch all users from Azure AD
      toast.info("Fetching users from Azure AD...");
      const azureUsers = await getAdUsers();
      
      if (!azureUsers || azureUsers.length === 0) {
        toast.error("No users found in Azure AD");
        return;
      }
      
      toast.success(`Found ${azureUsers.length} users in Azure AD`);
      setProgress({ current: 0, total: azureUsers.length });
      
      // Process each user
      let created = 0;
      let skipped = 0;
      let failed = 0;
      
      for (let i = 0; i < azureUsers.length; i++) {
        const user = azureUsers[i];
        try {
          // Update progress
          setProgress({ current: i + 1, total: azureUsers.length });
          
          // Skip users without email
          if (!user.mail) {
            skipped++;
            continue;
          }
          
          // Create user in the system
          const result = await manualCreateUser(user.mail);
          
          if (result.userCreated || result.adUserCreated || result.profileCreated) {
            created++;
          } else {
            skipped++;
          }
        } catch (error) {
          console.error(`Error creating user ${user.displayName || user.id}:`, error);
          failed++;
        }
      }
      
      // Show final results
      toast.success(
        `User generation complete: ${created} created, ${skipped} skipped, ${failed} failed`
      );
    } catch (error) {
      console.error("Error generating users:", error);
      toast.error("Failed to generate users");
    } finally {
      setIsGeneratingUsers(false);
      setProgress({ current: 0, total: 0 });
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
          
          <Button
            onClick={handleGenerateUsers}
            disabled={isGeneratingUsers}
            className="w-[200px] mt-4"
          >
            {isGeneratingUsers ? "Generating Users..." : "Generate All Users"}
          </Button>
          <p className="text-sm text-muted-foreground">
            This will create user records for all Azure AD users
          </p>
          
          {isGeneratingUsers && progress.total > 0 && (
            <div className="w-[200px] mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-center mt-1">
                {progress.current} of {progress.total} users processed
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}