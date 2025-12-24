import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import logolight from "../../assets/images/logo-light.webp";
import logodark from "../../assets/images/logo-dark.webp";
import { Row, Col, CardBody, Card, Container, Form, Input, Label } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";
import { loginUser } from "../../store/actions";
import { checkEmptyFields, validateEmail } from "../Utility/FormValidation";
import { toast } from "react-toastify";
import { createDemoUser, loginDemoUser } from "../../apiServices/service";

const Login = (props) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); 
  const currentPath = window.location.pathname;
  document.title = "Login | aaMOBee";
  const dispatch = useDispatch();

  const isCrmLoginPage = currentPath === "/crm/login";
  const isDemoLoginPage = currentPath === "/demo/login";

  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [demoPayload, setDemoPayload] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileSecondary: { countryCode: "+91", number: "" },
  });

  const [show, setShow] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const authError = useSelector((state) => state.auth?.authError || null);
  const handleGoToLogin = () => navigate("/login"); 
  const handleDemoInput = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setDemoPayload(prev => ({ ...prev, existingUser: checked }));
    } else if (name === "number" || name === "countryCode") {
      setDemoPayload(prev => ({
        ...prev,
        mobileSecondary: { ...prev.mobileSecondary, [name]: value.trim() }
      }));
     } else if (name === "token") {
      setDemoPayload(prev => ({ ...prev, token: value.trim() }));
      } else {
      setDemoPayload(prev => ({ ...prev, [name]: value.trim() }));
    }
  };


  // Create demo user
  const handleCreateDemoUser = async () => {
    try {
      if (!demoPayload.existingUser && (!demoPayload.firstName || !demoPayload.lastName || !demoPayload.email || !demoPayload.mobileSecondary.number)) {
        toast.error("Please fill all fields");
        return;
      }
      

      if (demoPayload.existingUser) {
        navigate("/login");
        return;
      }


      await createDemoUser(demoPayload);
      toast.success("Demo user created! Check email for credentials.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create demo user");
    }
  };

const handleExistingDemoUrl = (e) => {
  const url = e.target.value.trim();
  if (!url) return;

  try {
    const urlObj = new URL(url);
    const email = urlObj.searchParams.get("email");
    const token = urlObj.searchParams.get("token");

    if (!email || !token) {
      toast.error("Invalid demo URL");
      return;
    }

    setDemoPayload(prev => ({ ...prev, email, token }));
    localStorage.setItem("demoUserCredentials", JSON.stringify({ email, token }));
    localStorage.setItem("token", token);
    toast.success("Demo credentials loaded! Click Sign In to continue.");
  } catch (err) {
    toast.error("Invalid URL format");
  }
};

  // Handle query params login
  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      localStorage.setItem("authUser", JSON.stringify({ email, token }));
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  }, []);
// Demo login handler
const demologinHandler = async () => {
  try {
    if (!demoPayload.email || !demoPayload.token) {
      toast.error("Please provide email and token from your email");
      return;
    }

    const response = await loginDemoUser({ email: demoPayload.email, token: demoPayload.token });
    console.log(response)
    // Save credentials locally 
    localStorage.setItem("authUser", JSON.stringify(response?.data));

    localStorage.setItem("token", response.token);

    toast.success(response?.message);
    navigate("/dashboard");
  } catch (error) {
    console.error(error);
    toast.error("Demo login failed");
  }
};

  // Load saved credentials
  useEffect(() => {
    if (!isDemoLoginPage) {
      const savedCredentials = JSON.parse(localStorage.getItem("userCredentials"));
      if (savedCredentials) {
        setFormValues({
          email: savedCredentials.email,
          password: savedCredentials.password,
        });
        setRememberMe(true);
      }
    } else {
      setFormValues({ email: "", password: "" });
    }
  }, [isDemoLoginPage]);

  const handleCrmLogin = () => navigate("/crm/login");
  const handleMainLogin = () => navigate("/login");
  const handleDemoLogin = () => navigate("/demo/login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isDemoLoginPage) {
      if (checkEmptyFields(formValues)) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      } else if (!validateEmail(formValues.email)) {
        toast.error("Invalid email address");
        setIsLoading(false);
        return;
      }
    }

    try {
      if (!isDemoLoginPage) {
        if (rememberMe) {
          localStorage.setItem(
            "userCredentials",
            JSON.stringify({
              email: formValues.email,
              password: formValues.password,
            })
          );
        } else {
          localStorage.removeItem("userCredentials");
        }
      }
      if (!isDemoLoginPage) {
        await dispatch(loginUser(formValues, props.router.navigate));
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(authError || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const emailHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value.trim() }));
    setError("");
  };

  const passwordHandler = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({ ...prevState, [name]: value.trim() }));
    setError("");
  };

  const handleCheckboxChange = (e) => setRememberMe(e.target.checked);

  useEffect(() => {
    document.body.className = "bg-pattern";
    return () => {
      document.body.className = "";
    };
  }, []);

  return (
    <React.Fragment>
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center position-relative"
        style={{ overflow: "hidden" }}
      >
        {/* Background decorations */}
        <div
          className="position-absolute"
          style={{
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            animation: "float 20s ease-in-out infinite",
          }}
        ></div>

        <div
          className="position-absolute rounded-circle"
          style={{
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            top: "10%",
            right: "10%",
            animation: "float 15s ease-in-out infinite reverse",
          }}
        ></div>
        <div
          className="position-absolute rounded-circle"
          style={{
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.05)",
            bottom: "15%",
            left: "15%",
            animation: "float 18s ease-in-out infinite",
          }}
        ></div>

        <Container fluid className="px-3">
          <Row className="justify-content-center">
            <Col lg={5} md={7} xl={4}>
              <Card
                className="shadow-lg border-0 overflow-hidden"
                style={{
                  borderRadius: "20px",
                  backdropFilter: "blur(10px)",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                }}
              >
                {/* Header */}
                <div
                  className="position-relative p-4 text-center"
                  style={{
                    background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                  }}
                >
                  <Link to="/" className="d-inline-block mb-3">
                    <img
                      src={logodark}
                      alt="Logo"
                      height="45"
                      className="auth-logo logo-dark"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    />
                    <img
                      src={logolight}
                      alt="Logo"
                      height="45"
                      className="auth-logo logo-light"
                      style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                    />
                  </Link>

                  <Link
                    to="/"
                    className="position-absolute btn btn-light btn-sm rounded-circle shadow-sm d-flex align-items-center justify-content-center"
                    style={{
                      top: "20px",
                      right: "20px",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <i className="mdi mdi-home-outline" style={{ fontSize: "18px" }}></i>
                  </Link>

                  <h4 className="font-weight-bold text-dark mb-2">
                    {isDemoLoginPage ? "Welcome to Demo Login" : "Welcome Back!"}
                  </h4>
                  <p className="text-muted mb-0">
                    {isDemoLoginPage
                      ? "Sign in with Demo Account"
                      : `${isCrmLoginPage ? "CRM " : ""}Sign in to your account`}
                  </p>
                </div>

                <CardBody className="p-4">
                  <Form onSubmit={handleSubmit}>
                    {/* Demo Fields */}
                    {isDemoLoginPage && (
                      <>

                        {!demoPayload.existingUser ? (
                          <>
                            <Input name="firstName" placeholder="First Name" value={demoPayload.firstName} onChange={handleDemoInput} className="mb-3" />
                            <Input name="lastName" placeholder="Last Name" value={demoPayload.lastName} onChange={handleDemoInput} className="mb-3" />
                            <div className="d-flex gap-2 mb-3">
                              <Input name="countryCode" value={demoPayload.mobileSecondary.countryCode} onChange={handleDemoInput} />
                              <Input name="number" placeholder="Enter Mobile Number" value={demoPayload.mobileSecondary.number} onChange={handleDemoInput} />
                            </div>
                            <Input name="email" placeholder="Email" value={demoPayload.email} onChange={handleDemoInput} className="mb-3" />
                          </>
                        ) : (
                          <>
                            <Input placeholder="Paste full demo URL from email" value={demoPayload.demoUrl || ""} onChange={(e) => { setDemoPayload(prev => ({ ...prev, demoUrl: e.target.value })); handleExistingDemoUrl(e); }} className="mb-3" />
                          </>
                        )}
                        <div className="form-check mb-3">
                          <Input
                            type="checkbox"
                            id="existingDemo"
                            checked={demoPayload.existingUser}
                            onClick={handleGoToLogin}
                            onChange={(e) =>
                              setDemoPayload((prev) => ({ ...prev, existingUser: e.target.checked }))
                            }
                          />
                          <Label htmlFor="existingDemo" className="ms-2">I am an existing demo user</Label>
                        </div>
                      </>
                    )}

                    {/* Normal Email & Password Fields */}
                    {!isDemoLoginPage && (
                      <>
                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">Email Address</Label>
                          <div className="position-relative">
                            <Input
                              name="email"
                              type="email"
                              autoComplete="email"
                              onChange={emailHandler}
                              value={formValues.email}
                              className="form-control form-control-lg border-0 shadow-sm"
                              placeholder="Enter your email"
                              style={{ backgroundColor: "#f8f9fa", borderRadius: "12px", paddingLeft: "50px" }}
                            />
                            <i className="mdi mdi-email-outline position-absolute text-muted" style={{ left: "15px", top: "50%", transform: "translateY(-50%)", fontSize: "20px" }}></i>
                          </div>
                        </div>

                        <div className="mb-4">
                          <Label className="form-label fw-semibold text-dark">Password</Label>
                          <div className="position-relative">
                            <Input
                              name="password"
                              type={show ? "text" : "password"}
                              placeholder="Enter your password"
                              autoComplete="current-password"
                              onChange={passwordHandler}
                              value={formValues.password}
                              className="form-control form-control-lg border-0 shadow-sm"
                              style={{ backgroundColor: "#f8f9fa", borderRadius: "12px", paddingLeft: "50px" }}
                            />
                            <i className="mdi mdi-lock-outline position-absolute text-muted" style={{ left: "15px", top: "50%", transform: "translateY(-50%)", fontSize: "20px" }}></i>
                            <button
                              onClick={() => setShow(!show)}
                              className="btn btn-link position-absolute text-muted p-0"
                              style={{ right: "15px", top: "50%", transform: "translateY(-50%)" }}
                              type="button"
                            >
                              <i className={`mdi mdi-eye${show ? "-off" : ""}-outline`} style={{ fontSize: "20px" }}></i>
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Remember Me & Forgot Password */}
                    {!isDemoLoginPage && (
                      <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                          <Input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={handleCheckboxChange}
                          />
                          <Label className="form-check-label text-muted" htmlFor="rememberMe">Remember me</Label>
                        </div>
                        <Link to="/recover-password" className="text-decoration-none fw-medium">Forgot Password?</Link>
                      </div>
                    )}

                    {/* Submit Button */}
                    <div className="d-grid mb-4">
                      {isDemoLoginPage && !demoPayload.existingUser ? (
                        <button
                          type="button"
                          onClick={handleCreateDemoUser}
                          className="btn btn-lg text-white fw-semibold position-relative overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, #f4b400, #f57c00)",
                            border: "none",
                            borderRadius: "12px",
                            height: "50px",
                          }}
                        >
                          Create Demo User 🚀
                        </button>
                      ) : isDemoLoginPage && demoPayload.existingUser ? (
                        <button
                          type="submit"
                          onClick={demologinHandler}
                          className="btn btn-lg text-white fw-semibold position-relative overflow-hidden"
                          style={{
                            background: "linear-gradient(135deg, #0c424e )",
                            border: "none",
                            borderRadius: "12px",
                            height: "50px",
                          }}
                        >
                          Sign In Demo
                        </button>
                      ) : (
                        <button
                          className="btn btn-lg text-white fw-semibold position-relative overflow-hidden"
                          type="submit"
                          disabled={isLoading}
                          style={{
                            background: "linear-gradient(135deg, #0c424e )",
                            border: "none",
                            borderRadius: "12px",
                            height: "50px",
                          }}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Signing in...
                            </>
                          ) : (
                            "Sign In"
                          )}
                        </button>
                      )}
                    </div>

                  </Form>
                </CardBody>

                {/* Footer */}
                <div className="text-center p-4">
                  {!isDemoLoginPage && (
                    <p className="text-muted mb-3">
                      Don't have an account?{" "}
                      <Link to="/register" className="fw-semibold text-decoration-none">Create Account</Link>
                    </p>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">© {new Date().getFullYear()} aaMOBee</small>

                    <div className="d-flex gap-2">
                      {/* Buttons for switching login pages */}
                      {currentPath === "/login" && (
                        <>
                          <button onClick={handleCrmLogin} className="btn btn-sm text-white fw-medium" style={{ background: "linear-gradient(135deg, #0c424e)", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "12px" }}>CRM User 💼</button>
                          <button onClick={handleDemoLogin} className="btn btn-sm text-white fw-medium" style={{ background: "linear-gradient(135deg, #f4b400, #f57c00)", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "12px" }}>Demo Login 🚀</button>
                        </>
                      )}

                      {currentPath === "/crm/login" && (
                        <>
                          <button onClick={handleMainLogin} className="btn btn-sm text-white fw-medium" style={{ background: "linear-gradient(135deg, #0c424e)", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "12px" }}>Main User 👤</button>
                          <button onClick={handleDemoLogin} className="btn btn-sm text-white fw-medium" style={{ background: "linear-gradient(135deg, #f4b400, #f57c00)", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "12px" }}>Demo Login 🚀</button>
                        </>
                      )}

                      {currentPath === "/demo/login" && (
                        <>
                          <button onClick={handleMainLogin} className="btn btn-sm text-white fw-medium" style={{ background: "linear-gradient(135deg, #0c424e)", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "12px" }}>Main User 👤</button>
                          <button onClick={handleCrmLogin} className="btn btn-sm text-white fw-medium" style={{ background: "linear-gradient(135deg, #0c424e)", border: "none", borderRadius: "20px", padding: "8px 16px", fontSize: "12px" }}>CRM User 💼</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(10deg); }
          66% { transform: translateY(20px) rotate(-10deg); }
        }
      `}</style>
    </React.Fragment>
  );
};

Login.propTypes = {
  router: PropTypes.object,
};

export default withRouter(Login);
