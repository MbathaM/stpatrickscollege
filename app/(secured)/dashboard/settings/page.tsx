"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { authClient } from "@/lib/auth-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export default function SettingsPage() {
  const { data } = authClient.useSession();
  const email = data?.user?.email || "";
  const name = data?.user?.name || "";
  
  // Get user profile
  const profile = useQuery(api.profile.getByEmail, email ? { email } : "skip");
  
  // Get role
  const role = useQuery(api.profile.determineRoleFromEmail, email ? { email } : "skip");
  
  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved", {
        description: "Your settings have been updated successfully.",
      });
    }, 1000);
  };
  
  if (!profile || !role) {
    return (
      <div className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
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
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="grid gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about important updates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark mode
                </p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Role-specific settings */}
        {role === "teacher" && (
          <Card>
            <CardHeader>
              <CardTitle>Teacher Settings</CardTitle>
              <CardDescription>
                Configure your teaching preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-save">Auto-save Comments</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save comment drafts while typing
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {role === "student" && (
          <Card>
            <CardHeader>
              <CardTitle>Student Settings</CardTitle>
              <CardDescription>
                Configure your learning preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="assignment-reminders">Assignment Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders about upcoming assignments
                  </p>
                </div>
                <Switch
                  id="assignment-reminders"
                  checked={true}
                  onCheckedChange={() => {}}
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}