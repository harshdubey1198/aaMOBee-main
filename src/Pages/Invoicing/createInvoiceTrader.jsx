import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Container, Card, CardBody, FormGroup } from 'reactstrap';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import InvoiceInputs from '../../components/InvoicingComponents/InvoiceInputs';
import axiosInstance from '../../utils/axiosInstance';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import PrintFormat from '../../components/InvoicingComponents/printFormat';
import PrintFormat2 from '../../components/InvoicingComponents/printFormat2';
import PrintFormat3 from '../../components/InvoicingComponents/printFormat3';
import CompanyModal from '../../components/InvoicingComponents/companyModal';
import InvoiceItems from '../../components/InvoicingComponents/InvoiceItems';
import { useNavigate } from 'react-router-dom';
import LayoutSelector2 from "../../components/FirmBranding/LayoutSelector2";
import { layoutOptions } from '../../constants/dummyLayoutData';

const CreateInvoiceTrader = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState({});
  const [isAddItemVisible, setIsAddItemVisible] = useState(true);
  const [isCompanyModalOpen, setCompanyModalOpen] = useState(false);
  const toggleCompanyModal = () => setCompanyModalOpen(!isCompanyModalOpen);
  const [fakeItems, setFakeItems] = useState([]);
  const printRef = useRef();
  const itemsRef = useRef(null);

  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const isDemo = authuser?.response?.isDemo;
  const firmId = authuser?.response?.adminId;
  const role = authuser?.response?.role;
  const createdBy = authuser?.response?._id;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

  const blockIfDemo = (actionName) => {
    if (isDemo) {
      toast.error(`Demo accounts cannot ${actionName}`);
      return true;
    }
    return false;
  };

  const blockIfNoBusiness = () => {
    if (!selectedFirmId) {
      toast.info("Please add/select a business first to continue");
      return true;
    }
    return false;
  };

  const [selectedInvoiceLayout, setSelectedInvoiceLayout] = useState("layout1");
  const [termsFormat2, setTermsFormat2] = useState("");
  const [termsFormat3, setTermsFormat3] = useState("");
  const [emailOnCreate, setEmailOnCreate] = useState(() => {
    const saved = localStorage.getItem('emailOnCreate');
    return saved === null ? true : saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('emailOnCreate', emailOnCreate ? 'true' : 'false');
  }, [emailOnCreate]);

  useEffect(() => {
    const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
    if (defaultFirm && !selectedFirmId) {
      setSelectedFirmId(defaultFirm.firmId);
    }
  }, []);

  const [invoiceData, setInvoiceData] = useState({
    companyName: "",
    companyAddress: [{ h_no: "", nearby: "", zip_code: "", district: "", state: "", city: "", country: "" }],
    companyLogo: "",
    companyPhone: "",
    companyEmail: "",
    bankName: "",
    notes: "",
    invoiceType: "Tax Invoice",
    invoiceSubType: "",
    IFSCCode: "",
    branchName: "",
    amountPaid: "",
    accountNumber: "",
    gstin: "",
    firstName: "",
    lastName: "",
    customerName: "",
    customerAddress: { h_no: "", nearby: "", district: "", city: "", state: "", country: "", zip_code: "" },
    customerPhone: '',
    customerEmail: '',
    date: '',
    country: 'India',
    items: [],
    createdBy: createdBy,
    paymentLink: '',
    taxComponents: [],
    id: '',
    varSelPrice: '',
    overallAmount: '',
  });

  useEffect(() => {
    if (invoiceData?.termsAndConditions) {
      setTermsFormat2(invoiceData.termsAndConditions);
      setTermsFormat3(invoiceData.termsAndConditions);
    }
  }, [invoiceData?.termsAndConditions]);

  const fetchInventoryItems = async () => {
    if (!idToUse) return;
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/inventory/get-items/${idToUse}`);
      setFakeItems(response.data || []);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const fetchCompanyDetails = async () => {
    if (!idToUse) return;
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/auth/getfirm/${idToUse}`);
      const companyDetails = response[0];
      if (companyDetails) {
        const companyAddress = companyDetails.address || [{ h_no: "", nearby: "", zip_code: "", district: "", state: "", city: "", country: "" }];
        setCompanyData(companyDetails);
        setSelectedInvoiceLayout(companyDetails.invoiceLayout || "layout1");
        setInvoiceData(prevData => ({
          ...prevData,
          companyName: companyDetails.companyTitle,
          companyAddress: companyAddress,
          companyLogo: companyDetails.avatar,
          companyPhone: companyDetails.companyMobile,
          companyEmail: companyDetails.email,
          gstin: companyDetails.gstin,
          bankName: companyDetails.bankName,
          IFSCCode: companyDetails.ifscCode,
          accountNumber: companyDetails.accountNumber,
          branchName: companyDetails.branchName,
        }));
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  useEffect(() => {
    fetchInventoryItems();
    fetchCompanyDetails();
  }, [selectedFirmId, firmId]);

  useEffect(() => {
    const savedLayout = localStorage.getItem("selectedInvoiceLayout");
    if (savedLayout) setSelectedInvoiceLayout(savedLayout);
  }, []);

  useEffect(() => {
    if (invoiceData.items.length === 0) setIsAddItemVisible(true);
  }, [invoiceData.items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoiceData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setInvoiceData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddress = [...invoiceData.companyAddress];
    updatedAddress[index][name] = value;
    setInvoiceData(prev => ({ ...prev, companyAddress: updatedAddress }));
  };

  const removeAddress = (index) => {
    const updatedAddress = [...invoiceData.companyAddress];
    updatedAddress.splice(index, 1);
    setInvoiceData(prev => ({ ...prev, companyAddress: updatedAddress }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setInvoiceData(prev => ({ ...prev, companyLogo: reader.result }));
    reader.readAsDataURL(file);
  };

  const addItem = () => {
    setInvoiceData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', variant: '', quantity: 1, price: 0, discount: 0, tax: 0 }]
    }));
    setIsAddItemVisible(false);
  };

  const removeItem = (index) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    setInvoiceData(prev => ({ ...prev, items: newItems }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...invoiceData.items];
    updatedItems[index][field] = value;
    setInvoiceData(prev => ({ ...prev, items: updatedItems }));
  };

  const handleAddItem = () => {
    addItem();
    setTimeout(() => itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const handleCancel = () => {
    setInvoiceData({
      companyName: "",
      companyAddress: [{ h_no: "", nearby: "", zip_code: "", district: "", state: "", city: "", country: "" }],
      companyLogo: "",
      companyPhone: "",
      companyEmail: "",
      bankName: "",
      invoiceType: "Tax Invoice",
      invoiceSubType: "",
      IFSCCode: "",
      branchName: "",
      amountPaid: "",
      accountNumber: "",
      gstin: "",
      firstName: "",
      lastName: "",
      customerName: "",
      customerAddress: { h_no: "", nearby: "", district: "", city: "", state: "", country: "", zip_code: "" },
      customerPhone: "",
      customerEmail: "",
      date: "",
      country: "India",
      items: [],
      createdBy: createdBy,
      paymentLink: "",
      taxComponents: [],
      id: "",
      varSelPrice: "",
      overallAmount: "",
      notes: ""
    });
    setSelectedFirmId(null);
  };

  const printInvoice = useReactToPrint({ content: () => printRef.current });

  const handleLayoutChange = (type, layoutId) => {
    if (type === "invoice") {
      setSelectedInvoiceLayout(layoutId);
      localStorage.setItem("selectedInvoiceLayout", layoutId);
    }
  };

  const handleInvoicePreview = (layoutId) => setSelectedInvoiceLayout(layoutId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockIfDemo("submit invoices")) return;

    const invoicePayload = {
      customer: {
        firstName: invoiceData.firstName,
        lastName: invoiceData.lastName,
        email: invoiceData.customerEmail,
        mobile: invoiceData.customerPhone,
        address: invoiceData.customerAddress
      },
      items: invoiceData.items.map(item => ({
        itemId: item.itemId,
        selectedVariant: item.selectedVariant,
        quantity: item.quantity,
        sellingPrice: item.price,
        discount: item.discount || 0,
        tax: item.tax || 0
      })),
      invoiceDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      amountPaid: invoiceData.amountPaid,
      firmId: idToUse,
      createdBy,
      invoiceType: invoiceData.invoiceType,
      invoiceSubType: invoiceData.invoiceSubType,
      invoiceLayout: selectedInvoiceLayout,
      notes: 'Please pay by due date.',
      termsAndConditions:
        selectedInvoiceLayout === "layout2" ? termsFormat2 :
        selectedInvoiceLayout === "layout3" ? termsFormat3 : invoiceData.terms || "",
      customerEmail: invoiceData.customerEmail,
      emailOnCreate,
    };

    try {
      const createRes = await axiosInstance.post(`${process.env.REACT_APP_URL}/invoice/create-invoice`, invoicePayload);
      toast.success(createRes.message || 'Invoice created');
      navigate('/all-invoices');
    } catch (error) {
      console.error(error);
      toast.error('Failed to create invoice');
    }
  };

  return (
    <div className='page-content'>
      <Container>
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Create Invoice" />

        {!selectedFirmId ? (
          <Card className="p-4 text-center">
            <h4 className="text-danger">Business Setup Required</h4>
            <p style={{ maxWidth: "600px", margin: "0 auto" }}>
              You need to create or select a business first to proceed.
            </p>
            <div className="d-flex justify-content-center mt-3">
              <Button color="primary" size="sm" style={{ width: "100px" }} onClick={() => navigate('/add-business')}>
                Add Business
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <Card style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
              <CardBody style={{ overflowY: 'auto' }}>
                <Form onSubmit={handleSubmit}>
                  <InvoiceInputs
                    invoiceData={invoiceData}
                    selectedFirmId={selectedFirmId}
                    setSelectedFirmId={setSelectedFirmId}
                    handleInputChange={handleInputChange}
                    handleFileChange={handleFileChange}
                    fakeItems={fakeItems}
                    toggleCompanyModal={toggleCompanyModal}
                    printInvoice={printInvoice}
                    addItem={addItem}
                    removeItem={removeItem}
                    setInvoiceData={setInvoiceData}
                    companyData={companyData}
                    emailOnCreate={emailOnCreate}
                    setEmailOnCreate={setEmailOnCreate}
                  />

                  <div className="col-lg-3 col-md-4 col-sm-12 mb-3  justify-content-center">
                    {isAddItemVisible && (
                      <Button color="info" className="px-4 py-2 rounded fs-6 fw-semibold" onClick={handleAddItem} size="lg">
                        ➕ Add Item
                      </Button>
                    )}
                  </div>

                  <h3 ref={itemsRef} className='my-4 text-primary '>Invoice Items</h3>
                  <InvoiceItems
                    items={invoiceData.items}
                    fakeItems={fakeItems}
                    role={role}
                    invoiceData={invoiceData}
                    selectedFirmId={selectedFirmId}
                    removeItem={removeItem}
                    companyData={companyData}
                    setInvoiceData={setInvoiceData}
                  />

                  {invoiceData.items.length !== 0 && (
                    <FormGroup style={{ position: 'sticky', bottom: '0', zIndex: 10, background: 'white', paddingTop: '10px' }}>
                      <div className="row d-flex justify-content-center justify-content-lg-evenly gap-2 gap-lg-0">
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                          <Button type="submit" color="primary" className="px-4 py-2 rounded fs-6 fw-semibold">Submit</Button>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                          <Button type="button" color="info" className="px-4 py-2 rounded fs-6 fw-semibold" onClick={toggleCompanyModal}>
                            View Company Details
                          </Button>
                        </div>
                        <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                          <Button type="button" color="danger" className="px-4 py-2 rounded fs-6 fw-semibold" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </FormGroup>
                  )}
                </Form>
              </CardBody>
            </Card>

            <CompanyModal
              isOpen={isCompanyModalOpen}
              toggle={toggleCompanyModal}
              invoiceData={invoiceData}
              handleInputChange={handleInputChange}
              handleAddressChange={handleAddressChange}
              removeAddress={removeAddress}
            />

            <Card className="mt-4">
              <CardBody>
                <LayoutSelector2
                  type="invoice"
                  layoutOptions={layoutOptions.invoice}
                  selectedLayout={selectedInvoiceLayout}
                  onChangeLayout={handleLayoutChange}
                  onPreviewLayout={handleInvoicePreview}
                  previewButtonLabel="Preview"
                />
              </CardBody>
            </Card>

            {selectedInvoiceLayout === "layout1" && <PrintFormat ref={printRef} invoiceData={invoiceData} fakeItems={fakeItems} companyData={companyData} />}
            {selectedInvoiceLayout === "layout2" && <PrintFormat2 ref={printRef} invoiceData={invoiceData} companyData={companyData} terms={termsFormat2} onTermsChange={setTermsFormat2} />}
            {selectedInvoiceLayout === "layout3" && <PrintFormat3 ref={printRef} invoiceData={invoiceData} companyData={companyData} terms={termsFormat3} onTermsChange={setTermsFormat3} />}
          </>
        )}
      </Container>
    </div>
  );
};

export default CreateInvoiceTrader;
