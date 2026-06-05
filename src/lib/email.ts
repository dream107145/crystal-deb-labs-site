import { Resend } from "resend";
import { SERVICES } from "@/lib/constants";

const VERIFIED_SEND_DOMAIN = "contact.crystaldevlabs.com";
const DEFAULT_FROM_EMAIL = `Crystal Dev Labs <noreply@${VERIFIED_SEND_DOMAIN}>`;

const budgetLabels: Record<string, string> = {
  "under-1k": "Under $1,000",
  "1k-5k": "$1,000 - $5,000",
  "5k-10k": "$5,000 - $10,000",
  "10k-30k": "$10,000 - $30,000",
  "30k-plus": "$30,000+",
  open: "Open / Discuss",
};

export interface ContactEmailData {
  name: string;
  email: string;
  service: "website" | "ai" | "bot" | "software" | "blockchain";
  details: string;
  budget: string;
}

function getServiceLabel(serviceId: ContactEmailData["service"]) {
  return SERVICES.find((s) => s.id === serviceId)?.title ?? serviceId;
}

function buildContactEmailHtml(data: ContactEmailData) {
  const service = getServiceLabel(data.service);
  const budget = budgetLabels[data.budget] ?? data.budget;

  return `
    <h2>New Contact Form Submission</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px 0;font-weight:bold;">Name</td><td style="padding:8px 0;">${escapeHtml(data.name)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">Service</td><td style="padding:8px 0;">${escapeHtml(service)}</td></tr>
      <tr><td style="padding:8px 0;font-weight:bold;">Budget</td><td style="padding:8px 0;">${escapeHtml(budget)}</td></tr>
    </table>
    <h3 style="margin-top:24px;">Project Details</h3>
    <p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(data.details)}</p>
  `;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeSenderAddress(address: string) {
  const at = address.lastIndexOf("@");
  if (at === -1) return address;

  const local = address.slice(0, at);
  const domain = address.slice(at + 1).toLowerCase();

  if (domain === "crystaldevlabs.com") {
    return `${local}@${VERIFIED_SEND_DOMAIN}`;
  }

  return address;
}

function resolveFromEmail(raw?: string) {
  const value = raw?.trim() || DEFAULT_FROM_EMAIL;
  const namedMatch = value.match(/^(.+?)\s*<([^>]+)>$/);

  if (namedMatch) {
    const [, displayName, address] = namedMatch;
    return `${displayName.trim()} <${normalizeSenderAddress(address.trim())}>`;
  }

  return normalizeSenderAddress(value);
}

export async function sendContactNotification(data: ContactEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);

  if (!apiKey || !adminEmail || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const resend = new Resend(apiKey);
  const service = getServiceLabel(data.service);

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [adminEmail],
    replyTo: data.email,
    subject: `New inquiry from ${data.name} — ${service}`,
    html: buildContactEmailHtml(data),
  });

  if (error) {
    throw new Error(error.message);
  }

  return { sent: true as const };
}
