
class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private buildUrl(endpoint: string): string {
    const cleanEndpoint = endpoint.replace(/^\/+/, "");
    return `${this.baseUrl}/${cleanEndpoint}`;
  }

  private async request<T>(
    endpoint: string,
    method: string,
    token: string,
    body?: any
  ): Promise<T> {
    const headers: HeadersInit = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined) {
      options.body = JSON.stringify(body);
    }

    const url = this.buildUrl(endpoint);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (err) {
      console.error(`[HttpClient] ${method} ${url} failed:`, err);
      throw err;
    }
  }

  public get<T>(endpoint: string, token: string): Promise<T> {
    return this.request<T>(endpoint, "GET", token);
  }

  public post<T>(endpoint: string, token: string, body: any): Promise<T> {
    return this.request<T>(endpoint, "POST", token, body);
  }

  public put<T>(endpoint: string, token: string, body: any): Promise<T> {
    return this.request<T>(endpoint, "PUT", token, body);
  }

  public patch<T>(endpoint: string, token: string, body: any): Promise<T> {
    return this.request<T>(endpoint, "PATCH", token, body);
  }

  public delete<T>(endpoint: string, token: string): Promise<T> {
    return this.request<T>(endpoint, "DELETE", token);
  }

    public async getMyScripts<T>(token: string): Promise<T> {
    return this.request<T>("my-scripts", "GET", token);
  }
}

export const httpClient = new HttpClient(process.env.NEXT_PUBLIC_API_URL!);
