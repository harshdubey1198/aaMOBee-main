import React, { useEffect, useState } from "react";
import { Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import axios from "axios";
import { checkEmptyFields, validateEmail, validatePhone } from "../../Pages/Utility/FormValidation";
import { toast } from "react-toastify";
import AddressForm from "./adressForm";

const ClientUserCreateForm = ({ isOpen, toggle, setTrigger, selectedFirmId, formValues, setFormValues, availableRoles }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [firms, setFirms] = useState([]);
  // const [show, setShow] = useState({
  //   password: false,
  //   confirmPassword: false,
  // });
  const [address, setAddress] = useState({});
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const blockIfDemo = (actionName) => {
      if (authuser?.response?.isDemo) {
        setLoading(false);
        toast.error(`Demo accounts cannot create a new ${actionName}`);
        return true; 
      }
      return false; 
    };
  const [loading, setLoading] = useState(false);
  const firmId = formValues.firmId;
  useEffect(() => {
    if (selectedFirmId) {
      const selectedFirm = firms.find((firm) => firm._id === selectedFirmId);
      // console.log("inside selectedFirmId");
      if (selectedFirm) {
        setFormValues((prevState) => ({
          ...prevState,
          firmName: selectedFirm.companyTitle,
          firmId: selectedFirm._id,
        }));
      }
    }
  }, [selectedFirmId]);
  const handleFirmChange = (e) => {
    const selectedFirm = firms.find((firm) => firm.companyTitle === e.target.value);
    if (selectedFirm) {
      setFormValues((prevState) => ({
        ...prevState,
        firmName: e.target.value,
        firmId: selectedFirm._id,
      }));
    }
  };

  useEffect(() => {
    if (authuser) {
      axios.get(`${process.env.REACT_APP_URL}/auth/getCompany/${authuser?.response._id}`)
        .then((response) => {
          setFirms(response);
          // console.log(response, "Firms");
        })
        .catch((error) => {
          console.log(error, "Error getting firms");
        });
    }
  }, []);
  const handleSubmit = (e) => {
    if (blockIfDemo("users")) return;
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true); // start loader

    if (!formValues.firstName || !formValues.lastName || !formValues.email || !formValues.mobile || !formValues.role) {
      setError("Fill All the Fields");
      toast.error("Fill All the Fields");
      setLoading(false);
      return;
    }

    if (!validateEmail(formValues.email)) {
      setError("Invalid Email");
      toast.error("Invalid Email");
      setLoading(false);
      return;
    }

    if (!validatePhone(`${formValues.mobileCode}${formValues.mobile}`)) {
      setError("Invalid Phone Number");
      toast.error("Invalid Phone Number");
      setLoading(false);
      return;
    }

    if (!formValues.firmId) {
      setError("No firm selected");
      toast.error("No firm selected");
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_URL}/auth/createUser/${firmId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formValues,
        mobile: `${formValues.mobileCode || ""}${formValues.mobile || ""}`,
        address,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          toast.error(error.error);
          setLoading(false);
          return;
        }
        await response.json();
        setError("");
        setTrigger((prev) => prev + 1);
        setFormValues({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          mobileCode: "+91",
          birthday: "",
          gender: "",
          role: "",
        });
        setAddress({});
        toggle();
        toast.success("User added successfully.");
      })
      .catch((error) => {
        console.log("Full error object:", error);
        toast.error("Error creating user");
      })
      .finally(() => {
        setLoading(false); // always stop loader
      });
  };


  const formatDate = (date) => {
    const [year, month, day] = date.split("-");
    return `${day}-${month}-${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
      <ModalHeader toggle={toggle} className=" text-white" style={{
        background: "var(--bs-header-dark-bg)",
      }}>Add New User</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="firmName" className="form-label">Firm Name</Label>
                <Input
                  type="select"
                  name="firmName"
                  id="firmName"
                  value={formValues.firmName}
                  onChange={handleFirmChange}
                  className="form-select"
                >
                  <option value="">Select Firm</option>
                  {firms.map((firm) => (
                    <option key={firm._id} value={firm.companyTitle}>
                      {firm.companyTitle}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="role" className="form-label">Role</Label>
                <Input
                  type="select"
                  name="role"
                  id="role"
                  value={formValues.role}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Role</option>
                  {availableRoles.map((role) => (
                    <option key={role} value={role}>
                      {role?.replace(/[_-]/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="firstName" className="form-label">First Name</Label>
                <Input
                  name="firstName"
                  id="firstName"
                  value={formValues.firstName}
                  placeholder="First Name"
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>

            </Col>

            <Col md={6}>

              <FormGroup className="mb-3">
                <Label for="lastName" className="form-label">Last Name</Label>
                <Input
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="email" className="form-label">Email</Label>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="mobile" className="form-label">Mobile</Label>
                <div className="d-flex">
                  <Input
                    type="select"
                    name="mobileCode"
                    value={formValues.mobileCode}
                    onChange={handleChange}
                    style={{
                      width: "120px",
                      borderRadius: "6px 0 0 6px",
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
                    name="mobile"
                    id="mobile"
                    placeholder="Enter mobile number"
                    value={formValues.mobile}
                    onChange={handleChange}
                    className="form-control"
                    style={{
                      borderRadius: "0 6px 6px 0",
                    }}
                  />
                </div>
              </FormGroup>
            </Col>

          </Row>

          {/* <AddressForm
            address={address}
            handleAddressChange={handleAddressChange}
          /> */}

          <ModalFooter className="px-0 pb-0">
            <Button color="secondary" onClick={toggle} className="btn btn-secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>

          </ModalFooter>
        </form>

      </ModalBody>
    </Modal>
  );
};

export default ClientUserCreateForm;
