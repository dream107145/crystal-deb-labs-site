export type ServiceId =
  | "website"
  | "ai"
  | "bot"
  | "software"
  | "blockchain";

export type ProjectCategory = ServiceId | "all";

export interface Service {
  id: ServiceId;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  emoji: string;
  features: string[];
  tech: string[];
  accentColor: string;
}

export interface Project {
  id: string;
  title: string;
  category: ServiceId;
  image: string;
  description: string;
  techStack: string[];
  client: string;
  outcomes: string;
  screenshots: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  quote: string;
  avatar: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Stat {
  label: string;
  value: number;
  suffix: string;
  prefix?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  service: ServiceId;
  details: string;
  budget: string;
}
