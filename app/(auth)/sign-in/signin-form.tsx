"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { siteConfig } from "@/config/site";
import { authClient } from "@/lib/auth-client";
import { CircleHelp, Loader2, Mail } from "lucide-react";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

export function EmailForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "" },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await authClient.emailOtp.sendVerificationOtp({
      email: data.email,
      type: "sign-in",
      fetchOptions: {
        onError: (ctx) => {
          toast.error("😢 Oops!", {
            description: ctx.error.message,
          });
        },
        onSuccess: () => {
          router.push(`/sign-in/otp/?email=${data.email}`);
          toast.success("🔑 Yey! OTP Sent", {
            description: "Please check your email for the OTP.",
          });
        },
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 items-center"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="current-email"
                    placeholder="username@stpatrickscollege.co.za"
                    {...field}
                  />
                </FormControl>
                <Tooltip>
                  <TooltipTrigger asChild>
                    {/* <Button variant="ghost" size="icon"> */}
                    <CircleHelp className="w-4 h-4" />
                    {/* </Button> */}
                  </TooltipTrigger>
                  <TooltipContent>
                    We only support {siteConfig.name} email addresses.
                  </TooltipContent>
                </Tooltip>
              </div>

              {/* <FormDescription>
                Please enter your St Patrick's College email address to receive
                a verification code.
              </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isLoading}
          variant="default"
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Checking...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4" /> Continue with email
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
