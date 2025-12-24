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
    <div key={index} className="bank-card mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 fw-bold text-dark">
          <i className="bx bx-buildings me-2" style={{ color: '#1E4E5B' }}></i>
          Bank Account #{index + 1}
        </h4>
        <Button 
          color="danger" 
          size="sm" 
          onClick={() => onRemove(index)} 
          className="remove-btn"
          style={{
            borderRadius: '12px',
            fontWeight: '600',
            padding: '8px 16px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 25px rgba(231, 76, 60, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(231, 76, 60, 0.3)';
          }}
        >
          <i className="bx bx-trash me-1"></i>
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
          <Col md={6} lg={4} key={field}>
            <FormGroup>
              <Label className="fw-bold text-dark mb-2">{label}</Label>
              <Input
                type="text"
                value={bank[field] || ""}
                onChange={(e) => onChange(index, field, e.target.value)}
                placeholder={placeholders[field]}
                className="form-control"
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
        ))}
      </Row>
    </div>
  ));
};

export default BankDetailsForm;
