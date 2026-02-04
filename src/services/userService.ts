import api from "./api";
import { User } from "../types/user";

/**
 * IMPORTANT: User service for user management operations
 * NOTE: All operations check authentication and user status on server
 * NOTE: Server validates user exists and isn't blocked before each request
 */

interface DeleteResponse {
  message: string;
  count?: number;
}

export const userService = {
  /**
   * IMPORTANT: Get all users
   * NOTE: Returns users sorted by last login time
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },

  /**
   * IMPORTANT: Block multiple users
   * NOTE: Can block yourself - will redirect to login
   * @param userIds - Array of user IDs to block
   */
  blockUsers: async (userIds: number[]): Promise<{ message: string }> => {
    const response = await api.post("/users/block", { userIds });
    return response.data;
  },

  /**
   * IMPORTANT: Unblock multiple users
   * @param userIds - Array of user IDs to unblock
   */
  unblockUsers: async (userIds: number[]): Promise<{ message: string }> => {
    const response = await api.post("/users/unblock", { userIds });
    return response.data;
  },

  /**
   * IMPORTANT: Delete multiple users permanently
   * NOTE: Real deletion, not soft delete
   * NOTE: Can delete yourself - will redirect to login
   * @param userIds - Array of user IDs to delete
   */
  deleteUsers: async (userIds: number[]): Promise<{ message: string }> => {
    const response = await api.delete("/users", {
      data: { userIds },
    });
    return response.data;
  },

  /**
   * IMPORTANT: Delete all unverified users
   * NOTE: Deletes users with status "unverified"
   */
  deleteUnverified: async (): Promise<DeleteResponse> => {
    const response = await api.delete<DeleteResponse>("/users/unverified");
    return response.data;
  },
};
