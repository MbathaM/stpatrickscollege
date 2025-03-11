import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function IndexPage() {
  return (
    <>
      <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
        <div className="flex max-w-[980px] flex-col items-start gap-2">
          <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
            Welcome to {siteConfig.name} Internal Portal <br className="hidden sm:inline" />
            For Teachers and Students
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            This portal is designed exclusively for internal use by teachers and students of {siteConfig.name}. 
            Access resources, tools, and information to support your academic journey.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/resources" // Update this link to point to internal resources
            className={buttonVariants({ size: "sm" })}
          >
            Access Resources
          </Link>
          <Link
            href="https://www.spckokstad.com/"
            target="_blank"
            rel="noreferrer"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Visit Main Website
          </Link>
        </div>
      </section>
    </>
  );
}