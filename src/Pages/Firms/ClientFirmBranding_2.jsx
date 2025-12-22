import React, { useState, useEffect } from 'react';
import {
  Card, CardBody, Col, Form, FormGroup, Label, Input, Button, Row, Alert
} from 'reactstrap';
import FirmSwitcher from './FirmSwitcher';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Select from 'react-select';
import FirmAddressForm from '../../components/FirmComponents/firmAddressForm';
import FirmTypeForm from '../../components/FirmComponents/firmTypeForm';
import bankFieldOptions from '../../components/FirmComponents/bankFieldOptions';
function ClientFirmBranding() {
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [originalFirmDetails, setOriginalFirmDetails] = useState(null);

  const [fetchedFirmDetails, setFetchedFirmDetails] = useState({
    _id: "",
    companyTitle: "",
    email: "",
    avatar: "",
    companyMobile: "",
    incorporationDate: "",
    currency: "",
    accountHolder: "",
    accountNumber: "",
    bankName: "",
    branchName: "",
    ifscCode: "",
    cifNumber: "",
    gstin: "",
    address: [],
    registeredTaxationDetail: [{ fieldName: "", fieldValue: "", toShow: false }],
    bankDetails: [{}],
    firmType: "",
    firmDetails: {}
    
  });
  console.log("Firm Details:", fetchedFirmDetails);
  const [authUser, setAuthUser] = useState(null);
  const [trigger, setTrigger] = useState(0);

  const token = JSON.parse(localStorage.getItem("authUser")).token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const currencyOptions = [
    { value: "INR", label: "₹ INR" },
    { value: "AED", label: "د.إ AED" },
    { value: "SAR", label: "﷼ SAR" },
    { value: "MYR", label: "RM MYR" },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    setAuthUser(user);
  }, []);

useEffect(() => {
  const fetchFirm = async () => {
    if (authUser?.response?.role === "client_admin" && selectedFirmId) {
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/auth/getAccount/${selectedFirmId}`, config);
        const data = response || {};

        const parsedData = {
          _id: data._id || "",
          companyTitle: data.companyTitle || "",
          email: data.email || "",
          avatar: data.avatar || "",
          companyMobile: data.companyMobile || "",
          incorporationDate: data.incorporationDate || "",
          currency: data.currency || "",
          accountHolder: data.accountHolder || "",
          accountNumber: data.accountNumber || "",
          bankName: data.bankName || "",
          branchName: data.branchName || "",
          ifscCode: data.ifscCode || "",
          cifNumber: data.cifNumber || "",
          gstin: data.gstin || "",
          address: Array.isArray(data.address) ? data.address : [],
          registeredTaxationDetail: Array.isArray(data.registeredTaxationDetail) && data.registeredTaxationDetail.length > 0
            ? data.registeredTaxationDetail
            : [{ fieldName: "", fieldValue: "", toShow: false }],
          firmType: data.fetchedFirmDetails?.firmType || "",
          bankDetails: Array.isArray(data?.bankDetails) ? data.bankDetails : [],
          firmDetails: data.firmDetails || {}
        };

        setFetchedFirmDetails(parsedData);
        setOriginalFirmDetails(parsedData); 

      } catch (err) {
        console.error("Error fetching firm data:", err);
        toast.error("Failed to fetch firm data");
      }
    }
  };

  fetchFirm();
}, [selectedFirmId, trigger]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFetchedFirmDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankDetailChange = (index, field, value) => {
      const updated = [...fetchedFirmDetails.bankDetails];
      updated[index][field] = value;
      setFetchedFirmDetails(prev => ({
        ...prev,
        bankDetails: updated
      }));
    };


const addBankDetail = () => {
  setFetchedFirmDetails(prev => ({
    ...prev,
    bankDetails: [
      ...prev.bankDetails,
      {}
    ]
  }));
};


const removeBankDetail = (index) => {
  const updated = fetchedFirmDetails.bankDetails.filter((_, i) => i !== index);
  setFetchedFirmDetails(prev => ({
    ...prev,
    bankDetails: updated
  }));
};


const updateBankField = (bankIndex, fieldName, fieldValue) => {
  const updated = [...fetchedFirmDetails.bankDetails];
  updated[bankIndex][fieldName] = fieldValue;
  setFetchedFirmDetails(prev => ({ ...prev, bankDetails: updated }));
};


const removeBankField = (bankIndex, fieldIndex) => {
  const updated = [...fetchedFirmDetails.bankDetails];
  updated[bankIndex].splice(fieldIndex, 1);
  setFetchedFirmDetails(prev => ({ ...prev, bankDetails: updated }));
};


  const handleFieldChange = (fieldName, value) => {
    setFetchedFirmDetails(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleRegisteredTaxationChange = (index, field, value) => {
    const updated = [...fetchedFirmDetails.registeredTaxationDetail];
    updated[index][field] = value;
    setFetchedFirmDetails(prev => ({
      ...prev,
      registeredTaxationDetail: updated
    }));
  };

  const addNewTaxationField = () => {
    setFetchedFirmDetails(prev => ({
      ...prev,
      registeredTaxationDetail: [
        ...prev.registeredTaxationDetail,
        { fieldName: "", fieldValue: "", toShow: false }
      ]
    }));
  };

  const removeCurrentTaxationField = (index) => {
    const updated = fetchedFirmDetails.registeredTaxationDetail.filter((_, i) => i !== index);
    setFetchedFirmDetails(prev => ({
      ...prev,
      registeredTaxationDetail: updated
    }));
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddress = [...fetchedFirmDetails.address];
    updatedAddress[index] = {
      ...updatedAddress[index],
      [name]: value
    };
    setFetchedFirmDetails(prev => ({ ...prev, address: updatedAddress }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const updatedFields = {};
    const skipKeys = ["_id", "incorporationDate"];
    const hasFile = fetchedFirmDetails.avatar instanceof File;

    for (const key in fetchedFirmDetails) {
      if (skipKeys.includes(key)) continue;

      const current = fetchedFirmDetails[key];
      const original = originalFirmDetails?.[key];

      const isEqual = JSON.stringify(current) === JSON.stringify(original);

      if (!isEqual) {
        updatedFields[key] = current;
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes detected.");
      return;
    }

    if (hasFile) {
      const formData = new FormData();

      for (const key in updatedFields) {
        if (key === "avatar" && fetchedFirmDetails.avatar instanceof File) {
          formData.append("avatar", fetchedFirmDetails.avatar);
        } else {
          formData.append(key, JSON.stringify(updatedFields[key]));
        }
      }

      await axiosInstance.put(
        `${process.env.REACT_APP_URL}/auth/update/${fetchedFirmDetails._id}`,
        formData,
        {
          headers: {
            ...config.headers,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } else {
      // Send as regular JSON
      await axiosInstance.put(
        `${process.env.REACT_APP_URL}/auth/update/${fetchedFirmDetails._id}`,
        updatedFields,
        config
      );
    }

    toast.success("Firm details updated successfully");
    setTrigger(prev => prev + 1);
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update firm details");
  }
};


  return (
    <div className="page-content">
      <div className="container">
        <Col lg={12} className="mx-auto mt-2">
          <Card>
            <CardBody>
              <div className="row d-flex justify-content-between align-items-center mb-2">
                <h4 className="col-lg-6 col-md-6 col-sm-12 mb-3 m-text-center">Firm Branding Page</h4>
                <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-end m-text-center">
                  {authUser?.response?.role === "client_admin" && (
                    <FirmSwitcher
                      selectedFirmId={selectedFirmId}
                      onSelectFirm={setSelectedFirmId}
                    />
                  )}
                </div>
              </div>

              {selectedFirmId ? (
                <Form onSubmit={handleSubmit}>
                  <div className='d-flex justify-content-center'>
                   <Col lg={3} md={3} sm={12} className="mb-3 d-flex justify-content-center align-items-center">
                      <div className="avatar-upload-wrapper position-relative">
                       {fetchedFirmDetails.avatar && (
                            <img
                              src={
                                typeof fetchedFirmDetails.avatar === "string"
                                  ? fetchedFirmDetails.avatar
                                  : URL.createObjectURL(fetchedFirmDetails.avatar)
                              }
                              alt="Firm Avatar"
                              className="img-fluid"
                              style={{
                                width: '150px',
                                height: '150px',
                                objectFit: 'cover',
                                borderRadius: '10px',
                                border: '0px solid var(--bs-header-dark-bg)'
                              }}
                            />
                          )}

                        <button
                          type="button"
                          className="edit-avatar-btn position-absolute"
                          onClick={() => document.getElementById('avatarUploadInput').click()}
                          style={{
                            bottom: '20px',
                            right: '10px',
                            backgroundColor: '#ffffffaa',
                            border: 'none',
                            borderRadius: '50%',
                            padding: '5px 8px',
                            cursor: 'pointer'
                          }}
                        >
                          <i className="mdi mdi-pencil"></i>
                        </button>

                        <input
                              type="file"
                              accept="image/*"
                              id="avatarUploadInput"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setFetchedFirmDetails(prev => ({
                                    ...prev,
                                    avatar: file 
                                  }));
                                }
                              }}
                            />

                      </div>
                    </Col>

                  </div>
                  <Row>
                    <Col lg={3} md={3} sm={12} className="mb-3">
                      <FormGroup>
                        <Label for="companyTitle">Firm Name</Label>
                        <Input
                          type="text"
                          name="companyTitle"
                          value={fetchedFirmDetails.companyTitle}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col lg={3} md={3} sm={12} className="mb-3">
                      <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                          type="email"
                          name="email"
                          value={fetchedFirmDetails.email}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    <Col lg={3} md={3} sm={12} className="mb-3">
                      <FormGroup>
                        <Label for="companyMobile">Phone</Label>
                        <Input
                          type="text"
                          name="companyMobile"
                          value={fetchedFirmDetails.companyMobile}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col>

                    {/* <Col lg={3} md={3} sm={12} className="mb-3">
                      <FormGroup>
                        <Label for="avatar">Avatar</Label>
                        <Input
                          type="text"
                          name="avatar"
                          value={fetchedFirmDetails.avatar}
                          onChange={handleInputChange}
                        />
                      </FormGroup>
                    </Col> */}

                    <Col lg={3} md={3} sm={12} className="mb-0">
                      <FormGroup>
                        <Label for="currency">Currency</Label>
                        <Select
                          options={currencyOptions}
                          value={currencyOptions.find(option => option.value === fetchedFirmDetails.currency)}
                          onChange={(opt) => handleFieldChange("currency", opt.value)}
                        />
                      </FormGroup>
                    </Col>

                    <Col lg={3} className="mb-3 d-flex align-items-end">
                      <Button color="primary" onClick={addNewTaxationField}>
                        Company Tax Reg.
                      </Button>
                    </Col>

                    {fetchedFirmDetails.registeredTaxationDetail.map((detail, index) => (
                      <Row key={index} className="mb-2 p-2 bg-light rounded">
                        <Col md={4}>
                          <Input
                            type="text"
                            placeholder="Field Name"
                            value={detail.fieldName}
                            onChange={(e) => handleRegisteredTaxationChange(index, "fieldName", e.target.value)}
                          />
                        </Col>
                        <Col md={4}>
                          <Input
                            type="text"
                            placeholder="Field Value"
                            value={detail.fieldValue}
                            onChange={(e) => handleRegisteredTaxationChange(index, "fieldValue", e.target.value)}
                          />
                        </Col>
                        <Col md={2} className="d-flex align-items-center gap-2 ">
                          <Input
                            type="checkbox"
                            checked={detail.toShow}
                            className='m-0'
                            onChange={(e) => handleRegisteredTaxationChange(index, "toShow", e.target.checked)}
                          /> Show
                        </Col>
                        <Col md={2}>
                          <Button color="danger" onClick={() => removeCurrentTaxationField(index)}>Remove</Button>
                        </Col>
                      </Row>
                    ))}

                  <Col lg={12}>
                    <h5 className="my-3">Banking Details</h5>
                  </Col>

                  {fetchedFirmDetails.bankDetails.map((bank, bankIndex) => {
                    const usedFields = Object.keys(bank);

                    return (
                      <div key={bankIndex} className="mb-4 p-3 border rounded bg-light">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h6 className="mb-0">Bank {bankIndex + 1}</h6>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => removeBankDetail(bankIndex)}
                          >
                            Remove Bank
                          </Button>
                        </div>

                        {/* Existing fields */}
                        {usedFields.filter(fieldKey => fieldKey !== "_id").map((fieldKey, fieldIndex) => (
                          <Row key={fieldIndex} className="align-items-center mb-2">
                            <Col md={5}>
                              <FormGroup>
                                <Label>{bankFieldOptions.find(opt => opt.value === fieldKey)?.label || fieldKey}</Label>
                                <Input
                                  type="text"
                                  value={bank[fieldKey] || ""}
                                  onChange={(e) =>
                                    updateBankField(bankIndex, fieldKey, e.target.value)
                                  }
                                  placeholder={`Enter ${bankFieldOptions.find(opt => opt.value === fieldKey)?.label || fieldKey}`}             
                                  />
                              </FormGroup>
                            </Col>
                            <Col md={2}>
                              <Button
                                color="danger"
                                onClick={() => {
                                  const updated = [...fetchedFirmDetails.bankDetails];
                                  delete updated[bankIndex][fieldKey];
                                  setFetchedFirmDetails(prev => ({
                                    ...prev,
                                    bankDetails: updated
                                  }));
                                }}
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}

                        {/* Add field selector */}
                        <Row className="align-items-end mb-3">
                          <Col md={5}>
                            <FormGroup>
                              <Label>Add New Field</Label>
                              <Select
                                options={bankFieldOptions.filter(
                                  opt => !usedFields.includes(opt.value)
                                )}
                                onChange={(selected) =>
                                  updateBankField(bankIndex, selected.value, "")
                                }
                                placeholder="Select field"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                    );
                  })}

                  <div className="d-flex justify-content-end mb-3">
                    <Button
                      onClick={addBankDetail}
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
                      + Add Bank
                    </Button>
                  </div>

                  </Row>

                  {fetchedFirmDetails.address.length > 0 ? (
                    fetchedFirmDetails.address.map((address, index) => (
                      <FirmAddressForm
                        key={index}
                        address={address}
                        index={index}
                        handleAddressChange={handleAddressChange}
                      />
                    ))
                  ) : (
                    <FirmAddressForm
                      index={0}
                      handleAddressChange={handleAddressChange}
                    />
                  )}

                  <FirmTypeForm firmDetails={fetchedFirmDetails} setFirmDetails={setFetchedFirmDetails} />
                  <Button color="primary" type="submit">Save Changes</Button>
                </Form>
              ) : (
                <Alert color="info">Please select a firm to edit its settings.</Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </div>
    </div>
  );
}

export default ClientFirmBranding;
