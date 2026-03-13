export interface ScamPageContent {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  cluster: string;
  overview: string;
  howItWorks: string[];
  warningSigns: string[];
  exampleMessages: { type: string; content: string }[];
  preventionSteps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
  relatedScams: string[];
  lastUpdated: string;
}

export const SCAM_PAGES: ScamPageContent[] = [
  {
    slug: "paypal-scam",
    title: "PayPal Scams: How to Spot and Avoid Them",
    metaTitle: "PayPal Scams: How to Identify, Avoid & Report Fraud | GetCyberRight",
    metaDescription: "Learn to identify PayPal scams including fake invoices, shipping fraud, and phishing emails. Step-by-step protection guide with real examples.",
    keywords: ["paypal scams", "paypal fraud", "fake paypal email", "paypal phishing", "paypal invoice scam"],
    cluster: "online-scams",
    overview: "PayPal scams are among the most common online fraud schemes, targeting the platform's 400+ million users worldwide. Scammers exploit PayPal's trusted reputation by sending fake invoices, phishing emails that mimic PayPal's branding, and fraudulent payment requests. These scams trick victims into sending money, sharing login credentials, or clicking malicious links that install malware. Understanding how these scams work is your best defense against losing money or having your account compromised.",
    howItWorks: [
      "Scammers send fake PayPal invoices for products or services you never purchased, hoping you will pay without checking.",
      "Phishing emails that look identical to real PayPal notifications ask you to 'verify your account' or 'confirm a transaction' by clicking a link that leads to a fake login page.",
      "Overpayment scams where a buyer 'accidentally' sends too much money and asks you to refund the difference before the original payment is reversed.",
      "Fake shipping notifications claim a package is on its way, prompting you to click a tracking link that downloads malware.",
      "Scammers posing as PayPal customer support call to report suspicious activity and ask for your login details to 'secure' your account."
    ],
    warningSigns: [
      "Emails from addresses that do not end in @paypal.com",
      "Urgent messages threatening account suspension unless you act immediately",
      "Invoices for products or services you did not order",
      "Requests to send money via Friends & Family for purchases",
      "Messages with spelling errors, generic greetings like 'Dear User', or mismatched URLs",
      "Requests to call a phone number not listed on PayPal's official website",
      "Payment notifications for amounts you were not expecting"
    ],
    exampleMessages: [
      { type: "Phishing Email", content: "Subject: Your PayPal account has been limited. Dear Customer, We have noticed unusual activity on your account. Please verify your identity by clicking the link below within 24 hours or your account will be permanently suspended. [Verify Now]" },
      { type: "Fake Invoice", content: "You have received an invoice for $499.99 from Norton Security LLC for Annual Subscription Renewal. If you did not authorize this transaction, call 1-800-XXX-XXXX immediately to cancel." },
      { type: "Overpayment Scam", content: "Hi, I accidentally sent you $1,500 instead of $150 for the item. Can you please refund me the $1,350 difference via Zelle or wire transfer? I really need the money back quickly." }
    ],
    preventionSteps: [
      { title: "Always log in directly", description: "Never click links in emails claiming to be from PayPal. Instead, open your browser and type paypal.com directly to check your account." },
      { title: "Check the sender's email address", description: "Legitimate PayPal emails come from @paypal.com. Look carefully for misspellings like @paypa1.com or @paypal-security.com." },
      { title: "Never send money outside PayPal for a PayPal transaction", description: "If someone asks you to refund money through Zelle, Venmo, wire transfer, or gift cards, it is a scam." },
      { title: "Enable two-factor authentication", description: "Add an extra layer of security to your PayPal account so scammers cannot access it even if they steal your password." },
      { title: "Report suspicious messages", description: "Forward suspicious emails to phishing@paypal.com and delete them. Report fake invoices directly within PayPal." },
      { title: "Use PayPal's Purchase Protection", description: "When buying items, always use Goods & Services payment type to ensure you are covered by PayPal's buyer protection." }
    ],
    faq: [
      { question: "How do I know if a PayPal email is real?", answer: "Real PayPal emails come from @paypal.com, address you by your full name, and never ask you to click a link to verify your account. Log into PayPal directly to check for any actual notifications." },
      { question: "What should I do if I fell for a PayPal scam?", answer: "Change your PayPal password immediately, enable two-factor authentication, report the transaction to PayPal's Resolution Center, contact your bank if a linked account was compromised, and file a report with the FTC at reportfraud.ftc.gov." },
      { question: "Can PayPal refund money lost to scams?", answer: "PayPal may refund transactions made through their platform if reported promptly through the Resolution Center. However, money sent via Friends & Family or transferred outside PayPal is typically not recoverable." },
      { question: "Are PayPal invoice scams common?", answer: "Yes, fake PayPal invoices are one of the most common PayPal scams. Scammers send invoices for products you never ordered, hoping you will call the listed phone number where they will try to steal your information." }
    ],
    relatedScams: ["zelle-scam", "shopping-scam", "phishing"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "amazon-scam",
    title: "Amazon Scams: Protect Yourself from Fake Orders and Fraud",
    metaTitle: "Amazon Scams: Spot Fake Orders, Phishing & Fraud | GetCyberRight",
    metaDescription: "Complete guide to Amazon scams including fake order confirmations, delivery scams, and impersonation calls. Learn how to protect your account and money.",
    keywords: ["amazon scams", "fake amazon email", "amazon phishing", "amazon delivery scam", "amazon refund scam"],
    cluster: "online-scams",
    overview: "Amazon scams exploit the trust consumers place in the world's largest online retailer. With billions of packages shipped annually, scammers use fake order confirmations, delivery notifications, and account alerts to trick people into revealing personal information or making payments. These scams target both buyers and sellers, using sophisticated techniques that closely mimic Amazon's official communications. Learning to recognize these schemes can save you from financial loss and identity theft.",
    howItWorks: [
      "Scammers send fake order confirmation emails for expensive items you never purchased, prompting you to click a 'Cancel Order' link that leads to a phishing site.",
      "Phone calls from people claiming to be Amazon support, warning about unauthorized purchases on your account and requesting remote access to your computer.",
      "Fake delivery notifications via text message with tracking links that install malware or lead to credential-stealing websites.",
      "Phony Amazon gift card offers that require you to enter personal information or pay a small fee to claim a reward.",
      "Counterfeit seller accounts that list items at impossibly low prices, collect payment, and never deliver the product."
    ],
    warningSigns: [
      "Order confirmations for items you did not purchase",
      "Phone calls from 'Amazon' asking for remote access to your computer",
      "Texts about package delivery problems with unfamiliar tracking links",
      "Requests to pay with gift cards, wire transfers, or cryptocurrency",
      "Emails urging you to update payment information through a provided link",
      "Deals that seem too good to be true with prices far below market value",
      "Messages from sellers asking you to complete transactions outside of Amazon"
    ],
    exampleMessages: [
      { type: "Fake Order Email", content: "Your Amazon order #112-7654321-9876543 for MacBook Pro ($1,299.99) has been confirmed. If you did not place this order, click here to cancel immediately to avoid being charged." },
      { type: "Delivery Scam Text", content: "Amazon: Your package could not be delivered due to an incomplete address. Update your information here to reschedule delivery: [suspicious link]" },
      { type: "Phone Scam Script", content: "This is Amazon Security calling. We have detected an unauthorized purchase of $799 on your account. To stop this charge, please stay on the line and follow our instructions to verify your identity." }
    ],
    preventionSteps: [
      { title: "Check orders on amazon.com directly", description: "Never click links in order confirmation emails. Log into your Amazon account directly to view your actual order history." },
      { title: "Amazon will never call asking for payment", description: "Amazon does not make outbound calls asking for payment or personal information. If you receive such a call, hang up immediately." },
      { title: "Use Amazon's in-app messaging", description: "Communicate with sellers only through Amazon's messaging system. Never respond to requests to contact sellers via personal email or phone." },
      { title: "Enable login notifications", description: "Turn on Amazon's login notifications so you are alerted whenever someone accesses your account from a new device." },
      { title: "Report suspicious contacts", description: "Forward suspicious emails to stop-spoofing@amazon.com and report phone scams through Amazon's customer service." },
      { title: "Verify seller ratings", description: "Before purchasing from third-party sellers, check their ratings, review count, and how long they have been selling on Amazon." }
    ],
    faq: [
      { question: "How do I report a scam on Amazon?", answer: "Forward suspicious emails to stop-spoofing@amazon.com. For phone scams, report them through Amazon's customer service or at reportfraud.ftc.gov. You can also report suspicious sellers directly through the product listing page." },
      { question: "Can scammers access my Amazon account?", answer: "If you clicked a phishing link and entered your credentials, change your Amazon password immediately, enable two-factor authentication, and review your order history for unauthorized purchases. Also check for any changes to your delivery addresses or payment methods." },
      { question: "Are Amazon gift card scams common?", answer: "Yes. Scammers frequently ask victims to buy Amazon gift cards and share the codes as payment for fake debts, taxes, or prizes. Amazon gift cards can only be used to purchase items on Amazon and should never be used as payment to individuals or organizations outside the platform." },
      { question: "How do I know if an Amazon email is real?", answer: "Real Amazon emails come from an @amazon.com domain and will reference your actual name and order details. You can verify any email by checking your Message Center at amazon.com/gp/message." }
    ],
    relatedScams: ["delivery-scam", "phishing", "shopping-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "facebook-scam",
    title: "Facebook and Marketplace Scams: Stay Safe Online",
    metaTitle: "Facebook Scams & Marketplace Fraud: Protection Guide | GetCyberRight",
    metaDescription: "Identify Facebook Marketplace scams, fake profiles, and social media fraud. Learn prevention strategies and how to report Facebook scams safely.",
    keywords: ["facebook scams", "facebook marketplace scams", "facebook phishing", "fake facebook profiles", "facebook fraud"],
    cluster: "online-scams",
    overview: "Facebook scams range from Marketplace fraud and fake profiles to phishing messages and investment schemes. With nearly 3 billion monthly active users, Facebook is a prime target for scammers who create convincing fake accounts, post fraudulent listings, and send deceptive messages designed to steal money and personal information. Marketplace scams alone cost consumers millions each year through fake product listings, overpayment tricks, and shipping fraud.",
    howItWorks: [
      "Fake Marketplace listings offer popular items at deeply discounted prices, collecting payment through off-platform methods and never delivering the product.",
      "Romance scammers create attractive fake profiles and build emotional connections over weeks or months before asking for money.",
      "Phishing messages from compromised friend accounts ask you to click links, vote in fake contests, or watch 'Is this you?' videos that steal your login credentials.",
      "Fake giveaway and contest pages impersonate legitimate brands, collecting personal information from participants.",
      "Investment scam groups promote fake cryptocurrency or trading opportunities with manufactured success stories."
    ],
    warningSigns: [
      "Marketplace listings with prices significantly below market value",
      "Sellers who refuse to meet in person or only accept off-platform payments",
      "Friend requests from people you are already friends with (cloned profiles)",
      "Messages with suspicious links even from known contacts",
      "Pages promoting guaranteed investment returns",
      "Profiles with very few photos, no mutual friends, and recently created accounts",
      "Urgent messages about account security asking you to click a link"
    ],
    exampleMessages: [
      { type: "Marketplace Scam", content: "I'm selling this PS5 for $150 because I'm moving and need to get rid of it fast. I can ship it to you if you send payment through Zelle or CashApp. I'll mail it as soon as I get the payment!" },
      { type: "Phishing Message", content: "OMG [your name] is this you in this video?? I can't believe someone posted this!! 😱 [link]" },
      { type: "Romance Scam", content: "I know we've only been talking for a few weeks but I feel such a connection with you. I'm stuck overseas and need help with a plane ticket to come see you. Can you wire me $500?" }
    ],
    preventionSteps: [
      { title: "Use Facebook's built-in payment system", description: "For Marketplace transactions, use Facebook Pay or cash for local pickups. Never send money through wire transfers, gift cards, or peer-to-peer apps for online purchases." },
      { title: "Meet in safe public locations", description: "For local Marketplace transactions, meet at a police station, bank lobby, or other well-lit public place. Never invite strangers to your home." },
      { title: "Verify profiles before engaging", description: "Check the age of the account, number of friends, and post history. Scam profiles are often newly created with few photos and connections." },
      { title: "Do not click suspicious links", description: "Even if a message appears to come from a friend, do not click links without verifying through another communication channel that they actually sent it." },
      { title: "Enable two-factor authentication", description: "Protect your Facebook account with two-factor authentication so scammers cannot take it over even if they obtain your password." },
      { title: "Report suspicious activity", description: "Use Facebook's built-in reporting tools to flag fake profiles, fraudulent listings, and scam messages. This helps protect other users." }
    ],
    faq: [
      { question: "How do I report a Facebook Marketplace scam?", answer: "Click the three dots on the listing and select 'Report listing.' You can also report through facebook.com/help. If you lost money, file a report with the FTC at reportfraud.ftc.gov and your local police." },
      { question: "Can I get my money back from a Facebook scam?", answer: "If you paid through Facebook Pay, you may be eligible for a refund through Facebook's Purchase Protection. If you paid through external methods like wire transfer or gift cards, recovery is very difficult. Contact your bank immediately to report the fraud." },
      { question: "How do I know if a Facebook profile is fake?", answer: "Look for recently created accounts, very few photos (often stock or stolen images), minimal post history, few friends, and no mutual connections. You can reverse-image-search profile photos to check if they appear elsewhere online." },
      { question: "Are Facebook Marketplace purchases safe?", answer: "Facebook Marketplace can be safe if you follow precautions: use Facebook Pay for shipping purchases, meet in public for local sales, verify seller profiles, and never pay with gift cards or wire transfers." }
    ],
    relatedScams: ["instagram-scam", "romance-scam", "social-media-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "romance-scam",
    title: "Romance Scams: How Scammers Exploit Love and Trust",
    metaTitle: "Romance Scams: Warning Signs, Prevention & Recovery | GetCyberRight",
    metaDescription: "Learn how romance scammers operate, the warning signs to watch for, and how to protect yourself and loved ones from relationship fraud.",
    keywords: ["romance scams", "online dating scams", "catfishing", "romance fraud", "love scam warning signs"],
    cluster: "online-scams",
    overview: "Romance scams cost victims more money per incident than almost any other type of fraud, with reported losses exceeding $1.3 billion annually in the United States alone. Scammers create fake profiles on dating apps and social media platforms, building deep emotional connections over weeks or months before requesting money. Victims span all ages but seniors are disproportionately targeted. These scams cause devastating financial and emotional harm, and many victims are too embarrassed to report them.",
    howItWorks: [
      "Scammers create attractive profiles using stolen photos and fabricated backstories, often posing as military personnel, doctors, or overseas business professionals.",
      "They build trust through daily messages, phone calls, and sometimes video chats using deepfake technology, creating a sense of intimacy over weeks or months.",
      "Once emotional attachment is established, they introduce a crisis requiring money, such as a medical emergency, travel costs, or business problem.",
      "Requests start small but escalate, with scammers using guilt, love, and emotional manipulation to extract increasingly larger sums.",
      "Some scammers involve victims in money laundering by asking them to receive and forward money, making the victim an unwitting accomplice."
    ],
    warningSigns: [
      "They fall in love very quickly and express intense feelings early in the relationship",
      "They always have excuses for not meeting in person or video chatting",
      "Their profile photos look like professional model shots",
      "They claim to work overseas, be in the military, or work on an oil rig",
      "They ask for money for emergencies, travel, medical bills, or customs fees",
      "They want to move communication off the dating platform to personal email or messaging apps",
      "Their stories contain inconsistencies or change over time",
      "They ask you to send money via wire transfer, gift cards, or cryptocurrency"
    ],
    exampleMessages: [
      { type: "Love Bombing", content: "I've never felt this way about anyone before. Even though we haven't met, I know you're my soulmate. I think about you every moment of every day. I want to spend the rest of my life with you." },
      { type: "Money Request", content: "My darling, I'm so embarrassed to ask but I've had a medical emergency and I'm stuck in the hospital overseas. I need $3,000 for the surgery or they won't treat me. You're the only one I trust. I'll pay you back as soon as I'm home." },
      { type: "Escalation", content: "I've booked my flight to come see you! But customs is holding my luggage and demanding a $5,000 clearance fee. If you can help me with this, I'll be in your arms by tomorrow. I promise to pay everything back." }
    ],
    preventionSteps: [
      { title: "Reverse image search profile photos", description: "Copy their profile photo and search it on Google Images or TinEye. Scammers typically steal photos from other social media accounts or stock photo sites." },
      { title: "Never send money to someone you have not met in person", description: "No matter how strong your feelings are, never send money to someone you have only interacted with online. Real partners do not ask for money before meeting." },
      { title: "Be wary of excuses to avoid video calls", description: "If someone always has an excuse for why they cannot video chat, be suspicious. Ask for a live video call where they perform a specific action to verify their identity." },
      { title: "Talk to trusted friends and family", description: "Share the relationship details with people you trust. Scammers isolate victims and discourage them from discussing the relationship with others." },
      { title: "Watch for love bombing", description: "Be cautious of someone who declares love very quickly or pushes the relationship forward faster than feels natural. This is a common manipulation tactic." },
      { title: "Keep communication on the platform", description: "Dating platforms have safety features and moderation. Scammers push to move conversations to personal email or messaging apps to avoid detection." }
    ],
    faq: [
      { question: "How common are romance scams?", answer: "Romance scams are extremely common. The FTC reports that nearly 70,000 Americans reported romance scams in recent years, with losses exceeding $1.3 billion. The actual numbers are likely much higher since many victims do not report due to embarrassment." },
      { question: "Who is most at risk for romance scams?", answer: "While anyone can be targeted, people who are recently divorced, widowed, or lonely are particularly vulnerable. Seniors lose the highest dollar amounts per incident. Scammers specifically target people who appear to be seeking companionship." },
      { question: "What should I do if I suspect a romance scam?", answer: "Stop all communication with the person immediately. Do not send any more money. Save all messages and evidence. Report the scam to the dating platform, the FTC at reportfraud.ftc.gov, and the FBI's IC3 at ic3.gov. Talk to someone you trust about what happened." },
      { question: "Can romance scammers use deepfake video calls?", answer: "Yes, scammers are increasingly using AI deepfake technology to conduct video calls that appear to show a real person. If something seems off about a video call, ask the person to perform unexpected actions like holding up a specific number of fingers or turning their head, which deepfakes may not handle smoothly." }
    ],
    relatedScams: ["social-media-scam", "facebook-scam", "instagram-scam", "identity-theft"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "crypto-scam",
    title: "Cryptocurrency Scams: Protect Your Digital Assets",
    metaTitle: "Crypto Scams: Investment Fraud, Rug Pulls & Protection | GetCyberRight",
    metaDescription: "Identify cryptocurrency scams including fake exchanges, rug pulls, and pig butchering schemes. Learn to protect your crypto investments from fraud.",
    keywords: ["crypto scams", "cryptocurrency fraud", "bitcoin scam", "pig butchering scam", "fake crypto exchange"],
    cluster: "online-scams",
    overview: "Cryptocurrency scams have exploded in recent years, with losses exceeding $5.6 billion annually. Scammers exploit the complexity and novelty of digital currencies to trick victims through fake investment platforms, fraudulent exchanges, rug pulls, and elaborate pig butchering schemes. The irreversible nature of crypto transactions makes recovery nearly impossible. These scams target everyone from first-time investors to experienced traders.",
    howItWorks: [
      "Pig butchering scams build trust through social media or dating apps over weeks before introducing a 'guaranteed' crypto investment opportunity with fake platforms showing impressive returns.",
      "Fake cryptocurrency exchanges and wallets steal deposits by mimicking legitimate platforms with professional-looking websites and fabricated trading data.",
      "Rug pull schemes create a new token, generate hype through social media, pump the price, and then developers cash out, leaving investors with worthless tokens.",
      "Phishing attacks target crypto wallet users with fake emails about security issues, tricking them into entering their seed phrase on fraudulent websites.",
      "Celebrity endorsement scams use deepfake videos of well-known figures promoting fake crypto investments or giveaways."
    ],
    warningSigns: [
      "Guaranteed returns or 'risk-free' investment promises",
      "Pressure to invest quickly before an opportunity disappears",
      "Unsolicited investment advice from strangers on social media",
      "Platforms that make it easy to deposit but difficult to withdraw",
      "Requests to share your wallet seed phrase or private keys",
      "New tokens with anonymous development teams and no audited code",
      "Celebrity endorsement videos that seem too good to be true"
    ],
    exampleMessages: [
      { type: "Pig Butchering", content: "Hey! I know we just started talking but my uncle is a crypto analyst and he shared an amazing platform with me. I've already made $50K this month! Want me to show you how? You can start with just $500." },
      { type: "Fake Giveaway", content: "BREAKING: Elon Musk is giving away 5,000 BTC to celebrate Tesla's anniversary! Send 0.1 BTC to the address below and receive 1 BTC back instantly! Limited time only! [wallet address]" },
      { type: "Phishing", content: "URGENT: Unusual login detected on your Coinbase account from Russia. Click here immediately to secure your account and verify your identity before funds are transferred." }
    ],
    preventionSteps: [
      { title: "Never share your seed phrase", description: "Your seed phrase is the master key to your crypto wallet. No legitimate service, support agent, or platform will ever ask for it. Anyone who asks for it is trying to steal your funds." },
      { title: "Use only established exchanges", description: "Stick to well-known, regulated exchanges like Coinbase, Kraken, or Gemini. Research any platform thoroughly before depositing funds, and verify the URL carefully." },
      { title: "Be skeptical of guaranteed returns", description: "No legitimate investment can guarantee returns, especially in the volatile crypto market. Promises of guaranteed or unusually high returns are the hallmark of scams." },
      { title: "Verify celebrity endorsements", description: "Scammers frequently use deepfake videos and fake social media posts featuring celebrities. Always verify endorsements through official channels before acting on them." },
      { title: "Start small and test withdrawals", description: "If you try a new platform, start with a very small amount and attempt a withdrawal before depositing more. Scam platforms make withdrawals difficult or impossible." },
      { title: "Research tokens before investing", description: "Check if a token's smart contract code has been audited, investigate the development team, and look for red flags like anonymous founders or locked liquidity claims." }
    ],
    faq: [
      { question: "What is a pig butchering crypto scam?", answer: "Pig butchering is a scam where criminals build a relationship with victims (the 'fattening' phase) before introducing a fake crypto investment platform. Victims see fake profits and invest more and more until the scammers disappear with all the money. The term comes from the concept of 'fattening the pig before slaughter.'" },
      { question: "Can I recover money lost to crypto scams?", answer: "Recovery is very difficult because cryptocurrency transactions are irreversible. Report the scam to the FBI's IC3, FTC, and your local authorities. Some recovery firms exist but be cautious, as many of them are also scams." },
      { question: "How do I spot a fake crypto exchange?", answer: "Red flags include: no regulatory registration, promises of unusually high returns, difficulty withdrawing funds, pressure to deposit more, professional-looking but recently created websites, and no verifiable company information or leadership team." },
      { question: "Are crypto giveaways legitimate?", answer: "Almost never. Legitimate companies do not ask you to send cryptocurrency first in order to receive more back. Any giveaway requiring you to send crypto is a scam, regardless of who appears to be promoting it." }
    ],
    relatedScams: ["social-media-scam", "romance-scam", "phishing"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "tech-support-scam",
    title: "Tech Support Scams: How Criminals Impersonate Helpers",
    metaTitle: "Tech Support Scams: Warning Signs & Prevention Guide | GetCyberRight",
    metaDescription: "Learn how tech support scams work, from fake pop-ups to phone calls. Protect yourself and seniors from remote access fraud and fake virus alerts.",
    keywords: ["tech support scams", "fake virus warning", "microsoft scam call", "remote access scam", "computer virus pop-up scam"],
    cluster: "cyber-safety-seniors",
    overview: "Tech support scams trick victims into believing their computer is infected with viruses or has serious security problems, then charge hundreds or thousands of dollars for unnecessary 'repairs.' These scams target seniors disproportionately and use fake pop-up warnings, unsolicited phone calls, and search engine ads to reach victims. Once scammers gain remote access to a victim's computer, they can steal personal files, install actual malware, and access financial accounts.",
    howItWorks: [
      "Fake pop-up warnings appear in your browser claiming your computer is infected, displaying a phone number to call for immediate help.",
      "Unsolicited phone calls from people claiming to be Microsoft, Apple, or your internet provider, warning about detected security threats on your device.",
      "Scammers convince victims to download remote access software like TeamViewer or AnyDesk, giving the scammer full control of the computer.",
      "Once connected, scammers show fake 'evidence' of viruses by displaying normal system logs or running fake diagnostic tools.",
      "Victims are charged $200 to $1,000+ for unnecessary services, often through gift cards, wire transfers, or by accessing bank accounts through the remote connection."
    ],
    warningSigns: [
      "Unexpected pop-ups warning about viruses with a phone number to call",
      "Unsolicited calls from 'Microsoft' or 'Apple' about your computer",
      "Requests to install remote access software like TeamViewer or AnyDesk",
      "Pressure to pay immediately with gift cards or wire transfers",
      "Claims that your computer is sending spam or has been hacked",
      "Warnings that your computer will be disabled if you do not act now",
      "Requests to access your bank account through the remote session"
    ],
    exampleMessages: [
      { type: "Pop-up Warning", content: "WARNING! Your computer has been infected with 5 viruses! Your personal data and banking information is at risk! Do NOT shut down your computer! Call Microsoft Support immediately: 1-888-XXX-XXXX" },
      { type: "Phone Call", content: "Hello, this is John from Microsoft Technical Support. We have detected unusual activity from your computer's IP address. Hackers may have accessed your files. I need to connect to your computer to run a security scan." },
      { type: "Follow-up Email", content: "Your tech support subscription of $399.99 has been auto-renewed. If you wish to cancel and receive a refund, call our support line at 1-800-XXX-XXXX within 24 hours." }
    ],
    preventionSteps: [
      { title: "Microsoft and Apple will never call you unsolicited", description: "Major tech companies do not make outbound calls to customers about security issues. Any such call is a scam. Hang up immediately." },
      { title: "Close suspicious pop-ups safely", description: "If you see a virus warning pop-up, do not call the number. Close the browser using Task Manager (Ctrl+Alt+Delete on Windows, Command+Q on Mac). These pop-ups are fake." },
      { title: "Never give remote access to unsolicited callers", description: "Do not download TeamViewer, AnyDesk, or similar software at the request of someone who contacted you. Only grant remote access to technicians you contacted through verified channels." },
      { title: "Use legitimate security software", description: "Install reputable antivirus software from known companies. Your computer likely already has built-in protection (Windows Defender, macOS security)." },
      { title: "Talk to a trusted person before paying", description: "If you are concerned about your computer, talk to a family member, friend, or visit a local computer repair shop. Never make payments under pressure from an unsolicited call." },
      { title: "Report tech support scams", description: "Report these scams to the FTC at reportfraud.ftc.gov and Microsoft at microsoft.com/reportascam." }
    ],
    faq: [
      { question: "Can a pop-up warning be a real virus?", answer: "No. Legitimate antivirus software will never display a pop-up in your browser with a phone number to call. These are scam websites designed to look alarming. Close your browser completely to dismiss them." },
      { question: "What do I do if I already gave remote access?", answer: "Immediately disconnect from the internet, uninstall any remote access software the scammer installed, run a full antivirus scan, change all passwords from a different device, monitor your bank accounts for unauthorized activity, and contact your bank." },
      { question: "Why do tech support scams target seniors?", answer: "Seniors are targeted because they may be less familiar with how technology works, more trusting of authority figures, more likely to answer phone calls from unknown numbers, and may not have a tech-savvy person nearby to consult." },
      { question: "How much do tech support scams cost victims?", answer: "The average tech support scam costs victims between $200 and $1,000 per incident, but some victims have lost their entire savings. The FTC reports hundreds of millions in annual losses from tech support fraud." }
    ],
    relatedScams: ["phishing", "grandparent-scam", "identity-theft"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "phishing",
    title: "Phishing Attacks: The Complete Protection Guide",
    metaTitle: "Phishing Attacks: How to Detect, Prevent & Report Phishing | GetCyberRight",
    metaDescription: "Comprehensive guide to phishing attacks including email phishing, spear phishing, and smishing. Learn to identify and protect yourself from phishing scams.",
    keywords: ["phishing attacks", "phishing email examples", "how to detect phishing", "spear phishing", "email phishing prevention"],
    cluster: "phishing-attacks",
    overview: "Phishing is the most common type of cyberattack, responsible for over 90% of data breaches. These attacks use deceptive emails, text messages, phone calls, and websites to trick people into revealing sensitive information like passwords, credit card numbers, and Social Security numbers. Phishing has evolved from obvious spam to highly sophisticated targeted attacks that can fool even experienced internet users. Understanding the different types and tactics is essential for staying safe online.",
    howItWorks: [
      "Email phishing sends mass messages disguised as trusted organizations (banks, tech companies, government agencies) with links to fake login pages that harvest credentials.",
      "Spear phishing targets specific individuals using personal information gathered from social media and data breaches to craft convincing, personalized messages.",
      "Smishing (SMS phishing) sends text messages with urgent alerts about packages, bank accounts, or prizes, containing links to malicious websites.",
      "Vishing (voice phishing) uses phone calls with spoofed caller IDs to impersonate banks, government agencies, or tech support.",
      "Clone phishing duplicates a legitimate email you previously received, replacing links or attachments with malicious versions."
    ],
    warningSigns: [
      "Generic greetings like 'Dear Customer' instead of your actual name",
      "Urgent language threatening account closure, legal action, or missed deadlines",
      "Sender email addresses that look similar to but differ from legitimate domains",
      "Links where the displayed text does not match the actual URL (hover to check)",
      "Requests for sensitive information like passwords, Social Security numbers, or PINs",
      "Unexpected attachments, especially .exe, .zip, or macro-enabled documents",
      "Poor grammar, spelling errors, and formatting inconsistencies",
      "Offers that seem too good to be true or unexpected prize notifications"
    ],
    exampleMessages: [
      { type: "Bank Phishing", content: "ALERT: Unusual activity detected on your account ending in 4532. Your account has been temporarily locked. Click here to verify your identity and restore access: [link]. Failure to verify within 24 hours will result in permanent account closure." },
      { type: "Spear Phishing", content: "Hi [your name], I noticed you attended the Digital Marketing Conference last week. I wanted to share the presentation slides I promised. Here's the download link: [malicious link]. Looking forward to connecting! Best, [fake name]" },
      { type: "Smishing", content: "USPS: Your package #US9847362 has been held due to unpaid shipping fee of $1.99. Complete payment to avoid return: [link]" }
    ],
    preventionSteps: [
      { title: "Verify sender addresses carefully", description: "Look closely at the sender's email address. Phishing emails use domains that look similar to legitimate ones, like 'support@amaz0n-security.com' instead of 'support@amazon.com.'" },
      { title: "Hover before you click", description: "Before clicking any link, hover your mouse over it to see the actual destination URL. On mobile, press and hold the link without tapping. If the URL looks suspicious, do not click." },
      { title: "Go directly to the source", description: "If you receive an alert about your bank account, subscription, or package, do not use the link in the message. Instead, navigate directly to the official website by typing the URL in your browser." },
      { title: "Enable multi-factor authentication everywhere", description: "MFA protects your accounts even if a phishing attack captures your password. Use an authenticator app rather than SMS for the strongest protection." },
      { title: "Keep software updated", description: "Security updates patch vulnerabilities that phishing attacks exploit. Keep your operating system, browser, and security software up to date." },
      { title: "Use our Scam Checker tool", description: "Paste any suspicious message, email, or URL into the GetCyberRight Scam Checker for instant AI-powered analysis of potential phishing indicators." }
    ],
    faq: [
      { question: "What is the difference between phishing and spear phishing?", answer: "Regular phishing sends generic messages to thousands of people hoping some will respond. Spear phishing targets specific individuals using personal details to create highly convincing, personalized messages that are much harder to detect." },
      { question: "Can phishing emails contain malware?", answer: "Yes. Phishing emails can include malicious attachments that install malware, ransomware, or keyloggers when opened. They can also link to websites that automatically download malware to your device." },
      { question: "What should I do if I clicked a phishing link?", answer: "If you entered credentials: change that password immediately on the real site and enable MFA. If you downloaded a file: disconnect from the internet, run antivirus, and consider a professional security check. Monitor your accounts for unusual activity." },
      { question: "How do I report phishing emails?", answer: "Forward phishing emails to the Anti-Phishing Working Group at reportphishing@apwg.org. Report them to the FTC at reportfraud.ftc.gov. Most email providers also have a 'Report phishing' button. Use our Report a Scam tool to contribute to community protection." }
    ],
    relatedScams: ["social-media-scam", "tech-support-scam", "identity-theft", "data-breach"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "instagram-scam",
    title: "Instagram Scams: Protect Your Account and Identity",
    metaTitle: "Instagram Scams: Fake Followers, DM Fraud & Protection | GetCyberRight",
    metaDescription: "Identify Instagram scams including fake sponsorships, DM phishing, and account takeovers. Learn to protect your Instagram account from fraud.",
    keywords: ["instagram scams", "instagram phishing", "instagram DM scam", "fake instagram followers", "instagram account hacked"],
    cluster: "social-media-security",
    overview: "Instagram scams exploit the platform's visual nature and influencer culture to trick users into giving up personal information, money, or account access. From fake brand deals and lottery wins to phishing DMs and investment schemes, scammers use sophisticated tactics that target users of all ages. Instagram's emphasis on visual content makes it easy for scammers to create convincing fake profiles and advertisements.",
    howItWorks: [
      "Fake brand partnership messages offer money for promoting products, but require an upfront payment or personal information to 'register.'",
      "Account takeover schemes send messages about copyright violations or verification opportunities, directing victims to fake Instagram login pages.",
      "Investment and get-rich-quick schemes show lavish lifestyles and promise to teach followers how to earn money quickly for a fee.",
      "Fake giveaways require participants to click links, share personal information, or send money to claim nonexistent prizes.",
      "Impersonation accounts duplicate legitimate profiles to scam that person's followers through DMs."
    ],
    warningSigns: [
      "DMs offering large payments for minimal promotion work",
      "Messages about copyright strikes requiring immediate action",
      "Verification badge offers in exchange for personal information",
      "Investment opportunities showing guaranteed returns",
      "Links in DMs or comments from accounts with few posts",
      "Friend or celebrity accounts sending unusual money requests",
      "Requests to move conversations to WhatsApp or email"
    ],
    exampleMessages: [
      { type: "Fake Sponsorship", content: "Hi! We love your content and want to offer you a paid partnership! You could earn $500-$2000 per post. To get started, we just need you to register on our brand portal: [link]. A small $50 activation fee applies." },
      { type: "Copyright Scam", content: "Instagram Notice: Your account has been reported for copyright infringement. You must verify your identity within 24 hours or your account will be permanently deleted. Verify here: [link]" },
      { type: "Crypto Scheme", content: "I turned $200 into $15,000 in just one week using this crypto trading bot! DM me 'INFO' and I'll show you exactly how. Only 10 spots left! 🚀💰" }
    ],
    preventionSteps: [
      { title: "Never enter your password on external links", description: "Instagram will never send you to an external website to log in. Always check that you are on instagram.com before entering your credentials." },
      { title: "Enable two-factor authentication", description: "Go to Settings > Security > Two-Factor Authentication and enable it using an authentication app for the strongest protection." },
      { title: "Verify brand offers independently", description: "If a brand contacts you for a partnership, search for their official website and contact them through their listed email or social accounts to confirm the offer is real." },
      { title: "Check official Instagram communications in the app", description: "Go to Settings > Security > Emails from Instagram to see legitimate emails Instagram has sent you. If a message is not listed there, it is likely a scam." },
      { title: "Be cautious with DMs from strangers", description: "Do not click links, send money, or share personal information with accounts you do not know personally, regardless of how convincing their profile looks." },
      { title: "Report and block suspicious accounts", description: "Use Instagram's report feature to flag scam accounts. This helps protect the community and removes fraudulent profiles faster." }
    ],
    faq: [
      { question: "How do I recover a hacked Instagram account?", answer: "Visit instagram.com/hacked and follow the recovery steps. You may need to verify your identity through a selfie video. If recovery is unsuccessful, report the issue through Instagram's Help Center. Change passwords on all accounts that shared the same password." },
      { question: "Are Instagram verification badge offers real?", answer: "No. Instagram does not sell verification badges or offer them through DMs. The verification process is handled directly through the Instagram app under Settings. Any message offering to verify your account is a scam." },
      { question: "Can clicking a link in an Instagram DM hack my account?", answer: "Clicking a link itself does not hack your account, but if the link leads to a fake login page where you enter your Instagram password, the scammer will have your credentials. Some links may also attempt to install malware on your device." },
      { question: "How do I spot a fake Instagram account?", answer: "Look for low follower-to-following ratios, very few posts, recently created accounts, generic or stock profile photos, and posts with abnormally high engagement from suspicious-looking accounts." }
    ],
    relatedScams: ["facebook-scam", "social-media-scam", "romance-scam", "phishing"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "whatsapp-scam",
    title: "WhatsApp Scams: How Criminals Target Messaging Users",
    metaTitle: "WhatsApp Scams: Identify & Prevent Messaging Fraud | GetCyberRight",
    metaDescription: "Learn about WhatsApp scams including hijacking, impersonation, and verification code theft. Protect your account and family from messaging fraud.",
    keywords: ["whatsapp scams", "whatsapp fraud", "whatsapp hijacking", "whatsapp verification scam", "whatsapp impersonation"],
    cluster: "online-scams",
    overview: "WhatsApp scams exploit the platform's 2+ billion users through account hijacking, impersonation, and social engineering. Scammers steal verification codes to take over accounts, impersonate family members to request emergency money, and send malicious links disguised as legitimate messages. The personal nature of messaging apps makes these scams particularly effective because victims assume messages from known contacts are trustworthy.",
    howItWorks: [
      "Account hijacking: scammers trick you into sharing your WhatsApp verification code, allowing them to take over your account and message your contacts.",
      "Family impersonation: scammers pretend to be a family member messaging from a 'new phone number' and urgently request money.",
      "Prize and survey scams send messages claiming you have won a prize or can earn rewards by completing a survey that collects personal data.",
      "Malicious links shared in group chats or forwarded messages lead to phishing sites or malware downloads.",
      "Job offer scams recruit people for fake jobs that require upfront fees or involve money laundering."
    ],
    warningSigns: [
      "Messages asking for your 6-digit WhatsApp verification code",
      "A known contact messaging from a 'new number' asking for urgent money",
      "Links to claim prizes, discounts, or free products",
      "Job offers that require upfront payment or seem too easy for the pay",
      "Messages pressuring you to forward content to other contacts",
      "Calls from unknown numbers asking you to share a code sent to your phone"
    ],
    exampleMessages: [
      { type: "Verification Code Theft", content: "Hi! I accidentally sent my verification code to your number instead of mine. Can you please forward me the 6-digit code you just received? Sorry for the trouble!" },
      { type: "Family Impersonation", content: "Hi Mom, this is Sarah. I got a new phone and lost my old number. I'm in a bit of trouble and need you to transfer $800 to this account urgently. I'll explain everything later. Please don't call my old number." },
      { type: "Fake Prize", content: "Congratulations! You've been selected as a WhatsApp winner! Click below to claim your $1,000 Amazon gift card. Offer expires in 24 hours! [link]" }
    ],
    preventionSteps: [
      { title: "Never share your verification code", description: "Your WhatsApp verification code is only for you. No one, not even WhatsApp, will ever ask for it. Never share it with anyone for any reason." },
      { title: "Enable two-step verification", description: "Go to Settings > Account > Two-Step Verification and set a 6-digit PIN. This prevents scammers from activating your account on another device." },
      { title: "Verify identity through a different channel", description: "If a family member or friend messages from a 'new number' asking for money, call their original number or verify their identity through another method before sending anything." },
      { title: "Do not click suspicious links", description: "Even if a link comes from a known contact, be cautious. Their account may have been compromised. Verify with the sender before clicking." },
      { title: "Restrict who can add you to groups", description: "Go to Settings > Privacy > Groups and limit who can add you to groups to 'My Contacts' to reduce exposure to group-based scams." },
      { title: "Report and block scam numbers", description: "Use WhatsApp's built-in reporting feature to flag scam accounts, which helps WhatsApp remove them from the platform." }
    ],
    faq: [
      { question: "How do I recover a hijacked WhatsApp account?", answer: "Reinstall WhatsApp and register with your phone number. Enter the verification code sent via SMS. This will log the scammer out. Then immediately enable two-step verification. If two-step verification was already enabled by the scammer, you may need to wait 7 days before you can verify without it." },
      { question: "Can WhatsApp messages contain viruses?", answer: "WhatsApp messages themselves do not contain viruses, but links in messages can lead to malicious websites, and shared files could potentially contain malware. Be cautious with links and files from unknown senders." },
      { question: "How do scammers get my WhatsApp number?", answer: "Scammers obtain phone numbers through data breaches, social media profiles, random number generation, and purchasing contact lists. Having your number does not give them access to your account unless they also obtain your verification code." },
      { question: "Should I respond to scam messages on WhatsApp?", answer: "No. Do not respond to suspicious messages. Block the number, report it to WhatsApp, and delete the conversation. Responding confirms your number is active and may lead to more scam attempts." }
    ],
    relatedScams: ["phishing", "grandparent-scam", "social-media-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "job-scam",
    title: "Job Scams: How to Spot Fake Employment Offers",
    metaTitle: "Job Scams: Fake Employment Offers & Work-from-Home Fraud | GetCyberRight",
    metaDescription: "Protect yourself from fake job offers, work-from-home scams, and employment fraud. Learn the warning signs and how to verify legitimate opportunities.",
    keywords: ["job scams", "fake job offers", "work from home scam", "employment scam", "job interview scam"],
    cluster: "online-scams",
    overview: "Job scams prey on people seeking employment by offering attractive positions that do not exist. Scammers post fake listings on legitimate job boards, send unsolicited offers via email and social media, and conduct fake interviews to steal personal information or money. These scams have surged with the rise of remote work, as scammers exploit the demand for work-from-home opportunities. Victims lose money through fake training fees, equipment purchases, and identity theft.",
    howItWorks: [
      "Fake job postings on real job boards offer high salaries for minimal experience, collecting personal data through the application process.",
      "Unsolicited job offers arrive via email, text, or LinkedIn from 'recruiters' for positions you never applied for.",
      "Fake interviews conducted over text or messaging apps lead to requests for Social Security numbers, bank details, or upfront payments.",
      "Equipment and training fee scams require new 'hires' to pay for equipment, training materials, or background checks before starting.",
      "Check forwarding schemes send victims fake checks to deposit and forward money, leaving the victim liable when the check bounces."
    ],
    warningSigns: [
      "Job offers for positions you never applied to",
      "Interviews conducted entirely over text message or chat",
      "Requests for payment for training, equipment, or background checks",
      "Salaries that are significantly above market rate for the role",
      "Vague job descriptions with no specific duties or requirements",
      "Companies with no verifiable online presence or reviews",
      "Requests for bank account or Social Security number before being officially hired",
      "Pressure to accept immediately without time to research"
    ],
    exampleMessages: [
      { type: "Unsolicited Offer", content: "Hi [name], I'm a recruiter from [company]. I found your resume online and have an amazing work-from-home opportunity. Data entry position, $45/hour, flexible schedule, no experience needed. Reply YES to learn more!" },
      { type: "Equipment Scam", content: "Congratulations on being selected! Before your start date, you'll need to purchase the company software package ($299) from our vendor. We'll reimburse you on your first paycheck." },
      { type: "Check Scam", content: "We're sending you a check for $3,500 to purchase your home office equipment. Please deposit it, keep $500 for yourself, and send the remaining $3,000 to our equipment vendor via wire transfer." }
    ],
    preventionSteps: [
      { title: "Research the company thoroughly", description: "Search for the company name, check their official website, look for reviews on Glassdoor, and verify the job listing appears on their official careers page." },
      { title: "Never pay to get a job", description: "Legitimate employers do not charge employees for training, equipment, background checks, or application processing. Any request for payment is a red flag." },
      { title: "Verify recruiter identities", description: "Look up the recruiter on the company's official LinkedIn page or website. Call the company's main number and ask to speak with their HR department." },
      { title: "Protect your personal information", description: "Do not provide your Social Security number, bank account, or other sensitive information until you have verified the job is legitimate and you have a formal written offer." },
      { title: "Be skeptical of too-good-to-be-true offers", description: "If a job promises high pay for easy work with no experience required, it is likely a scam. Research typical salaries for similar positions." },
      { title: "Use official job platforms", description: "Apply through company websites directly or established job boards. Be cautious of jobs advertised only through social media or messaging apps." }
    ],
    faq: [
      { question: "How do I report a fake job posting?", answer: "Report fake listings to the job board where you found them (Indeed, LinkedIn, etc.), the FTC at reportfraud.ftc.gov, and your state attorney general. If you shared personal information, place a fraud alert on your credit reports." },
      { question: "Can job scammers steal my identity?", answer: "Yes. Job scams frequently collect Social Security numbers, driver's license copies, bank account details, and other personal information through fake application and onboarding processes. This information can be used for identity theft." },
      { question: "Are work-from-home jobs always scams?", answer: "No, many legitimate companies offer remote positions. However, scammers exploit the demand for remote work. Verify any opportunity by researching the company, checking their official website for the listing, and never paying upfront fees." },
      { question: "What should I do if I deposited a fake check?", answer: "Contact your bank immediately to report the check as fraudulent. Do not spend or send any of the money. File a police report and report the scam to the FTC. You may be held responsible for the full amount of the bounced check." }
    ],
    relatedScams: ["phishing", "identity-theft", "social-media-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "delivery-scam",
    title: "Fake Delivery Scams: Package Notification Fraud",
    metaTitle: "Delivery Scams: Fake Package Notifications & USPS/UPS Fraud | GetCyberRight",
    metaDescription: "Spot fake delivery notifications from USPS, FedEx, UPS, and Amazon. Learn how delivery scams work and how to protect yourself from package fraud.",
    keywords: ["delivery scam", "fake package notification", "usps scam text", "fedex scam", "ups phishing"],
    cluster: "online-scams",
    overview: "Fake delivery scams have become one of the fastest-growing fraud types, exploiting the massive increase in online shopping. Scammers send text messages and emails impersonating USPS, FedEx, UPS, Amazon, and other carriers, claiming there is a problem with a package delivery. These messages contain links to phishing sites that steal personal information, payment details, or install malware on your device.",
    howItWorks: [
      "Scammers send mass text messages claiming a package delivery failed and requesting address verification through a link.",
      "Fake email notifications mimic real carrier branding, asking victims to pay a small redelivery fee that captures credit card information.",
      "QR codes on fake delivery notices left on doors direct victims to phishing websites.",
      "Fake tracking pages ask for login credentials or payment information to 'schedule redelivery.'",
      "Brushing scams send real packages you did not order, using your address to create fake reviews."
    ],
    warningSigns: [
      "Delivery notifications for packages you did not order",
      "Texts from short codes or unknown numbers about deliveries",
      "Requests to pay a fee to receive or redeliver a package",
      "Tracking links that do not go to official carrier websites",
      "Messages with urgent deadlines to claim a package",
      "Notifications that do not include your actual name"
    ],
    exampleMessages: [
      { type: "Fake USPS Text", content: "USPS: We were unable to deliver your package. Schedule a redelivery by verifying your address: [link]. Package will be returned if not claimed within 48 hours." },
      { type: "FedEx Email", content: "FedEx Delivery Exception: Package #FX7739201 requires a $1.99 redelivery fee due to incorrect address. Update your information: [link]" },
      { type: "Missed Delivery Notice", content: "UPS: Your package is being held at our facility. A customs/processing fee of $3.50 is required before delivery. Complete payment: [link]" }
    ],
    preventionSteps: [
      { title: "Track packages through official apps and websites only", description: "If you receive a delivery notification, do not click the link. Instead, go directly to the carrier's official website or app and enter the tracking number manually." },
      { title: "Carriers never charge redelivery fees via text", description: "USPS, FedEx, UPS, and other major carriers do not charge fees via text message or email to redeliver packages. Any such request is a scam." },
      { title: "Check your actual orders", description: "Before responding to any delivery notification, verify whether you actually have a pending order through the retailer's website or your email order confirmations." },
      { title: "Do not scan unknown QR codes", description: "If you find a delivery notice with a QR code that you were not expecting, do not scan it. Contact the carrier directly through their official website." },
      { title: "Report suspicious messages", description: "Forward suspicious texts to 7726 (SPAM) and report phishing emails to the carrier. For USPS, report to uspis.gov." }
    ],
    faq: [
      { question: "Why am I getting fake delivery texts?", answer: "Scammers send millions of fake delivery texts to random phone numbers, especially during holiday shopping seasons. Your number may have been obtained from data breaches, social media, or randomly generated." },
      { question: "What happens if I click a fake delivery link?", answer: "The link typically leads to a phishing site that asks for personal information or credit card details. Some links may attempt to install malware. If you clicked but did not enter information, run an antivirus scan. If you entered information, change your passwords and monitor your accounts." },
      { question: "Does USPS send text messages about deliveries?", answer: "USPS only sends text messages if you specifically signed up for Informed Delivery text notifications. USPS will never send texts asking for payment or personal information." },
      { question: "What is a brushing scam?", answer: "A brushing scam is when you receive packages you did not order. Companies send cheap items to random addresses so they can post fake verified purchase reviews. While not directly harmful, it means someone has your name and address. Report it to the retailer." }
    ],
    relatedScams: ["phishing", "amazon-scam", "shopping-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "zelle-scam",
    title: "Zelle Scams: How Instant Payments Enable Fraud",
    metaTitle: "Zelle Scams: Payment Fraud Prevention & Recovery Guide | GetCyberRight",
    metaDescription: "Learn how Zelle scams work including bank impersonation, fake buyer schemes, and unauthorized transfers. Protect your money from instant payment fraud.",
    keywords: ["zelle scams", "zelle fraud", "zelle payment scam", "bank impersonation zelle", "zelle money lost"],
    cluster: "online-scams",
    overview: "Zelle scams exploit the instant, irreversible nature of peer-to-peer payments to steal money from victims. Because Zelle transfers are instantaneous and cannot be reversed like credit card charges, scammers have increasingly targeted the platform. Common schemes include bank impersonation, fake buyer scams on marketplaces, and social engineering attacks that trick victims into sending money they cannot recover.",
    howItWorks: [
      "Bank impersonation: scammers call or text pretending to be your bank's fraud department, guiding you through steps that actually send your money to the scammer's account.",
      "Marketplace overpayment: a fake buyer 'accidentally' sends too much via Zelle and asks you to refund the difference before the original payment is reversed.",
      "Fake invoices and payment requests arrive via Zelle from scammers posing as businesses for services you never used.",
      "Romance and social media scammers request Zelle payments because they know the transfers are instant and irreversible.",
      "Account upgrade scams claim you need to send money to yourself to 'upgrade' your Zelle account, but the money actually goes to the scammer."
    ],
    warningSigns: [
      "Calls or texts from your 'bank' asking you to send Zelle payments to stop fraud",
      "Buyers wanting to overpay and requesting refunds through Zelle",
      "Requests to send Zelle payments to yourself to 'verify' or 'upgrade' your account",
      "Pressure to send payments immediately",
      "Payment requests from people or businesses you do not know",
      "Instructions to send money to a different phone number or email than expected"
    ],
    exampleMessages: [
      { type: "Bank Impersonation", content: "Bank of America Fraud Alert: Suspicious Zelle transfer of $500 detected. Reply YES to confirm or NO to cancel. If you did not authorize this, call us immediately at 1-800-XXX-XXXX." },
      { type: "Overpayment", content: "I sent you $1,000 instead of $100 via Zelle by mistake! Can you please send back the $900 difference? I really need it for rent. Please send it quickly!" },
      { type: "Account Upgrade", content: "To upgrade your Zelle to a business account and receive the $2,000 payment, you'll need to first send $200 to this email address for verification. It will be refunded immediately." }
    ],
    preventionSteps: [
      { title: "Only send Zelle payments to people you know and trust", description: "Zelle is designed for sending money to friends and family. Never use it for purchases from strangers or unknown businesses." },
      { title: "Your bank will never ask you to send Zelle payments", description: "Banks do not ask customers to transfer money via Zelle to stop fraud. If you receive such a call, hang up and call your bank using the number on your debit card." },
      { title: "Never refund overpayments", description: "If someone 'accidentally' sends too much money, do not send money back. The original payment is likely fraudulent and will be reversed, leaving you out the money you sent." },
      { title: "Verify payment requests independently", description: "If you receive a Zelle request from someone claiming to be a business or service provider, verify their identity through official channels before sending payment." },
      { title: "Set up Zelle alerts", description: "Enable notifications for all Zelle transactions so you are immediately aware of any unauthorized activity on your account." }
    ],
    faq: [
      { question: "Can I get my money back if I was scammed on Zelle?", answer: "Unfortunately, Zelle transfers that you authorized are generally not reversible, even if you were tricked. However, unauthorized transfers (ones you did not initiate) are protected. Report fraud to your bank immediately and file complaints with the FTC and CFPB." },
      { question: "Is Zelle safe to use?", answer: "Zelle is safe when used for its intended purpose: sending money to people you know and trust personally. It is not designed for transactions with strangers and offers no buyer or seller protection like PayPal or credit cards." },
      { question: "How do bank impersonation Zelle scams work?", answer: "Scammers spoof your bank's phone number and claim fraud was detected. They guide you through steps to 'secure' your account that actually involve sending your money to the scammer. Your bank will never ask you to send Zelle payments to stop fraud." },
      { question: "Should I use Zelle for Marketplace purchases?", answer: "No. Never use Zelle to pay for items from strangers on Facebook Marketplace, Craigslist, or similar platforms. If the item is not as described or never arrives, you have no way to recover your payment." }
    ],
    relatedScams: ["paypal-scam", "shopping-scam", "phishing"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "shopping-scam",
    title: "Online Shopping Scams: Fake Stores and Purchase Fraud",
    metaTitle: "Online Shopping Scams: Fake Websites & Purchase Fraud | GetCyberRight",
    metaDescription: "Identify fake online stores, counterfeit products, and shopping fraud. Learn to verify legitimate retailers and protect your money when shopping online.",
    keywords: ["online shopping scams", "fake online store", "counterfeit products online", "shopping fraud", "fake website scam"],
    cluster: "online-scams",
    overview: "Online shopping scams use fake websites, social media ads, and fraudulent listings to trick consumers into paying for products that never arrive or are drastically different from what was advertised. These scam stores often mimic legitimate retailers with professional-looking websites, stolen product images, and too-good-to-be-true prices. With billions spent online annually, shopping scams cost consumers hundreds of millions of dollars each year.",
    howItWorks: [
      "Fake online stores with professional designs offer popular products at deep discounts, collect payment, and never ship anything.",
      "Social media ads promote 'limited time' deals on trending products, linking to scam websites that harvest payment information.",
      "Counterfeit product sellers deliver cheap knockoffs that look nothing like the advertised items.",
      "Bait-and-switch stores show one product but ship a completely different, much cheaper item.",
      "Subscription traps offer free trials that automatically enroll victims in expensive recurring charges."
    ],
    warningSigns: [
      "Prices that are 50% or more below retail for popular products",
      "Websites with no physical address, phone number, or contact information",
      "Only accepting payment through wire transfer, gift cards, or cryptocurrency",
      "Recently created websites with no customer reviews outside their own site",
      "Poor grammar, spelling errors, and low-quality website design",
      "No clear return policy or terms of service",
      "Social media ads with high engagement but comments disabled"
    ],
    exampleMessages: [
      { type: "Social Media Ad", content: "FLASH SALE: Nike Air Max 90 - 85% OFF! Only $29.99 (Regular $189.99). Limited stock available. Free shipping worldwide. Shop now before they're gone!" },
      { type: "Fake Store", content: "Thank you for your order #FS-28471! Your 4K Smart TV ($99.99) will be shipped within 7-10 business days. For tracking information, visit our website. No tracking updates after 2 weeks." },
      { type: "Subscription Trap", content: "Try our premium skincare FREE! Just pay $4.99 shipping. (Hidden in fine print: By accepting this offer, you agree to monthly shipments of $89.99 per month billed automatically.)" }
    ],
    preventionSteps: [
      { title: "Research the store before buying", description: "Search for the store name plus 'scam' or 'reviews.' Check the Better Business Bureau, Trustpilot, and Reddit for customer experiences. Verify the website's age using whois lookup tools." },
      { title: "Use credit cards for online purchases", description: "Credit cards offer fraud protection and chargeback options that debit cards, wire transfers, and gift cards do not. Never buy from online stores that only accept non-reversible payment methods." },
      { title: "Check for secure checkout", description: "Verify the website URL starts with https:// and has a padlock icon. However, note that scam sites can also have SSL certificates, so this alone does not guarantee legitimacy." },
      { title: "Be skeptical of extreme discounts", description: "If a deal seems too good to be true, it almost certainly is. Compare prices across multiple legitimate retailers to gauge realistic pricing." },
      { title: "Read the fine print", description: "Before entering payment information, check for hidden subscription terms, return policies, and shipping details. Legitimate retailers have clear, accessible policies." },
      { title: "Check for real contact information", description: "Legitimate stores provide a physical address, phone number, and customer service email. Try contacting them before purchasing to verify they are real." }
    ],
    faq: [
      { question: "How do I get a refund from a fake online store?", answer: "If you paid by credit card, file a chargeback with your bank. If you paid through PayPal, open a dispute. For other payment methods, recovery is much harder. Report the scam to the FTC and your state consumer protection office." },
      { question: "How can I check if an online store is legitimate?", answer: "Check the domain age using WHOIS, look for reviews on independent sites, verify the contact information, check for social media presence with real engagement, and search for the store name plus 'scam' or 'review.'" },
      { question: "Are social media shopping ads safe?", answer: "Not always. While many legitimate retailers advertise on social media, scammers also create convincing ads. Before purchasing from a social media ad, research the seller independently and verify they are a real, established business." },
      { question: "What is a bait-and-switch scam?", answer: "A bait-and-switch scam advertises one product (the bait) but delivers a different, inferior product (the switch). The item shipped may be a cheap knockoff or completely unrelated to what was ordered." }
    ],
    relatedScams: ["amazon-scam", "delivery-scam", "social-media-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "grandparent-scam",
    title: "Grandparent Scams: Protecting Seniors from Family Impersonation",
    metaTitle: "Grandparent Scams: Emergency Impersonation Fraud Prevention | GetCyberRight",
    metaDescription: "Learn how grandparent scams work, where criminals impersonate family members in crisis. Protection tips for seniors and families.",
    keywords: ["grandparent scam", "emergency scam call", "family impersonation scam", "senior phone scam", "grandchild scam"],
    cluster: "cyber-safety-seniors",
    overview: "Grandparent scams are a cruel form of fraud that specifically targets seniors by exploiting their love for their grandchildren. Scammers call pretending to be a grandchild in distress, often claiming to have been arrested, in an accident, or stranded overseas. They beg for immediate financial help and plead with the victim not to tell other family members. These scams have become more dangerous with AI voice cloning technology that can mimic a real person's voice from just a few seconds of audio.",
    howItWorks: [
      "A scammer calls pretending to be a grandchild in distress, using a panicked voice and saying 'Grandma/Grandpa, it's me!'",
      "They claim an emergency such as arrest, car accident, medical emergency, or being stranded in another country.",
      "They ask for immediate money via wire transfer, gift cards, or cash sent by courier.",
      "They insist the grandparent not tell other family members, often saying they are embarrassed or that it could hurt their case.",
      "AI voice cloning technology now allows scammers to mimic the actual grandchild's voice using audio from social media videos."
    ],
    warningSigns: [
      "A caller claiming to be a grandchild but sounding slightly different",
      "Urgent requests for money due to an emergency",
      "Instructions to keep the situation secret from other family members",
      "Requests for payment via wire transfer, gift cards, or cash",
      "A 'lawyer' or 'police officer' gets on the line to validate the story",
      "The caller cannot answer personal questions that the real grandchild would know"
    ],
    exampleMessages: [
      { type: "Initial Call", content: "Grandma? It's me... [crying]. I've been in a terrible car accident and I got arrested. I need you to send $5,000 for bail right away. Please don't tell Mom and Dad, they'll be so disappointed in me." },
      { type: "Lawyer Follow-up", content: "Hello, this is Attorney James Smith. I'm representing your grandchild. They've asked me to contact you about their bail. We need $8,000 wired to our office immediately to prevent them from spending the weekend in jail." },
      { type: "AI Voice Clone", content: "[Using AI-cloned voice of actual grandchild] Grandpa, I'm stuck in Mexico and my wallet was stolen. I need you to wire me $3,000 through Western Union so I can get home. I'm so scared." }
    ],
    preventionSteps: [
      { title: "Establish a family code word", description: "Create a secret code word that only family members know. In an emergency, ask the caller for the code word. Use the GetCyberRight Family Codeword Generator to create one." },
      { title: "Hang up and verify", description: "If someone claims to be a grandchild in trouble, hang up and call the grandchild directly on their known phone number. Contact their parents or other family members to verify the situation." },
      { title: "Do not wire money or buy gift cards", description: "Legitimate emergencies are never resolved by wiring money or buying gift cards. Bail bonds, hospitals, and lawyers accept traditional payment methods." },
      { title: "Ask personal questions", description: "Ask the caller questions only your real grandchild would know, such as the name of their pet, their school, or a recent family event." },
      { title: "Be aware of AI voice cloning", description: "Scammers can now clone voices from social media videos. Even if a voice sounds like your grandchild, still verify through independent contact." },
      { title: "Discuss this scam with elderly family members", description: "Make sure seniors in your family know about grandparent scams and have a plan to verify emergency calls before sending money." }
    ],
    faq: [
      { question: "How do grandparent scams find their victims?", answer: "Scammers get information from social media profiles, data breaches, phone directories, and obituaries. They may know a grandchild's name and location from public social media posts. Some simply call random seniors and let the victim fill in details." },
      { question: "Can AI really clone my grandchild's voice?", answer: "Yes. Modern AI voice cloning technology can create a convincing replica of someone's voice from just a few seconds of audio, often taken from social media videos. This makes it crucial to verify any urgent request through independent means." },
      { question: "What should I do if I already sent money?", answer: "Contact the wire service or gift card company immediately to attempt to stop or reverse the transaction. File a police report, report to the FTC at reportfraud.ftc.gov, and contact your bank. Also report to the FBI's IC3 at ic3.gov." },
      { question: "How can I protect my grandparents from this scam?", answer: "Set up a family code word, discuss how these scams work, and encourage them to always verify emergency calls by hanging up and calling the grandchild directly. Make sure they know it is safe to call family members to verify, regardless of what the caller says." }
    ],
    relatedScams: ["tech-support-scam", "romance-scam", "identity-theft"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "social-media-scam",
    title: "Social Media Scams: Protecting Your Digital Life",
    metaTitle: "Social Media Scams: Complete Protection Guide | GetCyberRight",
    metaDescription: "Comprehensive guide to social media scams across all platforms. Learn to identify fake profiles, scam ads, and protect your accounts from fraud.",
    keywords: ["social media scams", "social media fraud", "fake profile scam", "social media security", "social engineering attacks"],
    cluster: "social-media-security",
    overview: "Social media scams affect billions of users across platforms like Facebook, Instagram, TikTok, LinkedIn, and X (Twitter). Scammers exploit the trust and openness of social platforms to steal money, harvest personal data, and spread malware. From fake giveaways and phishing messages to investment schemes and romance fraud, social media has become the primary channel for reaching potential scam victims. Understanding how these scams operate across platforms is essential for staying safe online.",
    howItWorks: [
      "Fake profiles impersonate real people or create attractive personas to build trust before scamming followers.",
      "Phishing links shared in comments, DMs, and posts redirect users to credential-stealing websites.",
      "Fake giveaways and contest pages collect personal information under the guise of prize entry.",
      "Investment and money-making scheme accounts showcase fake luxury lifestyles to lure victims.",
      "Compromised accounts send scam messages to the victim's contacts, exploiting existing trust."
    ],
    warningSigns: [
      "Accounts with few followers but following many people",
      "DMs from strangers with links or money-making offers",
      "Giveaways requiring you to click external links or share personal data",
      "Investment advice promising guaranteed returns",
      "Messages from friends that seem out of character or urgent",
      "Ads for products with impossibly low prices",
      "Requests to move conversations to other platforms"
    ],
    exampleMessages: [
      { type: "Giveaway Scam", content: "You've been randomly selected to win a $500 gift card! Like this post, follow our page, and click the link in bio to claim. Must enter within 24 hours!" },
      { type: "Compromised Account", content: "Hey! I found this photo of you on this website, you need to see this... [link]" },
      { type: "Investment Pitch", content: "I made $12,000 last week from my phone! My mentor taught me forex trading and now I help others do the same. DM me 'START' to learn the method. 🔥💰" }
    ],
    preventionSteps: [
      { title: "Enable two-factor authentication on all social accounts", description: "This is the single most important step. Use an authenticator app rather than SMS for stronger protection against account takeovers." },
      { title: "Be selective about friend and follow requests", description: "Only accept requests from people you know personally. Scammers create fake or cloned profiles to gain access to your information." },
      { title: "Do not click links in DMs from unknown accounts", description: "Even if a message seems interesting or urgent, do not click links from accounts you do not know. Verify with the sender through another channel if the message appears to come from a friend." },
      { title: "Review your privacy settings regularly", description: "Limit who can see your posts, friend list, and personal information. The less data visible publicly, the harder it is for scammers to target you." },
      { title: "Report suspicious accounts and content", description: "Use each platform's reporting tools to flag scam accounts, fake ads, and suspicious content. This helps protect the entire community." },
      { title: "Verify opportunities independently", description: "If you see an enticing offer, giveaway, or job opportunity on social media, verify it through the official website of the company involved before engaging." }
    ],
    faq: [
      { question: "Which social media platform has the most scams?", answer: "Facebook and Instagram see the highest volume of reported scams due to their large user bases. However, scams are prevalent across all platforms including TikTok, LinkedIn, X (Twitter), and messaging apps." },
      { question: "How do I know if my social media account was hacked?", answer: "Signs include posts you did not make, messages sent from your account that you did not write, changed passwords or email addresses, unfamiliar login locations in your account security settings, and friends reporting suspicious messages from you." },
      { question: "Are sponsored ads on social media safe?", answer: "While many sponsored ads are from legitimate businesses, scammers also purchase ads. Always research the advertiser independently before making purchases. Look for reviews, verify the company exists, and be wary of deals that seem too good to be true." },
      { question: "How can I protect my children from social media scams?", answer: "Set age-appropriate accounts, enable privacy settings, use parental controls, teach them never to share personal information or click suspicious links, and maintain open communication about their online interactions." }
    ],
    relatedScams: ["facebook-scam", "instagram-scam", "phishing", "romance-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "identity-theft",
    title: "Identity Theft: Prevention, Detection, and Recovery",
    metaTitle: "Identity Theft: Complete Prevention & Recovery Guide | GetCyberRight",
    metaDescription: "Learn how identity theft happens, warning signs to watch for, and step-by-step recovery guide. Protect your personal information from criminals.",
    keywords: ["identity theft", "identity theft prevention", "identity theft recovery", "how identity theft happens", "identity theft warning signs"],
    cluster: "identity-theft",
    overview: "Identity theft occurs when someone uses your personal information without permission to commit fraud or other crimes. It affects millions of people each year, with losses totaling billions of dollars. Criminals steal identities through data breaches, phishing attacks, mail theft, dumpster diving, and social engineering. The impact goes far beyond financial loss, affecting credit scores, employment opportunities, and emotional wellbeing. Early detection and swift action are critical to minimizing damage.",
    howItWorks: [
      "Data breaches expose millions of records containing Social Security numbers, credit card numbers, and other personal data that criminals sell on the dark web.",
      "Phishing attacks trick victims into entering personal information on fake websites or sharing details over the phone.",
      "Mail theft and dumpster diving allow criminals to collect credit card statements, bank statements, and pre-approved credit offers.",
      "Social engineering manipulates people into revealing personal information through pretexting, impersonation, and relationship building.",
      "Stolen personal data is used to open new credit accounts, file fraudulent tax returns, commit medical identity theft, or take over existing accounts."
    ],
    warningSigns: [
      "Unfamiliar charges on your credit card or bank statements",
      "Bills or statements for accounts you did not open",
      "Unexpected calls from debt collectors about debts you do not owe",
      "Denial of credit applications for no apparent reason",
      "IRS notice about duplicate tax returns filed in your name",
      "Missing mail or unfamiliar mail arriving at your address",
      "Unexpected changes to your credit score",
      "Medical bills for treatments you did not receive"
    ],
    exampleMessages: [
      { type: "Account Opening Alert", content: "Thank you for opening your new Capital One credit card ending in 4821. Your credit limit is $5,000. If you did not apply for this card, please contact us immediately." },
      { type: "IRS Notice", content: "Dear Taxpayer, Our records indicate that a federal tax return was already filed using your Social Security number for the current tax year. If you did not file this return, you may be a victim of identity theft." },
      { type: "Collection Notice", content: "This is an attempt to collect a debt. You owe $3,247 to [company] for services rendered. If you do not pay within 30 days, this will be reported to credit bureaus." }
    ],
    preventionSteps: [
      { title: "Freeze your credit", description: "Place a security freeze with all three credit bureaus (Equifax, Experian, TransUnion). This prevents anyone from opening new credit accounts in your name. It is free and can be temporarily lifted when you need to apply for credit." },
      { title: "Monitor your accounts regularly", description: "Review bank and credit card statements weekly. Check your credit reports at annualcreditreport.com. Set up transaction alerts for all financial accounts." },
      { title: "Protect your Social Security number", description: "Never carry your Social Security card in your wallet. Only share your SSN when absolutely necessary and verify why it is needed. Do not provide it over the phone unless you initiated the call." },
      { title: "Use our Data Broker Removal tool", description: "Remove your personal information from data broker websites that sell your data to anyone willing to pay. The GetCyberRight Data Broker Removal tool helps you find and remove your data from 501+ broker sites." },
      { title: "Secure your mail", description: "Use a locked mailbox or PO box, opt for electronic statements, and shred documents containing personal information before discarding them." },
      { title: "Use strong, unique passwords", description: "Use a different password for every account and enable multi-factor authentication. Our Security Key Generator can create strong passwords instantly." }
    ],
    faq: [
      { question: "How do I check if my identity has been stolen?", answer: "Review your credit reports from all three bureaus at annualcreditreport.com, check your bank and credit card statements for unfamiliar charges, monitor your mailbox for unexpected bills or account statements, and use the GetCyberRight Breach Monitoring tool to check if your data appears in known breaches." },
      { question: "What is the first thing I should do if my identity is stolen?", answer: "First, place a fraud alert with one of the three credit bureaus (they are required to notify the other two). Then file an identity theft report at identitytheft.gov, freeze your credit at all three bureaus, and contact any companies where fraudulent accounts were opened." },
      { question: "How long does identity theft recovery take?", answer: "Recovery time varies widely depending on the severity. Simple cases may be resolved in a few weeks, while complex cases involving multiple fraudulent accounts, tax fraud, or criminal identity theft can take months or even years to fully resolve." },
      { question: "Can children be victims of identity theft?", answer: "Yes, child identity theft is a growing problem. Children's Social Security numbers can be used for years before the theft is discovered. Parents should freeze their children's credit and monitor for any unexpected mail about accounts or debts in their child's name." }
    ],
    relatedScams: ["phishing", "data-breach", "social-media-scam"],
    lastUpdated: "2026-03-01"
  },
  {
    slug: "data-breach",
    title: "Data Breaches: What They Mean for You and How to Respond",
    metaTitle: "Data Breaches: Response Guide & Protection Steps | GetCyberRight",
    metaDescription: "Understand how data breaches affect you personally. Step-by-step response guide, breach checking tools, and long-term protection strategies.",
    keywords: ["data breach", "data breach response", "what to do after data breach", "data breach protection", "check if data breached"],
    cluster: "data-breaches",
    overview: "Data breaches expose personal information when organizations suffer security incidents that compromise their stored data. Billions of records are breached each year, exposing names, email addresses, passwords, Social Security numbers, credit card data, and medical records. While you cannot prevent companies from being breached, you can take proactive steps to reduce your risk and respond quickly when your data is involved in a breach. Understanding what data was exposed and acting promptly are key to minimizing harm.",
    howItWorks: [
      "Hackers exploit vulnerabilities in company systems through unpatched software, weak credentials, or social engineering to access databases containing customer information.",
      "Stolen data is sold on dark web marketplaces where criminals purchase it for identity theft, account takeover, and fraud.",
      "Credential stuffing attacks use breached username/password combinations to access other accounts where people reused the same credentials.",
      "Companies may not discover breaches for weeks or months, giving criminals time to exploit stolen data before victims are notified.",
      "Breach notification laws require companies to inform affected individuals, but the delay and varying regulations mean you may not hear about a breach promptly."
    ],
    warningSigns: [
      "Breach notification letter or email from a company you have an account with",
      "Unexpected password reset emails for accounts you did not request",
      "Inability to log into accounts with your known password",
      "Unfamiliar charges on financial accounts",
      "Spam or phishing emails increasing significantly",
      "Alerts from breach monitoring services about your data appearing in new leaks"
    ],
    exampleMessages: [
      { type: "Breach Notification", content: "We are writing to inform you that on [date], we discovered a security incident that may have affected your personal information, including your name, email address, and encrypted password. We recommend you change your password immediately." },
      { type: "Dark Web Alert", content: "Your email address [email] was found in a data breach from [company] on [date]. The exposed data includes: email, password hash, phone number, and mailing address." },
      { type: "Account Security Alert", content: "We detected a login to your account from an unfamiliar device in [location]. If this was not you, your account credentials may have been compromised in a data breach." }
    ],
    preventionSteps: [
      { title: "Check if your data has been breached", description: "Use the GetCyberRight Breach Monitoring Dashboard to check if your email, phone number, or personal data appears in known data breaches." },
      { title: "Use unique passwords for every account", description: "If you reuse passwords, a single breach can compromise all your accounts. Use our Security Key Generator to create unique passwords and a password manager to store them." },
      { title: "Enable multi-factor authentication", description: "MFA ensures that even if your password is breached, criminals cannot access your account without the second factor." },
      { title: "Remove your data from broker sites", description: "Use the GetCyberRight Data Broker Removal tool to find and remove your personal information from 501+ data broker websites that buy and sell breached data." },
      { title: "Monitor your financial accounts", description: "Set up alerts for all financial transactions. Review statements regularly. Consider a credit freeze to prevent unauthorized credit applications." },
      { title: "Act fast when notified", description: "When you receive a breach notification, change the affected password immediately, check for any unauthorized activity, and enable MFA if not already active." }
    ],
    faq: [
      { question: "How do I know if my data was in a breach?", answer: "Use breach checking tools like the GetCyberRight Breach Monitoring Dashboard, which checks your email against known data breaches. You may also receive notification emails directly from breached companies." },
      { question: "What should I do first after a data breach?", answer: "Change the password for the breached account immediately, then change it on any other account where you used the same password. Enable MFA, monitor your financial accounts for suspicious activity, and consider a credit freeze if sensitive financial data was exposed." },
      { question: "Are data breach notification emails legitimate?", answer: "Most are legitimate, but scammers also send fake breach notifications to steal credentials. Verify by checking the company's official website for breach announcements rather than clicking links in the email." },
      { question: "How can I minimize my risk from future breaches?", answer: "Use unique passwords for every account, enable MFA everywhere, minimize the personal data you share with online services, regularly remove your data from data broker sites, and monitor your credit reports." }
    ],
    relatedScams: ["identity-theft", "phishing", "shopping-scam"],
    lastUpdated: "2026-03-01"
  },
];

export function getScamBySlug(slug: string): ScamPageContent | undefined {
  return SCAM_PAGES.find(page => page.slug === slug);
}

export function getAllScamSlugs(): string[] {
  return SCAM_PAGES.map(page => page.slug);
}
