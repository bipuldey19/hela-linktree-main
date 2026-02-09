import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("changeme123", 12);

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Admin",
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      siteTitle: "My Site",
      siteDescription: "Welcome to my site",
      heroTitle: "Welcome",
      heroSubtitle: "Discover amazing content",
      theme: JSON.stringify({
        primaryColor: "#3B82F6",
        primaryColorHover: "#2563EB",
        fontFamily: "Inter, system-ui, sans-serif",
        borderRadius: "8px",
        buttonStyle: "filled",
        bgStyle: "white",
      }),
      socialLinks: "[]",
      footerText: `© ${new Date().getFullYear()} My Site. All rights reserved.`,
    },
  });

  const staticPages = [
    {
      slug: "about",
      title: "About",
      content: `<p>We are a small team focused on building simple, useful tools for everyone. Our mission is to help people share what matters to them and connect with others.</p>
<h2>Our story</h2>
<p>Founded with a belief that the web should feel personal again, we started by building a single product and grew from there. Today we continue to iterate based on feedback from people like you.</p>
<h2>What we care about</h2>
<ul>
<li><strong>Simplicity</strong> — Clear design and straightforward features.</li>
<li><strong>Privacy</strong> — We only collect what we need and are transparent about it.</li>
<li><strong>Reliability</strong> — Your links and content stay online when you need them.</li>
</ul>
<p>Thank you for being here. If you have questions or ideas, we’d love to <a href="/pages/contact">hear from you</a>.</p>`,
    },
    {
      slug: "contact",
      title: "Contact",
      content: `<p>Have a question, suggestion, or just want to say hello? We’re here to help.</p>
<h2>Get in touch</h2>
<p><strong>Email</strong><br/>support@example.com</p>
<p><strong>General inquiries</strong><br/>hello@example.com</p>
<h2>Address</h2>
<p>123 Example Street, Suite 100<br/>City, State 12345</p>
<h2>Response times</h2>
<p>We aim to reply within 1–2 business days. For urgent matters, please include “Urgent” in your subject line.</p>`,
    },
    {
      slug: "privacy-policy",
      title: "Privacy Policy",
      content: `<p>Last updated: ${new Date().toISOString().slice(0, 10)}. This policy describes how we collect, use, and protect your information when you use our site.</p>
<h2>Information we collect</h2>
<p>We may collect information you provide directly (e.g. name, email when you contact us or create an account) and information collected automatically (e.g. IP address, browser type, pages visited) to improve our service and security.</p>
<h2>How we use it</h2>
<p>We use this information to operate and improve our site, respond to your requests, send important notices, and comply with applicable law. We do not sell your personal information.</p>
<h2>Cookies and similar technologies</h2>
<p>We use cookies and similar technologies for essential functionality, analytics, and preferences. You can control cookie settings in your browser.</p>
<h2>Data retention and security</h2>
<p>We retain data only as long as necessary for the purposes above and use reasonable measures to protect your information.</p>
<h2>Your rights</h2>
<p>Depending on where you live, you may have rights to access, correct, delete, or port your data. Contact us to exercise these rights.</p>
<h2>Contact</h2>
<p>For privacy-related questions, email us at privacy@example.com or see our <a href="/pages/contact">Contact</a> page.</p>`,
    },
    {
      slug: "terms-and-conditions",
      title: "Terms & Conditions",
      content: `<p>Last updated: ${new Date().toISOString().slice(0, 10)}. By using this site, you agree to these terms.</p>
<h2>Acceptance of terms</h2>
<p>By accessing or using our site, you agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use the site.</p>
<h2>Use of the service</h2>
<p>You may use the service only for lawful purposes and in accordance with these terms. You must not use the site in any way that could harm, disable, or overburden our systems or other users.</p>
<h2>Accounts</h2>
<p>If you create an account, you are responsible for keeping your credentials secure and for all activity under your account. You must provide accurate information and update it as needed.</p>
<h2>Intellectual property</h2>
<p>Content and materials on this site (excluding user-generated content) are owned by us or our licensors. You may not copy, modify, or distribute them without permission.</p>
<h2>Disclaimer</h2>
<p>The site is provided “as is.” We do not warrant that it will be uninterrupted or error-free. We are not liable for any indirect or consequential damages arising from your use of the site.</p>
<h2>Changes</h2>
<p>We may update these terms from time to time. Continued use after changes constitutes acceptance. We will indicate the last updated date at the top of this page.</p>
<h2>Contact</h2>
<p>Questions about these terms? See our <a href="/pages/contact">Contact</a> page.</p>`,
    },
  ];

  for (const page of staticPages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: { title: page.title, content: page.content, active: true },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        active: true,
      },
    });
  }

  console.log("Seed complete.");
  console.log("Default admin: admin@example.com / changeme123");
  console.log("IMPORTANT: Change the admin password after first login!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
