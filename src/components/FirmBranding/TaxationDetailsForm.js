import React from "react";
import { Row, Col, Input, Button, FormGroup, Label } from "reactstrap";

const TaxationDetailsForm = ({ taxationDetails = [], onAdd, onRemove, onChange, }) => {
   const handleRadioChange = (index) => {
    const updatedDetails = taxationDetails.map((item, i) => ({
      ...item,
      toShow: i === index, 
    }));
    onChange(null, "all", updatedDetails);
  };
  return (
    <div className="taxation-details-form">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="section-title mb-0">Tax / GST / VAT Information</h3>
        <Button
          onClick={onAdd}
          className="btn btn-tertiary"
        >
          + Add Details
        </Button>
      </div>

      {taxationDetails.map((detail, index) => (
        <div key={index} className="card mb-3 p-3">
          <Row className="align-items-center">
            <Col md={4} className="mb-2 mb-md-0">
              <FormGroup>
                <Label>Field Label</Label>
                <Input
                  type="text"
                  placeholder="Field Label"
                  value={detail.fieldName}
                  onChange={(e) => onChange(index, "fieldName", e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
            <Col md={4} className="mb-2 mb-md-0">
              <FormGroup>
                <Label>Value</Label>
                <Input
                  type="text"
                  placeholder="Enter Value"
                  value={detail.fieldValue}
                  onChange={(e) => onChange(index, "fieldValue", e.target.value)}
                  className="form-control"
                />
              </FormGroup>
            </Col>
        <Col md={2} className="d-flex align-items-center gap-2 mb-2 mb-md-0">
  <Button
    color={detail.toShow ? "success" : "secondary"}
    size="sm"
    onClick={() => {
      const updatedDetails = taxationDetails.map((item, i) => ({
        ...item,
        toShow: i === index, // only this one true
      }));
      onChange(index, "all", updatedDetails);
    }}
  >
    Show
  </Button>

  <Button
    color={!detail.toShow ? "danger" : "secondary"}
    size="sm"
    onClick={() => {
      const updatedDetails = [...taxationDetails];
      updatedDetails[index] = { ...updatedDetails[index], toShow: false };
      onChange(index, "all", updatedDetails);
    }}
  >
    Hide
  </Button>
</Col>


            <Col md={2} className="d-flex justify-content-end">
              <Button color="danger" size="sm" onClick={() => onRemove(index)}
              style={{
            borderRadius: '12px',
            fontWeight: '600',
            padding: '8px 16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
          }}  
                
              >
                Remove
              </Button>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );
};

export default TaxationDetailsForm;
