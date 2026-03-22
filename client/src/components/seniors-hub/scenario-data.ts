export interface ScamScenario {
  id: string;
  region: "US" | "UK" | "Canada" | "Australia" | "Africa";
  type: "phone" | "email" | "text" | "social" | "in-person";
  title: string;
  description: string;
  content: string;
  isScam: boolean;
  choices: { label: string; value: "scam" | "legitimate" | "unsure" }[];
  redFlags: string[];
  explanation: string;
}

export interface SafetyChecklistCategory {
  id: string;
  title: string;
  icon: string;
  steps: { id: string; label: string; detail: string }[];
}

export interface DeepDiveModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  intro: string;
  interactiveType: "red-flag-spotter" | "mock-call" | "identifier" | "verify-exercise" | "response-practice";
  scenarios: { prompt: string; options: string[]; correctIndex: number; explanation: string }[];
}

export interface EmergencyFlowStep {
  id: string;
  question: string;
  options: { label: string; nextId: string | null; actions?: string[] }[];
}

export interface ScamStat {
  label: string;
  value: string;
  detail: string;
  source: string;
  color: string;
}

export interface FamilyConversation {
  id: string;
  topic: string;
  opener: string;
  dos: string[];
  donts: string[];
  followUps: string[];
}

export const scamScenarios: ScamScenario[] = [
  {
    id: "us-irs-1",
    region: "US",
    type: "phone",
    title: "IRS Agent Calling About Back Taxes",
    description: "You receive a phone call from someone claiming to be an IRS agent.",
    content: "\"This is Special Agent Robert Williams, badge number 45892, calling from the Internal Revenue Service. Our records show you owe $4,350 in back taxes from 2023. A warrant has been issued for your arrest. You must pay immediately using Google Play gift cards to avoid prosecution. I will stay on the line while you go to the nearest store.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The IRS never calls demanding immediate payment",
      "The IRS never threatens arrest over the phone",
      "No government agency accepts gift cards as payment",
      "The IRS always contacts through postal mail first",
      "Staying on the line to pressure you is a manipulation tactic"
    ],
    explanation: "This is a classic IRS impersonation scam. The real IRS always initiates contact through official mail sent via the U.S. Postal Service. They never demand payment by gift card, and they never threaten immediate arrest over the phone."
  },
  {
    id: "us-ss-1",
    region: "US",
    type: "phone",
    title: "Social Security Number Suspended",
    description: "An automated message says your Social Security number has been suspended.",
    content: "\"This is an urgent message from the Social Security Administration. Your Social Security number has been suspended due to suspicious activity linked to drug trafficking. Press 1 to speak with an agent immediately, or a warrant will be issued for your arrest within 24 hours.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Social Security numbers cannot be 'suspended'",
      "The SSA does not make threatening automated calls",
      "Linking to drug trafficking is designed to create panic",
      "Pressing 1 connects you to a scammer, not the SSA",
      "Real agencies never threaten arrest with a deadline"
    ],
    explanation: "Social Security numbers cannot be suspended or cancelled. The SSA may occasionally call, but they never threaten arrest, never demand immediate action, and never use automated messages with threats."
  },
  {
    id: "us-medicare-1",
    region: "US",
    type: "phone",
    title: "Free Medicare Back Brace Offer",
    description: "Someone calls offering you a free back brace covered by Medicare.",
    content: "\"Hello! I'm calling from the National Medical Supply Center. We're reaching out to Medicare beneficiaries in your area. You qualify for a completely free back brace -- Medicare covers 100% of the cost. I just need to verify your Medicare Beneficiary ID number to process your order. There's no cost to you at all!\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Unsolicited calls offering free medical equipment are almost always scams",
      "They want your Medicare number to file fraudulent claims",
      "Medical equipment should be ordered by your doctor, not offered through cold calls",
      "The 'National Medical Supply Center' is a fake name designed to sound official",
      "'No cost to you' is used to make you drop your guard"
    ],
    explanation: "This is a Medicare fraud scheme. Scammers collect your Medicare number to bill for equipment you never receive or do not need. Legitimate medical equipment is prescribed by your doctor, never offered through cold calls."
  },
  {
    id: "us-amazon-1",
    region: "US",
    type: "email",
    title: "Amazon Account Suspicious Activity Alert",
    description: "You receive an email about unauthorized purchases on your Amazon account.",
    content: "From: amazon-security-alert@amaz0n-support.com\nSubject: URGENT: Unauthorized Purchase of $899.99 on Your Account\n\nDear Valued Customer,\n\nWe have detected an unauthorized purchase of an iPhone 15 Pro ($899.99) on your Amazon account. If you did not make this purchase, click the link below immediately to secure your account and get a full refund.\n\n[Secure My Account Now]\n\nIf you do not respond within 24 hours, the charge will be finalized.",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The email is from 'amaz0n-support.com' (note the zero instead of 'o')",
      "Creating urgency with a 24-hour deadline",
      "The link likely leads to a fake login page to steal your credentials",
      "Generic greeting ('Valued Customer') instead of your actual name",
      "Real Amazon alerts appear in your account's Message Center"
    ],
    explanation: "This phishing email uses a spoofed domain with a zero replacing the 'o' in Amazon. Never click links in suspicious emails. Instead, go directly to amazon.com and check your orders and account alerts there."
  },
  {
    id: "us-grandparent-1",
    region: "US",
    type: "phone",
    title: "Grandchild in Trouble",
    description: "Someone calls claiming to be your grandchild needing bail money.",
    content: "\"Grandma? Grandma, it's me... [sobbing] I'm in so much trouble. I got in a car accident and they arrested me. Please don't tell Mom and Dad, they'll be so angry. My lawyer says I need $5,000 for bail. Can you wire the money right now? The lawyer will call you with the details. Please, Grandma, I'm so scared.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The caller does not say their name -- they wait for you to say it",
      "Begging you not to tell other family members isolates you",
      "Wire transfers are untraceable -- that is why scammers request them",
      "A real grandchild's voice would be recognizable, but stress makes us uncertain",
      "Real attorneys do not call to arrange wire transfers for bail"
    ],
    explanation: "This is the 'grandparent scam.' Scammers exploit your love for family. Always hang up and call your grandchild directly on their known phone number. If you cannot reach them, call their parents. Never send money without verifying."
  },
  {
    id: "us-reverse-mortgage-1",
    region: "US",
    type: "email",
    title: "Reverse Mortgage Pre-Approval",
    description: "You receive a letter about being pre-approved for a reverse mortgage.",
    content: "From: National Senior Housing Authority\nSubject: You're Pre-Approved for $185,000!\n\nCongratulations! Based on your property records, you have been pre-approved for a reverse mortgage of up to $185,000. Access your home equity tax-free with no monthly mortgage payments.\n\nThis exclusive offer expires in 7 days. Call our senior specialist at 1-888-555-0192 to lock in your rate today.\n\nNo credit check required. No income verification needed.",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "'National Senior Housing Authority' is not a real government agency",
      "Legitimate lenders do not pre-approve without an application",
      "'No credit check required' is unrealistic for any real mortgage",
      "The 7-day expiration creates false urgency",
      "Real reverse mortgages require HUD-approved counseling before approval"
    ],
    explanation: "Reverse mortgage scams target seniors' home equity. Real reverse mortgages (HECMs) require HUD-approved counseling and are issued by FHA-approved lenders. Never respond to unsolicited pre-approval offers."
  },
  {
    id: "us-apple-1",
    region: "US",
    type: "text",
    title: "Apple ID Locked Alert",
    description: "You receive a text message about your Apple ID being locked.",
    content: "APPLE: Your Apple ID has been locked due to unauthorized access. Verify your identity within 12 hours or your account will be permanently disabled. Click here to verify: https://apple-id-verify.support-login.com",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The link goes to 'support-login.com', not apple.com",
      "Apple never sends texts threatening to disable your account",
      "Creating urgency with a 12-hour deadline",
      "Real Apple communications come through your device settings or email",
      "The link is designed to steal your Apple ID and password"
    ],
    explanation: "This is a smishing (SMS phishing) attack. Apple never sends text messages threatening to lock or disable accounts. To check your Apple ID status, go directly to appleid.apple.com or open Settings on your iPhone."
  },
  {
    id: "us-pharmacy-1",
    region: "US",
    type: "phone",
    title: "Pharmacy Calling About Prescription",
    description: "Your pharmacy calls about a prescription refill being ready.",
    content: "\"Hello, this is Sarah calling from Walgreens pharmacy on Oak Street. We wanted to let you know your prescription for Lisinopril is ready for pickup. If you would like, we can also set up automatic refills. Just stop by the pharmacy counter at your convenience. Is there anything else we can help with?\"",
    isScam: false,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This is legitimate", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [],
    explanation: "This is a legitimate pharmacy call. Notice the signs: they identified the specific pharmacy location, mentioned a medication you actually take, did not ask for personal information or payment, and did not create any urgency or pressure."
  },
  {
    id: "uk-hmrc-1",
    region: "UK",
    type: "phone",
    title: "HMRC Tax Refund Call",
    description: "Someone calls saying you are owed a tax refund from HMRC.",
    content: "\"This is an automated message from Her Majesty's Revenue and Customs. Our records show you are owed a tax refund of £2,847.50 for the tax year 2024-2025. To claim your refund, press 1 now to speak with a tax specialist. You will need to provide your bank details for the refund to be processed. This offer expires today.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "HMRC never calls about tax refunds -- they send letters or notify through your Personal Tax Account",
      "HMRC never uses automated calls",
      "They would never ask for bank details over the phone",
      "The refund 'expiring today' creates false urgency",
      "HMRC no longer uses 'Her Majesty's' -- it is now 'His Majesty's Revenue and Customs'"
    ],
    explanation: "HMRC will never phone you about a tax refund or ask for personal financial information over the phone. Tax refunds are processed through your Personal Tax Account on gov.uk or through official letters."
  },
  {
    id: "uk-nhs-1",
    region: "UK",
    type: "text",
    title: "NHS COVID Booster Appointment",
    description: "You receive a text about booking a COVID booster jab.",
    content: "NHS: You are eligible for your COVID-19 booster vaccination. Due to high demand, you must book within 48 hours or lose your slot. Click here to book and verify your NHS number: https://nhs-booking-vaccine.org.uk.com",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The link goes to 'org.uk.com' -- real NHS sites end in '.nhs.uk'",
      "The NHS does not threaten you will 'lose your slot' within 48 hours",
      "The NHS books through the NHS App or nhs.uk website directly",
      "Asking to 'verify your NHS number' is a data theft tactic",
      "Legitimate NHS texts link to nhs.uk only"
    ],
    explanation: "The NHS only sends booking links to nhs.uk websites. This scam uses a fake domain designed to look official. Always book vaccinations through the NHS App, nhs.uk, or by calling 119."
  },
  {
    id: "uk-royal-mail-1",
    region: "UK",
    type: "text",
    title: "Royal Mail Missed Delivery",
    description: "A text says Royal Mail tried to deliver a package.",
    content: "Royal Mail: We attempted delivery of your parcel today but were unable to deliver. A redelivery fee of £1.45 is required. Please arrange redelivery and pay the fee here: https://royalmail-redelivery.co.net/pay",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Royal Mail does not charge redelivery fees",
      "The link goes to '.co.net', not royalmail.com",
      "Royal Mail leaves a physical 'Something for you' card",
      "The small fee is designed to capture your card details",
      "Real Royal Mail redelivery is free through royalmail.com"
    ],
    explanation: "Royal Mail never charges for redelivery. If you miss a delivery, Royal Mail leaves a physical card. Rearrange delivery for free at royalmail.com or collect from your local delivery office."
  },
  {
    id: "uk-tv-license-1",
    region: "UK",
    type: "email",
    title: "TV Licence Renewal Warning",
    description: "An email says your TV Licence payment has failed.",
    content: "From: no-reply@tvlicensing-uk.org\nSubject: Payment Failed - Action Required\n\nDear Customer,\n\nYour recent TV Licence payment of £169.50 has failed. If payment is not made within 5 days, your licence will be cancelled and enforcement officers may visit your property.\n\nUpdate your payment details immediately:\n[Update Payment]\n\nTV Licensing Authority",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The email is from 'tvlicensing-uk.org', not the real tvlicensing.co.uk",
      "Threatening enforcement officers creates panic",
      "Generic 'Dear Customer' instead of your name",
      "Real TV Licensing emails come from donotreply@tvlicensing.co.uk",
      "5-day deadline creates false urgency"
    ],
    explanation: "TV Licensing scam emails are very common in the UK. Always check the sender's domain carefully. Manage your TV Licence directly at tvlicensing.co.uk or call 0300 790 6165."
  },
  {
    id: "uk-pension-1",
    region: "UK",
    type: "phone",
    title: "Pension Review Offer",
    description: "Someone calls offering a free pension review with guaranteed higher returns.",
    content: "\"Good afternoon. I'm calling from Premier Pension Advisors. We've been reviewing pension performance in your area and found that many people like you are missing out on returns of up to 12% per year. We offer a free pension review -- completely no obligation. We can help you transfer your pension to a higher-performing fund. Can I book you in for a consultation this week?\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Cold calls about pensions have been illegal in the UK since January 2019",
      "Promising 12% guaranteed returns is unrealistic",
      "Legitimate financial advisors do not cold-call",
      "'Free pension review' is a lure to get you to transfer your pension",
      "Pension liberation scams can cause you to lose your entire retirement savings"
    ],
    explanation: "Since January 2019, unsolicited calls about pensions are illegal in the UK. Any cold call about your pension is a scam. If you want pension advice, use the FCA register at fca.org.uk to find an authorised advisor."
  },
  {
    id: "canada-cra-1",
    region: "Canada",
    type: "phone",
    title: "Canada Revenue Agency Tax Fraud Warning",
    description: "An automated call says you owe taxes to the CRA.",
    content: "\"This is an urgent message from the Canada Revenue Agency. You have outstanding tax debt and a criminal case has been filed against you. If you do not call us back immediately at this number to arrange payment, the RCMP will be dispatched to your home for your arrest. Your SIN has been flagged for fraud. Call us immediately.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The CRA never threatens arrest over the phone",
      "The RCMP is not dispatched for tax debts",
      "The CRA contacts through official mail or My Account on canada.ca",
      "Your SIN cannot be 'flagged for fraud' in this way",
      "Demanding you call back immediately is a pressure tactic"
    ],
    explanation: "The CRA never threatens arrest, never demands immediate payment by phone, and never asks for payment by gift cards or cryptocurrency. Verify any CRA communication by logging into My Account at canada.ca/my-cra-account or calling 1-800-959-8281."
  },
  {
    id: "canada-ohip-1",
    region: "Canada",
    type: "text",
    title: "OHIP Card Renewal Required",
    description: "You get a text saying your OHIP card needs immediate renewal.",
    content: "Service Ontario: Your OHIP health card expires in 3 days. To avoid losing coverage, renew immediately online. Verify your identity and health card number here: https://ontario-healthcard-renew.ca.info/verify",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Service Ontario does not send text messages about OHIP renewals",
      "The URL '.ca.info' is not a real Ontario government domain",
      "Real Ontario government sites end in '.ontario.ca'",
      "OHIP renewals are done in person at ServiceOntario centres",
      "3-day urgency is a pressure tactic"
    ],
    explanation: "Service Ontario does not text about OHIP renewals. Health card renewals are done in person at ServiceOntario locations. You receive official mail well before your card expires."
  },
  {
    id: "canada-rcmp-1",
    region: "Canada",
    type: "phone",
    title: "RCMP Warrant for Your Arrest",
    description: "Someone claiming to be RCMP says there is a warrant for your arrest.",
    content: "\"This is Sergeant Davis from the Royal Canadian Mounted Police. We have a warrant for your arrest related to money laundering activities connected to your bank account. You need to transfer your savings to a government-secured account for verification. If you cooperate, we can resolve this without prosecution. Do not contact your bank or anyone else about this matter.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Police never ask you to transfer money to 'government-secured accounts'",
      "No such thing as a 'government-secured account' for verification",
      "Telling you not to contact your bank or anyone else is an isolation tactic",
      "Real RCMP would serve a warrant in person, not over the phone",
      "Promising to resolve charges if you 'cooperate' financially is a scam"
    ],
    explanation: "Police never ask citizens to transfer money. There is no such thing as a 'government-secured account.' If someone claiming to be police asks for money transfers, hang up and call your local police non-emergency line."
  },
  {
    id: "canada-bank-1",
    region: "Canada",
    type: "phone",
    title: "Bank Fraud Department Alert",
    description: "Your bank calls about suspicious charges on your account.",
    content: "\"Hello, this is the fraud department at TD Canada Trust. We noticed a charge of $1,247 at an electronics store in Vancouver that seems unusual for your account. Did you make this purchase? We want to verify before we block the charge. I can see your account ends in 4521. Can you confirm the last 4 digits to verify your identity?\"",
    isScam: false,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This is legitimate", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [],
    explanation: "This could be a legitimate fraud alert. Banks do call about suspicious charges, and they may know the last 4 digits of your card. However, to be safe, you can hang up and call the number on the back of your bank card to verify."
  },
  {
    id: "au-ato-1",
    region: "Australia",
    type: "phone",
    title: "ATO Tax Debt Warning",
    description: "You receive a call from someone claiming to be from the Australian Tax Office.",
    content: "\"This is the Australian Taxation Office. We are calling about a serious matter regarding your tax file. You have an outstanding tax debt of $6,200 and legal action has been initiated. To stop the legal process, you must pay immediately using iTunes gift cards or cryptocurrency. Failure to comply will result in a police visit to your home.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The ATO never demands payment by gift cards or cryptocurrency",
      "The ATO never threatens police visits for tax debts",
      "The ATO sends official letters and notifications through myGov",
      "Demanding immediate payment is a pressure tactic",
      "Real ATO calls never use threatening language"
    ],
    explanation: "The ATO communicates through myGov and official mail. They never demand immediate payment by gift cards, and they never threaten police visits. Verify any ATO communication at ato.gov.au or call 13 28 61."
  },
  {
    id: "au-mygov-1",
    region: "Australia",
    type: "email",
    title: "myGov Account Security Alert",
    description: "An email warns that your myGov account needs verification.",
    content: "From: security@my-gov-australia.com.au\nSubject: Account Verification Required\n\nDear myGov User,\n\nYour myGov account has been flagged for suspicious activity. To prevent account suspension, please verify your identity immediately.\n\nClick here to verify: [Verify My Account]\n\nYou will need your Medicare number, tax file number, and Centrelink CRN to complete verification.\n\nThis is an automated message from the Australian Government.",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The email is from 'my-gov-australia.com.au', not my.gov.au",
      "myGov never asks for your tax file number via email",
      "Asking for Medicare number, TFN, and CRN together is data theft",
      "Real myGov emails come from @my.gov.au domains",
      "myGov communicates through your myGov Inbox, not external emails"
    ],
    explanation: "The real myGov uses @my.gov.au email addresses and never asks for sensitive numbers via email. Always log in to myGov directly by typing my.gov.au into your browser. Never click links in emails claiming to be from myGov."
  },
  {
    id: "au-telstra-1",
    region: "Australia",
    type: "phone",
    title: "Telstra Tech Support Call",
    description: "Someone from Telstra says your internet is compromised.",
    content: "\"Hello, this is the Telstra technical team. We have detected that your internet connection is being used by hackers to send illegal content. This is very serious and could result in your internet being disconnected and a referral to the Australian Federal Police. I need you to turn on your computer and allow me to connect remotely so we can fix this security issue right now.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Telstra does not proactively call about security issues on your connection",
      "Requesting remote access to your computer is a major red flag",
      "Threatening AFP referral is designed to cause panic",
      "ISPs do not monitor your connection for 'illegal content' this way",
      "The goal is to install malware or steal banking details via remote access"
    ],
    explanation: "Telstra and other ISPs do not call customers about hackers on their connection. This is a tech support scam designed to gain remote access to your computer to steal information or install malware. Hang up immediately."
  },
  {
    id: "au-centrelink-1",
    region: "Australia",
    type: "text",
    title: "Centrelink Payment Increase",
    description: "A text about a Centrelink payment increase that requires action.",
    content: "Centrelink: You are eligible for a $750 one-time payment increase. To receive this payment, verify your details through our secure portal: https://centrelink-gov-au.payment-verify.com/claim. Offer expires 31 March.",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The URL is 'payment-verify.com', not servicesaustralia.gov.au",
      "Centrelink does not send texts about one-time payment increases",
      "Centrelink communicates through myGov, not text links",
      "An expiry date creates false urgency",
      "Real Centrelink payments are processed automatically through your existing setup"
    ],
    explanation: "Centrelink (Services Australia) communicates through your myGov Inbox. They never send texts with links to external websites. Check any payment claims by logging into myGov directly at my.gov.au."
  },
  {
    id: "africa-mpesa-1",
    region: "Africa",
    type: "text",
    title: "M-Pesa Reversal Request",
    description: "Someone says they sent money to your M-Pesa by mistake.",
    content: "\"Hello, I am so sorry! I just sent KES 5,000 to your number by mistake. I was trying to send to my sister. Can you please check your M-Pesa balance? You should see the deposit. Please send it back to me at this number. I am desperate, I need the money for my child's school fees. God bless you.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The 'reverse transaction' trick: they may fake an M-Pesa confirmation message",
      "You may see a fake SMS but no actual money in your M-Pesa account",
      "They appeal to emotion (child's school fees, religious blessing) to pressure you",
      "If it were a real mistake, they can contact Safaricom to reverse it officially",
      "Always check your actual M-Pesa balance through the menu, not from SMS"
    ],
    explanation: "This is a common 'reverse transaction' scam in East Africa. Scammers send fake M-Pesa confirmation messages to make you think you received money. Always check your actual M-Pesa balance through *334# or the M-Pesa app before sending anything. If someone genuinely sent money by mistake, they can contact Safaricom for an official reversal."
  },
  {
    id: "africa-sim-swap-1",
    region: "Africa",
    type: "phone",
    title: "Network Provider SIM Upgrade",
    description: "Someone from your mobile network says you need a SIM upgrade.",
    content: "\"Good day, I am calling from MTN. We are upgrading our network to 5G and your current SIM card is not compatible. You need to provide your SIM card details and a one-time PIN that we will send to your phone so we can activate your new SIM remotely. This is a free upgrade and there is no charge. You will lose network coverage if you do not upgrade today.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Mobile networks never ask for your SIM details or OTP over the phone",
      "SIM upgrades are done at official stores, not remotely over the phone",
      "Sharing your OTP allows them to perform a SIM swap and take over your number",
      "Threatening loss of network coverage creates false urgency",
      "A SIM swap gives scammers access to your M-Pesa, bank alerts, and two-factor codes"
    ],
    explanation: "SIM swap fraud is one of the most dangerous scams in Africa. Once scammers take over your phone number, they can access your Mobile Money accounts, receive your bank OTPs, and drain your savings. Never share OTPs or SIM details over the phone. SIM upgrades are only done at official network stores."
  },
  {
    id: "africa-agent-1",
    region: "Africa",
    type: "in-person",
    title: "Fake Mobile Money Agent",
    description: "A Mobile Money agent says the system requires your PIN to process a deposit.",
    content: "You visit a roadside M-Pesa agent to deposit money. The agent says: \"The system is having issues today. I need you to enter your M-Pesa PIN on my phone to complete the deposit. Or you can tell me your PIN and I will enter it for you. This is normal when the system is slow.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "You should never enter your PIN on someone else's phone",
      "An agent never needs your PIN to process a deposit for you",
      "Deposits are processed by the agent sending to your number -- your PIN is not involved",
      "Claiming 'system issues' is a common excuse to get your PIN",
      "Once they have your PIN, they can withdraw all your money"
    ],
    explanation: "A Mobile Money agent never needs your PIN. Deposits work by the agent sending money to your number -- you only enter your PIN to withdraw or send money from your own phone. Never share your PIN with anyone, including agents."
  },
  {
    id: "africa-sars-1",
    region: "Africa",
    type: "email",
    title: "SARS Tax Refund Notification",
    description: "An email from SARS says you are entitled to a tax refund.",
    content: "From: refunds@sars-revenue.co.za.net\nSubject: SARS Tax Refund - R14,500 Owed to You\n\nDear Taxpayer,\n\nAfter a review of your annual tax return, we have determined you are owed a refund of R14,500. To process your refund, click the link below and provide your banking details and ID number.\n\n[Claim Your Refund Now]\n\nThis refund will expire if not claimed within 7 days.\n\nSouth African Revenue Service",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The email is from 'sars-revenue.co.za.net', not the real sars.gov.za",
      "SARS processes refunds automatically to your registered bank account",
      "SARS never asks for banking details via email",
      "The 7-day expiry creates false urgency",
      "SARS refunds do not expire"
    ],
    explanation: "SARS never sends emails asking for banking details. Tax refunds are processed automatically and paid into the bank account on file with SARS. Always check your tax status through SARS eFiling at sarsefiling.co.za."
  },
  {
    id: "africa-church-1",
    region: "Africa",
    type: "social",
    title: "Church Building Fund Appeal",
    description: "A WhatsApp message from your pastor asks for donations to a building project.",
    content: "\"Greetings in the name of the Lord, beloved. Pastor David here. Our church building project needs urgent funds. I am personally reaching out to faithful members. Please send your seed offering of at least GHS 500 to this Mobile Money number: 024-XXX-XXXX (different from the church's usual number). God will multiply your seed a hundredfold. Please keep this between us as not all members have been chosen for this special blessing.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The Mobile Money number is different from the church's usual account",
      "Asking you to 'keep this between us' is an isolation tactic",
      "Real church appeals are made publicly during services, not private messages",
      "The pastor's WhatsApp account may have been cloned or hacked",
      "Promising hundredfold returns manipulates religious faith"
    ],
    explanation: "Church and charity scams exploit religious trust. Scammers clone pastors' WhatsApp accounts or create fake profiles. Always verify donation requests in person at the church. Legitimate church funds use the church's official accounts, not personal Mobile Money numbers."
  },
  {
    id: "africa-diaspora-1",
    region: "Africa",
    type: "phone",
    title: "Your Relative Has Been Arrested",
    description: "A call says your family member abroad has been arrested and needs bail.",
    content: "\"Hello, is this Mama Adwoa? I am calling from the Immigration Office in London. Your son Kwame has been detained for expired documents. He is being held and will be deported unless bail of £2,000 is paid immediately. He gave us your number. You need to send the money through Western Union within the next 2 hours or he will be put on a deportation flight tonight. He is very distressed.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Immigration offices do not call relatives abroad demanding bail money",
      "Western Union is untraceable -- that is why scammers request it",
      "The 2-hour deadline prevents you from verifying the story",
      "They use your relative's name (possibly found on social media) to sound credible",
      "Real immigration issues are handled through legal processes, not phone demands"
    ],
    explanation: "Diaspora targeting scams exploit the fear of a loved one being in trouble abroad. Always hang up and contact your relative directly. Call their phone, message them, or contact other family members. Immigration authorities do not call relatives demanding Western Union payments."
  },
  {
    id: "africa-utility-1",
    region: "Africa",
    type: "text",
    title: "Electricity Meter Disconnection Warning",
    description: "A text warns your electricity will be disconnected for non-payment.",
    content: "KPLC NOTICE: Your electricity meter (No. 47392018) will be disconnected in 24 hours due to unpaid balance of KES 3,450. To avoid disconnection and reconnection fees, pay now to this Paybill: 555123 (Account: KPLC-URGENT). Reply STOP to cancel this message.",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "The Paybill number 555123 is not KPLC's official Paybill (888880)",
      "KPLC sends disconnection notices through official channels, not text messages",
      "The account name 'KPLC-URGENT' is suspicious -- official accounts use your meter number",
      "24-hour disconnect deadline creates panic",
      "Fake meter numbers are used to make the message look legitimate"
    ],
    explanation: "Always verify utility payment requests using the official payment channels. KPLC's official Paybill is 888880. For Eskom in South Africa, use the official Eskom app or eskom.co.za. Never pay utility bills through numbers sent via text."
  },
  {
    id: "africa-land-1",
    region: "Africa",
    type: "in-person",
    title: "Discounted Land Purchase Opportunity",
    description: "Someone offers you a plot of land at a bargain price.",
    content: "A well-dressed man approaches you at a community gathering. He shows you photos and documents for a 1-acre plot in a developing area, priced at only NGN 500,000 (normally NGN 2,000,000). \"The owner is my uncle and he needs the money urgently for medical bills. This is below market price because he needs cash today. I have the Certificate of Occupancy right here. We can close the deal this afternoon at the lawyer's office.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "Prices far below market value are a hallmark of fraud",
      "'Closing today' prevents you from doing due diligence",
      "The Certificate of Occupancy may be forged -- these are commonly faked",
      "Approaching you at a gathering is a social engineering tactic",
      "The 'lawyer's office' may be a fake setup",
      "Land fraud targets retirees looking to invest their savings"
    ],
    explanation: "Land and property fraud is widespread. Never purchase land without independent verification from a lawyer you choose yourself. Conduct a search at the Land Registry, verify the seller's identity, and never rush into property transactions regardless of the 'deal.'"
  },
  {
    id: "africa-nhis-1",
    region: "Africa",
    type: "phone",
    title: "NHIS Card Renewal Required",
    description: "A caller says your National Health Insurance card has expired.",
    content: "\"Good morning, I am calling from the NHIS office. Your health insurance card expired last month and you will not be covered for any hospital visits until you renew. We are offering expedited renewal over the phone today. You just need to pay GHS 200 through Mobile Money to this number and provide your NHIS member ID so we can update your records immediately.\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "NHIS does not offer phone-based renewals",
      "NHIS renewals are done at district offices or through authorized agents",
      "Paying to a personal Mobile Money number is not official",
      "Creating urgency about losing hospital coverage causes panic",
      "They want both your money and your NHIS member ID for identity theft"
    ],
    explanation: "NHIS renewals in Ghana are done at NHIS district offices or through authorized renewal agents, not over the phone. Never pay premiums to personal Mobile Money numbers. Visit your nearest NHIS office to verify your membership status."
  },
  {
    id: "africa-lottery-1",
    region: "Africa",
    type: "text",
    title: "International Lottery Win",
    description: "A text says you have won an international lottery.",
    content: "CONGRATULATIONS! Your phone number has been selected as the winner of the UK National Lottery International Draw. You have won £850,000.00! To claim your prize, contact our claims agent Mr. James Wilson at +44-7XXX-XXXXXX. You will need to pay a processing fee of $500 via Western Union to release your winnings. Ref: UKNL/2025/WIN/8847",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "You cannot win a lottery you never entered",
      "Real lotteries never ask for fees to release winnings",
      "The UK National Lottery does not have an 'International Draw'",
      "Requesting payment via Western Union is untraceable",
      "Reference numbers and agent names are fabricated to look official"
    ],
    explanation: "You cannot win a lottery you never entered. This is an advance-fee fraud -- they ask for a small 'processing fee' but the winnings do not exist. These scams have targeted millions across Africa and are always fraudulent."
  },
  {
    id: "africa-whatsapp-biz-1",
    region: "Africa",
    type: "social",
    title: "WhatsApp Business Investment Opportunity",
    description: "A WhatsApp message promises daily returns on a small investment.",
    content: "\"Hello! Are you interested in earning extra income from your phone? Our company pays you to complete simple online tasks. Invest just UGX 50,000 and earn UGX 15,000 daily in returns. That is 30% daily profit! Over 10,000 Ugandans are already earning. Join our Telegram group for proof of payments. Send your investment to our MTN MoMo agent: 078-XXX-XXXX. Limited slots available today!\"",
    isScam: true,
    choices: [
      { label: "This is a scam", value: "scam" },
      { label: "This could be real", value: "legitimate" },
      { label: "I am not sure", value: "unsure" }
    ],
    redFlags: [
      "30% daily returns are mathematically impossible for any legitimate business",
      "These are Ponzi schemes that collapse once new members stop joining",
      "'Proof of payments' in Telegram groups are screenshots from early participants",
      "Paying to a personal MoMo number is not a registered business transaction",
      "'Limited slots' creates urgency to invest before thinking"
    ],
    explanation: "WhatsApp and Telegram investment schemes are Ponzi scams. No legitimate business can offer 30% daily returns. Early joiners may receive payouts (funded by new victims), but the scheme always collapses. Your money is gone once you send it."
  }
];

export const safetyChecklists: SafetyChecklistCategory[] = [
  {
    id: "phone-security",
    title: "Secure Your Phone",
    icon: "smartphone",
    steps: [
      { id: "ps-1", label: "Set up a 6-digit PIN or biometric lock", detail: "Go to Settings > Security > Screen Lock. Choose PIN (6 digits) or Fingerprint/Face unlock." },
      { id: "ps-2", label: "Enable automatic software updates", detail: "Settings > System > Software Update > turn on Auto-download and Auto-install." },
      { id: "ps-3", label: "Turn off Bluetooth when not using it", detail: "Swipe down from the top of your screen and tap the Bluetooth icon to turn it off." },
      { id: "ps-4", label: "Review app permissions", detail: "Settings > Apps > select each app > Permissions. Remove any permissions that seem unnecessary." },
      { id: "ps-5", label: "Enable Find My Phone", detail: "iPhone: Settings > your name > Find My. Android: Settings > Security > Find My Device." },
      { id: "ps-6", label: "Only download apps from official stores", detail: "Use the App Store (iPhone) or Google Play Store (Android) only. Never download from links in texts." },
      { id: "ps-7", label: "Set up call screening or blocking", detail: "iPhone: Settings > Phone > Silence Unknown Callers. Android: Phone app > Settings > Caller ID & spam." },
      { id: "ps-8", label: "Back up your phone regularly", detail: "iPhone: Settings > your name > iCloud > iCloud Backup. Android: Settings > System > Backup." }
    ]
  },
  {
    id: "financial-protection",
    title: "Protect Your Finances",
    icon: "wallet",
    steps: [
      { id: "fp-1", label: "Set up account alerts with your bank", detail: "Log in to your bank's website or app. Go to Settings or Alerts and enable notifications for all transactions." },
      { id: "fp-2", label: "Enable two-factor authentication on banking", detail: "Look in your bank app's Security Settings for two-step verification or two-factor authentication." },
      { id: "fp-3", label: "Freeze credit with all three bureaus", detail: "Contact Equifax (1-800-525-6285), Experian (1-888-397-3742), TransUnion (1-800-680-7289) to freeze your credit." },
      { id: "fp-4", label: "Review bank statements monthly", detail: "Check every charge on your statement. Report any you do not recognize immediately." },
      { id: "fp-5", label: "Never share banking PINs or passwords", detail: "Your bank will never ask for your full PIN or password. Anyone who does is attempting fraud." },
      { id: "fp-6", label: "Use credit cards instead of debit for online shopping", detail: "Credit cards offer better fraud protection. Unauthorized charges are easier to dispute." },
      { id: "fp-7", label: "Set up a personal rule: never send money to strangers", detail: "Make a firm decision now: you will never wire money or buy gift cards for someone you have not met in person." },
      { id: "fp-8", label: "Shred financial documents before discarding", detail: "Use a cross-cut shredder for bank statements, credit card offers, and anything with account numbers." }
    ]
  },
  {
    id: "social-media-safety",
    title: "Safe Social Media",
    icon: "users",
    steps: [
      { id: "sm-1", label: "Set profiles to private or Friends Only", detail: "Facebook: Settings > Privacy > Who can see your posts > Friends. Instagram: Settings > Privacy > Private Account." },
      { id: "sm-2", label: "Do not accept friend requests from strangers", detail: "If you do not know someone in real life, do not accept their request. Scammers create fake profiles." },
      { id: "sm-3", label: "Never share your location in real-time", detail: "Turn off location sharing in posts. Do not post that you are away from home until you return." },
      { id: "sm-4", label: "Hide your friends list from public view", detail: "Facebook: Settings > Privacy > Who can see your friends list > Only me." },
      { id: "sm-5", label: "Use a strong, unique password for each platform", detail: "Use at least 12 characters mixing letters, numbers, and symbols. Do not reuse passwords." },
      { id: "sm-6", label: "Enable two-factor authentication", detail: "Facebook: Settings > Security > Two-Factor Authentication. Instagram: Settings > Security > Two-Factor Authentication." },
      { id: "sm-7", label: "Be cautious about quizzes and surveys", detail: "Fun quizzes asking your pet's name, first car, or school may be harvesting your security question answers." },
      { id: "sm-8", label: "Review tagged posts before they appear on your profile", detail: "Facebook: Settings > Timeline and Tagging > Review tags people add to your posts." }
    ]
  },
  {
    id: "email-safety",
    title: "Email Safety",
    icon: "mail",
    steps: [
      { id: "es-1", label: "Enable two-factor authentication on email", detail: "Gmail: myaccount.google.com > Security > 2-Step Verification. Yahoo: Account Security > Two-step verification." },
      { id: "es-2", label: "Check sender addresses carefully before responding", detail: "Hover over or tap the sender's name to see the actual email address. Look for misspellings in the domain." },
      { id: "es-3", label: "Never click links in unexpected emails", detail: "Instead, type the website address directly into your browser. If unsure, call the company directly." },
      { id: "es-4", label: "Check for email forwarding rules", detail: "Gmail: Settings > See all settings > Forwarding. Make sure no unknown addresses are listed." },
      { id: "es-5", label: "Do not download attachments from unknown senders", detail: "Attachments can contain viruses. Only open attachments from people you know and trust." },
      { id: "es-6", label: "Use a separate email for online shopping", detail: "Create a free Gmail or Outlook account just for shopping and subscriptions to protect your main email." },
      { id: "es-7", label: "Regularly check your Sent and Trash folders", detail: "If you see emails you did not send, your account may be compromised. Change your password immediately." },
      { id: "es-8", label: "Keep recovery options up to date", detail: "Make sure your recovery phone number and backup email are current so you can regain access if needed." }
    ]
  }
];

export const deepDiveModules: DeepDiveModule[] = [
  {
    id: "romance-scam-flags",
    title: "Romance Scam Red Flag Spotter",
    icon: "heart",
    color: "bg-rose-500",
    intro: "Can you spot the warning signs in online relationships? In each scenario, identify the red flag that reveals a romance scam in progress.",
    interactiveType: "red-flag-spotter",
    scenarios: [
      {
        prompt: "You have been chatting with someone online for 3 weeks. They say: \"I feel such a deep connection with you. I have never felt this way before. I know we have not met yet, but I love you. I want to spend my life with you.\"",
        options: [
          "This is normal -- some people fall in love quickly",
          "Declaring love before meeting in person is a manipulation tactic",
          "They are just being romantic and expressive",
          "This is fine if they seem genuine"
        ],
        correctIndex: 1,
        explanation: "Love-bombing (intense declarations of love very early) is a key tactic scammers use to create emotional dependency before asking for money. Real relationships develop gradually."
      },
      {
        prompt: "Your online partner says they are a US military officer stationed overseas. Every time you suggest a video call, they say: \"The base does not allow video calls for security reasons. I can only send photos and text.\"",
        options: [
          "Military bases do have strict communication rules",
          "You should respect their work restrictions",
          "Consistently refusing video calls is a major red flag -- military personnel can video call",
          "Wait a few more weeks and ask again"
        ],
        correctIndex: 2,
        explanation: "Military personnel absolutely can make video calls. Consistent refusal to video chat means the person likely does not look like their photos. This is one of the most reliable indicators of a romance scam."
      },
      {
        prompt: "After 2 months of daily messaging, your online partner says: \"I have a medical emergency. I need surgery but my insurance does not cover it here. Can you send $3,000 through Western Union? I will pay you back when I return home.\"",
        options: [
          "They would not ask if they were not desperate",
          "Asking for money through Western Union after building an emotional connection is a textbook scam",
          "You should send a smaller amount to help",
          "Ask for proof of the medical bill first"
        ],
        correctIndex: 1,
        explanation: "Requesting money (especially via untraceable methods like Western Union) after weeks of emotional bonding is the core of every romance scam. The emergency is fabricated. Even asking for 'proof' does not help -- scammers fake medical documents."
      },
      {
        prompt: "Someone on a dating app has only 3 photos, all professionally taken. Their profile says they are a 'successful entrepreneur' but has no details. They messaged you first with: \"Your profile caught my eye. You seem like a truly special person.\"",
        options: [
          "They found your profile attractive -- that is flattering",
          "Professional photos, vague profile, and generic flattery together are warning signs of a fake profile",
          "Entrepreneurs are often too busy to fill out profiles",
          "Give them a chance -- you cannot judge by a profile alone"
        ],
        correctIndex: 1,
        explanation: "The combination of professional/stolen photos, a vague profile, and generic opening messages is a classic fake profile pattern. Scammers use stolen photos and keep details vague to avoid being caught in lies."
      },
      {
        prompt: "Your online partner asks you to move the conversation from the dating app to WhatsApp: \"I want to talk to you more privately. The dating app limits our connection.\"",
        options: [
          "Moving off the dating platform prevents the app's safety features from monitoring the conversation",
          "WhatsApp is more convenient for messaging",
          "This shows they want a deeper connection",
          "Moving to WhatsApp is completely normal"
        ],
        correctIndex: 0,
        explanation: "Scammers move conversations off dating platforms to avoid the app's fraud detection and monitoring. While many legitimate users also move to messaging apps, doing so very early and at their insistence is a red flag."
      }
    ]
  },
  {
    id: "tech-support-call",
    title: "Tech Support Scam Call Walkthrough",
    icon: "phone",
    color: "bg-blue-500",
    intro: "Walk through a simulated tech support scam call. At each stage, choose the safest response to protect yourself.",
    interactiveType: "mock-call",
    scenarios: [
      {
        prompt: "Your phone rings. The caller says: \"Hello, this is Microsoft Technical Support. We have detected a serious virus on your computer that is sending your personal data to hackers. I need you to go to your computer right now.\"",
        options: [
          "Go to your computer as they ask -- it sounds serious",
          "Ask them how they know about your computer",
          "Hang up immediately -- Microsoft never calls you about viruses",
          "Tell them you will call them back"
        ],
        correctIndex: 2,
        explanation: "The safest action is to hang up immediately. Microsoft, Apple, and other tech companies never make unsolicited calls about computer problems. Everything after this point is designed to manipulate you."
      },
      {
        prompt: "You did not hang up. The caller says: \"I understand your concern. Let me prove this is real. Press the Windows key and R on your keyboard, then type 'eventvwr' and press Enter. You will see errors listed there -- those are from the virus.\"",
        options: [
          "Follow the instructions to see the errors",
          "This proves they are legitimate -- they know about Windows",
          "The Event Viewer always shows errors on every computer -- this is a trick, hang up now",
          "Ask them what the errors mean"
        ],
        correctIndex: 2,
        explanation: "Every Windows computer has errors in the Event Viewer -- it is normal and does not indicate a virus. Scammers use this to frighten you into believing your computer is infected. This is a well-known manipulation trick."
      },
      {
        prompt: "The caller asks: \"To fix your computer, I need you to download a program called AnyDesk. Go to anydesk.com and install it. Then give me the 9-digit code that appears on your screen.\"",
        options: [
          "Download the program -- they need it to fix your computer",
          "AnyDesk is a legitimate program so it must be safe to use",
          "Never download software or give remote access codes to unsolicited callers -- hang up",
          "Download it but do not give them the code yet"
        ],
        correctIndex: 2,
        explanation: "AnyDesk is a legitimate remote access tool, but scammers use it to take control of your computer. Once they have the code, they can see your screen, access your files, install malware, and steal banking credentials. Never download software at a caller's request."
      },
      {
        prompt: "The caller says your computer has 5 serious viruses. He says: \"The repair costs $299 for a one-year protection plan. I can also offer a lifetime plan for $499. You can pay by credit card or gift cards from the nearest store.\"",
        options: [
          "Pay $299 since that is the cheaper option",
          "Tell them you will think about it",
          "This confirms it is a scam -- legitimate tech support never charges via gift cards and never asks you to buy a protection plan over the phone",
          "Negotiate a lower price"
        ],
        correctIndex: 2,
        explanation: "Requesting payment by gift cards is always a scam. No legitimate company accepts iTunes or Google Play gift cards as payment. The 'viruses' do not exist, and no repair is needed."
      },
      {
        prompt: "You decide to hang up. The caller calls back 3 times and leaves a voicemail: \"This is urgent. Your computer is still infected and your bank account is at risk. Call us back immediately.\"",
        options: [
          "Call them back to make sure your bank account is safe",
          "Block the number and do not call back -- this is continued harassment to scare you",
          "Call your bank using the number the caller left",
          "Answer the next call to tell them to stop calling"
        ],
        correctIndex: 1,
        explanation: "Block the number and do not engage further. The repeated calls are designed to wear down your resistance through fear. If you are concerned about your bank account, call your bank using the number on your debit card or bank statement, never a number provided by the caller."
      }
    ]
  },
  {
    id: "investment-fraud",
    title: "Too-Good-to-Be-True Identifier",
    icon: "trending-up",
    color: "bg-orange-500",
    intro: "Learn to spot the warning signs of fraudulent investment schemes. Can you tell which claims are realistic and which are designed to steal your money?",
    interactiveType: "identifier",
    scenarios: [
      {
        prompt: "A social media ad shows a famous person (Elon Musk) endorsing a new cryptocurrency: \"I made $2 million in one week with this new AI trading platform. You can too! Minimum investment just $250.\"",
        options: [
          "It must be real if a famous person is endorsing it",
          "Celebrity endorsement ads for investments are almost always fake -- celebrities do not endorse specific trading platforms this way",
          "Try it with just $250 since it is a small amount",
          "Research the platform to see if it is real"
        ],
        correctIndex: 1,
        explanation: "Fake celebrity endorsements are one of the most common tactics in investment fraud. Scammers use deepfake videos or fabricated quotes. Real celebrities do not endorse trading platforms through social media ads."
      },
      {
        prompt: "Your financial advisor at an established bank recommends diversifying your retirement portfolio with a mix of index funds offering average annual returns of 7-10% over 10 years.",
        options: [
          "This sounds too good to be true",
          "This is a realistic recommendation from a licensed professional at an established institution",
          "Demand higher returns",
          "Move your money to cryptocurrency instead"
        ],
        correctIndex: 1,
        explanation: "Historical average returns of 7-10% for diversified index funds over long periods is realistic. This is a legitimate recommendation from a regulated financial institution. Always work with licensed professionals for investment decisions."
      },
      {
        prompt: "A friend at your social club says: \"My neighbor invested $10,000 in this new platform and now makes $1,500 every week. That is 15% weekly returns. He showed me his account -- the money is really there. I am putting in my retirement savings.\"",
        options: [
          "If your friend's neighbor is making money, it must be legitimate",
          "15% weekly returns would mean 780% annual returns -- this is mathematically impossible for any legitimate investment and is a Ponzi scheme",
          "Invest a small amount to test it",
          "Ask your friend to introduce you to his neighbor"
        ],
        correctIndex: 1,
        explanation: "15% weekly returns equals 780% annual returns -- no legitimate business generates these returns. This is a classic Ponzi scheme where early investors are paid with new investors' money. The 'account showing gains' is a fake display. The scheme will collapse."
      },
      {
        prompt: "Someone you met on a dating app three weeks ago says: \"I have a secret investment method my uncle taught me. I have been making $5,000 a day with it. I like you so much I want to share it with you. Just download this trading app and I will guide you.\"",
        options: [
          "They must really care about you to share their secret",
          "Download the app to see what it is about",
          "This is 'pig butchering' -- building a relationship to lure you into a fake investment platform",
          "Ask for more details about the method"
        ],
        correctIndex: 2,
        explanation: "This is the 'pig butchering' scam. The scammer builds a romantic connection, then introduces a fake investment platform. The app will show fake profits to encourage you to invest more. All money sent is stolen."
      },
      {
        prompt: "You see a newspaper ad for a real estate investment trust (REIT) offering 4-6% annual dividends, registered with the SEC, with publicly available financial reports and a 15-year track record.",
        options: [
          "The returns seem too low -- look for something better",
          "This has the hallmarks of a legitimate investment: realistic returns, SEC registration, public reports, and a long track record",
          "Newspaper ads cannot be trusted",
          "4-6% is not worth the risk"
        ],
        correctIndex: 1,
        explanation: "This has multiple signs of legitimacy: realistic returns (4-6%), SEC registration, transparency through public reports, and a long track record. These are the characteristics to look for in real investments."
      }
    ]
  },
  {
    id: "government-impersonation",
    title: "Verify Before You Trust",
    icon: "shield",
    color: "bg-indigo-500",
    intro: "Government impersonation scams are among the most convincing. Practice identifying fake government communications and learn how to verify real ones.",
    interactiveType: "verify-exercise",
    scenarios: [
      {
        prompt: "You receive a letter in the mail with the IRS logo that says you owe $2,100 in taxes. It includes a notice number (CP2000) and says you have 30 days to respond. It provides a phone number and a mailing address.",
        options: [
          "This is definitely a scam because the IRS never contacts you",
          "Throw it away and ignore it",
          "This could be legitimate -- the IRS does send letters with notice numbers and gives you time to respond. Verify by calling 1-800-829-1040",
          "Pay immediately to avoid penalties"
        ],
        correctIndex: 2,
        explanation: "Unlike phone calls, the IRS does legitimately send letters through the mail. A CP2000 is a real notice type. The key signs of legitimacy: it arrived by mail, has a specific notice number, gives you 30 days (not 24 hours), and you can verify by calling the IRS directly."
      },
      {
        prompt: "A person comes to your door wearing a jacket that says 'Social Security Administration.' They say they need to verify your identity and Social Security number for a new card being issued in your area.",
        options: [
          "Ask for their badge number and check their ID",
          "The SSA does not send agents door-to-door to verify Social Security numbers -- do not open the door or share information",
          "Give them the information since they have an official jacket",
          "Ask them to come back tomorrow"
        ],
        correctIndex: 1,
        explanation: "The SSA does not send agents to your home to verify Social Security numbers. Anyone at your door claiming to need this information is a scammer. Official jackets can be purchased or faked. Do not open the door or share any information."
      },
      {
        prompt: "You get an email from medicare@cms-gov.health-alerts.com saying your Medicare benefits are being reviewed and you need to confirm your beneficiary number to continue coverage.",
        options: [
          "The email mentions CMS (Centers for Medicare & Medicaid Services) so it looks official",
          "Click the link to check your benefits status",
          "The domain 'health-alerts.com' is not a government .gov domain -- this is a phishing email",
          "Reply asking for more information"
        ],
        correctIndex: 2,
        explanation: "Government emails come from .gov domains only. The domain 'health-alerts.com' is not a government website, even though it mentions CMS in the email address. Check your Medicare status at medicare.gov directly."
      },
      {
        prompt: "Your county tax assessor's office sends you a postcard about an upcoming property tax reassessment in your neighborhood. It includes their office address and phone number, with no request for payment or personal information.",
        options: [
          "This is a phishing attempt through the mail",
          "Ignore it as all government communications are scams",
          "This is likely legitimate -- informational notices without payment requests or personal information demands are typical of real government communications",
          "Call the number on the postcard immediately"
        ],
        correctIndex: 2,
        explanation: "Government offices do send informational mail. Key legitimacy signs: no urgent payment demand, no request for personal information, includes verifiable office address, and is purely informational. You can verify by looking up your county tax assessor's office independently."
      },
      {
        prompt: "You receive a text message: \"US Courts: You have been selected for jury duty. Report to https://uscourts-juryduty.com or face a $500 fine. Reply with your SSN to confirm your identity.\"",
        options: [
          "Reply with your SSN to avoid the fine",
          "Click the link to get more details about the jury duty",
          "Courts never send jury duty notices via text, never fine you for not replying to a text, and never ask for your SSN via text -- this is a scam",
          "Call the number back to confirm"
        ],
        correctIndex: 2,
        explanation: "Federal and state courts send jury duty notices by mail only. They never text, never threaten fines via text, and absolutely never request your Social Security number via text message. The fake URL confirms this is a scam."
      }
    ]
  },
  {
    id: "grandparent-scam",
    title: "Grandparent Scam Response Practice",
    icon: "users",
    color: "bg-purple-500",
    intro: "The 'grandparent scam' exploits the love grandparents have for their grandchildren. Practice responding to these manipulative calls so you are prepared if it happens to you.",
    interactiveType: "response-practice",
    scenarios: [
      {
        prompt: "A crying voice calls: \"Grandpa? It's me... I got arrested and I need bail money. Please do not tell Mom.\"",
        options: [
          "\"Oh no! How much do you need? I will get the money right away.\"",
          "\"Which grandchild is this? What is your name?\" -- force them to identify themselves",
          "\"I will call your mother right now to let her know.\"",
          "Hang up and call your grandchild directly on their known phone number"
        ],
        correctIndex: 3,
        explanation: "The safest response is to hang up and call your grandchild directly. Asking 'which grandchild' can work, but the scammer may have researched your family. Calling directly on a number you already have is the most reliable verification."
      },
      {
        prompt: "The caller says: \"Please do not tell Mom and Dad. They will be so disappointed in me. I am begging you, Grandma. Just send the money and I will explain everything when I get out.\"",
        options: [
          "Agree to keep it secret and help them",
          "Recognize this as an isolation tactic -- scammers always say 'do not tell anyone' to prevent you from verifying",
          "Send a smaller amount first",
          "Ask where to send the money"
        ],
        correctIndex: 1,
        explanation: "Asking you to keep a secret from other family members is a deliberate isolation tactic. Real grandchildren in real trouble would want their parents to know. The secrecy prevents you from calling family members who could confirm the scam."
      },
      {
        prompt: "A person claiming to be a lawyer calls after the first call: \"I am your grandchild's attorney. The bail is $8,000. You can pay by wire transfer or gift cards from Target or Walmart. Time is critical.\"",
        options: [
          "This sounds official -- pay the bail",
          "Gift cards and wire transfers are not how bail works -- real bail is paid through a court or licensed bail bondsman. This confirms it is a scam",
          "Ask for the lawyer's office number",
          "Go buy the gift cards but do not give the numbers yet"
        ],
        correctIndex: 1,
        explanation: "Real attorneys never ask for bail payment via gift cards or wire transfers. Bail is paid through the court or a licensed bail bondsman. The 'lawyer' calling after the 'grandchild' is a well-rehearsed scam script designed to add credibility."
      },
      {
        prompt: "You are unsure if the call is real. What should you do?",
        options: [
          "Send the money just in case -- it is better to be safe",
          "Do nothing and hope it works out",
          "Hang up, call your grandchild on their known number, and if you cannot reach them, call their parents. Do not use any number the caller provided",
          "Ask the caller to prove their identity by sharing personal details"
        ],
        correctIndex: 2,
        explanation: "Always verify through your own contacts. Call your grandchild on their known phone number. If you cannot reach them, call their parents. Never use a phone number provided by the caller. Scammers may have personal details from social media."
      },
      {
        prompt: "After you hang up, the caller keeps calling back and leaving urgent voicemails. What is the best response?",
        options: [
          "Answer and tell them you know it is a scam",
          "Block the number and do not answer. If you are still concerned, call your grandchild directly",
          "Answer to find out more information",
          "Call the police non-emergency line to report the calls"
        ],
        correctIndex: 1,
        explanation: "Block the number and do not engage. Engaging with scammers, even to tell them you know, keeps you on their target list. Verify your grandchild is safe by calling them directly. If you want to report it, call police or the FTC separately."
      }
    ]
  }
];

export const emergencyFlowSteps: EmergencyFlowStep[] = [
  {
    id: "start",
    question: "What happened?",
    options: [
      { label: "I sent money to someone", nextId: "sent-money" },
      { label: "I shared personal information", nextId: "shared-info" },
      { label: "I clicked a suspicious link", nextId: "clicked-link" },
      { label: "I gave someone remote access to my computer", nextId: "remote-access" },
      { label: "Someone is pressuring me right now", nextId: "being-pressured" }
    ]
  },
  {
    id: "sent-money",
    question: "How did you send the money?",
    options: [
      { label: "Bank wire transfer", nextId: null, actions: [
        "Call your bank immediately. Ask to recall the wire transfer. Time is critical -- the sooner you call, the better the chance of recovery.",
        "File a complaint with the FBI IC3 at ic3.gov.",
        "Report to the FTC at reportfraud.ftc.gov.",
        "Contact your local police department to file a report."
      ]},
      { label: "Credit or debit card", nextId: null, actions: [
        "Call your bank or credit card company immediately. Report the transaction as fraud.",
        "Request a chargeback (reversal) for the fraudulent charge.",
        "Ask for a new card number to prevent further charges.",
        "File a report with the FTC at reportfraud.ftc.gov."
      ]},
      { label: "Gift cards (iTunes, Google Play, Amazon, etc.)", nextId: null, actions: [
        "Keep the gift cards and receipts.",
        "Contact the gift card company: Apple (1-800-275-2273), Google (support.google.com), Amazon (1-888-280-4331).",
        "Report to the FTC at reportfraud.ftc.gov. Gift card fraud is specifically tracked.",
        "File a report with your local police department."
      ]},
      { label: "Cryptocurrency", nextId: null, actions: [
        "Report to the FBI IC3 at ic3.gov with the wallet address and transaction details.",
        "Contact the cryptocurrency exchange you used (Coinbase, Cash App, etc.) to report fraud.",
        "File a report with the FTC at reportfraud.ftc.gov.",
        "Save all transaction records and communications."
      ]},
      { label: "Mobile Money (M-Pesa, MTN MoMo, etc.)", nextId: null, actions: [
        "Call your mobile money provider immediately: Safaricom M-Pesa (234), MTN MoMo (*170#), Airtel Money (*185#).",
        "Request a transaction reversal -- time is critical.",
        "Visit the nearest agent or service center with your ID and transaction details.",
        "Report to your local police and provide transaction reference numbers.",
        "If in Kenya, report to the Communications Authority of Kenya. In Nigeria, report to EFCC. In South Africa, report to SAPS."
      ]},
      { label: "Western Union or MoneyGram", nextId: null, actions: [
        "Call Western Union (1-800-448-1492) or MoneyGram (1-800-926-9400) immediately to try to stop the transfer.",
        "Ask about their fraud recovery process.",
        "File a complaint with the FTC at reportfraud.ftc.gov.",
        "Report to the FBI IC3 at ic3.gov."
      ]}
    ]
  },
  {
    id: "shared-info",
    question: "What information did you share?",
    options: [
      { label: "Social Security number or National ID", nextId: null, actions: [
        "Place a fraud alert with one of the three credit bureaus: Equifax (1-800-525-6285), Experian (1-888-397-3742), TransUnion (1-800-680-7289). They will notify the others.",
        "Consider placing a credit freeze with all three bureaus.",
        "Go to identitytheft.gov and follow the recovery plan steps.",
        "Monitor your credit reports at annualcreditreport.com for the next 12 months.",
        "File a report with your local police department."
      ]},
      { label: "Bank account or routing numbers", nextId: null, actions: [
        "Contact your bank immediately to close the compromised account.",
        "Open a new account with new account numbers.",
        "Set up fraud alerts with your bank.",
        "Monitor all statements for unauthorized transactions.",
        "Report to the FTC at reportfraud.ftc.gov."
      ]},
      { label: "Medicare or health insurance number", nextId: null, actions: [
        "Call 1-800-MEDICARE (1-800-633-4227) to report the compromise.",
        "Request a new Medicare Beneficiary Identifier (MBI) number.",
        "Create or log into MyMedicare.gov to monitor claims.",
        "Contact your local SHIP office (1-877-839-2675).",
        "Place a fraud alert on your credit reports."
      ]},
      { label: "Passwords or login credentials", nextId: null, actions: [
        "Change the compromised password immediately. Do this from a different device if possible.",
        "If you use the same password elsewhere, change it on all those accounts too.",
        "Enable two-factor authentication on all important accounts.",
        "Check for unauthorized activity on the compromised accounts.",
        "Consider using a password manager to create unique passwords."
      ]},
      { label: "Credit or debit card numbers", nextId: null, actions: [
        "Call your bank or credit card company to report the card as compromised.",
        "Request a new card with a new number.",
        "Review recent transactions for unauthorized charges.",
        "Set up transaction alerts for the new card.",
        "File a report with the FTC if money was stolen."
      ]}
    ]
  },
  {
    id: "clicked-link",
    question: "What happened after you clicked the link?",
    options: [
      { label: "I entered login credentials on a website", nextId: null, actions: [
        "Change the password for that account immediately from a different device.",
        "Change the password on any other account where you used the same password.",
        "Enable two-factor authentication on the affected accounts.",
        "Check the account for unauthorized changes (forwarding rules in email, linked accounts, etc.).",
        "Run an antivirus scan on your device."
      ]},
      { label: "I downloaded a file or program", nextId: null, actions: [
        "Disconnect your device from the internet (turn off Wi-Fi and unplug ethernet).",
        "Run a full antivirus scan. Use Windows Security (built-in) or install Malwarebytes.",
        "Delete the downloaded file. Check your Downloads folder.",
        "Change passwords for banking and email from a different device.",
        "If you cannot remove the file, take your computer to a trusted repair shop."
      ]},
      { label: "Nothing seemed to happen", nextId: null, actions: [
        "Run an antivirus scan on your device -- malware can install silently.",
        "Clear your browser history and cookies.",
        "Monitor your accounts for any unusual activity over the next few weeks.",
        "If you are concerned, change passwords for important accounts as a precaution.",
        "Keep your antivirus software and operating system updated."
      ]},
      { label: "I entered payment information", nextId: null, actions: [
        "Contact your bank or credit card company immediately to report the card as compromised.",
        "Request a new card number.",
        "Monitor your account for unauthorized charges.",
        "File a report with the FTC at reportfraud.ftc.gov.",
        "Run an antivirus scan on your device."
      ]}
    ]
  },
  {
    id: "remote-access",
    question: "What did they do on your computer?",
    options: [
      { label: "They installed software", nextId: null, actions: [
        "Disconnect from the internet immediately.",
        "Uninstall any software they installed. Windows: Settings > Apps. Mac: drag from Applications to Trash.",
        "Run a full antivirus scan.",
        "Change all passwords from a different device (phone or another computer).",
        "Contact your bank to monitor for suspicious activity.",
        "Consider having a trusted technician check your computer."
      ]},
      { label: "They accessed my banking", nextId: null, actions: [
        "Disconnect from the internet immediately.",
        "Call your bank from a phone (not the compromised computer) and report unauthorized access.",
        "Freeze or close affected accounts and open new ones.",
        "Change all passwords from a different device.",
        "File a police report and FTC complaint.",
        "Have a trusted technician wipe and reinstall your computer's operating system."
      ]},
      { label: "I am not sure what they did", nextId: null, actions: [
        "Disconnect from the internet immediately.",
        "Change all passwords from a different device -- start with email and banking.",
        "Run a full antivirus scan.",
        "Contact your bank and credit card companies to alert them.",
        "Monitor all accounts closely for the next several months.",
        "Consider having a trusted technician inspect and potentially wipe your computer."
      ]}
    ]
  },
  {
    id: "being-pressured",
    question: "You are safe. Take a breath. Here is what to do right now:",
    options: [
      { label: "I understand -- show me what to do", nextId: null, actions: [
        "Hang up the phone or close the message. You are not being rude -- you are being safe.",
        "Do NOT send any money, gift cards, or personal information.",
        "Call a trusted family member or friend and tell them what is happening.",
        "If they are threatening you with arrest or legal action, remember: real authorities never demand immediate payment or threaten over the phone.",
        "Block the number or email address.",
        "If you feel in immediate physical danger, call 911 (US), 999 (UK), 000 (Australia), or your local emergency number.",
        "Take your time. No legitimate situation requires you to act within minutes."
      ]}
    ]
  }
];

export const scamStats: ScamStat[] = [
  { label: "Lost by Adults 60+ (2024)", value: "$4.8B", detail: "Reported losses to the FBI. Actual losses estimated at $61 billion including unreported fraud.", source: "FBI IC3 2024 Report", color: "bg-red-500" },
  { label: "Average Loss Per Victim (60+)", value: "$35,101", detail: "Seniors lose more per incident than any other age group, often losing retirement savings.", source: "FBI IC3 2024 Report", color: "bg-orange-500" },
  { label: "Increase in Crypto Scams (60+)", value: "78%", detail: "Cryptocurrency fraud targeting seniors surged 78% from 2022 to 2023.", source: "FBI IC3 2023 Report", color: "bg-amber-500" },
  { label: "Romance Scam Losses (60+)", value: "$1.14B", detail: "Adults over 60 lost over $1.14 billion to romance scams alone.", source: "FTC 2023 Report", color: "bg-rose-500" },
  { label: "Seniors Targeted Annually", value: "1 in 3", detail: "One in three seniors is targeted by fraud each year, many multiple times.", source: "FTC Consumer Sentinel", color: "bg-purple-500" },
  { label: "Fraud Goes Unreported", value: "70%", detail: "Shame, embarrassment, and fear prevent most victims from reporting.", source: "DOJ Elder Justice Initiative", color: "bg-indigo-500" },
  { label: "Tech Support Scam Losses (60+)", value: "$590M", detail: "Tech support scams remain one of the top threats targeting older adults.", source: "FBI IC3 2023 Report", color: "bg-blue-500" },
  { label: "Mobile Money Fraud (Africa)", value: "$4B+", detail: "Mobile money fraud costs Africa an estimated $4 billion annually, disproportionately affecting older users.", source: "GSMA Mobile Money Report", color: "bg-teal-500" }
];

export const familyConversations: FamilyConversation[] = [
  {
    id: "fc-general",
    topic: "Starting the Conversation About Online Safety",
    opener: "I have been learning about online scams and I want to make sure we are all protected. Can we talk about some of the things I have learned?",
    dos: [
      "Approach as a partnership -- 'Let us learn together' rather than 'You need to be careful'",
      "Share a recent news story about a scam as a conversation starter",
      "Acknowledge their experience and intelligence -- they are not naive",
      "Focus on how sophisticated modern scams are -- even experts fall for them",
      "Offer to set up safety features together rather than doing it for them"
    ],
    donts: [
      "Do not be condescending or treat them like they do not understand technology",
      "Do not take away their devices or restrict their independence",
      "Do not use fear as a motivator -- it makes people defensive",
      "Do not say 'I told you so' if they do fall for something",
      "Do not assume they cannot learn new technology -- many seniors are very capable"
    ],
    followUps: [
      "Would you like to go through your phone security settings together this weekend?",
      "I found a great resource we could look at together. Would you be interested?",
      "How about we set up a 'check-in' system? If you get a suspicious call or message, you text me and I can help verify it?"
    ]
  },
  {
    id: "fc-after-scam",
    topic: "After a Scam Has Happened",
    opener: "I am glad you told me about this. You did the right thing by talking to me. Let us figure out the next steps together.",
    dos: [
      "Lead with support and compassion, not blame",
      "Focus on practical next steps, not what went wrong",
      "Remind them that scammers are professional criminals",
      "Help them take immediate protective actions (freeze accounts, change passwords)",
      "Encourage them to report the scam -- it helps protect others"
    ],
    donts: [
      "Do not say 'How could you fall for that?'",
      "Do not make them feel stupid or ashamed",
      "Do not take over their finances without their consent",
      "Do not tell other family members without their permission",
      "Do not overreact -- your calm response encourages them to come to you in the future"
    ],
    followUps: [
      "Let us contact your bank together right now. I will be right here with you.",
      "Would you like me to help you file the report? We can do it together.",
      "This was not your fault. Would it help to talk about what happened?"
    ]
  },
  {
    id: "fc-romance",
    topic: "Discussing Online Dating Safely",
    opener: "I think it is wonderful that you are meeting new people. I just want to make sure you stay safe while doing it. Can we talk about what to watch out for?",
    dos: [
      "Validate their desire for companionship -- it is completely natural",
      "Share specific examples of romance scams without judgment",
      "Offer to help verify profiles together",
      "Suggest setting up a 'dating buddy' system where they can run things by you",
      "Celebrate their openness to technology and new connections"
    ],
    donts: [
      "Do not mock online dating or imply it is only for young people",
      "Do not dismiss their feelings for someone they have met online",
      "Do not spy on their accounts or monitor them secretly",
      "Do not ban them from using dating apps -- that removes their autonomy",
      "Do not assume every online relationship is a scam"
    ],
    followUps: [
      "Would you like to show me the app you are using? I can help check the privacy settings.",
      "If you ever want a second opinion about someone you are talking to, I am always here.",
      "Let us set up a rule together: before sending money to anyone online, you check with me first. No judgment."
    ]
  },
  {
    id: "fc-technology",
    topic: "Helping with New Technology",
    opener: "There are a few really helpful safety features on your phone and computer that are easy to set up. Would you like to go through them together?",
    dos: [
      "Go at their pace -- do not rush",
      "Write down steps in large, clear text they can refer to later",
      "Let them do the clicking and typing so they learn the process",
      "Praise their progress and willingness to learn",
      "Schedule regular check-ins to help with updates and new features"
    ],
    donts: [
      "Do not grab their device and do it yourself",
      "Do not use technical jargon without explaining it",
      "Do not sigh or show frustration if they need to repeat steps",
      "Do not change settings without explaining what you are changing and why",
      "Do not overwhelm them with too many changes at once -- one or two per visit"
    ],
    followUps: [
      "I wrote down the steps we went through. Let me put this somewhere easy for you to find.",
      "Next time I visit, we can set up one more safety feature. Sound good?",
      "If anything confuses you or something changes on your phone, just call me. No question is too small."
    ]
  },
  {
    id: "fc-finances",
    topic: "Discussing Financial Safety",
    opener: "I have been reading about how much money people are losing to scams. Would you be open to reviewing some safety steps we can take together to protect your accounts?",
    dos: [
      "Approach as protecting their independence, not limiting it",
      "Offer to set up account alerts together",
      "Suggest a 'sleep on it' rule for any financial decision over a certain amount",
      "Help them identify their trusted financial advisor",
      "Share that financial fraud affects people of all ages and intelligence levels"
    ],
    donts: [
      "Do not demand access to their accounts or financial information",
      "Do not assume they cannot manage their own money",
      "Do not bring up Power of Attorney unprompted -- it can feel like a threat to independence",
      "Do not compare them to other scam victims",
      "Do not lecture about past financial decisions"
    ],
    followUps: [
      "Would it help to have a trusted contact on your bank account? That person gets notified of unusual activity but cannot access your money.",
      "Let us set up a simple rule: if anyone asks for money urgently, you call me first. I will help verify if it is real.",
      "Your bank might offer free fraud protection features. Want me to call them with you to ask?"
    ]
  }
];
