import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ShippingNotificationEmailProps {
  orderNumber: string;
  trackingNumber: string;
  trackingUrl?: string;
  carrier?: string;
  shippingName?: string;
  siteUrl?: string;
}

export function ShippingNotificationEmail({
  orderNumber = "RB-0000",
  trackingNumber = "",
  trackingUrl,
  carrier,
  shippingName,
  siteUrl = "https://rebirth.world",
}: ShippingNotificationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Your order {orderNumber} has shipped!</Preview>
      <Body style={main}>
        <Container style={wrapper}>
          <Section style={container}>
            {/* Logo */}
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

            {/* Content */}
            <Section style={content}>
              <Heading style={heading}>Your Order Has Shipped</Heading>
              <Text style={paragraph}>
                {shippingName ? `Hey ${shippingName.split(" ")[0]}, your` : "Your"}{" "}
                handcrafted piece is on its way. Each ring is made to order in
                the North Shore workshop — we hope you love it.
              </Text>
              <Text style={orderNumberText}>Order {orderNumber}</Text>

              <Hr style={divider} />

              {/* Tracking info */}
              <Text style={sectionLabel}>Tracking Details</Text>
              {carrier && (
                <Text style={detailText}>
                  <span style={detailLabel}>Carrier: </span>
                  {carrier}
                </Text>
              )}
              <Text style={detailText}>
                <span style={detailLabel}>Tracking number: </span>
                <span style={trackingCode}>{trackingNumber}</span>
              </Text>

              {/* Track button */}
              {trackingUrl && (
                <Section style={buttonContainer}>
                  <Button style={button} href={trackingUrl}>
                    Track Your Package
                  </Button>
                </Section>
              )}

              <Hr style={divider} />

              <Text style={footerText}>
                Mahalo,
                <br />
                Daniel Malzl
                <br />
                <span style={footerRole}>Founder, Rebirth World</span>
              </Text>
              <Text style={footerTextSmall}>
                Questions about your order? Just reply to this email.
                <br />
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

// Styles — Rebirth brand colors (matching order-confirmation.tsx)
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
  margin: "0 0 8px",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "30px",
  color: "#1a1a1a",
};

const paragraph = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1a1a1a",
};

const orderNumberText = {
  margin: "0 0 24px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#8a8578",
};

const divider = {
  borderTop: "1px solid #e0d9cc",
  margin: "16px 0",
};

const sectionLabel = {
  margin: "0 0 8px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#8a8578",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const detailText = {
  margin: "0 0 4px",
  fontSize: "14px",
  lineHeight: "20px",
  color: "#1a1a1a",
};

const detailLabel = {
  color: "#8a8578",
};

const trackingCode = {
  fontFamily: "'DM Mono', monospace",
  fontWeight: "500",
};

const buttonContainer = {
  margin: "24px 0 32px",
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

const footerText = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#1a1a1a",
};

const footerRole = {
  fontSize: "14px",
  color: "#8a8578",
};

const footerTextSmall = {
  margin: "0",
  fontSize: "12px",
  lineHeight: "18px",
  color: "#8a8578",
};

const link = {
  color: "#2a9d8f",
  textDecoration: "underline",
};

export default ShippingNotificationEmail;
