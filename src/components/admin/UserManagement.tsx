"use client";

import { useState, useEffect } from "react";
import { Check, X, Mail, Plus, Pencil, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { inputClass } from "@/components/forms/inputClass";
import type { Profile, UserRole } from "@/types/database";

const emptyUserForm = {
  email: "",
  password: "",
  role: "customer" as UserRole,
  is_approved: true,
  email_verified: true,
  telegram: "",
  discord_id: "",
};

export default function UserManagement() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [savingUser, setSavingUser] = useState(false);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailHtml, setEmailHtml] = useState("");
  const [sending, setSending] = useState(false);

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
    if (selected.size === users.length) setSelected(new Set());
    else setSelected(new Set(users.map((u) => u.id)));
  };

  const openCreate = () => {
    setEditingUser(null);
    setUserForm(emptyUserForm);
    setUserModalOpen(true);
  };

  const openEdit = (user: Profile) => {
    setEditingUser(user);
    setUserForm({
      email: user.email,
      password: "",
      role: user.role,
      is_approved: user.is_approved,
      email_verified: user.email_verified,
      telegram: user.telegram || "",
      discord_id: user.discord_id || "",
    });
    setUserModalOpen(true);
  };

  const handleSaveUser = async () => {
    setSavingUser(true);
    setError(null);
    try {
      if (editingUser) {
        const payload: Record<string, unknown> = {
          email: userForm.email,
          role: userForm.role,
          is_approved: userForm.is_approved,
          email_verified: userForm.email_verified,
          telegram: userForm.telegram || null,
          discord_id: userForm.discord_id || null,
        };
        if (userForm.password) payload.password = userForm.password;

        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? json.user : u)));
      } else {
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userForm.email,
            password: userForm.password,
            role: userForm.role,
            is_approved: userForm.is_approved,
            email_verified: userForm.email_verified,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setUsers((prev) => [json.user, ...prev]);
      }
      setUserModalOpen(false);
      setMessage(editingUser ? "User updated." : "User created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSavingUser(false);
    }
  };

  const handleDelete = async (user: Profile) => {
    if (!confirm(`Delete user ${user.email}?`)) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(user.id);
        return next;
      });
      setMessage("User deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleApprove = async (userId: string, approved: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: approved }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setUsers((prev) => prev.map((u) => (u.id === userId ? json.user : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    }
  };

  const openEmailModal = () => {
    setEmailSubject("");
    setEmailHtml("");
    setEmailModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!emailSubject || !emailHtml.replace(/<[^>]*>/g, "").trim()) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/users/bulk-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_ids: Array.from(selected),
          subject: emailSubject,
          html: emailHtml,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setMessage(`Email sent to ${json.sent} recipient(s).`);
      setEmailModalOpen(false);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email");
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
        <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-heading font-semibold text-white">Users ({users.length})</h3>
          <div className="flex flex-wrap items-center gap-2">
            {selected.size > 0 && (
              <Button variant="primary" onClick={openEmailModal}>
                <Mail size={16} /> Send Email ({selected.size})
              </Button>
            )}
            <Button variant="outline" onClick={openCreate}>
              <Plus size={16} /> Add User
            </Button>
            <button type="button" onClick={toggleAll} className="text-sm text-crystal-cyan hover:underline px-2">
              {selected.size === users.length ? "Deselect All" : "Select All"}
            </button>
          </div>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <button type="button" onClick={() => openEdit(user)} className="text-crystal-cyan hover:text-white" aria-label="Edit">
                        <Pencil size={16} />
                      </button>
                      <button type="button" onClick={() => handleDelete(user)} className="text-red-400 hover:text-red-300" aria-label="Delete">
                        <Trash2 size={16} />
                      </button>
                      {user.role === "developer" && !user.is_approved && (
                        <Button variant="outline" onClick={() => handleApprove(user.id, true)} className="text-xs py-1 px-3">
                          Approve
                        </Button>
                      )}
                      {user.role === "developer" && user.is_approved && (
                        <Button variant="ghost" onClick={() => handleApprove(user.id, false)} className="text-xs py-1 px-3">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={editingUser ? "Edit User" : "Create User"}
      >
        <div className="space-y-4">
          <input className={inputClass()} placeholder="Email" type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
          <input className={inputClass()} placeholder={editingUser ? "New password (optional)" : "Password"} type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
          <select className={inputClass()} value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value as UserRole })}>
            <option value="customer" className="bg-crystal-darker">Customer</option>
            <option value="developer" className="bg-crystal-darker">Developer</option>
            <option value="admin" className="bg-crystal-darker">Admin</option>
          </select>
          <input className={inputClass()} placeholder="Telegram" value={userForm.telegram} onChange={(e) => setUserForm({ ...userForm, telegram: e.target.value })} />
          <input className={inputClass()} placeholder="Discord ID" value={userForm.discord_id} onChange={(e) => setUserForm({ ...userForm, discord_id: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" checked={userForm.email_verified} onChange={(e) => setUserForm({ ...userForm, email_verified: e.target.checked })} className="accent-crystal-cyan" />
            Email verified
          </label>
          <label className="flex items-center gap-2 text-sm text-white">
            <input type="checkbox" checked={userForm.is_approved} onChange={(e) => setUserForm({ ...userForm, is_approved: e.target.checked })} className="accent-crystal-cyan" />
            Approved
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={handleSaveUser} isLoading={savingUser}>
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
            <Button variant="ghost" onClick={() => setUserModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        title={`Send Email to ${selected.size} User(s)`}
        className="max-w-4xl"
      >
        <div className="space-y-4">
          <input className={inputClass()} placeholder="Subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
          <RichTextEditor value={emailHtml} onChange={setEmailHtml} />
          <div className="flex gap-3 pt-2">
            <Button variant="primary" onClick={handleSendEmail} isLoading={sending}>
              Send Email
            </Button>
            <Button variant="ghost" onClick={() => setEmailModalOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
