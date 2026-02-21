import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ConfirmSignupEmailProps {
  confirmationUrl?: string;
  siteUrl?: string;
}

export function ConfirmSignupEmail({
  confirmationUrl = "https://rebirth.world/auth/callback?token_hash=example&type=email",
  siteUrl = "https://rebirth.world",
}: ConfirmSignupEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Confirm your email — you&apos;re one click away from Rebirth</Preview>
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
              <Heading style={heading}>Confirm your email</Heading>

              <Text style={paragraph}>
                You&apos;re one click away from joining the Rebirth community.
                Tap the button below to confirm your email and you&apos;re in.
              </Text>

              {/* Button */}
              <Section style={buttonContainer}>
                <Button style={button} href={confirmationUrl}>
                  Confirm email
                </Button>
              </Section>

              {/* Divider */}
              <div style={divider} />

              {/* Footer Text */}
              <Text style={footerText}>This link expires in 15 minutes.</Text>

              <Text style={footerText}>
                If you didn&apos;t create an account with Rebirth World, you can
                safely ignore this email.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles — Rebirth brand colors
const main = {
  margin: "0",
  padding: "0",
  backgroundColor: "#f5f0e8",
  fontFamily:
    "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const wrapper = {
  padding: "32px 16px 24px",
  backgroundColor: "#f5f0e8",
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
  margin: "0 0 16px",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "30px",
  color: "#1a1a1a",
};

const paragraph = {
  margin: "0 0 24px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1a1a1a",
};

const buttonContainer = {
  marginBottom: "32px",
};

const button = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#2a9d8f",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "16px",
  textDecoration: "none",
  borderRadius: "6px",
};

const divider = {
  borderTop: "1px solid #e0d9cc",
  margin: "0 0 32px",
};

const footerText = {
  margin: "0 0 12px",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#8a8578",
};

export default ConfirmSignupEmail;
