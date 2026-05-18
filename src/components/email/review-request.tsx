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

interface ReviewRequestItem {
  name: string;
  reviewUrl: string;
  image?: string | null;
}

interface ReviewRequestEmailProps {
  orderNumber: string;
  items: ReviewRequestItem[];
  shippingName?: string;
  siteUrl?: string;
}

export function ReviewRequestEmail({
  orderNumber = "RB-0000",
  items = [],
  shippingName,
  siteUrl = "https://rebirth.world",
}: ReviewRequestEmailProps) {
  const firstName = shippingName?.split(" ")[0];

  return (
    <Html lang="en">
      <Head />
      <Preview>How is your Rebirth piece wearing in?</Preview>
      <Body style={main}>
        <Container style={wrapper}>
          <Section style={container}>
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

            <Section style={content}>
              <Heading style={heading}>How is it wearing in?</Heading>
              <Text style={paragraph}>
                {firstName ? `Hey ${firstName}, ` : ""}
                now that your order has had a little time in the real world,
                we&apos;d love to hear how the fit, finish, and feel are
                settling in.
              </Text>
              <Text style={orderNumberText}>Order {orderNumber}</Text>

              <Hr style={divider} />

              <Text style={sectionLabel}>Leave a verified review</Text>
              <Text style={paragraph}>
                Your note helps future customers understand the materials and
                helps us keep refining the work.
              </Text>

              <Section style={itemsSection}>
                {items.map((item) => (
                  <Section key={item.reviewUrl} style={itemBlock}>
                    {item.image && (
                      <Img
                        src={item.image}
                        alt={item.name}
                        width={72}
                        height={72}
                        style={itemImage}
                      />
                    )}
                    <Text style={itemName}>{item.name}</Text>
                    <Button style={button} href={item.reviewUrl}>
                      Review This Piece
                    </Button>
                  </Section>
                ))}
              </Section>

              <Hr style={divider} />

              <Text style={footerText}>
                Mahalo,
                <br />
                Daniel Malzl
                <br />
                <span style={footerRole}>Founder, Rebirth World</span>
              </Text>
              <Text style={footerTextSmall}>
                Questions about your piece? Just reply to this email.
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
  color: "#1c1917",
};

const paragraph = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "26px",
  color: "#1c1917",
};

const orderNumberText = {
  margin: "0 0 24px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#897b6b",
};

const divider = {
  borderTop: "1px solid #e0d9cc",
  margin: "16px 0",
};

const sectionLabel = {
  margin: "0 0 8px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#897b6b",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const itemsSection = {
  margin: "24px 0 8px",
};

const itemBlock = {
  padding: "16px",
  margin: "0 0 12px",
  border: "1px solid #e0d9cc",
  borderRadius: "10px",
  backgroundColor: "#fffaf2",
};

const itemImage = {
  width: "72px",
  height: "72px",
  borderRadius: "8px",
  objectFit: "cover" as const,
  margin: "0 0 12px",
};

const itemName = {
  margin: "0 0 14px",
  fontSize: "15px",
  fontWeight: "600",
  color: "#1c1917",
};

const button = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#2d8a7e",
  color: "#FFFFFF",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
};

const footerText = {
  margin: "20px 0 8px",
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1c1917",
};

const footerRole = {
  color: "#897b6b",
};

const footerTextSmall = {
  margin: "12px 0 0",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#897b6b",
};

const link = {
  color: "#2d8a7e",
  textDecoration: "underline",
};
