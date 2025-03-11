import { AuthHeader } from "@/components/auth-header";
import { SiteFooter } from "@/components/site-footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div
      className="relative flex flex-col h-screen"
    >
      <AuthHeader />
      <main className="container mx-auto max-w-7xl pt-16 px-2 flex-grow">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
