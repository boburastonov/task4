/**
 * IMPORTANT: Authentication-related type definitions
 * NOTE: Ensures type safety for all auth operations
 * NOTE: Used across login, register, and user management
 */

/**
 * IMPORTANT: User interface - represents a user in the system
 */
export interface User {
  id: number;
  name: string;
  email: string;
  status: "unverified" | "active" | "blocked";
  lastLogin: Date | null;
  registrationTime: Date;
}

/**
 * IMPORTANT: Login credentials interface
 * NOTE: Used for login form submission
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * IMPORTANT: Registration credentials interface
 * NOTE: Used for registration form submission
 * NOTA BENE: Password can be any non-empty string (even 1 character)
 */
export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * IMPORTANT: Auth response from login endpoint
 * NOTE: Contains JWT token and user data
 */
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

/**
 * IMPORTANT: Registration response from register endpoint
 * NOTE: User is registered immediately, email sent asynchronously
 */
export interface RegisterResponse {
  message: string;
  user: User;
}

/**
 * IMPORTANT: Email verification request
 * NOTE: Token comes from email link
 */
export interface EmailVerificationRequest {
  token: string;
}

/**
 * IMPORTANT: Email verification response
 * NOTE: Changes status from "unverified" to "active"
 * Blocked status remains "blocked"
 */
export interface EmailVerificationResponse {
  message: string;
  user?: User;
}

/**
 * IMPORTANT: Error response from API
 * NOTE: Standardized error format
 */
export interface AuthError {
  message: string;
  errors?: {
    field: string;
    message: string;
  }[];
  statusCode?: number;
}

/**
 * IMPORTANT: JWT token payload interface
 * NOTE: Decoded token structure
 */
export interface TokenPayload {
  userId: number;
  email: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

/**
 * IMPORTANT: Auth context type
 * NOTE: Used for React Context API if implementing global auth state
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

/**
 * IMPORTANT: Password reset request (optional - for future)
 * NOTE: Can be implemented later if needed
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * IMPORTANT: Password reset response (optional - for future)
 */
export interface PasswordResetResponse {
  message: string;
}

/**
 * IMPORTANT: Change password request (optional - for future)
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * IMPORTANT: Auth state for localStorage
 * NOTE: What gets stored in browser storage
 */
export interface AuthState {
  token: string | null;
  user: User | null;
}

/**
 * IMPORTANT: Login form state
 * NOTE: Used in LoginForm component
 */
export interface LoginFormState {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * IMPORTANT: Register form state
 * NOTE: Used in RegisterForm component
 */
export interface RegisterFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms?: boolean;
}

/**
 * IMPORTANT: API request configuration
 * NOTE: Generic type for API calls
 */
export interface ApiRequestConfig {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  data?: any;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

/**
 * IMPORTANT: API response wrapper
 * NOTE: Generic type for API responses
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: AuthError;
}

/**
 * IMPORTANT: User status enum (alternative to union type)
 * NOTE: Can be used instead of string literals
 */
export enum UserStatus {
  UNVERIFIED = "unverified",
  ACTIVE = "active",
  BLOCKED = "blocked",
}

/**
 * IMPORTANT: Auth action types (for Redux/Context if used)
 * NOTE: Action type constants
 */
export enum AuthActionType {
  LOGIN_REQUEST = "LOGIN_REQUEST",
  LOGIN_SUCCESS = "LOGIN_SUCCESS",
  LOGIN_FAILURE = "LOGIN_FAILURE",
  REGISTER_REQUEST = "REGISTER_REQUEST",
  REGISTER_SUCCESS = "REGISTER_SUCCESS",
  REGISTER_FAILURE = "REGISTER_FAILURE",
  LOGOUT = "LOGOUT",
  SET_USER = "SET_USER",
  CLEAR_ERROR = "CLEAR_ERROR",
}

/**
 * IMPORTANT: Auth actions (for Redux/Context if used)
 * NOTE: Action interfaces
 */
export type AuthAction =
  | { type: AuthActionType.LOGIN_REQUEST }
  | {
      type: AuthActionType.LOGIN_SUCCESS;
      payload: { user: User; token: string };
    }
  | { type: AuthActionType.LOGIN_FAILURE; payload: { error: string } }
  | { type: AuthActionType.REGISTER_REQUEST }
  | { type: AuthActionType.REGISTER_SUCCESS; payload: { user: User } }
  | { type: AuthActionType.REGISTER_FAILURE; payload: { error: string } }
  | { type: AuthActionType.LOGOUT }
  | { type: AuthActionType.SET_USER; payload: { user: User } }
  | { type: AuthActionType.CLEAR_ERROR };

/**
 * IMPORTANT: Validation error type
 * NOTE: Client-side validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * IMPORTANT: Form validation result
 * NOTE: Used in form validation functions
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * IMPORTANT: Type guards for runtime type checking
 * NOTE: Helps verify types at runtime
 */

/**
 * Check if error is an AuthError
 */
export function isAuthError(error: any): error is AuthError {
  return (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  );
}

/**
 * Check if user has valid status
 */
export function isValidUserStatus(status: string): status is User["status"] {
  return ["unverified", "active", "blocked"].includes(status);
}

/**
 * Check if user is authenticated (has valid token)
 */
export function hasValidToken(token: string | null): boolean {
  if (!token) return false;

  try {
    // NOTE: Simple token validation (check if expired)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;

    if (!exp) return true; // No expiration set

    return Date.now() < exp * 1000;
  } catch {
    return false;
  }
}

/**
 * IMPORTANT: Helper type for partial user updates
 * NOTE: Used when updating user profile
 */
export type UserUpdate = Partial<Omit<User, "id" | "registrationTime">>;

/**
 * IMPORTANT: Auth header helper type
 * NOTE: Used for setting Authorization header
 */
export interface AuthHeaders {
  Authorization: string;
}

/**
 * IMPORTANT: Create auth headers from token
 */
export function createAuthHeaders(token: string): AuthHeaders {
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * IMPORTANT: Storage keys constants
 * NOTE: Keys used in localStorage
 */
export const AUTH_STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  REMEMBER_ME: "rememberMe",
} as const;

/**
 * IMPORTANT: API endpoints constants
 * NOTE: All auth-related endpoints
 */
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  REFRESH_TOKEN: "/auth/refresh-token",
  ME: "/auth/me",
} as const;

/**
 * IMPORTANT: Error messages constants
 * NOTE: Reusable error messages
 */
export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password",
  USER_BLOCKED: "Your account has been blocked. Please contact administrator.",
  USER_NOT_FOUND: "User not found",
  EMAIL_ALREADY_EXISTS: "This email is already registered",
  WEAK_PASSWORD: "Password is too weak",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_TOKEN: "Invalid or expired token",
  NETWORK_ERROR: "Network error. Please try again.",
  UNKNOWN_ERROR: "An unexpected error occurred",
} as const;

/**
 * IMPORTANT: Success messages constants
 * NOTE: Reusable success messages
 */
export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  REGISTER_SUCCESS:
    "Registration successful! A confirmation email has been sent.",
  LOGOUT_SUCCESS: "Logout successful",
  EMAIL_VERIFIED: "Email verified successfully",
  PASSWORD_RESET_SENT: "Password reset email sent",
  PASSWORD_CHANGED: "Password changed successfully",
} as const;

/**
 * IMPORTANT: Validation rules
 * NOTE: Used for form validation
 */
export const VALIDATION_RULES = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: "Please enter a valid email address",
  },
  PASSWORD: {
    MIN_LENGTH: 1, // NOTE: Task allows minimum 1 character
    MESSAGE: "Password must be at least 1 character",
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    MESSAGE: "Name must be between 2 and 100 characters",
  },
} as const;

/**
 * IMPORTANT: Token expiration time
 * NOTE: Default token expiration (can be configured)
 */
export const TOKEN_EXPIRATION = {
  SHORT: 15 * 60 * 1000, // 15 minutes
  MEDIUM: 60 * 60 * 1000, // 1 hour
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  WEEK: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const;

export default {
  AUTH_STORAGE_KEYS,
  AUTH_ENDPOINTS,
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  VALIDATION_RULES,
  TOKEN_EXPIRATION,
};
