import { Resend } from "resend";
import { envs } from "../../config/envs";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}

export class EmailService {
  private resend: Resend;

  constructor(apiKey: string) {
    this.resend = new Resend(apiKey);
  }

  async sendEmail(options: SendMailOptions): Promise<boolean> {
    const { to, subject, htmlBody, attachements = [] } = options;

    try {
      const sentInformation = await this.resend.emails.send({
        from: envs.MAILER_EMAIL,
        to,
        subject,
        html: htmlBody,
      });

      console.log('Email sent:', sentInformation);

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }
}
