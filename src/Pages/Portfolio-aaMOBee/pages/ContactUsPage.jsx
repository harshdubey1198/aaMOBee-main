import React, { useState } from "react";
import HeaderWithDashboard from "../components/headerWithDashboard";
import Footer from "../components/footer";
import Select from "react-select";
import { toast } from "react-toastify";
import { QueryFormRequest, SendContactOtpRequest } from "../../../apiServices/service";
import { Modal, Button } from "react-bootstrap";

function ContactUsPage() {
  const [showProducts, setShowProducts] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [reason, setReason] = useState(null);
  const [customSubject, setCustomSubject] = useState("");

  const contactReasons = [
    { value: "support", label: "Support" },
    { value: "billing", label: "Billing" },
    { value: "demo", label: "Demo" },
    { value: "onboarding", label: "Onboarding" },
    { value: "login", label: "Login Issue" },
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature Request" },
    { value: "api", label: "API Help" },
    { value: "cancel", label: "Cancel Plan" },
    { value: "upgrade", label: "Upgrade" },
    { value: "feedback", label: "Feedback" },
    { value: "payment", label: "Payment Issue" },
    { value: "account", label: "Account Update" },
    { value: "data", label: "Data Issue" },
    { value: "partner", label: "Partner Inquiry" },
    { value: "others", label: "Others" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // STEP 1: Send OTP API
const handleSendClick = async (e) => {
  e.preventDefault();

  if (!formData.name || !formData.email || !formData.message || (!reason && !customSubject)) {
    toast.error("Please fill all fields properly.");
    return;
  }

  setIsLoading(true);
  try {
    const otpRes = await SendContactOtpRequest({
      email: formData.email,
      name: formData.name
    });

    // ✅ Always open modal if no error occurred
    if (otpRes) {
      toast.success(otpRes?.message || "OTP sent to your email!");
      setShowOtpModal(true);  // ✅ open OTP modal here
    } else {
      toast.error("Failed to send OTP!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error while sending OTP!");
  } finally {
    setIsLoading(false);
  }
};

  // STEP 2: Submit Contact Form with OTP
const handleOtpSubmit = async () => {
  if (!otp) {
    toast.error("Please enter the OTP.");
    return;
  }

  const finalSubject = customSubject || (reason && reason.label);

  setIsLoading(true);
  try {
    const formDataPayload = new FormData();
    formDataPayload.append("name", formData.name);
    formDataPayload.append("email", formData.email);
    formDataPayload.append("subject", finalSubject);
    formDataPayload.append("message", formData.message);
    formDataPayload.append("otp", otp);

    const res = await QueryFormRequest(formDataPayload);

    if (res?.data) {
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
      setReason(null);
      setCustomSubject("");
      setOtp("");
      setShowOtpModal(false);
    } else {
      toast.error(res?.message || "Failed to send message!");
    }
  } catch (error) {
    console.error(error);
    toast.error("Error while submitting message!");
  } finally {
    setIsLoading(false);
  }
};


  return (
    <>
      <HeaderWithDashboard showProducts={showProducts} setShowProducts={setShowProducts} />
      <div
        className="contact-main"
        style={{
          background: "linear-gradient(to right, #e0ecff, #fefcea)",
          padding: "60px 50px 40px 50px",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-6">
              <h3 className="mb-4 fw-bold">Contact Us</h3>
              <form className="p-4 shadow rounded bg-white" onSubmit={handleSendClick}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    placeholder="Enter your full name"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <Select
                    options={contactReasons}
                    placeholder="Select a reason..."
                    value={reason}
                    onChange={(selected) => {
                      setReason(selected);
                      if (selected.value !== "others") {
                        setCustomSubject(selected.label);
                      } else {
                        setCustomSubject("");
                      }
                    }}
                    required
                  />
                </div>

                {reason?.value === "others" && (
                  <div className="mb-3">
                    <label className="form-label">Custom Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customSubject}
                      placeholder="Type your subject"
                      onChange={(e) => setCustomSubject(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    style={{ maxHeight: "200px" }}
                    placeholder="Type your message here..."
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary px-4 rounded-pill" disabled={isLoading}>
                  {isLoading ? "Please wait..." : "Send Message"}
                </button>
              </form>
            </div>

            <div className="col-lg-6">
              <h3 className="mb-4 fw-bold">Country Support & Timing</h3>

              {/* India Card */}
              <div className="card mb-3" style={{ background: "rgba(255, 255, 255, 0.25)", borderRadius: "16px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)" }}>
                <div className="card-body">
                  <h5 className="card-title">🇮🇳 India</h5>
                  <p className="mb-1"><strong>Support Hours:</strong> Mon–Sat, 10:00 AM – 6:00 PM (IST)</p>
                  <p className="mb-1"><strong>Weekly Off:</strong> Sunday</p>
                  <p className="mb-1"><strong>Email:</strong> support@aamobee.com</p>
                  <p className="text-muted">Support in English & Hindi</p>
                </div>
              </div>

              {/* UAE Card */}
              <div className="card mb-3" style={{ background: "rgba(255, 255, 255, 0.25)", borderRadius: "16px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255, 255, 255, 0.3)", boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)" }}>
                <div className="card-body">
                  <h5 className="card-title">🇦🇪 United Arab Emirates (UAE)</h5>
                  <p className="mb-1"><strong>Support Hours:</strong> Mon–Fri, 9:00 AM – 5:00 PM (GST)</p>
                  <p className="mb-1"><strong>Weekly Off:</strong> Saturday & Sunday</p>
                  <p className="mb-1"><strong>Email:</strong> support@aamobee.com</p>
                  <p className="text-muted">Support in English & Basic Arabic</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
     <Modal 
  show={showOtpModal} 
  onHide={() => setShowOtpModal(false)} 
  centered
  backdrop="static"   // ⬅️ Prevent closing on outside click
  keyboard={false}    // ⬅️ Optional: prevent closing on ESC key
>
  <Modal.Header closeButton>
    <Modal.Title>Enter OTP</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <input
      type="text"
      className="form-control"
      placeholder="Enter OTP"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowOtpModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleOtpSubmit} disabled={isLoading}>
      {isLoading ? "Verifying..." : "Submit"}
    </Button>
  </Modal.Footer>
</Modal>

      <Footer />
    </>
  );
}

export default ContactUsPage;
