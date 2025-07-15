"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import UserTable from "@/components/pages/users/UserTable";
import { fetchUsers, User } from "@/lib/api/users/userServices";
import PrivateLayout from "@/components/layouts/PrivateLayout";
import { patchUserStatus } from "@/lib/api/users/userServices";

export default function UsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetchUsers(session.accessToken!)
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [session, status]);

  if (status === "loading") return <p>Loading session...</p>;
  if (session?.user?.primary_role !== "admin") return <p>Access denied.</p>;

  return (
    <PrivateLayout>
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      {loading ? <p>Loading users...</p> : <UserTable users={users} />}
      
    </main>
    </PrivateLayout>
  );
}
