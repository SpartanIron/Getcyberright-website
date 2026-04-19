import type { Metadata } from "next";
import { PrintButton } from "./print-button";

const BASE_URL = "https://www.getcyberright.com";

export const metadata: Metadata = {
  title: "Family Cyber Safety: 10 Essential Steps (Printable Guide) | GetCyberRight",
  description:
    "A free printable family cyber safety checklist. Ten essential steps every household can take today to stay safer online. Print or save as PDF.",
  alternates: { canonical: `${BASE_URL}/family-cyber-safety-checklist` },
  robots: { index: true, follow: true },
};

const steps = [
  {
    title: "Turn on automatic updates everywhere",
    body: "Phones, computers, browsers, routers, and apps. Most attacks exploit known holes that vendors have already patched.",
  },
  {
    title: "Use a password manager and unique passwords",
    body: "One strong, unique password per account. Let the password manager remember them. If one site is breached, the rest of your accounts stay safe.",
  },
  {
    title: "Turn on two-step verification on important accounts",
    body: "Email, banking, social media, and shopping accounts. Prefer an authenticator app over SMS where possible.",
  },
  {
    title: "Lock down kids' devices and accounts",
    body: "Set screen-time limits, age-appropriate content filters, and a private profile by default. Talk about who can message them and what to do if a stranger does.",
  },
  {
    title: "Set up a family rule for unexpected money asks",
    body: "If anyone, including a relative, asks for money urgently by message, voice, or video, pause and verify on a known number first. Voice cloning is real.",
  },
  {
    title: "Freeze your credit",
    body: "A credit freeze stops new accounts being opened in your name. It is free at all three U.S. bureaus and can be lifted in minutes when you actually need credit.",
  },
  {
    title: "Check the link before you click",
    body: "Hover or long-press on links to see the real URL. Look for misspellings and lookalike domains. When in doubt, type the company's address into your browser yourself.",
  },
  {
    title: "Back up what you cannot afford to lose",
    body: "Photos, documents, and tax records to a cloud service or external drive. Verify a backup actually restores at least once a year.",
  },
  {
    title: "Tighten your social media privacy",
    body: "Set profiles to private, hide friends lists, and stop sharing real-time location. Scammers use these details to build convincing scams.",
  },
  {
    title: "Know what to do when something goes wrong",
    body: "If a scam happens, change passwords, contact your bank, freeze cards, and report it to the relevant authority in your country. Move quickly, not perfectly.",
  },
];

export default function FamilyCyberSafetyChecklistPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            html, body { margin: 0; padding: 0; background: #f8fafc; color: #0f172a; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
            .page { max-width: 760px; margin: 0 auto; padding: 40px 32px 64px; }
            .toolbar { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 28px; }
            .toolbar a, .toolbar button { font: inherit; background: #0d9488; color: #fff; border: 0; border-radius: 8px; padding: 10px 16px; cursor: pointer; text-decoration: none; display: inline-block; }
            .toolbar a.secondary, .toolbar button.secondary { background: #e2e8f0; color: #0f172a; }
            h1 { font-size: 28px; line-height: 1.2; margin: 0 0 8px; color: #0f172a; }
            .meta { color: #475569; margin-bottom: 28px; font-size: 14px; }
            .step { display: flex; gap: 16px; padding: 14px 0; border-top: 1px solid #e2e8f0; }
            .step:last-child { border-bottom: 1px solid #e2e8f0; }
            .num { flex: 0 0 36px; height: 36px; width: 36px; border-radius: 50%; background: #0f766e; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; }
            .check { flex: 0 0 24px; height: 24px; width: 24px; border: 2px solid #0f766e; border-radius: 6px; margin-top: 6px; }
            .step h3 { margin: 0 0 4px; font-size: 16px; color: #0f172a; }
            .step p { margin: 0; color: #334155; font-size: 14px; line-height: 1.55; }
            .footer { margin-top: 32px; font-size: 12px; color: #64748b; text-align: center; }
            .footer a { color: #0d9488; text-decoration: none; }
            @media print {
              .toolbar { display: none; }
              html, body { background: #fff; }
              .page { padding: 16px 0; }
              .step { break-inside: avoid; }
            }
          `,
        }}
      />
      <main className="page">
        <div className="toolbar">
          <PrintButton />
          <a href="/awareness-hub" className="secondary" data-testid="link-back-to-hub">Back to Awareness Hub</a>
        </div>
        <h1>Family Cyber Safety: 10 Essential Steps</h1>
        <p className="meta">A printable checklist from GetCyberRight. Tick each step as your family completes it.</p>
        {steps.map((s, i) => (
          <div key={i} className="step" data-testid={`checklist-step-${i + 1}`}>
            <div className="num">{i + 1}</div>
            <div className="check" aria-hidden="true" />
            <div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          </div>
        ))}
        <div className="footer">
          GetCyberRight &middot; <a href="https://www.getcyberright.com">getcyberright.com</a> &middot; Free to share with your family, school, or community.
        </div>
      </main>
    </>
  );
}
