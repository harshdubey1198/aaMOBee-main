import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Alert,
  Container,
  Input,
  Label,
  Form,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { createSelector } from "reselect";
import {
  registerUserSuccessful,
  registerUserFailed,
} from "../../store/actions";
import logolight from "../../assets/images/logo-light.webp";
import logodark from "../../assets/images/logo-dark.webp";
import {
  checkEmptyFields,
  validateEmail,
  validatePassword,
  validatePhone,
} from "../Utility/FormValidation";
import { PostRequest } from "../Utility/Request";
import { toast } from "react-toastify";

const Register = () => {
  document.title = "Register | aaMOBee";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registrationError = useSelector(
    (state) => state.account.registrationError
  );

  const defaultRole = "client_admin";

  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    role: defaultRole,
    status: "Requested",
    planId: "",
  });

  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(2);

  // Load from localStorage if available
  useEffect(() => {
    const storedFormData = localStorage.getItem("registerFormData");
    const storedPlanId = localStorage.getItem("planId");
    const storedEmail = localStorage.getItem("emailForRegister");

    if (storedFormData) {
      const parsedData = JSON.parse(storedFormData);
      setFormInput({
        ...parsedData,
        planId: storedPlanId || parsedData.planId || "",
        email: storedEmail || parsedData.email || "",
      });
    } else {
      setFormInput((prevState) => ({
        ...prevState,
        planId: storedPlanId || "",
        email: storedEmail || "",
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(registerUserFailed(""));

    if (!formInput.planId) {
      localStorage.setItem("registerFormData", JSON.stringify(formInput));
      toast.error("Please choose a plan first!");
      console.log("Plan ID is not set");
      navigate("/choose-plan/signup");
      setIsLoading(false);
      return;
    }

    if (checkEmptyFields(formInput)) {
      toast.error("Fields must not be empty!");
      setIsLoading(false);
    } else if (!validateEmail(formInput.email)) {
      toast.error("Email is invalid!");
      setIsLoading(false);
    } else if (!validatePhone(formInput.mobile)) {
      toast.error("Mobile number is invalid!");
      setIsLoading(false);
    } else if (!validatePassword(formInput.password)) {
      toast.error(
        "Password should contain at least 8 characters and must contain one uppercase, one lowercase, one digit, and one special character!"
      );
      setIsLoading(false);
    } else if (formInput.password !== formInput.confirmPassword) {
      toast.error("Confirm Password should be the same as Password!");
      setIsLoading(false);
    } else {
      try {
        const response = await PostRequest(`${process.env.REACT_APP_URL}/auth/register`, formInput);
        if (response) {
          dispatch(registerUserSuccessful(formInput));
          localStorage.setItem("email", formInput.email);
          localStorage.setItem("userId", response.user._id);
          localStorage.removeItem("registerFormData");
          dispatch(registerUserFailed(""));
          startRedirectCountdown();
        } else {
          toast.error("Registration failed");
        }
      } catch (err) {
        console.log("API Error", err);
        toast.error("Account already exists with this email or username");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Start the countdown for redirection
  const startRedirectCountdown = () => {
    toast.success(
      `Registration successful! Redirecting to Verify account page in ${countdown} seconds...`
    );
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown === 1) {
          clearInterval(intervalId);
          navigate("/verify-email");
        }
        return prevCountdown - 1;
      });
    }, 1000);
  };

  const nameHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/[^A-Za-z]/g, "");
    setFormInput((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));
    dispatch(registerUserFailed(""));
  };

  const emailHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/\s/g, "");
    setFormInput((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));
    dispatch(registerUserFailed(""));
  };

  const phoneHandler = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    if (numericValue.length <= 10) {
      setFormInput((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
      dispatch(registerUserFailed(""));
    }
  };

  const passwordHandler = (e) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/\s/g, "");
    setFormInput((prevState) => ({
      ...prevState,
      [name]: cleanedValue,
    }));
    dispatch(registerUserFailed(""));
  };

  useEffect(() => {
    if (registrationError) {
      console.log("Registration Error:", registrationError);
    }
  }, [registrationError]);

  const registerpage = createSelector(
    (state) => state.account,
    (state) => ({
      user: state.user,
      registrationError: state.registrationError,
    })
  );

  const { user } = useSelector(registerpage);

  useEffect(() => {
    document.body.className = "bg-pattern";
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <React.Fragment>
      {/* Modern gradient background */}
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
        style={{
          overflow: 'hidden'
        }}
      >
        {/* Animated background shapes */}
        <div 
          className="position-absolute"
          style={{
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'float 20s ease-in-out infinite'
          }}
        ></div>

        {/* Floating elements */}
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '300px',
            height: '300px',
            background: 'rgba(255,255,255,0.1)',
            top: '10%',
            right: '10%',
            animation: 'float 15s ease-in-out infinite reverse'
          }}
        ></div>
        <div 
          className="position-absolute rounded-circle"
          style={{
            width: '200px',
            height: '200px',
            background: 'rgba(255,255,255,0.05)',
            bottom: '15%',
            left: '15%',
            animation: 'float 18s ease-in-out infinite'
          }}
        ></div>

        <Container fluid className="px-3">
          <Row className="justify-content-center">
            <Col lg={8} md={10} xl={8}>
              <Card 
                className="shadow-lg border-0 overflow-hidden my-4"
                style={{
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)'
                }}
              >
                {/* Header with home button */}
                <div 
                  className="position-relative p-4 text-center"
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                  }}
                >
                  <Link to="/" className="d-inline-block mb-3">
                    <img
                      src={logodark}
                      alt="Logo"
                      height="45"
                      className="auth-logo logo-dark"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                    <img
                      src={logolight}
                      alt="Logo"
                      height="45"
                      className="auth-logo logo-light"
                      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    />
                  </Link>
                  
                  <Link
                    to="/"
                    className="position-absolute btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      top: '20px',
                      right: '20px',
                      width: '40px',
                      height: '40px',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    <i className="mdi mdi-home-outline" style={{ fontSize: '18px' }}></i>
                  </Link>

                  <h4 className="font-weight-bold text-dark mb-2">
                    Create Your Account
                  </h4>
                  <p className="text-muted mb-0">
                    Join aaMOBee and get started today
                  </p>
                </div>

                <CardBody className="p-4">
                  {/* Process Flow Section */}
                  <div className="mb-4">
                    <div className="d-flex justify-content-center overflow-auto pb-3">
                      <div className="d-flex align-items-center flex-nowrap gap-2" style={{ minWidth: 'max-content' }}>
                        {[
                          {
                            icon: "mdi mdi-file-document-outline",
                            title: "Register",
                            bgColor: "#4caf50",
                            active: true
                          },
                          {
                            icon: "mdi mdi-office-building-outline",
                            title: "Firm Creation",
                            bgColor: "#2196f3",
                            active: true
                          },
                          {
                            icon: "mdi mdi-tag-outline",
                            title: "Branding",
                            bgColor: "#ff9800",
                            active: true
                          },
                          {
                            icon: "mdi mdi-account-plus-outline",
                            title: "Users",
                            bgColor: "#9c27b0",
                            active: true
                          },
                          {
                            icon: "mdi mdi-cash-multiple",
                            title: "Setup",
                            bgColor: "#f44336",
                            active: true
                          },
                        ].map((item, index, arr) => (
                          <React.Fragment key={index}>
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                style={{
                                  width: '50px',
                                  height: '50px',
                                  backgroundColor: item.bgColor,
                                  color: item.active ? 'white' : '#666'
                                }}
                              >
                                <i className={item.icon} style={{ fontSize: '20px' }}></i>
                              </div>
                              <small className="text-muted mt-1 text-center" style={{ fontSize: '10px' }}>
                                {item.title}
                              </small>
                            </div>
                            {index !== arr.length - 1 && (
                              <div
                                className="mx-2"
                                style={{
                                  width: '30px',
                                  height: '2px',
                                  backgroundColor: '#e0e0e0',
                                  marginTop: '24px'
                                }}
                              ></div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Alerts */}
                  {user && (
                    <Alert color="success" className="mb-4">
                      Register User Successfully
                    </Alert>
                  )}

                  {registrationError && (
                    <Alert color="danger" className="mb-4">{registrationError}</Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      {/* First Name */}
                      <Col md={6}>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">
                            First Name
                          </Label>
                          <div className="position-relative">
                            <Input
                              name="firstName"
                              type="text"
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Enter your first name"
                              onChange={nameHandler}
                              value={formInput.firstName}
                              style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                paddingLeft: '50px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                            <i 
                              className="mdi mdi-account-outline position-absolute text-muted"
                              style={{
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px'
                              }}
                            ></i>
                          </div>
                        </div>
                      </Col>

                      {/* Last Name */}
                      <Col md={6}>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">
                            Last Name
                          </Label>
                          <div className="position-relative">
                            <Input
                              name="lastName"
                              type="text"
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Enter your last name"
                              onChange={nameHandler}
                              value={formInput.lastName}
                              style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                paddingLeft: '50px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                            <i 
                              className="mdi mdi-account-outline position-absolute text-muted"
                              style={{
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px'
                              }}
                            ></i>
                          </div>
                        </div>
                      </Col>

                      {/* Email */}
                      <Col md={6}>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">
                            Email Address
                          </Label>
                          <div className="position-relative">
                            <Input
                              name="email"
                              type="email"
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Enter your email"
                              onChange={emailHandler}
                              value={formInput.email}
                              style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                paddingLeft: '50px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                            <i 
                              className="mdi mdi-email-outline position-absolute text-muted"
                              style={{
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px'
                              }}
                            ></i>
                          </div>
                        </div>
                      </Col>

                      {/* Mobile */}
                      <Col md={6}>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">
                            Mobile Number
                          </Label>
                          <div className="position-relative">
                            <Input
                              name="mobile"
                              type="text"
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Enter your mobile number"
                              onChange={phoneHandler}
                              value={formInput.mobile}
                              maxLength={10}
                              style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                paddingLeft: '50px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                            <i 
                              className="mdi mdi-phone-outline position-absolute text-muted"
                              style={{
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px'
                              }}
                            ></i>
                          </div>
                        </div>
                      </Col>

                      {/* Password */}
                      <Col md={6}>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">
                            Password
                          </Label>
                          <div className="position-relative">
                            <Input
                              name="password"
                              type={show.password ? "text" : "password"}
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Enter your password"
                              onChange={passwordHandler}
                              value={formInput.password}
                              style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                paddingLeft: '50px',
                                paddingRight: '50px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                            <i 
                              className="mdi mdi-lock-outline position-absolute text-muted"
                              style={{
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px'
                              }}
                            ></i>
                            <button
                              onClick={() => setShow(prev => ({ ...prev, password: !prev.password }))}
                              className="btn btn-link position-absolute text-muted p-0"
                              style={{
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                              }}
                              type="button"
                            >
                              <i 
                                className={`mdi mdi-eye${show.password ? "-off" : ""}-outline`}
                                style={{ fontSize: '20px' }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </Col>

                      {/* Confirm Password */}
                      <Col md={6}>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">
                            Confirm Password
                          </Label>
                          <div className="position-relative">
                            <Input
                              name="confirmPassword"
                              type={show.confirmPassword ? "text" : "password"}
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Confirm your password"
                              onChange={passwordHandler}
                              value={formInput.confirmPassword}
                              style={{
                                backgroundColor: '#f8f9fa',
                                borderRadius: '12px',
                                paddingLeft: '50px',
                                paddingRight: '50px',
                                transition: 'all 0.3s ease'
                              }}
                            />
                            <i 
                              className="mdi mdi-lock-check-outline position-absolute text-muted"
                              style={{
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '20px'
                              }}
                            ></i>
                            <button
                              onClick={() => setShow(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                              className="btn btn-link position-absolute text-muted p-0"
                              style={{
                                right: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)'
                              }}
                              type="button"
                            >
                              <i 
                                className={`mdi mdi-eye${show.confirmPassword ? "-off" : ""}-outline`}
                                style={{ fontSize: '20px' }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    {/* Register Button */}
                    <div className="d-grid mb-4">
                      <button
                        className="btn btn-lg text-white fw-semibold position-relative overflow-hidden"
                        type="submit"
                        disabled={isLoading}
                        style={{
                          background: 'linear-gradient(135deg, #0c424e)',
                          border: 'none',
                          borderRadius: '12px',
                          height: '50px',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
                        onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </div>
                  </Form>
                </CardBody>

                {/* Footer */}
                <div 
                  className="text-center p-4"
                  style={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <p className="text-muted mb-3">
                    Already have an account?{" "}
                    <Link 
                      to="/login" 
                      className="fw-semibold text-decoration-none"
                      style={{ color: '#0c424e' }}
                    >
                      Sign In
                    </Link>
                  </p>
                  
                  <div className="d-flex justify-content-center align-items-center">
                    <small className="text-muted">
                      © {new Date().getFullYear()} aaMOBee
                    </small>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(1deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }

        .form-control:focus {
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
          border-color: transparent !important;
          background-color: #ffffff !important;
        }

        .btn:hover {
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .card:hover {
          transform: translateY(-5px);
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .card {
            margin: 1rem 0.5rem !important;
          }
        }
      `}</style>
    </React.Fragment>
  );
};

export default Register;