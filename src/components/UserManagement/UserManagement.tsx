import React, { useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";

import Toolbar from "./Toolbar";
import UserTable from "./UserTable";
import Header from "../Layout/Header";
import { User } from "../../types/user";
import { userService } from "../../services/userService";
import { authService } from "../../services/authService";

/**
 * IMPORTANT: Main user management component
 * NOTE: Only authenticated, non-blocked users can access this
 * NOTE: Before each request, server checks if user exists and isn't blocked
 */

const UserManagement: React.FC = () => {
  // State management
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  /**
   * IMPORTANT: Fetch users from API
   * NOTE: Loads all users and sorts by last login time
   * NOTE: Server checks authentication before responding
   */
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");

      try {
        // IMPORTANT: Get all users from API
        const data = await userService.getAllUsers();

        // NOTE: Sort by last login time (descending - most recent first)
        const sortedUsers = data.sort((a: User, b: User) => {
          const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
          const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
          return dateB - dateA;
        });

        setUsers(sortedUsers);
      } catch (err: any) {
        // IMPORTANT: Handle errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          // User is blocked or deleted - redirect handled by interceptor
          return;
        }
        setError(err.response?.data?.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]); // Refresh when refreshTrigger changes

  /**
   * IMPORTANT: Handle user selection
   * NOTE: Toggles user selection for bulk operations
   */
  const handleSelectUser = (userId: number): void => {
    setSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  /**
   * IMPORTANT: Handle select all / deselect all
   * NOTE: Uses checkbox in table header
   */
  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedUserIds(users.map((user) => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  /**
   * IMPORTANT: Check if all users are selected
   */
  const areAllSelected = (): boolean => {
    return users.length > 0 && selectedUserIds.length === users.length;
  };

  /**
   * IMPORTANT: Handle block users action
   * NOTE: Can block multiple users at once, including yourself
   * NOTE: If you block yourself, you'll be redirected to login
   */
  const handleBlock = async (): Promise<void> => {
    if (selectedUserIds.length === 0) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // IMPORTANT: Block selected users
      await userService.blockUsers(selectedUserIds);

      // Check if current user blocked themselves
      const blockedSelf = selectedUserIds.includes(currentUser?.id);

      if (blockedSelf) {
        // NOTE: User blocked themselves - logout and redirect
        authService.logout();
        navigate("/login");
        return;
      }

      setSuccessMessage(
        `Successfully blocked ${selectedUserIds.length} user(s)`,
      );
      setSelectedUserIds([]);
      setRefreshTrigger((prev) => prev + 1); // Refresh user list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to block users");
    } finally {
      setLoading(false);
    }
  };

  /**
   * IMPORTANT: Handle unblock users action
   * NOTE: Can unblock multiple users at once
   */
  const handleUnblock = async (): Promise<void> => {
    if (selectedUserIds.length === 0) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // IMPORTANT: Unblock selected users
      await userService.unblockUsers(selectedUserIds);

      setSuccessMessage(
        `Successfully unblocked ${selectedUserIds.length} user(s)`,
      );
      setSelectedUserIds([]);
      setRefreshTrigger((prev) => prev + 1); // Refresh user list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to unblock users");
    } finally {
      setLoading(false);
    }
  };

  /**
   * IMPORTANT: Handle delete users action
   * NOTE: Real deletion, not soft delete
   * NOTE: If you delete yourself, you'll be redirected to login
   */
  const handleDelete = async (): Promise<void> => {
    if (selectedUserIds.length === 0) return;

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // IMPORTANT: Delete selected users permanently
      await userService.deleteUsers(selectedUserIds);

      // Check if current user deleted themselves
      const deletedSelf = selectedUserIds.includes(currentUser?.id);

      if (deletedSelf) {
        // NOTE: User deleted themselves - logout and redirect
        authService.logout();
        navigate("/login");
        return;
      }

      setSuccessMessage(
        `Successfully deleted ${selectedUserIds.length} user(s)`,
      );
      setSelectedUserIds([]);
      setRefreshTrigger((prev) => prev + 1); // Refresh user list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete users");
    } finally {
      setLoading(false);
    }
  };

  /**
   * IMPORTANT: Handle delete unverified users action
   * NOTE: Deletes all users with "unverified" status
   */
  const handleDeleteUnverified = async (): Promise<void> => {
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // IMPORTANT: Delete all unverified users
      const response = await userService.deleteUnverified();

      setSuccessMessage(
        response.message ||
          `Successfully deleted ${response.count || 0} unverified user(s)`,
      );
      setSelectedUserIds([]);
      setRefreshTrigger((prev) => prev + 1); // Refresh user list
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to delete unverified users",
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * IMPORTANT: Auto-hide success/error messages after 5 seconds
   */
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <>
      {/* IMPORTANT: Header with navigation and logout */}
      <Header />

      <Container fluid className="py-4">
        <Row>
          <Col xs={12} lg={11} xl={10} className="mx-auto">
            {/* IMPORTANT: Page title */}
            <div className="mb-4">
              <h2 className="fw-bold">User Management</h2>
              <p className="text-muted">
                Manage users, permissions, and access control
              </p>
            </div>

            {/* IMPORTANT: Success message */}
            {successMessage && (
              <Alert
                variant="success"
                dismissible
                onClose={() => setSuccessMessage("")}
                className="mb-3"
              >
                {successMessage}
              </Alert>
            )}

            {/* IMPORTANT: Error message */}
            {error && (
              <Alert
                variant="danger"
                dismissible
                onClose={() => setError("")}
                className="mb-3"
              >
                {error}
              </Alert>
            )}

            {/* IMPORTANT: Loading state */}
            {loading && users.length === 0 ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="text-muted mt-3">Loading users...</p>
              </div>
            ) : (
              <div className="bg-white rounded shadow-sm">
                {/* IMPORTANT: Toolbar - always visible */}
                {/* NOTE: Buttons enable/disable based on selection */}
                <Toolbar
                  selectedCount={selectedUserIds.length}
                  onBlock={handleBlock}
                  onUnblock={handleUnblock}
                  onDelete={handleDelete}
                  onDeleteUnverified={handleDeleteUnverified}
                  loading={loading}
                />

                {/* IMPORTANT: User table */}
                {/* NOTE: Checkboxes for selection, no buttons in rows */}
                <UserTable
                  users={users}
                  selectedUserIds={selectedUserIds}
                  onSelectUser={handleSelectUser}
                  onSelectAll={handleSelectAll}
                  allSelected={areAllSelected()}
                  currentUserId={currentUser?.id}
                />
              </div>
            )}

            {/* NOTE: Empty state if no users */}
            {!loading && users.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No users found</p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UserManagement;
