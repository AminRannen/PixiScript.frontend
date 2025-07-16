// services/scriptService.ts
import { ScriptFormData, Script, ScriptsListResponse } from "@/types/script";
import { axiosClient } from "@/lib/api/axiosClient";

export async function generateScript(token: string, formData: ScriptFormData): Promise<Script> {
  return await axiosClient
    .post<{ success: boolean; data: Script; message: string }>(
      "scripts/generate",
      token,
      formData
    )
    .then(res => res.data);
}

export async function fetchScripts(token: string): Promise<ScriptsListResponse> {
  return await axiosClient.get<ScriptsListResponse>("my-scripts", token);
}

export async function fetchScriptById(token: string, id: number): Promise<Script> {
  return await axiosClient.get<{ data: Script }>(`scripts/${id}`, token).then(res => res.data);
}

export async function fetchSharedScripts(token: string): Promise<Script[]> {
  const { shares } = await axiosClient.get<{ shares: any[] }>("script-shares/me", token);
  
  const scripts = await Promise.all(
    shares.map(item =>
      fetchScriptById(token, item.script_id)
    )
  );
  
  return scripts;
}

export async function improveScript(token: string, scriptId: number, prompt: string): Promise<string> {
  return await axiosClient
    .improveScript<{ success: boolean; modified_script: string }>(scriptId, token, prompt)
    .then(res => res.modified_script);
}

export async function downloadScriptPdf(token: string, scriptId: number): Promise<void> {
  try {
    await axiosClient.downloadFile(
      `scripts/${scriptId}/download-pdf`,
      token,
      `script-${scriptId}.pdf`
    );
  } catch (error) {
    console.error('PDF download failed:', error);
    throw error;
  }
}
export async function updateScript(token: string, scriptId: number, scriptData: Partial<Script>): Promise<Script> {
  return await axiosClient
    .updateScript<{ success: boolean; data: Script; message: string }>(scriptId, token, scriptData)
    .then(res => res.data);
}