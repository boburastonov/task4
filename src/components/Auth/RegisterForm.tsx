import React, { useState, FormEvent } from "react";
import {
  Form,
  Button,
  Alert,
  Container,
  Row,
  Col,
  Card,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router";
import { authService } from "../../services/authService";

/**
 * IMPORTANT: Registration form component for new user signup
 * NOTE: Users are registered immediately, confirmation email sent asynchronously
 * NOTE: Password can be any non-empty value (even 1 character)
 */

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterForm: React.FC = () => {
  // State management
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const navigate = useNavigate();

  /**
   * IMPORTANT: Handle input changes
   * NOTE: Updates form data state on every input change
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
  };

  /**
   * IMPORTANT: Validate password match
   * NOTE: Passwords must match before submission
   */
  const validatePasswordMatch = (): boolean => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  /**
   * IMPORTANT: Handle form submission
   * NOTE: Registers user immediately, sends confirmation email asynchronously
   * NOTA BENE: Database unique index ensures email uniqueness, not code validation
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const form = e.currentTarget;

    // IMPORTANT: Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // IMPORTANT: Check password match
    if (!validatePasswordMatch()) {
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // IMPORTANT: Call registration API
      // NOTE: User registered immediately, email sent asynchronously
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // IMPORTANT: Show success message
      // NOTA BENE: User is registered, confirmation email will be sent
      setSuccessMessage(
        response.message ||
          "Registration successful! A confirmation email has been sent to your email address. You can login now.",
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setValidated(false);

      // IMPORTANT: Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      // IMPORTANT: Handle different error scenarios
      // NOTE: Database unique index will catch duplicate emails

      if (err.response?.status === 409) {
        // NOTA BENE: Email already exists (caught by unique index)
        setError(
          "This email is already registered. Please use a different email or login.",
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError("An error occurred during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              {/* IMPORTANT: Professional header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold">Create Account</h2>
                <p className="text-muted">
                  Register to access the user management system
                </p>
              </div>

              {/* IMPORTANT: Success message display */}
              {/* NOTE: Shows after successful registration */}
              {successMessage && (
                <Alert variant="success" className="mb-3">
                  <div className="d-flex align-items-start">
                    <div>
                      <strong>Success!</strong>
                      <div className="mt-1">{successMessage}</div>
                      <div className="mt-2 small">
                        Redirecting to login page...
                      </div>
                    </div>
                  </div>
                </Alert>
              )}

              {/* IMPORTANT: Error message display */}
              {/* NOTE: No browser alerts, using Bootstrap Alert */}
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

              {/* IMPORTANT: Registration form */}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                {/* Name field */}
                <Form.Group className="mb-3" controlId="formName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your full name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    disabled={loading || !!successMessage}
                    minLength={2}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your name (at least 2 characters).
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email field */}
                {/* NOTA BENE: Uniqueness enforced by database unique index */}
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    disabled={loading || !!successMessage}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email address.
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    A confirmation email will be sent to this address.
                  </Form.Text>
                </Form.Group>

                {/* Password field */}
                {/* IMPORTANT: Accepts any non-empty password (even 1 character) */}
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Create password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    disabled={loading || !!successMessage}
                    minLength={1}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password is required.
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Use any password (minimum 1 character).
                  </Form.Text>
                </Form.Group>

                {/* Confirm Password field */}
                {/* IMPORTANT: Must match password field */}
                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    disabled={loading || !!successMessage}
                    minLength={1}
                    isInvalid={
                      validated &&
                      formData.password !== formData.confirmPassword
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    Passwords must match.
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit button */}
                {/* IMPORTANT: Shows loading state, disabled after success */}
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading || !!successMessage}
                >
                  {loading ? "Creating account..." : "Register"}
                </Button>

                {/* Login link */}
                {/* IMPORTANT: Link to login page for existing users */}
                <div className="text-center">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="text-decoration-none">
                    Login here
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterForm;
