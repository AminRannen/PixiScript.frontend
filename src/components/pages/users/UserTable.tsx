"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { patchUserStatus, deleteUser } from "@/lib/api/users/userServices";
import { useSession } from "next-auth/react";
import { Input } from "../../ui/input";
import { useTranslation } from "react-i18next";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  primary_role: string;
  status: string;
}

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const { t } = useTranslation();
  const [userList, setUserList] = useState<User[]>(users);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const token = session?.accessToken;

  const toggleStatus = async (userId: number, currentStatus: string) => {
    if (!token) return console.error("No token available");
    const newStatus = currentStatus === "active" ? "archived" : "active";

    try {
      await patchUserStatus(userId, newStatus, token);
      setUserList(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Failed to toggle user status:", error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!token) return console.error("No token available");
    if (!confirm(t("updateError"))) return;

    try {
      await deleteUser(userId, token);
      setUserList(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert(t("updateError"));
    }
  };

  const handleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (!token) return console.error("No token available");
    if (selectedIds.length === 0) return;
    if (!confirm(t("updateError"))) return;

    try {
      await Promise.all(selectedIds.map(id => deleteUser(id, token)));
      setUserList(prev => prev.filter(user => !selectedIds.includes(user.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to delete selected users:", error);
      alert(t("updateError"));
    }
  };

  return (
    <div className="p-4">
      {selectedIds.length > 0 && (
        <div className="mb-4 flex justify-end">
          <Button
            className="bg-[#EF4E4E] hover:bg-[#E12D39] text-white font-medium border border-[#CF1124] shadow-sm transition-all duration-200 hover:shadow-md"
            onClick={handleDeleteSelected}
          >
            {t("deleteSelected", { count: selectedIds.length })}
          </Button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t("users")}</h2>

        <div className="flex gap-2">
          <Input
            placeholder={t("searchUsers")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button
            className="bg-[#78c400] hover:bg-[#599400] text-[#FFFFFF] font-semibold border border-[#5a9e00] shadow-sm transition-all duration-200 hover:shadow-md"
            asChild
          >
            <Link href="/users/create">+ {t("createUser")}</Link>
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>ID</TableHead>
            <TableHead>{t("firstName")}</TableHead>
            <TableHead>{t("lastName")}</TableHead>
            <TableHead>{t("email")}</TableHead>
            <TableHead>{t("role")}</TableHead>
            <TableHead>{t("status")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userList
            .filter(user =>
              `${user.first_name} ${user.last_name} ${user.email}`
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(user.id)}
                    onChange={() => handleSelect(user.id)}
                    className="w-4 h-4 accent-[#FFC200] cursor-pointer"
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{t(user.primary_role)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs cursor-pointer ${user.status === "archived"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-[#78c400] text-[#FAFAFA]"
                      }`}
                    onClick={() => toggleStatus(user.id, user.status)}
                    title={t("clickToToggleStatus")}
                  >
                    {t(user.status)}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    className="px-6 py-2 bg-[#78c400] hover:bg-[#599400] text-[#F7F7F7] duration-200"
                    asChild
                  >
                    <Link href={`/users/${user.id}`}>{t("editUser")}</Link>
                  </Button>
                  <Button
                    className="bg-[#EF4E4E] hover:bg-[#E12D39] text-white font-medium border border-[#CF1124] shadow-sm transition-all duration-200 hover:shadow-md"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    {t("delete")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
