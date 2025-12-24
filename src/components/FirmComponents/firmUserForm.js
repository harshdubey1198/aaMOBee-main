import React, { useState, useEffect } from "react";
import { Alert, Button, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import axios from "axios";
import { validateEmail, validatePhone } from "../../Pages/Utility/FormValidation";
import { toast } from "react-toastify";

const FirmUserCreateForm = ({ isOpen, toggle, setTrigger, formValues, setFormValues }) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [firmData, setFirmData] = useState(null);
  const [address, setAddress] = useState({});


  const blockIfDemo = (actionName) => {
      if (authUser?.isDemo) {
        // setLoading(false);
        toast.error(`Demo accounts cannot create a new ${actionName}`);
        return true; 
      }
      return false; 
    };


  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URL}/auth/getCompany/${authUser?.response.adminId}`)
      .then((response) => {
        const firmData = response;
        setFirmData(firmData);
        console.log(firmData, "Firm Data");
        setFormValues((prevState) => ({
          ...prevState,
          firmId: firmData._id,
        }));
      })
      .catch((error) => {
        console.log("Error fetching firm data", error);
        setError("Failed to fetch firm data");
      });
  }, [authUser?.response.adminId, setFormValues]);

  const handleSubmit = (e) => {
    if (blockIfDemo("users")) return;
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateEmail(formValues.email)) {
      toast.error("Invalid Email");
      return; 
    }

    if (!formValues.gender) {
      toast.error("Please select a gender");
      return;
    }

    // if (!validatePhone(formValues.mobile)) {
    //   toast.error("Invalid Phone Number");
    //   return;
    // }
    // if (formValues.password !== formValues.confirmPassword) {
    //   toast.error("Passwords do not match");
    //   return;
    // }
    // if (Object.keys(address).length === 0) {
    //   toast.error("Address is required");
    //   return;
    // }

    fetch(`${process.env.REACT_APP_URL}/auth/createUser/${authUser?.response.adminId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formValues, address }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          toast.error(error.error);
          return;
        }
        toast.success("User added successfully ✅");
        setTrigger((prev) => prev + 1);
        setFormValues({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          emergencyContact: "",
          birthday: "",
          gender: "",
          role: "",
        });
        setAddress({});
        toggle();
      })
      .catch((error) => {
        console.log("Error creating user", error);
        toast.error("Error creating user");
      });
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
      <ModalHeader toggle={toggle} className="bg-primary text-white">Add New User</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <Label className="form-label">Fill in the details below</Label>
            {firmData && <h5 className="text-primary">{firmData.companyTitle}</h5>}
          </div>
          <Row>
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
                  {/* <option value="">Select Role</option> */}
                  <option value="accountant">Accountant</option>
                  <option value="employee">Employee</option>
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
                  value={formValues.lastName}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="gender" className="form-label">Gender</Label>
                <Input
                  type="select"
                  name="gender"
                  id="gender"
                  value={formValues.gender}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Input>
              </FormGroup>
            </Col>

            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="email" className="form-label">Email</Label>
                <Input
                  name="email"
                  type="email"
                  id="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup className="mb-3">
                <Label for="mobile" className="form-label">Mobile</Label>
                <Input
                  name="mobile"
                  id="mobile"
                  value={formValues.mobile}
                  onChange={handleChange}
                  className="form-control"
                />
              </FormGroup>
            </Col>
          </Row>

          <ModalFooter className="px-0 pb-0">
            <Button color="secondary" onClick={toggle} className="btn btn-secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" className="btn btn-primary">
              Submit
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default FirmUserCreateForm;
