"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUser } from "@/lib/api/users/userServices";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

export default function UserForm() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const token = session?.accessToken;
  const router = useRouter();

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
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md w-[400px] space-y-4"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {t("createUser")}
      </h1>

      {[
        { name: "name", label: t("fullName") },
        { name: "first_name", label: t("firstName") },
        { name: "last_name", label: t("lastName") },
        { name: "email", label: "Email", type: "email" },
        { name: "password", label: t("password"), type: "password" },
      ].map(({ name, label, type }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
          <Input
            name={name}
            type={type || "text"}
            placeholder={label}
            value={(form as any)[name]}
            onChange={handleChange}
            required
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="marketer">Marketer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <Button
        type="submit"
        className="w-full bg-[#78c400] hover:bg-[#599400] text-white font-semibold border border-[#5a9e00] shadow-sm transition-all duration-200 hover:shadow-md"
        disabled={loading}
      >
        {loading ? t("creating") : t("createUser")}
      </Button>
    </form>
  );
}
