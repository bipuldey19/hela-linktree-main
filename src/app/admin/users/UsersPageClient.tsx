"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

export default function UsersPageClient({
  users: initialUsers,
  currentUserId,
}: {
  users: UserItem[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState(initialUsers);
  const { toast } = useToast();

  // Add user form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  // Change password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newOwnPassword, setNewOwnPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Edit user form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function addUser() {
    if (!newEmail || !newPassword) return;
    setAdding(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          name: newName || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create user");
      }
      const user = await res.json();
      setUsers((prev) => [...prev, user]);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      toast("Admin user created");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to create user", "error");
    } finally {
      setAdding(false);
    }
  }

  async function changeOwnPassword() {
    if (!currentPassword || !newOwnPassword) return;
    setChangingPassword(true);
    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword: newOwnPassword,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to change password");
      }
      setCurrentPassword("");
      setNewOwnPassword("");
      toast("Password changed successfully");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to change password", "error");
    } finally {
      setChangingPassword(false);
    }
  }

  function startEdit(user: UserItem) {
    setEditingId(user.id);
    setEditEmail(user.email);
    setEditName(user.name || "");
    setEditPassword("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditEmail("");
    setEditName("");
    setEditPassword("");
  }

  async function saveEdit() {
    if (!editingId) return;
    setSaving(true);
    try {
      const body: Record<string, string | null> = {};
      const currentUser = users.find((u) => u.id === editingId);
      if (editEmail !== currentUser?.email) body.email = editEmail;
      if (editName !== (currentUser?.name || ""))
        body.name = editName || null;
      if (editPassword) body.password = editPassword;

      if (Object.keys(body).length === 0) {
        cancelEdit();
        return;
      }

      const res = await fetch(`/api/users/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update user");
      }
      const updated = await res.json();
      setUsers((prev) =>
        prev.map((u) => (u.id === editingId ? updated : u))
      );
      cancelEdit();
      toast("User updated");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update user", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(id: string) {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete user");
      }
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast("User deleted");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete user", "error");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        User Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Change own password */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">
            Change Your Password
          </h3>
          <div className="space-y-3">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <Input
              label="New Password"
              type="password"
              value={newOwnPassword}
              onChange={(e) => setNewOwnPassword(e.target.value)}
              placeholder="Min 6 characters"
            />
            <Button
              onClick={changeOwnPassword}
              loading={changingPassword}
              size="sm"
            >
              Update Password
            </Button>
          </div>
        </div>

        {/* Add new admin */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Add New Admin</h3>
          <div className="space-y-3">
            <Input
              label="Name (optional)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Admin name"
            />
            <Input
              label="Email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="admin@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Min 6 characters"
            />
            <Button onClick={addUser} loading={adding} size="sm">
              Add Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Users list */}
      <div className="bg-white rounded-xl border border-gray-200 mt-6 max-w-4xl">
        <div className="px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Admin Users ({users.length})
          </h3>
        </div>
        <ul className="divide-y divide-gray-100">
          {users.map((user) => (
            <li key={user.id} className="px-5 py-4">
              {editingId === user.id ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                    <Input
                      label="Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>
                  <Input
                    label="New Password (leave blank to keep current)"
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                  />
                  <div className="flex items-center gap-2">
                    <Button onClick={saveEdit} loading={saving} size="sm">
                      Save
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || user.email}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(user)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
