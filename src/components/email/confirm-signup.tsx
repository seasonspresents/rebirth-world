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
    <Html lang="ko">
      <Head />
      <Preview>Confirm your email address to get started with Rebirth World</Preview>
      <Body style={main}>
        <Container style={wrapper}>
          <Section style={container}>
            {/* Logo Section */}
            <Section style={logoSection}>
              <div style={logoBox}>
                <Img
                  src={`${siteUrl}/logo.png`}
                  alt="Rebirth World Logo"
                  width={64}
                  height={64}
                  style={logoImage}
                />
              </div>
            </Section>

            {/* Content Section */}
            <Section style={content}>
              <Heading style={heading}>Confirm your signup</Heading>

              <Text style={paragraph}>
                Welcome to Rebirth World! Click the button below to confirm your email
                address and complete your registration.
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
                If you didn&apos;t create an account with Rebirth World, you can safely
                ignore this email.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  margin: "0",
  padding: "0",
  backgroundColor: "#FCFCFC",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

const wrapper = {
  padding: "32px 16px 24px",
  backgroundColor: "#FCFCFC",
};

const container = {
  maxWidth: "642px",
  margin: "0 auto",
  backgroundColor: "#FFFFFF",
  border: "1px solid #e0e0e0",
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
  color: "#202020",
};

const paragraph = {
  margin: "0 0 24px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#202020",
};

const buttonContainer = {
  marginBottom: "32px",
};

const button = {
  display: "inline-block",
  padding: "7px 11px",
  backgroundColor: "#000000",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "16px",
  textDecoration: "none",
  borderRadius: "3px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
};

const divider = {
  borderTop: "1px solid #d9d9d9",
  margin: "0 0 32px",
};

const footerText = {
  margin: "0 0 12px",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#646464",
};

export default ConfirmSignupEmail;
