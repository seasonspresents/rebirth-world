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
  shopUrl?: string;
  siteUrl?: string;
}

export function WelcomeEmail({
  userFirstname = "there",
  shopUrl = "https://rebirth.world/shop",
  siteUrl = "https://rebirth.world",
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Welcome to Rebirth World — handcrafted from recycled skateboards</Preview>
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
              <Heading style={heading}>Welcome to Rebirth</Heading>

              <Text style={paragraph}>Hey {userFirstname},</Text>

              <Text style={paragraph}>
                Thanks for joining the Rebirth community. Every ring we make
                starts as a broken skateboard donated by local riders on the
                North Shore of Oahu. Daniel shapes each one by hand — seven
                layers of maple, sanded, sealed, and turned into something
                you&apos;ll wear every day.
              </Text>

              <Text style={paragraph}>
                Browse the collection and find the piece that speaks to you.
              </Text>

              {/* Button */}
              <Section style={buttonContainer}>
                <Button style={button} href={shopUrl}>
                  Browse the shop
                </Button>
              </Section>

              {/* Divider */}
              <div style={divider} />

              {/* Footer */}
              <Text style={footerText}>
                Mahalo,
                <br />
                Daniel Malzl
                <br />
                <span style={footerRole}>Founder, Rebirth World</span>
              </Text>

              <Text style={footerTextSmall}>
                Follow along on{" "}
                <a href="https://instagram.com/rebirthrings" style={link}>
                  Instagram @rebirthrings
                </a>
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
  margin: "0 0 16px",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "30px",
  color: "#1c1917",
};

const paragraph = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1c1917",
};

const buttonContainer = {
  margin: "24px 0 32px",
};

const button = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#2d8a7e",
  color: "#FFFFFF",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "16px",
  textDecoration: "none",
  borderRadius: "6px",
};

const divider = {
  borderTop: "1px solid #e0d9cc",
  margin: "0 0 24px",
};

const footerText = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1c1917",
};

const footerRole = {
  fontSize: "14px",
  color: "#897b6b",
};

const footerTextSmall = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#897b6b",
};

const link = {
  color: "#2d8a7e",
  textDecoration: "underline",
};

export default WelcomeEmail;
