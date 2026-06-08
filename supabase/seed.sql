-- Seed portfolio projects from constants (run after migration)
-- Execute via Supabase SQL editor or: supabase db execute -f supabase/seed.sql

insert into public.portfolio_projects (title, category, image, link, description, tech_stack, client, outcomes, screenshots, sort_order, published)
values
  (
    'NovaCommerce Platform',
    'website',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    'https://novacommerce.example.com',
    'A full-scale e-commerce platform with real-time inventory, multi-currency checkout, and AI-powered product recommendations.',
    array['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
    'Nova Retail Group',
    '40% increase in conversion rate, 99.9% uptime over 12 months.',
    array['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200'],
    0, true
  ),
  (
    'MindBridge AI Assistant',
    'ai',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    'https://supportai.example.com',
    'Enterprise AI assistant integrating multiple LLMs with custom knowledge bases and workflow automation.',
    array['OpenAI', 'LangChain', 'Python', 'Pinecone'],
    'MindBridge Corp',
    'Reduced support ticket volume by 60%, saved 200+ hours/month.',
    array['https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200'],
    1, true
  ),
  (
    'GuildMaster Discord Bot',
    'bot',
    'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800',
    'https://discord.gg/communityguard',
    'Feature-rich Discord bot with moderation, ticketing, economy system, and custom commands for a 50k+ member community.',
    array['Discord.js', 'Node.js', 'MongoDB', 'Redis'],
    'GuildMaster Gaming',
    'Managed 50k+ members, 95% moderation accuracy, 24/7 uptime.',
    array['https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=1200'],
    2, true
  )
on conflict do nothing;
