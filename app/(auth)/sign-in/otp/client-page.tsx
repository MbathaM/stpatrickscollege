"use client";
import { OTPForm } from "@/app/(auth)/sign-in/otp/otp-form";
import { ResendOTP } from "@/app/(auth)/sign-in/otp/resend-otp";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OTPContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <OTPForm email={email} />
      <ResendOTP email={email} />
    </div>
  );
}

export function ClientOTPPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <span className="flex items-center text-sm">
            <Loader2 className="animate-spin mr-2" />
            Loading...
          </span>
        </div>
      }
    >
      <OTPContent />
    </Suspense>
  );
}
