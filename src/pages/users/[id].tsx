"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchUserById, updateUser, updateUserRole } from "@/lib/services/userServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PrivateLayout from "@/components/layouts/PrivateLayout";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = router.query;
  const userId = Number(id);

  const { data: session, status } = useSession();
  const [form, setForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    role: "marketer",
    status: "active"
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleChanged, setRoleChanged] = useState(false);
  const [initialRole, setInitialRole] = useState("");

  useEffect(() => {
    if (!userId || status !== "authenticated") return;

    fetchUserById(userId, session.accessToken!)
      .then(user => {
        setForm({
          name: user.name,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email,
          role: user.primary_role || "marketer",
          status: user.status || "active"
        });
        setInitialRole(user.primary_role || "marketer");
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load user data");
      })
      .finally(() => setLoading(false));
  }, [userId, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Track if role has changed
    if (name === 'role') {
      setRoleChanged(value !== initialRole);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      // First update the user details (excluding role)
      const { role, ...userDetails } = form;
      await updateUser(userId, userDetails, session.accessToken);

      // Then update role separately if it was changed
      if (roleChanged) {
        await updateUserRole(userId, { role }, session.accessToken);
      }

      router.push("/users");
    } catch (err: any) {
      setError(err.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <PrivateLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <p>Loading...</p>
        </div>
      </PrivateLayout>
    );
  }

  if (!form.email) {
    return (
      <PrivateLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <p className="text-red-500">User not found.</p>
        </div>
      </PrivateLayout>
    );
  }

  if (session?.user?.primary_role !== "admin") {
    return (
      <PrivateLayout>
        <div className="h-[80vh] flex items-center justify-center">
          <p>Access denied.</p>
        </div>
      </PrivateLayout>
    );
  }

  return (
    <PrivateLayout>
      <div className="h-[80vh] flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-[400px] space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">Edit User</h1>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <Input
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            disabled
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="marketer">Marketer</option>
            <option value="admin">Admin</option>
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <div className="flex gap-4 pt-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/users")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </PrivateLayout>
  );
}