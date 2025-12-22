import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Row, Col } from 'reactstrap';
import InvoicePreview2 from '../Pages/Invoicing/Billing/InvoicePreview2';
import InvoicePreview from '../Pages/Invoicing/Billing/InvoicePreview';

function BillPreviewModal({ bill, onClose, layoutType, layoutId, companyData: incomingCompanyData }) {
  const companyData = {
    avatar: incomingCompanyData?.avatar || 'https://via.placeholder.com/100x100.png?text=Logo',
    companyTitle: incomingCompanyData?.companyTitle || 'Company Name',
    email: incomingCompanyData?.email || 'example@example.com',
    companyMobile: incomingCompanyData?.companyMobile || '',
    currency: incomingCompanyData?.currency || 'INR',
    address: Array.isArray(incomingCompanyData?.address) ? incomingCompanyData.address : [],
    registeredTaxationDetail: incomingCompanyData?.registeredTaxationDetail || [],
    bankDetails: layoutId === 'layout3' ? (incomingCompanyData?.bankDetails || []) : []
  };

  // console.log(companyData?.companyTitle);
  console.log(bill);
  if (!bill) return null;

  return (
    <Modal isOpen={!!bill} toggle={onClose} size="lg">
      <ModalHeader toggle={onClose}>Bill Preview</ModalHeader>
      <ModalBody>

        {layoutType === 'bill' && layoutId === 'layout1' && (
          <InvoicePreview
            invoiceData={bill}
            companyData={companyData}
            isPreview={true}
          />
        )}
        {layoutType === 'bill' && layoutId === 'layout2' && (
          <InvoicePreview2
            invoiceData={bill}
            companyData={companyData}
            isPreview={true}
          />
        )}
        {layoutType === 'bill' && layoutId === 'layout3' && (
          <InvoicePreview2
            invoiceData={bill}
            companyData={companyData}
            isPreview={true}
            layoutType={layoutId}
          />
        )}

      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onClose}>Close</Button>
      </ModalFooter>
    </Modal>
  );
}

export default BillPreviewModal;
