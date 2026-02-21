import { Resend } from "resend";
import { WelcomeEmail } from "@/components/email/welcome";
import { ConfirmSignupEmail } from "@/components/email/confirm-signup";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Email type definitions
export type EmailType = "welcome" | "confirm-signup";

// Props types for each email type
export type EmailProps = {
  welcome: {
    userFirstname: string;
    dashboardUrl?: string;
    siteUrl?: string;
  };
  "confirm-signup": {
    confirmationUrl: string;
    siteUrl?: string;
  };
};

// Email configuration type
interface EmailConfig {
  from: string;
  subject: string;
}

// Configuration for each email type
const emailConfigs: Record<EmailType, EmailConfig> = {
  welcome: {
    from: "Rebirth World <hello@rebirth.world>",
    subject: "Welcome to Rebirth World!",
  },
  "confirm-signup": {
    from: "Rebirth World <hello@rebirth.world>",
    subject: "Confirm your signup",
  },
};

// Email template mapping
const emailTemplates = {
  welcome: WelcomeEmail,
  "confirm-signup": ConfirmSignupEmail,
};

// Type-safe email sending function
export async function sendEmail<T extends EmailType>(
  type: T,
  to: string | string[],
  props: EmailProps[T]
) {
  const config = emailConfigs[type];
  const Template = emailTemplates[type];

  if (!config || !Template) {
    throw new Error(`Unknown email type: ${type}`);
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: config.from,
      to,
      subject: config.subject,
      react: Template(props) as React.ReactElement,
    });

    if (error) {
      console.error("Email send error:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

// Email preview utility (for development)
export function getEmailTemplate<T extends EmailType>(
  type: T,
  props: EmailProps[T]
) {
  const Template = emailTemplates[type];
  if (!Template) {
    throw new Error(`Unknown email type: ${type}`);
  }
  return Template(props) as React.ReactElement;
}
