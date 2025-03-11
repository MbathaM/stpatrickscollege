"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Form Schema for OTP validation
const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "OTP must be 6 characters.",
  }),
});

export function OTPForm({ email }: { email: string }) {
  const router = useRouter();

  // Form initialization
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Handle form submission
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await authClient.signIn.emailOtp({
      email: email,
      otp: data.otp,
      fetchOptions: {
        onSuccess: () => {
          toast.success(
            "👋 Welcome back!",{
            description: "You have been successfully logged in.",
          });
          router.push("/onboarding");
        },
        onError: (ctx) => {
          toast(
            "😢 Oops!",{
            description: ctx.error.message,
          });
        },
      },
    });
  }

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Heading and Description */}
      <div className="text-center">
        <h1 className="text-2xl font-bold">Verify Your Email</h1>
        <p className="text-sm text-muted-foreground">
          Enter the one-time password (OTP) sent to{" "}
          <span className="font-medium text-primary">{email}</span> to complete
          the sign-in process.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 items-center"
        >
          {/* OTP Input */}
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      {Array.from({ length: 6 }, (_, index) => (
                        <InputOTPSlot key={index} index={index} />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the 6-digit OTP sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="w-1/2 mx-auto">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
