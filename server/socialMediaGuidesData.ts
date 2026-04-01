import type { CriticalGuideData } from "./criticalGuidesData";

export const socialMediaGuides: CriticalGuideData[] = [
  {
    slug: "how-to-secure-facebook-account-privacy-settings",
    title: "How to Secure Your Facebook Account: Complete Privacy & Safety Guide",
    metaDescription: "Step-by-step guide to securing your Facebook account. Learn how to lock down privacy settings, enable two-factor authentication, download your data, and delete your account permanently.",
    category: "social-media-security",
    cluster: "social-media-security",
    tags: ["Facebook security", "Facebook privacy settings", "secure Facebook account", "delete Facebook account", "Facebook two-factor authentication", "Facebook data download"],
    targetKeywords: ["how to secure Facebook account", "Facebook privacy settings 2026", "delete Facebook account permanently", "Facebook two-factor authentication", "download Facebook data", "Facebook account security"],
    wordCount: 2800,
    readingTimeMinutes: 14,
    headings: [
      { id: "security-checkup", text: "Run Facebook's Security Checkup", level: 2 },
      { id: "strong-password", text: "Set a Strong, Unique Password", level: 2 },
      { id: "two-factor", text: "Enable Two-Factor Authentication", level: 2 },
      { id: "login-alerts", text: "Turn On Login Alerts and Review Active Sessions", level: 2 },
      { id: "privacy-settings", text: "Lock Down Your Privacy Settings", level: 2 },
      { id: "app-permissions", text: "Remove Unnecessary App Permissions", level: 2 },
      { id: "ad-tracking", text: "Limit Ad Tracking and Off-Facebook Activity", level: 2 },
      { id: "download-data", text: "Download All Your Facebook Data", level: 2 },
      { id: "deactivate", text: "How to Deactivate Your Facebook Account", level: 2 },
      { id: "delete-permanently", text: "How to Permanently Delete Your Facebook Account", level: 2 },
      { id: "after-deletion", text: "What Happens After Deletion", level: 2 },
    ],
    tableOfContents: [
      { text: "Run Facebook's Security Checkup", level: 2, anchor: "security-checkup" },
      { text: "Set a Strong, Unique Password", level: 2, anchor: "strong-password" },
      { text: "Enable Two-Factor Authentication", level: 2, anchor: "two-factor" },
      { text: "Turn On Login Alerts", level: 2, anchor: "login-alerts" },
      { text: "Lock Down Privacy Settings", level: 2, anchor: "privacy-settings" },
      { text: "Remove App Permissions", level: 2, anchor: "app-permissions" },
      { text: "Limit Ad Tracking", level: 2, anchor: "ad-tracking" },
      { text: "Download Your Data", level: 2, anchor: "download-data" },
      { text: "Deactivate Your Account", level: 2, anchor: "deactivate" },
      { text: "Permanently Delete Your Account", level: 2, anchor: "delete-permanently" },
      { text: "What Happens After Deletion", level: 2, anchor: "after-deletion" },
    ],
    faq: [
      { question: "How do I know if my Facebook account has been hacked?", answer: "Check for unrecognized logins in Settings > Security and Login > Where You're Logged In. Look for posts, messages, or friend requests you didn't send. If your email or password was changed without your knowledge, use Facebook's account recovery at facebook.com/hacked." },
      { question: "What is the difference between deactivating and deleting Facebook?", answer: "Deactivating hides your profile but keeps your data. You can come back anytime by logging in. Deleting permanently removes your account and data after a 30-day grace period. After 30 days, deletion is irreversible." },
      { question: "How long does it take to permanently delete a Facebook account?", answer: "After you request deletion, Facebook gives you a 30-day window to change your mind. If you log back in during those 30 days, the deletion is cancelled. After 30 days, it takes up to 90 days for Facebook to remove all your data from their servers." },
      { question: "Can I download my Facebook data before deleting my account?", answer: "Yes, and you should. Go to Settings > Your Facebook Information > Download Your Information. Select the data you want (photos, posts, messages, etc.), choose the format and quality, and Facebook will prepare a file for you to download." },
    ],
    content: `Facebook has nearly 3 billion monthly active users, making it the world's largest social network. It is also one of the most targeted platforms for scams, data harvesting, and account takeovers. Whether you want to lock down your account or leave the platform entirely, this guide walks you through every step.

## Run Facebook's Security Checkup

Before changing individual settings, start with Facebook's built-in Security Checkup tool. This gives you a quick overview of your account's current security status.

1. Open Facebook and go to **Settings & Privacy > Settings**
2. Select **Security and Login** (or **Accounts Center > Password and Security**)
3. Click **Security Checkup** at the top of the page
4. Facebook will walk you through reviewing your password strength, active sessions, two-factor authentication, and login alerts

This takes about 2 minutes and flags the most important issues first.

## Set a Strong, Unique Password

Your Facebook password should be at least 12 characters long and completely different from any other password you use.

1. Go to **Settings > Security and Login > Change Password**
2. Enter your current password, then create a new one
3. Use a mix of uppercase letters, lowercase letters, numbers, and special characters
4. Do not reuse a password from any other website or app

Use our <a href="/password-generator">Password Generator</a> to create a strong password. Store it in a password manager rather than writing it down or saving it in your browser.

## Enable Two-Factor Authentication

Two-factor authentication (2FA) is the single most effective step you can take. Even if someone steals your password, they cannot access your account without your second factor.

1. Go to **Settings > Security and Login > Two-Factor Authentication**
2. Click **Edit** next to "Use two-factor authentication"
3. Choose your preferred method:
   - **Authentication app** (recommended) — use Google Authenticator, Authy, or Microsoft Authenticator
   - **Text message (SMS)** — less secure but better than nothing
   - **Security key** — a physical device like a YubiKey (most secure)
4. Follow the setup prompts and save your backup codes in a safe place

If you choose an authenticator app, you will scan a QR code with the app and enter the 6-digit code it generates. Save the backup codes Facebook gives you — these let you back in if you lose your phone.

## Turn On Login Alerts and Review Active Sessions

Login alerts notify you whenever someone accesses your account from a new device or browser.

1. Go to **Settings > Security and Login > Setting Up Extra Security**
2. Turn on **Get alerts about unrecognized logins**
3. Choose to receive alerts via Facebook notification, email, or both

Then review your active sessions:

1. Under **Where You're Logged In**, review every device and location listed
2. If you see any device or location you do not recognize, click the three dots next to it and select **Log Out**
3. If anything looks suspicious, select **Not You?** and follow the prompts to secure your account

## Lock Down Your Privacy Settings

Facebook's default privacy settings share more information than most people realize. Here is how to restrict them:

### Who Can See Your Posts
1. Go to **Settings > Privacy**
2. Set "Who can see your future posts?" to **Friends** (or **Only Me** for maximum privacy)
3. Click **Limit Past Posts** to change all previous public posts to Friends-only

### Who Can Find You
1. Set "Who can look you up using your email?" to **Friends** (or **Only Me**)
2. Set "Who can look you up using your phone number?" to **Friends** (or **Only Me**)
3. Set "Do you want search engines outside of Facebook to link to your profile?" to **No**

### Profile and Tagging
1. Go to **Settings > Profile and Tagging**
2. Set "Who can post on your profile?" to **Friends** or **Only Me**
3. Turn on **Review tags people add to your posts before they appear**
4. Turn on **Review posts you're tagged in before they appear on your profile**

### Friend Requests
1. Set "Who can send you friend requests?" to **Friends of Friends** instead of Everyone

## Remove Unnecessary App Permissions

Over the years, you may have connected dozens of apps and websites to your Facebook account. Each one has access to some of your data.

1. Go to **Settings > Apps and Websites**
2. Review every app listed under **Active**
3. Click **Remove** next to any app you no longer use or do not recognize
4. For apps you keep, click **View and Edit** to limit what data they can access

Pay special attention to apps that can access your friends list, email address, or post on your behalf. Remove anything you do not actively use.

## Limit Ad Tracking and Off-Facebook Activity

Facebook tracks your activity on other websites and apps to show you targeted ads. You can limit this.

### Off-Facebook Activity
1. Go to **Settings > Your Facebook Information > Off-Facebook Activity**
2. Click **Clear History** to remove past tracking data
3. Turn off **Future Off-Facebook Activity** to stop Facebook from receiving data about your activity on other sites

### Ad Preferences
1. Go to **Settings > Ad Preferences**
2. Under "Ad Settings," set all options to **Not Allowed**:
   - Ads based on data from partners: **Not Allowed**
   - Ads based on your activity on Facebook: **Not Allowed**
   - Social interactions in ads: **Only Me**
3. Under "Advertisers," review and remove advertisers you have interacted with

## Download All Your Facebook Data

Before making any major changes to your account, download a copy of everything Facebook has.

1. Go to **Settings > Your Facebook Information > Download Your Information**
2. Click **Request a download**
3. Select what you want:
   - **All available data** for a complete archive
   - Or select specific categories: Posts, Photos, Messages, Friends, Profile Information, etc.
4. Choose your format: **JSON** (machine-readable) or **HTML** (easier to browse)
5. Choose media quality: **High** for original-quality photos and videos
6. Click **Create File**
7. Facebook will notify you when the file is ready (this can take hours or days for large accounts)
8. Download the file from the same page and save it somewhere safe

This is especially important if you plan to deactivate or delete your account.

## How to Deactivate Your Facebook Account

Deactivating is temporary. Your profile disappears from Facebook, but your data is preserved. You can come back anytime by logging in.

1. Go to **Settings > Your Facebook Information**
2. Select **Deactivation and Deletion**
3. Choose **Deactivate Account** and click **Continue**
4. Facebook will ask why you are leaving — select any reason
5. You may need to enter your password to confirm
6. Click **Deactivate**

While deactivated:
- Your profile, posts, and photos are hidden from other users
- People cannot search for you or view your timeline
- Messenger still works (you can separately deactivate Messenger)
- Your data is fully preserved and waiting for you to return

To reactivate, simply log in with your email and password.

## How to Permanently Delete Your Facebook Account

Deletion is permanent. After the grace period, your account and all associated data are removed.

**Before you delete, make sure you have:**
- Downloaded your data (see the section above)
- Removed Facebook Login from any apps that use it for sign-in
- Saved any photos, messages, or contacts you want to keep
- Transferred admin rights for any Pages or Groups you manage

**To delete your account:**

1. Go to **Settings > Your Facebook Information**
2. Select **Deactivation and Deletion**
3. Choose **Permanently Delete Account** and click **Continue**
4. Click **Delete Account**, enter your password, and confirm

**The 30-day grace period:**
- If you log back in within 30 days, the deletion is cancelled and your account is restored
- After 30 days, the process is irreversible
- It takes up to 90 days after the 30-day period for Facebook to fully remove your data from all servers
- Some data (like messages you sent to other people) may remain visible to the recipients

## What Happens After Deletion

- Your profile, photos, posts, videos, and everything you added is permanently removed
- Other people will no longer be able to find or view your profile
- Some information (like messages sent to friends) remains in their accounts
- Facebook retains some data for legal, safety, and security purposes in anonymized form
- Apps that used Facebook Login will no longer work with your account

If you want to check whether your personal information is still appearing on data broker websites after leaving Facebook, use our <a href="/shield">GCR Data Shield</a> scanner to find and remove your data from over 500 broker sites.

For additional protection, use our <a href="/tools">AI Scam Checker</a> to verify suspicious emails, links, and messages you receive on any platform.`,
  },

  {
    slug: "how-to-secure-instagram-account-privacy-settings",
    title: "How to Secure Your Instagram Account: Privacy, Safety & Deletion Guide",
    metaDescription: "Complete guide to securing your Instagram account. Set up two-factor authentication, manage privacy settings, control who sees your content, download your data, and delete your account.",
    category: "social-media-security",
    cluster: "social-media-security",
    tags: ["Instagram security", "Instagram privacy", "secure Instagram account", "delete Instagram", "Instagram two-factor authentication", "Instagram data download"],
    targetKeywords: ["how to secure Instagram account", "Instagram privacy settings 2026", "delete Instagram account permanently", "Instagram two-factor authentication", "download Instagram data"],
    wordCount: 2200,
    readingTimeMinutes: 11,
    headings: [
      { id: "password-security", text: "Set a Strong Password", level: 2 },
      { id: "two-factor", text: "Enable Two-Factor Authentication", level: 2 },
      { id: "login-activity", text: "Review Login Activity", level: 2 },
      { id: "privacy-settings", text: "Lock Down Your Privacy Settings", level: 2 },
      { id: "control-interactions", text: "Control Who Can Interact With You", level: 2 },
      { id: "connected-apps", text: "Remove Connected Apps", level: 2 },
      { id: "download-data", text: "Download Your Instagram Data", level: 2 },
      { id: "deactivate", text: "How to Temporarily Disable Your Account", level: 2 },
      { id: "delete-permanently", text: "How to Permanently Delete Your Instagram Account", level: 2 },
    ],
    tableOfContents: [
      { text: "Set a Strong Password", level: 2, anchor: "password-security" },
      { text: "Enable Two-Factor Authentication", level: 2, anchor: "two-factor" },
      { text: "Review Login Activity", level: 2, anchor: "login-activity" },
      { text: "Lock Down Privacy Settings", level: 2, anchor: "privacy-settings" },
      { text: "Control Interactions", level: 2, anchor: "control-interactions" },
      { text: "Remove Connected Apps", level: 2, anchor: "connected-apps" },
      { text: "Download Your Data", level: 2, anchor: "download-data" },
      { text: "Temporarily Disable Your Account", level: 2, anchor: "deactivate" },
      { text: "Permanently Delete Your Account", level: 2, anchor: "delete-permanently" },
    ],
    faq: [
      { question: "Should I make my Instagram account private?", answer: "Yes, especially if you are under 18 or do not want strangers viewing your content. A private account means only approved followers can see your posts, stories, and Reels. Your profile photo, username, and bio remain visible to everyone." },
      { question: "How do I know if someone hacked my Instagram?", answer: "Warning signs include unexpected password changes, posts or messages you did not create, unfamiliar login locations in your Login Activity, and followers or following changes you did not make. Go to Settings > Security > Login Activity to check." },
      { question: "Can I recover my Instagram account after deleting it?", answer: "No. Once you permanently delete your account and the 30-day grace period passes, the deletion is irreversible. Your username, photos, videos, comments, and followers are gone permanently. Temporarily disabling is reversible, but deletion is not." },
      { question: "Does Instagram keep my data after I delete my account?", answer: "Instagram removes your content from public view immediately. Full deletion from their servers takes up to 90 days. Some data, like messages you sent to other users, remains in their conversations." },
    ],
    content: `Instagram has over 2 billion monthly active users and is one of the most popular platforms for sharing photos, videos, and stories. It is also a common target for scams, impersonation, and phishing attacks. This guide covers everything from securing your account to permanently deleting it.

## Set a Strong Password

Your Instagram password should be unique and not shared with any other account, especially your email or Facebook.

1. Open Instagram and go to **Settings > Accounts Center > Password and Security > Change Password**
2. Choose a password at least 12 characters long
3. Include uppercase letters, lowercase letters, numbers, and special characters
4. Do not use your name, birthday, or common words

Use our <a href="/password-generator">Password Generator</a> to create a strong, random password.

## Enable Two-Factor Authentication

This is the most important security step. With 2FA enabled, anyone trying to log into your account needs both your password and a verification code.

1. Go to **Settings > Accounts Center > Password and Security > Two-Factor Authentication**
2. Select your Instagram account
3. Choose your method:
   - **Authentication app** (recommended) — Google Authenticator, Authy, or similar
   - **Text message (SMS)** — your phone receives a code via text
   - **WhatsApp** — receive codes via WhatsApp
4. Follow the setup instructions
5. Save the backup codes Instagram provides in a secure location

## Review Login Activity

Check where your account is currently logged in and remove any sessions you do not recognize.

1. Go to **Settings > Accounts Center > Password and Security > Where You're Logged In**
2. Review every device and location
3. Tap any session you do not recognize and select **Log Out**
4. If you see suspicious activity, change your password immediately

## Lock Down Your Privacy Settings

### Switch to a Private Account
1. Go to **Settings > Account Privacy**
2. Turn on **Private Account**
3. Only approved followers will see your posts, stories, and Reels

### Control Your Story Sharing
1. Go to **Settings > Privacy > Story**
2. Turn off **Allow Sharing** if you do not want people forwarding your stories
3. Use **Close Friends** to share sensitive stories with a smaller audience
4. Turn off **Allow Sharing to Facebook** if you do not want stories cross-posted

### Hide Your Activity Status
1. Go to **Settings > Privacy > Activity Status**
2. Turn off **Show Activity Status** so others cannot see when you were last online

### Manage Sensitive Content
1. Go to **Settings > Content Preferences > Sensitive Content Control**
2. Choose **Less** to reduce exposure to sensitive content in Explore and Reels

## Control Who Can Interact With You

### Comments
1. Go to **Settings > Privacy > Comments**
2. Turn on **Manual Filter** and add words you want blocked from your comments
3. Choose who can comment: Everyone, People You Follow, or Followers

### Messages
1. Go to **Settings > Privacy > Messages**
2. Under "Other people on Instagram," choose **Don't Receive Requests** to block messages from strangers
3. Turn off **Allow Message Requests in group chats** from strangers

### Tags and Mentions
1. Go to **Settings > Privacy > Tags**
2. Set "Allow Tags From" to **People You Follow** or **No One**
3. Turn on **Manually Approve Tags** before they appear on your profile
4. Go to **Privacy > Mentions** and set to **People You Follow** or **No One**

## Remove Connected Apps

1. Go to **Settings > Security > Apps and Websites**
2. Review all apps under **Active**
3. Remove any app you do not use or recognize by tapping **Remove**
4. Check **Expired** and **Removed** tabs to review past access

## Download Your Instagram Data

Before disabling or deleting your account, download everything.

1. Go to **Settings > Accounts Center > Your Information and Permissions > Download Your Information**
2. Select your Instagram account
3. Choose **Complete Copy** or select specific data types
4. Pick format: **HTML** (easy to browse) or **JSON** (machine-readable)
5. Click **Request a Download**
6. Instagram will email you a link when the file is ready (this may take up to 48 hours)
7. Download and save the file to a safe location

## How to Temporarily Disable Your Account

Disabling hides your profile, photos, comments, and likes until you log back in. Your data is preserved.

1. Log in to Instagram on a web browser (instagram.com) — this cannot be done from the app
2. Go to your profile and click **Edit Profile**
3. Scroll down and click **Temporarily disable my account**
4. Select a reason from the dropdown menu
5. Re-enter your password and click **Temporarily Disable Account**

To reactivate, simply log back in through the app or website.

## How to Permanently Delete Your Instagram Account

Deletion removes your profile, photos, videos, comments, likes, and followers permanently.

**Before you delete:**
- Download your data (see above)
- Remove Instagram Login from any apps that use it
- Save any photos or videos you want to keep
- Transfer ownership of any business pages

**To delete:**

1. Visit Instagram's account deletion page: instagram.com/accounts/remove/request/permanent/
2. Log in if prompted
3. Select a reason for leaving
4. Re-enter your password
5. Click **Delete [username]**

Instagram provides a 30-day grace period. If you log in during those 30 days, the deletion is cancelled. After 30 days, your account and data are permanently removed, though full deletion from servers can take up to 90 days.

To check if your personal data is still circulating online after leaving Instagram, use our <a href="/shield">GCR Data Shield</a> to scan 500+ data broker sites. Use our <a href="/tools">AI Scam Checker</a> to verify any suspicious messages you receive.`,
  },

  {
    slug: "how-to-secure-x-twitter-account-privacy-settings",
    title: "How to Secure Your X (Twitter) Account: Privacy, Safety & Deletion Guide",
    metaDescription: "Step-by-step guide to securing your X (Twitter) account. Enable two-factor authentication, manage privacy settings, control DMs, download your data, and delete your account permanently.",
    category: "social-media-security",
    cluster: "social-media-security",
    tags: ["X security", "Twitter security", "Twitter privacy settings", "secure Twitter account", "delete Twitter account", "X two-factor authentication"],
    targetKeywords: ["how to secure X Twitter account", "Twitter privacy settings 2026", "delete X account permanently", "Twitter two-factor authentication", "download Twitter data"],
    wordCount: 2000,
    readingTimeMinutes: 10,
    headings: [
      { id: "password-security", text: "Set a Strong Password", level: 2 },
      { id: "two-factor", text: "Enable Two-Factor Authentication", level: 2 },
      { id: "connected-apps", text: "Review Connected Apps and Sessions", level: 2 },
      { id: "privacy-settings", text: "Lock Down Your Privacy Settings", level: 2 },
      { id: "dm-safety", text: "Secure Your Direct Messages", level: 2 },
      { id: "ad-tracking", text: "Limit Data Sharing and Ad Tracking", level: 2 },
      { id: "download-data", text: "Download Your X Data Archive", level: 2 },
      { id: "deactivate-delete", text: "How to Deactivate and Delete Your Account", level: 2 },
    ],
    tableOfContents: [
      { text: "Set a Strong Password", level: 2, anchor: "password-security" },
      { text: "Enable Two-Factor Authentication", level: 2, anchor: "two-factor" },
      { text: "Review Connected Apps", level: 2, anchor: "connected-apps" },
      { text: "Lock Down Privacy Settings", level: 2, anchor: "privacy-settings" },
      { text: "Secure Your Direct Messages", level: 2, anchor: "dm-safety" },
      { text: "Limit Data Sharing", level: 2, anchor: "ad-tracking" },
      { text: "Download Your Data", level: 2, anchor: "download-data" },
      { text: "Deactivate and Delete", level: 2, anchor: "deactivate-delete" },
    ],
    faq: [
      { question: "Is two-factor authentication on X still free?", answer: "SMS-based 2FA is only available to X Premium (paid) subscribers. However, authentication app (TOTP) and security key methods are free for everyone and are more secure than SMS anyway." },
      { question: "What happens when I deactivate my X account?", answer: "Your profile, tweets, likes, and followers are hidden from public view. X keeps your data for 30 days in case you change your mind. After 30 days, the account is permanently deleted. To reactivate, just log in within the 30-day window." },
      { question: "Can I make my X account fully private?", answer: "Yes. Enable 'Protect your posts' in privacy settings. Only approved followers will see your tweets, replies, and likes. Your profile bio and header remain visible. Existing followers are not removed — you can manually remove them." },
      { question: "Does X sell my data to third parties?", answer: "X shares data with advertising partners and uses your activity for ad targeting. You can limit this in Settings > Privacy and Safety > Data Sharing and Personalization by turning off personalization and location-based ads." },
    ],
    content: `X (formerly Twitter) is one of the most public social media platforms. Posts are public by default, and the platform has been a frequent target for phishing, impersonation, and account takeovers. Whether you want to secure your presence or leave the platform, this guide covers every step.

## Set a Strong Password

1. Go to **Settings > Your Account > Change Your Password**
2. Create a password at least 12 characters long
3. Use a mix of uppercase, lowercase, numbers, and special characters
4. Never reuse a password from another site

Use our <a href="/password-generator">Password Generator</a> to create a strong, unique password.

## Enable Two-Factor Authentication

Two-factor authentication prevents unauthorized access even if your password is stolen.

1. Go to **Settings > Security and Account Access > Security > Two-Factor Authentication**
2. Choose your method:
   - **Authentication app** (recommended, free) — use Google Authenticator, Authy, or similar
   - **Security key** (most secure, free) — use a YubiKey or similar device
   - **Text message / SMS** — only available to X Premium subscribers
3. Follow the prompts to complete setup
4. Save your backup code in a secure location

## Review Connected Apps and Sessions

1. Go to **Settings > Security and Account Access > Apps and Sessions**
2. Under **Connected Apps**, remove any app you no longer use or do not recognize
3. Under **Sessions**, review all active sessions
4. Log out of any session you do not recognize
5. Under **Account Access History**, check for unfamiliar logins

## Lock Down Your Privacy Settings

### Protect Your Posts
1. Go to **Settings > Privacy and Safety > Audience and Tagging**
2. Turn on **Protect your posts** to make your tweets visible only to approved followers
3. Uncheck **Allow photo tagging** or set to **Only people you follow**

### Discoverability
1. Under **Privacy and Safety > Discoverability and Contacts**
2. Turn off **Let others find you by your email address**
3. Turn off **Let others find you by your phone number**

### Location
1. Under **Privacy and Safety > Location Information**
2. Turn off **Personalize based on places you've been**
3. Delete any stored location data

### Content You See
1. Under **Privacy and Safety > Content You See**
2. Review topics and interests — remove any that do not match your actual interests to reduce unwanted targeting

## Secure Your Direct Messages

1. Under **Privacy and Safety > Direct Messages**
2. Turn off **Allow message requests from everyone** to restrict DMs to people you follow
3. Turn on **Filter low-quality messages** to catch spam
4. Enable **Encrypted messages** when messaging other users who have it enabled

Be cautious of DMs containing links, especially from accounts you do not know. Use our <a href="/tools">AI Scam Checker</a> to verify suspicious links before clicking.

## Limit Data Sharing and Ad Tracking

1. Go to **Settings > Privacy and Safety > Data Sharing and Personalization**
2. Turn off **Personalize based on your inferred identity**
3. Turn off **Personalize ads**
4. Under **Inferred identity**, turn off all options
5. Under **Data sharing with business partners**, turn off **Allow additional information sharing**

## Download Your X Data Archive

1. Go to **Settings > Your Account > Download an Archive of Your Data**
2. Click **Request Archive**
3. Verify your identity (password and/or 2FA code)
4. X will email you when your archive is ready (usually within 24 hours)
5. Return to the same settings page and click **Download Archive**
6. Save the ZIP file in a secure location

The archive includes your tweets, DMs, profile information, ad data, and more.

## How to Deactivate and Delete Your Account

X combines deactivation and deletion into one process. When you deactivate, X waits 30 days, then permanently deletes your account.

**Before you deactivate:**
- Download your data archive
- Remove X Login from any apps that use it
- Save any content you want to keep
- Update your email preferences to avoid post-deletion emails

**To deactivate:**

1. Go to **Settings > Your Account > Deactivate Your Account**
2. Read the information about what happens
3. Click **Deactivate**
4. Enter your password to confirm

**The 30-day window:**
- Your profile and tweets are immediately hidden from public view
- If you log in within 30 days, your account is fully restored
- After 30 days, the account is permanently deleted
- It may take additional time for content to disappear from search engines and X's servers

After leaving X, use our <a href="/shield">GCR Data Shield</a> to check if your personal information remains on data broker sites. Run a scan to find and remove your data from 500+ sources.`,
  },

  {
    slug: "how-to-secure-tiktok-account-privacy-settings",
    title: "How to Secure Your TikTok Account: Privacy, Safety & Deletion Guide",
    metaDescription: "Complete guide to securing your TikTok account. Set up two-factor authentication, manage privacy settings, restrict who can interact with you, download your data, and delete your account.",
    category: "social-media-security",
    cluster: "social-media-security",
    tags: ["TikTok security", "TikTok privacy", "secure TikTok account", "delete TikTok account", "TikTok parental controls", "TikTok data download"],
    targetKeywords: ["how to secure TikTok account", "TikTok privacy settings 2026", "delete TikTok account permanently", "TikTok two-factor authentication", "TikTok Family Pairing"],
    wordCount: 2000,
    readingTimeMinutes: 10,
    headings: [
      { id: "password-security", text: "Set a Strong Password", level: 2 },
      { id: "two-factor", text: "Enable Two-Factor Authentication", level: 2 },
      { id: "privacy-settings", text: "Lock Down Your Privacy Settings", level: 2 },
      { id: "control-interactions", text: "Control Who Can Interact With You", level: 2 },
      { id: "family-pairing", text: "Set Up Family Pairing for Kids", level: 2 },
      { id: "download-data", text: "Download Your TikTok Data", level: 2 },
      { id: "deactivate-delete", text: "How to Deactivate or Delete Your Account", level: 2 },
    ],
    tableOfContents: [
      { text: "Set a Strong Password", level: 2, anchor: "password-security" },
      { text: "Enable Two-Factor Authentication", level: 2, anchor: "two-factor" },
      { text: "Lock Down Privacy Settings", level: 2, anchor: "privacy-settings" },
      { text: "Control Interactions", level: 2, anchor: "control-interactions" },
      { text: "Set Up Family Pairing", level: 2, anchor: "family-pairing" },
      { text: "Download Your Data", level: 2, anchor: "download-data" },
      { text: "Deactivate or Delete Your Account", level: 2, anchor: "deactivate-delete" },
    ],
    faq: [
      { question: "Is TikTok safe for kids?", answer: "TikTok can be made safer for kids using Restricted Mode and Family Pairing. Accounts for users under 16 are set to private by default. However, content moderation is imperfect, and kids may still encounter inappropriate content. Active parental monitoring is recommended." },
      { question: "How do I make my TikTok account private?", answer: "Go to Settings > Privacy, then turn on Private Account. Only approved followers will be able to see your videos. Your profile photo, username, and bio remain visible to everyone." },
      { question: "Does TikTok keep my data after I delete my account?", answer: "TikTok states that account deletion is permanent after the 30-day deactivation period. Your videos, likes, and profile information are removed. Some data may be retained for legal compliance. Content you shared via other platforms remains on those platforms." },
      { question: "Can I recover a deleted TikTok account?", answer: "You have 30 days after deactivation to recover your account by logging back in. After 30 days, the account and all associated data are permanently deleted and cannot be recovered." },
    ],
    content: `TikTok has over 1.5 billion monthly active users, with a particularly large audience of younger users. The platform's algorithmic content recommendation system and extensive data collection practices make privacy settings especially important. This guide walks you through securing your account and managing your data.

## Set a Strong Password

1. Open TikTok and go to **Settings > Manage Account > Password**
2. If you signed up with a phone number or social login, you may need to set a password first
3. Create a password at least 12 characters long with a mix of character types
4. Never reuse a password from another service

Use our <a href="/password-generator">Password Generator</a> to create a secure password.

## Enable Two-Factor Authentication

1. Go to **Settings > Security > 2-Step Verification**
2. Choose your verification methods (you can enable multiple):
   - **SMS** — receive a code via text message
   - **Email** — receive a code at your registered email
   - **Authenticator app** — use Google Authenticator or similar (most secure)
3. Follow the setup steps for each method
4. Make sure you have at least two methods enabled in case one fails

## Lock Down Your Privacy Settings

### Private Account
1. Go to **Settings > Privacy**
2. Turn on **Private Account**
3. Only approved followers can see your videos

### Suggest Your Account to Others
1. Under **Privacy > Suggest your account to others**
2. Turn off all options to prevent TikTok from recommending your profile to strangers

### Sync Contacts and Facebook Friends
1. Under **Privacy**, turn off **Sync Contacts**
2. Turn off **Sync Facebook Friends**
3. This prevents TikTok from matching your phone contacts or Facebook friends to TikTok accounts

### Activity Status
1. Turn off **Activity Status** to hide when you were last active

## Control Who Can Interact With You

### Comments
1. Go to **Privacy > Comments**
2. Set to **Friends** or **No One** to restrict who can comment on your videos
3. Enable **Filter Comments** and add keywords you want blocked

### Direct Messages
1. Go to **Privacy > Direct Messages**
2. Set to **Friends** or **No One**
3. Accounts under 16 have DMs disabled by default

### Duets, Stitches, and Downloads
1. Set **Who can Duet with your videos** to **Friends** or **No One**
2. Set **Who can Stitch with your videos** to **Friends** or **No One**
3. Turn off **Allow your videos to be downloaded** if you do not want people saving your content

### Likes
1. Under **Privacy > Likes**, turn off **Who can see the videos that I've liked** if you want your liked videos hidden

## Set Up Family Pairing for Kids

If your child uses TikTok, Family Pairing lets you link your account to theirs and control their settings remotely.

1. Open TikTok on your phone and go to **Settings > Family Pairing**
2. Select **Parent** on your device
3. A QR code will appear
4. On your child's device, go to **Settings > Family Pairing** and select **Teen**
5. Scan the QR code with your child's phone

With Family Pairing, you can:
- Set daily screen time limits
- Restrict or turn off Direct Messages
- Enable Restricted Mode to filter mature content
- Control who can see their liked videos, following list, and profile
- Manage search preferences

## Download Your TikTok Data

1. Go to **Settings > Account > Download Your Data**
2. Choose your data format: **TXT**, **JSON**, or **HTML**
3. Select the data you want (or choose all)
4. Tap **Request Data**
5. TikTok will notify you when the file is ready (usually within a few days)
6. Return to the same page and tap **Download Data**
7. Save the file securely

The download includes your profile information, videos, comments, messages, search history, and more.

## How to Deactivate or Delete Your Account

### Deactivate (Temporary)
1. Go to **Settings > Manage Account > Deactivate or Delete Account**
2. Select **Deactivate Account**
3. Your account is hidden but preserved for 30 days
4. Log back in within 30 days to reactivate

### Delete (Permanent)
1. Go to **Settings > Manage Account > Deactivate or Delete Account**
2. Select **Delete Account**
3. TikTok will verify your identity (password, SMS, or email code)
4. Confirm the deletion

Your account enters a 30-day deactivation period. If you do not log back in during those 30 days, the account and all data are permanently deleted. Your videos, profile, messages, and followers are removed.

After deleting your account, use our <a href="/shield">GCR Data Shield</a> to scan for personal data still available on data broker websites. Use our <a href="/tools">AI Scam Checker</a> to check any suspicious messages or links.`,
  },

  {
    slug: "how-to-secure-linkedin-account-privacy-settings",
    title: "How to Secure Your LinkedIn Account: Privacy, Safety & Deletion Guide",
    metaDescription: "Step-by-step guide to securing your LinkedIn account. Manage privacy and visibility settings, enable two-factor authentication, limit data sharing, download your data, and close your account.",
    category: "social-media-security",
    cluster: "social-media-security",
    tags: ["LinkedIn security", "LinkedIn privacy", "secure LinkedIn account", "close LinkedIn account", "LinkedIn two-factor authentication", "LinkedIn data export"],
    targetKeywords: ["how to secure LinkedIn account", "LinkedIn privacy settings 2026", "close LinkedIn account permanently", "LinkedIn two-factor authentication", "download LinkedIn data"],
    wordCount: 2000,
    readingTimeMinutes: 10,
    headings: [
      { id: "password-security", text: "Set a Strong Password", level: 2 },
      { id: "two-factor", text: "Enable Two-Step Verification", level: 2 },
      { id: "active-sessions", text: "Review Active Sessions", level: 2 },
      { id: "profile-visibility", text: "Control Your Profile Visibility", level: 2 },
      { id: "data-privacy", text: "Manage Data Privacy and Advertising", level: 2 },
      { id: "connection-safety", text: "Protect Against LinkedIn Scams", level: 2 },
      { id: "download-data", text: "Download Your LinkedIn Data", level: 2 },
      { id: "close-account", text: "How to Close Your LinkedIn Account", level: 2 },
    ],
    tableOfContents: [
      { text: "Set a Strong Password", level: 2, anchor: "password-security" },
      { text: "Enable Two-Step Verification", level: 2, anchor: "two-factor" },
      { text: "Review Active Sessions", level: 2, anchor: "active-sessions" },
      { text: "Control Profile Visibility", level: 2, anchor: "profile-visibility" },
      { text: "Manage Data Privacy", level: 2, anchor: "data-privacy" },
      { text: "Protect Against LinkedIn Scams", level: 2, anchor: "connection-safety" },
      { text: "Download Your Data", level: 2, anchor: "download-data" },
      { text: "Close Your Account", level: 2, anchor: "close-account" },
    ],
    faq: [
      { question: "What are the most common LinkedIn scams?", answer: "The most common LinkedIn scams include fake job offers, phishing messages from fake recruiters, romance scams, crypto investment schemes, and connection requests from fake profiles. Always verify that a person's profile and company exist before sharing personal information or clicking links." },
      { question: "Can I make my LinkedIn profile invisible?", answer: "You can limit visibility significantly. Turn off public profile visibility, restrict who can see your connections and activity, and browse in private mode. However, some profile information must remain visible to your connections for the platform to function." },
      { question: "What happens when I close my LinkedIn account?", answer: "LinkedIn deactivates your account immediately. Your profile, connections, messages, endorsements, and recommendations are removed. LinkedIn states it may take up to 30 days to fully process. After closing, you can reopen within a limited time, but most data is permanently lost." },
      { question: "Does LinkedIn share my data with employers?", answer: "LinkedIn does not directly share your data with employers unless you apply for a job through the platform. However, recruiters can search for and view your profile based on your visibility settings. Premium recruiters have access to additional data points." },
    ],
    content: `LinkedIn has over 900 million members and is the largest professional networking platform in the world. Because profiles contain employment history, education, skills, and professional connections, LinkedIn accounts are high-value targets for scammers, data harvesters, and social engineers.

## Set a Strong Password

1. Go to **Settings > Sign In & Security > Change Password**
2. Create a password at least 12 characters long
3. Use a mix of uppercase, lowercase, numbers, and special characters
4. Do not use any information from your LinkedIn profile (company name, job title, etc.) in your password

Use our <a href="/password-generator">Password Generator</a> to create a strong, unique password.

## Enable Two-Step Verification

1. Go to **Settings > Sign In & Security > Two-Step Verification**
2. Click **Turn On**
3. Choose your method:
   - **Authenticator app** (recommended) — Google Authenticator, Authy, or similar
   - **Phone number (SMS)** — receive a code via text
4. Follow the setup prompts
5. Save your recovery codes securely

## Review Active Sessions

1. Go to **Settings > Sign In & Security > Where You're Signed In**
2. Review all active sessions
3. Sign out of any device or location you do not recognize
4. If you see suspicious activity, change your password immediately

## Control Your Profile Visibility

### Public Profile
1. Go to **Settings > Visibility > Edit Your Public Profile**
2. Toggle off **Your profile's public visibility** to hide your profile from search engines
3. Or selectively choose which sections are visible (photo, headline, summary, experience, etc.)

### Profile Viewing Options
1. Under **Visibility > Profile Viewing Options**, choose how you appear when viewing other profiles:
   - **Your name and headline** — full transparency
   - **Private profile characteristics** — shows industry and title but not your name
   - **Private mode** — completely anonymous browsing

### Connections
1. Under **Visibility > Who can see your connections**, set to **Only you**
2. This prevents others from browsing your connection list (a common tactic in social engineering)

### Active Status
1. Under **Visibility > Manage Active Status**, turn off to hide when you are online

### Email and Phone
1. Under **Visibility > Who can see your email address**, set to **Only visible to me** or **1st-degree connections**
2. Under **Visibility > Who can see your phone number**, set to **Only visible to me**

## Manage Data Privacy and Advertising

### Ad Targeting
1. Go to **Settings > Advertising Data**
2. Turn off:
   - **Profile data for ad personalization**
   - **Interest categories**
   - **Data collected on third-party sites**
   - **Connections data for ad personalization**

### Data Sharing
1. Go to **Settings > Data Privacy**
2. Review and turn off:
   - **Get more relevant search results using your activity** — turn off for less tracking
   - **Share job activity with recruiters** — disable if you do not want recruiters seeing you viewed their jobs

## Protect Against LinkedIn Scams

LinkedIn scams are increasing rapidly. Here is how to protect yourself:

1. **Verify connection requests.** Do not accept requests from people you do not know. Check their profile for signs of a fake account: stock photo, minimal connections, no activity, or a recently created profile.
2. **Be wary of job offers that seem too good to be true.** Legitimate recruiters will not ask for payment, personal financial information, or your Social Security number before an interview.
3. **Do not click links in LinkedIn messages** from people you do not know. Phishing links are common. Use our <a href="/tools">AI Scam Checker</a> to verify suspicious links.
4. **Watch for romance and investment scams.** Scammers build professional-looking profiles to gain trust, then push cryptocurrency investments or romantic connections.
5. **Report suspicious profiles and messages** using the three-dot menu on any profile or message.

## Download Your LinkedIn Data

1. Go to **Settings > Data Privacy > Get a Copy of Your Data**
2. Choose **Want something in particular?** to select specific categories, or select **Download larger data archive**
3. Click **Request Archive**
4. LinkedIn will email you when the file is ready (usually within 24 hours)
5. Download the ZIP file from the provided link
6. Save it in a secure location

The archive includes your profile data, connections, messages, skills, endorsements, and more.

## How to Close Your LinkedIn Account

**Before closing:**
- Download your data archive
- Save any important messages or connections
- Remove LinkedIn Login from any apps that use it
- If you have LinkedIn Premium, cancel your subscription first

**To close your account:**

1. Go to **Settings > Account Management > Close Account**
2. Select a reason for closing
3. Click **Next**
4. Review the consequences and click **Close Account**
5. Enter your password to confirm

LinkedIn will deactivate your account immediately. Your profile, connections, messages, and all associated content are removed. LinkedIn states the process takes up to 30 days to complete fully.

After closing your account, use our <a href="/shield">GCR Data Shield</a> to scan data broker sites for your professional information. LinkedIn data frequently appears on people-search and background-check sites.`,
  },

  {
    slug: "how-to-secure-whatsapp-account-privacy-settings",
    title: "How to Secure Your WhatsApp Account: Privacy, Safety & Deletion Guide",
    metaDescription: "Complete guide to securing your WhatsApp account. Enable two-step verification, manage privacy settings, control group additions, back up and export your data, and delete your account.",
    category: "social-media-security",
    cluster: "social-media-security",
    tags: ["WhatsApp security", "WhatsApp privacy", "secure WhatsApp account", "delete WhatsApp account", "WhatsApp two-step verification", "WhatsApp data export"],
    targetKeywords: ["how to secure WhatsApp account", "WhatsApp privacy settings 2026", "delete WhatsApp account permanently", "WhatsApp two-step verification", "WhatsApp safety tips"],
    wordCount: 1800,
    readingTimeMinutes: 9,
    headings: [
      { id: "two-step", text: "Enable Two-Step Verification", level: 2 },
      { id: "privacy-settings", text: "Lock Down Your Privacy Settings", level: 2 },
      { id: "group-safety", text: "Control Group Additions", level: 2 },
      { id: "scam-protection", text: "Protect Against WhatsApp Scams", level: 2 },
      { id: "backup-export", text: "Back Up and Export Your Data", level: 2 },
      { id: "delete-account", text: "How to Delete Your WhatsApp Account", level: 2 },
    ],
    tableOfContents: [
      { text: "Enable Two-Step Verification", level: 2, anchor: "two-step" },
      { text: "Lock Down Privacy Settings", level: 2, anchor: "privacy-settings" },
      { text: "Control Group Additions", level: 2, anchor: "group-safety" },
      { text: "Protect Against Scams", level: 2, anchor: "scam-protection" },
      { text: "Back Up and Export Data", level: 2, anchor: "backup-export" },
      { text: "Delete Your Account", level: 2, anchor: "delete-account" },
    ],
    faq: [
      { question: "Are WhatsApp messages really encrypted?", answer: "Yes, WhatsApp uses end-to-end encryption for all personal messages, calls, photos, and videos by default. This means only you and the person you are communicating with can read the messages. However, backups stored on Google Drive or iCloud are not end-to-end encrypted by default — you need to enable encrypted backups separately." },
      { question: "Can someone hack my WhatsApp?", answer: "The most common attack is SIM swapping, where a scammer convinces your phone carrier to transfer your number to their SIM card. With two-step verification enabled, they would still need your PIN. Never share the 6-digit SMS verification code with anyone — WhatsApp will never ask you for it." },
      { question: "What happens when I delete my WhatsApp account?", answer: "Deleting your account permanently removes your profile, messages, groups, and chat history from your phone. You are removed from all groups. Your contacts will still see messages you previously sent. Your phone number may become available for another user to register after some time." },
      { question: "Does WhatsApp share my data with Facebook/Meta?", answer: "WhatsApp shares certain data with Meta, including your phone number, device information, usage patterns, and transaction data. Message content remains encrypted and is not shared. You cannot fully opt out of data sharing with Meta, but you can limit it in your privacy settings." },
    ],
    content: `WhatsApp is the world's most popular messaging app with over 2 billion users. Because it is tied to your phone number and used for personal conversations, financial discussions, and increasingly for business, securing your WhatsApp account is essential.

## Enable Two-Step Verification

This is the most important security step for WhatsApp. It adds a PIN that is required whenever your phone number is registered on WhatsApp again.

1. Open WhatsApp and go to **Settings > Account > Two-Step Verification**
2. Tap **Enable**
3. Create a 6-digit PIN that you will remember
4. Add an email address for recovery (in case you forget your PIN)
5. Confirm the email address

With this enabled, even if someone steals your phone number through a SIM swap attack, they cannot activate WhatsApp on their device without your PIN.

**Important:** Never share the 6-digit SMS verification code that WhatsApp sends when registering. Scammers often call or text pretending to be a friend or WhatsApp support, asking for this code. Sharing it gives them complete access to your account.

## Lock Down Your Privacy Settings

1. Go to **Settings > Privacy**

### Profile Photo, About, and Last Seen
- Set **Last Seen & Online** to **My Contacts** or **Nobody**
- Set **Profile Photo** to **My Contacts** or **Nobody**
- Set **About** to **My Contacts** or **Nobody**

### Status Privacy
- Set **Status** to **My Contacts** to prevent strangers from seeing your status updates
- Or choose **My Contacts Except** to exclude specific people

### Read Receipts
- Turn off **Read Receipts** (blue ticks) if you do not want others knowing when you read their messages
- Note: this also hides read receipts for messages you send to others

### Fingerprint or Face Lock
- Under **Privacy > App Lock**, enable biometric lock
- Set the lock to activate after 1 minute of inactivity
- This prevents someone from reading your messages if they have physical access to your unlocked phone

## Control Group Additions

By default, anyone who has your phone number can add you to a group without your permission.

1. Go to **Settings > Privacy > Groups**
2. Change from **Everyone** to **My Contacts** or **My Contacts Except**
3. When set to **My Contacts**, people not in your contacts must send you an invitation link instead of directly adding you

This is especially important for preventing spam groups and scam groups.

## Protect Against WhatsApp Scams

WhatsApp scams are increasingly sophisticated. Here are the most common ones and how to avoid them:

### Verification Code Scam
A scammer calls or messages you (often pretending to be a friend) asking you to forward a 6-digit code you just received via SMS. This code is your WhatsApp verification code. **Never share it with anyone.**

### Impersonation / "Hi Mum" Scam
You receive a message from an unknown number claiming to be a family member with a new phone, urgently asking for money. Always verify by calling the person at their known number before sending money.

### Fake Prize and Lottery Messages
Messages claiming you have won a prize and need to click a link or pay a fee. These are always scams. WhatsApp and Meta do not run lotteries.

### Investment and Crypto Groups
Being added to groups promoting guaranteed returns on investments. These are scam schemes. Leave and block immediately.

### Deepfake Video Calls
Scammers using AI-generated video to impersonate someone you know during a video call, typically to request money. If something feels off about a video call, hang up and call the person directly.

Use our <a href="/tools">AI Scam Checker</a> to verify suspicious messages, links, or phone numbers you receive on WhatsApp.

## Back Up and Export Your Data

### Chat Backup
1. Go to **Settings > Chats > Chat Backup**
2. Tap **Back Up** to create a backup to Google Drive (Android) or iCloud (iPhone)
3. Enable **End-to-End Encrypted Backup** and set a password or 64-digit encryption key

**Critical privacy warning:** If you do not enable end-to-end encrypted backup, your message history is not protected by WhatsApp's encryption once it reaches the cloud. This means the cloud provider (Google or Apple), anyone with legal access to your cloud account, or anyone who compromises it can read your backed-up messages. Always enable encrypted backup to keep your conversations private.

### Export Individual Chats
1. Open the chat you want to export
2. Tap the contact or group name at the top
3. Scroll down and select **Export Chat**
4. Choose whether to include media
5. Save or share the exported file

### Request Account Info
1. Go to **Settings > Account > Request Account Info**
2. Tap **Request Report**
3. WhatsApp will prepare a report of your account settings and data (this takes about 3 days)
4. Download the report from the same page when ready

## How to Delete Your WhatsApp Account

**Before deleting:**
- Export any chats you want to keep
- Download your account info report
- Inform important contacts you are leaving
- If you use WhatsApp Business, handle any pending customer conversations

**To delete your account:**

1. Go to **Settings > Account > Delete My Account**
2. Enter your phone number in full international format
3. Select a reason for leaving
4. Tap **Delete My Account**

**What happens after deletion:**
- Your account is removed from WhatsApp immediately
- Your profile, messages, and media are deleted from your phone
- You are removed from all groups
- Your chat history is deleted and cannot be recovered
- Messages you previously sent remain visible to the recipients
- Backed-up data on Google Drive or iCloud is not automatically deleted — you must manually remove it
- Your phone number becomes available for re-registration after some time

After deleting WhatsApp, use our <a href="/shield">GCR Data Shield</a> to check whether your phone number appears on data broker sites. Phone numbers linked to messaging apps are frequently collected and sold by data brokers.`,
  },
];
