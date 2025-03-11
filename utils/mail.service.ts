import { render } from "@react-email/render";
import * as nodemailer from "nodemailer";
import { Attachment } from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface SendMailConfiguration {
  email: string;
  subject?: string;
  text?: string;
  replyTo?: string;
  attachments?: Attachment[];
  template: React.ReactElement;
}

class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      {
        host: process.env.EMAIL_SERVER_HOST as string,
        port: Number(process.env.EMAIL_SERVER_PORT),
        secure: process.env.EMAIL_SERVER_USE_SSL === "true",
        auth: {
          user: process.env.EMAIL_SERVER_USER as string,
          pass: process.env.EMAIL_SERVER_PASSWORD as string,
        },
      } as SMTPTransport.Options
    );
  }

  private async generateEmail(template: React.ReactElement): Promise<{ html: string; text: string }> {
      const html = await render(template);
      const text = html.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML for a text fallback
      return { html, text };
    }

  async sendMail({
    email,
    subject = "No Subject",
    text,
    template,
    replyTo,
    attachments,
  }: SendMailConfiguration): Promise<{ success: boolean; message: string }> {
    try {
      const { html, text: generatedText } = await this.generateEmail(template);

      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject,
        text: text || generatedText,
        html,
        replyTo: replyTo || process.env.EMAIL_FROM,
        attachments,
      });

      return {
        success: true,
        message: "Email sent successfully",
      };
    } catch (error) {
      console.error("Error sending email:", error);

      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send email",
      };
    }
  }
}

// Define a type for the global mail service instance
type GlobalWithMail = typeof global & {
  mail?: MailService;
};

// Use type-safe global variable
const globalForMail = global as GlobalWithMail;

// Create or reuse the MailService instance
export const mailService = globalForMail.mail ?? new MailService();

// Store the MailService instance in the global object in non-production environments
if (process.env.NODE_ENV !== "production") {
  globalForMail.mail = mailService;
}
