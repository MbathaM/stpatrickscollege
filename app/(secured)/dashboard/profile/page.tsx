"use client";

import { toast } from "@/components/ui/sonner";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";

export default function ProfilePage() {
  const { data } = authClient.useSession();
  const email = data?.user?.email || "";
  const name = data?.user?.name || "";
  
  // Get user profile
  const profile = useQuery(api.profile.getByEmail, email ? { email } : "skip");
  
  // Get role
  const role = useQuery(api.profile.determineRoleFromEmail, email ? { email } : "skip");
  
  // Get grades and subjects for teachers
  const grades = useQuery(api.grade.list);
  const subjects = useQuery(api.subject.list);
  
  // Form state
  const [formData, setFormData] = useState({
    classroom: profile?.classroom || "",
    gradeIds: profile?.gradeIds || [],
    subjectIds: profile?.subjectIds || [],
    hasConcession: profile?.hasConcession || false,
    concessionType: profile?.concessionType || "",
    concessionTime: profile?.concessionTime || 0,
  });
  
  const [loading, setLoading] = useState(false);
  
  // Update profile mutation
  const updateProfile = useMutation(api.profile.update);
  
  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        classroom: profile.classroom || "",
        gradeIds: profile.gradeIds || [],
        subjectIds: profile.subjectIds || [],
        hasConcession: profile.hasConcession || false,
        concessionType: profile.concessionType || "",
        concessionTime: profile.concessionTime || 0,
      });
    }
  }, [profile]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (profile?._id) {
        await updateProfile({
          id: profile._id,
          classroom: typeof formData.classroom === 'string' ? parseInt(formData.classroom) : formData.classroom,
          gradeIds: [formData.gradeIds[0]], // Wrap in array to match expected type
          subjectIds: formData.subjectIds,
          hasConcession: formData.hasConcession,
          concessionType: formData.concessionType,
          concessionTime: formData.concessionTime,
        });
        
        toast.success("Profile updated", {
          description: "Your profile has been updated successfully.",
        });
      }
    } catch (_) {
      toast.error("Update failed", {
        description: "There was an error updating your profile.",
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
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={email} disabled />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" value={role === "teacher" ? "Teacher" : "Student"} disabled />
                </div>
                
                {role === "student" && (
                  <div className="space-y-2">
                    <Label htmlFor="classroom">Classroom</Label>
                    <Input 
                      id="classroom" 
                      value={formData.classroom} 
                      onChange={(e) => setFormData({...formData, classroom: e.target.value})} 
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Role-specific Information */}
            {role === "teacher" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Teaching Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="grades">Grades</Label>
                  <Select 
                    value={formData.gradeIds[0]?.toString() || ""}
                    onValueChange={(value) => setFormData({...formData, gradeIds: [value as Id<"grade">]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grades you teach" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades?.map((grade) => (
                        <SelectItem key={grade._id} value={grade._id}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subjects">Subjects</Label>
                  <Select
                    value={formData.subjectIds[0]?.toString() || ""}
                    onValueChange={(value) => setFormData({...formData, subjectIds: [value as Id<"subject">]})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subjects you teach" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject) => (
                        <SelectItem key={subject._id} value={subject._id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            {role === "student" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Concession Information</h3>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasConcession"
                    checked={formData.hasConcession}
                    onChange={(e) => setFormData({...formData, hasConcession: e.target.checked})}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="hasConcession">Has Concession</Label>
                </div>
                
                {formData.hasConcession && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="concessionType">Concession Type</Label>
                      <Input
                        id="concessionType"
                        value={formData.concessionType}
                        onChange={(e) => setFormData({...formData, concessionType: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="concessionTime">Extra Time (minutes)</Label>
                      <Input
                        id="concessionTime"
                        type="number"
                        value={formData.concessionTime}
                        onChange={(e) => setFormData({...formData, concessionTime: parseInt(e.target.value)})}
                      />
                    </div>
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
      </Card>
    </div>
  );
}