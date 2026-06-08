export type UserRole = "customer" | "developer" | "admin";

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  telegram: string | null;
  discord_id: string | null;
  avatar_url: string | null;
  email_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  body: string;
  is_read: boolean;
  created_at: string;
  sender?: Pick<Profile, "id" | "email" | "avatar_url">;
  recipient?: Pick<Profile, "id" | "email" | "avatar_url">;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  tech_stack: string[];
  client: string;
  outcomes: string;
  screenshots: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: number;
  email: string;
  discord: string;
  discord_ticket: string;
  telegram: string;
  telegram_handle: string;
  updated_at: string;
}
