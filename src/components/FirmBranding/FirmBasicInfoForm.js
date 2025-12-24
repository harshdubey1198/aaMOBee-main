import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import { currencyOptions } from '../../constants/dummyLayoutData';
import { firmSubIndustries } from '../../data/firmSubIndustries';

const countryPhoneCodes = {
  india: "+91",
  saudi_arabia: "+966",
  uae: "+971",
  malaysia: "+60",
};


const FirmBasicInfoForm = ({ formData, handleInputChange, handleFieldChange }) => (
  <div className="row">
    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label for="companyTitle" className="fw-bold text-dark mb-2">
          <i className="bx bx-building me-2" style={{ color: '#1E4E5B' }}></i>
          Business / Company Name
        </Label>
        <Input
          type="text"
          name="companyTitle"
          value={formData.companyTitle}
          onChange={handleInputChange}
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

    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label for="email" className="fw-bold text-dark mb-2">
          <i className="bx bx-envelope me-2" style={{ color: '#1E4E5B' }}></i>
          Business Email
        </Label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
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

    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label for="companyMobile" className="fw-bold text-dark mb-2">
          <i className="bx bx-phone me-2" style={{ color: '#1E4E5B' }}></i>
          Phone Number
        </Label>
        <Input
          type="text"
          name="companyMobile"
          value={formData.companyMobile}
          onChange={handleInputChange}
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

    <Col lg={4} md={6} sm={12} className="mb-4">
  <FormGroup>
    <Label htmlFor="companyMobile" className="fw-bold text-dark mb-2">
      <i className="bx bx-phone me-2" style={{ color: '#1E4E5B' }}></i>
      Phone Number
    </Label>
    <div className="d-flex">
      {/* Country Code Dropdown */}
      <Input
        type="select"
        name="companyMobileCode"
        value={formData.companyMobileCode || "+91"}
        onChange={(e) => handleFieldChange("companyMobileCode", e.target.value)}
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

      {/* Phone Number Input */}
      <Input
        type="text"
        id="companyMobile"
        name="companyMobile"
        placeholder="Enter phone number"
        value={formData.companyMobile}
        onChange={handleInputChange}
        style={{
          borderRadius: "0 12px 12px 0",
          border: "2px solid #e9ecef",
        }}
      />
    </div>
  </FormGroup>
</Col>


    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label for="currency" className="fw-bold text-dark mb-2">
          <i className="bx bx-credit-card me-2" style={{ color: '#1E4E5B' }}></i>
          Operating Currency
        </Label>
        <Select
          options={currencyOptions}
          value={currencyOptions.find(opt => opt.value === formData.currency)}
          onChange={opt => handleFieldChange("currency", opt.value)}
          className="form-control"
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

    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label htmlFor="firmIndustry" className="fw-bold text-dark mb-2">
          <i className="bx bx-factory me-2" style={{ color: '#1E4E5B' }}></i>
          Industry Sector
        </Label>
        <select
          id="firmIndustry"
          name="firmIndustry"
          className="form-select"
          value={formData.firmIndustry}
          onChange={handleInputChange}
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
          <option value="">Select Firm Industry</option>
          <option value="trader">Trading</option>
          <option value="manufacturer">Manufacturing</option>
          <option value="service">Service</option>
        </select>
      </FormGroup>
    </Col>

    {formData.firmIndustry && (
      <Col lg={4} md={6} sm={12} className="mb-4">
        <FormGroup>
          <Label htmlFor="subIndustry" className="fw-bold text-dark mb-2">
            <i className="bx bx-target-lock me-2" style={{ color: '#1E4E5B' }}></i>
            Sub-Sector (Optional)
          </Label>
          <Select
            options={firmSubIndustries[formData.firmIndustry] || []}
            value={(firmSubIndustries[formData.firmIndustry] || []).find(
              opt => opt.value === formData.firmSubIndustry
            )}
            onChange={opt => handleFieldChange("firmSubIndustry", opt.value)}
            placeholder="Select Sub Industry"
            className="form-control"
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

    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label htmlFor="partnershipStartDate" className="fw-bold text-dark mb-2">
          <i className="bx bx-calendar me-2" style={{ color: '#1E4E5B' }}></i>
          Partnership Start Date
        </Label>
        <Input
          type="date"
          name="partnershipStartDate"
          value={formData.partnershipStartDate}
          onChange={handleInputChange}
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

    <Col lg={4} md={6} sm={12} className="mb-4">
      <FormGroup>
        <Label htmlFor="legalRegistrationDate" className="fw-bold text-dark mb-2">
          <i className="bx bx-file me-2" style={{ color: '#1E4E5B' }}></i>
          Legal Registration Date
        </Label>
        <Input
          type="date"
          name="legalRegistrationDate"
          value={formData.legalRegistrationDate}
          onChange={handleInputChange}
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
  </div>
);

export default FirmBasicInfoForm;
