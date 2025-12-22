import React, { useEffect, useState } from "react";
import { Row, Col, CardBody, Card, Alert, Container, Input, Label, Form,} from "reactstrap";
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
  validatePhone
} from "../Utility/FormValidation";
import { PostRequest } from "../Utility/Request";
import { toast } from "react-toastify";

const Register = (props) => {
  document.title = "Register | aaMOBee";

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const registrationError = useSelector((state) => state.account.registrationError);

  const defaultRole = "client_admin";

  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // username: "",
    password: "",
    confirmPassword: "",
    // companyMobile: "",
    // companyName: "",
    mobile: "",
    // address: "",
    role: defaultRole,
    status: "Requested",
    planId: "",
  });

  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });

  const [countdown, setCountdown] = useState(2);

  // const BASE_URL = process.env.REACT_APP_API_URL || "http://13.127.103.135/";

//   useEffect(() => {
//     const storedPlanId = localStorage.getItem("planId");
//     if (storedPlanId) {
//       setFormInput((prevState) => ({
//         ...prevState,
//         planId: storedPlanId,
        
//       }));
//     }
//   }, []);

//   useEffect(() => {
//     const storedEmail = localStorage.getItem("emailForRegister");
//     if (storedEmail) {
//       setFormInput((prevState) => ({
//         ...prevState,
//         email: storedEmail,
//       }));
//     }
//   }, []);
  
//   useEffect(() => {
//   const storedFormData = localStorage.getItem('registerFormData');
//   if (storedFormData) {
//     setFormInput(JSON.parse(storedFormData));
//   }
// }, []);

useEffect(() => {
  const storedFormData = localStorage.getItem('registerFormData');
  const storedPlanId = localStorage.getItem('planId');
  const storedEmail = localStorage.getItem('emailForRegister');

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



console.log("form planId", formInput.planId);
// console.log("Form Input:", formInput);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUserFailed(""));

    // if (!formInput.planId) {
    //   toast.error("Please choose a plan first!");
    //   console.log("Plan ID is not set");
    //   navigate("/choose-plan/signup");
    //   return;
    // }

    if (!formInput.planId) {
  // Save current form data before redirecting
  localStorage.setItem('registerFormData', JSON.stringify(formInput));
  
  toast.error("Please choose a plan first!");
  console.log("Plan ID is not set");
  navigate("/choose-plan/signup");
  return;
}


    if (checkEmptyFields(formInput)) {
      toast.error("Fields must not be empty!");
    } else if (!validateEmail(formInput.email)) {
      toast.error("Email is invalid!");
    } else if (!validatePhone(formInput.mobile)) {
      toast.error("Mobile number is invalid!");
    } else if (!validatePassword(formInput.password)) {
      toast.error(
        "Password should contain at least 8 characters and must contain one uppercase, one lowercase, one digit, and one special character!"
      );
    } else if (formInput.password !== formInput.confirmPassword) {
      toast.error("Confirm Password should be the same as Password!");
    } else {
      PostRequest(`${process.env.REACT_APP_URL}/auth/register`, formInput)
        .then((response) => {
          // if (response) {
          //   dispatch(registerUserSuccessful(formInput));
          //   localStorage.setItem("email", formInput.email);
          //   localStorage.setItem("userId", response.user._id);
          //   dispatch(registerUserFailed(""));
          //   startRedirectCountdown(); 
          if (response) {
  dispatch(registerUserSuccessful(formInput));
  localStorage.setItem("email", formInput.email);
  localStorage.setItem("userId", response.user._id);

  // ✅ Clear saved form data so it doesn’t persist unnecessarily
  localStorage.removeItem('registerFormData');

  dispatch(registerUserFailed(""));
  startRedirectCountdown(); // Keeps the redirect flow
}
           else {
            toast.error("Registration failed");
          }
        })
        .catch((err) => {
          console.log("API Error", err);
          toast.error("Account already exists with this email or username");
        });
    }
  };

  // Start the countdown for redirection
  const startRedirectCountdown = () => {
    toast.success(`Registration successful! Redirecting to Verify account page in ${countdown} seconds...`);
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

  return (
    <div className="bg-pattern" style={{ minHeight: "100vh", height: "100%" }}>
      <div className="bg-overlay"></div>
      <div className="account-pages d-flex flex-row align-items-center" style={{minHeight:"100vh"}}>
        <Container>
          <Row className="justify-content-center m-0">
            <Col lg={8} md={10} xl={8}>
              <Card className="mt-3">
                <CardBody className="p-4">
                  <div className="text-center">
                    <Link to="/" className="">
                      <img
                        src={logodark}
                        alt=""
                        height="40"
                        className="auth-logo logo-dark mx-auto"
                      />
                      <img
                        src={logolight}
                        alt=""
                        height="40"
                        className="auth-logo logo-light mx-auto"
                      />
                    </Link>
                  </div>

                  <p className="font-size-22 fw-bold text-dark text-center my-4">
                    Register Your Account
                  </p>


                  <div className="tutorial-container2">

                    <div className="process-flow-horizontal">
                      <div className="process-row d-flex justify-content-center align-items-center flex-nowrap gap-0">
                        <div className="steps-container">
                          {[
                            {
                              icon: "mdi mdi-file-document-outline",
                              title: "Register Yourself",
                              bgColor: "#4caf50",
                            },
                            {
                              icon: "mdi mdi-office-building-outline",
                              title: "Firm Creation",
                              bgColor: "#2196f3",
                            },
                            {
                              icon: "mdi mdi-tag-outline",
                              title: "Firm Branding",
                              bgColor: "#ff9800",
                            },
                            {
                              icon: "mdi mdi-account-plus-outline",
                              title: "User Creation",
                              bgColor: "#9c27b0",
                            },
                            {
                              icon: "mdi mdi-cash-multiple",
                              title: "Further Firm Processes",
                              bgColor: "#f44336",
                            },
                          ].map((item, index, arr) => (
                            <React.Fragment key={index}>
                              <div className="step" style={{ borderColor: item.bgColor }}>
                                <div className="circle" style={{ borderColor: item.bgColor }}>
                                  <i className={item.icon}></i>
                                </div>
                                {index !== arr.length - 1 && (
                                  <>
                                    <div className="arrow">{`0${index + 1}`}</div>
                                    <div className="arrow-cut"></div>
                                  </>
                                )}
                                <p className="label">{item.title}</p>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Form className="form-horizontal" onSubmit={handleSubmit}>
                    {user && (
                      <Alert color="success">
                        Register User Successfully
                      </Alert>
                    )}

                    {registrationError && (
                      <Alert color="danger">{registrationError}</Alert>
                    )}

                  <Row>
                    {/* Row 1: First & Last Name */}
                    <Col md={6}>
                      <div className="mb-4">
                        <Label className="form-label">First Name</Label>
                        <Input
                          name="firstName"
                          type="text"
                          placeholder="Enter First Name"
                          onChange={nameHandler}
                          value={formInput.firstName}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <Label className="form-label">Last Name</Label>
                        <Input
                          name="lastName"
                          type="text"
                          placeholder="Enter Last Name"
                          onChange={nameHandler}
                          value={formInput.lastName}
                        />
                      </div>
                    </Col>

                    {/* Row 2: Email & Mobile */}
                    <Col md={6}>
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          type="email"
                          placeholder="Enter Email"
                          onChange={emailHandler}
                          value={formInput.email}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <Label className="form-label">Mobile</Label>
                        <Input
                          name="mobile"
                          type="text"
                          placeholder="Enter Mobile"
                          onChange={phoneHandler}
                          value={formInput.mobile}
                        />
                      </div>
                    </Col>

                    {/* Row 3: Password & Confirm Password */}
                    <Col md={6}>
                      <div className="mb-4 position-relative">
                        <Label className="form-label">Password</Label>
                        <Input
                          name="password"
                          type={show.password ? "text" : "password"}
                          placeholder="Enter Password"
                          onChange={passwordHandler}
                          value={formInput.password}
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0"
                          style={{ top: "74%", transform: "translateY(-50%)" }}
                          onClick={() =>
                            setShow((prev) => ({ ...prev, password: !prev.password }))
                          }
                        >
                          <i className={`mdi mdi-eye${show.password ? "-off" : ""}`}></i>
                        </button>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="mb-4 position-relative">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmPassword"
                          type={show.confirmPassword ? "text" : "password"}
                          placeholder="Enter Confirm Password"
                          onChange={passwordHandler}
                          value={formInput.confirmPassword}
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0"
                          style={{ top: "74%", transform: "translateY(-50%)" }}
                          onClick={() =>
                            setShow((prev) => ({
                              ...prev,
                              confirmPassword: !prev.confirmPassword,
                            }))
                          }
                        >
                          <i className={`mdi mdi-eye${show.confirmPassword ? "-off" : ""}`}></i>
                        </button>
                      </div>
                    </Col>
                  </Row>             
                   
                    <div className="d-grid">
                      <button
                        className="btn btn-primary waves-effect waves-light"
                        type="submit"
                      >
                        Register
                      </button>
                    </div>
                  </Form>
                </CardBody>
                <div className="text-center">
                <p className="text-black py-3 m-0">
                  Already have an account ?
                  <Link to="/login" className="fw-medium text-primary">
                    {" "}
                    Login{" "}
                  </Link>{" "}
                </p>
                <p className="text-black border-top py-3">
                  © {new Date().getFullYear()} aaMOBee.
                </p>
              </div>
              </Card>
              
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Register;
