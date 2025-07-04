import { ScriptFormData } from "@/types/script"; // Define your types as needed

export const generateScript = async (formData: ScriptFormData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/scripts/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // or your auth token
      },
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      throw new Error('Failed to generate script');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating script:', error);
    throw error;
  }
};
import { ScriptsListResponse } from "@/types/script";

export async function fetchScripts(token: string): Promise<ScriptsListResponse> {
  const res = await fetch("http://127.0.0.1:8000/api/scripts", {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch scripts");

  return await res.json();
}

