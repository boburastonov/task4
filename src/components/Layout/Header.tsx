import React from "react";
import { useNavigate } from "react-router";
import { FaSignOutAlt, FaUserShield } from "react-icons/fa";
import { Navbar, Container, Nav, Button } from "react-bootstrap";

import { authService } from "../../services/authService";

/**
 * IMPORTANT: Header component with navigation and logout
 * NOTE: Shows current user info and logout button
 */

const Header: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  /**
   * IMPORTANT: Handle logout
   * NOTE: Clears token and redirects to login
   */
  const handleLogout = (): void => {
    authService.logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="/users" className="d-flex align-items-center">
          <FaUserShield className="me-2" size={24} />
          <span className="fw-bold">User Management System</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {/* IMPORTANT: Current user info */}
            {currentUser && (
              <Nav.Item className="text-light me-3">
                <small className="text-muted">Logged in as:</small>
                <div className="fw-bold">{currentUser.name}</div>
                <small className="text-muted">{currentUser.email}</small>
              </Nav.Item>
            )}

            {/* IMPORTANT: Logout button */}
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="d-flex align-items-center"
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
