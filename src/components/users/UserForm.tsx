"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";

interface UserFormProps {
  initialData?: {
    id?: number;
    name: string;
    email: string;
    first_name?: string;
    last_name?: string;
    status?: string;
    primary_role: string;
    archived: boolean;
  };
  onSubmit: (data: any) => Promise<void>; // You can type this later
}

export default function UserForm({ initialData, onSubmit }: UserFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [firstName, setFirstName] = useState(initialData?.first_name || "");
  const [lastName, setLastName] = useState(initialData?.last_name || "");
  const [status, setStatus] = useState(initialData?.status || "active");
  const [primaryRole, setPrimaryRole] = useState(initialData?.primary_role || "user");
  const [archived, setArchived] = useState(initialData?.archived || false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        name,
        email,
        first_name: firstName,
        last_name: lastName,
        status,
        primary_role: primaryRole,
        archived,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="first_name">First Name</Label>
        <Input id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="last_name">Last Name</Label>
        <Input id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={primaryRole} onValueChange={setPrimaryRole}>
          <SelectTrigger>{primaryRole || "Select a role"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="marketer">Marketer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>{status || "Select status"}</SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Label htmlFor="archived">Archived</Label>
        <Switch id="archived" checked={archived} onCheckedChange={setArchived} />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" type="button" onClick={() => router.push("/users")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
