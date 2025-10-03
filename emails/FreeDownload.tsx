import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface FreeDownloadEmailProps {
  patternName: string;
  downloadUrl: string;
}

export const FreeDownloadEmail = ({
  patternName = 'Autumn Forest',
  downloadUrl = 'https://patternpioneerstudio.com/downloads/free/autumn-forest',
}: FreeDownloadEmailProps) => (
  <Html>
    <Head />
    <Preview>Your free {patternName} pattern is ready!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Heading style={h1}>Pattern Pioneer</Heading>
        <Text style={subtitle}>Your Free Pattern is Ready!</Text>

        {/* Main Content */}
        <Section style={section}>
          <Text style={text}>Thank you for your interest in Pattern Pioneer!</Text>
          <Text style={text}>
            We're excited to share the <strong>{patternName}</strong> pattern with you. This is a
            free preview version (1024×1024) that you can use to test the pattern in your projects.
          </Text>
        </Section>

        {/* Download Button */}
        <Section style={buttonSection}>
          <Button style={downloadButton} href={downloadUrl}>
            Download Free Pattern
          </Button>
        </Section>

        {/* Pattern Info */}
        <Section style={infoSection}>
          <Heading as="h2" style={h2}>
            What You're Getting
          </Heading>
          <Text style={text}>
            • <strong>Resolution:</strong> 1024×1024 pixels
            <br />
            • <strong>Format:</strong> PNG with transparency
            <br />
            • <strong>Usage:</strong> Personal projects only
            <br />• <strong>Seamless:</strong> Tiles perfectly
          </Text>
        </Section>

        <Hr style={hr} />

        {/* Upgrade CTA */}
        <Section style={upgradeSection}>
          <Heading as="h2" style={h2}>
            Love This Pattern?
          </Heading>
          <Text style={text}>
            Upgrade to the high-resolution version (4096×4096) for just <strong>€6.99</strong> and
            unlock commercial use rights!
          </Text>
          <ul style={list}>
            <li style={listItem}>4x higher resolution for print quality</li>
            <li style={listItem}>Commercial use license included</li>
            <li style={listItem}>Use in unlimited projects</li>
            <li style={listItem}>Print-on-demand allowed</li>
            <li style={listItem}>Lifetime access and re-downloads</li>
          </ul>
          <Button style={upgradeButton} href="https://patternpioneerstudio.com/patterns">
            Browse All Patterns
          </Button>
        </Section>

        <Hr style={hr} />

        {/* Newsletter */}
        <Section style={newsletterSection}>
          <Heading as="h3" style={h3}>
            Get 4 New Patterns Weekly
          </Heading>
          <Text style={smallText}>
            Subscribe to our newsletter for updates on new pattern releases, special offers, and design tips.
          </Text>
          <Button style={newsletterButton} href="https://patternpioneerstudio.com/#newsletter">
            Subscribe to Newsletter
          </Button>
        </Section>

        {/* Footer */}
        <Hr style={hr} />
        <Section style={footer}>
          <Text style={footerText}>
            Questions? Contact us at{' '}
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

export default FreeDownloadEmail;

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

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px',
  textAlign: 'center' as const,
};

const section = {
  padding: '0 48px',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const buttonSection = {
  padding: '32px 48px',
  textAlign: 'center' as const,
};

const downloadButton = {
  backgroundColor: '#1f2937',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
};

const upgradeButton = {
  backgroundColor: '#1f2937',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 28px',
  margin: '16px 0 0',
};

const newsletterButton = {
  backgroundColor: 'transparent',
  border: '2px solid #1f2937',
  borderRadius: '6px',
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 24px',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '32px 0',
};

const infoSection = {
  padding: '24px 48px',
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  margin: '0 48px',
};

const upgradeSection = {
  padding: '24px 48px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  margin: '0 48px',
};

const newsletterSection = {
  padding: '24px 48px',
  textAlign: 'center' as const,
};

const list = {
  margin: '16px 0',
  paddingLeft: '20px',
};

const listItem = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '20px',
  marginBottom: '8px',
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
