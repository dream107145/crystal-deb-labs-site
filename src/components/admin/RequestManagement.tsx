"use client";

import { useState, useEffect } from "react";
import { FileText, Trash2, MessageCircle, UserPlus, X } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ProjectChat from "@/components/chat/ProjectChat";
import { inputClass } from "@/components/forms/inputClass";
import { cn } from "@/lib/utils";
import type { Profile, ProjectRequest, RequestStatus } from "@/types/database";

const STATUSES: RequestStatus[] = [
  "pending",
  "quoted",
  "in_progress",
  "review",
  "delivered",
  "cancelled",
];

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  quoted: "bg-crystal-blue/20 text-crystal-cyan",
  in_progress: "bg-purple-500/20 text-purple-300",
  review: "bg-orange-500/20 text-orange-300",
  delivered: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

export default function RequestManagement() {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [quoteFor, setQuoteFor] = useState<ProjectRequest | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteCurrency, setQuoteCurrency] = useState("USD");
  const [quoteDescription, setQuoteDescription] = useState("");
  const [sendingQuote, setSendingQuote] = useState(false);

  const [chatFor, setChatFor] = useState<ProjectRequest | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [developers, setDevelopers] = useState<Profile[]>([]);
  const [assigning, setAssigning] = useState<string | null>(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/requests");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRequests(json.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();

    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => setAdminId(json?.profile?.id ?? null))
      .catch(() => {});

    fetch("/api/admin/users")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) =>
        setDevelopers(
          ((json?.users || []) as Profile[]).filter(
            (u) => u.role === "developer" && u.is_approved
          )
        )
      )
      .catch(() => {});
  }, []);

  const assignDeveloper = async (requestId: string, developerId: string) => {
    if (!developerId) return;
    setAssigning(requestId);
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developer_id: developerId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage("Developer assigned and notified.");
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign developer");
    } finally {
      setAssigning(null);
    }
  };

  const unassignDeveloper = async (requestId: string, developerId: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${requestId}/assign`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ developer_id: developerId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove developer");
    }
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...json.request, quotes: r.quotes } : r))
      );
      setMessage("Status updated and customer notified.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    try {
      const res = await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const sendQuote = async () => {
    if (!quoteFor) return;
    const amount = parseFloat(quoteAmount);
    if (!amount || amount <= 0) {
      setError("Enter a valid quote amount.");
      return;
    }
    setSendingQuote(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/requests/${quoteFor.id}/quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: quoteCurrency,
          description: quoteDescription,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setQuoteFor(null);
      setQuoteAmount("");
      setQuoteDescription("");
      setMessage("Quote sent. The customer was notified by email and in-app.");
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send quote");
    } finally {
      setSendingQuote(false);
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
      {message && (
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 text-sm">{message}</div>
      )}

      <h3 className="font-heading font-semibold text-white">
        Project Requests ({requests.length})
      </h3>

      {requests.length === 0 ? (
        <div className="glass-strong rounded-2xl p-10 text-center text-muted">
          No project requests yet. Contact form submissions will appear here.
        </div>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="glass-strong rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="font-heading font-semibold text-white capitalize">
                  {req.service} — {req.name}
                </h4>
                <p className="text-xs text-muted">
                  {req.email} · {new Date(req.created_at).toLocaleString()} · Budget: {req.budget}
                  {!req.user_id && " · (guest)"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={req.status}
                  onChange={(e) => updateStatus(req.id, e.target.value as RequestStatus)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border-0 outline-none cursor-pointer",
                    statusStyles[req.status]
                  )}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s} className="bg-crystal-darker text-white">
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => handleDelete(req.id)}
                  className="text-red-400 hover:text-red-300 p-1"
                  aria-label="Delete request"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <p
              className={cn(
                "text-sm text-muted cursor-pointer",
                expanded !== req.id && "line-clamp-2"
              )}
              onClick={() => setExpanded(expanded === req.id ? null : req.id)}
            >
              {req.details}
            </p>

            {(req.quotes || []).length > 0 && (
              <div className="space-y-2">
                {(req.quotes || []).map((q) => (
                  <div key={q.id} className="glass rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-white">
                      {q.currency} {Number(q.amount).toLocaleString()}
                      {q.description && <span className="text-muted"> — {q.description}</span>}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs",
                        q.status === "pending" && "bg-yellow-500/20 text-yellow-300",
                        q.status === "accepted" && "bg-green-500/20 text-green-300",
                        q.status === "declined" && "bg-red-500/20 text-red-300"
                      )}
                    >
                      {q.status}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted flex items-center gap-1">
                  <UserPlus size={14} /> Team:
                </span>
                {(req.assignments || []).length === 0 && (
                  <span className="text-xs text-muted/60">No developers assigned</span>
                )}
                {(req.assignments || []).map((a) => (
                  <span
                    key={a.id}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-crystal-blue/20 text-crystal-cyan text-xs"
                  >
                    {a.developer?.email || "developer"}
                    <button
                      type="button"
                      onClick={() => unassignDeveloper(req.id, a.developer_id)}
                      className="hover:text-white"
                      aria-label="Remove developer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                <select
                  value=""
                  disabled={assigning === req.id}
                  onChange={(e) => assignDeveloper(req.id, e.target.value)}
                  className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-muted outline-none cursor-pointer"
                >
                  <option value="" className="bg-crystal-darker">
                    + Assign developer…
                  </option>
                  {developers
                    .filter(
                      (d) =>
                        !(req.assignments || []).some(
                          (a) => a.developer_id === d.id
                        )
                    )
                    .map((d) => (
                      <option key={d.id} value={d.id} className="bg-crystal-darker text-white">
                        {d.email}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setQuoteFor(req)}
                className="text-sm py-2"
              >
                <FileText size={16} /> Send Quote
              </Button>
              <Button
                variant="ghost"
                onClick={() => setChatFor(req)}
                className="text-sm py-2"
              >
                <MessageCircle size={16} /> Project Chat
              </Button>
            </div>
          </div>
        ))
      )}

      <Modal
        isOpen={!!chatFor}
        onClose={() => setChatFor(null)}
        title={`Project Chat — ${chatFor?.name ?? ""}`}
      >
        {chatFor && adminId && (
          <ProjectChat requestId={chatFor.id} currentUserId={adminId} />
        )}
      </Modal>

      <Modal
        isOpen={!!quoteFor}
        onClose={() => setQuoteFor(null)}
        title={`Send Quote — ${quoteFor?.name ?? ""}`}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label htmlFor="quote-amount" className="block text-sm font-medium text-white mb-2">
                Amount <span className="text-crystal-cyan">*</span>
              </label>
              <input
                id="quote-amount"
                type="number"
                min="0"
                step="0.01"
                className={inputClass()}
                placeholder="5000"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="quote-currency" className="block text-sm font-medium text-white mb-2">
                Currency
              </label>
              <select
                id="quote-currency"
                className={inputClass()}
                value={quoteCurrency}
                onChange={(e) => setQuoteCurrency(e.target.value)}
              >
                {["USD", "EUR", "GBP"].map((c) => (
                  <option key={c} value={c} className="bg-crystal-darker">{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="quote-description" className="block text-sm font-medium text-white mb-2">
              Description <span className="text-muted text-xs font-normal">(optional)</span>
            </label>
            <textarea
              id="quote-description"
              rows={3}
              className={cn(inputClass(), "resize-y")}
              placeholder="Scope, timeline, payment terms..."
              value={quoteDescription}
              onChange={(e) => setQuoteDescription(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={sendQuote} isLoading={sendingQuote}>
              Send Quote
            </Button>
            <Button variant="ghost" onClick={() => setQuoteFor(null)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
