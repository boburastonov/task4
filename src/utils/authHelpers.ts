import {
  LoginCredentials,
  RegisterCredentials,
  ValidationResult,
  ValidationError,
  VALIDATION_RULES,
} from "../types/auth";

/**
 * IMPORTANT: Authentication helper functions
 * NOTE: Reusable validation and utility functions
 */

/**
 * IMPORTANT: Validate email format
 * @param email - Email to validate
 */
export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: "email", message: "Email is required" };
  }

  if (!VALIDATION_RULES.EMAIL.PATTERN.test(email)) {
    return { field: "email", message: VALIDATION_RULES.EMAIL.MESSAGE };
  }

  return null;
}

/**
 * IMPORTANT: Validate password
 * NOTE: Task allows minimum 1 character
 * @param password - Password to validate
 */
export function validatePassword(password: string): ValidationError | null {
  if (!password) {
    return { field: "password", message: "Password is required" };
  }

  if (password.length < VALIDATION_RULES.PASSWORD.MIN_LENGTH) {
    return { field: "password", message: VALIDATION_RULES.PASSWORD.MESSAGE };
  }

  return null;
}

/**
 * IMPORTANT: Validate name
 * @param name - Name to validate
 */
export function validateName(name: string): ValidationError | null {
  if (!name) {
    return { field: "name", message: "Name is required" };
  }

  if (name.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return {
      field: "name",
      message: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters`,
    };
  }

  if (name.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return {
      field: "name",
      message: `Name must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters`,
    };
  }

  return null;
}

/**
 * IMPORTANT: Validate login credentials
 * @param credentials - Login form data
 */
export function validateLoginCredentials(
  credentials: LoginCredentials,
): ValidationResult {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(credentials.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(credentials.password);
  if (passwordError) errors.push(passwordError);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * IMPORTANT: Validate registration credentials
 * @param credentials - Registration form data
 */
export function validateRegisterCredentials(
  credentials: RegisterCredentials,
): ValidationResult {
  const errors: ValidationError[] = [];

  const nameError = validateName(credentials.name);
  if (nameError) errors.push(nameError);

  const emailError = validateEmail(credentials.email);
  if (emailError) errors.push(emailError);

  const passwordError = validatePassword(credentials.password);
  if (passwordError) errors.push(passwordError);

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * IMPORTANT: Parse JWT token
 * NOTE: Decodes JWT without verification (verification done on backend)
 * @param token - JWT token string
 */
export function parseJWT(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}

/**
 * IMPORTANT: Check if token is expired
 * @param token - JWT token string
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);

  if (!payload || !payload.exp) {
    return false; // No expiration set
  }

  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
}

/**
 * IMPORTANT: Get token expiration date
 * @param token - JWT token string
 */
export function getTokenExpirationDate(token: string): Date | null {
  const payload = parseJWT(token);

  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

/**
 * IMPORTANT: Sanitize user input
 * NOTE: Prevents XSS attacks
 * @param input - User input string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * IMPORTANT: Format error message
 * @param error - Error object
 */
export function formatErrorMessage(error: any): string {
  if (typeof error === "string") {
    return error;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return "An unexpected error occurred";
}

/**
 * IMPORTANT: Check password strength (optional - for future use)
 * @param password - Password to check
 */
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  let feedback = "";

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) feedback = "Weak";
  else if (score <= 4) feedback = "Medium";
  else feedback = "Strong";

  return { score, feedback };
}
