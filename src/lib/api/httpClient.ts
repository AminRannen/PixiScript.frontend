type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.replace(/^\/+/, '');
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    token: string,
    body?: unknown
  ): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers: HeadersInit = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const options: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      return response.status === 204 ? ({} as T) : await response.json();
    } catch (err) {
      console.error(`[HttpClient] ${method} ${url} failed:`, err);
      throw err;
    }
  }

  private async parseErrorResponse(response: Response): Promise<{ message?: string }> {
    try {
      return await response.json();
    } catch {
      return {};
    }
  }

  public async File(endpoint: string, token: string, filename: string): Promise<void> {
    const url = this.buildUrl(endpoint);
    const options: RequestInit = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(errorData.message || `Download failed with status ${response.status}`);
      }

      const blob = await response.blob();
      this.triggerFileDownload(blob, filename);
    } catch (err) {
      console.error(`[HttpClient] Download failed:`, err);
      throw err;
    }
  }

  private triggerFileDownload(blob: Blob, filename: string): void {
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);
  }

  // CRUD Methods
  public get<T>(endpoint: string, token: string): Promise<T> {
    return this.request<T>(endpoint, 'GET', token);
  }

  public post<T>(endpoint: string, token: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, 'POST', token, body);
  }

  public put<T>(endpoint: string, token: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, 'PUT', token, body);
  }

  public patch<T>(endpoint: string, token: string, body: unknown): Promise<T> {
    return this.request<T>(endpoint, 'PATCH', token, body);
  }

  public delete<T>(endpoint: string, token: string): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', token);
  }

  // Specific API Methods
  public async getMyScripts<T>(token: string): Promise<T> {
    return this.request<T>('my-scripts', 'GET', token);
  }

  public improveScript<T>(scriptId: number, token: string, prompt: string): Promise<T> {
    return this.request<T>(`scripts/${scriptId}/improve`, 'POST', token, { prompt });
  }
}

export const httpClient = new HttpClient(process.env.NEXT_PUBLIC_API_URL!);