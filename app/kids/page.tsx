import type { Metadata } from "next";
import { JsonLd } from "../components/json-ld";
import PageContent from "@/pages/kids";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Online Safety for Kids & Teens (Ages 8-16): Free Lessons | GetCyberRight",
  description:
    "Free interactive cybersecurity lessons for kids and teens ages 8 to 16. Teach your children about password safety, spotting scams, cyberbullying, and being a good digital citizen.",
  alternates: { canonical: `${BASE_URL}/kids` },
  keywords:
    "online safety for kids, cybersecurity for teens, password safety for children, kids cyberbullying, digital citizenship for kids, internet safety lessons ages 8 to 16, free safety lessons no signup, COPPA-friendly kids resources, parent-led online safety, kids safe internet activities",
  openGraph: {
    title: "Online Safety for Kids & Teens (Ages 8-16): Free Lessons | GetCyberRight",
    description:
      "Free interactive cybersecurity lessons for kids and teens ages 8 to 16. Teach your children about password safety, spotting scams, cyberbullying, and being a good digital citizen.",
    url: `${BASE_URL}/kids`,
    type: "website",
    images: [
      {
        url: `${BASE_URL}/og/education.png`,
        width: 1080,
        height: 1080,
        alt: "Kids Online Safety",
      },
    ],
  },
};

export const revalidate = 3600;

export default function KidsPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Kids & Teens Online Safety Lessons",
      description: "Free, interactive cybersecurity lessons designed for children and teens ages 8 to 16. Topics include password safety, recognizing scams, cyberbullying prevention, and digital citizenship.",
      provider: { "@type": "Organization", name: "GetCyberRight", url: BASE_URL },
      url: `${BASE_URL}/kids`,
      isAccessibleForFree: true,
      audience: {
        "@type": "EducationalAudience",
        educationalRole: "student",
        audienceType: "Children and Teens aged 8-16",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "At what age should kids learn about online safety?",
          acceptedAnswer: { "@type": "Answer", text: "Children should start learning basic online safety as soon as they begin using the internet, typically around age 5-7 for supervised use. By ages 8-10, children should understand password safety, recognizing suspicious messages, and not sharing personal information. Our lessons are designed for ages 8-16, with content adapted for different maturity levels." },
        },
        {
          "@type": "Question",
          name: "How do I teach my child to recognize online scams?",
          acceptedAnswer: { "@type": "Answer", text: "Start with real examples appropriate for their age. Teach them the warning signs: urgent language, too-good-to-be-true offers, requests for personal information, and messages from strangers. Our interactive lessons use age-appropriate scenarios and quizzes to help kids practice identifying scams in a safe environment." },
        },
        {
          "@type": "Question",
          name: "What should kids do if they encounter cyberbullying?",
          acceptedAnswer: { "@type": "Answer", text: "Children should not respond to the bully, save evidence (screenshots), block the person, and tell a trusted adult immediately. Our lessons teach kids these steps and help them understand that cyberbullying is never their fault. We also cover how bystanders can help by reporting bullying behavior." },
        },
        {
          "@type": "Question",
          name: "Are the kids' safety lessons free?",
          acceptedAnswer: { "@type": "Answer", text: "Yes, all of our kids and teens online safety lessons are completely free. No account is required to access the lessons, quizzes, and educational resources." },
        },
        {
          "@type": "Question",
          name: "How can I make a strong password that I can remember?",
          acceptedAnswer: { "@type": "Answer", text: "Use a passphrase, a string of random words that creates a mental image. For example, 'purple-tiger-plays-piano' is much stronger than a short, complex password and easier to remember. Our password lessons teach kids to create strong, memorable passwords and understand why password reuse is dangerous." },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Kids Safety", item: `${BASE_URL}/kids` },
      ],
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageContent />
    </>
  );
}
