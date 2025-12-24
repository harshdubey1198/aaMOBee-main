import React, { useEffect, useRef, useState } from "react";
import { FormGroup, Label, Input, Row, Col, Tooltip } from "reactstrap";
import useDebounce from "../../Hooks/UseDebounceHook";
// import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
import FirmSwitcher from "../../Pages/Firms/FirmSwitcher";
import AllLocations from '../../CommonData/Data/countries+states+cities.json';
import Select from "react-select";
const InvoiceInputs = ({ invoiceData, handleInputChange,IsEditable, companyData, setInvoiceData, selectedFirmId, setSelectedFirmId }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  // const firmId = authuser?.response?.adminId;
  // console.log("IsEditable : ",IsEditable);
  // console.log("customer details : ",invoiceData?.firstName);
  // console.log("customer details : ",invoiceData?.lastName);
  // console.log("customer details : ",invoiceData?.customerPhone);
  const role = authuser?.response?.role;
  const suggestionsRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isCompany, setIsCompany] = useState(false);
  // console.log("isCompany value:", isCompany)

  // const debouncedSearchTerm = useDebounce(searchKey, 500);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const currencyOptions = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    { code: "USD", symbol: "$", name: "US Dollar" },
  ];
  const [filteredCityOptions, setFilteredCityOptions] = useState([]);

  const cityOptions = AllLocations.flatMap((country) =>
    country.states.flatMap((state) =>
      (state.cities || []).map((city) => ({
        label: city.name,
        value: city.name,
        city,
        state,
        country,
      }))
    )
  );

  const handleCityInputChange = (inputValue) => {
    if (inputValue.length < 3) {
      setFilteredCityOptions([]);
      return;
    }

    const lowerInput = inputValue.toLowerCase();

    const filtered = AllLocations.flatMap((country) =>
      country.states.flatMap((state) =>
        (state.cities || []).filter(city =>
          city.name.toLowerCase().includes(lowerInput)
        ).map(city => ({
          label: `${city.name}, ${state.name}, ${country.name}`,
          value: city.name,
          city,
          state,
          country,
        }))
      )
    );

    setFilteredCityOptions(filtered);
  };
  const handleCitySelect = (selectedOption) => {
    if (!selectedOption) {
      setInvoiceData((prev) => ({
        ...prev,
        customerAddress: {
          ...prev.customerAddress,
          city: "",
          district: "",
          state: "",
          country: "",
          zip_code: "",
        },
      }));
      return;
    }

    const { city, state, country } = selectedOption;

    setInvoiceData((prev) => ({
      ...prev,
      customerAddress: {
        ...prev.customerAddress,
        city: city.name,
        district: city.name,
        state: state.name,
        country: country.name,
        zip_code: city.zip_code || "",
      },
    }));
  };

  const getCurrencyDetails = (currencyCode) => {
    const currency = currencyOptions.find((option) => option.code === currencyCode);
    return currency ? currency.code : currencyCode;
  };
  const currency = getCurrencyDetails(companyData?.currency || "INR");

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prevIndex) =>
        prevIndex === searchResults.length - 1 ? 0 : prevIndex + 1
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prevIndex) =>
        prevIndex <= 0 ? searchResults.length - 1 : prevIndex - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSuggestionClick(searchResults[selectedIndex]);
    }
  };

  const searchCustomer = useDebounce(async (searchKey) => {
    if (searchKey) {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_URL}/customer/search?q=${searchKey}&firmId=${selectedFirmId}`);
        setSearchResults(response.data || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error searching customer:", error);
      }
    }
  }, 500);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [issueDate] = useState(getCurrentDate());

  useEffect(() => {
    if (!invoiceData.issueDate) {
      handleInputChange({ target: { name: "issueDate", value: issueDate } });
    }
  }, [issueDate, invoiceData.issueDate, handleInputChange]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchKey(value);
    searchCustomer(value);
  };

  

  const handleSuggestionClick = (customer) => {
    handleInputChange({ target: { name: "firstName", value: customer.firstName } });
    handleInputChange({ target: { name: "lastName", value: customer.lastName } });
    handleInputChange({ target: { name: "customerEmail", value: customer.email } });
    handleInputChange({ target: { name: "customerPhone", value: customer.mobile } });
    handleInputChange({
      target: {
        name: "customerAddress",
        value: {
          h_no: customer.address.h_no,
          nearby: customer.address.nearby,
          city: customer.address.city,
          state: customer.address.state,
          country: customer.address.country,
          zip_code: customer.address.zip_code,
          district: customer.address.district,
        },
      },
    });
    setShowSuggestions(false);
  };

  const highlightSearchTerm = (text) => {
    const parts = text.split(new RegExp(`(${searchKey})`, "gi"));
    return parts.map((part, index) => (
      <span
        key={index}
        style={part.toLowerCase() === searchKey.toLowerCase() ? { backgroundColor: "yellow" } : {}}
      >
        {part}
      </span>
    ));
  };
  
  // const handleAmountPaidChange = (event) => {
  //   const amountPaid = parseFloat(event.target.value) || 0;
  //   const totalInclusiveTaxes = invoiceData.items.reduce((acc, item) => acc + (item.total || 0), 0);

  //   if (amountPaid > totalInclusiveTaxes) {
  //     alert(`Amount Paid cannot exceed the total invoice amount inclusive of taxes (₹ ${totalInclusiveTaxes.toFixed(2)}).`);
  //     return;
  //   }

  //   setInvoiceData((prevData) => ({
  //     ...prevData,
  //     amountPaid,
  //   }));
  // };
  const totalInclusiveTaxes = invoiceData.items.reduce((acc, item) => acc + (item.total || 0), 0);

  const getMissingFields = () => {
    const missing = [];

    if (!invoiceData.firstName?.trim()) missing.push(isCompany ? "Company Name" : "First Name");
    if (!isCompany && !invoiceData.lastName?.trim()) missing.push("Last Name");
    if (!invoiceData.customerEmail?.trim()) missing.push("Customer Email");
    if (!invoiceData.customerPhone?.trim()) missing.push("Customer Phone");
    if (!invoiceData.customerAddress.h_no?.trim()) missing.push("House No.");
    if (!invoiceData.customerAddress.district?.trim()) missing.push("District");
    if (!invoiceData.customerAddress.city?.trim()) missing.push("City");
    if (!invoiceData.customerAddress.zip_code?.trim()) missing.push("Zip Code");
    if (!invoiceData.customerAddress.state?.trim()) missing.push("State");
    if (!invoiceData.customerAddress.country?.trim()) missing.push("Country");
    if (!invoiceData.customerAddress.nearby?.trim()) missing.push("Nearby Landmark");
    if (!invoiceData.issueDate?.trim()) missing.push("Issue Date");
    if (!invoiceData.dueDate?.trim()) missing.push("Due Date");
    if (!invoiceData.invoiceType?.trim()) missing.push("Invoice Type");
    if (!invoiceData.invoiceSubType?.trim()) missing.push("Invoice Sub Type");

    return missing;
  };


  return (
    <div className="invoice-form">
      <Row className="align-items-center mb-4">
        <Col lg={6} md={6} sm={12} className="text-md-start text-center mb-0 d-flex align-items-center">
          <h3 className="fw-bold text-dark mb-0">Invoice Details</h3>
          {getMissingFields().length > 0 && (
            <span
              id="missingDetailsTooltip"
              className="fw-bold text-danger ms-2"
              style={{ cursor: "pointer", fontSize: "20px" }}
            >
              *
            </span>
          )}
          <Tooltip
            placement="right"
            isOpen={tooltipOpen}
            target="missingDetailsTooltip"
            toggle={toggleTooltip}
          >
            Please fill all the details before submission
          </Tooltip>
        </Col>

        {role === "client_admin" && (
          <Col lg={2} md={6} sm={12} className="text-md-start text-center mb-0 d-flex align-items-center justify-content-center">
            <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={setSelectedFirmId}
            />
          </Col>
        )}

        <Col lg={4} md={12} sm={12} className="d-flex align-items-center justify-content-end gap-3 mt-2 mt-sm-0">
          <div className="w-100" style={{ position: "relative" }}>
            <Input
              type="text"
              placeholder="Search Customer Here..."
              value={searchKey}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="form-control shadow-sm"
              style={{
                border: "2px solid #007bff",
                borderRadius: "10px",
                padding: "5px 10px ",
                fontSize: "14px",
              }}
            />
            {showSuggestions && searchResults.length > 0 && (
              <ul
                ref={suggestionsRef}
                className="list-group position-absolute shadow"
                style={{
                  width: "100%",
                  maxHeight: "220px",
                  overflowY: "auto",
                  zIndex: 1050,
                  marginTop: "5px",
                }}
              >
                {searchResults
                  .sort((a, b) => {
                    const searchTerm = searchKey.toLowerCase();
                    const aMatch =
                      a.firstName.toLowerCase().includes(searchTerm) ||
                      a.lastName.toLowerCase().includes(searchTerm);
                    const bMatch =
                      b.firstName.toLowerCase().includes(searchTerm) ||
                      b.lastName.toLowerCase().includes(searchTerm);
                    return bMatch - aMatch;
                  })
                  .map((customer, index) => (
                    <li
                      key={index}
                      className={`list-group-item d-flex align-items-center ${selectedIndex === index ? "bg-light text-dark" : ""}`}
                      style={{ cursor: "pointer", padding: "10px" }}
                      onClick={() => handleSuggestionClick(customer)}
                      onMouseEnter={() => setSelectedIndex(index)}
                    >
                      <i
                        className="fa fa-user-circle me-3"
                        style={{ fontSize: "22px", color: "#0d6efd" }}
                      ></i>
                      <div style={{ flex: 1 }}>
                        <p className="mb-0 fw-semibold">
                          {highlightSearchTerm(
                            customer.firstName + " " + customer.lastName
                          )}
                        </p>
                        <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
                          {customer.email}
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <FormGroup check className="d-flex align-items-center justify-content-end gap-2">
            <input
              type="radio"
              name="isCompanyToggle"
              checked={isCompany}
              onClick={() => {
                // Toggle like a checkbox
                setIsCompany((prev) => {
                  const newVal = !prev;
                  if (newVal) {
                    handleInputChange({ target: { name: "lastName", value: "" } });
                  }
                  return newVal;
                });
              }}
            />
            <Label check className="fw-semibold mb-0" style={{ whiteSpace: 'nowrap', display: 'inline' }}>
              For Company
            </Label>
          </FormGroup>
        </Col>
      </Row>





      <Row>
        {/* 👤 Customer Basic Info */}
        <Col md={3}>
          <FormGroup style={{ marginBottom: "0px" }}>
            <Label for="firstName">{isCompany ? "Company Name" : "First Name"}</Label>
            <Input
              type="text"
              name="firstName"
              placeholder={isCompany ? "Company Name" : "First Name"}
              id="firstName"
              value={invoiceData.firstName}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          {!isCompany && (
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                placeholder="Last Name"
                id="lastName"
                value={invoiceData.lastName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label for="customerEmail">Customer Email</Label>
            <Input
              type="text"
              name="customerEmail"
              id="customerEmail"
              placeholder="Customer Email"
              value={invoiceData.customerEmail}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="customerPhone">Customer Phone</Label>
            <Input
              type="number"
              name="customerPhone"
              id="customerPhone"
              placeholder="Customer Phone"
              value={invoiceData.customerPhone}
              onChange={handleInputChange}
              onWheel={(e) => e.target.blur()}
              required
            />
          </FormGroup>
        </Col>

        {/* 🏠 Address Grouped Section */}
        <Col md={6}>
          <div className="p-3 border rounded">
            <h5 className="mb-3">Address</h5>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="customerAddress.h_no">House No.</Label>
                  <Input
                    type="text"
                    name="customerAddress.h_no"
                    id="customerAddress.h_no"
                    placeholder="House / Office No."
                    value={invoiceData.customerAddress.h_no}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="customerAddress.district">District</Label>
                  <Input
                    type="text"
                    name="customerAddress.district"
                    id="customerAddress.district"
                    placeholder="District"
                    value={invoiceData.customerAddress.district}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="customerAddress.city">City</Label>
                  <Select
                    id="customerAddress.city"
                    options={filteredCityOptions}
                    onInputChange={handleCityInputChange}
                    value={
                      invoiceData.customerAddress.city && invoiceData.customerAddress.state && invoiceData.customerAddress.country
                        ? {
                          label: `${invoiceData.customerAddress.city}`,
                          value: invoiceData.customerAddress.city,
                          city: { name: invoiceData.customerAddress.city, zip_code: invoiceData.customerAddress.zip_code },
                          state: { name: invoiceData.customerAddress.state },
                          country: { name: invoiceData.customerAddress.country }
                        }
                        : null
                    }
                    onChange={handleCitySelect}
                    placeholder="Type at least 3 letters..."
                    isClearable
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="customerAddress.state">State</Label>
                  <Input
                    type="text"
                    name="customerAddress.state"
                    id="customerAddress.state"
                    placeholder="State"
                    value={invoiceData.customerAddress.state}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="customerAddress.country">Country</Label>
                  <Input
                    type="text"
                    name="customerAddress.country"
                    id="customerAddress.country"
                    placeholder="Country"
                    value={invoiceData.customerAddress.country}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="customerAddress.zip_code">Zip Code</Label>
                  <Input
                    type="text"
                    name="customerAddress.zip_code"
                    id="customerAddress.zip_code"
                    placeholder="Zip Code"
                    value={invoiceData.customerAddress.zip_code}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>

              <Col md={12}>
                <FormGroup>
                  <Label for="customerAddress.nearby">Nearby Landmark</Label>
                  <Input
                    type="text"
                    name="customerAddress.nearby"
                    id="customerAddress.nearby"
                    placeholder="Nearby Landmark"
                    value={invoiceData.customerAddress.nearby}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
            </Row>
          </div>
        </Col>

        {/* 🧾 Invoice Details */}
        <Col md={3}>
          <FormGroup>
            <Label for="invoiceType">Invoice Category</Label>
            <Input
              type="select"
              name="invoiceType"
              id="invoiceType"
              value={invoiceData.invoiceType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Invoice Category</option>
              <option value="Tax Invoice">Tax Invoice</option>
              <option value="Proforma">Proforma Invoice</option>
              <option value="Bill of Supply">Bill of Supply</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="invoiceSubType">Invoice Sub Type</Label>
            <Input
              type="select"
              name="invoiceSubType"
              id="invoiceSubType"
              value={invoiceData.invoiceSubType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Invoice Sub Type</option>
              <option value="Original">Original</option>
              <option value="Duplicate">Duplicate</option>
              <option value="Triplicate">Triplicate</option>
              <option value="Quadruplicate">Quadruplicate</option>
            </Input>
          </FormGroup>

          {/* Move issue/due date just below Invoice Type */}
          <FormGroup>
            <Label for="issueDate">Issue Date</Label>
            <Input
              type="date"
              name="issueDate"
              id="issueDate"
              value={invoiceData.issueDate || issueDate}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="dueDate">Due Date</Label>
            <Input
              type="date"
              name="dueDate"
              id="dueDate"
              value={invoiceData.dueDate}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          
        </Col>
      </Row>

      {/* <div className="invoice-total">
        <h4>Final Invoice Amount : {currency} {invoiceData.items.reduce((acc, item) => acc + (item.total || 0), 0).toFixed(2)}</h4>
      </div> */}
    </div>
  );
};

export default InvoiceInputs;
