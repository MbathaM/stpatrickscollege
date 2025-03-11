import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function ResendOTP({ email }: { email: string }) {
  const router = useRouter();
  const handleResend = async () => {
    await authClient.emailOtp.sendVerificationOtp({
      email: email,
      type: "sign-in", // or "email-verification", "forget-password"
      fetchOptions: {
        onSuccess: () => {
          toast.success(
            "OTP resent",{
            description: "Please check your email for the new OTP",
          });
          router.push(`/sign-in/otp?email=${email}`);
        },
        onError: (ctx) => {
          toast.error(
           "Error",{
            description: ctx.error.message,
          });
        },
      },
    });
  };



  return (<div className="flex justify-center items-center p-4 ">
  <p className="text-sm text-gray-500">
    Didn&apos;t receive the OTP?
  </p>
  <Button variant="link" onClick={handleResend}>
        Resend
      </Button>
    </div>
  );
}
