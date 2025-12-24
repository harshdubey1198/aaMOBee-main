import React, { useEffect, useState } from 'react';
import {
  Button, Card, CardBody, Col, Dropdown, DropdownToggle, DropdownMenu,
  DropdownItem, Table, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Row
} from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from "react-select";
import axiosInstance from '../../utils/axiosInstance';

const predefinedIcons = ["fas fa-cube", "fas fa-trophy", "fas fa-shield-alt"];
const predefinedFeatures = [
  "Dashboard","Client Management","Profile Management",
  "Firm Management [One Firm, One User/Role]",
  "Firm Management [One Firm, Role/Many Users]",
  "Firm Management [Unlimited Firms, Unlimited User/Role]",
  "Inventory Management","Manufacturer Inventory","Invoicing","Retail Billing","CRM Leads"
];

const countryOptions = [
  { value: "india", label: "India", currency: "₹" },
  { value: "usa", label: "USA", currency: "$" },
  { value: "uk", label: "UK", currency: "£" },
  { value: "malaysia", label: "Malaysia", currency: "RM" },
  { value: "dubai", label: "Dubai", currency: "AED" },
  { value: "indonesia", label: "Indonesia", currency: "Rp" },
  { value: "saudi", label: "Saudi Arabia", currency: "SAR" },
];

function ManagePlan() {
  const [plansData, setPlansData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [modal, setModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [trigger, setTrigger] = useState(0);

  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const token = authuser?.token; 
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/plan/all`, config)
      .then((res) => {
        setPlansData(res.response);
      })
      .catch(() => {
        toast.error('Error fetching data');
      });
  }, [trigger]);

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleModal = () => setModal(!modal);

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    toggleModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      axios.delete(`${process.env.REACT_APP_URL}/plan/delete/${id}`, config)
        .then((res) => {
          setTrigger(prev => prev + 1);
          toast.success(res.message);
        })
        .catch(() => {
          toast.error('Error deleting plan');
        });
    }
  };

  const handleUpdate = () => {
    axiosInstance.put(`${process.env.REACT_APP_URL}/plan/update/${selectedPlan._id}`, selectedPlan)
      .then((res) => {
        setTrigger(prev => prev + 1);
        toggleModal();
        toast.success(res.message);
      })
      .catch(() => {
        toast.error('Error updating data');
      });
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPlan({ ...selectedPlan, [name]: value });
  };

  const handleIconChange = (iconClass) => {
    setSelectedPlan((prev) => ({ ...prev, icon: iconClass }));
  };

  // Country CRUD
  const addCountry = () => {
    setSelectedPlan((prev) => ({
      ...prev,
      prices: [...prev.prices, { country: "", currency: "", basePrice: "", offers: [] }]
    }));
  };

  const deleteCountry = (idx) => {
    const newPrices = [...selectedPlan.prices];
    newPrices.splice(idx, 1);
    setSelectedPlan((prev) => ({ ...prev, prices: newPrices }));
  };

  const handleCountryChange = (index, field, value) => {
    const newPrices = [...selectedPlan.prices];
    newPrices[index][field] = value;
    setSelectedPlan((prev) => ({ ...prev, prices: newPrices }));
  };

  // Offer CRUD
  const addOffer = (countryIdx) => {
    const newPrices = [...selectedPlan.prices];
    newPrices[countryIdx].offers.push({
      durationType: "monthly",
      durationValue: 1,
      days: 30,
      originalPrice: "",
      discountedPrice: "",
      taglineText:"",
    });
    setSelectedPlan((prev) => ({ ...prev, prices: newPrices }));
  };

  const deleteOffer = (cIdx, oIdx) => {
    const newPrices = [...selectedPlan.prices];
    newPrices[cIdx].offers.splice(oIdx, 1);
    setSelectedPlan((prev) => ({ ...prev, prices: newPrices }));
  };
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const handleOfferChange = (cIdx, oIdx, field, value) => {
  const newPrices = [...selectedPlan.prices];
  newPrices[cIdx].offers[oIdx][field] = value;

  if (field === "durationValue") {
    const durationType = newPrices[cIdx].offers[oIdx].durationType;
    const val = parseInt(value || 0, 10);

    if (durationType === "monthly") newPrices[cIdx].offers[oIdx].days = val * 30;
    else if (durationType === "yearly") newPrices[cIdx].offers[oIdx].days = val * 365;
  }

  if (field === "durationType") {
    const val = newPrices[cIdx].offers[oIdx].durationValue;
    if (value === "monthly") newPrices[cIdx].offers[oIdx].days = val * 30;
    else if (value === "yearly") newPrices[cIdx].offers[oIdx].days = val * 365;
  }

  setSelectedPlan((prev) => ({ ...prev, prices: newPrices }));
};



  const getDropdownItems = (plan) => (
    <>
      <DropdownItem key="edit" onClick={() => handleEdit(plan)}>Edit</DropdownItem>
      <DropdownItem key="delete" onClick={() => handleDelete(plan._id)}>Delete</DropdownItem>
    </>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Plan Management" />
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="table-responsive">
                <Table className="table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      {/* <th>Caption</th> */}
                      <th>Firms</th>
                      {/* <th>Icon</th> */}
                      <th>Prices</th>
                      <th>Features</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plansData && plansData.map(plan => (
                      <tr key={plan._id}>
                        <td><i className={plan.icon + " font-size-20"} style={{marginRight:"8px"}}></i>{plan.title} </td>
                        {/* <td>{plan.caption}</td> */}
                        <td>{plan.maxFirms}</td>
                        {/* <td>
                          <i className={plan.icon + " font-size-20"}></i>
                        </td> */}
                        <td>
                          {plan.prices?.map((p, idx) => (
                            <Card key={idx} className="mb-2 shadow-sm">
                              <CardBody>
                                <h6 className="fw-bold mb-3">
                                  {capitalize(p.country)} ({p.currency})
                                </h6>
                                <Table bordered size="sm" responsive className="mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Offer Type</th>
                                      <th>Duration</th>
                                      <th>Days</th>
                                      <th>Base</th>
                                      <th>Original</th>
                                      <th>Discounted</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.offers.map((o, i) => (
                                      <tr key={i}>
                                        <td className="text-capitalize">{o.durationType}</td>
                                        <td>{o.durationValue}</td>
                                        <td>{o.days}</td>
                                        <td>{p.basePrice}</td>
                                        <td>{o.originalPrice}</td>
                                        <td>
                                          <span className="fw-bold text-success">
                                            {o.discountedPrice}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </CardBody>
                            </Card>
                          ))}
                        </td>
                        <td>
                          <ul>
                            {plan.features.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </td>
                        <td>
                          <Dropdown isOpen={dropdownOpen[plan._id]} toggle={() => toggleDropdown(plan._id)}>
                            <DropdownToggle caret color="info">Actions</DropdownToggle>
                            <DropdownMenu>{getDropdownItems(plan)}</DropdownMenu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </Col>

        {/* Edit Modal */}
        <Modal isOpen={modal} toggle={toggleModal} size="xl">
          <ModalHeader toggle={toggleModal}>Edit Plan</ModalHeader>
          <ModalBody>
            {selectedPlan && (
              <Form>
                <Row>
                <Col lg={4}>
                  <FormGroup>
                    <Label>Title</Label>
                    <Input
                      type="text"
                      name="title"
                      value={selectedPlan.title}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg={4}>
                  <FormGroup>
                    <Label>Caption</Label>
                    <Input
                      type="text"
                      name="caption"
                      value={selectedPlan.caption}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>

                <Col lg={4}>
                  <FormGroup>
                    <Label>Max Firms</Label>
                    <Input
                      type="number"
                      name="maxFirms"
                      value={selectedPlan.maxFirms}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </Col>
              </Row>

                <FormGroup>
                  <Label>Select Icon</Label>
                  <div className="d-flex flex-wrap">
                    {predefinedIcons.map((iconClass, index) => (
                      <div key={index}
                        className={`avatar-sm cursor-pointer me-3 mb-3 ${selectedPlan.icon === iconClass ? "bg-primary text-white" : "bg-light"}`}
                        onClick={() => handleIconChange(iconClass)}
                        style={{ borderRadius: "50%", padding: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className={`${iconClass} font-size-20`} />
                      </div>
                    ))}
                  </div>
                </FormGroup>

                {/* Country & Offers */}
                <h5>Pricing</h5>
                {selectedPlan.prices?.map((price, cIdx) => (
                  <Card key={cIdx} className="mb-3">
                    <CardBody>
                      <Row>
                        <Col md={3}>
                          <Label>Country</Label>
                          <Select
                            options={countryOptions}
                            value={countryOptions.find((opt) => opt.value === price.country) || null}
                            onChange={(opt) => {
                              const newPrices = [...selectedPlan.prices];
                              newPrices[cIdx].country = opt.value;
                              newPrices[cIdx].currency = opt.currency;
                              setSelectedPlan((prev) => ({ ...prev, prices: newPrices }));
                            }}
                          />
                        </Col>
                        <Col md={3}>
                          <Label>Currency</Label>
                          <Input type="text" value={price.currency} readOnly />
                        </Col>
                        <Col md={3}>
                          <Label>Base Price</Label>
                          <Input
                            type="number"
                            value={price.basePrice}
                            onChange={(e) => handleCountryChange(cIdx, "basePrice", e.target.value)}
                          />
                        </Col>
                        <Col md={3} className="d-flex align-items-end">
                          <Button color="danger" size="sm" onClick={() => deleteCountry(cIdx)}>Remove</Button>
                        </Col>
                      </Row>

                      <h6 className="mt-3">Offers</h6>
                        {price.offers.map((offer, oIdx) => (
                          <Row key={oIdx} className="mb-2">
                            <Col md={3}>
                              <Label>Type</Label>
                              <Input
                                type="select"
                                value={offer.durationType}
                                onChange={(e) => handleOfferChange(cIdx, oIdx, "durationType", e.target.value)}
                              >
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                                <option value="custom">Custom</option>
                              </Input>
                            </Col>
                            <Col md={2}>
                              <Label>Duration</Label>
                              <Input
                                type="number"
                                value={offer.durationValue}
                                onChange={(e) => handleOfferChange(cIdx, oIdx, "durationValue", e.target.value)}
                              />
                            </Col>
                            <Col md={2}>
                              <Label>Days</Label>
                              <Input type="number" value={offer.days} readOnly />
                            </Col>
                            <Col md={2}>
                              <Label>Original</Label>
                              <Input
                                type="number"
                                value={offer.originalPrice}
                                onChange={(e) => handleOfferChange(cIdx, oIdx, "originalPrice", e.target.value)}
                              />
                            </Col>
                            <Col md={3}>
                              <Label>Discounted</Label>
                              <Input
                                type="number"
                                value={offer.discountedPrice}
                                onChange={(e) => handleOfferChange(cIdx, oIdx, "discountedPrice", e.target.value)}
                              />
                            </Col>
                            <Col md={3}>
                              <Label>Tagline</Label>
                              <Input
                                type="text"
                                placeholder="e.g. Save up to 40% this year!"
                                value={offer.taglineText || ""}
                                onChange={(e) => handleOfferChange(cIdx, oIdx, "taglineText", e.target.value)}
                              />
                            </Col>
                            <Col md={12} className="d-flex justify-content-end">
                              <Button color="danger" size="sm" className="mt-2" onClick={() => deleteOffer(cIdx, oIdx)}>
                                &times;
                              </Button>
                            </Col>
                          </Row>
                        ))}

                      <Button color="success" size="sm" type="button" onClick={() => addOffer(cIdx)}>+ Add Offer</Button>
                    </CardBody>
                  </Card>
                ))}
                <Button color="info" size="sm" type="button" onClick={addCountry}>+ Add Country</Button>

                {/* Features */}
                <FormGroup className="mt-4">
                  <Label>Features</Label>
                  <Select
                    isMulti
                    name="features"
                    options={predefinedFeatures.map((f) => ({ value: f, label: f }))}
                    value={selectedPlan.features?.map((f) => ({ value: f, label: f }))}
                    onChange={(opts) => setSelectedPlan((prev) => ({
                      ...prev,
                      features: opts.map((opt) => opt.value),
                    }))}
                  />
                </FormGroup>
              </Form>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update Plan</Button>
            <Button color="secondary" onClick={toggleModal}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
}

export default ManagePlan;
