import axios from 'axios';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;
export async function loginUser(email: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
  return response.data.data;
}

export async function registerUser(name: string, email: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password });
  return response.data;
}

export async function refreshToken(refreshToken: string) {
  const response = await axios.post(`${API_BASE_URL}/refresh-token`, {
    refresh_token: refreshToken,
  });
  return response.data.data;
}

export async function logoutUser(token: string) {
  const response = await axios.post(
    `${API_BASE_URL}/logout`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}