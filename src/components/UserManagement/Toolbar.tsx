import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaUnlock, FaTrash, FaUserSlash } from "react-icons/fa";

/**
 * IMPORTANT: Toolbar component for bulk user actions
 * NOTE: Always visible, buttons enable/disable based on selection
 * NOTE: Uses icons for some buttons, text for others (as per requirement)
 */

interface ToolbarProps {
  selectedCount: number;
  onBlock: () => void;
  onUnblock: () => void;
  onDelete: () => void;
  onDeleteUnverified: () => void;
  loading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedCount,
  onBlock,
  onUnblock,
  onDelete,
  onDeleteUnverified,
  loading,
}) => {
  return (
    <div className="toolbar-container p-3 border-bottom bg-light">
      <div className="d-flex flex-wrap gap-2 align-items-center">
        {/* IMPORTANT: Block button - text only */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Block selected users</Tooltip>}
        >
          <span className="d-inline-block">
            <Button
              variant="danger"
              onClick={onBlock}
              disabled={selectedCount === 0 || loading}
              size="sm"
            >
              Block
            </Button>
          </span>
        </OverlayTrigger>

        {/* IMPORTANT: Unblock button - icon only */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Unblock selected users</Tooltip>}
        >
          <span className="d-inline-block">
            <Button
              variant="success"
              onClick={onUnblock}
              disabled={selectedCount === 0 || loading}
              size="sm"
            >
              <FaUnlock />
            </Button>
          </span>
        </OverlayTrigger>

        {/* IMPORTANT: Delete button - icon only */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Delete selected users permanently</Tooltip>}
        >
          <span className="d-inline-block">
            <Button
              variant="outline-danger"
              onClick={onDelete}
              disabled={selectedCount === 0 || loading}
              size="sm"
            >
              <FaTrash />
            </Button>
          </span>
        </OverlayTrigger>

        {/* IMPORTANT: Delete unverified button - icon only */}
        {/* NOTA BENE: This button works independently of selection */}
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Delete all unverified users</Tooltip>}
        >
          <span className="d-inline-block">
            <Button
              variant="warning"
              onClick={onDeleteUnverified}
              disabled={loading}
              size="sm"
            >
              <FaUserSlash />
            </Button>
          </span>
        </OverlayTrigger>

        {/* IMPORTANT: Selection counter */}
        {selectedCount > 0 && (
          <span className="ms-auto text-muted small">
            {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
          </span>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
