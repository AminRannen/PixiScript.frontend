import { ScriptFormData, Script, ScriptsListResponse } from "@/types/script";
import { httpClient } from "@/pages/api/httpClient";

export async function generateScript(token: string, formData: ScriptFormData): Promise<Script> {
  return await httpClient
    .post<{ success: boolean; data: Script; message: string }>(
      "scripts/generate",
      token,
      formData
    )
    .then(res => res.data); // <- extract .data
}

// Fetch all scripts of current user
export async function fetchScripts(token: string): Promise<ScriptsListResponse> {
  return await httpClient.get<ScriptsListResponse>("my-scripts", token);
}

// Fetch a script by its ID
export async function fetchScriptById(token: string, id: number): Promise<Script> {
  return await httpClient.get<{ data: Script }>(`scripts/${id}`, token).then(res => res.data);
}

// Fetch shared scripts
export async function fetchSharedScripts(token: string): Promise<Script[]> {
  const { shares } = await httpClient.get<{ shares: any[] }>("script-shares/me", token);

  const scripts = await Promise.all(
    shares.map(item =>
      fetchScriptById(token, item.script_id)
    )
  );

  return scripts;
}
