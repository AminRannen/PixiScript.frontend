// services/userService.ts
import { axiosClient } from "@/lib/api/axiosClient";
import { User } from "@/types";

export async function fetchUsers(token: string): Promise<User[]> {
  const data = await axiosClient.get<any[]>("users", token);
  return data.map(user => ({
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
  return await axiosClient.get<User>(`users/${id}`, token);
}

export async function patchUserStatus(id: number, status: string, token: string): Promise<User> {
  return await axiosClient.patch<User>(`users/${id}/status`, token, { status });
}

export async function deleteUser(id: number, token: string): Promise<void> {
  await axiosClient.delete<void>(`users/${id}`, token);
}

export async function createUser(userData: any, token: string): Promise<void> {
  await axiosClient.post<void>("users", token, userData);
}

export async function updateUser(id: number, updatedUser: Partial<User>, token: string): Promise<void> {
  await axiosClient.put<void>(`users/${id}`, token, updatedUser);
}

export async function updateUserRole(id: number, roleData: { role: string }, token: string): Promise<void> {
  await axiosClient.put<void>(`users/${id}/role`, token, roleData);
}