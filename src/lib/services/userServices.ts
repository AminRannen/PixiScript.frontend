// services/userService.ts
import { httpClient } from "@/pages/api/httpClient";
import { User } from "@/types";

export async function fetchUsers(token: string): Promise<User[]> {
  const data = await httpClient.get<any[]>("users", token);
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
  return await httpClient.get<User>(`users/${id}`, token);
}

export async function patchUserStatus(id: number, status: string, token: string): Promise<User> {
  return await httpClient.patch<User>(`users/${id}/status`, token, { status });
}

export async function deleteUser(id: number, token: string): Promise<void> {
  await httpClient.delete<void>(`users/${id}`, token);
}

export async function createUser(userData: any, token: string): Promise<void> {
  await httpClient.post<void>("users", token, userData);
}

export async function updateUser(id: number, updatedUser: Partial<User>, token: string): Promise<void> {
  await httpClient.put<void>(`users/${id}`, token, updatedUser);
}

export async function updateUserRole(id: number, roleData: { role: string }, token: string): Promise<void> {
  await httpClient.put<void>(`users/${id}/role`, token, roleData);
}
