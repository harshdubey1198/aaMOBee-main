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
    setSelectedFirmId(savedFirm?.firmId || null);
    console.log("Selected Firm ID:", savedFirm?.firmId);
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
    const updated = [...fetchedFirmDetails.registeredTaxationDetail];
    updated[index] = {
      ...updated[index],
      [field]: field === "toShow" ? Boolean(value) : value,
    };
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
    <div className="page-content">
      <div className="container">
        <Col lg={12} className="mx-auto mt-2">
          <Card>
                  {/* <BackButton />   */}
            <CardBody>
              <div className="row d-flex justify-content-between align-items-center mb-2">
                 <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center gap-3">
                  <BackButton />
                  <h4 className="mb-0">Business Branding</h4>
                </div>
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
                      <div
                        className="avatar-upload-wrapper position-relative"
                        style={{ width: '150px', height: '150px' }} >
                        {fetchedFirmDetails.avatar ? (
                          <img
                            src={
                              typeof fetchedFirmDetails.avatar === "string"
                                ? fetchedFirmDetails.avatar
                                : URL.createObjectURL(fetchedFirmDetails.avatar)
                            }
                            alt="Firm Avatar"
                            className="img-fluid"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px', cursor: 'pointer' }} />
                        ) : (
                          <div
                            style={{ width: '100%', height: '100%', border: '2px dashed #ccc', borderRadius: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#888', fontSize: '14px' }} >
                            Upload Logo
                          </div>
                        )}
                        <button
                          type="button"
                          className="edit-avatar-btn position-absolute"
                          onClick={() => document.getElementById('avatarUploadInput').click()}
                          style={{ bottom: '10px', right: '10px', backgroundColor: '#ffffffcc', border: 'none', borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          aria-label="Edit Logo">
                          <i className="mdi mdi-pencil"></i>
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
                    </Col>
                  </div>

                  <Row>
                    <FirmBasicInfoForm
                      formData={fetchedFirmDetails}
                      handleInputChange={handleInputChange}
                      handleFieldChange={handleFieldChange} />

                    <TaxationDetailsForm
                      taxationDetails={fetchedFirmDetails.registeredTaxationDetail}
                      onAdd={addNewTaxationField}
                      onRemove={removeCurrentTaxationField}
                      onChange={handleRegisteredTaxationChange} />

                    <Col lg={12} >
                      <div
                        className='p-2 my-2 col-lg-3 col-md-3 col-sm-12 rounded'
                        style={{ width: "100%", height: "auto", fontWeight: "bolder", background: "var(--bs-header-dark-bg)", color: "white" }}>
                        Banking Details
                      </div>
                    </Col>

                    <BankDetailsForm
                      bankDetails={fetchedFirmDetails.bankDetails}
                      onChange={updateBankField}
                      onRemove={removeBankDetail} />

                    <div className="d-flex justify-content-end mb-3">
                      <Button
                        onClick={addBankDetail}
                        className="btn btn-tertiary"
                        style={{ backgroundColor: "#05464B", border: "none", color: "#fff", padding: "8px 20px", fontSize: "14px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.1)", }} >
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
                        handleAddressChange={handleAddressChange} />))
                  ) : (
                    <FirmAddressForm
                      index={0}
                      handleAddressChange={handleAddressChange} />)}

                  <FirmTypeForm firmDetails={fetchedFirmDetails} setFirmDetails={setFetchedFirmDetails} />

                  {/* <Col lg={12}>
                    <div className='p-2 my-2 rounded' style={{ width: "100%", fontWeight: "bolder", background: "var(--bs-header-dark-bg)", color: "white" }}>
                      Invoice & Billing Design
                    </div>
                  </Col> */}

                  {/* <Row className="mb-4">
                    <LayoutSelector
                      type="invoice"
                      layoutOptions={layoutOptions.invoice}
                      selectedLayout={layouts.invoice}
                      onChangeLayout={handleLayoutChange}
                      onPreviewLayout={handleInvoicePreview} />

                    <LayoutSelector
                      type="bill"
                      layoutOptions={layoutOptions.bill}
                      selectedLayout={layouts.bill}
                      onChangeLayout={handleLayoutChange}
                      onPreviewLayout={(layoutId) => {
                        setSelectedBill(dummyBill);
                        setPreviewLayoutType(layoutId);
                        setPreviewType("bill");
                        setIsModalOpen(true);
                      }} />
                  </Row> */}
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
                  <Button color="primary" type="submit" onClick={(e) => handleSubmit(e)}>Save Changes</Button>
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