import React from "react";
import { Row, Col, Input, Button, FormGroup, Label } from "reactstrap";

const TaxationDetailsForm = ({
  taxationDetails = [],
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <>
      <Col lg={12}>
        <div
          className="p-2 my-2 rounded"
          style={{
            width: "100%",
            fontWeight: "bolder",
            background: "var(--bs-header-dark-bg)",
            color: "white",
          }}
        >
          Tax / GST / VAT Information 
        </div>
      </Col>

      <div className="d-flex justify-content-end mb-3">
        <Button
          onClick={onAdd}
          className="btn btn-tertiary"
          style={{
            border: "none",
            color: "#fff",
            padding: "8px 20px",
            fontSize: "14px",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          + Add Details
        </Button>
      </div>

      {taxationDetails.map((detail, index) => (
        <Row
          key={index}
          className="d-flex justify-content-between align-items-center mb-2"
        >
          <Col md={4}>
            <Input
              type="text"
              placeholder="Field Label"
              value={detail.fieldName}
              onChange={(e) => onChange(index, "fieldName", e.target.value)}
              className="border borde-gray-900"
            />
          </Col>
          <Col md={4}>
            <Input
              type="text"
              placeholder="Enter Value"
              value={detail.fieldValue}
              onChange={(e) => onChange(index, "fieldValue", e.target.value)}
            />
          </Col>
          <Col md={2} className="d-flex align-items-center gap-2">
            <Input
              type="checkbox"
              checked={detail.toShow}
              className="m-0"
              onChange={(e) =>
                onChange(index, "toShow", e.target.checked)
              }
            />
            Show
          </Col>
          <Col md={2}>
            <Button color="danger" onClick={() => onRemove(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
    </>
  );
};

export default TaxationDetailsForm;
