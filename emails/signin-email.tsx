import {
    Html,
    Tailwind,
    Text,
    Heading,
    Preview,
    Body,
    Section,
    Container,
    Img,
    Link,
  } from "@react-email/components";
  import * as React from "react";
  
  type EmailProps = {
    givenName: string;
    surname: string;
    otp: string;
  };
  
  export default function SignInEmail({ givenName, surname, otp }: EmailProps) {
    return (
      <Html>
        <Preview>Sign in to your St Patrick&apos;s College account</Preview>
        <Tailwind>
          <Body className="bg-gray-100 text-gray-900">
            <Section className="bg-maroon text-white text-center py-6">
              <Container>
                <Img src="/logo.png" alt="St Patrick's College Logo" className="mx-auto mb-2" width="80" height="80" />
                <Heading as="h1" className="text-xl font-semibold">St Patrick&apos;s College</Heading>
              </Container>
            </Section>
  
            <Container className="bg-white shadow-md rounded-lg p-6 mx-auto mt-6 max-w-lg text-center">
              <Heading as="h2" className="text-lg font-semibold text-navy mb-4">
                Sign-in Verification
              </Heading>
              <Text className="text-gray-700 mb-4">
                Hi {givenName} {surname}, <br />
                Use the code below to sign in to your account.
              </Text>
  
              <Text className="text-2xl font-bold text-maroon bg-gray-200 inline-block px-4 py-2 rounded-lg">
                {otp}
              </Text>
  
              <Text className="text-gray-700 mt-4">This code expires in 10 minutes.</Text>
            </Container>
  
            <Section className="text-center text-gray-600 text-sm mt-8">
              <Text>
                If you didn&apos;t request this, please contact{" "}
                <Link href="mailto:support@stpatrickscollege.co.za" className="text-navy font-medium">
                  support@stpatrickscollege.co.za
                </Link>
              </Text>
            </Section>
          </Body>
        </Tailwind>
      </Html>
    );
  }
  