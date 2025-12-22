import React, { useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, Form } from "reactstrap";
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
  document.title = "Firm Form";
  const today = new Date().toISOString().split("T")[0];
  const role = JSON.parse(localStorage.getItem("authUser"))?.response?.role || "firm_admin";
  const [formValues, setFormValues] = useState({
    role: "firm",
    companyTitle: "",
    companyMobile: "",
    email: "",
    avatar: null,
    password: "Admin@123",
    incorporationDate: "",
    firmIndustry: "",
    businessType: "",
    country: "",
    companyTelephone: "",
    businessAddress: "",
    registrationNumber: "",
    gstinOrTrn: "",
  });


  const [firmType, setFirmType] = useState('');
  const [subIndustry, setSubIndustry] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


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
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   if (!validateEmail(formValues.email)) {
  //     toast.error("Invalid email");
  //     setLoading(false);
  //     return;
  //   }
  //   if (formValues.companyMobile && !validatePhone(formValues.companyMobile)) {
  //     toast.error("Invalid Phone Number");
  //     setLoading(false);
  //     return;
  //   }

  //   if (!validatePassword(formValues.password)) {
  //     toast.error("Invalid Password");
  //     setLoading(false);
  //     return;
  //   }
  //   // if (formValues.password !== formValues.confirmPassword) {
  //   //   toast.error("Passwords do not match");
  //   //   setLoading(false);
  //   //   return;
  //   // }
  //   const authUserData = JSON.parse(localStorage.getItem("authUser"));
  //   const authUser = authUserData?.response;
  //   const clientId = authUser?._id;

  //   if (!clientId) {
  //     setLoading(false);
  //     toast.error("User ID not found");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("role", formValues.role);
  //   formData.append("companyTitle", formValues.companyTitle);
  //   formData.append("companyMobile", formValues.companyMobile);
  //   formData.append("companyTelephone", formValues.companyTelephone);
  //   formData.append("email", formValues.email);
  //   formData.append("password", formValues.password);
  //   formData.append("incorporationDate", formValues.incorporationDate);
  //   formData.append("firmIndustry", formValues.firmIndustry);
  //   formData.append("businessType", formValues.businessType);
  //   formData.append("country", formValues.country);
  //   formData.append("registrationNumber", formValues.registrationNumber);
  //   formData.append("gstinOrTrn", formValues.gstinOrTrn);


  //   if (formValues.avatar) {
  //     formData.append("avatar", formValues.avatar);
  //   }
  //   if (subIndustry) {
  //     formData.append("firmSubIndustry", subIndustry.value);
  //   }

  //   try {
  //     const response = await axios.post(
  //       `${process.env.REACT_APP_URL}/auth/createUser/${clientId}`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //         },
  //       }
  //     );
  //     console.log("response :", response);
  //     const newFirm = response.data;
  //     if (newFirm?._id) {
  //       localStorage.setItem(
  //         "defaultFirm",
  //         JSON.stringify({
  //           firmId: newFirm._id,
  //           fuid: newFirm.fuid,
  //           name: newFirm.firmName,
  //           companyTitle: newFirm.companyTitle,
  //         })
  //       );
  //     }
  //     toast.success(response.message);
  //     // toast.success(response);
  //     setFormValues({
  //       role: "firm",
  //       companyTitle: "",
  //       companyMobile: "",
  //       email: "",
  //       password: "Admin@123",
  //       // confirmPassword: "",
  //       avatar: null,
  //       incorporationDate: "",
  //       firmSpecified: [],
  //       firmIndustry: "",
  //     });
  //     navigate('/firms');
  //     if (role === "firm_admin") {
  //       navigate('/firm-branding');
  //     }
  //     if (role === "client_admin") {
  //       navigate('/business-branding');
  //     }

  //   } catch (error) {
  //     console.log('====================================');
  //     console.log("Full error object:", error);

  //     if (error.response) {
  //       console.log("Error response data:", error.response.data);
  //       const errorMessage =
  //         error.response.data?.error ||
  //         error.response.data?.message ||
  //         'An unexpected error occurred';

  //       console.log("Extracted errorMessage:", errorMessage);
  //       toast.error(errorMessage);
  //     } else if (error.request) {
  //       console.log("No response received:", error.request);
  //       toast.error("No response received from server.");
  //     } else {
  //       console.log("Error setting up the request:", error.message);
  //       toast.error("Request setup error");
  //     }

  //     console.log('====================================');
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
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

    const authUserData = JSON.parse(localStorage.getItem("authUser"));
    const authUser = authUserData?.response;
    const clientId = authUser?._id;

    if (!clientId) {
      setLoading(false);
      toast.error("User ID not found");
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    formData.append("role", formValues.role);
    formData.append("companyTitle", formValues.companyTitle);
    formData.append("companyMobile", formValues.companyMobile);
    formData.append("companyTelephone", formValues.companyTelephone);
    formData.append("email", formValues.email);
    formData.append("password", formValues.password);
    formData.append("incorporationDate", formValues.incorporationDate);
    formData.append("firmIndustry", formValues.firmIndustry);
    formData.append("businessType", formValues.businessType);
    formData.append("country", formValues.country);
    formData.append("registrationNumber", formValues.registrationNumber);
    formData.append("gstinOrTrn", formValues.gstinOrTrn);

    if (formValues.avatar) {
      formData.append("avatar", formValues.avatar);
    }

    if (subIndustry) {
      formData.append("firmSubIndustry", subIndustry.value);
    }

    // Include clientId in the FormData or URL param if needed
    formData.append("clientId", clientId);

    try {
      const response = await createUser(formData, clientId); // ✅ Corrected; // ✅ using the service function
      const newFirm = response?.data;

      if (newFirm?._id) {
        localStorage.setItem("defaultFirm", JSON.stringify({
          firmId: newFirm._id,
          fuid: newFirm.fuid,
          name: newFirm.firmName,
          companyTitle: newFirm.companyTitle,
        }));
      }

      toast.success(response.message || "User created successfully");

      // Reset form
      setFormValues({
        role: "firm",
        companyTitle: "",
        companyMobile: "",
        email: "",
        password: "Admin@123",
        avatar: null,
        incorporationDate: "",
        firmSpecified: [],
        firmIndustry: "",
      });

      // Navigate based on role
      navigate("/firms");
      if (role === "firm_admin") {
        navigate("/firm-branding");
      } else if (role === "client_admin") {
        navigate("/business-branding");
      }

    } catch (error) {
     console.log("❌ Error creating user:", error?.response?.data || error);
      const errorMessage = error?.error 
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Business Setup" breadcrumbItem="Add New Business" />
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} md={10}>
              <Card className="mt-1">
        {/* <BackButton />   */}
                <CardBody className="m-0 p-0">
                  {/* <h4 className="font-size-22 text-center card-title-heading">
                    Add New Business
                  </h4> */}
                  <Form onSubmit={handleSubmit} className="p-4">
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="companyTitle">Business Name</Label>
                          <Input
                            type="text"
                            id="companyTitle"
                            name="companyTitle"
                            placeholder="Enter firm name"
                            value={formValues.companyTitle}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="businessType">Business Type</Label>
                          <Input
                            type="select"
                            name="businessType"
                            id="businessType"
                            value={formValues.businessType}
                            onChange={handleChange}
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
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="firmIndustry">Industry Type</Label>
                          <select
                            id="firmIndustry"
                            name="firmIndustry"
                            className="form-select"
                            value={formValues.firmIndustry}
                            onChange={handleChange}
                          >
                            <option value="">Select Firm Industry</option>
                            <option value="trader">Trading</option>
                            <option value="manufacturer">Manufacturing</option>
                            <option value="service">Service</option>
                          </select>
                        </FormGroup>
                      </Col>
                      {formValues.firmIndustry && (
                        <Col md={6}>
                          <FormGroup>
                            <Label htmlFor="subIndustry">Industry</Label>
                            <Select
                              id="subIndustry"
                              options={firmSubIndustries[formValues.firmIndustry] || []}
                              value={subIndustry}
                              onChange={(selectedOption) => setSubIndustry(selectedOption)}
                              placeholder="Select Sub Industry"
                            />
                          </FormGroup>
                        </Col>
                      )}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="country">Country</Label>
                          <Input
                            type="select"
                            id="country"
                            name="country"
                            value={formValues.country}
                            onChange={handleChange}
                          >
                            <option value="">Select Country</option>
                            <option value="india">India</option>
                            <option value="united_states">United States</option>
                            <option value="united_kingdom">United Kingdom</option>
                            <option value="uae">United Arab Emirates</option>
                            <option value="canada">Canada</option>
                            <option value="australia">Australia</option>
                            <option value="saudi_arabia">Saudi Arabia</option>
                            <option value="malaysia">Malaysia</option>
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="businessAddress">Business Address</Label>
                          <Input
                            type="textarea"
                            id="businessAddress"
                            rows="1"
                            name="businessAddress"
                            placeholder="Enter full business address"
                            value={formValues.businessAddress}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="email">Business Email</Label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter Email"
                            value={formValues.email}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="companyMobile">Business Phone</Label>
                          <Input
                            type="text"
                            id="companyTelephone"
                            name="companyTelephone"
                            placeholder="Enter Telephone"
                            value={formValues.companyTelephone}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="companyMobile">Mobile Number</Label>
                          <Input
                            type="text"
                            id="companyMobile"
                            name="companyMobile"
                            placeholder="Enter Mobile Number"
                            value={formValues.companyMobile}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="registrationNumber">Registration Number</Label>
                          <Input
                            type="text"
                            id="registrationNumber"
                            name="registrationNumber"
                            placeholder="Enter Registration Number"
                            value={formValues.registrationNumber}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>

                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="gstinOrTrn">GSTIN / TRN</Label>
                          <Input
                            type="text"
                            id="gstinOrTrn"
                            name="gstinOrTrn"
                            placeholder="Enter GSTIN or TRN"
                            value={formValues.gstinOrTrn}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>


                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="incorporationDate">Business Start Date</Label>
                          <Input
                            type="date"
                            id="incorporationDate"
                            name="incorporationDate"
                            placeholder="Select start date"
                            value={formValues.incorporationDate}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      {/* <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="createdAt">Collaborating With Us</Label>
                          <Input
                            type="date"
                            id="createdAt"
                            name="createdAt"
                            value={today}
                            disabled
                          />
                        </FormGroup>
                      </Col> */}

                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="avatar">Logo / Brand Icon</Label>
                          <Input
                            type="file"
                            id="avatar"
                            name="avatar"
                            accept="image/*"
                            onChange={handleFileChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={12} className="text-center">
                        <Button color="primary" type="submit" disabled={loading}>
                          {loading ? "Adding..." : "Save & Continue"}
                        </Button>
                      </Col>
                    </Row>
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
