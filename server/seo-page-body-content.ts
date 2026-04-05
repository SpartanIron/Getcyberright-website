export const PAGE_BODY_CONTENT: Record<string, { bodyContent: string; relatedLinks?: { text: string; href: string }[] }> = {
  "/faq": {
    bodyContent: `<p>Cybersecurity can feel overwhelming, but most people have the same core questions. We have gathered the most common questions we receive from families, seniors, parents, and small business owners and answered them in plain language. No jargon, no scare tactics, just straightforward guidance you can act on today.</p>
    <h2>Getting Started with Online Safety</h2>
    <p>The best place to start is with the basics: use a unique, strong password for every account, turn on two-factor authentication wherever it is available, keep your devices and apps updated, and be cautious about links in emails or text messages. These four steps alone prevent the vast majority of common attacks. Our <a href="/quick-assessment">Quick Assessment</a> can help you identify which areas need the most attention.</p>
    <h2>Understanding the Threat Landscape</h2>
    <p>Online threats have evolved dramatically. AI-generated phishing emails now look indistinguishable from legitimate messages. Voice cloning technology can replicate a family member's voice from just a few seconds of audio. Data brokers collect and sell your personal information to anyone willing to pay. Understanding these threats is the first step to defending against them. Browse our <a href="/scam-intel">Scam Intelligence Center</a> for the latest threat data and our <a href="/guides">Safety Guides</a> for step-by-step protection instructions.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Quick Assessment", href: "/quick-assessment" },
      { text: "Emergency Help", href: "/emergency-help" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
  "/ai-prompts": {
    bodyContent: `<p>AI tools like ChatGPT, Claude, and Google Gemini are powerful resources for learning about cybersecurity, but getting useful results depends on asking the right questions. Our library of 406+ expertly crafted prompts gives you ready-to-use instructions that produce detailed, actionable security guidance from any major AI assistant.</p>
    <h2>How to Use These Prompts</h2>
    <p>Simply copy any prompt from our library and paste it into your preferred AI tool. Each prompt is designed to produce a comprehensive, expert-level response covering the topic from multiple angles. We have organized them into categories including threat analysis, privacy protection, device security, family safety, business security, and incident response.</p>
    <h2>Why Curated Prompts Matter</h2>
    <p>The quality of AI output depends entirely on the quality of the input. Vague questions like "how do I stay safe online" produce generic answers. Our prompts are carefully structured to extract specific, actionable guidance. They include context, constraints, and follow-up instructions that guide the AI to produce responses you can actually use. Each prompt has been tested across multiple AI platforms to ensure consistent, high-quality results.</p>
    <h2>Safety Guidelines for AI Usage</h2>
    <p>While AI tools are excellent for learning, never share sensitive personal information like passwords, social security numbers, or financial details in an AI chat. Our prompts are designed to help you learn security concepts without exposing private data. Visit our <a href="/ai-safety">AI Safety Guide</a> for comprehensive guidance on using AI tools responsibly.</p>`,
    relatedLinks: [
      { text: "AI Safety Guide", href: "/ai-safety" },
      { text: "Training Academy", href: "/training" },
      { text: "Cybersecurity Guides", href: "/guides" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
    ],
  },
  "/training": {
    bodyContent: `<p>Most cybersecurity training is built for IT professionals and costs hundreds or thousands of dollars. Our Training Academy is different. We built structured learning paths for everyday people, families, seniors, parents, educators, and small business owners, using plain language and real-world examples that anyone can follow.</p>
    <h2>How Our Training Works</h2>
    <p>Each course is broken into short, focused lessons that take 5 to 15 minutes to complete. You can work through them at your own pace, pause and return anytime, and track your progress. There are no prerequisites and no prior technical knowledge needed. Every concept is explained from scratch with practical examples you will recognize from daily life.</p>
    <h2>Learning Paths by Audience</h2>
    <ul><li><strong>Families</strong> - Password basics, safe browsing, social media privacy, and protecting personal information as a household</li><li><strong>Seniors</strong> - Recognizing phone and email scams, protecting financial accounts, avoiding tech support fraud, and setting up basic device security</li><li><strong>Parents</strong> - Setting up parental controls, having age-appropriate safety conversations, monitoring without micromanaging, and understanding the apps your kids use</li><li><strong>Small Businesses</strong> - Employee awareness training, email security, data backup strategies, and incident response planning</li><li><strong>Educators</strong> - Classroom-ready lesson plans, student activities, and assessment tools for teaching digital citizenship</li></ul>
    <h2>Practical Skills You Will Learn</h2>
    <p>Our courses focus on skills you can apply immediately: creating and managing strong passwords, spotting phishing emails and fake websites, securing your devices and home network, protecting your identity online, and knowing exactly what to do if something goes wrong.</p>`,
    relatedLinks: [
      { text: "Cybersecurity Guides", href: "/guides" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "AI Prompt Library", href: "/ai-prompts" },
      { text: "Quick Assessment", href: "/quick-assessment" },
    ],
  },
  "/cyber-threat-radar": {
    bodyContent: `<p>Cyber threats move fast. New scam campaigns, malware outbreaks, and data breaches emerge every day, and knowing what is happening right now helps you stay one step ahead. Our Cyber Threat Radar aggregates real-time threat intelligence from trusted sources worldwide and presents it in a format anyone can understand.</p>
    <h2>What the Threat Radar Shows</h2>
    <p>The radar displays active threat alerts categorized by severity (critical, high, medium, low) and type (phishing, malware, data breach, scam campaign, vulnerability). Each alert includes a plain-language summary of what the threat is, who it targets, and what you should do to protect yourself. We focus on threats that affect everyday people, not just enterprise IT teams.</p>
    <h2>Where Our Data Comes From</h2>
    <p>We aggregate threat intelligence from government cybersecurity agencies including CISA, the FBI IC3, and the UK NCSC, as well as trusted industry sources, security research feeds, and our own platform data from scam reports and scan results. Data is refreshed automatically to ensure timely alerts.</p>
    <h2>How to Use Threat Intelligence</h2>
    <p>Check the radar regularly to stay informed about active threats in your region. If a critical alert is issued for a service you use, take the recommended protective actions immediately. Share relevant alerts with family members, especially seniors who may be targeted by specific scam campaigns. Subscribe to our alerts to receive notifications when new high-severity threats are published.</p>`,
    relatedLinks: [
      { text: "Threat Alerts", href: "/alerts" },
      { text: "Threat Trends", href: "/threat-trends" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
    ],
  },
  "/awareness-hub": {
    bodyContent: `<p>Knowing about online threats is only useful if you can put that knowledge into practice. Our Cyber Awareness Hub brings together printable guides, interactive checklists, visual infographics, and shareable resources that make it easy to build better security habits for yourself and the people you care about.</p>
    <h2>Resources for Every Setting</h2>
    <ul><li><strong>Home and Family</strong> - Conversation starters for talking to kids and seniors about online safety, family security checklists, and device setup guides</li><li><strong>Schools and Classrooms</strong> - Lesson plans, student worksheets, and age-appropriate activities that teach digital citizenship</li><li><strong>Community Organizations</strong> - Presentation materials, awareness posters, and handouts for libraries, senior centers, and community groups</li><li><strong>Small Businesses</strong> - Employee training materials, security policy templates, and incident response guides</li></ul>
    <h2>Why Awareness Matters</h2>
    <p>Human error is involved in the vast majority of security incidents. The most sophisticated security technology cannot protect someone who clicks a phishing link or shares their password over the phone. Building awareness and good habits is the single most effective way to reduce your risk. Our materials are designed to make that process simple and accessible for everyone, regardless of technical background.</p>`,
    relatedLinks: [
      { text: "Printable Guides", href: "/printable-guides" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "Educator Resources", href: "/educators" },
      { text: "Training Academy", href: "/training" },
    ],
  },
  "/quick-assessment": {
    bodyContent: `<p>How safe are you online right now? Most people overestimate their security until something goes wrong. Our Quick Assessment takes about 5 minutes and evaluates your current security practices across the areas that matter most: passwords, account protection, device security, privacy settings, and awareness of common threats.</p>
    <h2>What the Assessment Covers</h2>
    <ul><li><strong>Password practices</strong> - Are you using unique passwords? How strong are they? Do you use a password manager?</li><li><strong>Account protection</strong> - Is two-factor authentication enabled on your critical accounts like email, banking, and social media?</li><li><strong>Device security</strong> - Are your operating systems and apps up to date? Do you have screen lock enabled?</li><li><strong>Privacy awareness</strong> - Do you know what personal information is publicly available about you online?</li><li><strong>Threat recognition</strong> - Can you identify common scam tactics like phishing, social engineering, and fake websites?</li></ul>
    <h2>What You Get</h2>
    <p>After completing the assessment, you receive a personalized safety score with a breakdown by category. More importantly, you get specific, prioritized recommendations for what to improve first. We focus on the changes that will have the biggest impact on your security with the least effort, so you can start getting safer immediately.</p>`,
    relatedLinks: [
      { text: "Safety Score", href: "/safety-score" },
      { text: "Cyber Hygiene Guide", href: "/cyber-hygiene" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "Password Generator", href: "/password-generator" },
    ],
  },
  "/safety-score": {
    bodyContent: `<p>Your cyber safety score gives you a concrete measurement of how well your current digital habits protect you from online threats. Instead of wondering if you are doing enough, you get a clear number and specific guidance on what to improve. Think of it like a credit score, but for your online security.</p>
    <h2>How the Score Works</h2>
    <p>The safety score evaluates your practices across five key areas: password hygiene, two-factor authentication usage, software and device updates, privacy settings, and threat awareness. Each area is weighted based on its impact on your overall security. For example, using unique passwords for every account has a higher weight than having the latest operating system update, because password reuse is involved in more breaches.</p>
    <h2>Improving Your Score</h2>
    <p>Every point on your score comes with an actionable recommendation. Start with the highest-impact items: enabling two-factor authentication on your email and banking accounts, switching to unique passwords with a password manager, and removing your personal information from data broker sites. Most people can significantly improve their score in a single afternoon by following our prioritized recommendations.</p>
    <h2>Tracking Progress Over Time</h2>
    <p>Retake the assessment periodically to see how your security posture improves. As new threats emerge and best practices evolve, we update the scoring criteria so your score always reflects current risks and recommendations.</p>`,
    relatedLinks: [
      { text: "Quick Assessment", href: "/quick-assessment" },
      { text: "Password Generator", href: "/password-generator" },
      { text: "Data Broker Removal", href: "/data-removal" },
      { text: "Cyber Hygiene", href: "/cyber-hygiene" },
    ],
  },
  "/ai-safety": {
    bodyContent: `<p>Artificial intelligence has changed the scam landscape forever. Criminals now use AI to create perfectly written phishing emails, clone voices from a few seconds of audio, generate realistic fake videos, and build convincing impersonation profiles. Understanding these AI-powered threats is essential for protecting yourself and your family.</p>
    <h2>The Biggest AI-Powered Threats Right Now</h2>
    <ul><li><strong>Voice cloning</strong> - Scammers can replicate anyone's voice from just 3 seconds of audio, then use it to call family members pretending to be in an emergency. Establish a family code word to verify unexpected calls.</li><li><strong>Deepfake video</strong> - AI-generated video calls can make it look like your boss, a friend, or a government official is speaking with you. Look for subtle visual glitches and verify requests through a separate channel.</li><li><strong>AI-written phishing</strong> - AI tools can generate perfect phishing emails with no spelling errors, proper grammar, and personalized details. The old advice to look for typos no longer works. Focus on the request being made and verify through official channels.</li><li><strong>Synthetic identity fraud</strong> - AI can combine real and fake data to create entirely new identities used for fraud. Regularly monitor your credit reports and freeze credit when not actively applying for credit.</li></ul>
    <h2>Practical Protection Steps</h2>
    <p>Establish a verbal code word with family members for verifying emergency calls. Never act on urgent financial requests without independent verification through a known phone number. Be skeptical of unexpected video calls, especially ones requesting money or sensitive information. Use our <a href="/scam-checker">GCR Scam Guard</a> to check suspicious messages and links.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "AI Prompt Library", href: "/ai-prompts" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
      { text: "Emergency Help", href: "/emergency-help" },
    ],
  },
  "/checklists": {
    bodyContent: `<p>Good cybersecurity does not require expert knowledge. It requires consistent habits. Our printable checklists break down online safety into clear, actionable steps that anyone can follow. Print them out, tape them next to your computer, and work through them at your own pace. Each checklist is designed to be completed in 30 minutes or less.</p>
    <h2>Available Checklists</h2>
    <ul><li><strong>Personal Security Checklist</strong> - Cover your basics: passwords, two-factor authentication, software updates, privacy settings, and safe browsing habits</li><li><strong>Family Safety Checklist</strong> - Secure your household: device settings for each family member, parental controls, shared account security, and emergency procedures</li><li><strong>Senior Safety Checklist</strong> - Extra protection steps: phone scam defenses, banking account monitoring, social media privacy, and trusted contact setup</li><li><strong>Small Business Checklist</strong> - Protect your business: employee access controls, data backup verification, email security, and incident response planning</li><li><strong>Travel Safety Checklist</strong> - Before you leave: VPN setup, device preparation, banking notifications, and public Wi-Fi safety steps</li></ul>
    <h2>How to Use Our Checklists</h2>
    <p>Start with the Personal Security Checklist to cover your own basics, then move to the checklist that matches your situation. Each item includes a brief explanation of why it matters and a link to more detailed guidance if you need it. Check off items as you complete them, and revisit quarterly to make sure nothing has lapsed.</p>`,
    relatedLinks: [
      { text: "Printable Guides", href: "/printable-guides" },
      { text: "Cyber Hygiene", href: "/cyber-hygiene" },
      { text: "Quick Assessment", href: "/quick-assessment" },
      { text: "Training Academy", href: "/training" },
    ],
  },
  "/cyber-hygiene": {
    bodyContent: `<p>Just like brushing your teeth prevents cavities, good cyber hygiene prevents most online security problems. The most effective defenses against hacking, identity theft, and scams are simple daily habits that take very little time once they become routine. Here are the essential practices that security experts recommend for everyone.</p>
    <h2>Daily Habits</h2>
    <ul><li><strong>Think before you click</strong> - Pause before clicking links in emails, texts, or social media. If a message creates urgency or asks for personal information, verify it through a separate channel.</li><li><strong>Lock your devices</strong> - Use a strong passcode, fingerprint, or face recognition on all devices. Never leave devices unlocked and unattended.</li><li><strong>Check for updates</strong> - Enable automatic updates for your operating system and apps. Updates fix security vulnerabilities that attackers exploit.</li></ul>
    <h2>Weekly Habits</h2>
    <ul><li><strong>Review account activity</strong> - Check your bank statements, credit card transactions, and email account activity for anything unusual</li><li><strong>Back up important data</strong> - Keep copies of critical documents and photos in a separate location, whether cloud storage or an external drive</li><li><strong>Review app permissions</strong> - Check which apps have access to your camera, microphone, contacts, and location, and revoke access for apps that do not need it</li></ul>
    <h2>Monthly Habits</h2>
    <ul><li><strong>Check for data breaches</strong> - Use our <a href="/breach-dashboard">Breach Monitor</a> to see if any of your accounts have been compromised in recent breaches</li><li><strong>Update passwords for critical accounts</strong> - Rotate passwords for email, banking, and other high-value accounts if they are not already managed by a password manager</li><li><strong>Review privacy settings</strong> - Check your social media and app privacy settings, as platforms frequently change their defaults</li></ul>`,
    relatedLinks: [
      { text: "Security Checklists", href: "/checklists" },
      { text: "Password Generator", href: "/password-generator" },
      { text: "Breach Monitor", href: "/breach-dashboard" },
      { text: "Quick Assessment", href: "/quick-assessment" },
    ],
  },
  "/privacy": {
    bodyContent: `<p>At GetCyberRight, we practice what we preach. As a cybersecurity education platform, we hold ourselves to the highest standards of data privacy and transparency. This policy explains exactly what information we collect, how we use it, and what rights you have over your data.</p>
    <h2>Our Privacy Principles</h2>
    <ul><li><strong>Minimal collection</strong> - We only collect information that is necessary to provide our services. If we do not need it, we do not collect it.</li><li><strong>No data selling</strong> - We never sell, rent, or trade your personal information to third parties. Period.</li><li><strong>Transparency</strong> - We explain our data practices in plain language, not dense legal text that nobody reads.</li><li><strong>User control</strong> - You can request access to, correction of, or deletion of your personal data at any time by emailing tips@getcyberright.com.</li></ul>
    <h2>What We Collect and Why</h2>
    <p>When you use our tools like the GCR Scam Guard, submissions are processed in real time for analysis and are not permanently linked to your identity. If you create an account, we store your email address and display name for authentication purposes. We use anonymous, aggregated analytics to understand how our tools are used and improve them. We do not use tracking cookies for advertising.</p>`,
    relatedLinks: [
      { text: "Security Practices", href: "/security" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Contact Us", href: "/contact" },
      { text: "Data Broker Removal", href: "/data-removal" },
    ],
  },
  "/terms": {
    bodyContent: `<p>These terms of service govern your use of the GetCyberRight platform, including our cybersecurity tools, educational content, and community features. We have written them in plain language so you can actually understand what you are agreeing to.</p>
    <h2>Using Our Platform</h2>
    <p>GetCyberRight provides cybersecurity education and tools designed for informational purposes. Our tools like the GCR Scam Guard, Password Generator, and Breach Monitor are intended to help you make more informed decisions about your online safety. While we strive for accuracy, no security tool can guarantee complete protection. Always exercise your own judgment and consult professional advisors for critical security decisions.</p>
    <h2>Your Responsibilities</h2>
    <ul><li>Use our tools and content for lawful purposes only</li><li>Do not attempt to abuse, overload, or interfere with our services</li><li>Do not use our platform to conduct malicious activities or target others</li><li>If you create an account, keep your login credentials secure</li></ul>
    <h2>Intellectual Property</h2>
    <p>Our educational content, guides, and training materials are available for personal and educational use. Educators and community organizations may share and reference our materials with proper attribution. Commercial use or redistribution requires our written permission.</p>`,
    relatedLinks: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Security Practices", href: "/security" },
      { text: "Accessibility", href: "/accessibility" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
  "/report-scam": {
    bodyContent: `<p>Every scam report helps protect someone else. When you report a scam to GetCyberRight, you contribute to our threat intelligence database, help us issue faster warnings, and improve the accuracy of our AI-powered detection tools. Your report could prevent the next person from falling victim to the same scheme.</p>
    <h2>What to Include in Your Report</h2>
    <p>The more detail you provide, the more useful your report becomes. Include the type of scam (phishing email, phone call, text message, social media, etc.), exactly what the scammer said or asked for, any phone numbers, email addresses, or website URLs involved, when and how you were contacted, and whether you lost money or shared personal information. Screenshots are extremely helpful if you have them.</p>
    <h2>How Your Report Helps</h2>
    <ul><li><strong>Pattern identification</strong> - When multiple people report similar scams, we can identify coordinated campaigns and issue alerts faster</li><li><strong>Tool improvement</strong> - Report data helps train our GCR Scam Guard to detect new variations of known scams</li><li><strong>Community warnings</strong> - Reports feed into our Scam Intelligence Center where others can learn about active threats in their area</li><li><strong>Law enforcement support</strong> - Aggregated scam reports can support law enforcement investigations into organized fraud operations</li></ul>
    <h2>Where Else to Report</h2>
    <p>In addition to reporting here, file a report with the <a href="https://reportfraud.ftc.gov" rel="nofollow noopener">FTC</a> (United States), <a href="https://www.actionfraud.police.uk" rel="nofollow noopener">Action Fraud</a> (UK), or your local law enforcement agency.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
      { text: "Emergency Help", href: "/emergency-help" },
      { text: "Threat Alerts", href: "/alerts" },
    ],
  },
  "/travel-safety": {
    bodyContent: `<p>Traveling introduces unique cybersecurity risks that most people never think about. Public Wi-Fi networks in airports, hotels, and cafes are hunting grounds for attackers. Unfamiliar payment terminals may have skimmers installed. And your social media posts announcing you are away from home can alert burglars. A few simple precautions can keep your digital life safe while you are on the road.</p>
    <h2>Before You Travel</h2>
    <ul><li>Back up all devices to cloud storage or an external drive</li><li>Enable device tracking (Find My iPhone, Find My Device) on all devices</li><li>Set up a VPN on your phone and laptop for encrypting connections on public networks</li><li>Notify your bank about your travel dates and destinations to avoid fraud alerts on legitimate purchases</li><li>Remove sensitive data you will not need from your travel devices</li></ul>
    <h2>During Your Trip</h2>
    <ul><li><strong>Wi-Fi safety</strong> - Use your VPN whenever connecting to hotel, airport, or cafe Wi-Fi. Avoid accessing banking or sensitive accounts on public networks.</li><li><strong>Device security</strong> - Keep devices locked and with you at all times. Use your own charger and wall outlet instead of public USB charging stations, which can be compromised.</li><li><strong>Payment safety</strong> - Use contactless payment when possible. Check ATMs for skimming devices before inserting your card. Cover the keypad when entering your PIN.</li><li><strong>Social media caution</strong> - Avoid posting real-time location updates. Share travel photos after you return home.</li></ul>`,
    relatedLinks: [
      { text: "Security Checklists", href: "/checklists" },
      { text: "Cyber Hygiene", href: "/cyber-hygiene" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Password Generator", href: "/password-generator" },
    ],
  },
  "/printable-guides": {
    bodyContent: `<p>Sometimes the best cybersecurity tool is a piece of paper taped next to your computer. Our printable guides are designed to be downloaded, printed, and kept handy for quick reference. They distill complex security topics into clear, visual checklists and tip sheets that anyone can follow, regardless of technical background.</p>
    <h2>Available Printable Resources</h2>
    <ul><li><strong>Password Best Practices Card</strong> - A wallet-sized reference card with rules for creating strong passwords and tips for using a password manager</li><li><strong>Scam Red Flags Reference Sheet</strong> - Visual guide showing the warning signs of phishing emails, fake websites, phone scams, and social media scams</li><li><strong>Family Safety Checklist</strong> - A comprehensive household security checklist covering devices, accounts, parental controls, and emergency procedures</li><li><strong>Senior Safety Quick Guide</strong> - Large-print guide covering the most common scams targeting seniors and what to do if contacted</li><li><strong>Device Security Setup Guide</strong> - Step-by-step instructions for securing phones, tablets, and computers</li><li><strong>Social Media Privacy Checklist</strong> - Settings to review and change on Facebook, Instagram, TikTok, and other platforms</li></ul>
    <h2>Sharing These Guides</h2>
    <p>All printable guides are free to download, print, and distribute. Teachers, librarians, community center staff, and IT departments are encouraged to print copies for their communities. The guides are designed with clear formatting and large text to be readable for all ages.</p>`,
    relatedLinks: [
      { text: "Security Checklists", href: "/checklists" },
      { text: "Awareness Hub", href: "/awareness-hub" },
      { text: "Educator Resources", href: "/educators" },
      { text: "Senior Safety Center", href: "/seniors" },
    ],
  },
  "/support-the-mission": {
    bodyContent: `<p>GetCyberRight exists because we believe every family deserves access to the same online safety tools and knowledge that large corporations have, regardless of income or technical expertise. Our mission is to make digital safety accessible to everyone, and you can help us get there.</p>
    <h2>How You Can Help</h2>
    <ul><li><strong>Share our tools</strong> - The simplest and most impactful way to support us is to share GetCyberRight with someone who needs it. Tell a family member about the GCR Scam Guard. Share a safety guide with a senior relative. Forward a scam alert to a friend.</li><li><strong>Report scams</strong> - When you encounter a scam, report it through our <a href="/report-scam">Report a Scam</a> page. Every report makes our detection systems smarter and helps protect more people.</li><li><strong>Provide feedback</strong> - Tell us what works, what does not, and what you wish we had. Your feedback directly shapes what we build next.</li><li><strong>Spread awareness</strong> - Follow us on social media, share our posts, and help normalize conversations about online safety in your community.</li></ul>
    <h2>Why This Matters</h2>
    <p>Online scam losses continue to climb year over year. Seniors are disproportionately targeted. Small businesses can be destroyed by a single ransomware attack. The knowledge to prevent most of these incidents exists, but it has been locked behind expensive enterprise tools and technical jargon. GetCyberRight is changing that, one family at a time.</p>`,
    relatedLinks: [
      { text: "Our Mission", href: "/our-mission" },
      { text: "About GetCyberRight", href: "/about" },
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
  "/our-mission": {
    bodyContent: `<p>GetCyberRight was born from firsthand experience. Our founder's family was targeted by phone scams, impersonation attempts, and data broker exploitation. The tools and knowledge to fight back existed, but they were scattered across dozens of sites, written in technical language, and often locked behind expensive subscriptions. We built the platform we wished had existed.</p>
    <h2>What We Believe</h2>
    <ul><li><strong>Safety is a right, not a privilege.</strong> Every family deserves access to cybersecurity tools and education, regardless of income or technical ability.</li><li><strong>Education beats fear.</strong> We do not use scare tactics to sell products. We provide clear, honest information that empowers people to make informed decisions.</li><li><strong>Simple beats sophisticated.</strong> The most effective security measures are the ones people actually use. We design tools and guides for real people, not IT professionals.</li><li><strong>Community makes us stronger.</strong> Every scam report, piece of feedback, and shared guide makes the platform better for everyone.</li></ul>
    <h2>Where We Are Headed</h2>
    <p>We are building toward a world where no family has to learn about online safety the hard way. That means expanding our tools to cover emerging threats like AI-powered scams, reaching underserved communities with translated resources, partnering with schools and libraries to bring cybersecurity education into classrooms, and continuously improving our detection capabilities.</p>`,
    relatedLinks: [
      { text: "About GetCyberRight", href: "/about" },
      { text: "Support the Mission", href: "/support-the-mission" },
      { text: "Partnership Opportunities", href: "/partner-deck" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
  "/pricing": {
    bodyContent: `<p>GetCyberRight is free to get started because we believe online safety should be accessible to everyone. You do not need a credit card, and there is no trial period that expires. Our core cybersecurity tools, safety guides, and training content are available at no cost.</p>
    <h2>What You Get for Free</h2>
    <ul><li><strong>GCR Scam Guard</strong> - Analyze suspicious URLs, emails, text messages, and QR codes against multiple trusted safety databases</li><li><strong>Password Generator</strong> - Create strong, unique passwords that run entirely in your browser with no data sent to our servers</li><li><strong>Data Broker Removal</strong> - Search 501+ data broker sites and get guided removal instructions</li><li><strong>Breach Monitor</strong> - Check if your email has been exposed in known data breaches</li><li><strong>125+ Safety Guides</strong> - Step-by-step guides written in plain language covering every common online threat</li><li><strong>Training Academy</strong> - Structured learning paths for individuals, families, seniors, and small businesses</li><li><strong>406+ AI Prompts</strong> - Curated cybersecurity prompts for ChatGPT, Claude, and other AI assistants</li><li><strong>Scam Alerts</strong> - Real-time notifications about active scam campaigns in your region</li></ul>
    <h2>Our Commitment</h2>
    <p>We are committed to keeping core cybersecurity education and tools free to get started. Everyone deserves to know how to protect themselves online, and cost should never be a barrier to basic digital safety.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Security Tools", href: "/tools" },
      { text: "Training Academy", href: "/training" },
      { text: "About GetCyberRight", href: "/about" },
    ],
  },
  "/feedback": {
    bodyContent: `<p>GetCyberRight is built for real people, and real people's feedback is how we make it better. Whether you found a bug, have a suggestion for a new feature, want to tell us what you love, or want to share how a tool helped you avoid a scam, we want to hear from you.</p>
    <h2>What We Do With Your Feedback</h2>
    <p>Every piece of feedback is reviewed by our team. We use it to prioritize new features, fix problems, improve existing tools, and create content that better serves your needs. Many of our most popular features, including the QR code scanner in the GCR Scam Guard and the printable safety checklists, were built because users asked for them.</p>
    <h2>Types of Feedback We Welcome</h2>
    <ul><li><strong>Bug reports</strong> - Something not working as expected? Let us know the page, what you tried, and what happened.</li><li><strong>Feature requests</strong> - What tool or resource do you wish we had? How would it help you stay safer online?</li><li><strong>Content suggestions</strong> - Is there a topic we have not covered? A scam type you want us to write about?</li><li><strong>Success stories</strong> - Did a GetCyberRight tool help you or someone you know avoid a scam? We would love to hear about it.</li><li><strong>Accessibility feedback</strong> - Having trouble using our site? Let us know so we can make it better for everyone.</li></ul>`,
    relatedLinks: [
      { text: "Contact Us", href: "/contact" },
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Support the Mission", href: "/support-the-mission" },
      { text: "FAQ", href: "/faq" },
    ],
  },
  "/parent-guide": {
    bodyContent: `<p>Keeping your children safe online does not require becoming a technology expert. It requires open communication, reasonable boundaries, and knowing what to look for. This guide covers everything from setting up parental controls on devices to having age-appropriate conversations about online dangers.</p>
    <h2>The Conversation Framework</h2>
    <p>The most effective protection is not software. It is a relationship where your child feels safe telling you when something uncomfortable happens online. Start conversations early, keep them casual and ongoing, and avoid lecturing. Ask what they are seeing online rather than telling them what not to do. Use news stories and real examples as conversation starters.</p>
    <h2>Device Safety by Age</h2>
    <ul><li><strong>Ages 4 to 7</strong> - Use devices together. Enable strict parental controls. Limit screen time. Teach basic rules: never share your name, school, or where you live.</li><li><strong>Ages 8 to 12</strong> - Set up content filters and safe search. Review app downloads together. Teach them that not everyone online is who they say they are. Discuss what to do if they see something that makes them uncomfortable.</li><li><strong>Ages 13 and up</strong> - Shift from restriction to education. Discuss social media privacy settings, the permanence of online posts, and how to recognize manipulation. Give them ownership of their safety while maintaining open communication.</li></ul>
    <h2>Setting Up Parental Controls</h2>
    <p>Every major platform offers parental controls: Apple Screen Time, Google Family Link, Windows Family Safety, and third-party tools like Bark and Qustodio. Our guides walk you through setup on each platform. But remember, parental controls are a safety net, not a replacement for ongoing conversations about online safety.</p>`,
    relatedLinks: [
      { text: "Parents Hub", href: "/parents" },
      { text: "Kids Safety Hub", href: "/kids" },
      { text: "Child Safety Scanner", href: "/parents/child-safety-scanner" },
      { text: "Security Checklists", href: "/checklists" },
    ],
  },
  "/search": {
    bodyContent: `<p>Looking for specific cybersecurity guidance? Use our search to find exactly what you need across our entire library of safety guides, scam alerts, training courses, tools, and resources. Whether you are dealing with a specific scam type, looking for device setup instructions, or researching a cybersecurity topic, search will help you find it quickly.</p>
    <h2>Popular Search Topics</h2>
    <ul><li><a href="/guides/how-to-tell-if-text-message-is-scam">How to spot scam text messages</a></li><li><a href="/guides/is-this-email-real-how-to-check">How to check if an email is real</a></li><li><a href="/guides/signs-someone-using-ai-to-scam-you">AI scam warning signs</a></li><li><a href="/guides/facebook-marketplace-scams-buy-sell-safely">Facebook Marketplace safety</a></li><li><a href="/password-generator">Password generator</a></li><li><a href="/breach-dashboard">Check for data breaches</a></li><li><a href="/data-removal">Remove personal data from the internet</a></li><li><a href="/emergency-help">What to do if you have been scammed</a></li></ul>
    <h2>Browse by Category</h2>
    <ul><li><a href="/guides">Safety Guides</a> - 125+ guides on every common online threat</li><li><a href="/scam-intel">Scam Intelligence</a> - Detailed profiles of active scam campaigns</li><li><a href="/alerts">Threat Alerts</a> - Real-time security advisories</li><li><a href="/training">Training Courses</a> - Structured learning for all skill levels</li><li><a href="/tools">Security Tools</a> - Free cybersecurity tools for everyone</li></ul>`,
    relatedLinks: [
      { text: "Safety Guides", href: "/guides" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Training Academy", href: "/training" },
      { text: "Scam Intelligence", href: "/scam-intel" },
    ],
  },
  "/accessibility": {
    bodyContent: `<p>Digital safety should be accessible to everyone, including people with disabilities. GetCyberRight is committed to making our platform usable by all people, regardless of ability. We strive to follow Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards across our entire platform.</p>
    <h2>Our Accessibility Efforts</h2>
    <ul><li><strong>Screen reader compatibility</strong> - Our pages are structured with semantic HTML and ARIA labels to work with screen readers like JAWS, NVDA, and VoiceOver</li><li><strong>Keyboard navigation</strong> - All interactive elements are accessible via keyboard. You can navigate, activate buttons, fill forms, and use tools without a mouse.</li><li><strong>Color contrast</strong> - We maintain sufficient color contrast ratios for text readability. Our design does not rely on color alone to convey information.</li><li><strong>Text alternatives</strong> - Images and icons include descriptive alt text. Videos include captions where available.</li><li><strong>Responsive design</strong> - Our platform adapts to different screen sizes and works with browser zoom up to 200%.</li></ul>
    <h2>Reporting Accessibility Issues</h2>
    <p>We are always working to improve accessibility. If you encounter a barrier, please contact us at tips@getcyberright.com with a description of the issue and the page where you found it. We take every report seriously and work to resolve issues promptly.</p>`,
    relatedLinks: [
      { text: "Contact Us", href: "/contact" },
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Feedback", href: "/feedback" },
    ],
  },
  "/advertise": {
    bodyContent: `<p>GetCyberRight reaches a highly engaged audience of families, parents, seniors, educators, and small business owners who are actively seeking ways to protect themselves and their loved ones online. Our audience trusts us because we prioritize their safety, and we extend that same standard to any advertising or sponsorship on our platform.</p>
    <h2>Our Audience</h2>
    <p>Our visitors are safety-conscious decision-makers. They are parents researching parental controls, seniors learning to spot scams, educators integrating digital citizenship into curricula, and small business owners looking for affordable security solutions. They are looking for trustworthy products and services that help them stay safe.</p>
    <h2>Advertising Standards</h2>
    <ul><li>All advertising is clearly labeled and separated from editorial content</li><li>We only accept advertisers whose products or services align with our mission of protecting families online</li><li>We do not accept advertising for products that exploit user fears, collect excessive data, or make misleading security claims</li><li>Sponsored content must meet the same quality and accuracy standards as our own content</li></ul>
    <h2>Available Formats</h2>
    <ul><li><strong>Content sponsorship</strong> - Sponsor a guide, training module, or resource section</li><li><strong>Newsletter sponsorship</strong> - Featured placement in our weekly security newsletter</li><li><strong>Tool sponsorship</strong> - Associate your brand with one of our free security tools</li></ul>
    <p>To discuss advertising opportunities, email tips@getcyberright.com with "Advertising" in the subject line.</p>`,
    relatedLinks: [
      { text: "Partnership Opportunities", href: "/partner-deck" },
      { text: "About GetCyberRight", href: "/about" },
      { text: "Contact Us", href: "/contact" },
      { text: "Our Mission", href: "/our-mission" },
    ],
  },
  "/partner-deck": {
    bodyContent: `<p>GetCyberRight partners with organizations that share our commitment to making the internet safer for families and communities. Whether you are a technology company, educational institution, non-profit, or government agency, there are meaningful ways to collaborate that advance digital safety for everyone.</p>
    <h2>Partnership Models</h2>
    <ul><li><strong>Content partnerships</strong> - Co-create educational content, safety guides, or training materials that leverage your expertise and our reach</li><li><strong>Technology integrations</strong> - Integrate your security tools or services with the GetCyberRight platform to provide users with a more comprehensive safety experience</li><li><strong>Community outreach</strong> - Partner on awareness campaigns, community workshops, or events that bring cybersecurity education to underserved populations</li><li><strong>Research collaborations</strong> - Work together on cybersecurity research, threat intelligence sharing, or academic studies on digital safety education</li><li><strong>Co-branded campaigns</strong> - Launch joint awareness campaigns during Cybersecurity Awareness Month or other key periods</li></ul>
    <h2>What Makes a Good Partnership</h2>
    <p>We look for partners whose values align with ours: transparency, accessibility, and genuine commitment to user safety. The best partnerships create value for our users, not just for the partners involved. If your organization is making the internet safer, we want to hear from you.</p>
    <p>Contact us at tips@getcyberright.com with "Partnership" in the subject line to start a conversation.</p>`,
    relatedLinks: [
      { text: "Advertise with Us", href: "/advertise" },
      { text: "About GetCyberRight", href: "/about" },
      { text: "Our Mission", href: "/our-mission" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
  "/experience": {
    bodyContent: `<p>The GetCyberRight Experience is a first-of-its-kind family event where digital safety meets real fun. Imagine a space where parents, kids, and grandparents can all learn how to protect themselves online through hands-on activities, live demonstrations, and conversations with vetted cybersecurity experts, in an environment designed for every age group.</p>
    <h2>What to Expect</h2>
    <ul><li><strong>Interactive stations</strong> - Try our tools live: scan suspicious messages with the GCR Scam Guard, generate strong passwords, check for data breaches, and see your digital footprint in real time</li><li><strong>Expert workshops</strong> - Short, practical sessions led by cybersecurity professionals covering topics from password management to recognizing AI-generated scams</li><li><strong>Kids zone</strong> - Age-appropriate activities that teach online safety through games, puzzles, and interactive challenges</li><li><strong>Senior sessions</strong> - Dedicated workshops on phone scam prevention, banking safety, and protecting personal information, with patient instructors and large-format materials</li><li><strong>Take-home safety kits</strong> - Every family leaves with printable guides, security checklists, and a personalized safety action plan</li></ul>
    <h2>Join the Waitlist</h2>
    <p>Sign up to be the first to know when dates, locations, and details are announced. Whether you want to attend as a family or participate as a vendor or sponsor, we would love to have you be part of this experience.</p>`,
    relatedLinks: [
      { text: "About GetCyberRight", href: "/about" },
      { text: "Our Mission", href: "/our-mission" },
      { text: "Contact Us", href: "/contact" },
      { text: "Partnership Opportunities", href: "/partner-deck" },
    ],
  },
  "/threat-trends": {
    bodyContent: `<p>Understanding which threats are growing, which are declining, and which demographics are being targeted helps you focus your safety efforts where they matter most. Our Threat Trends dashboard tracks cybersecurity attack patterns, scam campaign data, and breach statistics from trusted global sources to give you a data-driven view of the current threat landscape.</p>
    <h2>Current Threat Landscape Highlights</h2>
    <ul><li><strong>AI-powered phishing is surging</strong> - Phishing emails generated by AI tools are harder to detect than ever, with grammar-perfect messages personalized using data broker information</li><li><strong>Romance scams continue to grow</strong> - Romance scams remain one of the costliest scam categories, with AI-generated profiles making them harder to spot</li><li><strong>Cryptocurrency scams remain prevalent</strong> - Investment fraud, particularly involving cryptocurrency, consistently ranks among the highest-loss scam categories</li><li><strong>Senior targeting is intensifying</strong> - Adults over 60 continue to see rising scam losses year over year</li><li><strong>Business email compromise remains costly</strong> - BEC attacks cause billions in losses annually, affecting businesses of all sizes</li></ul>
    <h2>How to Use This Data</h2>
    <p>Check which scam types are trending in your region and age group. Share relevant trends with family members who may be at higher risk. Use the data to prioritize which safety measures to implement first, focusing on the threats that are most likely to affect you and your family.</p>`,
    relatedLinks: [
      { text: "Cyber Threat Radar", href: "/cyber-threat-radar" },
      { text: "Scam Intelligence Center", href: "/scam-intel" },
      { text: "Threat Alerts", href: "/alerts" },
      { text: "Report a Scam", href: "/report-scam" },
    ],
  },
  "/support": {
    bodyContent: `<p>Need help with a GetCyberRight tool or resource? Our support center is here to help you get the most out of our platform. Whether you are having trouble with the GCR Scam Guard, need help navigating our training courses, or want to report an issue, we have got you covered.</p>
    <h2>Common Questions</h2>
    <ul><li><strong>The GCR Scam Guard is not loading</strong> - Try refreshing the page or clearing your browser cache. The tool works best on modern browsers like Chrome, Firefox, Safari, or Edge.</li><li><strong>I cannot find a specific guide</strong> - Use our <a href="/search">search page</a> to find guides by topic. You can also browse by category on our <a href="/guides">Guides page</a>.</li><li><strong>How do I report a scam?</strong> - Visit our <a href="/report-scam">Report a Scam</a> page to submit details about suspicious communications.</li><li><strong>How do I delete my account?</strong> - Email tips@getcyberright.com and we will process your request promptly.</li></ul>
    <h2>Getting in Touch</h2>
    <p>For questions not covered here, email our support team at tips@getcyberright.com. We aim to respond within 24 to 48 hours. For urgent matters related to active scams, visit our <a href="/emergency-help">Emergency Help</a> page for immediate guidance.</p>`,
    relatedLinks: [
      { text: "FAQ", href: "/faq" },
      { text: "Contact Us", href: "/contact" },
      { text: "Emergency Help", href: "/emergency-help" },
      { text: "Feedback", href: "/feedback" },
    ],
  },
  "/security": {
    bodyContent: `<p>As a cybersecurity education platform, we hold ourselves to the highest security standards. We practice what we teach, implementing the same protection measures we recommend to our users. Here is how we protect your data and maintain the integrity of our platform.</p>
    <h2>How We Protect Your Data</h2>
    <ul><li><strong>Encryption in transit</strong> - All connections to GetCyberRight use TLS/HTTPS encryption. Your data is encrypted every time it travels between your device and our servers.</li><li><strong>Encryption at rest</strong> - Stored data is encrypted using industry-standard algorithms. Even in the unlikely event of unauthorized access, your data remains protected.</li><li><strong>Secure authentication</strong> - We support secure login with optional multi-factor authentication. Passwords are hashed using modern algorithms and never stored in plain text.</li><li><strong>Minimal data collection</strong> - We only collect what we need to provide our services. Scam check submissions are processed in real time and not permanently linked to user identities.</li></ul>
    <h2>Our Security Practices</h2>
    <ul><li>Regular security assessments and code reviews</li><li>Dependency monitoring for known vulnerabilities</li><li>Rate limiting and abuse prevention on all public-facing tools</li><li>Strict access controls for internal systems</li><li>Incident response procedures with defined escalation paths</li></ul>
    <h2>Responsible Disclosure</h2>
    <p>If you discover a security vulnerability on our platform, please report it to tips@getcyberright.com with "Security" in the subject line. We take all reports seriously and will respond promptly.</p>`,
    relatedLinks: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "Terms of Service", href: "/terms" },
      { text: "Contact Us", href: "/contact" },
      { text: "About GetCyberRight", href: "/about" },
    ],
  },
  "/parents/child-safety-scanner": {
    bodyContent: `<p>Every family's online safety situation is different. The Child Safety Scanner evaluates your specific setup and provides personalized recommendations based on your children's ages, the devices they use, and the apps and platforms they access. Instead of generic advice, you get a tailored safety plan for your family.</p>
    <h2>What the Scanner Evaluates</h2>
    <ul><li><strong>Device configuration</strong> - Are parental controls properly set up on each device your children use? Are content filters and safe search enabled?</li><li><strong>App and platform exposure</strong> - Which social media platforms and messaging apps do your children use? Are privacy settings configured appropriately for their age?</li><li><strong>Communication safety</strong> - Does your family have agreed-upon rules about sharing personal information online? Is there a system for your child to report uncomfortable encounters?</li><li><strong>Account security</strong> - Are your children's accounts protected with strong passwords and, where available, two-factor authentication?</li></ul>
    <h2>What You Get</h2>
    <p>After completing the scan, you receive a family safety score with a breakdown by area, plus a prioritized list of specific actions to take. Recommendations are tailored to your children's ages and the platforms they use. The scan is completely free, does not require an account, and your responses are not stored on our servers.</p>`,
    relatedLinks: [
      { text: "Parents Hub", href: "/parents" },
      { text: "Parent Guide", href: "/parent-guide" },
      { text: "Kids Safety Hub", href: "/kids" },
      { text: "Security Checklists", href: "/checklists" },
    ],
  },
  "/resources": {
    bodyContent: `<p>GetCyberRight brings together everything you need to protect yourself and your family online in one place. Instead of searching dozens of websites for scattered advice, you can find safety guides, interactive tools, training courses, scam alerts, and printable resources all designed for real people, not IT professionals.</p>
    <h2>Resource Categories</h2>
    <ul><li><a href="/guides"><strong>Safety Guides</strong></a> - 125+ step-by-step guides covering passwords, phishing, identity theft, social media safety, device security, and more</li><li><a href="/tools"><strong>Security Tools</strong></a> - Free tools including the GCR Scam Guard, Password Generator, Data Broker Removal, and Breach Monitor</li><li><a href="/training"><strong>Training Academy</strong></a> - Structured learning paths for individuals, families, seniors, educators, and small businesses</li><li><a href="/scam-intel"><strong>Scam Intelligence</strong></a> - Detailed profiles of active scam campaigns with regional targeting data and risk assessments</li><li><a href="/alerts"><strong>Threat Alerts</strong></a> - Real-time security advisories about emerging threats</li><li><a href="/checklists"><strong>Security Checklists</strong></a> - Printable, actionable checklists for personal, family, and business security</li><li><a href="/ai-prompts"><strong>AI Prompt Library</strong></a> - 406+ curated prompts for using AI tools safely and effectively for cybersecurity learning</li></ul>
    <h2>Resources by Audience</h2>
    <ul><li><a href="/kids">Kids (Ages 8-16)</a> - Age-appropriate lessons and activities</li><li><a href="/parents">Parents</a> - Parental controls, device setup, and conversation guides</li><li><a href="/seniors">Seniors</a> - Scam prevention, phone safety, and identity protection</li><li><a href="/educators">Educators</a> - Lesson plans, worksheets, and curriculum materials</li><li><a href="/small-business">Small Businesses</a> - Employee training, policy templates, and incident response guides</li></ul>`,
    relatedLinks: [
      { text: "Safety Guides", href: "/guides" },
      { text: "Security Tools", href: "/tools" },
      { text: "Training Academy", href: "/training" },
      { text: "Scam Intelligence", href: "/scam-intel" },
    ],
  },
  "/browser-extension": {
    bodyContent: `<p>The GCR Scam Guard Chrome Extension brings real-time scam protection directly into your browser. Instead of manually copying and pasting suspicious links into our website, the extension automatically checks links as you browse and alerts you before you visit known dangerous sites.</p>
    <h2>What the Extension Does</h2>
    <ul><li><strong>Real-time link scanning</strong> - Automatically checks URLs against multiple trusted safety databases as you browse, without slowing down your experience</li><li><strong>Warning alerts</strong> - Displays a clear warning before you land on a known phishing, malware, or scam website</li><li><strong>One-click scanning</strong> - Right-click any link to run a detailed safety analysis using the same multi-source technology as our web-based GCR Scam Guard</li><li><strong>Privacy-first design</strong> - The extension only checks URLs you visit and does not collect browsing history, personal data, or track your activity</li></ul>
    <h2>How It Protects You</h2>
    <p>The extension uses the same trusted safety sources as our web-based GCR Scam Guard, including Google Safe Browsing, VirusTotal, URLhaus, and other verified databases. When you navigate to a URL that matches a known threat, you see a warning before the page loads. This is especially valuable for links in emails and social media that bypass traditional spam filters.</p>
    <h2>Getting Started</h2>
    <p>Install the GCR Scam Guard extension from the Chrome Web Store. Once installed, it runs quietly in the background protecting you as you browse. The extension icon in your toolbar shows your protection status and lets you run manual scans anytime.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Extension Pricing", href: "/gcr-guard-pricing" },
      { text: "Security Tools", href: "/tools" },
      { text: "Emergency Help", href: "/emergency-help" },
    ],
  },
  "/gcr-guard-pricing": {
    bodyContent: `<p>The GCR Scam Guard browser extension provides real-time protection against phishing, malware, and scam websites as you browse. Choose the plan that fits your needs, from free basic protection to comprehensive family coverage.</p>
    <h2>Free vs Premium Protection</h2>
    <p>The free tier includes basic link scanning using Google Safe Browsing data. Premium tiers add multi-source verification using VirusTotal, URLhaus, and additional databases, plus features like real-time alerts, detailed threat reports, priority scanning, and family device coverage.</p>
    <h2>What Premium Includes</h2>
    <ul><li><strong>Multi-source scanning</strong> - Check links against 8+ trusted safety databases simultaneously for more comprehensive threat detection</li><li><strong>Real-time alerts</strong> - Instant notifications when new threats are detected that match sites you have visited</li><li><strong>Detailed reports</strong> - Full safety analysis reports for any URL you scan, including domain age, SSL status, and hosting information</li><li><strong>Priority scanning</strong> - Faster scan results during peak usage times</li><li><strong>Family coverage</strong> - Protect multiple devices and family members under one subscription</li></ul>
    <h2>Our Guarantee</h2>
    <p>All features are currently free during our early access period. We believe in earning your trust before asking for your support. Try everything, see the value, and decide when premium tiers become available.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard Extension", href: "/browser-extension" },
      { text: "GCR Scam Guard Web Tool", href: "/scam-checker" },
      { text: "Plans & Pricing", href: "/pricing" },
      { text: "Security Tools", href: "/tools" },
    ],
  },
  "/shield": {
    bodyContent: `<p>GCR Data Shield is your comprehensive digital privacy protection hub. It combines data broker removal, breach monitoring, and privacy assessment into one unified dashboard, giving you a clear picture of your digital exposure and the tools to reduce it.</p>
    <h2>What Data Shield Includes</h2>
    <ul><li><a href="/data-removal"><strong>Data Broker Removal</strong></a> - Search 501+ data broker and people-search sites for your personal information and get guided removal instructions for each one</li><li><a href="/breach-dashboard"><strong>Breach Monitor</strong></a> - Check if your email addresses have been exposed in known data breaches and get alerts about new breaches</li><li><strong>Privacy Score</strong> - Get a comprehensive assessment of your digital privacy posture with actionable recommendations for improvement</li><li><strong>Continuous Monitoring</strong> - Ongoing checks for new data broker listings and breach exposures so you stay protected over time</li></ul>
    <h2>Why Digital Privacy Matters</h2>
    <p>Your personal information, including your name, address, phone number, email, and even family members' names, is likely listed on dozens of data broker websites right now. This data is used by scammers to personalize phishing attacks, by stalkers to locate targets, and by companies to send unwanted marketing. Reducing your digital footprint is one of the most impactful steps you can take for your online safety.</p>
    <h2>Getting Started</h2>
    <p>Start with a free data broker scan to see how many sites have your information. Then use our guided removal process to submit opt-out requests. Set up breach monitoring for all your email addresses. Review your privacy score and work through the recommended improvements.</p>`,
    relatedLinks: [
      { text: "Data Broker Removal", href: "/data-removal" },
      { text: "Breach Monitor", href: "/breach-dashboard" },
      { text: "Password Generator", href: "/password-generator" },
      { text: "GCR Scam Guard", href: "/scam-checker" },
    ],
  },
  "/scam-checker": {
    bodyContent: `<p>GCR Scam Guard is a free AI-powered tool that analyzes suspicious URLs, emails, text messages, and QR codes to determine if they are scams. Simply paste any suspicious content and get an instant safety report checked against multiple trusted threat databases.</p>
    <h2>What You Can Analyze</h2>
    <p>Check suspicious website links before clicking them. Paste email content to detect phishing attempts. Analyze text messages that seem too good to be true. Scan QR codes to verify they lead to legitimate websites. Each analysis checks multiple security databases and uses AI to identify scam patterns.</p>
    <h2>How It Works</h2>
    <p>Our scanner cross-references your submission against known phishing databases, malware registries, and scam URL lists. It also uses AI pattern recognition to identify new threats that have not been cataloged yet. You get a detailed safety report with a risk score, specific threat indicators, and recommended actions.</p>`,
    relatedLinks: [
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Scam Intelligence", href: "/scam-intel" },
      { text: "Emergency Help", href: "/emergency-help" },
    ],
  },
  "/tools": {
    bodyContent: `<p>GetCyberRight offers a suite of free cybersecurity tools designed for everyday people, not IT professionals. Each tool addresses a specific security need and is built to be simple enough for anyone in your family to use.</p>
    <h2>Available Security Tools</h2>
    <p>GCR Scam Guard analyzes suspicious URLs, emails, and messages using AI. The Password Generator creates strong, unique passwords. Data Broker Removal helps you find and remove your personal information from data broker websites. Breach Dashboard monitors whether your email has appeared in known data breaches. The Cyber Threat Radar shows current active threats in real time.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Password Generator", href: "/password-generator" },
      { text: "Data Removal", href: "/data-removal" },
      { text: "Breach Dashboard", href: "/breach-dashboard" },
    ],
  },
  "/news": {
    bodyContent: `<p>Stay informed with the latest cybersecurity news, data breach reports, and security advisories. Every article is rewritten in plain language so families, seniors, and small businesses can understand the risks and take action.</p>
    <h2>How We Cover Cybersecurity News</h2>
    <p>We monitor trusted sources including government security agencies, established cybersecurity publications, and official company statements. Each story is evaluated for relevance to everyday people and rewritten to explain what happened, who is affected, what you should do right now, and how to stay protected long term.</p>`,
    relatedLinks: [
      { text: "Threat Trends", href: "/threat-trends" },
      { text: "Security Alerts", href: "/alerts" },
      { text: "Scam Intelligence", href: "/scam-intel" },
    ],
  },
  "/password-generator": {
    bodyContent: `<p>Create strong, unique passwords instantly with our free password generator. Weak and reused passwords are the number one cause of account compromises. This tool generates passwords that are virtually impossible to crack.</p>
    <h2>Why Strong Passwords Matter</h2>
    <p>Most people reuse the same password across multiple accounts. When one account is breached, attackers try those credentials everywhere else. A unique, strong password for each account prevents this cascade effect. Our generator creates passwords using a mix of uppercase letters, lowercase letters, numbers, and special characters.</p>`,
    relatedLinks: [
      { text: "Breach Dashboard", href: "/breach-dashboard" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "Cyber Hygiene Guide", href: "/cyber-hygiene" },
    ],
  },
  "/data-removal": {
    bodyContent: `<p>Data brokers collect and sell your personal information including your name, address, phone number, email, and family details to anyone willing to pay. Our Data Broker Removal tool helps you find which brokers have your data and guides you through removing it.</p>
    <h2>How Data Broker Removal Works</h2>
    <p>We search across hundreds of known data broker websites to find where your personal information appears. For each broker that has your data, we provide step-by-step removal instructions specific to that broker. Some brokers allow automated opt-out requests, while others require manual submissions.</p>`,
    relatedLinks: [
      { text: "Privacy Protection Guide", href: "/topics/privacy-protection" },
      { text: "Identity Theft Guide", href: "/topics/identity-theft" },
      { text: "Security Tools", href: "/tools" },
    ],
  },
  "/kids": {
    bodyContent: `<p>The internet is an essential part of growing up, but it comes with real risks that kids may not recognize. Our Kids Safety Hub provides age-appropriate resources, interactive lessons, and practical tools to help children navigate the online world safely.</p>
    <h2>What Kids Learn</h2>
    <p>Our resources teach children how to recognize online strangers who may not be who they claim, how to protect personal information, what to do if something online makes them uncomfortable, and how to be good digital citizens. Everything is presented in language and scenarios that kids can relate to.</p>`,
    relatedLinks: [
      { text: "Parent Resources", href: "/parents" },
      { text: "Child Safety Scanner", href: "/parents/child-safety-scanner" },
      { text: "Training Academy", href: "/training" },
    ],
  },
  "/seniors": {
    bodyContent: `<p>Seniors are disproportionately targeted by scammers because they often have savings, tend to be more trusting, and may be less familiar with digital technology. Our Senior Safety Hub provides straightforward guidance on the most common threats facing older adults online.</p>
    <h2>Common Threats Targeting Seniors</h2>
    <p>Tech support scams where callers claim your computer has a virus. Romance scams on dating sites and social media. Medicare and health insurance fraud. Grandparent scams where someone pretends to be a grandchild in trouble. Investment scams promising guaranteed returns. Each of these has specific warning signs and prevention steps that we cover in detail.</p>`,
    relatedLinks: [
      { text: "Tech Support Scam Guide", href: "/scams/tech-support-scam" },
      { text: "Romance Scam Guide", href: "/scams/romance-scam" },
      { text: "Medicare Scam Guide", href: "/scams/medicare-scam" },
      { text: "Emergency Help", href: "/emergency-help" },
    ],
  },
  "/parents": {
    bodyContent: `<p>Keeping your children safe online is one of the most important responsibilities parents face today. Our Parent Resources hub gives you practical tools and guidance for protecting your kids without micromanaging their digital lives.</p>
    <h2>Resources for Parents</h2>
    <p>Learn how to set up parental controls on devices and apps your children use. Understand which social media platforms your kids are on and what risks they present. Have age-appropriate conversations about online safety. Monitor for warning signs of cyberbullying, predatory contact, or exposure to harmful content.</p>`,
    relatedLinks: [
      { text: "Child Safety Scanner", href: "/parents/child-safety-scanner" },
      { text: "Kids Safety Hub", href: "/kids" },
      { text: "Parent Guide", href: "/parent-guide" },
      { text: "Social Media Security", href: "/topics/social-media-security" },
    ],
  },
  "/emergency-help": {
    bodyContent: `<p>If you have been hacked, scammed, or had your identity stolen, this page provides immediate steps you can take right now to limit the damage and start recovery. Time matters in these situations, so follow these steps as quickly as possible.</p>
    <h2>Immediate Actions</h2>
    <p>Change passwords on compromised accounts immediately. Contact your bank if financial information was exposed. Place a fraud alert with the credit bureaus. File a report with the FTC at IdentityTheft.gov. Document everything including screenshots, emails, and transaction records for your report.</p>`,
    relatedLinks: [
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Identity Theft Guide", href: "/topics/identity-theft" },
      { text: "Breach Dashboard", href: "/breach-dashboard" },
    ],
  },
  "/breach-dashboard": {
    bodyContent: `<p>Check if your email address has been exposed in any known data breaches. When companies get hacked, customer data including emails, passwords, and personal information often ends up for sale on the dark web. Our Breach Dashboard helps you find out if you are affected and what to do about it.</p>
    <h2>How to Use the Breach Dashboard</h2>
    <p>Enter your email address to search across known breach databases. If your email appears in any breaches, you will see which companies were breached, what data was exposed, and when it happened. We provide specific steps for each breach to help you secure your accounts.</p>`,
    relatedLinks: [
      { text: "Password Generator", href: "/password-generator" },
      { text: "Data Breaches Guide", href: "/topics/data-breaches" },
      { text: "Security Checklists", href: "/checklists" },
    ],
  },
  "/guides": {
    bodyContent: `<p>Our cybersecurity guides provide step-by-step instructions for protecting yourself and your family online. Each guide is written in plain language and focuses on practical actions you can take today.</p>
    <h2>Guide Categories</h2>
    <p>Guides cover topics including password management, device security, social media privacy, identity theft prevention, safe online shopping, protecting children online, senior safety, and small business cybersecurity. Each guide includes actionable checklists and recommended tools.</p>`,
    relatedLinks: [
      { text: "Security Checklists", href: "/checklists" },
      { text: "Training Academy", href: "/training" },
      { text: "Printable Guides", href: "/printable-guides" },
    ],
  },
  "/alerts": {
    bodyContent: `<p>Security alerts notify you about active threats, newly discovered vulnerabilities, and urgent actions you should take. We monitor government security agencies and trusted cybersecurity sources to bring you timely warnings that matter to everyday users.</p>
    <h2>How Alerts Work</h2>
    <p>Each alert includes what the threat is, who is affected, how serious it is, and exactly what you should do. Alerts are rated by urgency level so you can prioritize the most critical ones first.</p>`,
    relatedLinks: [
      { text: "Threat Trends", href: "/threat-trends" },
      { text: "Cybersecurity News", href: "/news" },
      { text: "Cyber Threat Radar", href: "/cyber-threat-radar" },
    ],
  },
  "/scam-intel": {
    bodyContent: `<p>Our Scam Intelligence Center provides detailed analysis of active scam campaigns targeting consumers. Each report breaks down how the scam works, who it targets, warning signs to watch for, and what to do if you have been targeted.</p>
    <h2>Active Scam Reports</h2>
    <p>We track and analyze scams including sextortion targeting teens, pig butchering crypto scams, deepfake video call fraud, QR code phishing, romance scams, AI voice cloning scams, Facebook marketplace fraud, and more. Each report is updated as new tactics emerge.</p>`,
    relatedLinks: [
      { text: "GCR Scam Guard", href: "/scam-checker" },
      { text: "Report a Scam", href: "/report-scam" },
      { text: "Emergency Help", href: "/emergency-help" },
    ],
  },
  "/about": {
    bodyContent: `<p>GetCyberRight is a cybersecurity education platform built for families, parents, kids, seniors, and small businesses. We believe everyone deserves access to expert-level security guidance in language they can understand, without the jargon and without the price tag.</p>
    <h2>Our Approach</h2>
    <p>We combine AI-powered security tools with human-written educational content to help everyday people protect themselves online. Our tools are free to use, our guides are written in plain language, and our mission is to make cybersecurity accessible to everyone regardless of technical background.</p>`,
    relatedLinks: [
      { text: "Our Mission", href: "/our-mission" },
      { text: "Security Tools", href: "/tools" },
      { text: "Contact Us", href: "/contact" },
    ],
  },
  "/small-business": {
    bodyContent: `<p>Small businesses are increasingly targeted by cybercriminals because they often lack the security resources of larger organizations. Our Small Business Hub provides practical, affordable security guidance tailored to businesses with limited IT budgets and staff.</p>
    <h2>Key Areas for Small Business Security</h2>
    <p>Employee security awareness training, email security and phishing prevention, data backup and recovery planning, customer data protection, incident response procedures, and compliance with data protection regulations. Each area includes step-by-step implementation guides designed for non-technical business owners.</p>`,
    relatedLinks: [
      { text: "Training Academy", href: "/training" },
      { text: "Security Checklists", href: "/checklists" },
      { text: "Breach Dashboard", href: "/breach-dashboard" },
    ],
  },
  "/educators": {
    bodyContent: `<p>Teach digital citizenship and cybersecurity in your classroom with our free educator resources. We provide lesson plans, student activities, and assessment tools designed for K-12 educators who want to integrate cybersecurity awareness into their curriculum.</p>
    <h2>Classroom Resources</h2>
    <p>Ready-to-use lesson plans covering online safety, password hygiene, social media awareness, and recognizing scams. Student activities that make cybersecurity concepts engaging and relatable. Assessment tools to measure student understanding. All materials align with common digital citizenship standards.</p>`,
    relatedLinks: [
      { text: "Kids Safety Hub", href: "/kids" },
      { text: "Training Academy", href: "/training" },
      { text: "Printable Guides", href: "/printable-guides" },
    ],
  },
};
