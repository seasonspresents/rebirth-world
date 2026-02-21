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

interface WelcomeEmailProps {
  userFirstname?: string;
  dashboardUrl?: string;
  siteUrl?: string;
}

export function WelcomeEmail({
  userFirstname = "there",
  dashboardUrl = "https://rebirth.world/dashboard",
  siteUrl = "https://rebirth.world",
}: WelcomeEmailProps) {
  return (
    <Html lang="ko">
      <Head />
      <Preview>Welcome to Rebirth World - Let&apos;s get started</Preview>
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
              <Heading style={heading}>Welcome to Rebirth World</Heading>

              <Text style={paragraph}>Hi {userFirstname},</Text>

              <Text style={paragraph}>
                Welcome to Rebirth World! We&apos;re excited to have you on board.
                You&apos;re now part of a platform that helps you build amazing
                SaaS products faster.
              </Text>

              <Text style={paragraph}>
                Ready to get started? Click the button below to explore your
                dashboard and begin your journey.
              </Text>

              {/* Button */}
              <Section style={buttonContainer}>
                <Button style={button} href={dashboardUrl}>
                  Get started
                </Button>
              </Section>

              {/* Divider */}
              <div style={divider} />

              {/* Footer Text */}
              <Text style={footerText}>
                Best,
                <br />
                The Rebirth World Team
              </Text>

              <Text style={footerTextSmall}>
                If you have any questions, feel free to reply to this email.
                We&apos;re here to help!
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
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#202020",
};

const buttonContainer = {
  margin: "24px 0 32px",
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
  margin: "0 0 24px",
};

const footerText = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#202020",
};

const footerTextSmall = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#646464",
};

export default WelcomeEmail;
