import type { Metadata } from "next";
import SSRContent from "../ssr-content";
import ClientApp from "../client-app";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Secure Password Generator | GetCyberRight",
  description: "Generate strong, unique passwords instantly with our secure password generator. Customize length, character types, and complexity. Free to use.",
  alternates: { canonical: `${BASE_URL}/password-generator` },
  openGraph: {
    title: "Secure Password Generator | GetCyberRight",
    description: "Generate strong, unique passwords instantly with our secure password generator. Customize length, character types, and complexity. Free to use.",
    url: `${BASE_URL}/password-generator`,
    type: "website",
    images: [{ url: `${BASE_URL}/og/scam-guard.png`, width: 1080, height: 1080, alt: "Password Generator" }],
  },
};

export default function PasswordGeneratorPage() {
  return (<>
        <SSRContent
          title="Secure Password Generator"
          description="Generate strong, unique passwords with customizable length and character options."
          sections={[{"heading":"Create Strong Passwords","text":"Customize length, include special characters, numbers, and uppercase. Generate memorable passphrases."}]}
        />
        <ClientApp page="password-generator" />
      </>);
}
