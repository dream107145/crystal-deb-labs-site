import type {
  FAQ,
  Feature,
  ProcessStep,
  Project,
  Service,
  Stat,
  Value,
} from "@/types";

export const SITE = {
  name: "Crystal Dev Labs",
  tagline: "Building the Future, One Line of Code at a Time",
  description:
    "Crystal Dev Labs - Your Partner for Cutting-Edge Digital Solutions",
  email: "jackson97107@gmail.com",
  discord: "https://discord.gg/jqQutYMAn",
  discordTicket: "https://discord.gg/jqQutYMAn",
  telegram: "https://t.me/eu00823",
  telegramHandle: "@eu00823",
  url: "https://crystaldevlabs.com",
  logo: "/logo.svg",
};

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const SERVICES: Service[] = [
  {
    id: "website",
    title: "Website Development",
    emoji: "🌐",
    icon: "Globe",
    shortDescription:
      "Stunning, responsive websites that convert visitors into customers.",
    description:
      "We craft bespoke web experiences tailored to your brand. From landing pages to full-scale e-commerce platforms, our team delivers pixel-perfect designs with blazing performance and SEO best practices baked in from day one.",
    features: [
      "Custom Websites",
      "E-commerce Solutions",
      "Responsive Design",
      "CMS Integration",
      "Performance Optimization",
      "Ongoing Maintenance",
    ],
    tech: ["React", "Next.js", "WordPress", "Shopify", "TypeScript"],
    accentColor: "#00D4FF",
  },
  {
    id: "ai",
    title: "AI Development",
    emoji: "🤖",
    icon: "Brain",
    shortDescription:
      "Intelligent systems powered by cutting-edge machine learning.",
    description:
      "Harness the power of artificial intelligence to automate workflows, enhance customer experiences, and unlock insights from your data. We integrate leading LLMs and build custom AI agents tailored to your business needs.",
    features: [
      "AI Chatbots",
      "LLM Integration",
      "AI Agents",
      "Machine Learning",
      "Process Automation",
      "Custom AI Models",
    ],
    tech: ["OpenAI", "Claude", "Llama", "Python", "LangChain"],
    accentColor: "#6B46C1",
  },
  {
    id: "bot",
    title: "Bot Development",
    emoji: "🤵",
    icon: "Bot",
    shortDescription:
      "Powerful Discord and Telegram bots that engage your community.",
    description:
      "Automate moderation, ticketing, payments, and community engagement with custom bots built for Discord, Telegram, and more. We handle hosting, scaling, and API integrations so your bot runs 24/7 without a hitch.",
    features: [
      "Discord Bots",
      "Telegram Bots",
      "Automation Bots",
      "Bot Hosting",
      "API Integrations",
      "Custom Commands",
    ],
    tech: ["Discord.js", "Telegram Bot API", "Node.js", "Python"],
    accentColor: "#00F5FF",
  },
  {
    id: "software",
    title: "Software Development",
    emoji: "💻",
    icon: "Code2",
    shortDescription:
      "Full-stack applications from desktop to mobile and SaaS.",
    description:
      "End-to-end software solutions for startups and enterprises alike. We build scalable SaaS platforms, native mobile apps, desktop applications, and robust APIs with clean architecture and comprehensive testing.",
    features: [
      "Desktop Applications",
      "Mobile Apps",
      "SaaS Platforms",
      "Web Applications",
      "REST & GraphQL APIs",
      "Cloud Deployment",
    ],
    tech: ["React Native", "Flutter", "Electron", "Node.js", "PostgreSQL"],
    accentColor: "#00D4FF",
  },
  {
    id: "blockchain",
    title: "Blockchain Development",
    emoji: "⛓️",
    icon: "Link",
    shortDescription:
      "Secure smart contracts, DApps, and Web3 solutions.",
    description:
      "Navigate the decentralized landscape with confidence. Our blockchain experts deliver audited smart contracts, NFT marketplaces, DeFi protocols, and token ecosystems on leading chains including Bitcoin SV.",
    features: [
      "Smart Contracts",
      "DApps",
      "NFT Marketplaces",
      "DeFi Solutions",
      "Bitcoin SV",
      "Token Creation",
    ],
    tech: ["Solidity", "Rust", "Web3.js", "Ethers.js", "Hardhat"],
    accentColor: "#6B46C1",
  },
];

export const FEATURES: Feature[] = [
  {
    title: "Expert Team",
    description:
      "Seasoned developers with deep expertise across web, AI, bots, and blockchain.",
    icon: "Users",
  },
  {
    title: "Custom Solutions",
    description:
      "Every project is tailored to your unique goals—no cookie-cutter templates.",
    icon: "Sparkles",
  },
  {
    title: "Fast Delivery",
    description:
      "Agile workflows and clear milestones keep your project on track and on time.",
    icon: "Zap",
  },
  {
    title: "24/7 Support",
    description:
      "Round-the-clock assistance via Discord so you're never left in the dark.",
    icon: "Headphones",
  },
];

export const STATS: Stat[] = [
  { label: "Projects Completed", value: 7, suffix: "" },
  { label: "Happy Clients", value: 5, suffix: "+" },
  { label: "Lines of Code", value: 50, suffix: "K+", prefix: "" },
  { label: "Years Experience", value: 3, suffix: "+" },
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: "NovaCommerce Platform",
    category: "website",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    link: "https://novacommerce.example.com",
    description:
      "A full-featured e-commerce platform with real-time inventory, payment processing, and admin dashboard.",
    techStack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    client: "NovaTech Solutions",
    outcomes: "40% increase in conversion rate within 3 months of launch.",
    screenshots: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
    ],
  },
  {
    id: "2",
    title: "SupportAI Assistant",
    category: "ai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    link: "https://supportai.example.com",
    description:
      "Custom AI chatbot integrated with company knowledge base and CRM for automated customer support.",
    techStack: ["OpenAI", "LangChain", "Python", "FastAPI"],
    client: "AI Dynamics",
    outcomes: "60% reduction in support tickets, 24/7 automated responses.",
    screenshots: [
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    ],
  },
  {
    id: "3",
    title: "CommunityGuard Bot",
    category: "bot",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    link: "https://discord.gg/communityguard",
    description:
      "Discord moderation bot with auto-mod, ticketing, role management, and custom economy system.",
    techStack: ["Discord.js", "Node.js", "Redis", "MongoDB"],
    client: "PixelForge Studio",
    outcomes: "Serving 50K+ members with 99.9% uptime.",
    screenshots: [
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
    ],
  },
  {
    id: "4",
    title: "TaskFlow SaaS",
    category: "software",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
    link: "https://taskflow.example.com",
    description:
      "Cross-platform project management SaaS with real-time collaboration and analytics.",
    techStack: ["React", "Electron", "Node.js", "PostgreSQL"],
    client: "StartupHub Inc",
    outcomes: "10K+ active users within first 6 months.",
    screenshots: [
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
    ],
  },
  {
    id: "5",
    title: "ChainVault DeFi",
    category: "blockchain",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
    link: "https://chainvault.example.com",
    description:
      "Decentralized finance protocol with staking, yield farming, and audited smart contracts.",
    techStack: ["Solidity", "Hardhat", "Ethers.js", "React"],
    client: "ChainVault Finance",
    outcomes: "$2M TVL within first quarter post-launch.",
    screenshots: [
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&q=80",
    ],
  },
  {
    id: "6",
    title: "LuxeBrand Website",
    category: "website",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&q=80",
    link: "https://luxebrand.example.com",
    description:
      "Premium brand website with immersive animations, CMS, and multilingual support.",
    techStack: ["Next.js", "Framer Motion", "Sanity CMS", "Vercel"],
    client: "LuxeBrand Co",
    outcomes: "200% increase in organic traffic after SEO optimization.",
    screenshots: [
      "https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&q=80",
    ],
  },
  {
    id: "7",
    title: "TelegramTrade Bot",
    category: "bot",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
    link: "https://t.me/telegramtradebot",
    description:
      "Telegram trading alert bot with portfolio tracking and exchange API integrations.",
    techStack: ["Python", "Telegram Bot API", "CCXT"],
    client: "CryptoAlerts Pro",
    outcomes: "15K daily active users, sub-100ms alert latency.",
    screenshots: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
    ],
  },
];

export const VALUES: Value[] = [
  {
    title: "Innovation",
    description: "We push boundaries and embrace emerging technologies.",
    icon: "Lightbulb",
  },
  {
    title: "Quality",
    description: "Every line of code is crafted with precision and care.",
    icon: "Award",
  },
  {
    title: "Transparency",
    description: "Clear communication and honest timelines at every step.",
    icon: "Eye",
  },
  {
    title: "Collaboration",
    description: "Your vision drives our process—we build together.",
    icon: "Handshake",
  },
  {
    title: "Excellence",
    description: "We deliver results that exceed expectations.",
    icon: "Star",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: 1,
    title: "Discovery",
    description: "We learn your goals, audience, and technical requirements.",
    icon: "Search",
  },
  {
    step: 2,
    title: "Planning",
    description: "Roadmaps, milestones, and architecture are defined together.",
    icon: "Map",
  },
  {
    step: 3,
    title: "Design",
    description: "Wireframes and prototypes bring your vision to life.",
    icon: "Palette",
  },
  {
    step: 4,
    title: "Development",
    description: "Agile sprints with regular demos and feedback loops.",
    icon: "Code2",
  },
  {
    step: 5,
    title: "Testing",
    description: "Rigorous QA, security audits, and performance optimization.",
    icon: "TestTube",
  },
  {
    step: 6,
    title: "Launch",
    description: "Deployment, monitoring, and ongoing support post-launch.",
    icon: "Rocket",
  },
];

export const FAQS: FAQ[] = [
  {
    id: "1",
    question: "How much do projects typically cost?",
    answer:
      "Project costs vary based on scope and complexity. We offer packages from under $1K for smaller projects to $30K+ for enterprise solutions. Contact us with your requirements for a custom quote.",
  },
  {
    id: "2",
    question: "What is your typical project timeline?",
    answer:
      "Simple websites take 2-4 weeks. AI integrations and bots typically run 4-8 weeks. Full SaaS or blockchain projects may take 2-6 months. We provide detailed timelines during the planning phase.",
  },
  {
    id: "3",
    question: "What tech stacks do you work with?",
    answer:
      "We specialize in React, Next.js, Node.js, Python, Solidity, and leading AI platforms (OpenAI, Claude, LangChain). We're stack-agnostic and choose the best tools for your project.",
  },
  {
    id: "4",
    question: "How many revisions are included?",
    answer:
      "Most projects include 2-3 revision rounds per milestone. Additional revisions can be accommodated—we'll clarify this in your project agreement.",
  },
  {
    id: "5",
    question: "Do you offer ongoing support?",
    answer:
      "Yes! We offer maintenance packages and 24/7 Discord support for active clients. Post-launch support terms are outlined in every contract.",
  },
  {
    id: "6",
    question: "How do we communicate during a project?",
    answer:
      "We use Discord as our primary hub for real-time communication, plus scheduled video calls and shared project boards for transparency.",
  },
  {
    id: "7",
    question: "Can you work with our existing codebase?",
    answer:
      "Absolutely. We regularly audit, refactor, and extend existing codebases. Share your repo or docs and we'll assess compatibility during discovery.",
  },
];

export const BUDGET_OPTIONS = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-30k", label: "$10,000 - $30,000" },
  { value: "30k-plus", label: "$30,000+" },
  { value: "open", label: "Open / Discuss" },
];

export const PORTFOLIO_FILTERS = [
  { id: "all" as const, label: "All" },
  { id: "website" as const, label: "Website" },
  { id: "ai" as const, label: "AI" },
  { id: "bot" as const, label: "Bot" },
  { id: "software" as const, label: "Software" },
  { id: "blockchain" as const, label: "Blockchain" },
];
