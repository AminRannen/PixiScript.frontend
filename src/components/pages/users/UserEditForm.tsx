"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchUserById, updateUser, updateUserRole } from "@/lib/api/users/userServices";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function UserEditForm() {
  const { t } = useTranslation();
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
    status: "active",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleChanged, setRoleChanged] = useState(false);
  const [initialRole, setInitialRole] = useState("");

  useEffect(() => {
    if (!userId || status !== "authenticated") return;

    fetchUserById(userId, session.accessToken!)
      .then((user) => {
        setForm({
          name: user.name,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          email: user.email,
          role: user.primary_role || "marketer",
          status: user.status || "active",
        });
        setInitialRole(user.primary_role || "marketer");
      })
      .catch(() => setError(t("updateError")))
      .finally(() => setLoading(false));
  }, [userId, status, session?.accessToken, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "role") {
      setRoleChanged(value !== initialRole);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.accessToken) return;

    setLoading(true);
    setError(null);

    try {
      const { role, ...userDetails } = form;
      await updateUser(userId, userDetails, session.accessToken);
      if (roleChanged) {
        await updateUserRole(userId, { role }, session.accessToken);
      }
      router.push("/users");
    } catch (err: any) {
      setError(err.message || t("updateError"));
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return <p>{t("loading")}...</p>;
  }

  if (!form.email) {
    return <p className="text-red-500">{t("userNotFound")}</p>;
  }

  if (session?.user?.primary_role !== "admin") {
    return <p>{t("accessDenied")}</p>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-md w-[400px] space-y-4"
    >
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
        {t("editUser")}
      </h1>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {[
        { name: "name", label: t("fullName") },
        { name: "first_name", label: t("firstName") },
        { name: "last_name", label: t("lastName") },
        { name: "email", label: t("email"), type: "email", disabled: true },
      ].map(({ name, label, type, disabled }) => (
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
            disabled={disabled}
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("role")}
        </label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="marketer">{t("marketer")}</option>
          <option value="admin">{t("admin")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("status")}
        </label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="active">{t("active")}</option>
          <option value="archived">{t("archived")}</option>
        </select>
      </div>

      <div className="flex gap-4 pt-2">
        <Button
          type="submit"
          className="flex-1 bg-[#78c400] hover:bg-[#599400] text-white font-semibold border border-[#5a9e00] shadow-sm"
          disabled={loading}
        >
          {loading ? `${t("updating")}...` : t("updateUser")}
        </Button>
        <Button
          type="button"
          className="flex-1 bg-[#EAEEEB] hover:bg-[#DCE0DC] text-gray-700"
          onClick={() => router.push("/users")}
        >
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
