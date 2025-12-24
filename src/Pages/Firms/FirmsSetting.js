import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button, Row, Alert } from 'reactstrap';
import FirmSwitcher from './FirmSwitcher';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import firmAddressForm from '../../components/FirmComponents/firmAddressForm';
import FirmAddressForm from '../../components/FirmComponents/firmAddressForm';
import axiosInstance from '../../utils/axiosInstance';
import FirmTypeForm from '../../components/FirmComponents/firmTypeForm';
// import { validateEmail } from '../Utility/FormValidation';
import Select from 'react-select';
import bankFieldOptions from '../../components/FirmComponents/bankFieldOptions';
import { firmSubIndustries } from "../../data/firmSubIndustries";
import { BackButton } from '../../components/Common/BackButton';
 

function FirmSettings() {
  const [firmsData, setFirmsData] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(""); 
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
      firmIndustry: "",
      firmSubIndustry: "",
      firmDetails: {}
      
    });

  const [firmType, setFirmType] = useState("");
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const [trigger, setTrigger] = useState(0)
  const token = JSON.parse(localStorage.getItem("authUser")).token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchFirm = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/auth/getAccount/${authUser?.response?.adminId}`,config);
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
          firmIndustry: data.firmIndustry || "",
          firmSubIndustry: data.firmSubIndustry || "",
          firmDetails: data.firmDetails || {}
        };

        setFetchedFirmDetails(parsedData);
        setOriginalFirmDetails(parsedData); 

      } catch (err) {
        // console.error("Error fetching firm data:", err);
        // toast.error("Failed to fetch firm data");
      }
  };
  useEffect(() => {
        fetchFirm();
    }, [trigger]);

  const removeBankDetail = (index) => {
  const updated = fetchedFirmDetails.bankDetails.filter((_, i) => i !== index);
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

const updateBankField = (bankIndex, fieldName, fieldValue) => {
  const updated = [...fetchedFirmDetails.bankDetails];
  updated[bankIndex][fieldName] = fieldValue;
  setFetchedFirmDetails(prev => ({ ...prev, bankDetails: updated }));
};

  // currency dropdown for only indian , malaysian , saudi arabia , uae with symbols to showcase
  const currencyOptions = [
    { value: "INR", label: "₹ INR" },
    { value: "AED", label: "د.إ AED" },
    { value: "SAR", label: "﷼ SAR" },
    { value: "MYR", label: "RM MYR" },
  ];
  const countryOptions = [
    { value: "India", label: "🇮🇳 India" },
    { value: "UAE", label: "🇦🇪 UAE" },
    { value: "Saudi Arabia", label: "🇸🇦 Saudi Arabia" },
    { value: "Malaysia", label: "🇲🇾 Malaysia" },
  ];

  const countryDocuments = {
    India: ["PAN", "GSTIN", "Udyam Registration", "Shop & Establishment License"],
    UAE: ["Trade License", "VAT Registration Certificate", "Chamber of Commerce Certificate"],
    "Saudi Arabia": ["Commercial Registration (CR)", "Chamber of Commerce Certificate", "VAT Certificate"],
    Malaysia: ["SSM Certificate", "LHDN Tax Registration", "Business Bank Account Statement"],
  };

  const handleCountryChange = (selectedOption) => {
    setSelectedCountry(selectedOption.value);
    setFetchedFirmDetails((prevDetails) => ({
      ...prevDetails,
      country: selectedOption.value,
      // currency: currencyOptions[selectedOption.value]?.value || "INR",
    }));
  };
  
  const handleDocumentUpload = (docType, file) => {
    setFetchedFirmDetails((prevDetails) => ({
      ...prevDetails,
      fetchedFirmDetails: {
        ...prevDetails.fetchedFirmDetails,
        [docType]: file,
      },
    }));
  };

  const handleRegisteredTaxationChange = (index, field, value) => {
    const updatedTaxationDetails = [...fetchedFirmDetails.registeredTaxationDetail];
    updatedTaxationDetails[index][field] = value;
    setFetchedFirmDetails((prevDetails) => ({
      ...prevDetails,
      registeredTaxationDetail: updatedTaxationDetails
    }));
  };
  

  const addNewTaxationField = () => {
    setFetchedFirmDetails((prevDetails) => ({
      ...prevDetails,
      registeredTaxationDetail: [
        ...(prevDetails.registeredTaxationDetail || []),
        { fieldName: "", fieldValue: "", toShow: false }
      ]
    }));
  };
  
  const removeCurrentTaxationField = (indexToRemove) => {
    const updatedTaxationDetails = fetchedFirmDetails.registeredTaxationDetail.filter((_, index) => index !== indexToRemove);
    setFetchedFirmDetails(prevState => ({
      ...prevState,
      registeredTaxationDetail: updatedTaxationDetails
    }));
  };
  

  useEffect(() => {
    if (selectedFirmId) {
      const selectedFirm = firmsData.find(firm => firm._id === selectedFirmId) || {};
      localStorage.setItem("defaultFirm", JSON.stringify({
        firmId: selectedFirm._id || "",
        fuid: selectedFirmId || "",
        name: selectedFirm.firmName || "",
      }));
      setFetchedFirmDetails({ ...selectedFirm, address: selectedFirm.address || [] });
    }
  }, [selectedFirmId, firmsData]);

  // console.log(fetchedFirmDetails.bankName , "firm id")

  const handleFirmTypeChange = (selectedType, additionalFields) => {
    setFetchedFirmDetails((prevDetails) => ({
      ...prevDetails,
      firmType: selectedType,
      ...Object.fromEntries(
        additionalFields.map((field) => [field.toLowerCase().replace(/\s+/g, ""), ""])
      ),
    }));
  };

  const handleFieldChange = (fieldName, value) => {
    setFetchedFirmDetails((prevDetails) => ({
      ...prevDetails,
      [fieldName]: value,
    }));
  };

  const handleFirmChange = (id) => {
    setSelectedFirmId(id);
    // Fetch details for the newly selected firm
    const selectedFirm = firmsData.find(firm => firm._id === id) || {};
    setFetchedFirmDetails({ ...selectedFirm, address: selectedFirm.address || [] })
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFetchedFirmDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
    // //toast.error("");
    // setError("");
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
// console.log(fetchedFirmDetails._id);
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
    <React.Fragment>
      <div className="page-content">
        <div className="container">
          <Col lg={12} className="mx-auto mt-2">
            <Card>
              <CardBody>
              <div className="row d-flex justify-content-between align-items-center mb-2">
                 <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center gap-3">
                  <BackButton />
                  <h4 className="mb-0">Business Branding</h4>
                </div>
              <div className="col-lg-6 col-md-6 col-sm-12 mb-3 text-end m-text-center">
                {authUser?.response?.role === "client_admin" && (
                  <FirmSwitcher
                    // firms={firmsData}
                    selectedFirmId={selectedFirmId}
                    onSelectFirm={handleFirmChange}
                  />
                )}
                {/* {authUser?.response?.role === "client_admin" && (
                  <FirmSwitcher
                    firms={firmsData}
                    selectedFirmId={selectedFirmId}
                    onSelectFirm={handleFirmChange}
                  />
                )} */}
                </div>
              </div>
            { fetchedFirmDetails ? (
               <Form onSubmit={handleSubmit}>
                     <div className=' d-flex flex-row justify-content-center'>
                      <Col lg={3} md={3} sm={12} className="mb-3 d-flex justify-content-center align-items-center">
                        <div
                          className="avatar-upload-wrapper position-relative"
                          style={{ width: '150px', height: '150px' }}
                        >
                          {fetchedFirmDetails.avatar ? (
                            <img
                              src={
                                typeof fetchedFirmDetails.avatar === "string"
                                  ? fetchedFirmDetails.avatar
                                  : URL.createObjectURL(fetchedFirmDetails.avatar)
                              }
                              alt="Firm Avatar"
                              className="img-fluid"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                borderRadius: '10px',
                                cursor: 'pointer'
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '100%',
                                height: '100%',
                                border: '2px dashed #ccc',
                                borderRadius: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#888',
                                fontSize: '14px'
                              }}
                            >
                              Upload Logo
                            </div>
                          )}

                          {/* Pencil icon shown always, positioned over image */}
                          <button
                            type="button"
                            className="edit-avatar-btn position-absolute"
                            onClick={() => document.getElementById('avatarUploadInput').click()}
                            style={{
                              bottom: '10px',
                              right: '10px',
                              backgroundColor: '#ffffffcc',
                              border: 'none',
                              borderRadius: '50%',
                              padding: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            aria-label="Edit Logo"
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
                    {/* <div className="col-lg-3 col-md-3 col-sm-12 mb-3"> */}
                        <FormGroup>
                          <Label for="companyTitle">Firm Name</Label>
                          <Input
                            type="text"
                            id="companyTitle"
                            name="companyTitle"
                            value={fetchedFirmDetails.companyTitle || ''}
                            onChange={handleInputChange}
                          />
                        </FormGroup>
                        </Col>
                      {/* </div> */}
                      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                        <FormGroup>
                          <Label for="firmEmail">Firm Email</Label>
                          <Input
                            type="email"
                            id="firmEmail"
                            name="firmEmail"
                            value={fetchedFirmDetails.email || ''}
                            onChange={handleInputChange}
                            //required
                          />
                        </FormGroup>
                      </div>
                      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                        <FormGroup>
                          <Label for="firmPhone">Firm Phone</Label>
                          <Input
                            type="text"
                            id="firmPhone"
                            name="firmPhone"
                            value={fetchedFirmDetails.companyMobile || ''}
                            onChange={handleInputChange}
                            //required
                          />
                        </FormGroup>
                      </div>

                      {/* <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                        <FormGroup>
                          <Label for="avatar">Avatar URL</Label>
                          <Input
                            type="text"
                            id="avatar"
                            name="avatar"
                            value={fetchedFirmDetails.avatar || ''}
                            onChange={handleInputChange}
                          />
                         
                        </FormGroup>
                      </div> */}

                      <div className="col-lg-3 col-md-3 col-sm-12 mb-3">
                        <FormGroup>
                          {/* currency select */}
                          <Label for="currency">Currency</Label>
                          <Select
                            options={currencyOptions}
                            // value={currencyOptions.find(option => option.value === fetchedFirmDetails.currency)}
                            value={currencyOptions.find(option => option.value === fetchedFirmDetails.currency)}
                            onChange={(selectedOption) => handleFieldChange("currency", selectedOption.value)}
                          />
                        </FormGroup>
                      </div>
                        <Col lg={3} md={3} sm={12}>
                            <FormGroup>
                              <Label htmlFor="firmIndustry">Industry Type</Label>
                              <select
                                id="firmIndustry"
                                name="firmIndustry"
                                className="form-select"
                                value={fetchedFirmDetails.firmIndustry}
                                onChange={handleInputChange}
                              >
                                <option value="">Select Firm Industry</option>
                                <option value="trader">Trading</option>
                                <option value="manufacturer">Manufacturing</option>
                                <option value="service">Service</option>
                              </select>
                            </FormGroup>
                          </Col>
                          {fetchedFirmDetails.firmIndustry && (
                            <Col lg={3} md={3} sm={12}>
                              <FormGroup>
                                <Label htmlFor="subIndustry">Sub Industry</Label>
                                <Select
                                      id="subIndustry"
                                      options={firmSubIndustries[fetchedFirmDetails.firmIndustry] || []}
                                      value={(firmSubIndustries[fetchedFirmDetails.firmIndustry] || []).find(
                                          opt => opt.value === fetchedFirmDetails.firmSubIndustry
                                        ) || null}
      
                                      onChange={(selectedOption) =>
                                        handleFieldChange("firmSubIndustry", selectedOption.value )
                                      }
                                      placeholder="Select Sub Industry"
                                    />
      
                              </FormGroup>
                            </Col>
                          )}
                      <div className="col-lg-3 col-md-3 col-sm-12 mb-3" style={{display: "flex",alignItems: "center",paddingTop: "13px"}}>
                        <Button color="primary" onClick={addNewTaxationField}>
                          Company Tax Reg.
                        </Button>
                      </div>
                      {(fetchedFirmDetails?.registeredTaxationDetail || []).map((detail, index) => (
                          <div 
                            className="d-flex flex-lg-row flex-md-row flex-sm-column flex-column align-items-center pt-2 justify-content-evenly" 
                            key={index} 
                            style={{ background: "#e9e9e985" }}
                          >
                            <FormGroup className="col-lg-3 col-md-3 col-sm-12">
                              <Label>Field Name</Label>
                              <Input
                                type="text"
                                value={detail.fieldName}
                                onChange={(e) => handleRegisteredTaxationChange(index, "fieldName", e.target.value)}
                              />
                            </FormGroup>

                            <FormGroup className="col-lg-3 col-md-3 col-sm-12">
                              <Label>Field Value</Label>
                              <Input
                                type="text"
                                value={detail.fieldValue}
                                onChange={(e) => handleRegisteredTaxationChange(index, "fieldValue", e.target.value)}
                              />
                            </FormGroup>

                            <FormGroup 
                              check 
                              className="col-lg-2 col-md-2 col-sm-12 d-flex align-items-center"
                            >
                              <Label check className="m-0" style={{ background: "none" }}>
                                <Input
                                  type="checkbox"
                                  checked={detail.toShow}
                                  onChange={(e) => handleRegisteredTaxationChange(index, "toShow", e.target.checked)}
                                />
                                Show Field
                              </Label>
                            </FormGroup>

                            <div 
                              className="col-lg-2 col-md-2 col-sm-12 d-flex align-items-center justify-content-center mb-2" 
                              style={{ paddingTop: "13px" }}
                            >
                              <Button 
                                color="danger" 
                                onClick={() => removeCurrentTaxationField(index)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}



                      {/* <Col lg={3} md={6} sm={12}>
                        <FormGroup>
                          <Label for="country">Country</Label>
                          <Select
                            options={countryOptions}
                            value={countryOptions.find((option) => option.value === selectedCountry)}
                            onChange={handleCountryChange}
                          />
                        </FormGroup>
                      </Col> */}
                      {/* <hr/> */}
                      <div
                      className='p-2 my-2 col-lg-3 col-md-3 col-sm-12 rounded'  
                      style={{
                        width:"100%",
                        height:"auto",
                        fontWeight:"bolder",
                        background : "var(--bs-header-dark-bg)",
                        color:"white"
                          }}> 
                            Banking Details 
                      </div>
                      <br/>
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
                      {/* Business Verification Documents */}
                        {/* <Row className="mt-3">
                          <Col lg={12}>
                            <h5>Business Verification Documents</h5>
                            {selectedCountry &&
                              countryDocuments[selectedCountry]?.map((doc) => (
                                <FormGroup key={doc}>
                                  <Label>{doc}</Label>
                                  <Input type="file" onChange={(e) => handleDocumentUpload(doc, e.target.files[0])} />
                                </FormGroup>
                              ))}
                          </Col>
                        </Row> */}

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
                    <Button color="primary" type="submit" className='m-w-100'>Save Changes</Button>
                  </Form>
                ) : (
                  <Alert color="info">Please select a firm to edit its settings.</Alert>
                )}
                

              </CardBody>
            </Card>
          </Col>
        </div>
      </div>
     </React.Fragment> 
  );
}

export default FirmSettings;
