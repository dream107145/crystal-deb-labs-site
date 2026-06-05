# Crystal Dev Labs — Agency Portfolio Website

A modern, futuristic agency website built with Next.js 14, featuring 3D particle backgrounds, Framer Motion animations, and a full multi-page experience.

## Tech Stack

- **Framework:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS + custom globals
- **Animations:** Framer Motion + GSAP-ready structure
- **3D/Particles:** React Three Fiber + Drei
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key for sending contact form emails |
| `RESEND_FROM_EMAIL` | Verified sender on `contact.crystaldevlabs.com` (e.g. `Crystal Dev Labs <noreply@contact.crystaldevlabs.com>`) |
| `ADMIN_EMAIL` | Admin inbox that receives contact form submissions |
| `DISCORD_WEBHOOK_URL` | Optional Discord webhook for contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata |

Without Resend env vars, form submissions are logged to the server console.

## Project Structure

```
src/
├── app/              # Pages & API routes
├── components/
│   ├── particles/    # Three.js particle & crystal
│   ├── animations/   # Scroll reveal, counters, mouse trail
│   ├── sections/     # Page sections
│   ├── cards/        # Reusable cards
│   ├── forms/        # Contact form
│   └── ui/           # Button, Navbar, Modal
├── lib/              # Utils & constants
└── types/            # TypeScript types
```

## Pages

- `/` — Home (hero, services, stats, testimonials, CTA)
- `/services` — Service details & process timeline
- `/portfolio` — Filterable project grid with modals
- `/about` — Story, team, values
- `/contact` — Form, FAQ, contact info

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `ADMIN_EMAIL` in Environment Variables
4. Deploy

## Performance Notes

- Particle count scales by viewport (50 mobile / 75 tablet / 100 desktop)
- Three.js components are dynamically imported with `ssr: false`
- Loading screen shows once per session (sessionStorage)
- Images use Next.js `Image` with remote patterns configured

## Customization

- **Content:** Edit `src/lib/constants.ts`
- **Colors:** Update `tailwind.config.ts` and `globals.css`
- **Particles:** Tune counts in `ParticleBackground.tsx`

## License

Private — Crystal Dev Labs © 2026
