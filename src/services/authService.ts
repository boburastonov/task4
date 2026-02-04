import api from "./api";

interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    status: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    status: string;
  };
}

export const authService = {
  /**
   * IMPORTANT: Login user
   * NOTE: Returns token and user data
   * @param email
   * @param password
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  /**
   * IMPORTANT: Register new user
   * NOTE: User is registered immediately
   * Database unique index ensures email uniqueness
   * @param data - Registration data (name, email, password)
   */
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  /**
   * IMPORTANT: Verify email using token from confirmation email
   * NOTE: Changes status from "unverified" to "active"
   * NOTE: Blocked status remains blocked
   * @param token - Verification token from email link
   */
  verifyEmail: async (token: string): Promise<{ message: string }> => {
    const response = await api.post("/auth/verify-email", { token });
    return response.data;
  },

  /**
   * IMPORTANT: Logout user
   * NOTE: Clears token from localStorage
   */
  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * IMPORTANT: Check if user is authenticated
   * NOTE: Checks for token in localStorage
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("token");
  },

  /**
   * IMPORTANT: Get current user from localStorage
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
