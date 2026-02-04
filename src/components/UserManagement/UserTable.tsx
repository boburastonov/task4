import React from "react";
import { Table, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";

import { User } from "../../types/user";
import { formatDate } from "../../utils/dateUtils";

/**
 * IMPORTANT: User table component
 * NOTE: Displays users with checkboxes for selection
 * NOTE: NO BUTTONS IN ROWS - only checkboxes for selection
 */

interface UserTableProps {
  users: User[];
  selectedUserIds: number[];
  onSelectUser: (userId: number) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  currentUserId?: number;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUserIds,
  onSelectUser,
  onSelectAll,
  allSelected,
  currentUserId,
}) => {
  /**
   * IMPORTANT: Get badge variant based on user status
   */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "blocked":
        return "danger";
      case "unverified":
        return "warning";
      default:
        return "secondary";
    }
  };

  /**
   * IMPORTANT: Check if user is selected
   */
  const isSelected = (userId: number): boolean => {
    return selectedUserIds.includes(userId);
  };

  return (
    <div className="table-responsive">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-light">
          <tr>
            {/* IMPORTANT: Select all checkbox - no label */}
            {/* NOTE: First column contains only checkbox */}
            <th style={{ width: "50px" }} className="text-center">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Select all / Deselect all</Tooltip>}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="form-check-input"
                  style={{ cursor: "pointer" }}
                />
              </OverlayTrigger>
            </th>

            {/* IMPORTANT: Table headers */}
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center text-muted py-4">
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className={isSelected(user.id) ? "table-active" : ""}
              >
                {/* IMPORTANT: Selection checkbox - no label */}
                <td className="text-center">
                  <input
                    type="checkbox"
                    checked={isSelected(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    className="form-check-input"
                    style={{ cursor: "pointer" }}
                  />
                </td>

                {/* IMPORTANT: User name */}
                {/* NOTE: Highlight current user */}
                <td>
                  {user.name}
                  {user.id === currentUserId && (
                    <Badge bg="info" className="ms-2" pill>
                      You
                    </Badge>
                  )}
                </td>

                {/* IMPORTANT: User email */}
                <td className="text-muted">{user.email}</td>

                {/* IMPORTANT: Last login time */}
                {/* NOTE: Table is sorted by this field */}
                <td>
                  {user.lastLogin ? (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>{formatDate(user.lastLogin, true)}</Tooltip>
                      }
                    >
                      <span className="text-muted" style={{ cursor: "help" }}>
                        {formatDate(user.lastLogin)}
                      </span>
                    </OverlayTrigger>
                  ) : (
                    <span className="text-muted fst-italic">Never</span>
                  )}
                </td>

                {/* IMPORTANT: Registration time (optional field) */}
                <td>
                  {user.registrationTime ? (
                    <span className="text-muted small">
                      {formatDate(user.registrationTime)}
                    </span>
                  ) : (
                    <span className="text-muted fst-italic">-</span>
                  )}
                </td>

                {/* IMPORTANT: User status badge */}
                <td>
                  <Badge
                    bg={getStatusBadge(user.status)}
                    className="text-capitalize"
                  >
                    {user.status}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default UserTable;
