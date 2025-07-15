// lib/api/axiosClient.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

class AxiosClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl.replace(/\/+$/, ''),
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for adding auth token
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error(`[AxiosClient] Request failed:`, error);
        
        if (error.response) {
          const errorMessage = error.response.data?.message || 
                             `Request failed with status ${error.response.status}`;
          throw new Error(errorMessage);
        }
        
        throw error;
      }
    );
  }

  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    token: string,
    body?: unknown
  ): Promise<T> {
    const config = {
      method,
      url: endpoint,
      headers: this.getAuthHeaders(token),
      data: body,
    };

    const response: AxiosResponse<T> = await this.client.request(config);
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }
    
    return response.data;
  }

  public async downloadFile(endpoint: string, token: string, filename: string): Promise<void> {
    try {
      const response = await this.client.get(endpoint, {
        headers: this.getAuthHeaders(token),
        responseType: 'blob',
      });

      this.triggerFileDownload(response.data, filename);
    } catch (error) {
      console.error(`[AxiosClient] Download failed:`, error);
      throw error;
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

export const axiosClient = new AxiosClient(process.env.NEXT_PUBLIC_API_URL!);