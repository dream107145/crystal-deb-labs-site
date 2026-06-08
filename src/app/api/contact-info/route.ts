import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/constants";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json({
        contactInfo: {
          email: SITE.email,
          discord: SITE.discord,
          discord_ticket: SITE.discordTicket,
          telegram: SITE.telegram,
          telegram_handle: SITE.telegramHandle,
        },
        source: "constants",
      });
    }

    return NextResponse.json({ contactInfo: data, source: "database" });
  } catch {
    return NextResponse.json({
      contactInfo: {
        email: SITE.email,
        discord: SITE.discord,
        discord_ticket: SITE.discordTicket,
        telegram: SITE.telegram,
        telegram_handle: SITE.telegramHandle,
      },
      source: "constants",
    });
  }
}
