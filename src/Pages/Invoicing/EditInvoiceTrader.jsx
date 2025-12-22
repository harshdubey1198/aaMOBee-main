import React, { useState, useEffect, useRef } from 'react';
import { Button, Form, Container, Card, CardBody, FormGroup, Row } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

import Breadcrumbs from '../../components/Common/Breadcrumb';
import InvoiceInputs from '../../components/InvoicingComponents/InvoiceInputs';
import InvoiceItems from '../../components/InvoicingComponents/InvoiceItems';
import PrintFormat from '../../components/InvoicingComponents/printFormat';
import PrintFormat2 from '../../components/InvoicingComponents/printFormat2';
import PrintFormat3 from '../../components/InvoicingComponents/printFormat3';
import LayoutSelector2 from "../../components/FirmBranding/LayoutSelector2";
import { layoutOptions } from '../../constants/dummyLayoutData';

import { getInvoiceById, updateInvoiceById } from '../../apiServices/service'; 

const EditInvoiceTrader = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();
    const authuser = JSON.parse(localStorage.getItem("authUser"));


  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const createdBy = authUser?.response?._id;
  const firmId = authUser?.response?.adminId;
  const role = authUser?.response?.role;
  const [isAddItemVisible, setIsAddItemVisible] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);
  const [companyData, setCompanyData] = useState({});
  const [fakeItems, setFakeItems] = useState([]);
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [selectedInvoiceLayout, setSelectedInvoiceLayout] = useState("layout1");

  const idToUse = role === 'client_admin' ? selectedFirmId : firmId;

  const fetchInvoiceDetails = async () => {
    try {
      const res = await getInvoiceById(invoiceId);
      let data = res.data;
      console.log("res" , res);
      

      // Split name
      const [firstName = '', ...rest] = (data.customerName || "").trim().split(" ");
      const lastName = rest.join(" ");
      const issueDate = data.issueDate ? data.issueDate.slice(0, 10) : "";
      const dueDate = data.dueDate ? data.dueDate.slice(0, 10) : "";

      setInvoiceData({
        ...data,
        firstName,
        lastName,
        dueDate,
        issueDate
      });
      setSelectedInvoiceLayout(res?.invoiceLayout || "layout1");
      setIsAddItemVisible(!data.items || data.items.length === 0);
    } catch (error) {
      toast.error("Error loading invoice");
    }
  };

  const removeItem = (index) => {
    const newItems = [...invoiceData.items];
    newItems.splice(index, 1);
    setInvoiceData(prevData => ({ ...prevData, items: newItems }));
  };

  const fetchCompanyDetails = async () => {
    try {
      const id = role === "client_admin" ? selectedFirmId : firmId;
      if (!id) return;
      const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/auth/getfirm/${id}`);
      setCompanyData(res[0]);
    } catch (error) {
      console.error("Company fetch error:", error);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const id = role === "client_admin" ? selectedFirmId : firmId;
      const res = await axiosInstance.get(`${process.env.REACT_APP_URL}/inventory/get-items/${id}`);
      setFakeItems(res.data || []);
    } catch (err) {
      console.log("Inventory fetch error", err);
    }
  };

  useEffect(() => {
    if (invoiceId) {
      fetchInvoiceDetails();
    }
    fetchCompanyDetails();
    fetchInventoryItems();
  }, [invoiceId, firmId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setInvoiceData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setInvoiceData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
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
      items: invoiceData.items.map((item, index) => {
        if (!item.price) {
          console.error(`❌ Missing sellingPrice for item at index ${index}:`, item);
        }

        return {
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
          sellingPrice: item.price, // ✅ Important field
          discount: item.discount || 0,
          tax: item.tax || 0,
        };
      }),
      invoiceDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      amountPaid: invoiceData.amountPaid,
      firmId: idToUse,
      createdBy: authuser?.response?._id,
      invoiceType: invoiceData.invoiceType,
      invoiceSubType: invoiceData.invoiceSubType,
      invoiceLayout: selectedInvoiceLayout,
      notes: 'Please pay by due date.',
    };

    console.log("📦 Payload to update invoice:", invoicePayload);

    await updateInvoiceById(invoiceId, invoicePayload);

    toast.success("Invoice updated successfully");
    navigate('/all-invoices');
  } catch (error) {
    console.error("❌ Error updating invoice:", error?.response?.data || error.message || error);
    toast.error("Failed to update invoice");
  }
};


  const handleLayoutChange = (type, layoutId) => {
    if (type === "invoice") {
      setSelectedInvoiceLayout(layoutId);
      localStorage.setItem("selectedInvoiceLayout", layoutId);
    }
  };

  const printInvoice = useReactToPrint({
    content: () => printRef.current
  });

  const addItem = () => {
    setInvoiceData(prevData => ({
      ...prevData,
      items: [...prevData.items, { name: '', variant: '', quantity: 1, price: 0, discount: 0 }]
    }));

    // Hide the button after first click
    setIsAddItemVisible(false);
  };
  if (!invoiceData) return <div className="text-center mt-5">Loading invoice...</div>;
  const handleAddItem = () => {
    addItem(); 
    // setTimeout(() => {
    //   itemsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // }, 100); 
  }

  return (
    <div className='page-content'>
      <Container>
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Edit Invoice" />
        <Card>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <InvoiceInputs
                invoiceData={invoiceData}
                selectedFirmId={selectedFirmId}
                setSelectedFirmId={setSelectedFirmId}
                handleInputChange={handleInputChange}
                setInvoiceData={setInvoiceData}
                companyData={companyData}
                printInvoice={printInvoice}
                removeItem={removeItem}
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
              <InvoiceItems
                items={invoiceData.items}
                fakeItems={fakeItems}
                isAddItemVisible={isAddItemVisible}
                role={role}
                invoiceData={invoiceData}
                selectedFirmId={selectedFirmId}
                setInvoiceData={setInvoiceData}
                companyData={companyData}
                removeItem={removeItem}
              />

              <FormGroup className="d-flex justify-content-center mt-4">
                <Button type="submit" color="primary">
                  💾 Update Invoice
                </Button>
              </FormGroup>
            </Form>
          </CardBody>
        </Card>

        <Card className="mt-4">
          <CardBody>
            <LayoutSelector2
              type="invoice"
              layoutOptions={layoutOptions.invoice}
              selectedLayout={selectedInvoiceLayout}
              onChangeLayout={handleLayoutChange}
              onPreviewLayout={setSelectedInvoiceLayout}
              previewButtonLabel="Preview"
            />
          </CardBody>
        </Card>

        {/* Preview print formats */}
        {selectedInvoiceLayout === "layout1" && (
          <PrintFormat ref={printRef} invoiceData={invoiceData} companyData={companyData} />
        )}
        {selectedInvoiceLayout === "layout2" && (
          <PrintFormat2 ref={printRef} invoiceData={invoiceData} companyData={companyData} />
        )}
        {selectedInvoiceLayout === "layout3" && (
          <PrintFormat3 ref={printRef} invoiceData={invoiceData} companyData={companyData} />
        )}
      </Container>
    </div>
  );
};

export default EditInvoiceTrader;
