
import React from 'react';
import { Col, FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import { currencyOptions } from '../../constants/dummyLayoutData';
import { firmSubIndustries } from '../../data/firmSubIndustries';

const FirmBasicInfoForm = ({ formData, handleInputChange, handleFieldChange }) => (
  <>
    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label for="companyTitle">Business / Company Name</Label>
        <Input type="text" name="companyTitle" value={formData.companyTitle} onChange={handleInputChange} />
      </FormGroup>
    </Col>

    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label for="email"> Business Email</Label>
        <Input type="email" name="email" value={formData.email} onChange={handleInputChange} />
      </FormGroup>
    </Col>

    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label for="companyMobile">Phone Number</Label>
        <Input type="text" name="companyMobile" value={formData.companyMobile} onChange={handleInputChange} />
      </FormGroup>
    </Col>

    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label htmlFor="country">Country</Label>
        <select id="country" name="country" className="form-select" value={formData.country} onChange={handleInputChange}>
          <option value="">Select Country</option>
          <option value="india">India</option>
          <option value="saudi_arabia">Saudi Arabia</option>
          <option value="uae">UAE</option>
          <option value="malaysia">Malaysia</option>
        </select>
      </FormGroup>
    </Col>

    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label for="currency">Operating Currency</Label>
        <Select
          options={currencyOptions}
          value={currencyOptions.find(opt => opt.value === formData.currency)}
          onChange={opt => handleFieldChange("currency", opt.value)}
        />
      </FormGroup>
    </Col>

    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label htmlFor="firmIndustry">Industry Sector</Label>
        <select
          id="firmIndustry"
          name="firmIndustry"
          className="form-select"
          value={formData.firmIndustry}
          onChange={handleInputChange}>
          <option value="">Select Firm Industry</option>
          <option value="trader">Trading</option>
          <option value="manufacturer">Manufacturing</option>
          <option value="service">Service</option>
        </select>
      </FormGroup>
    </Col>

    {formData.firmIndustry && (
      <Col lg={3} md={3} sm={12}>
        <FormGroup>
          <Label htmlFor="subIndustry">Sub-Sector(Optional)</Label>
          <Select
            options={firmSubIndustries[formData.firmIndustry] || []}
            value={(firmSubIndustries[formData.firmIndustry] || []).find(
              opt => opt.value === formData.firmSubIndustry
            )}
            onChange={opt => handleFieldChange("firmSubIndustry", opt.value)}
            placeholder="Select Sub Industry"
          />
        </FormGroup>
      </Col>
    )}

        <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label htmlFor="partnershipStartDate">Partnership Start Date</Label>
        <Input
          type="date"
          name="partnershipStartDate"
          value={formData.partnershipStartDate}
          onChange={handleInputChange}
        />
      </FormGroup>
    </Col>

    <Col lg={3} md={3} sm={12}>
      <FormGroup>
        <Label htmlFor="legalRegistrationDate">Legal Registration Date</Label>
        <Input
          type="date"
          name="legalRegistrationDate"
          value={formData.legalRegistrationDate}
          onChange={handleInputChange}
        />
      </FormGroup>
    </Col>

  </>
);

export default FirmBasicInfoForm;
