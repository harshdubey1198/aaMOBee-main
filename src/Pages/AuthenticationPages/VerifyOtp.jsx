import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchUserCurrency } from "../../utils/fetchUserCurrency";
import { useRazorpay } from "react-razorpay";
import { getSettings } from "../../apiServices/service";

const VerifyOtp = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const storedPlanId = localStorage.getItem("planId");
  const useremail = localStorage.getItem("email");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { isLoading, Razorpay } = useRazorpay();
  const [isResending, setIsResending] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [resendTimeout, setResendTimeout] = useState(null);
  const [currency, setCurrency] = useState('INR');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  // const RAZORPAY_KEY="rzp_test_RCgVrVrmvJdgXN";
  const RAZORPAY_KEY="rzp_live_RCkabhPcYupdB7";
  const [activeGateway, setActiveGateway] = useState(null);
  // console.log(activeGateway);
  const UserId = localStorage.getItem("userId");
  useEffect(() => {
  const fetchGateway = async () => {
    try {
      const res = await getSettings();
      if (res?.data?.length > 0) {
        const pg = res.data[0].paymentGateways;
        if (pg.razorpay.status) setActiveGateway("razorpay");
        else if (pg.stripe.status) setActiveGateway("stripe");
      }
    } catch (err) {
      console.error("Failed to fetch gateway", err);
    }
  };
  fetchGateway();
}, []);

  // const token = authuser?.token;
  // const config = {
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${token}`,
  //   },
  // };

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (!canResend) {
      const timeoutId = setTimeout(() => {
        setCanResend(true);
      }, 30000);

      setResendTimeout(timeoutId);

      return () => clearTimeout(timeoutId);
    }
  }, [canResend]);

  useEffect(() => {
    const getCurrency = async () => {
    const userCurrency = await fetchUserCurrency();
      setCurrency(userCurrency);
    };
    getCurrency();
  }, [])
  

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setError("");
    }
  };
// const planPrice = parseFloat(localStorage.getItem("planPrice") || "0");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!otp) {
  //     toast.error("Please enter OTP");
  //     setError("OTP is required.");
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setError("");

  //   const otpNumber = Number(otp);
  //   const response = await axios
  //     .post(`${process.env.REACT_APP_URL}/auth/verify-otp`, {
  //       email,
  //       otp: otpNumber,
  //     })
  //     .then((response) => {
  //       toast.success(response.message);
  //       const checkoutResponse = await axios.post(`${process.env.REACT_APP_URL}/payment/create-checkout-session`, {
  //         email: useremail,  
  //         planId: storedPlanId,  
  //       });

  //       // Step 3: Redirect the user to Stripe Checkout
  //       window.location.href = checkoutResponse.data.checkoutUrl;
  //       setShowModal(true); // Show the acknowledgment modal after successful verification
  //     })
  //     .catch((err) => {
  //       const errorMessage = err.response?.message || "Invalid OTP";
  //       toast.error(errorMessage);
  //       setError(errorMessage);
  //     })
  //     .finally(() => {
  //       setIsSubmitting(false);
  //     });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  
  //   if (!otp) {
  //     toast.error("Please enter OTP");
  //     setError("OTP is required.");
  //     return;
  //   }
  
  //   setIsSubmitting(true);
  //   setError("");
  
  //   try {
  //     // Step 1: Verify OTP
  //     const otpNumber = Number(otp);
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_URL}/auth/verify-otp`,
  //       {
  //         email,
  //         otp: otpNumber,
  //       }
  //     );
  
  //     toast.success(response.data.message || "OTP Verified Successfully!");
  //     // Step 2: Create Checkout Session
  //     const checkoutResponse = await axios.post(
  //       `${process.env.REACT_APP_URL}/payment/create-checkout-session`,
  //       {
  //         email: useremail,
  //         planId: storedPlanId,
  //         currency: currency,
  //       }
  //     );
  
  //     if (checkoutResponse.data.checkoutUrl) {
  //       window.location.href = checkoutResponse.data.checkoutUrl;
  //     } else {
  //       toast.error("Failed to retrieve checkout URL. Please try again.");
  //     }
  
  //     // setShowModal(true);
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.message || "Invalid OTP or Payment Issue";
  //     toast.error(errorMessage);
  //     setError(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!otp) {
    toast.error("Please enter OTP");
    setError("OTP is required.");
    return;
  }

  setIsSubmitting(true);
  setError("");

  try {
    const otpNumber = Number(otp);
    const response = await axios.post(
      `${process.env.REACT_APP_URL}/auth/verify-otp`,
      { email, otp: otpNumber }
    );

    toast.success(response.data.message || "OTP Verified Successfully!");

    const planPrice = parseFloat(localStorage.getItem("planPrice") || "0");

    if (planPrice > 0) {
    const gateway = activeGateway;
  if (gateway === "razorpay") {
    const orderResponse = await axios.post(
      `${process.env.REACT_APP_URL}/payment/razorpay/create-order`,
      {
        email: useremail,
        planId: storedPlanId,
        currency: currency,
        amount: localStorage.getItem("planPrice"),
        userId: UserId,
      }
    );

    const options = {
      key: RAZORPAY_KEY,
      amount: orderResponse.response.amount,
      currency: orderResponse.response.currency,
      order_id: orderResponse.response.orderId,
      name: "aaMOBee",
      description: "Plan Purchase",
      handler: async function (response) {
        try {
          await axios.post(`${process.env.REACT_APP_URL}/payment/razorpay/verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          toast.success("Payment successful & verified!");
          window.location.href = "https://aamobee.com/login"; 
        } catch (err) {
          toast.error("Payment verification failed!");
        }
      },
      prefill: { email: useremail },
    };
    const rzp = new Razorpay(options);
    rzp.open();

  } else if (gateway === "stripe") {
    const checkoutResponse = await axios.post(
      `${process.env.REACT_APP_URL}/payment/create-checkout-session`,
      {
        email: useremail,
        planId: storedPlanId,
        currency: localStorage.getItem("planCurrency"), 
        amount: planPrice,
      }
    );
    if (checkoutResponse.data.checkoutUrl) {
      window.location.href = checkoutResponse.data.checkoutUrl;
    } else {
      toast.error("Failed to retrieve Stripe checkout URL.");
    }
  }

    } else {
      // Call the free plan payment API
      await axios.post(`${process.env.REACT_APP_URL}/payment/free-plan`, {
        userId: UserId,
        planId: storedPlanId,
        amount: 0,
      });

      toast.success("Free plan activated successfully!");
      // setShowModal(true);
      navigate("/login");
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Invalid OTP or Payment Issue";
      console.log(err);
    toast.error(errorMessage);
    setError(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleResendOtp = () => {
    if (!email) {
      toast.error("Email not found. Please try again.");
      return;
    }

    if (!canResend) {
      toast.info("Please wait before requesting a new OTP.");
      return;
    }

    setIsResending(true);
    setCanResend(false);

    const response = axios
      .post(`${process.env.REACT_APP_URL}/auth/resend-otp`, {
        email,
      })
      .then((response) => {
        toast.success(response.message);
      })
      .catch((response) => {
        toast.error(response.message);
      })
      .finally(() => {
        setIsResending(false);
      });
  };

  const handleGoBack = () => {
    // Redirect to the home page or any other page after acknowledgment
    navigate("/");
    setShowModal(false); // Close modal after redirection
  };

  return (
    <React.Fragment>
      <div className="bg-pattern" style={{ minHeight: "100vh", height: "100%" }}>
        <div className="bg-overlay"></div>
        <div className="account-pages pt-5">
          <Container>
            <Row className="d-flex justify-content-center mt-5 width-90">
              <Col lg={6} md={8} xl={4}>
                <Card className="mt-5">
                  <CardBody className="p-4">
                    <div className="text-center">
                      <h3 className="font-size-20 text-primary">OTP Verification</h3>
                      <p className="text-muted mt-2 mb-4">
                        A verification code has been sent to <strong>{email}</strong>. Please enter the OTP below to verify your account.
                      </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label for="otp">Enter OTP</Label>
                        <Input
                          type="text"
                          id="otp"
                          placeholder="Enter the 6-digit OTP"
                          value={otp}
                          onChange={handleChange}
                          maxLength={6}
                        />
                      </FormGroup>

                      <Button color="primary" type="submit" block disabled={isSubmitting}>
                        {isSubmitting ? "Verifying..." : "Verify OTP"}
                      </Button>
                    </form>
                    <div className="mt-2 text-center">
                      <p className="text-muted">
                        <Button
                          color="link"
                          onClick={handleResendOtp}
                          className="p-0 text-primary"
                          disabled={isResending || !canResend}
                        >
                          {isResending ? "Resending..." : "Resend OTP"}
                        </Button>
                      </p>
                      <p className="text-muted">
                        Email already verified!{" "}
                        <Button
                          color="link"
                          onClick={() => navigate('/login')}
                          className="p-0 text-primary"
                        >
                          Go to Login
                        </Button>
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Acknowledgment Modal */}
      <Modal isOpen={showModal} toggle={() => setShowModal(false)} centered>
        <ModalHeader toggle={() => setShowModal(false)} className="text-center">
          <h4 className="text-success">Verification Successful!</h4>
        </ModalHeader>
        <ModalBody>
          <p className="text-center">
            Your request has been forwarded to our administration team. You will receive approval shortly. Thank you for your patience!
          </p>
        </ModalBody>
        <ModalFooter className="justify-content-center">
          <Button color="primary" onClick={handleGoBack}>
            Go Back to Website
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default VerifyOtp;
