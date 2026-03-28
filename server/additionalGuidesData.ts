import { CriticalGuideData } from "./criticalGuidesData";

export const additionalGuides: CriticalGuideData[] = [
  {
    slug: "how-to-prevent-sim-swapping",
    title: "How to Prevent SIM Swapping Attacks",
    metaDescription: "Protect your phone number from SIM swapping attacks. Learn how hackers hijack phone numbers to bypass 2FA and drain bank accounts, and how to stop them.",
    category: "identity-theft",
    cluster: "identity-theft",
    tags: ["SIM swap", "phone security", "two-factor authentication", "identity theft", "phone number hijacking"],
    targetKeywords: ["SIM swapping prevention", "how to prevent SIM swap", "SIM swap attack", "phone number hijack", "protect phone number"],
    wordCount: 850,
    readingTimeMinutes: 4,
    headings: [
      { id: "what-is-sim-swapping", text: "What Is SIM Swapping?", level: 2 },
      { id: "how-hackers-do-it", text: "How Hackers Pull Off a SIM Swap", level: 2 },
      { id: "warning-signs", text: "Warning Signs You Are Being SIM Swapped", level: 2 },
      { id: "protection-steps", text: "7 Steps to Protect Your Phone Number", level: 2 },
      { id: "what-to-do", text: "What to Do If You Are SIM Swapped", level: 2 },
    ],
    tableOfContents: [
      { text: "What Is SIM Swapping?", level: 2, anchor: "what-is-sim-swapping" },
      { text: "How Hackers Do It", level: 2, anchor: "how-hackers-do-it" },
      { text: "Warning Signs", level: 2, anchor: "warning-signs" },
      { text: "7 Protection Steps", level: 2, anchor: "protection-steps" },
      { text: "What to Do If Attacked", level: 2, anchor: "what-to-do" },
    ],
    faq: [
      { question: "What is SIM swapping?", answer: "SIM swapping is when a hacker convinces your phone carrier to transfer your phone number to a SIM card they control. This lets them receive your calls, texts, and two-factor authentication codes." },
      { question: "How do I set up a PIN with my carrier?", answer: "Call your carrier directly. AT&T, Verizon, and T-Mobile all offer account PINs. For AT&T, manage it at att.com/myatt. For Verizon, go to My Verizon settings. For T-Mobile, call 611 from your phone." },
      { question: "Is SMS two-factor authentication safe?", answer: "SMS-based 2FA is better than no 2FA, but it is vulnerable to SIM swapping. Use authenticator apps like Google Authenticator or Authy for stronger protection. Hardware security keys offer the best protection." },
      { question: "Can I get my money back if I am SIM swapped?", answer: "Contact your bank immediately. Many banks will reverse unauthorized transactions if reported quickly. File a report with the FBI at ic3.gov and your local police. Document everything for insurance and legal purposes." },
    ],
    content: `SIM swapping is one of the fastest-growing cyberattacks. The FBI reported over $68 million in SIM swapping losses in 2023 alone. This guide explains how SIM swapping works and exactly how to protect yourself.

## What Is SIM Swapping?

A SIM swap attack happens when a hacker convinces your phone carrier to transfer your phone number to a new SIM card - one that the hacker controls. Once they have your number, they receive all your calls, texts, and most importantly, your two-factor authentication (2FA) codes.

With those codes, they can reset passwords on your bank accounts, email, cryptocurrency wallets, and social media profiles.

## How Hackers Pull Off a SIM Swap

### Step 1: Gather Personal Information
Hackers collect your name, address, phone number, and account details from data breaches, social media, or social engineering.

### Step 2: Contact Your Carrier
They call your phone carrier (AT&T, Verizon, T-Mobile) pretending to be you. They claim they lost their phone or need to switch to a new SIM card.

### Step 3: Pass Security Questions
Using your leaked personal information, they answer security questions and convince the carrier representative to make the transfer.

### Step 4: Take Over Your Accounts
With your phone number redirected, they receive your 2FA codes and reset passwords on your banking, email, and financial accounts.

## Warning Signs You Are Being SIM Swapped

- **Your phone suddenly shows "No Service" or "SOS Only"** without any carrier outage in your area
- **You stop receiving text messages and phone calls**
- **You receive emails about password changes you did not request**
- **Your bank sends alerts about transactions you did not make**
- **You cannot log into accounts that use SMS verification**

If you notice any of these signs, **act immediately** - you may have minutes before accounts are compromised.

## 7 Steps to Protect Your Phone Number

### 1. Set a PIN or Passphrase With Your Carrier
Call your carrier and set up an account PIN that must be provided before any account changes. This is the single most important step.

- **AT&T**: Set up "Extra Security" passcode
- **Verizon**: Set up Account PIN in My Verizon
- **T-Mobile**: Enable Account Takeover Protection (call 611)

### 2. Switch From SMS to Authenticator Apps
Replace SMS-based 2FA with authenticator apps on all accounts that support it:
- Google Authenticator
- Authy
- Microsoft Authenticator

These apps generate codes on your device - a SIM swapper cannot intercept them.

### 3. Use Hardware Security Keys
For your most critical accounts (email, banking, crypto), use a hardware security key like YubiKey. This is the strongest form of two-factor authentication available.

### 4. Enable Number Transfer Lock
Most carriers offer a port-out lock or number transfer lock. Enable this to prevent your number from being transferred without extra verification.

### 5. Use Unique Passwords Everywhere
If a hacker has your email password from a data breach and you reuse it, they can access multiple accounts. Use a password manager to create and store unique passwords.

### 6. Limit Personal Information Online
The less personal information available publicly, the harder it is for attackers to answer your security questions. Review your social media privacy settings and remove your information from data broker sites using our [Data Shield tool](/shield).

### 7. Monitor Your Phone Service
Pay attention to your phone's signal. If you unexpectedly lose service, contact your carrier immediately from another phone.

## What to Do If You Are SIM Swapped

1. **Contact your carrier immediately** from another phone. Tell them your number was stolen and ask them to reverse the SIM change.
2. **Change passwords** on your email, banking, and financial accounts from a secure device.
3. **Contact your bank** to freeze accounts and reverse any unauthorized transactions.
4. **File a report** with the FBI at [ic3.gov](https://ic3.gov) and your local police department.
5. **Place a fraud alert** on your credit with Equifax, Experian, and TransUnion.
6. **Review all accounts** that used SMS-based 2FA and update their security settings.

The key to surviving a SIM swap attack is speed. The faster you detect it and respond, the less damage the attacker can do. Setting up carrier protections now is the best prevention.`,
  },
  {
    slug: "smart-home-iot-security-guide",
    title: "How to Secure Your Smart Home and IoT Devices",
    metaDescription: "Protect your smart home devices from hackers. Learn how to secure baby monitors, cameras, smart locks, and other IoT devices in your family home.",
    category: "family-safety",
    cluster: "family-safety",
    tags: ["smart home security", "IoT security", "baby monitor safety", "smart lock", "home network security"],
    targetKeywords: ["smart home security", "how to secure IoT devices", "baby monitor security", "smart home hacking", "protect smart devices"],
    wordCount: 820,
    readingTimeMinutes: 4,
    headings: [
      { id: "smart-home-risks", text: "Why Your Smart Home Is at Risk", level: 2 },
      { id: "most-targeted-devices", text: "Most Targeted Smart Home Devices", level: 2 },
      { id: "securing-your-devices", text: "How to Secure Every Device in Your Home", level: 2 },
      { id: "network-security", text: "Setting Up a Secure Home Network", level: 2 },
      { id: "incident-response", text: "What to Do If a Device Is Compromised", level: 2 },
    ],
    tableOfContents: [
      { text: "Why Your Smart Home Is at Risk", level: 2, anchor: "smart-home-risks" },
      { text: "Most Targeted Devices", level: 2, anchor: "most-targeted-devices" },
      { text: "Securing Your Devices", level: 2, anchor: "securing-your-devices" },
      { text: "Secure Home Network", level: 2, anchor: "network-security" },
      { text: "If a Device Is Compromised", level: 2, anchor: "incident-response" },
    ],
    faq: [
      { question: "Can hackers really access my baby monitor?", answer: "Yes. Baby monitors with default passwords or outdated firmware are regularly hacked. In documented cases, strangers have spoken to children through compromised monitors. Always change the default password and keep firmware updated." },
      { question: "Should I put IoT devices on a separate Wi-Fi network?", answer: "Yes. Creating a separate network for smart devices prevents a compromised IoT device from accessing your computers, phones, and personal data. Most modern routers support guest networks for this purpose." },
      { question: "How often should I update my smart devices?", answer: "Check for firmware updates monthly. Enable automatic updates when available. Devices that no longer receive security updates from the manufacturer should be replaced." },
      { question: "Are cheap smart devices safe to use?", answer: "Inexpensive IoT devices from unknown manufacturers often lack security features and may stop receiving updates. Stick with reputable brands that have published security policies and regular update schedules." },
    ],
    content: `The average American home has 22 connected devices. Each one is a potential entry point for hackers. This guide shows you how to secure every smart device in your home.

## Why Your Smart Home Is at Risk

IoT (Internet of Things) attacks increased over 400% in the past year. The problem is straightforward: most smart devices ship with weak default passwords, and many homeowners never change them. Researchers found that 57% of IoT devices are vulnerable to medium or high-severity attacks.

Unlike your phone or computer, smart devices often lack the processing power for advanced security features. They are designed for convenience, not protection.

## Most Targeted Smart Home Devices

### Baby Monitors and Indoor Cameras
The most alarming attacks involve baby monitors and indoor security cameras. There are documented cases of strangers speaking to children through hacked monitors. Cameras with default credentials are regularly added to public databases of accessible streams.

### Smart Locks and Garage Door Openers
A compromised smart lock gives attackers physical access to your home. Outdated firmware or weak passwords can allow remote unlocking.

### Voice Assistants (Alexa, Google Home)
Voice assistants can be exploited to make purchases, control other smart devices, or eavesdrop on conversations. Always review and delete voice recordings regularly.

### Smart TVs
Many smart TVs have built-in cameras and microphones. They can be used for surveillance if the TV's software is compromised.

### Wi-Fi Routers
Your router is the gateway to every device in your home. A compromised router means every connected device is at risk.

## How to Secure Every Device in Your Home

### 1. Change Every Default Password
This is the most important step. Every smart device comes with a default username and password (often "admin/admin" or "admin/password"). Change these immediately during setup.

### 2. Enable Two-Factor Authentication
When available, enable 2FA on the device's companion app. This adds a second layer of protection even if your password is compromised.

### 3. Keep Firmware Updated
Manufacturers release security patches through firmware updates. Check for updates monthly or enable automatic updates. If a device no longer receives updates, consider replacing it.

### 4. Disable Unnecessary Features
Turn off features you do not use:
- Remote access (if you only use the device at home)
- Microphones (on devices that do not need voice control)
- UPnP (Universal Plug and Play - often exploited by attackers)

### 5. Buy From Reputable Manufacturers
Choose brands with published security policies and a track record of regular security updates. Cheap devices from unknown brands often have no security support.

## Setting Up a Secure Home Network

### Create a Separate IoT Network
Most modern routers let you create a guest network. Put all smart devices on this separate network. This way, if a smart device is compromised, the attacker cannot access your computers, phones, or personal files on the main network.

### Secure Your Router
- Change the default router admin password
- Use WPA3 encryption (or WPA2 at minimum)
- Disable WPS (Wi-Fi Protected Setup)
- Keep router firmware updated
- Use a strong, unique Wi-Fi password

### Monitor Connected Devices
Regularly check your router's admin page for connected devices. If you see devices you do not recognize, investigate immediately. Most router apps show a list of connected devices.

## What to Do If a Device Is Compromised

1. **Disconnect the device** from your network immediately
2. **Factory reset** the device to remove any malicious changes
3. **Change your Wi-Fi password** to prevent re-connection
4. **Update firmware** before reconnecting
5. **Change passwords** on all accounts connected to that device
6. **Check other devices** on the same network for unusual behavior

Securing your smart home takes about an hour of setup time. That hour protects your family from surveillance, harassment, and data theft. Start with the highest-risk devices - baby monitors and cameras - and work through every connected device in your home.`,
  },
  {
    slug: "how-to-protect-cloud-accounts",
    title: "How to Protect Your Google, iCloud, and Microsoft Accounts",
    metaDescription: "Secure your cloud accounts from hackers. Step-by-step guide to protecting your Google, Apple iCloud, and Microsoft accounts from takeover attacks.",
    category: "password-security",
    cluster: "password-security",
    tags: ["cloud security", "Google account security", "iCloud security", "Microsoft security", "account takeover prevention"],
    targetKeywords: ["protect Google account", "secure iCloud account", "Microsoft account security", "cloud account protection", "prevent account takeover"],
    wordCount: 780,
    readingTimeMinutes: 4,
    headings: [
      { id: "why-cloud-accounts-matter", text: "Why Your Cloud Account Is Your Most Valuable Target", level: 2 },
      { id: "securing-google", text: "Securing Your Google Account", level: 2 },
      { id: "securing-apple", text: "Securing Your Apple/iCloud Account", level: 2 },
      { id: "securing-microsoft", text: "Securing Your Microsoft Account", level: 2 },
      { id: "recovery-plan", text: "Building Your Account Recovery Plan", level: 2 },
    ],
    tableOfContents: [
      { text: "Why Cloud Accounts Matter", level: 2, anchor: "why-cloud-accounts-matter" },
      { text: "Securing Google", level: 2, anchor: "securing-google" },
      { text: "Securing Apple/iCloud", level: 2, anchor: "securing-apple" },
      { text: "Securing Microsoft", level: 2, anchor: "securing-microsoft" },
      { text: "Account Recovery Plan", level: 2, anchor: "recovery-plan" },
    ],
    faq: [
      { question: "What is the most important thing I can do to protect my cloud account?", answer: "Enable two-factor authentication. This single step blocks the vast majority of automated attacks. Use an authenticator app rather than SMS for the strongest protection." },
      { question: "How do I check if someone else accessed my Google account?", answer: "Go to myaccount.google.com and click 'Security' then 'Recent security activity.' You can see every device and location that has accessed your account. Revoke access for any device you do not recognize." },
      { question: "What should I do if I am locked out of my cloud account?", answer: "Use the official account recovery process: accounts.google.com/signin/recovery (Google), iforgot.apple.com (Apple), or account.live.com/password/reset (Microsoft). Having backup recovery options set up in advance makes this much easier." },
      { question: "Should I use the same password for my Google and iCloud accounts?", answer: "Never. If one account is compromised in a data breach, attackers will try that same password on your other accounts. Use a unique, strong password for each cloud account." },
    ],
    content: `Your Google, Apple, or Microsoft account is the key to your digital life. If a hacker gains access, they get your emails, photos, documents, contacts, saved passwords, and often your financial information. This guide shows you exactly how to lock down each account.

## Why Your Cloud Account Is Your Most Valuable Target

A compromised cloud account gives an attacker access to:
- **Years of emails** including password reset links and financial statements
- **Personal photos and videos** that can be used for blackmail or identity theft
- **Saved passwords** in your browser's password manager
- **Location history** showing where you live, work, and travel
- **Connected apps** that use your cloud account for login (sign in with Google/Apple)
- **Financial information** from receipts, statements, and connected services

A single cloud account breach can cascade into dozens of compromised accounts.

## Securing Your Google Account

### Step 1: Run Google's Security Checkup
Go to [myaccount.google.com/security-checkup](https://myaccount.google.com/security-checkup). Google walks you through every security setting and highlights issues.

### Step 2: Enable 2-Step Verification
Go to myaccount.google.com > Security > 2-Step Verification. Choose Google Authenticator or a hardware security key for the strongest protection. Avoid SMS when possible.

### Step 3: Review Third-Party Access
Check which apps have access to your account at myaccount.google.com/permissions. Remove any apps you no longer use.

### Step 4: Set Up Recovery Options
Add a recovery phone number and backup email address. These are essential if you ever get locked out.

### Step 5: Check for Data Breaches
Google's Security Checkup shows if your passwords have appeared in known data breaches. Change any compromised passwords immediately.

## Securing Your Apple/iCloud Account

### Step 1: Enable Two-Factor Authentication
On iPhone: Settings > [Your Name] > Password & Security > Two-Factor Authentication. On Mac: System Settings > Apple ID > Password & Security.

### Step 2: Use a Strong Apple ID Password
Your Apple ID password should be at least 16 characters with a mix of letters, numbers, and symbols. Do not reuse it anywhere else.

### Step 3: Review Trusted Devices
Check which devices are signed into your Apple ID at Settings > [Your Name]. Remove any devices you no longer use.

### Step 4: Enable Advanced Data Protection
This enables end-to-end encryption for most iCloud data. Go to Settings > [Your Name] > iCloud > Advanced Data Protection.

### Step 5: Set Up Account Recovery Contacts
Add trusted family members as recovery contacts who can help you regain access if locked out.

## Securing Your Microsoft Account

### Step 1: Enable Two-Step Verification
Go to account.microsoft.com/security. Turn on two-step verification and set up the Microsoft Authenticator app.

### Step 2: Review Sign-In Activity
Check account.microsoft.com/security for recent sign-in activity. Look for logins from unfamiliar devices or locations.

### Step 3: Remove App Passwords
If you have legacy app passwords, remove them and use modern authentication instead.

### Step 4: Set Up Recovery Code
Download your recovery code and store it in a safe place. This is your backup if you lose access to your authenticator.

## Building Your Account Recovery Plan

Having a recovery plan before you need it is essential:

1. **Set up recovery options** on all three platforms (phone number, backup email, trusted contacts)
2. **Save recovery codes** in a secure, offline location (printed in a safe, not in your cloud storage)
3. **Use a password manager** to store unique passwords for each account
4. **Review security settings quarterly** - check connected devices, third-party apps, and recent activity
5. **Keep your recovery phone number current** - if you change phone numbers, update your accounts first

The 20 minutes it takes to secure these three accounts protects years of personal data. Start with whichever account you use most and work through the others this week.`,
  },
  {
    slug: "how-to-detect-deepfakes",
    title: "How to Detect Deepfake Videos, Audio, and Images",
    metaDescription: "Learn how to spot deepfake videos, AI-generated audio, and fake images. Practical guide for families to identify AI-manipulated content.",
    category: "ai-cybersecurity",
    cluster: "ai-cybersecurity",
    tags: ["deepfake detection", "AI-generated content", "fake video", "voice cloning", "AI manipulation"],
    targetKeywords: ["how to detect deepfakes", "spot deepfake video", "AI voice cloning detection", "deepfake warning signs", "identify fake video"],
    wordCount: 790,
    readingTimeMinutes: 4,
    headings: [
      { id: "what-are-deepfakes", text: "What Are Deepfakes and Why Should You Care?", level: 2 },
      { id: "spotting-fake-video", text: "How to Spot a Deepfake Video", level: 2 },
      { id: "detecting-fake-audio", text: "How to Detect AI-Cloned Voice Audio", level: 2 },
      { id: "identifying-fake-images", text: "How to Identify AI-Generated Images", level: 2 },
      { id: "protecting-your-family", text: "Protecting Your Family From Deepfake Scams", level: 2 },
    ],
    tableOfContents: [
      { text: "What Are Deepfakes?", level: 2, anchor: "what-are-deepfakes" },
      { text: "Spotting Fake Video", level: 2, anchor: "spotting-fake-video" },
      { text: "Detecting Fake Audio", level: 2, anchor: "detecting-fake-audio" },
      { text: "Identifying Fake Images", level: 2, anchor: "identifying-fake-images" },
      { text: "Protecting Your Family", level: 2, anchor: "protecting-your-family" },
    ],
    faq: [
      { question: "How realistic are deepfakes in 2026?", answer: "Very realistic. Modern AI can generate convincing face swaps, voice clones, and full video in real-time. However, careful observation still reveals artifacts like unnatural blinking, inconsistent lighting, and lip sync issues." },
      { question: "Can AI clone someone's voice from social media?", answer: "Yes. Current AI technology can create a convincing voice clone from as little as 3 seconds of audio. This is why limiting public video and audio content is an important security measure." },
      { question: "Are there tools that detect deepfakes?", answer: "Several tools exist, including Microsoft Video Authenticator, Intel FakeCatcher, and various browser extensions. However, no tool is 100% accurate. Your own observation skills remain important." },
      { question: "What is a family code word and why do I need one?", answer: "A family code word is a secret word or phrase known only to your family. If someone calls claiming to be a family member in an emergency, ask for the code word. A deepfake scammer will not know it. This simple step has prevented thousands of fraud attempts." },
    ],
    content: `Deepfake technology has moved from a curiosity to a serious threat. In 2025, a finance worker was tricked into transferring $25 million after a deepfake video call impersonated company executives. Families are now being targeted with AI-cloned voices of their loved ones in fake emergency calls.

This guide teaches you practical techniques to detect deepfakes and protect your family.

## What Are Deepfakes and Why Should You Care?

Deepfakes are AI-generated or AI-manipulated videos, audio recordings, and images designed to look and sound like real people. The technology is now:

- **Cheap**: Free and low-cost tools are widely available
- **Fast**: A voice clone can be created from 3 seconds of audio
- **Real-time**: Live video deepfakes can be used in video calls
- **Weaponized**: Used for scams, fraud, political manipulation, and harassment

## How to Spot a Deepfake Video

### Look at the Eyes
- **Unnatural blinking**: Deepfakes often blink at unusual intervals - too rarely or too regularly
- **Reflection inconsistencies**: Check that light reflections in both eyes match. Real eyes reflect the same light source
- **Unfocused gaze**: The eyes may not track naturally when the person moves

### Watch the Face
- **Skin texture**: Look for overly smooth skin or inconsistent texture between the face and neck/ears
- **Face edge blurring**: Where the face meets the hair or background, look for blending artifacts
- **Lip sync**: Pay attention to whether lip movements perfectly match the audio. Slight delays or mismatches are common in deepfakes

### Check the Details
- **Teeth and hair**: AI struggles with fine details. Teeth may look unusual. Individual hair strands may blend together
- **Accessories**: Glasses, earrings, and jewelry often show rendering errors
- **Background**: Look for warping or inconsistencies in the background when the person moves

## How to Detect AI-Cloned Voice Audio

### Listen for These Clues
- **Flat emotional range**: Cloned voices often sound slightly robotic or lack natural emotional variation
- **Breathing patterns**: Real speech includes natural pauses, breaths, and filler sounds. AI audio may sound unnaturally smooth
- **Background noise**: AI-generated audio often has either no background noise or inconsistent ambient sound
- **Pronunciation**: Unusual emphasis on syllables or mispronunciation of names and places the real person would know

### Verification Steps
- **Hang up and call back** on the person's known number
- **Ask a personal question** only the real person would know
- **Use your family code word**

## How to Identify AI-Generated Images

### Common AI Image Artifacts
- **Hands and fingers**: AI frequently generates hands with the wrong number of fingers, fused fingers, or unnatural positions
- **Text in images**: Any text in AI images is usually garbled or nonsensical
- **Symmetry issues**: Faces may be too symmetrical or have asymmetric accessories (mismatched earrings)
- **Background details**: Look for objects that morph into each other or architectural impossibilities
- **Skin and hair**: Overly smooth skin, hair that merges with the background, or unusual skin color transitions

### Use Reverse Image Search
Upload suspicious images to Google Images or TinEye. If the image does not appear anywhere else, it may be AI-generated. If it appears on stock photo sites, it is stolen.

## Protecting Your Family From Deepfake Scams

### 1. Establish a Family Code Word
Choose a secret word or phrase that only family members know. If anyone calls with an emergency, ask for the code word first. Update it periodically.

### 2. Limit Public Video and Audio
Every video you post publicly gives scammers material to create deepfakes. Review privacy settings on social media and consider making video content visible only to friends.

### 3. Verify Before Acting
Any request for money, personal information, or urgent action - whether via video, voice, or text - should be verified through a separate communication channel.

### 4. Educate Everyone in Your Household
Make sure children, teens, and elderly family members know about deepfakes. Show them examples so they understand the technology.

### 5. Report Deepfake Scams
Report deepfake scams to the FBI at [ic3.gov](https://ic3.gov), the FTC at [reportfraud.ftc.gov](https://reportfraud.ftc.gov), and the platform where you encountered the content.

Deepfake detection is not about being paranoid - it is about being prepared. As the technology improves, verification habits become more important than detection skills. Build the habit of verifying before trusting, and your family will be protected.`,
  },
  {
    slug: "teen-online-safety-sextortion-prevention",
    title: "Teen Online Safety: How to Prevent Sextortion and Exploitation",
    metaDescription: "Essential guide for parents on protecting teenagers from sextortion, online predators, and exploitation on social media and gaming platforms.",
    category: "family-safety",
    cluster: "family-safety",
    tags: ["teen safety", "sextortion prevention", "online predators", "parental guidance", "social media safety"],
    targetKeywords: ["teen sextortion prevention", "protect teens online", "teen online safety", "sextortion parent guide", "online predator prevention"],
    wordCount: 830,
    readingTimeMinutes: 4,
    headings: [
      { id: "the-threat", text: "The Growing Threat to Teenagers Online", level: 2 },
      { id: "how-sextortion-works", text: "How Sextortion Works", level: 2 },
      { id: "talking-to-your-teen", text: "How to Talk to Your Teen About Sextortion", level: 2 },
      { id: "prevention-steps", text: "Prevention Steps for Parents", level: 2 },
      { id: "if-your-child-is-targeted", text: "What to Do If Your Child Is Targeted", level: 2 },
    ],
    tableOfContents: [
      { text: "The Growing Threat", level: 2, anchor: "the-threat" },
      { text: "How Sextortion Works", level: 2, anchor: "how-sextortion-works" },
      { text: "Talking to Your Teen", level: 2, anchor: "talking-to-your-teen" },
      { text: "Prevention Steps", level: 2, anchor: "prevention-steps" },
      { text: "If Your Child Is Targeted", level: 2, anchor: "if-your-child-is-targeted" },
    ],
    faq: [
      { question: "What age group is most at risk for sextortion?", answer: "Boys aged 14-17 are the most targeted demographic, though all teens are at risk. The FBI reports that boys now make up the majority of sextortion victims, a shift from previous years." },
      { question: "Should I monitor my teen's social media?", answer: "Open communication is more effective than surveillance. Have regular conversations about online safety, establish ground rules together, and create an environment where your teen feels safe telling you if something goes wrong." },
      { question: "My teen was targeted but is too embarrassed to tell anyone. What should I do?", answer: "Reassure them that they are the victim and will not be in trouble. Many teens feel shame and fear, which is exactly what predators exploit. Professional counseling may help. Contact NCMEC at CyberTipline.org for support." },
      { question: "Can sextortion images be removed from the internet?", answer: "Yes. Use NCMEC's Take It Down service at takeitdown.ncmec.org. This free tool works with major platforms to remove intimate images of minors. It uses hash technology so the images are never seen by NCMEC staff." },
    ],
    content: `The FBI has declared sextortion the fastest-growing threat to minors in the United States. NCMEC received over 186,000 sextortion reports in 2023. At least 30 teen suicides have been linked to sextortion. This guide gives parents the tools to protect their children.

## The Growing Threat to Teenagers Online

Sextortion is when someone threatens to share intimate images of your child unless they pay money or provide more images. The threat is growing for several reasons:

- **Platform access**: Teens are active on Instagram, Snapchat, TikTok, Discord, and gaming platforms where predators operate
- **AI tools**: Predators now use AI to create fake intimate images from ordinary photos
- **Financial targeting**: A shift from sexual to financial motivations means organized criminal networks now run sextortion operations at scale
- **Shame and silence**: Victims often feel too ashamed to tell parents, which allows the exploitation to continue

## How Sextortion Works

### The Typical Pattern
1. **Contact**: A predator creates a fake profile (usually posing as an attractive teenager) and initiates contact on social media or gaming platforms
2. **Trust building**: Friendly conversation over days or weeks, gradually becoming more personal
3. **Escalation**: The predator asks for intimate images, sometimes sending fake images first to normalize the exchange
4. **Threat**: Once images are received, the predator threatens to send them to the victim's school, family, and friends unless money is paid
5. **Ongoing demands**: Even after payment, demands continue for more money or more images

### The Financial Variant
In the growing financial variant, predators do not want more images - they want money. They target boys, quickly obtain compromising material, and demand immediate payment via Cash App, Venmo, or gift cards. Many of these operations originate from organized criminal groups.

## How to Talk to Your Teen About Sextortion

### Start the Conversation Early
Do not wait for a problem. Bring up the topic as part of regular conversations about online safety.

### Key Messages for Teens
- **It is never safe to share intimate images with anyone online**, even someone you think you trust. Images can be saved, screenshotted, and shared instantly.
- **If someone threatens you, it is not your fault.** You are the victim. Predators are skilled manipulators.
- **Do not pay.** Paying almost always leads to more demands, not safety.
- **Tell a trusted adult immediately.** You will not be in trouble. Parents want to help.
- **You are not alone.** This happens to thousands of teens. There are people who can help.

### Avoid Shame-Based Messaging
Research shows that shame-based warnings ("how could you do that?") make teens less likely to report. Focus on empowerment and trust.

## Prevention Steps for Parents

### 1. Establish Open Communication
Create an environment where your teen feels safe talking to you about anything that happens online. Regular, non-judgmental conversations are the most effective prevention.

### 2. Review Privacy Settings Together
Go through privacy settings on each platform with your teen. Set profiles to private. Disable direct messages from strangers. Review who can see their content.

### 3. Discuss the Permanence of Digital Content
Help your teen understand that anything shared digitally can be saved, screenshotted, and distributed permanently, even on "disappearing" message platforms like Snapchat.

### 4. Know the Platforms
Familiarize yourself with the platforms your teen uses. Understand how direct messages, friend requests, and privacy settings work on each one.

### 5. Set Ground Rules Together
Collaborate on rules rather than imposing them. Teens who help create the rules are more likely to follow them. Agree on things like: no messaging strangers, no sharing personal information, and always telling a parent about uncomfortable interactions.

## What to Do If Your Child Is Targeted

### Immediate Steps
1. **Stay calm and supportive.** Your teen is terrified. Reassure them that they are safe and not in trouble.
2. **Stop all communication** with the predator. Do not respond to threats.
3. **Do not pay.** Payment leads to escalation, not resolution.
4. **Screenshot everything** - messages, threats, the predator's profile, and any payment demands.
5. **Do not delete anything.** Evidence is essential for law enforcement.

### Reporting
- **NCMEC CyberTipline**: Report at [CyberTipline.org](https://www.cybertipline.org). This is the central reporting system for crimes against minors.
- **FBI**: Report at [ic3.gov](https://ic3.gov). The FBI has specialized teams for sextortion.
- **Take It Down**: Use [takeitdown.ncmec.org](https://takeitdown.ncmec.org) to remove images from major platforms.
- **Platform reporting**: Report the account on the social media platform.
- **Local police**: File a report with your local law enforcement.

### Get Support
Contact the Crisis Text Line (text HOME to 741741) or the Childhelp National Child Abuse Hotline (1-800-422-4453). Professional counseling can help your teen process the experience.

Your teen's safety depends more on open communication than on any monitoring tool. Build trust, have the conversations, and make sure they know you are there to help, not punish.`,
  },
  {
    slug: "ai-safety-guide-for-families",
    title: "AI Safety Guide for Families: Protecting Your Household",
    metaDescription: "Family guide to staying safe with AI tools. Learn about deepfakes, AI voice cloning, chatbot scams, and how to protect your family from AI-powered threats.",
    category: "ai-cybersecurity",
    cluster: "ai-cybersecurity",
    tags: ["AI safety", "family AI guide", "deepfake protection", "AI scams", "AI literacy"],
    targetKeywords: ["AI safety for families", "protect family from AI scams", "AI threat guide", "family deepfake protection", "AI safety tips"],
    wordCount: 800,
    readingTimeMinutes: 4,
    headings: [
      { id: "ai-threats-overview", text: "AI Threats Every Family Should Know About", level: 2 },
      { id: "voice-cloning-protection", text: "Protecting Against AI Voice Cloning", level: 2 },
      { id: "ai-generated-content", text: "Recognizing AI-Generated Content", level: 2 },
      { id: "safe-ai-use", text: "Using AI Tools Safely as a Family", level: 2 },
      { id: "family-action-plan", text: "Your Family AI Safety Action Plan", level: 2 },
    ],
    tableOfContents: [
      { text: "AI Threats Overview", level: 2, anchor: "ai-threats-overview" },
      { text: "Voice Cloning Protection", level: 2, anchor: "voice-cloning-protection" },
      { text: "AI-Generated Content", level: 2, anchor: "ai-generated-content" },
      { text: "Safe AI Use", level: 2, anchor: "safe-ai-use" },
      { text: "Family Action Plan", level: 2, anchor: "family-action-plan" },
    ],
    faq: [
      { question: "Should I let my kids use AI chatbots like ChatGPT?", answer: "AI chatbots can be valuable learning tools, but children should use them with adult awareness. Set ground rules: never share personal information, understand that AI can be wrong, and discuss what they are using it for." },
      { question: "Can AI create fake images of my child?", answer: "Unfortunately, yes. AI can generate realistic fake images from ordinary photos. This is why limiting publicly shared photos of children is an important safety measure. If fake images appear, report them to the platform and to NCMEC." },
      { question: "How do I explain AI safety to young children?", answer: "Use simple concepts: 'Some things on the internet are made by computers to look real but are not. If you see or hear something confusing or scary, tell me right away. We have a secret code word to prove who we really are.'" },
      { question: "Is it safe to use AI voice assistants at home?", answer: "Voice assistants are generally safe for home use. To protect privacy: review and delete voice recordings regularly, disable purchasing by voice, and place assistants away from bedrooms and private conversations." },
    ],
    content: `Artificial intelligence is transforming everyday life - but it is also creating new threats for families. AI-powered scams are harder to detect, easier to create, and increasingly targeting individuals and families. This guide helps every member of your household understand and stay safe from AI threats.

## AI Threats Every Family Should Know About

### AI Voice Cloning
Scammers can clone a family member's voice from as little as 3 seconds of audio found on social media, voicemails, or phone calls. They use the cloned voice to make emergency calls asking for money.

### Deepfake Video
AI can generate realistic video of any person in real-time. This technology is being used in video call scams, fake celebrity endorsements, and fabricated compromising content.

### AI-Powered Phishing
AI helps scammers write perfect phishing emails with no spelling errors, proper grammar, and personalized details. These are much harder to detect than traditional phishing attempts.

### Fake AI Chatbots
Scammers deploy AI chatbots on fake websites that mimic real companies. These bots engage in convincing conversation to extract login credentials and payment information.

### AI-Generated Fake Images
AI can create realistic images of people who do not exist, or place real people into fabricated scenarios. This is used for fraud, harassment, and misinformation.

## Protecting Against AI Voice Cloning

### Establish a Family Code Word
Choose a secret word or phrase that only your family knows. If you receive an emergency call from a family member, ask for the code word before taking any action.

- Choose something memorable but not guessable
- Share it only with family members, in person
- Change it every few months
- Never share it digitally

### Limit Public Voice Content
Every video you post publicly provides material for voice cloning. Review the privacy settings on your social media accounts. Consider making video posts visible only to friends and family.

### Always Verify Emergency Calls
If you receive a distressing call from a family member:
1. Stay calm
2. Ask for the family code word
3. Hang up and call them back on their known number
4. Call another family member to verify their location

## Recognizing AI-Generated Content

### Text
AI-generated text is grammatically perfect but may lack personal details, contain outdated information, or feel slightly generic. Be suspicious of perfectly written messages from unknown contacts.

### Images
Look for AI artifacts: unusual hands and fingers, garbled text within images, overly smooth skin, and objects that blend into each other unnaturally.

### Video
Watch for unnatural blinking, lip sync issues, inconsistent lighting, and faces that look overly smooth or oddly textured.

### Audio
Listen for flat emotional range, missing breathing sounds, and unusual pronunciation of names or places.

## Using AI Tools Safely as a Family

### Ground Rules for Children
- Never share personal information (name, school, address, phone number) with AI chatbots
- Understand that AI can generate incorrect or misleading information
- AI-generated content should never be presented as your own work without disclosure
- If an AI interaction feels uncomfortable or confusing, tell a parent

### Privacy With AI Services
- Read privacy policies before using AI services - some retain your data
- Use AI tools that do not store conversation history for sensitive topics
- Do not upload family photos to unknown AI apps or websites
- Be selective about which AI apps have microphone or camera access

### Family Conversations About AI
Discuss AI regularly with your family. Topics to cover:
- What AI can and cannot do
- How scammers use AI
- How to verify information from AI sources
- The difference between AI tools for learning and AI tools for deception

## Your Family AI Safety Action Plan

### This Week
1. **Create your family code word** and share it with all family members in person
2. **Review social media privacy settings** for every family member - limit public video and audio content
3. **Enable two-factor authentication** on all critical accounts

### This Month
4. **Have a family conversation about AI** - show examples of deepfakes and discuss what to watch for
5. **Set ground rules for AI tool use** for children
6. **Review and update your voice assistant** privacy settings

### Ongoing
7. **Update the code word** every 3-6 months
8. **Stay informed** about new AI threats through trusted sources
9. **Practice verification** - make the "call back to verify" habit second nature

AI technology is not going away - it will only become more powerful and accessible. Families that build verification habits, maintain open communication, and stay informed will be well-protected against AI-powered threats.`,
  },
  {
    slug: "what-to-do-if-phone-number-stolen",
    title: "What to Do If Your Phone Number Is Stolen (SIM Swap Recovery)",
    metaDescription: "Step-by-step emergency guide for recovering from a SIM swap attack. What to do immediately when your phone number is stolen and accounts are compromised.",
    category: "identity-theft",
    cluster: "identity-theft",
    tags: ["SIM swap recovery", "phone number stolen", "account recovery", "identity theft response", "emergency security"],
    targetKeywords: ["phone number stolen what to do", "SIM swap recovery guide", "SIM swap emergency steps", "recover from SIM swap", "phone hijacked help"],
    wordCount: 760,
    readingTimeMinutes: 4,
    headings: [
      { id: "recognize-the-attack", text: "How to Recognize a SIM Swap Attack", level: 2 },
      { id: "first-30-minutes", text: "The First 30 Minutes: Critical Actions", level: 2 },
      { id: "first-24-hours", text: "The First 24 Hours: Securing Everything", level: 2 },
      { id: "recovery-and-reporting", text: "Recovery and Reporting", level: 2 },
      { id: "preventing-future-attacks", text: "Preventing Future Attacks", level: 2 },
    ],
    tableOfContents: [
      { text: "Recognize the Attack", level: 2, anchor: "recognize-the-attack" },
      { text: "First 30 Minutes", level: 2, anchor: "first-30-minutes" },
      { text: "First 24 Hours", level: 2, anchor: "first-24-hours" },
      { text: "Recovery and Reporting", level: 2, anchor: "recovery-and-reporting" },
      { text: "Preventing Future Attacks", level: 2, anchor: "preventing-future-attacks" },
    ],
    faq: [
      { question: "How quickly do I need to act during a SIM swap?", answer: "Immediately. Attackers typically begin accessing accounts within minutes of a successful SIM swap. The difference between acting in 5 minutes versus 30 minutes can mean the difference between saving and losing your accounts." },
      { question: "Can my carrier reverse a SIM swap?", answer: "Yes. Call your carrier from another phone immediately. They can reverse the SIM change and restore your number. This is the single most urgent step." },
      { question: "Will my bank cover losses from a SIM swap?", answer: "Most banks will investigate unauthorized transactions from SIM swap attacks. File a report immediately and provide the FBI IC3 report number. Outcomes vary, but acting quickly improves your chances of recovery." },
      { question: "Should I file a police report?", answer: "Yes. File a report with both local police and the FBI at ic3.gov. A police report is often required by banks and insurance companies to process claims. Keep copies of all report numbers." },
    ],
    content: `If your phone suddenly loses service and you suspect a SIM swap attack, every minute counts. This is your emergency response guide.

## How to Recognize a SIM Swap Attack

A SIM swap is happening if:
- Your phone shows "No Service," "SOS Only," or "Emergency Calls Only" without a known carrier outage
- You cannot make calls or send texts
- You receive emails about password resets you did not request
- Your bank sends transaction alerts for activity you did not authorize

**Do not assume it is a temporary outage.** If your phone loses service unexpectedly and you cannot explain why, treat it as a SIM swap until proven otherwise.

## The First 30 Minutes: Critical Actions

### 1. Call Your Carrier Immediately (From Another Phone)
This is the single most important step. Call from a family member's phone, a landline, or a neighbor's phone.

- **AT&T**: 1-800-331-0500
- **Verizon**: 1-800-922-0204
- **T-Mobile**: 1-800-937-8997

Tell them: "I believe my number has been SIM swapped without my authorization. I need the change reversed immediately and a temporary lock placed on my account."

### 2. Change Your Email Password
From a secure device (a computer, not the affected phone), change your primary email password immediately. Your email is the key to resetting all other passwords.

### 3. Change Your Bank Password
Log into your bank from a secure device and change your password. If possible, freeze your accounts temporarily through the bank's app or by calling.

### 4. Lock Your Cryptocurrency Accounts
If you hold cryptocurrency, lock or freeze those accounts immediately. Crypto transactions are irreversible.

## The First 24 Hours: Securing Everything

### Change Passwords on Critical Accounts
Work through accounts in this priority order:
1. Primary email (Gmail, Outlook, iCloud)
2. Banking and financial accounts
3. Cryptocurrency exchanges
4. Secondary email accounts
5. Social media accounts
6. Shopping accounts (Amazon, PayPal)
7. Any account that used SMS 2FA

### Switch All Accounts Away From SMS 2FA
As you change each password, switch from SMS-based two-factor authentication to an authenticator app (Google Authenticator, Authy) or a hardware key.

### Check for Email Forwarding Rules
Attackers often set up email forwarding to copy your messages to their address. Check your email settings for any forwarding rules you did not create.

### Review Bank and Financial Statements
Look for unauthorized transactions. Report any you find to your bank immediately.

## Recovery and Reporting

### File Reports
1. **FBI IC3**: Report at [ic3.gov](https://ic3.gov). SIM swapping is a federal crime.
2. **Local police**: File a police report. You may need this for bank claims.
3. **FTC**: Report at [identitytheft.gov](https://identitytheft.gov) if identity theft occurred.
4. **Credit bureaus**: Place a fraud alert with Equifax (1-800-525-6285), Experian (1-888-397-3742), and TransUnion (1-800-680-7289).

### Contact Your Bank
Provide your bank with the FBI IC3 report number and police report number. Request a review of all transactions during the period your number was compromised.

### Document Everything
Keep records of:
- The exact time you lost phone service
- All fraudulent transactions
- All report numbers (FBI, police, carrier)
- Screenshots of unauthorized account activity
- Communications with your carrier about the incident

## Preventing Future Attacks

After recovery, take these steps to prevent another attack:

1. **Set a carrier PIN**: Require a PIN for any account changes
2. **Enable number transfer lock**: Prevent unauthorized port-out requests
3. **Switch to authenticator apps**: Remove SMS as a 2FA option on all accounts
4. **Use hardware security keys**: For your most valuable accounts (email, banking)
5. **Remove personal data**: Use our [Data Shield tool](/shield) to find and remove personal information from data brokers that attackers use for social engineering
6. **Monitor regularly**: Watch for unexpected service interruptions

A SIM swap attack is stressful, but acting quickly can prevent most of the damage. Keep this guide bookmarked and share it with family members so everyone knows what to do in an emergency.`,
  },
  {
    slug: "complete-guide-to-password-managers",
    title: "Complete Guide to Password Managers for Families",
    metaDescription: "Learn why every family needs a password manager and how to set one up. Compare top options and learn how to share passwords safely with family members.",
    category: "password-security",
    cluster: "password-security",
    tags: ["password manager", "family passwords", "password security", "1Password", "Bitwarden"],
    targetKeywords: ["password manager for families", "best family password manager", "how to use password manager", "family password sharing", "password manager guide"],
    wordCount: 770,
    readingTimeMinutes: 4,
    headings: [
      { id: "why-password-managers", text: "Why Every Family Needs a Password Manager", level: 2 },
      { id: "how-they-work", text: "How Password Managers Work", level: 2 },
      { id: "choosing-right-one", text: "Choosing the Right Password Manager", level: 2 },
      { id: "setting-up", text: "Setting Up Your Family Password Manager", level: 2 },
      { id: "family-sharing", text: "Sharing Passwords Safely With Family", level: 2 },
    ],
    tableOfContents: [
      { text: "Why You Need One", level: 2, anchor: "why-password-managers" },
      { text: "How They Work", level: 2, anchor: "how-they-work" },
      { text: "Choosing the Right One", level: 2, anchor: "choosing-right-one" },
      { text: "Setting Up", level: 2, anchor: "setting-up" },
      { text: "Family Sharing", level: 2, anchor: "family-sharing" },
    ],
    faq: [
      { question: "What if I forget my master password?", answer: "Most password managers provide a recovery kit during setup. Store this in a safe physical location (not digitally). Some managers also offer biometric unlock and account recovery through trusted contacts." },
      { question: "Are password managers safe?", answer: "Yes. Password managers use military-grade encryption (AES-256). Your passwords are encrypted before they leave your device. Even if the password manager company is breached, your encrypted passwords cannot be read without your master password." },
      { question: "Can my kids use a password manager?", answer: "Yes. Most family plans allow accounts for children. Children should learn password hygiene early. Many password managers have simplified interfaces for younger users." },
      { question: "Should I use my browser's built-in password manager?", answer: "Browser password managers (Chrome, Safari, Firefox) are better than reusing passwords, but dedicated managers offer stronger security, cross-browser support, family sharing, and breach monitoring features." },
    ],
    content: `The average person has 100+ online accounts. Remembering unique, strong passwords for each one is impossible without help. A password manager solves this problem and is the single most impactful security tool for families.

## Why Every Family Needs a Password Manager

### The Problem
- 65% of people reuse passwords across multiple accounts
- When one site is breached, every account sharing that password is compromised
- Family members often share passwords insecurely (text messages, sticky notes, shared documents)
- Weak passwords remain the #1 cause of account breaches

### The Solution
A password manager creates, stores, and fills unique, strong passwords for every account. You remember one master password. The manager handles everything else.

## How Password Managers Work

1. **You create a master password**: This is the only password you need to remember. Make it strong and unique.
2. **The manager generates passwords**: For every new account, it creates a random, strong password (like kP9mR2vLxnQ5wB).
3. **Encrypted storage**: All passwords are encrypted with military-grade encryption (AES-256) and stored securely.
4. **Auto-fill**: When you visit a website, the manager fills in your username and password automatically.
5. **Sync across devices**: Your passwords are available on your phone, tablet, and computer.

## Choosing the Right Password Manager

### For Most Families: 1Password or Bitwarden

**1Password** ($4.99/month for families up to 5)
- Excellent family sharing features
- Travel mode (hides sensitive data when crossing borders)
- Watchtower alerts for compromised passwords
- Easy to use for non-technical family members

**Bitwarden** (Free, or $3.33/month for families up to 6)
- Open source (code is publicly audited)
- Free tier is genuinely useful
- Family plan is the most affordable option
- Self-hosting option for advanced users

**Apple Passwords** (Free with Apple devices)
- Built into iPhone, iPad, and Mac
- Seamless for all-Apple households
- Family sharing through iCloud
- Limited to Apple ecosystem

### Features to Look For
- Family sharing with separate vaults for each person
- Shared folders for household accounts (streaming, utilities)
- Breach monitoring (alerts when your passwords appear in data breaches)
- Cross-platform support (works on all your devices)
- Emergency access (trusted person can access your vault in an emergency)

## Setting Up Your Family Password Manager

### Step 1: Choose Your Manager and Create Your Account
Install the app and browser extension. Create your master password - aim for 4+ random words (like "correct horse battery staple") which is both strong and memorable.

### Step 2: Import Existing Passwords
Most managers can import passwords from your browser. Export from Chrome/Safari/Firefox and import into your new manager.

### Step 3: Install Browser Extensions
Install the manager's browser extension on every browser your family uses. This enables auto-fill and auto-save for new accounts.

### Step 4: Install Mobile Apps
Install the app on every phone and tablet. Enable biometric unlock (fingerprint or face) for convenience.

### Step 5: Start Updating Passwords
Begin changing reused and weak passwords. Start with the most critical accounts: email, banking, and social media. Use the password generator to create unique passwords for each.

## Sharing Passwords Safely With Family

### Create a Shared Family Vault
Set up a shared vault for accounts the whole family uses:
- Streaming services (Netflix, Disney+, Spotify)
- Wi-Fi password
- Home security system
- Utility accounts
- Family subscriptions

### Give Each Person Their Own Vault
Every family member should have their own private vault for:
- Personal email
- Social media accounts
- School accounts (for children)
- Work accounts (for adults)

### Set Up Emergency Access
Configure emergency access so a trusted family member can access your vault if something happens to you. Most managers have a waiting period (24-72 hours) before emergency access is granted, which you can cancel if triggered accidentally.

### Teach Your Family
Walk each family member through how to use the manager. Show them how to:
- Use auto-fill on websites
- Generate new passwords
- Access the shared family vault
- Use the mobile app

A password manager takes about 30 minutes to set up and saves hours of frustration. More importantly, it is the single best step your family can take to prevent account breaches and identity theft.`,
  },
];
