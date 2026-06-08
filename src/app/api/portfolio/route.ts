import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PROJECTS } from "@/lib/constants";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("portfolio_projects")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error || !data?.length) {
      const fallback = PROJECTS.map((p, i) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        image: p.image,
        link: p.link,
        description: p.description,
        tech_stack: p.techStack,
        client: p.client,
        outcomes: p.outcomes,
        screenshots: p.screenshots,
        sort_order: i,
        published: true,
      }));
      return NextResponse.json({ projects: fallback, source: "constants" });
    }

    return NextResponse.json({ projects: data, source: "database" });
  } catch {
    const fallback = PROJECTS.map((p, i) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      image: p.image,
      link: p.link,
      description: p.description,
      tech_stack: p.techStack,
      client: p.client,
      outcomes: p.outcomes,
      screenshots: p.screenshots,
      sort_order: i,
      published: true,
    }));
    return NextResponse.json({ projects: fallback, source: "constants" });
  }
}
