import { NextResponse } from "next/server";
import { z } from "zod";
import { sendContactNotification } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  service: z.enum(["website", "ai", "bot", "software", "blockchain"]),
  details: z.string().min(20),
  budget: z.string().min(1),
});

const budgetLabels: Record<string, string> = {
  "under-1k": "Under $1,000",
  "1k-5k": "$1,000 - $5,000",
  "5k-10k": "$5,000 - $10,000",
  "10k-30k": "$10,000 - $30,000",
  "30k-plus": "$30,000+",
  open: "Open / Discuss",
};

async function notifyDiscord(data: z.infer<typeof contactSchema>) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const embed = {
    title: "New Contact Form Submission",
    color: 0x00d4ff,
    fields: [
      { name: "Name", value: data.name, inline: true },
      { name: "Email", value: data.email, inline: true },
      { name: "Service", value: data.service, inline: true },
      {
        name: "Budget",
        value: budgetLabels[data.budget] ?? data.budget,
        inline: true,
      },
      { name: "Project Details", value: data.details },
    ],
    timestamp: new Date().toISOString(),
  };

  const discordRes = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!discordRes.ok) {
    console.error("Discord webhook failed:", await discordRes.text());
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const emailResult = await sendContactNotification(data);

    if (!emailResult.sent) {
      console.log("Contact form submission (email not configured):", data);
    }

    await notifyDiscord(data);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid form data", details: error.issues },
        { status: 400 }
      );
    }
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
