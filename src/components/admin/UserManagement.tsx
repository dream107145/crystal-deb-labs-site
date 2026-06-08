"use client";

import { useState, useEffect } from "react";
import { Check, X, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { inputClass } from "@/components/forms/inputClass";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUsers(json.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === users.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(users.map((u) => u.id)));
    }
  };

  const handleApprove = async (userId: string, approved: boolean) => {
    try {
      const res = await fetch("/api/admin/users/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, approved }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUsers((prev) => prev.map((u) => (u.id === userId ? json.user : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  const handleBulkEmail = async () => {
    if (selected.size === 0 || !bulkSubject || !bulkBody) return;
    setSending(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/users/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_ids: Array.from(selected),
          subject: bulkSubject,
          body: bulkBody,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage(`Email sent to ${json.sent} recipient(s).`);
      setBulkSubject("");
      setBulkBody("");
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bulk email failed");
    } finally {
      setSending(false);
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

      <div className="glass-strong rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-heading font-semibold text-white">Users ({users.length})</h3>
          <button type="button" onClick={toggleAll} className="text-sm text-crystal-cyan hover:underline">
            {selected.size === users.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted border-b border-white/10">
                <th className="p-3 text-left w-10" />
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Verified</th>
                <th className="p-3 text-left">Approved</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(user.id)}
                      onChange={() => toggleSelect(user.id)}
                      className="accent-crystal-cyan"
                    />
                  </td>
                  <td className="p-3 text-white">{user.email}</td>
                  <td className="p-3 capitalize text-muted">{user.role}</td>
                  <td className="p-3">
                    {user.email_verified ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <X size={16} className="text-red-400" />
                    )}
                  </td>
                  <td className="p-3">
                    {user.is_approved ? (
                      <Check size={16} className="text-green-400" />
                    ) : (
                      <X size={16} className="text-yellow-400" />
                    )}
                  </td>
                  <td className="p-3">
                    {user.role === "developer" && !user.is_approved && (
                      <Button
                        variant="outline"
                        onClick={() => handleApprove(user.id, true)}
                        className="text-xs py-1 px-3"
                      >
                        Approve
                      </Button>
                    )}
                    {user.role === "developer" && user.is_approved && (
                      <Button
                        variant="ghost"
                        onClick={() => handleApprove(user.id, false)}
                        className="text-xs py-1 px-3"
                      >
                        Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6 space-y-4">
        <h3 className="font-heading font-semibold text-white flex items-center gap-2">
          <Mail size={18} /> Bulk Email via Resend
        </h3>
        <p className="text-muted text-sm">
          {selected.size > 0
            ? `${selected.size} user(s) selected`
            : "Select users above to send bulk email"}
        </p>
        <input
          className={inputClass()}
          placeholder="Email subject"
          value={bulkSubject}
          onChange={(e) => setBulkSubject(e.target.value)}
        />
        <textarea
          className={cn(inputClass(), "resize-y min-h-[120px]")}
          placeholder="Email body (plain text)"
          value={bulkBody}
          onChange={(e) => setBulkBody(e.target.value)}
        />
        <Button
          variant="primary"
          onClick={handleBulkEmail}
          isLoading={sending}
          disabled={selected.size === 0}
        >
          Send to {selected.size || 0} Users
        </Button>
      </div>
    </div>
  );
}
