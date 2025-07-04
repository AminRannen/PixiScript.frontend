import { User } from "@/types"; 
 
export async function fetchUsers(token: string): Promise<User[]> { 
  const res = await fetch("http://127.0.0.1:8000/api/users", { 
    headers: { 
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json", 
    }, 
  }); 
 
  if (!res.ok) { 
    throw new Error("Failed to fetch users"); 
  } 
 
  const data = await res.json(); 
 
  return data.map((user: any) => ({ 
    id: user.id, 
    name: user.name, 
    email: user.email, 
    first_name: user.first_name, 
    last_name: user.last_name, 
    status: user.status, 
    primary_role: user.primary_role, 
    role: user.role,
  })); 
} 

export async function fetchUserById(id: number, token: string): Promise<User> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  const user = await res.json();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
    primary_role: user.primary_role,
    created_at: user.created_at,
    updated_at: user.updated_at,
    archived: user.archived ?? false,
  };
}


export async function patchUserStatus(
  id: number, 
  status: string, 
  token: string
): Promise<User> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update user status");
  }

  const user = await res.json();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    status: user.status,
    primary_role: user.primary_role,
    archived: user.archived ?? false,
  };
  
}
export async function deleteUser(id: number, token: string): Promise<void> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }
}
export async function createUser(
  userData: {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  },
  token: string
): Promise<void> {
  const res = await fetch("http://127.0.0.1:8000/api/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to create user");
  }
}
export async function updateUser(
  id: number,
  updatedUser: Partial<User>, 
  token: string
): Promise<void> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedUser),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to update user");
  }
}
export async function updateUserRole(
  id: number,
  roleData: { role: string },
  token: string
): Promise<void> {
  const res = await fetch(`http://127.0.0.1:8000/api/users/${id}/role`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(roleData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to update user role");
  }
}