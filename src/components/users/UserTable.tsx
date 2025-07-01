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
import { patchUserStatus, deleteUser } from "@/lib/services/userServices";
import { useSession } from "next-auth/react";
import { Input } from "../ui/input";
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
  const [userList, setUserList] = useState<User[]>(users);
  const [selectedIds, setSelectedIds] = useState<number[]>([]); // ✅ selection state
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
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(userId, token);
      setUserList(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("Error deleting user");
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
    if (!confirm(`Delete ${selectedIds.length} selected users?`)) return;

    try {
      await Promise.all(selectedIds.map(id => deleteUser(id, token)));
      setUserList(prev => prev.filter(user => !selectedIds.includes(user.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Failed to delete selected users:", error);
      alert("Error deleting selected users");
    }
  };

  return (
    <div className="p-4">
      {/* ✅ Delete selected button */}
      {selectedIds.length > 0 && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="destructive"
            onClick={handleDeleteSelected}
          >
            Delete Selected ({selectedIds.length})
          </Button>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Users</h2>

        <div className="flex gap-2">
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button asChild>
            <Link href="/users/create">+ Create</Link>
          </Button>
        </div>
      </div>


      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead> {/* checkbox column */}
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                  />
                </TableCell>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.primary_role}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs cursor-pointer ${user.status === "archived"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-green-100 text-green-800"
                      }`}
                    onClick={() => toggleStatus(user.id, user.status)}
                    title="Click to toggle status"
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" asChild>
                    <Link href={`/users/${user.id}`}>Edit</Link>
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
