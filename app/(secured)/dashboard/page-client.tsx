"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Id, DataModel } from "@/convex/_generated/dataModel";

type Profile = DataModel["profile"]["document"] | null
type Subject = DataModel["subject"]["document"] []
type Grade = DataModel["grade"]["document"] []

export default function DashboardPageClient({
  name,
  email,
  role,
  profile,
  grades,
  subjects,
}: {
  name: string;
  email: string;
  role: string;
  profile: Profile;
  grades: Grade;
  subjects: Subject;
}) {
  // Filter subjects and grades based on teacher's profile
  const teacherSubjects =
    subjects?.filter((subject) =>
      profile?.subjectIds?.includes(subject._id)
    ) || [];

  const teacherGrades =
    grades?.filter((grade ) =>
      profile?.gradeIds?.includes(grade._id)
    ) || [];

  if (!profile || !role) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome, {name}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Your personal and account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium capitalize">{role}</span>
              </div>
              {role === "student" && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Classroom:</span>
                  <span className="font-medium">
                    {profile?.classroom || "Not set"}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Role-specific cards */}
        {role === "teacher" && (
          <>
            {/* Teacher Subjects Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Subjects</CardTitle>
                <CardDescription>Subjects you are teaching</CardDescription>
              </CardHeader>
              <CardContent>
                {teacherSubjects.length > 0 ? (
                  <ul className="space-y-2">
                    {teacherSubjects.map((subject: any) => (
                      <li key={subject._id} className="flex items-center">
                        <span className="font-medium">{subject.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No subjects assigned yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Teacher Grades Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Grades</CardTitle>
                <CardDescription>Grades you are teaching</CardDescription>
              </CardHeader>
              <CardContent>
                {teacherGrades.length > 0 ? (
                  <ul className="space-y-2">
                    {teacherGrades.map((grade: any) => (
                      <li key={grade._id} className="flex items-center">
                        <span className="font-medium">{grade.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    No grades assigned yet
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Comment Generator Card */}
            <Card>
              <CardHeader>
                <CardTitle>Comment Generator</CardTitle>
                <CardDescription>
                  Generate student comments for reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Quickly create personalized comments for student reports.
                </p>
                <a
                  href="/dashboard/comment"
                  className="text-primary hover:underline font-medium"
                >
                  Go to Comment Generator →
                </a>
              </CardContent>
            </Card>
          </>
        )}

        {role === "student" && (
          <>
            {/* Student Concession Card */}
            <Card>
              <CardHeader>
                <CardTitle>Concession Status</CardTitle>
                <CardDescription>Your exam concession details</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.hasConcession ? (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">
                        {profile?.concessionType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extra Time:</span>
                      <span className="font-medium">
                        {profile?.concessionTime} minutes
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No concessions applied
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Student Subjects Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Subjects</CardTitle>
                <CardDescription>View your enrolled subjects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Access your subject information and resources.
                </p>
                <a
                  href="/dashboard/subjects"
                  className="text-primary hover:underline font-medium"
                >
                  View Subjects →
                </a>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
