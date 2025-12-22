import React from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

const BankDetailsForm = ({ bankDetails, onChange, onRemove }) => {
  const placeholders = {
  accountHolder: "e.g. John Doe",
  accountNumber: "e.g. 1234567890123456",
  bankName: "e.g. HDFC Bank",
  ifscCode: "e.g. HDFC0001234 or ABCDUS33XXX",
  branchName: "e.g. Mumbai Main Branch"
};

  return bankDetails.map((bank, index) => (
    <div key={index} className="mb-4 px-3 py-2 border rounded bg-white">
      <div className="d-flex justify-content-end align-items-center mb-2">
        <Button color="danger" size="sm" onClick={() => onRemove(index)}>
          Remove Bank
        </Button>
      </div>
      <Row className="gy-3">
        {[
          { label: "Account Holder Name", field: "accountHolder" },
          { label: "Account Number", field: "accountNumber" },
          { label: "Bank Name", field: "bankName" },
          { label: "IFSC Code / SWIFT Code", field: "ifscCode" },
          { label: "Branch Name", field: "branchName" }
        ].map(({ label, field }) => (
          <Col md={3} key={field}>
            <FormGroup>
              <Label>{label}</Label>
              <Input
                type="text"
                value={bank[field] || ""}
                onChange={(e) => onChange(index, field, e.target.value)}
                placeholder={placeholders[field]}
              />
            </FormGroup>
          </Col>
        ))}
      </Row>
    </div>
  ));
};

export default BankDetailsForm;
