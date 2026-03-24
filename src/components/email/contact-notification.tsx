import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactNotificationEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  siteUrl?: string;
}

export function ContactNotificationEmail({
  firstName = "John",
  lastName = "Doe",
  email = "john@example.com",
  message = "I'd like to know more about your rings.",
  siteUrl = "https://rebirth.world",
}: ContactNotificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>New message from {firstName} {lastName}</Preview>
      <Body style={main}>
        <Container style={wrapper}>
          <Section style={container}>
            {/* Logo Section */}
            <Section style={logoSection}>
              <div style={logoBox}>
                <Img
                  src={`${siteUrl}/logo.png`}
                  alt="Rebirth World"
                  width={64}
                  height={64}
                  style={logoImage}
                />
              </div>
            </Section>

            {/* Content Section */}
            <Section style={content}>
              <Heading style={heading}>New Contact Form Message</Heading>

              <Text style={label}>From</Text>
              <Text style={value}>{firstName} {lastName}</Text>

              <Text style={label}>Email</Text>
              <Text style={value}>{email}</Text>

              <Text style={label}>Message</Text>
              <Text style={messageBlock}>{message}</Text>

              {/* Divider */}
              <div style={divider} />

              <Text style={footerText}>
                Reply directly to {email} to respond.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles — match Rebirth brand
const main = {
  margin: "0",
  padding: "0",
  backgroundColor: "#f3ece1",
  fontFamily:
    "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const wrapper = {
  padding: "32px 16px 24px",
  backgroundColor: "#f3ece1",
};

const container = {
  maxWidth: "642px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  border: "1px solid #e0d9cc",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const logoSection = {
  padding: "28px 32px 16px",
  borderBottom: "none",
};

const logoBox = {
  width: "80px",
  height: "80px",
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  display: "inline-flex" as const,
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)",
};

const logoImage = {
  display: "block",
  maxWidth: "64px",
  maxHeight: "64px",
  objectFit: "contain" as const,
};

const content = {
  padding: "0 40px 36px",
};

const heading = {
  margin: "0 0 24px",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "30px",
  color: "#1c1917",
};

const label = {
  margin: "0 0 4px",
  fontSize: "12px",
  fontWeight: "600",
  lineHeight: "16px",
  color: "#897b6b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
};

const value = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1c1917",
};

const messageBlock = {
  margin: "0 0 24px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1c1917",
  padding: "16px",
  backgroundColor: "#f9f6f1",
  borderRadius: "8px",
  border: "1px solid #e0d9cc",
  whiteSpace: "pre-wrap" as const,
};

const divider = {
  borderTop: "1px solid #e0d9cc",
  margin: "0 0 24px",
};

const footerText = {
  margin: "0",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#897b6b",
};

export default ContactNotificationEmail;
