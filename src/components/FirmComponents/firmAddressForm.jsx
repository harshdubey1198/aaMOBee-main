import React from "react";
import { FormGroup, Label, Input, Col, Row } from "reactstrap";
import Select from "react-select";
import Autosuggest from "react-autosuggest";

const countryOptions = [
  { value: "India", label: "India" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "United Arab Emirates", label: "United Arab Emirates" },
  { value: "USA", label: "USA" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "UK", label: "UK" },
  { value: "Germany", label: "Germany" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Japan", label: "Japan" },
  { value: "Russia", label: "Russia" },
];

const citySuggestions = [
  { city: "New York" },
  { city: "Los Angeles" },
  { city: "Toronto" },
  { city: "Delhi" },
  { city: "Mumbai" },
];

const getCitySuggestions = (value) => {
  const inputValue = value.trim().toLowerCase();
  return inputValue.length === 0
    ? []
    : citySuggestions.filter((city) =>
        city.city.toLowerCase().includes(inputValue)
      );
};

const FirmAddressForm = ({ address = {}, handleAddressChange , index }) => {
  const [city, setCity] = React.useState(address.city || "");
  const [citySuggestionsList, setCitySuggestionsList] = React.useState([]);

  const handleCitySuggestionsFetch = ({ value }) => {
    setCitySuggestionsList(getCitySuggestions(value));
  };

  const handleCityChange = (event, { newValue }) => {
    setCity(newValue);
    handleAddressChange({
      target: { name: "city", value: newValue },
    });
};


const handleCountryChange = (selectedOption) => {
  if (!selectedOption) return;

  const event = {
    target: {
      name: "country",
      value: selectedOption.value,
    },
  };

  handleAddressChange(index, event); // Ensure that index is being used correctly
};





  return (
    <div className="mb-3">
       <h3 className="section-title">Address Details</h3>
      <Row>
        <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
          <FormGroup>
            <Label for="h_no">Street / Building Number</Label>
            <Input
              type="text"
              name="h_no"
              id="h_no"
              value={address.h_no || ""}
              placeholder="Enter Number"
              onChange={(e) => handleAddressChange(index, e)} 
            />
          </FormGroup>
        </div>
        
        <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
        <FormGroup>
          <Label for="nearby">Landmark / Nearby Place</Label>
          <Input
            type="text"
            name="nearby"
            placeholder="Enter Place"
            id="nearby"
            value={address.nearby || ""}
            onChange={(e) => handleAddressChange(index, e)} 
          />
        </FormGroup>
       </div> 
      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
      <FormGroup>
        <Label for="zip_code">Postal Code</Label>
        <Input
          type="text"
          name="zip_code"
          placeholder="Enter Code"
          id="zip_code"
          value={address.zip_code || ""}
          onChange={(e) => handleAddressChange(index, e)} 
        />
      </FormGroup></div>
      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
      <FormGroup>
        <Label for="district">District / Area</Label>
        <Input
          type="text"
          name="district"
          placeholder="Enter Area"
          id="district"
          value={address.district || ""}
          onChange={(e) => handleAddressChange(index, e)} 
        />
      </FormGroup></div>
     <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
      <FormGroup>
        <Label for="city">City / Town</Label>
        <Input
          type="text"
          placeholder="Enter City / Town"
          name="city"
          id="city"
          value={address.city || ""}
          onChange={(e) => handleAddressChange(index, e)} 
          //required
        />
      </FormGroup>
      </div>
      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
      <FormGroup>
        <Label for="state">State / Province</Label>
        <Input
          type="text"
          name="state"
          placeholder="Enter State / Province"
          id="state"
          value={address.state || ""}
          onChange={(e) => handleAddressChange(index, e)} 
        />
      </FormGroup></div>
      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
      <FormGroup>
        <Label for="country">Country</Label>
        <Select
          options={countryOptions}
          defaultValue={countryOptions.find((option) => option.value === address.country)}
          onChange={handleCountryChange} 
          placeholder="Country"
        />
      </FormGroup>
      </div>
      </Row>
      
    </div>
  );
};

export default FirmAddressForm;
