"use client";

import { useState, useEffect } from "react";
import { Star, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import ProjectChat from "@/components/chat/ProjectChat";
import { inputClass } from "@/components/forms/inputClass";
import { cn } from "@/lib/utils";
import type { Profile, ProjectRequest, RequestStatus } from "@/types/database";

const statusStyles: Record<RequestStatus, string> = {
  pending: "bg-yellow-500/20 text-yellow-300",
  quoted: "bg-crystal-blue/20 text-crystal-cyan",
  in_progress: "bg-purple-500/20 text-purple-300",
  review: "bg-orange-500/20 text-orange-300",
  delivered: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

const statusLabels: Record<RequestStatus, string> = {
  pending: "Pending Review",
  quoted: "Quote Sent",
  in_progress: "In Progress",
  review: "In Review",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function MyProjectsPanel({ profile }: { profile: Profile }) {
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [responding, setResponding] = useState<string | null>(null);
  const [chatFor, setChatFor] = useState<ProjectRequest | null>(null);

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewCompany, setReviewCompany] = useState("");
  const [reviewQuote, setReviewQuote] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/requests");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRequests(json.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const respondToQuote = async (quoteId: string, status: "accepted" | "declined") => {
    setResponding(quoteId);
    setError(null);
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage(`Quote ${status}.`);
      fetchRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to respond");
    } finally {
      setResponding(null);
    }
  };

  const submitReview = async () => {
    if (!reviewName || reviewQuote.length < 10) {
      setError("Please fill in your name and at least 10 characters of feedback.");
      return;
    }
    setSubmittingReview(true);
    setError(null);
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewName,
          company: reviewCompany,
          quote: reviewQuote,
          rating: reviewRating,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setReviewOpen(false);
      setReviewName("");
      setReviewCompany("");
      setReviewQuote("");
      setReviewRating(5);
      setMessage("Thank you! Your review was submitted and is pending approval.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="glass-strong rounded-2xl p-10 animate-pulse h-64" />;
  }

  const hasDelivered = requests.some((r) => r.status === "delivered");

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">{error}</div>
      )}
      {message && (
        <div className="p-4 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 text-sm">{message}</div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="font-heading font-semibold text-white">
          My Projects ({requests.length})
        </h3>
        {hasDelivered && (
          <Button variant="outline" onClick={() => setReviewOpen(true)}>
            <Star size={16} /> Leave a Review
          </Button>
        )}
      </div>

      {requests.length === 0 ? (
        <div className="glass-strong rounded-2xl p-10 text-center">
          <p className="text-muted mb-6">
            No project requests yet. Submit one through the contact form and
            track its progress here.
          </p>
          <Button href="/contact" variant="primary">
            Start a Project
          </Button>
        </div>
      ) : (
        requests.map((req) => (
          <div key={req.id} className="glass-strong rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-heading font-semibold text-white capitalize">
                  {req.service} Project
                  {req.is_owner === false && (
                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-crystal-blue/20 text-crystal-cyan align-middle">
                      Assigned to you
                    </span>
                  )}
                </h4>
                <p className="text-xs text-muted">
                  Submitted {new Date(req.created_at).toLocaleDateString()}
                </p>
              </div>
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  statusStyles[req.status]
                )}
              >
                {statusLabels[req.status]}
              </span>
            </div>

            <p className="text-sm text-muted line-clamp-3">{req.details}</p>

            {(req.assignments || []).length > 0 && (
              <p className="text-xs text-muted">
                Team:{" "}
                <span className="text-white/80">
                  {(req.assignments || [])
                    .map((a) => a.developer?.email || "developer")
                    .join(", ")}
                </span>
              </p>
            )}

            <Button
              variant="outline"
              onClick={() => setChatFor(req)}
              className="text-sm py-2"
            >
              <MessageCircle size={16} /> Project Chat
            </Button>

            {(req.quotes || []).map((quote) => (
              <div key={quote.id} className="glass rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-white font-semibold">
                      Quote: {quote.currency} {Number(quote.amount).toLocaleString()}
                    </p>
                    {quote.description && (
                      <p className="text-sm text-muted mt-1">{quote.description}</p>
                    )}
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      quote.status === "pending" && "bg-yellow-500/20 text-yellow-300",
                      quote.status === "accepted" && "bg-green-500/20 text-green-300",
                      quote.status === "declined" && "bg-red-500/20 text-red-300"
                    )}
                  >
                    {quote.status}
                  </span>
                </div>
                {quote.status === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={() => respondToQuote(quote.id, "accepted")}
                      isLoading={responding === quote.id}
                      className="text-sm py-2"
                    >
                      Accept Quote
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => respondToQuote(quote.id, "declined")}
                      className="text-sm py-2"
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}

      <Modal
        isOpen={!!chatFor}
        onClose={() => setChatFor(null)}
        title={`Project Chat — ${chatFor ? `${chatFor.service.charAt(0).toUpperCase()}${chatFor.service.slice(1)}` : ""}`}
      >
        {chatFor && (
          <ProjectChat requestId={chatFor.id} currentUserId={profile.id} />
        )}
      </Modal>

      <Modal isOpen={reviewOpen} onClose={() => setReviewOpen(false)} title="Leave a Review">
        <div className="space-y-4">
          <div>
            <label htmlFor="review-name" className="block text-sm font-medium text-white mb-2">
              Your Name <span className="text-crystal-cyan">*</span>
            </label>
            <input id="review-name" className={inputClass()} value={reviewName} onChange={(e) => setReviewName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="review-company" className="block text-sm font-medium text-white mb-2">
              Company <span className="text-muted text-xs font-normal">(optional)</span>
            </label>
            <input id="review-company" className={inputClass()} value={reviewCompany} onChange={(e) => setReviewCompany(e.target.value)} />
          </div>
          <div>
            <span className="block text-sm font-medium text-white mb-2">Rating</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  className="p-1"
                >
                  <Star
                    size={24}
                    className={
                      star <= reviewRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-white/20"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="review-quote" className="block text-sm font-medium text-white mb-2">
              Your Feedback <span className="text-crystal-cyan">*</span>
            </label>
            <textarea
              id="review-quote"
              rows={4}
              className={cn(inputClass(), "resize-y")}
              placeholder="Tell us about your experience..."
              value={reviewQuote}
              onChange={(e) => setReviewQuote(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" onClick={submitReview} isLoading={submittingReview}>
              Submit Review
            </Button>
            <Button variant="ghost" onClick={() => setReviewOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
