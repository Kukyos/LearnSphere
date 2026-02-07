const API_BASE_URL = 'http://localhost:5001';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

interface AuthResponse {
  user: UserData;
  token: string;
}

class AuthAPI {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      const data = await response.json();
      
      // If response is not ok and data doesn't have success, mark it as failed
      if (!response.ok && !data.success) {
        console.error('API error response:', data);
      }
      
      return data;
    } catch (error: any) {
      console.error('API request failed:', error);
      const errorMessage = error?.message || 'Network error. Please check your connection.';
      console.error('Full error:', error);
      return {
        success: false,
        message: `Network error: ${errorMessage}`,
      };
    }
  }

  async register(
    name: string,
    email: string,
    password: string,
    role: string = 'learner'
  ): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  }

  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async forgotPassword(email: string): Promise<ApiResponse<{ resetToken?: string; debug?: { resetToken: string; expiresAt: string; note: string } }>> {
    return this.request('/auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return this.request('/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
  }

  async getProfile(): Promise<ApiResponse<{ user: UserData }>> {
    return this.request('/auth/me');
  }

  // Token management
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authAPI = new AuthAPI();
export type { UserData, AuthResponse, ApiResponse };
