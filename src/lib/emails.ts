import { Resend } from "resend";
import { WelcomeEmail } from "@/components/email/welcome";
import { ConfirmSignupEmail } from "@/components/email/confirm-signup";
import { OrderConfirmationEmail } from "@/components/email/order-confirmation";
import { ShippingNotificationEmail } from "@/components/email/shipping-notification";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Email type definitions
export type EmailType = "welcome" | "confirm-signup" | "order-confirmation" | "shipping-notification";

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
  "order-confirmation": {
    orderNumber: string;
    items: Array<{
      name: string;
      quantity: number;
      unitPrice: number;
      image?: string | null;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress?: {
      name?: string;
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postalCode?: string;
      country?: string;
    };
    orderUrl?: string;
    siteUrl?: string;
  };
  "shipping-notification": {
    orderNumber: string;
    trackingNumber: string;
    trackingUrl?: string;
    carrier?: string;
    shippingName?: string;
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
  "order-confirmation": {
    from: "Rebirth World <hello@rebirth.world>",
    subject: "Order confirmed — Rebirth World",
  },
  "shipping-notification": {
    from: "Rebirth World <hello@rebirth.world>",
    subject: "Your order has shipped — Rebirth World",
  },
};

// Email template mapping
const emailTemplates = {
  welcome: WelcomeEmail,
  "confirm-signup": ConfirmSignupEmail,
  "order-confirmation": OrderConfirmationEmail,
  "shipping-notification": ShippingNotificationEmail,
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      react: (Template as any)(props) as React.ReactElement,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (Template as any)(props) as React.ReactElement;
}
