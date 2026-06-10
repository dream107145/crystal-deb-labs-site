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
  link: string;
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

export type RequestStatus =
  | "pending"
  | "quoted"
  | "in_progress"
  | "review"
  | "delivered"
  | "cancelled";

export interface ProjectRequest {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  service: string;
  details: string;
  budget: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  quotes?: Quote[];
}

export type QuoteStatus = "pending" | "accepted" | "declined";

export interface Quote {
  id: string;
  request_id: string;
  amount: number;
  currency: string;
  description: string;
  status: QuoteStatus;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  link: string;
  is_read: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  company: string;
  quote: string;
  rating: number;
  approved: boolean;
  created_at: string;
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
