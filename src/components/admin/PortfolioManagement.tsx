"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import Button from "@/components/ui/Button";
import ImageUpload, { MultiImageUpload } from "@/components/admin/ImageUpload";
import { inputClass } from "@/components/forms/inputClass";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/types/database";

const emptyProject = {
  title: "",
  category: "website",
  image: "",
  link: "",
  description: "",
  tech_stack: "",
  client: "",
  outcomes: "",
  screenshots: [] as string[],
  sort_order: 0,
  published: true,
};

export default function PortfolioManagement() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setProjects(json.projects || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const startEdit = (project?: PortfolioProject) => {
    if (project) {
      setEditing(project.id);
      setForm({
        title: project.title,
        category: project.category,
        image: project.image,
        link: project.link || "",
        description: project.description,
        tech_stack: project.tech_stack.join(", "),
        client: project.client,
        outcomes: project.outcomes,
        screenshots: project.screenshots,
        sort_order: project.sort_order,
        published: project.published,
      });
    } else {
      setEditing("new");
      setForm(emptyProject);
    }
  };

  const handleSave = async () => {
    if (!form.image) {
      setError("Please upload a cover image.");
      return;
    }
    setError(null);
    setSaving(true);
    const payload = {
      title: form.title,
      category: form.category,
      image: form.image,
      link: form.link,
      description: form.description,
      tech_stack: form.tech_stack.split(",").map((s) => s.trim()).filter(Boolean),
      client: form.client,
      outcomes: form.outcomes,
      screenshots: form.screenshots,
      sort_order: form.sort_order,
      published: form.published,
    };

    try {
      const isNew = editing === "new";
      const res = await fetch(
        isNew ? "/api/admin/projects" : `/api/admin/projects/${editing}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setEditing(null);
      fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVisibility = async (project: PortfolioProject) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !project.published }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? json.project : p))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update visibility");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error);
      }
      fetchProjects();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading) {
    return <div className="glass-strong rounded-2xl p-10 animate-pulse h-64" />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="font-heading font-semibold text-white">Portfolio Projects ({projects.length})</h3>
        <Button variant="primary" onClick={() => startEdit()}>
          <Plus size={16} /> Add Project
        </Button>
      </div>

      {editing && (
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          <h4 className="font-heading text-white">{editing === "new" ? "New Project" : "Edit Project"}</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <input className={inputClass()} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <select className={inputClass()} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {["website", "ai", "bot", "software", "blockchain"].map((c) => (
                <option key={c} value={c} className="bg-crystal-darker">{c}</option>
              ))}
            </select>
            <input className={inputClass()} placeholder="Client" value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} />
            <input className={inputClass()} placeholder="Sort order" type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} />
            <div>
              <span className="block text-sm font-medium text-white mb-2">Visibility</span>
              <button
                type="button"
                onClick={() => setForm({ ...form, published: !form.published })}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  form.published
                    ? "bg-green-500/20 text-green-300 border border-green-500/40"
                    : "bg-white/5 text-muted border border-white/10"
                )}
              >
                {form.published ? <Eye size={16} /> : <EyeOff size={16} />}
                {form.published ? "Shown on portfolio" : "Hidden from portfolio"}
              </button>
            </div>
          </div>
          <ImageUpload
            label="Cover Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
          />
          <div>
            <label htmlFor="project-link" className="block text-sm font-medium text-white mb-2">
              Project Link <span className="text-muted text-xs font-normal">(optional)</span>
            </label>
            <input
              id="project-link"
              type="url"
              className={inputClass()}
              placeholder="https://example.com (optional)"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />
          </div>
          <textarea className={cn(inputClass(), "resize-y")} placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input className={inputClass()} placeholder="Tech stack (comma-separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
          <textarea className={cn(inputClass(), "resize-y")} placeholder="Outcomes" rows={2} value={form.outcomes} onChange={(e) => setForm({ ...form, outcomes: e.target.value })} />
          <MultiImageUpload
            values={form.screenshots}
            onChange={(urls) => setForm({ ...form, screenshots: urls })}
          />
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleSave} isLoading={saving}>Save</Button>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted border-b border-white/10">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Link</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Visibility</th>
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-white">{p.title}</td>
                  <td className="p-3 text-muted max-w-[200px] truncate">
                    {p.link ? (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-crystal-cyan hover:underline">
                        {p.link.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="p-3 capitalize text-muted">{p.category}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(p)}
                      title={p.published ? "Hide from portfolio" : "Show on portfolio"}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        p.published
                          ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                          : "bg-white/10 text-muted hover:bg-white/15"
                      )}
                    >
                      {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                      {p.published ? "Shown" : "Hidden"}
                    </button>
                  </td>
                  <td className="p-3 text-muted">{p.sort_order}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => startEdit(p)} className="text-crystal-cyan hover:text-white">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
