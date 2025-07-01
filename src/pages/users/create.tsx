"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { createUser } from "@/lib/services/userServices";
import { useTranslation } from 'react-i18next';

export default function CreateUserPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.accessToken;

  const [form, setForm] = useState({
    name: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "marketer",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      await createUser(form, token);
      router.push("/users");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PrivateLayout>
      <div className="h-[80vh] flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-md w-[400px] space-y-4"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">{t('createUser')}</h1>

          <Input
            name="name"
            placeholder={t("fullName")}
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="first_name"
            placeholder={t("firstName")}
            value={form.first_name}
            onChange={handleChange}
            required
          />
          <Input
            name="last_name"
            placeholder={t("lastName")}
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
          />
          <Input
            name="password"
            type="password"
            placeholder={t("password")}
            value={form.password}
            onChange={handleChange}
            required
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

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </div>
    </PrivateLayout>
  );
}
