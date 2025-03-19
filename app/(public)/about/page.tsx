import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="max-w-[980px] mx-auto">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl mb-4">
          About Our Portal
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to St. Patrick's College's internal portal - a comprehensive platform designed to enhance the educational experience for our teachers and students.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Features */}
          <Card>
            <CardHeader>
              <CardTitle>For Students</CardTitle>
              <CardDescription>Features designed for student success</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Academic Management</h3>
                <p className="text-muted-foreground">Access your subjects, view assignments, and track your academic progress all in one place.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Exam Concessions</h3>
                <p className="text-muted-foreground">View and manage your exam concessions, including extra time allocations and special arrangements.</p>
              </div>
            </CardContent>
          </Card>

          {/* Teacher Features */}
          <Card>
            <CardHeader>
              <CardTitle>For Teachers</CardTitle>
              <CardDescription>Tools to enhance teaching efficiency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Class Management</h3>
                <p className="text-muted-foreground">Manage your subjects, grades, and student information efficiently.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Report Generation</h3>
                <p className="text-muted-foreground">Generate personalized student comments and reports with our AI-powered tools.</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Tools */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Tools</CardTitle>
              <CardDescription>Advanced features for enhanced productivity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Text Translation</h3>
                <p className="text-muted-foreground">Translate text between multiple languages to support multilingual communication.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Text Summarization</h3>
                <p className="text-muted-foreground">Generate concise summaries of long texts for efficient information processing.</p>
              </div>
            </CardContent>
          </Card>

          {/* Administrative Tools */}
          <Card>
            <CardHeader>
              <CardTitle>Administrative Features</CardTitle>
              <CardDescription>Comprehensive management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Inventory Management</h3>
                <p className="text-muted-foreground">Track and manage school assets, supplies, and equipment efficiently.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">User Management</h3>
                <p className="text-muted-foreground">Manage user accounts, roles, and permissions through our secure system.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
