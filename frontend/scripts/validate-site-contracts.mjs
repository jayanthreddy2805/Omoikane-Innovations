import { readFile } from "node:fs/promises";

const checks = [
  ["src/app/services/[department]/page.js", ["dynamicParams = false", "software", "electronics", "mechanical"]],
  ["src/app/not-found.js", ["PAGE NOT FOUND", "View our work", "Contact us"]],
  ["src/components/features/leadership/LeadershipGallery.js", ["aria-haspopup=\"dialog\"", "aria-modal=\"true\"", "Close profile"]],
  ["src/components/shared/CustomSelect.jsx", ["aria-labelledby", "aria-activedescendant"]],
  ["src/components/shared/InternationalPhoneInput.jsx", ["role=\"listbox\"", "aria-label=\"Countries\""]],
  ["src/app/expertise/layout.tsx", ["Expertise | Omoikane Innovations"]],
  ["src/app/contact/layout.js", ["Contact | Omoikane Innovations"]],
  ["next.config.mjs", ["/about-us", "/contact-us", "/software-development", "/products.html"]],
];

const forbidden = [
  "https://www.omoikaneinnovations.com/about-us/",
  "https://www.omoikaneinnovations.com/contact-us/",
  "https://www.omoikaneinnovations.com/software-development/",
  "http://localhost:3000/admin",
  "cdn.21st.dev",
  "PAGE UNDER CONSTRUCTION",
  "Omoikabe expertise",
];

const sourceFiles = [
  "src/components/features/chatbot/ChatbotWidget.jsx",
  "../backend/src/main/java/com/omoikane/api/email/ResendEmailService.java",
];

const failures = [];
for (const [file, expected] of checks) {
  const content = await readFile(file, "utf8");
  for (const text of expected) {
    if (!content.includes(text)) failures.push(`${file} is missing: ${text}`);
  }
}

for (const file of sourceFiles) {
  const content = await readFile(file, "utf8");
  for (const text of forbidden) {
    if (content.includes(text)) failures.push(`${file} contains forbidden legacy content: ${text}`);
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Site contracts verified.");
