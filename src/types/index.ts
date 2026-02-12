/**
 * IMPORTANT: Barrel export file for all types
 * NOTE: Allows cleaner imports across the app
 * Example: import { User, LoginCredentials } from '@/types';
 */

// Auth types
export type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  RegisterResponse,
  EmailVerificationRequest,
  EmailVerificationResponse,
  AuthError,
  TokenPayload,
  AuthContextType,
  PasswordResetRequest,
  PasswordResetResponse,
  ChangePasswordRequest,
  AuthState,
  LoginFormState,
  RegisterFormState,
  ApiRequestConfig,
  ApiResponse,
  AuthAction,
  ValidationError,
  ValidationResult,
  UserUpdate,
  AuthHeaders,
} from "./auth";

export {
  UserStatus,
  AuthActionType,
  isAuthError,
  isValidUserStatus,
  hasValidToken,
  createAuthHeaders,
  AUTH_STORAGE_KEYS,
  AUTH_ENDPOINTS,
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
  VALIDATION_RULES,
  TOKEN_EXPIRATION,
} from "./auth";

// User types (if you create a separate user.ts file)
export type { User as UserType } from "./user";
