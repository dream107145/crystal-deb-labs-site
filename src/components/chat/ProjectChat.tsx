"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { ProjectMessage } from "@/types/database";

interface ProjectChatProps {
  requestId: string;
  currentUserId: string;
}

function SenderAvatar({
  email,
  avatarUrl,
}: {
  email?: string;
  avatarUrl?: string | null;
}) {
  return (
    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-crystal-blue/20 border border-white/10 shrink-0">
      {avatarUrl ? (
        <Image src={avatarUrl} alt={email || "User"} fill className="object-cover" sizes="32px" />
      ) : (
        <span className="w-full h-full flex items-center justify-center text-crystal-cyan font-semibold text-xs">
          {(email || "?").charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function ProjectChat({ requestId, currentUserId }: ProjectChatProps) {
  const [messages, setMessages] = useState<ProjectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/requests/${requestId}/messages`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessages(json.messages || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load chat");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchMessages();

    const supabase = createClient();
    const channel = supabase
      .channel(`project-chat-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "project_messages",
          filter: `request_id=eq.${requestId}`,
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const sendMessage = async () => {
    const body = draft.trim();
    if (!body || sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`/api/requests/${requestId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setDraft("");
      fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[28rem]">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted text-sm">
            Loading chat…
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted text-sm text-center px-6">
            No messages yet. Say hello to kick off the conversation.
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div
                key={m.id}
                className={cn("flex items-end gap-2", mine && "flex-row-reverse")}
              >
                <SenderAvatar email={m.sender?.email} avatarUrl={m.sender?.avatar_url} />
                <div className={cn("max-w-[75%]", mine && "text-right")}>
                  <div
                    className={cn(
                      "inline-block px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words text-left",
                      mine
                        ? "bg-crystal-blue/30 text-white rounded-br-sm"
                        : "bg-white/10 text-white rounded-bl-sm"
                    )}
                  >
                    {m.body}
                  </div>
                  <p className="text-[10px] text-muted/70 mt-1 px-1">
                    {!mine && m.sender?.email && (
                      <span>
                        {m.sender.email}
                        {m.sender.role === "admin" && " (admin)"}
                        {m.sender.role === "developer" && " (developer)"}
                        {" · "}
                      </span>
                    )}
                    {new Date(m.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="text-xs text-red-300 mt-2">{error}</p>
      )}

      <div className="flex items-end gap-2 mt-3 pt-3 border-t border-white/10">
        <textarea
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message…"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-muted/60 focus:outline-none focus:border-crystal-cyan/50 resize-none"
        />
        <button
          type="button"
          onClick={sendMessage}
          disabled={sending || !draft.trim()}
          aria-label="Send message"
          className="p-2.5 rounded-xl bg-crystal-blue/30 text-crystal-cyan hover:bg-crystal-blue/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
