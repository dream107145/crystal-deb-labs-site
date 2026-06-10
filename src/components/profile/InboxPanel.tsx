"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Inbox, Reply } from "lucide-react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";
import { cn } from "@/lib/utils";
import type { Message } from "@/types/database";

type Folder = "inbox" | "sent";

interface Recipient {
  id: string;
  email: string;
  role: string;
}

export default function InboxPanel() {
  const [folder, setFolder] = useState<Folder>("inbox");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/messages/recipients")
      .then((res) => res.json())
      .then((json) => setRecipients(json.recipients || []))
      .catch(() => {});
  }, []);

  const fetchMessages = async (f: Folder) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?folder=${f}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessages(json.messages || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(folder);
    setSelected(null);
  }, [folder]);

  const openMessage = async (msg: Message) => {
    setSelected(msg);
    if (folder === "inbox" && !msg.is_read) {
      await fetch(`/api/messages/${msg.id}`, { method: "PATCH" });
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
    }
  };

  const startReply = (msg: Message) => {
    setComposeTo(msg.sender_id);
    setComposeSubject(msg.subject.startsWith("Re: ") ? msg.subject : `Re: ${msg.subject}`);
    setComposeBody("");
    setComposing(true);
  };

  const handleSend = async () => {
    if (!composeTo || !composeSubject || !composeBody) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_id: composeTo,
          subject: composeSubject,
          body: composeBody,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setComposing(false);
      setComposeTo("");
      setComposeSubject("");
      setComposeBody("");
      setFolder("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="glass-strong rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFolder("inbox")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
              folder === "inbox" ? "bg-crystal-blue/20 text-crystal-cyan" : "text-muted hover:text-white"
            )}
          >
            <Inbox size={16} /> Inbox
          </button>
          <button
            type="button"
            onClick={() => setFolder("sent")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
              folder === "sent" ? "bg-crystal-blue/20 text-crystal-cyan" : "text-muted hover:text-white"
            )}
          >
            <Send size={16} /> Sent
          </button>
        </div>
        <Button variant="outline" onClick={() => setComposing(true)}>
          Compose
        </Button>
      </div>

      {error && (
        <div className="p-4 text-red-300 text-sm border-b border-white/10">{error}</div>
      )}

      {composing ? (
        <div className="p-6 space-y-4">
          <h3 className="font-heading font-semibold text-white">New Message</h3>
          <select
            className={inputClass()}
            value={composeTo}
            onChange={(e) => setComposeTo(e.target.value)}
          >
            <option value="" className="bg-crystal-darker">
              Select recipient...
            </option>
            {recipients.map((r) => (
              <option key={r.id} value={r.id} className="bg-crystal-darker">
                {r.email} ({r.role})
              </option>
            ))}
          </select>
          <input
            className={inputClass()}
            placeholder="Subject"
            value={composeSubject}
            onChange={(e) => setComposeSubject(e.target.value)}
          />
          <textarea
            className={cn(inputClass(), "resize-y min-h-[120px]")}
            placeholder="Message body"
            value={composeBody}
            onChange={(e) => setComposeBody(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="primary" onClick={handleSend} isLoading={sending}>
              Send
            </Button>
            <Button variant="ghost" onClick={() => setComposing(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 min-h-[400px]">
          <div className="border-r border-white/10 overflow-y-auto max-h-[500px]">
            {loading ? (
              <p className="p-6 text-muted text-sm">Loading...</p>
            ) : messages.length === 0 ? (
              <p className="p-6 text-muted text-sm">No messages.</p>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg.id}
                  type="button"
                  onClick={() => openMessage(msg)}
                  className={cn(
                    "w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors",
                    selected?.id === msg.id && "bg-white/10",
                    !msg.is_read && folder === "inbox" && "border-l-2 border-l-crystal-cyan"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Mail size={14} className="text-crystal-cyan shrink-0" />
                    <span className="text-sm font-medium text-white truncate">
                      {msg.subject}
                    </span>
                  </div>
                  <p className="text-xs text-muted truncate">
                    {folder === "inbox"
                      ? msg.sender?.email
                      : msg.recipient?.email}
                  </p>
                </button>
              ))
            )}
          </div>
          <div className="p-6 overflow-y-auto">
            {selected ? (
              <>
                <h3 className="font-heading font-semibold text-white mb-2">{selected.subject}</h3>
                <p className="text-xs text-muted mb-4">
                  {folder === "inbox"
                    ? `From: ${selected.sender?.email}`
                    : `To: ${selected.recipient?.email}`}
                  {" · "}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
                <p className="text-muted whitespace-pre-wrap mb-4">{selected.body}</p>
                {folder === "inbox" && (
                  <Button
                    variant="outline"
                    onClick={() => startReply(selected)}
                    className="text-sm py-2"
                  >
                    <Reply size={16} /> Reply
                  </Button>
                )}
              </>
            ) : (
              <p className="text-muted text-sm">Select a message to read.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
