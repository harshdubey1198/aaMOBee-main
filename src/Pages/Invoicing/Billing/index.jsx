import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import FirmSwitcher from '../../Firms/FirmSwitcher';
import InvoicePreview2 from './InvoicePreview2';
import InvoicePreview from './InvoicePreview';
import InvoiceFields from './invoiceFields';
import { getCompanyData, createBilling } from '../../../apiServices/service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import LayoutSelector from "../../../components/FirmBranding/LayoutSelector";
import { dummyBill, layoutOptions } from '../../../constants/dummyLayoutData';
import BillPreviewModal from '../../../Modal/BillPreviewModal';
import { BackButton } from '../../../components/Common/BackButton';


function Billing() {
  const [layouts, setLayouts] = useState({ bill: 'layout1' });
  const [previewLayoutType, setPreviewLayoutType] = useState('layout1');
  const [previewType, setPreviewType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  const handleLayoutChange = (type, layoutId) => {
    setLayouts(prev => ({ ...prev, [type]: layoutId }));
    localStorage.setItem(`selected${type.charAt(0).toUpperCase() + type.slice(1)}Layout`, layoutId);
  };

  useEffect(() => {
    const savedLayout = localStorage.getItem('selectedBillLayout') || 'layout1';
    setLayouts({ bill: savedLayout });
  }, []);

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [companyData, setCompanyData] = useState({});
  const authuser = JSON.parse(localStorage.getItem("authUser")).response;
  const createdBy = authuser._id;
  const firmId = authuser.adminId;
  const role = authuser.role;
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: {
      h_no: '',
      city: '',
      state: '',
      zip_code: '',
      country: ''
    },
    items: [
      {
        itemName: '',
        price: 0,
        quantity: 0,
        tax: 0
      }
    ],
    overallDiscount: 0,
    discountType: 'percentage',
    notes: '',
    status: 'draft',
    firmId: idToUse,
    createdBy: createdBy,
  });

  const fetchCompanyData = async () => {
    try {
      const response = await getCompanyData(idToUse);
      setCompanyData(response[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [idToUse]);

  const handleCreateInvoice = async () => {
    try {
      const payload = {
        ...invoiceData,
        firmId: idToUse,
        createdBy: createdBy,
        billLayout: layouts.bill
      };
      // console.log("Sending Bill data = ", payload);
      const response = await createBilling(payload);
      // console.log("response",response)
      if (response?.data?.message) {
        toast.success(response?.data?.message);
        setSelectedBill(response?.data?.data);
        setPreviewLayoutType(layouts.bill);
        setPreviewType("bill");
        setIsModalOpen(true);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while generating the invoice.");
    }
  };

  const navigate = useNavigate();

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Invoicing" breadcrumbItem="Retail Billing" />

        <div className="button-panel">
   
          {role === "client_admin" && (
            <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={setSelectedFirmId}
            />
          )}
          <Button color="primary" className="p-2" style={{ maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }} onClick={() => navigate('/retail-bills')}>
            Retail Bills
          </Button>
        </div>

        <div className="d-flex flex-lg-row flex-md-row flex-column justify-content-between gap-3">
          <div style={{ flex: 1 }}>
            <InvoiceFields idToUse={idToUse} invoiceData={invoiceData} setInvoiceData={setInvoiceData} onGenerateInvoice={handleCreateInvoice} />
          </div>

          <div style={{ flex: 1, maxWidth: '600px' }}>
            <div className="mb-3">
              {/* <label><strong>Select Bill Layout:</strong></label> */}
              <div className="d-flex justify-content-center justify-content-lg-start gap-3">
                <LayoutSelector
                  type="bill"
                  layoutOptions={layoutOptions.bill}
                  selectedLayout={layouts.bill}
                  onChangeLayout={handleLayoutChange}
                  onPreviewLayout={(layoutId) => {
                    handleLayoutChange('bill', layoutId);
                    setSelectedBill(invoiceData);
                    setPreviewLayoutType(layoutId);
                    setPreviewType("bill");
                    setIsModalOpen(true);
                  }}
                  previewButtonLabel="Preview"
                   />
              </div>
            </div>

            <div style={{ height: '60vh', overflowY: 'auto' }}>
              {layouts.bill === 'layout1' && (
                <InvoicePreview
                  invoiceData={invoiceData}
                  companyData={companyData}
                  isPreview={true}
                  layoutType="layout1"
                  onGenerateInvoice={handleCreateInvoice}
                />
              )}
              {layouts.bill === 'layout2' && (
                <InvoicePreview2
                  invoiceData={invoiceData}
                  companyData={companyData}
                  isPreview={true}
                  layoutType="layout2"
                  onGenerateInvoice={handleCreateInvoice}
                />
              )}
              {layouts.bill === 'layout3' && (
                <InvoicePreview2
                  invoiceData={invoiceData}
                  companyData={companyData}
                  isPreview={true}
                  layoutType="layout3"
                  onGenerateInvoice={handleCreateInvoice}
                />
              )}
            </div>
          
          </div>
        </div>
        {isModalOpen && (
          <BillPreviewModal
            bill={selectedBill}
            companyData={companyData}
             onClose={() => {
                setIsModalOpen(false);
                setSelectedBill(null);
                setInvoiceData({
                  customerName: '',
                  customerPhone: '',
                  customerEmail: '',
                  customerAddress: {
                    h_no: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    country: ''
                  },
                  items: [{ itemName: '', price: 0, quantity: 0, tax: 0 }],
                  overallDiscount: 0,
                  discountType: 'percentage',
                  notes: '',
                  status: 'draft',
                  firmId: idToUse,
                  createdBy: createdBy,
                });
              }}
            layoutType="bill"
            layoutId={previewLayoutType}
          />
        )}
      </div>
    </React.Fragment>
  );
}

export default Billing;
