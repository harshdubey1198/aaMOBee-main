import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import { validateEmail } from "../Pages/Utility/FormValidation";
import { toast } from "react-toastify";
const VendorModal = ({
  modalOpen,
  toggleModal,
  vendorData,
  handleInputChange,
  handleVendorSubmit,
  editMode,
}) => {
    const authuser = JSON.parse(localStorage.getItem("authUser")).response;
  const blockIfDemo = (actionName) => {
        if (authuser?.isDemo) {
          // setLoading(false);
          toast.error(`Demo accounts cannot create a new ${actionName}`);
          return true; 
        }
        return false; 
      };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (blockIfDemo("Vendors")) return;

    if (!validateEmail(vendorData.email)) {
      // alert("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    handleVendorSubmit();
  };

  return (
    <Modal isOpen={modalOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>{editMode ? "Edit Vendor" : "Create Vendor"}</ModalHeader>
      <ModalBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="name">Vendor Name</Label>
                <Input type="text" name="name" id="name" value={vendorData.name} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="contactPerson">Contact Person</Label>
                <Input type="text" name="contactPerson" id="contactPerson" value={vendorData.contactPerson} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="phone">Phone</Label>
                <Input
                  type="number"
                  name="phone"
                  id="phone"
                  value={vendorData.phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      handleInputChange(e);
                    }
                  }}
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(e) => {
                    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    MozAppearance: 'textfield'
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input type="email" name="email" id="email" value={vendorData.email} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="h_no">House No.</Label>
                <Input type="text" name="h_no" id="h_no" value={vendorData.address.h_no} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="nearby">Nearby Landmark</Label>
                <Input type="text" name="nearby" id="nearby" value={vendorData.address.nearby} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="city">City</Label>
                <Input type="text" name="city" id="city" value={vendorData.address.city} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="state">State</Label>
                <Input type="text" name="state" id="state" value={vendorData.address.state} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="zip_code">Zip Code</Label>
                <Input type="text" name="zip_code" id="zip_code" value={vendorData.address.zip_code} onChange={handleInputChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="country">Country</Label>
                <Input type="text" name="country" id="country" value={vendorData.address.country} onChange={handleInputChange} />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>{editMode ? "Update Vendor" : "Create Vendor"}</Button>
        <Button color="secondary" onClick={toggleModal}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
};

export default VendorModal;
