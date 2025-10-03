import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface OrderConfirmationEmailProps {
  customerName: string;
  orderNumber: string;
  orderDate: string;
  items: Array<{
    patternName: string;
    price: string;
    downloadUrl: string;
  }>;
  total: string;
}

export const OrderConfirmationEmail = ({
  customerName = 'Valued Customer',
  orderNumber = 'PP-12345',
  orderDate = new Date().toLocaleDateString(),
  items = [
    {
      patternName: 'Autumn Forest',
      price: '€6.99',
      downloadUrl: 'https://patternpioneerstudio.com/downloads/autumn-forest',
    },
  ],
  total = '€6.99',
}: OrderConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Pattern Pioneer order is ready to download!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Heading style={h1}>Pattern Pioneer</Heading>
        <Text style={subtitle}>Thank you for your purchase!</Text>

        {/* Main Content */}
        <Section style={section}>
          <Text style={text}>Hi {customerName},</Text>
          <Text style={text}>
            Your order has been confirmed and your patterns are ready to download. Thank you for supporting Pattern Pioneer!
          </Text>
        </Section>

        {/* Order Details */}
        <Section style={orderSection}>
          <Text style={orderTitle}>Order Details</Text>
          <table style={table} cellPadding="0" cellSpacing="0">
            <tr>
              <td style={tableLabel}>Order Number:</td>
              <td style={tableValue}>{orderNumber}</td>
            </tr>
            <tr>
              <td style={tableLabel}>Order Date:</td>
              <td style={tableValue}>{orderDate}</td>
            </tr>
          </table>
        </Section>

        <Hr style={hr} />

        {/* Items */}
        <Section style={section}>
          <Text style={orderTitle}>Your Patterns</Text>
          {items.map((item, index) => (
            <div key={index} style={itemContainer}>
              <Text style={itemName}>{item.patternName}</Text>
              <Text style={itemPrice}>{item.price}</Text>
              <Button style={downloadButton} href={item.downloadUrl}>
                Download Pattern
              </Button>
            </div>
          ))}
        </Section>

        <Hr style={hr} />

        {/* Total */}
        <Section style={totalSection}>
          <Text style={totalText}>
            Total: <strong>{total}</strong>
          </Text>
        </Section>

        {/* License Info */}
        <Section style={infoSection}>
          <Heading as="h2" style={h2}>
            What's Next?
          </Heading>
          <Text style={text}>
            • Download your patterns using the buttons above
            <br />
            • Access your downloads anytime from your account
            <br />
            • Read our{' '}
            <Link href="https://patternpioneerstudio.com/legal/license" style={link}>
              License Agreement
            </Link>{' '}
            for usage terms
            <br />• Use in unlimited commercial and personal projects
          </Text>
        </Section>

        {/* Support */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Need help? Contact us at{' '}
            <Link href="mailto:support@patternpioneerstudio.com" style={link}>
              support@patternpioneerstudio.com
            </Link>
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Pattern Pioneer. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default OrderConfirmationEmail;

// Styles
const main = {
  backgroundColor: '#f6f6f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#1f2937',
  fontSize: '32px',
  fontWeight: '700',
  margin: '40px 0 20px',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const subtitle = {
  color: '#6b7280',
  fontSize: '18px',
  margin: '0 0 40px',
  padding: '0 48px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '20px',
  fontWeight: '600',
  margin: '20px 0 10px',
};

const section = {
  padding: '0 48px',
};

const orderSection = {
  padding: '24px 48px',
  backgroundColor: '#f9fafb',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const orderTitle = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tableLabel = {
  color: '#6b7280',
  fontSize: '14px',
  paddingRight: '16px',
  paddingBottom: '8px',
};

const tableValue = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '500',
  paddingBottom: '8px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const itemContainer = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '16px',
};

const itemName = {
  color: '#1f2937',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
};

const itemPrice = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '0 0 12px',
};

const downloadButton = {
  backgroundColor: '#1f2937',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const totalSection = {
  padding: '0 48px',
  textAlign: 'right' as const,
};

const totalText = {
  color: '#1f2937',
  fontSize: '18px',
  margin: '0',
};

const infoSection = {
  padding: '0 48px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  margin: '0 48px',
};

const link = {
  color: '#1f2937',
  textDecoration: 'underline',
};

const footer = {
  padding: '0 48px',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
  textAlign: 'center' as const,
};
