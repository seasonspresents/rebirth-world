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
  Row,
  Column,
  Section,
  Text,
} from "@react-email/components";

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number; // in cents
  image?: string | null;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number; // cents
  shipping: number; // cents
  tax: number; // cents
  total: number; // cents
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
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function OrderConfirmationEmail({
  orderNumber = "RB-0000",
  items = [],
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  shippingAddress,
  orderUrl = "https://rebirth.world/shop",
  siteUrl = "https://rebirth.world",
}: OrderConfirmationEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>Order {orderNumber} confirmed — Rebirth World</Preview>
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
              <Heading style={heading}>Order Confirmed</Heading>
              <Text style={paragraph}>
                Thank you for your order! We&apos;re getting your handcrafted
                pieces ready.
              </Text>
              <Text style={orderNumberText}>Order {orderNumber}</Text>

              {/* Items */}
              <Section style={itemsSection}>
                {items.map((item, i) => (
                  <Row key={i} style={itemRow}>
                    <Column style={itemImageCol}>
                      {item.image ? (
                        <Img
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          style={itemImage}
                        />
                      ) : (
                        <div style={itemImagePlaceholder} />
                      )}
                    </Column>
                    <Column style={itemDetailCol}>
                      <Text style={itemName}>{item.name}</Text>
                      <Text style={itemQty}>Qty: {item.quantity}</Text>
                    </Column>
                    <Column style={itemPriceCol}>
                      <Text style={itemPrice}>
                        {formatCents(item.unitPrice * item.quantity)}
                      </Text>
                    </Column>
                  </Row>
                ))}
              </Section>

              <Hr style={divider} />

              {/* Totals */}
              <Section>
                <Row style={totalRow}>
                  <Column>
                    <Text style={totalLabel}>Subtotal</Text>
                  </Column>
                  <Column>
                    <Text style={totalValue}>{formatCents(subtotal)}</Text>
                  </Column>
                </Row>
                <Row style={totalRow}>
                  <Column>
                    <Text style={totalLabel}>Shipping</Text>
                  </Column>
                  <Column>
                    <Text style={totalValue}>{formatCents(shipping)}</Text>
                  </Column>
                </Row>
                {tax > 0 && (
                  <Row style={totalRow}>
                    <Column>
                      <Text style={totalLabel}>Tax</Text>
                    </Column>
                    <Column>
                      <Text style={totalValue}>{formatCents(tax)}</Text>
                    </Column>
                  </Row>
                )}
                <Hr style={divider} />
                <Row style={totalRow}>
                  <Column>
                    <Text style={grandTotalLabel}>Total</Text>
                  </Column>
                  <Column>
                    <Text style={grandTotalValue}>{formatCents(total)}</Text>
                  </Column>
                </Row>
              </Section>

              {/* Shipping address */}
              {shippingAddress && (
                <>
                  <Hr style={divider} />
                  <Text style={sectionLabel}>Shipping To</Text>
                  <Text style={addressText}>
                    {shippingAddress.name && (
                      <>
                        {shippingAddress.name}
                        <br />
                      </>
                    )}
                    {shippingAddress.line1 && (
                      <>
                        {shippingAddress.line1}
                        <br />
                      </>
                    )}
                    {shippingAddress.line2 && (
                      <>
                        {shippingAddress.line2}
                        <br />
                      </>
                    )}
                    {[
                      shippingAddress.city,
                      shippingAddress.state,
                      shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    {shippingAddress.country && (
                      <>
                        <br />
                        {shippingAddress.country}
                      </>
                    )}
                  </Text>
                </>
              )}

              {/* CTA */}
              <Section style={buttonContainer}>
                <Button style={button} href={orderUrl}>
                  View Your Order
                </Button>
              </Section>

              <Hr style={divider} />

              <Text style={footerText}>
                Best,
                <br />
                The Rebirth World Team
              </Text>
              <Text style={footerTextSmall}>
                If you have any questions about your order, reply to this email.
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
  color: "#202020",
};

const paragraph = {
  margin: "0 0 16px",
  fontSize: "16px",
  lineHeight: "24px",
  color: "#202020",
};

const orderNumberText = {
  margin: "0 0 24px",
  fontSize: "14px",
  fontWeight: "600",
  color: "#646464",
};

const itemsSection = {
  marginBottom: "0",
};

const itemRow = {
  marginBottom: "12px",
};

const itemImageCol = {
  width: "64px",
  verticalAlign: "top" as const,
};

const itemImage = {
  borderRadius: "8px",
  objectFit: "cover" as const,
};

const itemImagePlaceholder = {
  width: "64px",
  height: "64px",
  borderRadius: "8px",
  backgroundColor: "#f0f0f0",
};

const itemDetailCol = {
  paddingLeft: "12px",
  verticalAlign: "top" as const,
};

const itemName = {
  margin: "0 0 2px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#202020",
};

const itemQty = {
  margin: "0",
  fontSize: "12px",
  color: "#646464",
};

const itemPriceCol = {
  textAlign: "right" as const,
  verticalAlign: "top" as const,
};

const itemPrice = {
  margin: "0",
  fontSize: "14px",
  fontWeight: "500",
  color: "#202020",
};

const divider = {
  borderTop: "1px solid #e0e0e0",
  margin: "16px 0",
};

const totalRow = {
  marginBottom: "4px",
};

const totalLabel = {
  margin: "0",
  fontSize: "14px",
  color: "#646464",
};

const totalValue = {
  margin: "0",
  fontSize: "14px",
  color: "#202020",
  textAlign: "right" as const,
};

const grandTotalLabel = {
  margin: "0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#202020",
};

const grandTotalValue = {
  margin: "0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#202020",
  textAlign: "right" as const,
};

const sectionLabel = {
  margin: "0 0 4px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#646464",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const addressText = {
  margin: "0 0 16px",
  fontSize: "14px",
  lineHeight: "20px",
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

export default OrderConfirmationEmail;
