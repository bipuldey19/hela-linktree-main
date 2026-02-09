import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const defaultPages = [
  {
    slug: "about",
    title: "About Us",
    content: `<h2>Who We Are</h2>
<p>We are a passionate team dedicated to creating meaningful digital experiences. Founded with the vision of connecting people through simple, beautiful technology, we believe that great design and thoughtful engineering go hand in hand.</p>

<h2>Our Mission</h2>
<p>Our mission is to empower individuals and businesses to share their online presence effortlessly. We build tools that are intuitive, fast, and a joy to use — so you can focus on what matters most: your content and your audience.</p>

<h2>What We Do</h2>
<p>We specialize in building link-in-bio platforms and personal landing pages that help creators, entrepreneurs, and businesses consolidate their online presence into one beautiful, shareable page. From social media links to blog posts, we make it easy to organize and present everything in one place.</p>

<h2>Our Values</h2>
<ul>
  <li><strong>Simplicity</strong> — We believe the best tools are the ones that get out of your way.</li>
  <li><strong>Privacy</strong> — Your data is yours. We respect it and protect it.</li>
  <li><strong>Quality</strong> — Every detail matters. We craft experiences we are proud of.</li>
  <li><strong>Community</strong> — We build for people, and we listen to the people we build for.</li>
</ul>

<p>Thank you for choosing us. We are excited to be part of your journey.</p>`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    content: `<h2>Get in Touch</h2>
<p>We would love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out using any of the methods below.</p>

<h2>Email</h2>
<p>For general inquiries, support, or partnership opportunities:</p>
<p><strong>hello@example.com</strong></p>

<h2>Business Hours</h2>
<p>We are available Monday through Friday, 9:00 AM to 6:00 PM (UTC). We aim to respond to all messages within 24 hours during business days.</p>

<h2>Social Media</h2>
<p>Follow us and stay connected on our social channels for updates, tips, and announcements. Links to our social profiles can be found on our homepage.</p>

<h2>Feedback</h2>
<p>Your feedback helps us improve. If you have suggestions or ideas for how we can make our platform better, we are all ears. Drop us a line anytime — we read every message.</p>

<h2>Location</h2>
<p>We are a remote-first team spread across the globe, united by our passion for building great products.</p>`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    content: `<p><em>Last updated: January 1, 2025</em></p>

<h2>Introduction</h2>
<p>Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.</p>

<h2>Information We Collect</h2>
<p>We may collect information about you in a variety of ways:</p>
<ul>
  <li><strong>Personal Data:</strong> Name, email address, and other contact information you voluntarily provide when registering or contacting us.</li>
  <li><strong>Usage Data:</strong> Information about how you access and use our website, including your IP address, browser type, pages visited, and time spent on pages.</li>
  <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience on our site.</li>
</ul>

<h2>How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, operate, and maintain our website and services</li>
  <li>Improve and personalize your experience</li>
  <li>Communicate with you, including for customer service and support</li>
  <li>Send you updates and marketing communications (with your consent)</li>
  <li>Monitor and analyze usage and trends</li>
</ul>

<h2>Data Sharing</h2>
<p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following situations:</p>
<ul>
  <li>With service providers who assist in operating our website</li>
  <li>To comply with legal obligations</li>
  <li>To protect our rights and safety</li>
</ul>

<h2>Data Security</h2>
<p>We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

<h2>Your Rights</h2>
<p>Depending on your location, you may have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at the email address provided on our Contact page.</p>

<h2>Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.</p>`,
  },
  {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    content: `<p><em>Last updated: January 1, 2025</em></p>

<h2>Agreement to Terms</h2>
<p>By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not access the service.</p>

<h2>Use of Service</h2>
<p>You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
<ul>
  <li>Use the service in any way that violates applicable laws or regulations</li>
  <li>Engage in any conduct that restricts or inhibits others from using the service</li>
  <li>Attempt to gain unauthorized access to any part of the service</li>
  <li>Use the service to transmit harmful, offensive, or illegal content</li>
</ul>

<h2>Accounts</h2>
<p>When you create an account with us, you must provide accurate and complete information. You are responsible for safeguarding your password and for all activities that occur under your account.</p>

<h2>Intellectual Property</h2>
<p>The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.</p>

<h2>User Content</h2>
<p>You retain ownership of any content you submit or display through our service. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such content in connection with the service.</p>

<h2>Limitation of Liability</h2>
<p>To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>

<h2>Termination</h2>
<p>We reserve the right to terminate or suspend your account and access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.</p>

<h2>Changes to Terms</h2>
<p>We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on this page. Your continued use of the service after changes constitutes acceptance of the new Terms.</p>

<h2>Contact</h2>
<p>If you have any questions about these Terms and Conditions, please contact us through the information provided on our Contact page.</p>`,
  },
];

async function seedPages() {
  console.log("Seeding default pages...");

  for (const page of defaultPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: {},
      create: page,
    });
    console.log(`  Created/verified page: ${page.title}`);
  }

  console.log("Done seeding pages.");
}

seedPages()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
