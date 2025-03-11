"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { useTransition } from "react";
import { Icons } from "@/components/icons";

export function OAuthButton({
  provider,
  label,
  variant = "outline",
  size = "sm",
  className,

}: {
  provider: "google" | "microsoft";
  label: string;
  variant?: "outline" | "default" | "secondary" | "ghost";
  size?: "sm" | "default";
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleSignIn = async () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: provider,
        callbackURL: "/onboarding",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(
              "😢 Oops!",{
              description: ctx.error.message,
            
            });
          },
          onSuccess: () => {
            toast.success(
             "🎉 Yey!",{
              description: "You have successfully signed in.",
        
            });
          },
        },
      });
    });
  };

  const ProviderIcon = Icons[provider as keyof typeof Icons]; // Dynamically get the correct icon

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignIn}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Icons.spinner className="w-4 h-4 mr-2 animate-spin" /> {label}
        </>
      ) : (
        <>
          <ProviderIcon className="w-4 h-4 mr-2" /> {label}
        </>
      )}
    </Button>
  );
}
