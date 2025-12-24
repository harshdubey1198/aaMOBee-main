import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import InvoicePreview2 from "./InvoicePreview2";
import InvoicePreview from "./InvoicePreview";
import InvoiceFields from "./invoiceFields";
import { getCompanyData, createBilling } from "../../../apiServices/service";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "reactstrap";
import LayoutSelector from "../../../components/FirmBranding/LayoutSelector";
import { dummyBill, layoutOptions } from "../../../constants/dummyLayoutData";
import BillPreviewModal from "../../../Modal/BillPreviewModal";
import { BackButton } from "../../../components/Common/BackButton";

function Billing() {
  const [layouts, setLayouts] = useState({ bill: "layout1" });
  const [previewLayoutType, setPreviewLayoutType] = useState("layout1");
  const [previewType, setPreviewType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [companyData, setCompanyData] = useState({});
  const [invoiceData, setInvoiceData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    customerAddress: {
      h_no: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
    },
    items: [
      {
        itemName: "",
        price: 0,
        quantity: 0,
        tax: 0,
      },
    ],
    overallDiscount: 0,
    discountType: "percentage",
    notes: "",
    status: "draft",
  });

  const navigate = useNavigate();
  const authuser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const createdBy = authuser?._id;
  const role = authuser?.role;
  const firmIdFromUser = authuser?.adminId;

  // ✅ If client admin → use firm from FirmSwitcher, else default
  const idToUse =
    role === "client_admin"
      ? selectedFirmId ||
        JSON.parse(localStorage.getItem("defaultFirm"))?.firmId ||
        ""
      : firmIdFromUser;

  // Update invoiceData whenever firm changes
  useEffect(() => {
    setInvoiceData((prev) => ({
      ...prev,
      firmId: idToUse,
      createdBy,
    }));
  }, [idToUse]);

  // ✅ Fetch company data
  const fetchCompanyData = async () => {
    try {
      if (!idToUse) return;
      const response = await getCompanyData(idToUse);
      setCompanyData(response[0] || {});
    } catch (error) {
      console.error("Error fetching company:", error);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [idToUse]);

  // ✅ Handle layout switch
  const handleLayoutChange = (type, layoutId) => {
    setLayouts((prev) => ({ ...prev, [type]: layoutId }));
    localStorage.setItem(
      `selected${type.charAt(0).toUpperCase() + type.slice(1)}Layout`,
      layoutId
    );
  };

  useEffect(() => {
    const savedLayout = localStorage.getItem("selectedBillLayout") || "layout1";
    setLayouts({ bill: savedLayout });
  }, []);

  // ✅ Handle invoice creation
  const handleCreateInvoice = async () => {
    if (!idToUse) {
      toast.info("Please select a business first!");
      return;
    }

    try {
      const payload = {
        ...invoiceData,
        firmId: idToUse,
        createdBy,
        billLayout: layouts.bill,
      };

      const response = await createBilling(payload);
      if (response?.data?.message) {
        toast.success(response?.data?.message);
        setSelectedBill(response?.data?.data);
        setPreviewLayoutType(layouts.bill);
        setPreviewType("bill");
        setIsModalOpen(true);
      } else {
        toast.error(response?.data?.message || "Failed to create invoice.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("An error occurred while generating the invoice.");
    }
  };

  // ✅ UI rendering
  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Invoicing" breadcrumbItem="Retail Billing" />

        {!idToUse ? (
          <div className="d-flex justify-content-center mt-5">
            <Card className="p-4 text-center" style={{ maxWidth: "600px" }}>
              <h4 className="text-danger">Business Setup Required</h4>
              <p>
                Please create or select a business to continue. Without a
                business, billing and product management are disabled.
              </p>
              <Button
                color="primary"
                size="sm"
                style={{ width: "120px" }}
                onClick={() => navigate("/add-business")}
              >
                Add Business
              </Button>
            </Card>
          </div>
        ) : (
          <>
            <div className="button-panel mb-3">
              {role === "client_admin" && (
                <FirmSwitcher
                  selectedFirmId={selectedFirmId}
                  onSelectFirm={setSelectedFirmId}
                />
              )}
              <Button
                color="primary"
                className="p-2"
                style={{
                  maxHeight: "27.13px",
                  fontSize: "10.5px",
                  lineHeight: "1",
                }}
                onClick={() => navigate("/retail-bills")}
              >
                Retail Bills
              </Button>
            </div>

            <div className="d-flex flex-lg-row flex-md-row flex-column justify-content-between gap-3">
              <div style={{ flex: 1 }}>
                <InvoiceFields
                  idToUse={idToUse}
                  invoiceData={invoiceData}
                  setInvoiceData={setInvoiceData}
                  onGenerateInvoice={handleCreateInvoice}
                />
              </div>

              <div style={{ flex: 1, maxWidth: "600px" }}>
                <div className="mb-3">
                  <LayoutSelector
                    type="bill"
                    layoutOptions={layoutOptions.bill}
                    selectedLayout={layouts.bill}
                    onChangeLayout={handleLayoutChange}
                    onPreviewLayout={(layoutId) => {
                      handleLayoutChange("bill", layoutId);
                      setSelectedBill(invoiceData);
                      setPreviewLayoutType(layoutId);
                      setPreviewType("bill");
                      setIsModalOpen(true);
                    }}
                    previewButtonLabel="Preview"
                  />
                </div>

                <div style={{ height: "60vh", overflowY: "auto" }}>
                  {layouts.bill === "layout1" && (
                    <InvoicePreview
                      invoiceData={invoiceData}
                      companyData={companyData}
                      isPreview={true}
                      layoutType="layout1"
                      onGenerateInvoice={handleCreateInvoice}
                    />
                  )}
                  {layouts.bill !== "layout1" && (
                    <InvoicePreview2
                      invoiceData={invoiceData}
                      companyData={companyData}
                      isPreview={true}
                      layoutType={layouts.bill}
                      onGenerateInvoice={handleCreateInvoice}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {isModalOpen && (
          <BillPreviewModal
            bill={selectedBill}
            companyData={companyData}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedBill(null);
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
