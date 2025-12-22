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
  const firmId = formValues.firmId;
  useEffect(() => {
  if(selectedFirmId){
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
    e.preventDefault();
    setError("");
    setSuccess("");

    // if (checkEmptyFields(formValues)) {
    //   setError("Fill All the Fields");
    //   toast.error("Fill All the Fields");
    //   return;
    // }
    if (!formValues.firstName || !formValues.lastName || !formValues.email || !formValues.mobile || !formValues.role )
    {
      setError("Fill All the Fields");
      toast.error("Fill All the Fields");
      return;
    }


    if (!validateEmail(formValues.email)) {
      setError("Invalid Email");
      toast.error("Invalid Email");
      return;
    }
    
    if (!validatePhone(formValues.mobile)) {
      setError("Invalid Phone Number");
      toast.error("Invalid Phone Number");
      return;
    }
    // if (formValues.password !== formValues.confirmPassword) {
    //   setError("Passwords do not match");
    //   toast.error("Passwords do not match");
    //   return;
    // }

    // if (Object.keys(address).length === 0) {
    //   setError("Address is required");
    //   toast.error("Address is required");
    //   return;
    // }
    if (!formValues.firmId) {
      setError("No firm selected");
      toast.error("No firm selected");
      return;
    }

    fetch(`${process.env.REACT_APP_URL}/auth/createUser/${firmId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formValues,
        address
      })
    })
    .then(async (response) => {
      if (!response.ok) {
        const error = await response.json();
        // console.log(error.error, "Error creating user");
        toast.error(error.error);
        return;
      }
      const data = await response.json();
      toast.success("User added successfully.");
      setError("");
      setTrigger((prev) => prev + 1);
      setFormValues({
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        // password: "",
        // confirmPassword: "",
        birthday: "",
        gender: "",
        role: "",
      });
      setAddress({});
      toggle();
    })
    .catch((error) => {
      console.log("Full error object:", error);
      // toast.error("Error creating user");
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
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Add New User</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <Row>
           <Col md={6}> 
              <FormGroup>
                  <Label>Firm Name</Label>
                  <Input
                    type="select"
                    name="firmName"
                    value={formValues.firmName} 
                    onChange={handleFirmChange}
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
                <FormGroup>
                    <Label>Role</Label>
                    <Input
                      type="select"
                      name="role"
                      value={formValues.role}
                      onChange={handleChange}
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
              <FormGroup>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={formValues.firstName}
                  placeholder="First Name"
                  onChange={handleChange}
                />
              </FormGroup>
             
              </Col>

            <Col md={6}>
              
              <FormGroup>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  value={formValues.lastName}
                  onChange={handleChange}
                />
              </FormGroup>
            </Col>

            <Col md={6}>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    name="email"
                    type="text"
                    placeholder="Email"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label>Mobile</Label>
                  <Input
                    name="mobile"
                    placeholder="Mobile"
                    value={formValues.mobile}
                    onChange={handleChange}
                  />
                </FormGroup>
              
            </Col>
          </Row>

          {/* <AddressForm
            address={address}
            handleAddressChange={handleAddressChange}
          /> */}

          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </ModalFooter>
        </form>
        
      </ModalBody>
    </Modal>
  );
};

export default ClientUserCreateForm;
