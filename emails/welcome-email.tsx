import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type EmailProps = {
  givenName: string;
  surname: string;
};

export default function WelcomeEmail({ givenName, surname }: EmailProps) {
  return (
    <Html>
      <Preview>Welcome to St Patrick&apos;s College Portal</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-900">
          {/* Header Section */}
          <Section className="bg-maroon text-white text-center py-6">
            <Container>
            <Img src="/logo.png" alt="St Patrick's College Logo" className="mx-auto mb-2" width="80" height="80" />
              <Heading as="h1" className="text-xl font-semibold">
                St Patrick&apos;s College
              </Heading>
            </Container>
          </Section>

          {/* Body Section */}
          <Container className="bg-white shadow-md rounded-lg p-6 mx-auto mt-6 max-w-lg text-center">
            <Heading as="h2" className="text-lg font-semibold text-navy mb-4">
              Welcome, {givenName} {surname}!
            </Heading>
            <Text className="text-gray-700 mb-4">
              We are excited to have you as part of the St Patrick&apos;s
              College community. Your portal access is now active, where you can
              manage your profile, track academic progress, and stay updated
              with school activities.
            </Text>
            <Text className="text-gray-700 mb-6">
              Click the button below to access your account.
            </Text>

            {/* Call-to-Action Button */}
            <Button
              href="https://portal.stpatrickscollege.co.za" // Replace with actual portal link
              className="bg-navy text-white font-semibold py-3 px-6 rounded-md hover:bg-opacity-90"
            >
              Access Your Portal
            </Button>
          </Container>

          {/* Footer Section */}
          <Section className="text-center text-gray-600 text-sm mt-8">
            <Text>
              If you have any issues, please contact us at{" "}
              <Link
                href="mailto:support@stpatrickscollege.co.za"
                className="text-navy font-medium"
              >
                support@stpatrickscollege.co.za
              </Link>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
