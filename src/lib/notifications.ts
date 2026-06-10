import { createAdminClient } from "@/lib/supabase/admin";

export type NotificationType =
  | "message"
  | "request_status"
  | "quote"
  | "quote_response"
  | "testimonial";

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  link?: string;
}) {
  try {
    const admin = createAdminClient();
    await admin.from("notifications").insert({
      user_id: params.userId,
      type: params.type,
      title: params.title,
      body: params.body || "",
      link: params.link || "",
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
}
