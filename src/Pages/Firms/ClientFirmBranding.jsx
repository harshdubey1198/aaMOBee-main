import React, { useState, useEffect } from 'react';
import { Card, CardBody, Col, Form, FormGroup, Label, Input, Button, Row, Alert } from 'reactstrap';
import FirmSwitcher from './FirmSwitcher';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import Select from 'react-select';
import FirmAddressForm from '../../components/FirmComponents/firmAddressForm';
import FirmTypeForm from '../../components/FirmComponents/firmTypeForm';
import { firmSubIndustries } from "../../data/firmSubIndustries";
import BillPreviewModal from '../../Modal/BillPreviewModal';
import InvoicePreviewModal from '../../Modal/InvoicePreviewModal';
import { dummyBill, generateDummyInvoice, layoutOptions, currencyOptions } from '../../constants/dummyLayoutData';
import clientfirmbrandinginititals from "../../useStateConstant/firmmodulestate.js"
import BankDetailsForm from "../../components/FirmBranding/BankDetailsForm.js";
import TaxationDetailsForm from "../../components/FirmBranding/TaxationDetailsForm";
import LayoutSelector from "../../components/FirmBranding/LayoutSelector";
import FirmBasicInfoForm from '../../components/FirmBranding/FirmBasicInfoForm';
import { useLocation } from "react-router-dom";
import { BackButton } from '../../components/Common/BackButton.js';

function ClientFirmBranding() {
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [originalFirmDetails, setOriginalFirmDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal visibility
  const [selectedBill, setSelectedBill] = useState(null);  // State for selected bill
  const [previewLayoutType, setPreviewLayoutType] = useState('layout1');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [previewType, setPreviewType] = useState(null); // "invoice" or "bill"
  const [layouts, setLayouts] = useState({ invoice: 'layout1', bill: 'layout1' });
  const location = useLocation();


  const handleInvoicePreview = (layoutId) => {
    const dummyInvoiceData = generateDummyInvoice(fetchedFirmDetails);
    setSelectedInvoice(dummyInvoiceData);
    setPreviewLayoutType(layoutId);
    setPreviewType("invoice");
    setIsModalOpen(true);
  };
  // Retrieve selectedBillLayout from localStorage when the component mounts
  useEffect(() => {
    const bill = localStorage.getItem('selectedBillLayout') || 'layout1';
    const invoice = localStorage.getItem('selectedInvoiceLayout') || 'layout1';
    setLayouts({ bill, invoice });
  }, []);

  const handleLayoutChange = (type, layoutId) => {
    setLayouts(prev => ({ ...prev, [type]: layoutId }));
    localStorage.setItem(`selected${type === 'bill' ? 'Bill' : 'Invoice'}Layout`, layoutId);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
    setSelectedInvoice(null);
  };

  const handleSaveChanges = async () => {
    try {
      await handleSubmit(new Event('submit'));
    } catch (error) {
      console.error("Error saving layouts:", error);
      toast.error("Failed to save layout preferences");
    }
  };

  const [fetchedFirmDetails, setFetchedFirmDetails] = useState(clientfirmbrandinginititals);
  const [authUser, setAuthUser] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const token = JSON.parse(localStorage.getItem("authUser")).token;
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    setAuthUser(user);
  }, []);

 useEffect(() => {
  const savedFirm = JSON.parse(localStorage.getItem("defaultFirm"));
  const firmIdFromRouter = location.state?.firmId;

  if (firmIdFromRouter) {
    setSelectedFirmId(firmIdFromRouter);
  } else if (savedFirm?.firmId) {
    setSelectedFirmId(savedFirm.firmId);
  }
}, [location.state]);

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
            country: data.country || "",
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
            firmDetails: data.firmDetails || {},
            billLayout: data.billLayout,
            invoiceLayout: data.invoiceLayout,
              partnershipStartDate: data.createdAt ? new Date(data.createdAt).toISOString().split("T")[0] : "",

          };

          setFetchedFirmDetails(parsedData);
          setOriginalFirmDetails(parsedData);
          setLayouts({
            bill: parsedData.billLayout || 'layout1',
            invoice: parsedData.invoiceLayout || 'layout1'
          });
          localStorage.setItem('selectedBillLayout', parsedData.billLayout || 'layout1');
          localStorage.setItem('selectedInvoiceLayout', parsedData.invoiceLayout || 'layout1');
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

  const addBankDetail = () => {
    const newBank = {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolder: "",
      cifNumber: "",
      branchName: ""
    };
    setFetchedFirmDetails((prevState) => ({
      ...prevState,
      bankDetails: [...(prevState.bankDetails || []), newBank],
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

  const handleFieldChange = (fieldName, value) => {
    setFetchedFirmDetails(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleRegisteredTaxationChange = (index, field, value) => {
  let updated;
  
  if (field === "all") {
    // Directly replace the whole array (for Show/Hide buttons)
    updated = value;
  } else {
    // Update a single field for normal input changes
    updated = [...fetchedFirmDetails.registeredTaxationDetail];
    updated[index] = {
      ...updated[index],
      [field]: field === "toShow" ? Boolean(value) : value,
    };
  }

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
        { fieldName: "", fieldValue: "", toShow: true }
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
      const updatedFields = {
        billLayout: layouts.bill,
        invoiceLayout: layouts.invoice
      };
      const skipKeys = ["_id", "incorporationDate"];
      const hasFile = fetchedFirmDetails.avatar instanceof File;

      for (const key in fetchedFirmDetails) {
        if (skipKeys.includes(key)) continue;

        const current = fetchedFirmDetails[key];
        const original = originalFirmDetails?.[key];

        // Always include registeredTaxationDetail for update
        if (key === "registeredTaxationDetail") {
          updatedFields[key] = current;
          continue;
        }
        const isEqual = JSON.stringify(current) === JSON.stringify(original);
        if (!isEqual) {
          updatedFields[key] = current;
        }
      }

      if (hasFile) {
        const formData = new FormData();
        for (const key in updatedFields) {
          if (key === "avatar") {
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
        await axiosInstance.put(
          `${process.env.REACT_APP_URL}/auth/update/${fetchedFirmDetails._id}`,
          updatedFields,
          config
        );
      }
      console.log("Final updatedFields being sent:", updatedFields);
      toast.success("Firm details updated successfully");
      setTrigger(prev => prev + 1);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update firm details");
    }
  };

  return (
    <div className="page-content firm-branding-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="container py-4">
        <Col lg={12} className="mx-auto">
          <div className="page-header mb-4">
            <div className="header-content">
              <div className="d-flex align-items-center gap-3 mb-3">
                <BackButton />
                <h1 className="page-title mb-0">Business Branding</h1>
              </div>
              <div className="mb-3">
                {authUser?.response?.role === "client_admin" && (
                  <FirmSwitcher
                    selectedFirmId={selectedFirmId}
                    onSelectFirm={setSelectedFirmId}
                  />
                )}
              </div>
            </div>
          </div>
          <Card className="firm-card shadow-sm">
            <CardBody>
              {selectedFirmId ? (
                <Form onSubmit={handleSubmit}>
                  <div className="avatar-section">
                    <div className="avatar-wrapper">
                      {fetchedFirmDetails.avatar ? (
                        <img
                          src={
                            typeof fetchedFirmDetails.avatar === "string"
                              ? fetchedFirmDetails.avatar
                              : URL.createObjectURL(fetchedFirmDetails.avatar)
                          }
                          alt="Firm Avatar"
                          className="firm-avatar" />
                      ) : (
                        <div className="avatar-placeholder">
                          <i className="bx bx-buildings mb-2"></i>
                          <span>Upload Logo</span>
                        </div>
                      )}
                      <button
                        type="button"
                        className="edit-avatar-btn"
                        onClick={() => document.getElementById('avatarUploadInput').click()}
                        aria-label="Edit Logo">
                        <i className="bx bx-pencil"></i>
                      </button>

                      <input type="file" accept="image/*" id="avatarUploadInput"
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
                  </div>

                  <div className="form-section">
                    <h2 className="section-title">Basic Information</h2>
                    <FirmBasicInfoForm
                      formData={fetchedFirmDetails}
                      handleInputChange={handleInputChange}
                      handleFieldChange={handleFieldChange} />
                  </div>
                  
                  <div className="section-divider"></div>
                  
                  <div className="form-section">
                    <h2 className="section-title">Taxation Details</h2>
                    <TaxationDetailsForm
                      taxationDetails={fetchedFirmDetails.registeredTaxationDetail}
                      onAdd={addNewTaxationField}
                      onRemove={removeCurrentTaxationField}
                      onChange={handleRegisteredTaxationChange} />
                  </div>
                  
                  <div className="section-divider"></div>
                  
                  <div className="form-section bank-details-section">
                    <h2 className="section-title">Banking Details</h2>
                    <BankDetailsForm
                      bankDetails={fetchedFirmDetails.bankDetails}
                      onChange={updateBankField}
                      onRemove={removeBankDetail} />
                  
                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        onClick={addBankDetail}
                        className="btn btn-tertiary"
                        style={{
                          borderRadius: '12px',
                          fontWeight: '600',
                          padding: '10px 20px',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px rgba(5, 70, 75, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(5, 70, 75, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(5, 70, 75, 0.3)';
                        }}
                      >
                        + Add Bank
                      </Button>
                    </div>
                  </div>

                  <div className="section-divider"></div>

                  <div className="form-section">
                    {/* <h2 className="section-title">Address Details</h2> */}
                    {fetchedFirmDetails.address.length > 0 ? (
                      fetchedFirmDetails.address.map((address, index) => (
                        <FirmAddressForm
                          key={index}
                          address={address}
                          index={index}
                          handleAddressChange={handleAddressChange} />))
                    ) : (
                      <FirmAddressForm
                        index={0}
                        handleAddressChange={handleAddressChange} />)}
                  </div>

                  <div className="section-divider"></div>

                  <div className="form-section">
                    {/* <h2 className="section-title">Firm Type Details</h2> */}
                    <FirmTypeForm firmDetails={fetchedFirmDetails} setFirmDetails={setFetchedFirmDetails} />
                  </div>

                  <div className="action-buttons">
                    <Button 
                      color="primary" 
                      type="submit"
                      style={{
                        borderRadius: '12px',
                        fontWeight: '600',
                        padding: '12px 30px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(30, 78, 91, 0.3)',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 8px 25px rgba(30, 78, 91, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(30, 78, 91, 0.3)';
                      }}
                    >
                      Save Changes
                    </Button>
                  </div>

                  {isModalOpen && previewType === "bill" && selectedBill && (
                    <BillPreviewModal
                      isOpen={isModalOpen}
                      bill={selectedBill}
                      onClose={handleCloseModal}
                      layoutType="bill"
                      layoutId={previewLayoutType}
                      companyData={fetchedFirmDetails} />)}

                  {isModalOpen && previewType === "invoice" && selectedInvoice && (
                    <InvoicePreviewModal
                      isOpen={isModalOpen}
                      invoiceData={selectedInvoice}
                      companyData={fetchedFirmDetails}
                      onClose={handleCloseModal}
                      layoutId={previewLayoutType} />)}
                </Form>
              ) : (
                <Alert 
                  color="info" 
                  className="text-center py-4"
                  style={{
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)'
                  }}
                >
                  <i className="bx bx-info-circle me-2" style={{ fontSize: '24px' }}></i>
                  Please select a firm to edit its settings.
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </div>
    </div>
  );
}

export default ClientFirmBranding;