import React, { useRef } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import ViewFormat from "../components/InvoicingComponents/viewFormat"; 
import ViewFormat2 from "../components/InvoicingComponents/viewFormat2";
import ViewFormat3 from "../components/InvoicingComponents/viewFormat3"; 
import { useReactToPrint } from "react-to-print";

const InvoicePreviewModal = ({ isOpen, onClose, invoiceData, companyData, layoutId = "layout1" }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const renderLayout = () => {
      const props = { ref: componentRef, invoiceData };
    // if you passed companyData, hand it along; otherwise ViewFormat3 will still see invoiceData.firmId
    if (companyData) props.companyData = companyData;
    switch (layoutId) {
      case "layout1":
        return <ViewFormat ref={componentRef} invoiceData={invoiceData} />;
      case "layout2":
        return <ViewFormat2 ref={componentRef} invoiceData={invoiceData} />;
      case "layout3":
        return <ViewFormat3 ref={componentRef} invoiceData={invoiceData} />;
        default: return null;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={onClose} size="xl" style={{ maxWidth: "900px", width: "100%" }}>
      <ModalHeader toggle={onClose}>Invoice Preview</ModalHeader>
      <ModalBody style={{ maxHeight: "80vh", overflowY: "auto", backgroundColor: "#f4f4f4" }}>
        {renderLayout()}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default InvoicePreviewModal;
