import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, Form, Badge, Alert } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { validateEmail, validatePhone, validatePassword } from "../Utility/FormValidation";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { firmSubIndustries } from "../../data/firmSubIndustries";
import { createUser } from "../../apiServices/service"
import { BackButton } from "../../components/Common/BackButton";

function CreateFirm({ currentAdminId, token }) {
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });
  document.title = "Add New Business | aaMOBee";
  const today = new Date().toISOString().split("T")[0];
  const role = JSON.parse(localStorage.getItem("authUser"))?.response?.role || "firm_admin";
  const [formValues, setFormValues] = useState({
    role: "firm",
    companyTitle: "",
    companyMobile: "",
    companyMobileCode: "+91",
    email: "",
    avatar: null,
    password: "Admin@123",
    incorporationDate: "",
    firmIndustry: "",
    businessType: "",
    country: "",
    companyTelephone: "",
    companyTelephoneCode: "+91",
    businessAddress: "",
    registrationNumber: "",
    gstinOrTrn: "",
  });

  const [firmType, setFirmType] = useState('');
  const [subIndustry, setSubIndustry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const steps = [
    { id: 1, title: "Basic Information", icon: "bx bx-building" },
    { id: 2, title: "Contact Details", icon: "bx bx-phone" },
    // { id: 3, title: "Legal & Documents", icon: "bx bx-file" }
  ];

  const handleFirmTypeChange = (e) => {
    const selectedFirmType = e.target.value;
    setFirmType(selectedFirmType);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "firmIndustry") {
      setSubIndustry(null);
    }

    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormValues((prevState) => ({
        ...prevState,
        avatar: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // prevent double submit
    setLoading(true);  // instantly set loading state

    // validation checks
    if (!validateEmail(formValues.email)) {
      toast.error("Invalid email");
      setLoading(false);
      return;
    }
    if (formValues.companyMobile && !validatePhone(formValues.companyMobile)) {
      toast.error("Invalid Phone Number");
      setLoading(false);
      return;
    }
    if (!validatePassword(formValues.password)) {
      toast.error("Invalid Password");
      setLoading(false);
      return;
    }

    try {
      const authUserData = JSON.parse(localStorage.getItem("authUser"));
      const authUser = authUserData?.response;
      const clientId = authUser?._id;
      //  if (authUser?.isDemo) {
      //    setLoading(false);
      //    toast.error("Demo accounts cannot create a new business");
      //    return;
      //  }
      if (!clientId) {
        toast.error("User ID not found");
        setLoading(false);
        return;
      }

      // Prepare formData...
      const formData = new FormData();
      // append fields...
      formData.append("role", formValues.role);
      formData.append("companyTitle", formValues.companyTitle);
      formData.append("email", formValues.email);
      formData.append("password", formValues.password);
      formData.append("incorporationDate", formValues.incorporationDate);
      formData.append("firmIndustry", formValues.firmIndustry);
      formData.append("businessType", formValues.businessType);
      formData.append("country", formValues.country);
      formData.append("companyTelephone", formValues.companyTelephone);
      formData.append("companyTelephoneCode", formValues.companyTelephoneCode);
      formData.append("businessAddress", formValues.businessAddress);
      formData.append("registrationNumber", formValues.registrationNumber);
      formData.append("gstinOrTrn", formValues.gstinOrTrn);

      // Avatar
      if (formValues.avatar) {
        formData.append("avatar", formValues.avatar);
      }

      // Add missing required fields:
      formData.append("mobileSecondary[number]", formValues.companyMobile || "");
      formData.append("mobileSecondary[countryCode]", formValues.companyMobileCode || "+91");
      formData.append("expiresAt", new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()); // example: 1 year from now


      const response = await createUser(formData, clientId);
      toast.success(response.message || "Business created successfully!");

      // reset values
      setFormValues({ ...formValues, companyTitle: "", email: "" });

      // redirect
      if (role === "firm_admin") navigate("/firm-branding");
      else if (role === "client_admin") navigate("/business-branding");
      else navigate("/firms");

    } catch (error) {
      console.log("❌ Error creating user:", error);
      toast.error(error?.response?.data?.message || "Failed to create business.");
    } finally {
      setLoading(false); // stop loader
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Row>
            <Col lg={12} className="mb-4">
              <div className="text-center">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #1E4E5B 0%, #2ECC71 100%)',
                    borderRadius: '50%'
                  }}
                >
                  <i className="bx bx-building text-white" style={{ fontSize: '32px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Basic Business Information</h4>
                <p className="text-muted">Let's start with the fundamental details of your business</p>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="companyTitle" className="fw-bold text-dark mb-2">
                  <i className="bx bx-building me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Name *
                </Label>
                <Input
                  type="text"
                  id="companyTitle"
                  name="companyTitle"
                  placeholder="Enter your business name"
                  value={formValues.companyTitle}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="businessType" className="fw-bold text-dark mb-2">
                  <i className="bx bx-category me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Type *
                </Label>
                <Input
                  type="select"
                  name="businessType"
                  id="businessType"
                  value={formValues.businessType}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Business Type</option>
                  <option value="sole_proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership</option>
                  <option value="limited_liability_company">Limited Liability Company (LLC)</option>
                  <option value="corporation">Corporation</option>
                  <option value="non_profit">Non-Profit Organization</option>
                  <option value="other">Other</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="firmIndustry" className="fw-bold text-dark mb-2">
                  <i className="bx bx-factory me-2" style={{ color: '#1E4E5B' }}></i>
                  Industry Type *
                </Label>
                <select
                  id="firmIndustry"
                  name="firmIndustry"
                  className="form-select"
                  value={formValues.firmIndustry}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Industry Type</option>
                  <option value="trader">Trading</option>
                  <option value="manufacturer">Manufacturing</option>
                  <option value="service">Service</option>
                </select>
              </FormGroup>
            </Col>

            {formValues.firmIndustry && (
              <Col md={6} className="mb-3">
                <FormGroup>
                  <Label htmlFor="subIndustry" className="fw-bold text-dark mb-2">
                    <i className="bx bx-target-lock me-2" style={{ color: '#1E4E5B' }}></i>
                    Sub Industry
                  </Label>
                  <Select
                    id="subIndustry"
                    options={firmSubIndustries[formValues.firmIndustry] || []}
                    value={subIndustry}
                    onChange={(selectedOption) => setSubIndustry(selectedOption)}
                    placeholder="Select Sub Industry"
                    styles={{
                      control: (provided, state) => ({
                        ...provided,
                        borderRadius: '12px',
                        border: state.isFocused ? '2px solid #1E4E5B' : '2px solid #e9ecef',
                        boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(30, 78, 91, 0.25)' : 'none',
                        padding: '4px',
                        transition: 'all 0.3s ease'
                      }),
                      option: (provided, state) => ({
                        ...provided,
                        backgroundColor: state.isSelected ? '#1E4E5B' : state.isFocused ? '#f8f9fa' : 'white',
                        color: state.isSelected ? 'white' : '#333',
                        padding: '12px 16px'
                      })
                    }}
                  />
                </FormGroup>
              </Col>
            )}

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="country" className="fw-bold text-dark mb-2">
                  <i className="bx bx-globe me-2" style={{ color: '#1E4E5B' }}></i>
                  Country *
                </Label>
                <Input
                  type="select"
                  id="country"
                  name="country"
                  value={formValues.country}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <option value="">Select Country</option>
                  <option value="india">India</option>
                  {/* <option value="united_states">United States</option>
                  <option value="united_kingdom">United Kingdom</option> */}
                  <option value="uae">United Arab Emirates</option>
                  {/* <option value="canada">Canada</option>
                  <option value="australia">Australia</option> */}
                  <option value="saudi_arabia">Saudi Arabia</option>
                  <option value="malaysia">Malaysia</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="incorporationDate" className="fw-bold text-dark mb-2">
                  <i className="bx bx-calendar me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Start Date
                </Label>
                <Input
                  type="date"
                  id="incorporationDate"
                  name="incorporationDate"
                  placeholder="Select start date"
                  value={formValues.incorporationDate}
                  onChange={handleChange}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </FormGroup>
            </Col>

            {/* <Col md={12} className="mb-3">
              <FormGroup>
                <Label htmlFor="businessAddress" className="fw-bold text-dark mb-2">
                  <i className="bx bx-map me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Address
                </Label>
                <Input
                  type="textarea"
                  id="businessAddress"
                  rows="3"
                  name="businessAddress"
                  placeholder="Enter complete business address"
                  value={formValues.businessAddress}
                  onChange={handleChange}
                  style={{ 
                    borderRadius: '12px', 
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </FormGroup>
            </Col> */}
          </Row>
        );

      case 2:
        return (
          <Row>
            <Col lg={12} className="mb-4">
              <div className="text-center">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #3498DB 0%, #2ECC71 100%)',
                    borderRadius: '50%'
                  }}
                >
                  <i className="bx bx-phone text-white" style={{ fontSize: '32px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Contact Information</h4>
                <p className="text-muted">How can customers and partners reach your business?</p>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="email" className="fw-bold text-dark mb-2">
                  <i className="bx bx-envelope me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Email *
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter business email address"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </FormGroup>
            </Col>

            {/* <Col md={6} className="mb-3">
              <FormGroup>
                <Label className="fw-bold text-dark mb-2">
                  <i className="bx bx-lock me-2" style={{ color: '#1E4E5B' }}></i>
                  Default Password
                </Label>
                <div className="form-control" style={{
                  borderRadius: '12px',
                  border: '2px solid #e9ecef',
                  padding: '12px 16px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <span className="text-muted">Admin@123</span>
                  <span className="badge bg-primary ms-2">Default</span>
                </div>
                <small className="text-muted">User can change this after first login</small>
              </FormGroup>
            </Col> */}

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="companyTelephone" className="fw-bold text-dark mb-2">
                  <i className="bx bx-phone-call me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Phone
                </Label>
                <div className="d-flex">
                  <Input
                    type="select"
                    name="companyTelephoneCode"
                    value={formValues.companyTelephoneCode || "+91"}
                    onChange={handleChange}
                    style={{
                      width: "120px",
                      borderRadius: "12px 0 0 12px",
                      border: "2px solid #e9ecef",
                      borderRight: "0",
                    }}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </Input>
                  <Input
                    type="text"
                    id="companyTelephone"
                    name="companyTelephone"
                    placeholder="Enter phone number"
                    value={formValues.companyTelephone}
                    onChange={handleChange}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      border: "2px solid #e9ecef",
                    }}
                  />
                </div>
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="companyMobile" className="fw-bold text-dark mb-2">
                  <i className="bx bx-mobile me-2" style={{ color: '#1E4E5B' }}></i>
                  Mobile Number
                </Label>
                <div className="d-flex">
                  <Input
                    type="select"
                    name="companyMobileCode"
                    value={formValues.companyMobileCode || "+91"}
                    onChange={handleChange}
                    style={{
                      width: "120px",
                      borderRadius: "12px 0 0 12px",
                      border: "2px solid #e9ecef",
                      borderRight: "0",
                    }}
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+971">🇦🇪 +971</option>
                    <option value="+966">🇸🇦 +966</option>
                    <option value="+60">🇲🇾 +60</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                  </Input>
                  <Input
                    type="text"
                    id="companyMobile"
                    name="companyMobile"
                    placeholder="Enter mobile number"
                    value={formValues.companyMobile}
                    onChange={handleChange}
                    style={{
                      borderRadius: "0 12px 12px 0",
                      border: "2px solid #e9ecef",
                    }}
                  />
                </div>
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="avatar" className="fw-bold text-dark mb-2">
                  <i className="bx bx-image me-2" style={{ color: '#1E4E5B' }}></i>
                  Business Logo
                </Label>
                <div className="position-relative">
                  <Input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{
                      borderRadius: '12px',
                      border: '2px solid #e9ecef',
                      padding: '12px 16px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1E4E5B';
                      e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  {avatarPreview && (
                    <div className="mt-2 text-center">
                      <img
                        src={avatarPreview}
                        alt="Logo preview"
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '12px',
                          objectFit: 'cover',
                          border: '2px solid #e9ecef'
                        }}
                      />
                    </div>
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
        );

      case 3:
        return (
          <Row>
            <Col lg={12} className="mb-4">
              <div className="text-center">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #F7931E 0%, #E74C3C 100%)',
                    borderRadius: '50%'
                  }}
                >
                  <i className="bx bx-file text-white" style={{ fontSize: '32px' }}></i>
                </div>
                <h4 className="fw-bold text-dark mb-2">Legal & Registration Details</h4>
                <p className="text-muted">Complete your business registration information</p>
              </div>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="registrationNumber" className="fw-bold text-dark mb-2">
                  <i className="bx bx-id-card me-2" style={{ color: '#1E4E5B' }}></i>
                  Registration Number
                </Label>
                <Input
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  placeholder="Enter business registration number"
                  value={formValues.registrationNumber}
                  onChange={handleChange}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </FormGroup>
            </Col>

            <Col md={6} className="mb-3">
              <FormGroup>
                <Label htmlFor="gstinOrTrn" className="fw-bold text-dark mb-2">
                  <i className="bx bx-receipt me-2" style={{ color: '#1E4E5B' }}></i>
                  GSTIN / TRN
                </Label>
                <Input
                  type="text"
                  id="gstinOrTrn"
                  name="gstinOrTrn"
                  placeholder="Enter GSTIN or TRN number"
                  value={formValues.gstinOrTrn}
                  onChange={handleChange}
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e9ecef',
                    padding: '12px 16px',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1E4E5B';
                    e.target.style.boxShadow = '0 0 0 0.2rem rgba(30, 78, 91, 0.25)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </FormGroup>
            </Col>

            <Col md={12} className="mb-4">
              <Alert
                color="info"
                style={{
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
                }}
              >
                <div className="d-flex align-items-center">
                  <i className="bx bx-info-circle me-3" style={{ fontSize: '24px', color: '#1E4E5B' }}></i>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">Almost Done!</h6>
                    <p className="text-muted mb-0">
                      Review all the information you've provided. Once submitted, you'll be redirected to set up your business branding.
                    </p>
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        );

      default:
        return null;
    }
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container fluid={true} className="px-4 py-3">
          <Breadcrumbs title="Business Setup" breadcrumbItem="Add New Business" />

          <Row className="justify-content-center">
            <Col lg={10} md={12}>
              {/* Progress Steps */}
              <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: '20px' }}>
                <CardBody className="p-4">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold text-dark mb-0">
                      <i className="bx bx-plus-circle me-2" style={{ color: '#1E4E5B' }}></i>
                      Add New Business
                    </h4>
                    <Badge
                      style={{
                        backgroundColor: '#1E4E5B',
                        color: 'white',
                        fontSize: '14px',
                        borderRadius: '20px',
                        padding: '8px 16px'
                      }}
                    >
                      Step {currentStep} of {steps.length}
                    </Badge>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    {steps.map((step, index) => (
                      <div key={step.id} className="d-flex align-items-center flex-grow-1">
                        <div
                          className={`d-flex align-items-center justify-content-center me-3 ${currentStep >= step.id ? 'text-white' : 'text-muted'
                            }`}
                          style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: currentStep >= step.id
                              ? 'linear-gradient(135deg, #1E4E5B 0%, #2ECC71 100%)'
                              : '#f8f9fa',
                            border: currentStep >= step.id ? 'none' : '2px solid #e9ecef',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <i className={`bx ${step.icon}`} style={{ fontSize: '20px' }}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className={`fw-bold mb-1 ${currentStep >= step.id ? 'text-dark' : 'text-muted'}`}>
                            {step.title}
                          </h6>
                          {index < steps.length - 1 && (
                            <div
                              className="progress"
                              style={{
                                height: '4px',
                                borderRadius: '2px',
                                backgroundColor: '#f8f9fa'
                              }}
                            >
                              <div
                                className="progress-bar"
                                style={{
                                  width: currentStep > step.id ? '100%' : '0%',
                                  backgroundColor: '#1E4E5B',
                                  borderRadius: '2px',
                                  transition: 'width 0.3s ease'
                                }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Form Card */}
              <Card className="border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                <CardBody className="p-4">
                  <Form onSubmit={handleSubmit}>
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between align-items-center mt-4 pt-4" style={{ borderTop: '1px solid #e9ecef' }}>
                      <Button
                        type="button"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        style={{
                          backgroundColor: currentStep === 1 ? '#f8f9fa' : '#6c757d',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          fontWeight: '600',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <i className="bx bx-chevron-left me-2"></i>
                        Previous
                      </Button>

                      {currentStep < steps.length ? (
                        <Button
                          type="button"
                          onClick={async () => {
                            // If we're on the last step before submission, validate and submit
                            if (currentStep === steps.length - 0) {
                              // Validate required fields before submitting
                              if (!formValues.companyTitle || !formValues.businessType ||
                                !formValues.firmIndustry || !formValues.country ||
                                !formValues.email) {
                                toast.error("Please fill in all required fields");
                                return;
                              }

                              if (!validateEmail(formValues.email)) {
                                toast.error("Invalid email");
                                return;
                              }

                              if (formValues.companyMobile && !validatePhone(formValues.companyMobile)) {
                                toast.error("Invalid Phone Number");
                                return;
                              }

                              if (!validatePassword(formValues.password)) {
                                toast.error("Invalid Password");
                                return;
                              }

                              // All validations passed, submit the form
                              handleSubmit({ preventDefault: () => { } });
                            } else {
                              // Just navigate to next step for other steps
                              nextStep();
                            }
                          }}
                          style={{
                            backgroundColor: '#1E4E5B',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {currentStep === steps.length - 0 ? "Create Business" : "Next"}
                          <i className={`bx ${currentStep === steps.length - 0 ? 'bx-check' : 'bx-chevron-right'} ms-2`}></i>
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          disabled={loading}
                          style={{
                            background: 'linear-gradient(135deg, #1E4E5B 0%, #2ECC71 100%)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 32px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {loading ? (
                            <>
                              <i className="bx bx-loader-alt bx-spin me-2"></i>
                              Creating Business...
                            </>
                          ) : (
                            <>
                              <i className="bx bx-check me-2"></i>
                              Create Business
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default CreateFirm;
