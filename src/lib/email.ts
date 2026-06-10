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

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendVerificationEmail(email: string, token: string) {
  const resend = getResendClient();
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!resend || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const verifyUrl = `${siteUrl}/auth/verify?token=${token}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Verify your Crystal Dev Labs account",
    html: `
      <h2>Welcome to Crystal Dev Labs</h2>
      <p>Please verify your email address to complete your registration.</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;">Verify Email</a></p>
      <p style="color:#888;font-size:14px;">Or copy this link: ${verifyUrl}</p>
      <p style="color:#888;font-size:14px;">This link expires in 24 hours.</p>
    `,
  });

  if (error) throw new Error(error.message);
  return { sent: true as const };
}

export async function sendBulkEmail(
  recipients: string[],
  subject: string,
  html: string
) {
  const resend = getResendClient();
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);

  if (!resend || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: recipients,
    subject,
    html,
  });

  if (error) throw new Error(error.message);
  return { sent: true as const, count: recipients.length };
}

export async function sendApprovalEmail(email: string) {
  const resend = getResendClient();
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!resend || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Your developer account has been approved",
    html: `
      <h2>Account Approved</h2>
      <p>Your developer account at Crystal Dev Labs has been approved by an administrator.</p>
      <p><a href="${siteUrl}/auth/signin" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;">Sign In</a></p>
    `,
  });

  if (error) throw new Error(error.message);
  return { sent: true as const };
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resend = getResendClient();
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!resend || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const resetUrl = `${siteUrl}/auth/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: "Reset your Crystal Dev Labs password",
    html: `
      <h2>Password Reset</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one.</p>
      <p><a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;">Reset Password</a></p>
      <p style="color:#888;font-size:14px;">Or copy this link: ${resetUrl}</p>
      <p style="color:#888;font-size:14px;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
    `,
  });

  if (error) throw new Error(error.message);
  return { sent: true as const };
}

const statusLabels: Record<string, string> = {
  pending: "Pending Review",
  quoted: "Quote Sent",
  in_progress: "In Progress",
  review: "In Review",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export async function sendStatusUpdateEmail(
  email: string,
  requestService: string,
  status: string
) {
  const resend = getResendClient();
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!resend || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const label = statusLabels[status] ?? status;

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: `Project update: ${label}`,
    html: `
      <h2>Project Status Update</h2>
      <p>Your <strong>${escapeHtml(requestService)}</strong> project request status changed to <strong>${escapeHtml(label)}</strong>.</p>
      <p><a href="${siteUrl}/profile" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;">View Project</a></p>
    `,
  });

  if (error) throw new Error(error.message);
  return { sent: true as const };
}

export async function sendQuoteEmail(
  email: string,
  requestService: string,
  amount: number,
  currency: string
) {
  const resend = getResendClient();
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!resend || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to: [email],
    subject: `You received a quote for your ${requestService} project`,
    html: `
      <h2>New Quote</h2>
      <p>We've sent you a quote of <strong>${currency} ${amount.toLocaleString()}</strong> for your <strong>${escapeHtml(requestService)}</strong> project request.</p>
      <p>Sign in to review, accept, or decline the quote.</p>
      <p><a href="${siteUrl}/profile" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#0a0a0f;text-decoration:none;border-radius:8px;font-weight:600;">Review Quote</a></p>
    `,
  });

  if (error) throw new Error(error.message);
  return { sent: true as const };
}

export async function sendContactNotification(data: ContactEmailData) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = resolveFromEmail(process.env.RESEND_FROM_EMAIL);

  if (!apiKey || !adminEmail || !fromEmail) {
    return { sent: false as const, reason: "missing_config" as const };
  }

  const resend = getResendClient()!;
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
