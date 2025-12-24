import axios from "axios";
import React, { useState } from "react";
import {
  Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import Select from "react-select";

const countryOptions = [
  { value: "india", label: "India", currency: "₹" },
  { value: "usa", label: "USA", currency: "$" },
  { value: "uk", label: "UK", currency: "£" },
  { value: "malaysia", label: "Malaysia", currency: "RM" },
  { value: "dubai", label: "Dubai", currency: "AED" },
  { value: "indonesia", label: "Indonesia", currency: "Rp" },
  { value: "saudi", label: "Saudi Arabia", currency: "SAR" },
];

const predefinedFeatures = [
  "Dashboard","Client Management","Profile Management",
  "Firm Management [One Firm, One User/Role]",
  "Firm Management [One Firm, Role/Many Users]",
  "Firm Management [Unlimited Firms, Unlimited User/Role]",
  "Inventory Management","Manufacturer Inventory","Invoicing","Retail Billing","CRM Leads"
];

const predefinedIcons = ["fas fa-cube", "fas fa-trophy", "fas fa-shield-alt"];

function CreatePlan() {
  document.title = "Plan Form";

  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const token = authuser?.token;
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const [formValues, setFormValues] = useState({
    title: "",
    caption: "",
    icon: "",
    prices: [
      {
        country: "IN",
        currency: "INR",
        basePrice: "",
        offers: []
      }
    ],
    features: [],
    maxFirms: "",
  });

  // 🟢 Country Handlers
  const addCountry = () => {
    setFormValues((prev) => ({
      ...prev,
      prices: [
        ...prev.prices,
        { country: "", currency: "", basePrice: "", offers: [] }
      ]
    }));
  };

  const deleteCountry = (countryIndex) => {
    const newPrices = [...formValues.prices];
    newPrices.splice(countryIndex, 1);
    setFormValues((prev) => ({ ...prev, prices: newPrices }));
  };

  const handleCountryChange = (index, field, value) => {
    const newPrices = [...formValues.prices];
    newPrices[index][field] = value;
    setFormValues((prev) => ({ ...prev, prices: newPrices }));
  };

  // 🟢 Offer Handlers
  const addOffer = (countryIndex) => {
    const newPrices = [...formValues.prices];
    newPrices[countryIndex].offers.push({
      durationType: "monthly",
      durationValue: 1,
      days: 30,
      originalPrice: "",
      discountedPrice: "",
      taglineText:"",
    });
    setFormValues((prev) => ({ ...prev, prices: newPrices }));
  };

  const deleteOffer = (countryIndex, offerIndex) => {
    const newPrices = [...formValues.prices];
    newPrices[countryIndex].offers.splice(offerIndex, 1);
    setFormValues((prev) => ({ ...prev, prices: newPrices }));
  };

  const handleOfferChange = (cIdx, oIdx, field, value) => {
    const newPrices = [...formValues.prices];
    newPrices[cIdx].offers[oIdx][field] = value;

    if (field === "durationValue") {
      const durationType = newPrices[cIdx].offers[oIdx].durationType;
      const val = parseInt(value || 0, 10);

      if (durationType === "monthly") {
        newPrices[cIdx].offers[oIdx].days = val * 30;
      } else if (durationType === "yearly") {
        newPrices[cIdx].offers[oIdx].days = val * 365;
      }
    }

    if (field === "durationType") {
      const val = newPrices[cIdx].offers[oIdx].durationValue;
      if (value === "monthly") {
        newPrices[cIdx].offers[oIdx].days = val * 30;
      } else if (value === "yearly") {
        newPrices[cIdx].offers[oIdx].days = val * 365;
      }
    }

    setFormValues((prev) => ({ ...prev, prices: newPrices }));
    if (field === "discountedPrice" || field === "originalPrice") {
      const offer = newPrices[cIdx].offers[oIdx];
      if (offer.originalPrice && offer.discountedPrice) {
        offer.discountPercent = Math.round(
          ((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100
        );
      }
    }

  };



  // 🟢 Generic Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFeatureChange = (e) => {
    const value = e.target.value;
    if (value && !formValues.features.includes(value)) {
      setFormValues((prevState) => ({
        ...prevState,
        features: [...prevState.features, value],
      }));
    }
  };

  const handleIconChange = (iconClass) => {
    setFormValues((prevState) => ({
      ...prevState,
      icon: iconClass,
    }));
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = formValues.features.filter((_, i) => i !== index);
    setFormValues((prevState) => ({
      ...prevState,
      features: newFeatures,
    }));
  };

  // 🟢 Submit
  const handleSubmit = (e) => {
    e.preventDefault();

   const isPriceValid = formValues.prices.every(
        (p) => p.country && p.currency && p.basePrice && p.offers.length > 0
      );

      if (
        !formValues.title ||
        !formValues.caption ||
        !formValues.icon ||
        !isPriceValid ||
        formValues.features.length === 0 ||
        !formValues.maxFirms
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

    axios
      .post(`${process.env.REACT_APP_URL}/plan/create/${authuser?.response._id}`, formValues, config)
      .then((response) => {
        toast.success("Plan created successfully");
        setFormValues({
          title: "",
          caption: "",
          icon: "",
          prices: [{ country: "", currency: "", basePrice: "", offers: [] }],
          features: [],
          maxFirms: "",
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "An error occurred.");
      });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Plan Management" />
        <Container>
          <Row className="justify-content-center">
            <Col lg={11}>
              <Card>
                <CardBody>
                  <h4 className="font-size-18 text-muted mt-2 text-center">
                    Create Plan
                  </h4>
                  <form onSubmit={handleSubmit}>
                    
                    {/* Title */}
                    <FormGroup>
                      <Label>Title</Label>
                      <Input type="text" name="title" value={formValues.title} onChange={handleChange} />
                    </FormGroup>

                    {/* Caption */}
                    <FormGroup>
                      <Label>Caption</Label>
                      <Input type="text" name="caption" value={formValues.caption} onChange={handleChange} />
                    </FormGroup>

                    {/* Icon */}
                    <FormGroup>
                      <Label>Select Icon</Label>
                      <div className="d-flex flex-wrap">
                        {predefinedIcons.map((iconClass, index) => (
                          <div
                            key={index}
                            className={`avatar-sm cursor-pointer me-3 mb-3 ${
                              formValues.icon === iconClass ? "bg-primary text-white" : "bg-light"
                            }`}
                            onClick={() => handleIconChange(iconClass)}
                            style={{
                              borderRadius: "50%",
                              padding: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i className={`${iconClass} font-size-20`} />
                          </div>
                        ))}
                      </div>
                    </FormGroup>

                    {/* Countries & Offers */}
                    <h5 className="mt-4">Pricing by Country</h5>
                    {formValues.prices.map((price, countryIndex) => (
                      <Card key={countryIndex} className="mb-4">
                        <CardBody>
                          <Row>
                            <Col md={3}>
                              <Label>Country</Label>
                              <Select
                                options={countryOptions}
                                value={countryOptions.find((opt) => opt.value === price.country) || null}
                                onChange={(selectedOption) => {
                                  const newPrices = [...formValues.prices];
                                  newPrices[countryIndex].country = selectedOption.value;
                                  newPrices[countryIndex].currency = selectedOption.currency; // auto set currency
                                  setFormValues((prev) => ({ ...prev, prices: newPrices }));
                                }}
                              />
                            </Col>

                            <Col md={3}>
                              <Label>Currency</Label>
                              <Input
                                type="text"
                                value={price.currency}
                                readOnly // auto-filled, no manual edit
                              />
                            </Col>

                            <Col md={3}>
                              <Label>Base Price</Label>
                              <Input
                                type="number"
                                value={price.basePrice}
                                onChange={(e) =>
                                  handleCountryChange(countryIndex, "basePrice", e.target.value)
                                }
                              />
                            </Col>
                            <Col md={3} className="d-flex align-items-end">
                              <Button
                                color="danger"
                                size="sm"
                                onClick={() => deleteCountry(countryIndex)}
                              >
                                Remove Country
                              </Button>
                            </Col>
                          </Row>

                          <h6 className="mt-3">Offers</h6>
                          {price.offers.map((offer, offerIndex) => (
                            <Row key={offerIndex} className="mb-2">
                              <Col md={3}>
                                <Label>Type</Label>
                                <Input
                                  type="select"
                                  value={offer.durationType}
                                  onChange={(e) =>
                                    handleOfferChange(countryIndex, offerIndex, "durationType", e.target.value)
                                  }
                                >
                                  <option value="monthly">Monthly</option>
                                  <option value="yearly">Yearly</option>
                                  <option value="custom">Custom</option>
                                </Input>
                              </Col>

                              <Col md={3}>
                                <Label>Duration</Label>
                                <Input
                                  type="number"
                                  value={offer.durationValue}
                                  onChange={(e) =>
                                    handleOfferChange(countryIndex, offerIndex, "durationValue", e.target.value)
                                  }
                                />
                              </Col>

                              <Col md={3}>
                                <Label>Days</Label>
                                <Input
                                  type="number"
                                  value={offer.days}
                                  onChange={(e) =>
                                    handleOfferChange(countryIndex, offerIndex, "days", e.target.value)
                                  }
                                />
                              </Col>

                              <Col md={3}>
                                <Label>Original Price</Label>
                                <Input
                                  type="number"
                                  value={offer.originalPrice}
                                  onChange={(e) =>
                                    handleOfferChange(countryIndex, offerIndex, "originalPrice", e.target.value)
                                  }
                                />
                              </Col>

                              <Col md={4}>
                                <Label>Discounted</Label>
                                <Input
                                  type="number"
                                  value={offer.discountedPrice}
                                  onChange={(e) =>
                                    handleOfferChange(countryIndex, offerIndex, "discountedPrice", e.target.value)
                                  }
                                />
                              </Col>

                              <Col md={4}>
                                <Label>Tagline</Label>
                                <Input
                                  type="text"
                                  placeholder="e.g. Save up to 40% this year!"
                                  value={offer.taglineText || ""}
                                  onChange={(e) =>
                                    handleOfferChange(countryIndex, offerIndex, "taglineText", e.target.value)
                                  }
                                />
                              </Col>

                              <Col md={12} className="d-flex justify-content-end">
                                <Button
                                  color="danger"
                                  size="sm"
                                  className="mt-2"
                                  onClick={() => deleteOffer(countryIndex, offerIndex)}
                                >
                                  &times;
                                </Button>
                              </Col>
                            </Row>

                          ))}
                          <Button
                            color="success"
                            size="sm"
                            type="button"
                            className="mt-2"
                            onClick={() => addOffer(countryIndex)}
                          >
                            + Add Offer
                          </Button>
                        </CardBody>
                      </Card>
                    ))}
                    <Button color="info" type="button" onClick={addCountry}>
                      + Add Country
                    </Button>

                    {/* Features */}
                    <FormGroup className="mt-4">
                      <Label>Features</Label>
                      <Input type="select" onChange={handleFeatureChange} value="">
                        <option value="" disabled>
                          Select a feature
                        </option>
                        {predefinedFeatures.map((feature, index) => (
                          <option key={index} value={feature}>
                            {feature}
                          </option>
                        ))}
                      </Input>
                      <div className="mt-2">
                        {formValues.features.map((feature, index) => (
                          <div key={index} className="d-flex align-items-center mb-2">
                            <span>{feature}</span>
                            <Button
                              color="danger"
                              size="sm"
                              onClick={() => handleRemoveFeature(index)}
                              className="ms-2"
                            >
                              &times;
                            </Button>
                          </div>
                        ))}
                      </div>
                    </FormGroup>

                    {/* Max Firms */}
                    <FormGroup>
                      <Label>Max Firms</Label>
                      <Input
                        type="number"
                        name="maxFirms"
                        value={formValues.maxFirms}
                        onChange={handleChange}
                      />
                    </FormGroup>

                    <Button color="primary" type="submit">
                      Add Plan
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default CreatePlan;
