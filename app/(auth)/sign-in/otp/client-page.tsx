"use client";
import { OTPForm } from "@/app/(auth)/sign-in/otp/otp-form";
import { ResendOTP } from "@/app/(auth)/sign-in/otp/resend-otp";
import { useSearchParams } from "next/navigation";

export function ClientOTPPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  return (
    <div className="flex flex-col justify-center items-center p-4 ">
      <OTPForm email={email} />
      <ResendOTP email={email} />
    </div>
  );
}
