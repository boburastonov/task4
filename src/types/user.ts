/**
 * IMPORTANT: User type definitions
 * NOTE: Ensures type safety across the application
 */

export interface User {
  id: number;
  name: string;
  email: string;
  status: "unverified" | "active" | "blocked";
  lastLogin: Date | null;
  registrationTime: Date;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
}
