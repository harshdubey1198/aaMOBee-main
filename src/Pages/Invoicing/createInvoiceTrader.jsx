import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Container, Card, CardBody, FormGroup, Row } from 'reactstrap';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import InvoiceInputs from '../../components/InvoicingComponents/InvoiceInputs';
import axios from 'axios';
import { validatePhone } from '../Utility/FormValidation';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import PrintFormat from '../../components/InvoicingComponents/printFormat';
import PrintFormat2 from '../../components/InvoicingComponents/printFormat2';
import PrintFormat3 from '../../components/InvoicingComponents/printFormat3';
import CompanyModal from '../../components/InvoicingComponents/companyModal';
import InvoiceItems from '../../components/InvoicingComponents/InvoiceItems';
import axiosInstance from '../../utils/axiosInstance';
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
  const firmId = authuser?.response?.adminId;
  const role = authuser?.response?.role;
  const createdBy = authuser?.response?._id;
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;
  const [selectedInvoiceLayout, setSelectedInvoiceLayout] = useState("layout1"); // default

  useEffect(() => {
    const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
    if (defaultFirm && !selectedFirmId) {
      setSelectedFirmId(defaultFirm.firmId);
    }
  }, []);

  useEffect(() => {
    if (firmId || selectedFirmId) {
      console.log("selectedFirmId", selectedFirmId);
    }
  }, [firmId, selectedFirmId]);

  const [invoiceData, setInvoiceData] = useState({
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
  const fetchInventoryItems = async () => {
    try {
      const idToUse = role === "client_admin" ? selectedFirmId : firmId;
      // console.log("idToUse", idToUse);
      if (!idToUse) return;
      const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/inventory/get-items/${idToUse}`);
      setFakeItems(response.data || []);
      // console.log("response", response.data);

    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };
  const fetchCompanyDetails = async () => {
    try {
      const idToUse = role === "client_admin" ? selectedFirmId : firmId;
      if (!idToUse) return;
      const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/auth/getfirm/${idToUse}`);
      const companyDetails = response[0];
      console.log("companyDetails", companyDetails);
      if (companyDetails) {
        const companyAddress = companyDetails.address ? companyDetails.address : [{ h_no: "", nearby: "", zip_code: "", district: "", state: "", city: "", country: "" }];

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
    if (savedLayout) {
      setSelectedInvoiceLayout(savedLayout);
    }
  }, []);

  // Add this one below the above hooks
  useEffect(() => {
    if (invoiceData.items.length === 0) {
      setIsAddItemVisible(true);
    }
  }, [invoiceData.items]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoiceData(prevData => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      setInvoiceData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddress = [...invoiceData.companyAddress];
    updatedAddress[index][name] = value;
    setInvoiceData(prevState => ({ ...prevState, companyAddress: updatedAddress }));
  };

  const removeAddress = (index) => {
    const updatedAddress = [...invoiceData.companyAddress];
    updatedAddress.splice(index, 1);
    setInvoiceData(prevState => ({ ...prevState, companyAddress: updatedAddress }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoiceData(prevState => ({
          ...prevState,
          companyLogo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setInvoiceData(prevData => ({
      ...prevData,
      items: [...prevData.items, { name: '', variant: '', quantity: 1, price: 0, discount: 0 }]
    }));

    // Hide the button after first click
    setIsAddItemVisible(false);
  };


  const removeItem = (index) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    setInvoiceData(prevData => ({ ...prevData, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    const invoicePayload = {
      customer: {
        firstName: invoiceData.firstName,
        lastName: invoiceData.lastName,
        email: invoiceData.customerEmail,
        mobile: invoiceData.customerPhone,
        address: {
          h_no: invoiceData.customerAddress.h_no,
          city: invoiceData.customerAddress.city,
          state: invoiceData.customerAddress.state,
          zip_code: invoiceData.customerAddress.zip_code,
          country: invoiceData.customerAddress.country,
          nearby: invoiceData.customerAddress.nearby,
          district: invoiceData.customerAddress.district,
        },
      },
      items: invoiceData.items.map(item => ({
        itemId: item.itemId,
        selectedVariant: item.selectedVariant && item.selectedVariant.map(variant => ({
          variationType: variant.variationType,
          optionLabel: variant.optionLabel,
          price: variant.price,
          stock: variant.stock,
          sku: variant.sku,
          barcode: variant.barcode,
        })),
        quantity: item.quantity,
        sellingPrice: item.price,
        discount: item.discount || 0,
        tax: item.tax || 0,
      })),
      invoiceDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      amountPaid: invoiceData.amountPaid,
      firmId: idToUse,
      createdBy: authuser?.response?._id,
      invoiceType: invoiceData.invoiceType,
      invoiceSubType: invoiceData.invoiceSubType,
      invoiceLayout: selectedInvoiceLayout,
      notes: 'Please pay by due date.'

    };
    console.log("Sending invoice data", invoicePayload)

    axiosInstance.post(
      `${process.env.REACT_APP_URL}/invoice/create-invoice`,
      invoicePayload,

    )
      .then(response => {
        toast.success(response.message);
        fetchInventoryItems();
        setInvoiceData({
          companyName: "",
          companyAddress: [{ h_no: "", nearby: "", zip_code: "", district: "", state: "", city: "", country: "" }],
          companyLogo: "",
          companyPhone: "",
          companyEmail: "",
          gstin: "",
          bankName: "",
          IFSCCode: "",
          accountNumber: "",
          branchName: "",
          firstName: "",
          lastName: "",
          customerName: '',
          customerAddress: [{ h_no: "", nearby: "", zip_code: "", district: "", state: "", city: "", country: "" }],
          customerEmail: '',
          customerPhone: '',
          date: '',
          country: 'India',
          items: [],
          paymentLink: '',
          invoiceType: '',
          invoiceSubType: '',
          amountPaid: '',
        });
        navigate('/all-invoices');
      })
      .catch(error => {
        console.log(error);
        toast.error("Failed to create invoice");
      });
  };

  const printInvoice = useReactToPrint({
    content: () => printRef.current
  });

  const handleLayoutChange = (type, layoutId) => {
    if (type === "invoice") {
      setSelectedInvoiceLayout(layoutId);
      localStorage.setItem("selectedInvoiceLayout", layoutId);
    }
  };
  const handleInvoicePreview = (layoutId) => {
    setSelectedInvoiceLayout(layoutId); // just simulate preview
    // toast.info(`Preview for ${layoutId} selected.`);
  };

  useEffect(() => {
    const savedLayout = localStorage.getItem("selectedInvoiceLayout");
    if (savedLayout) {
      setSelectedInvoiceLayout(savedLayout);
    }
  }, []);

  const handleAddItem = () => {
    addItem(); // your original logic
    setTimeout(() => {
      itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100); // wait a bit for the item to render
  }

  const handleCancel = () => {
    setInvoiceData({
      companyName: "",
      companyAddress: [
        {
          h_no: "",
          nearby: "",
          zip_code: "",
          district: "",
          state: "",
          city: "",
          country: "",
        },
      ],
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
      customerAddress: {
        h_no: "",
        nearby: "",
        district: "",
        city: "",
        state: "",
        country: "",
        zip_code: "",
      },
      customerPhone: "",
      customerEmail: "",
      date: "",
      country: "India",
      items: [],
      createdBy: createdBy, // make sure createdBy is available in scope
      paymentLink: "",
      taxComponents: [],
      id: "",
      varSelPrice: "",
      overallAmount: "",
    });

    // Optionally reset other related state (firm dropdown, file uploads, etc.)
    setSelectedFirmId(null);
    // setUploadedFiles([]);
  };



  return (

    <div className='page-content'>
      <Container>
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Create Invoice" />
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
              />

              <div className="col-lg-3 col-md-4 col-sm-12 mb-3  justify-content-center">
                {isAddItemVisible && (
                  <Button
                    color="info"
                    className="px-4 py-2 rounded fs-6 fw-semibold"
                    // onClick={addItem}
                    onClick={handleAddItem}
                    size="lg"
                  >
                    ➕ Add Item
                  </Button>
                )}
              </div>


              <h3 ref={itemsRef} className='my-4 text-primary '>Invoice Items</h3>
              <InvoiceItems
                items={invoiceData.items}
                fakeItems={fakeItems}
                role={role}
                invoiceData={invoiceData || { items: [], amountPaid: 0 }}
                selectedFirmId={selectedFirmId}
                removeItem={removeItem}
                companyData={companyData}
                setInvoiceData={setInvoiceData}
              />
              {invoiceData.items.length !== 0 && (
                <FormGroup
                  style={{
                    position: 'sticky',
                    bottom: '0',
                    zIndex: 10,
                    background: 'white',
                    paddingTop: '10px',
                  }}
                >
                  <div className="row d-flex justify-content-center justify-content-lg-evenly gap-2 gap-lg-0">
  <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
    <Button className="px-4 py-2 rounded fs-6 fw-semibold" type="submit" color="primary">
      Submit
    </Button>
  </div>

  <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
    <Button
      className="px-4 py-2 rounded fs-6 fw-semibold"
      type="button"
      color="info"
      onClick={toggleCompanyModal}
    >
      View Company Details
    </Button>
  </div>

  <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
    <Button
      className="px-4 py-2 rounded fs-6 fw-semibold"
      type="button"
      color="danger"
      onClick={handleCancel}
    >
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


        {selectedInvoiceLayout === "layout1" && (
          <PrintFormat
            ref={printRef}
            invoiceData={invoiceData}
            fakeItems={fakeItems}
            companyData={companyData}
          />
        )}

        {selectedInvoiceLayout === "layout2" && (
          <PrintFormat2
            ref={printRef}
            invoiceData={invoiceData}
            companyData={companyData}
          />
        )}

        {selectedInvoiceLayout === "layout3" && (
          <PrintFormat3
            ref={printRef}
            invoiceData={invoiceData}
            companyData={companyData}
          />
        )}
      </Container>

    </div>




  );
};

export default CreateInvoiceTrader;
