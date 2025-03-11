import { OAuthButton } from "@/app/(auth)/sign-in/oauth-button";
import { EmailForm } from "@/app/(auth)/sign-in/signin-form";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex flex-col justify-center items-center p-4 ">
      <div className="w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold  mb-2">Sign In</h1>
          <p className="text-sm mb-6">
            Enter your email to receive a one-time passcode or sign in with a social account.
          </p>
        </div>

        {/* Email Form */}
        <EmailForm />

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm ">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="flex justify-between gap-3">
          {/* <OAuthButton provider="google" label="Google" className="w-full" size="sm" /> */}
          <OAuthButton provider="microsoft" label="Continue with Microsoft" variant="secondary" className="w-full" size="default" />
        </div>


        {/* Privacy and Terms Links */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}