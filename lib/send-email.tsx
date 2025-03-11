import ForgotPasswordEmail from "@/emails/forgot-password-email";
import SignInEmail from "@/emails/signin-email";
import VerifyAccountEmail from "@/emails/verify-account-email"; // Missing import
import WelcomeEmail from "@/emails/welcome-email";
import { mailService, SendMailConfiguration } from "@/utils/mail.service";

export const sendEmail = async (
  config: SendMailConfiguration
): Promise<{ success: boolean; message: string }> => {
  return mailService.sendMail(config);
};

export async function sendWelcomeMail(email: string, givenName: string, surname: string) {
  await sendEmail({
    email,
    subject: "Welcome", // Ensure subject is a string
    template: <WelcomeEmail givenName={givenName} surname={surname} />,
  });
}

export async function sendForgotPasswordEmail(email: string, givenName: string, surname: string, otp: string) {
  await sendEmail({
    email,
    subject: "Password Reset", // Add a subject
    template: <ForgotPasswordEmail givenName={givenName} surname={surname} otp={otp} />,
  });
}

export async function sendSignInEmail(email: string, givenName: string, surname: string, otp: string) {
  await sendEmail({
    email,
    subject: "Sign-In OTP", // Fix duplicate subject
    template: <SignInEmail givenName={givenName} surname={surname} otp={otp} />,
  });
}

export async function sendVerifyAccountEmail(email: string, givenName: string, surname: string, otp: string) {
  await sendEmail({
    email,
    subject: "Verify Your Account", // Ensure subject is a string
    template: <VerifyAccountEmail givenName={givenName} surname={surname} otp={otp} />,
  });
}
