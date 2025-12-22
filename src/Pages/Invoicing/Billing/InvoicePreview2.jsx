import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import LogoBig from '../../Portfolio-aaMOBee/assets/Logo-big.webp'

function InvoicePreview2({ invoiceData, companyData, onGenerateInvoice, layoutType }) {
  const invoiceRef = useRef();

  const currency = companyData?.currency || invoiceData?.invoiceCurrency || 'INR';



  // Calculate totals for each item (price, tax, discount)
  const calculateItemTotal = (item) => {
    const itemPrice = item.quantity * (item.price); // Price calculation
    const itemTaxAmount = (itemPrice * item.tax) / 100; // Tax calculation
    const itemTotal = itemPrice + itemTaxAmount - (item.discount || 0); // Total after tax and discount
    return { itemPrice, itemTaxAmount, itemTotal };
  };

  // Calculate totals for the entire invoice
  const calculateAmounts = () => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    invoiceData.items.forEach(item => {
      const { itemPrice, itemTaxAmount, itemTotal } = calculateItemTotal(item);
      subtotal += itemPrice;
      totalTax += itemTaxAmount;
      totalDiscount += item.discount || 0;
    });

    // Apply the overall discount type (percentage or flat)
    let discountAmount = 0;
    const rawDiscount = parseFloat(invoiceData.overallDiscount) || 0;

    if (invoiceData.discountType === 'percentage') {
      discountAmount = (subtotal * rawDiscount) / 100;
    } else if (invoiceData.discountType === 'flat') {
      discountAmount = rawDiscount;
    }


    // Subtract discount amount from subtotal
    const grandTotal = subtotal + totalTax - totalDiscount - discountAmount;

    return {
      subtotal,
      totalTax,
      totalDiscount,
      discountAmount,
      grandTotal
    };
  };

  const { subtotal, totalTax, totalDiscount, discountAmount, grandTotal } = calculateAmounts();

  // PDF Download
  const downloadPDF = async () => {
    if (!invoiceData || !invoiceData.billNumber) {
      alert("Bill Number missing!");
      return;
    }

    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoiceData.billNumber}.pdf`);
  };

  // Handle Print
  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const win = window.open('', '', 'height=800,width=600');
    win.document.write('<html><head><title>Print Invoice</title></head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  // Company Address Handling
  const companyAddress = companyData?.address || []; // Ensure address exists in companyData

  return (
    <div className="d-flex flex-column justify-content-start align-items-center" style={{ width: '100%', overflowY: 'auto' }}>
      <div ref={invoiceRef} className="card p-4 border rounded position-relative" style={{ width: '100%' }}>
        <div className="row mb-4 d-flex flex-column flex-md-row text-center text-md-start">
          {/* Customer Info - Left (Desktop) */}
          <div className="col-12 col-md-4 order-2 order-md-1 mb-3 mb-md-0 text-md-start">
            <h4 className="text-center text-md-start w-100" style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all' }}>Customer Details:</h4>
          <div style={{  margin: '10px 0', fontSize: '14px' }}>
          Bill Date: {invoiceData?.billDate
            ? new Date(invoiceData.billDate).toLocaleDateString('en-GB')
            : new Date().toLocaleDateString('en-GB')}

          {invoiceData?.billNumber && (
            <span style={{ marginLeft: '20px' }}>
              Bill No: {invoiceData.billNumber}
            </span>
          )}
        </div>
            <p>Name: {invoiceData?.customerName}</p>
            {/* <p>
              {invoiceData?.customerAddress?.h_no}, {invoiceData?.customerAddress?.city},{" "}
              {invoiceData?.customerAddress?.state}, {invoiceData?.customerAddress?.country},{" "}
              {invoiceData?.customerAddress?.zip_code}
            </p> */}
            <p>Phone: {invoiceData?.customerPhone}</p>
            {/* <p>Email: {invoiceData?.customerEmail}</p> */}
          </div>

          {/* Logo - Center (Desktop) */}
          <div className="col-12 col-md-4 order-1 order-md-2 d-flex justify-content-center align-items-center mb-3 mb-md-0">
            {(invoiceData?.companyLogo || companyData?.avatar) && (
              <img
                src={companyData?.avatar || invoiceData?.companyLogo}
                alt="Company Logo"
                style={{ height: "60px", maxWidth: "100px" }}
              />
            )}
          </div>

          {/* Company Info - Right (Desktop) */}
          <div className="col-12 col-md-4 order-3 order-md-3 text-md-end">
            <p style={{ fontWeight: "700", fontSize: "20px", color:"#1A1A1A"}}>
              {companyData?.companyTitle || "Company Name"}
            </p>
            {/* <p>Email: {companyData?.email}</p> */}
            <p>Phone: {companyData?.companyMobile}</p>

            {/* Company Address */}
            {companyAddress.length > 0 && (
              <div>
                {companyAddress.map((address, index) => (
                  <div key={index}>
                    <p className="my-1">
                      {[address?.h_no, address?.nearby, address?.district]
                        .map(item => item?.trim())
                        .filter(item => item && /[a-zA-Z]/.test(item))
                        .join(", ")}
                    </p>
                    <p className="my-1">
                      {[address?.city, address?.state, address?.country, address?.zip_code]
                        .map(item => item?.trim())
                        .filter(item => item && /[a-zA-Z]/.test(item))
                        .join(", ")}
                    </p>
                  </div>
                ))}
                {companyData?.registeredTaxationDetail?.length > 0 &&
                  companyData.registeredTaxationDetail
                    .filter(detail => detail?.toShow)
                    .map((detail, idx) => (
                      <p key={idx} className="my-1">
                        <b>{detail.fieldName}:</b> {detail.fieldValue}
                      </p>
                    ))}
              </div>
            )}
          </div>
        </div>


        {/* Table Section */}
        <div className="table-responsive mb-4">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => {
                const { itemPrice, itemTaxAmount, itemTotal } = calculateItemTotal(item);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.itemName || "N/A"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price.toFixed(2)}</td>
                    <td>{itemPrice.toFixed(2)}</td>
                    <td>{itemTaxAmount.toFixed(2)}</td>
                    <td>{itemTotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
         <div style={{ textAlign: 'center' }}>Thanks & Visit Again!!</div>


        <div className="row bg-light p-4 m-0">
          {/* Show LogoBig only if layoutType is not 'layout3' */}
          {layoutType !== "layout3" && (
            <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start align-items-center mb-3 mb-md-0">
              <img src={LogoBig} alt="aaMOBee Logo" style={{ height: "40px", opacity: 0.2 }} />
            </div>
          )}

          {/* Show bank details only if layoutType is 'layout3' */}
          {layoutType === "layout3" && (
            <div className="col-md-6">
              <h5>Bank Details</h5>
              {Array.isArray(companyData?.bankDetails) && companyData.bankDetails.length > 0 ? (
                companyData.bankDetails.map((bank, idx) => (
                  <div key={idx} className="mb-2">
                    <p><strong>Bank Name:</strong> {bank.bankName}</p>
                    <p><strong>Account Holder:</strong> {bank.accountHolder}</p>
                    <p><strong>Account Number:</strong> {bank.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {bank.ifscCode}</p>
                    <p><strong>Branch Name:</strong> {bank.branchName}</p>
                  </div>
                ))
              ) : (
                <p>No bank details available.</p>
              )}
            </div>
          )}

          {/* Always show payment summary */}
          <div className="col-md-6 text-end">
            <h5>Payment Summary</h5>
            <p><strong>Subtotal:</strong> {currency} {subtotal.toFixed(2)}</p>
            <p><strong>Total Tax:</strong> {currency} {totalTax.toFixed(2)}</p>
            <p><strong>Overall Discount (Before Tax):</strong> {currency} {discountAmount.toFixed(2)}</p>
            <p><strong>Grand Total:</strong> {currency} {grandTotal.toFixed(2)}</p>
          </div>
        </div>


      </div>

      <div className="text-end my-2 d-flex gap-2">
        {invoiceData?.billNumber && (
          <>
            <i onClick={downloadPDF} className="mdi mdi-download btn btn-info" style={{ cursor: 'pointer', fontSize: "18px" }}></i>
            <i onClick={handlePrint} className="mdi mdi-printer btn btn-primary" style={{ cursor: 'pointer', fontSize: "18px" }}></i>
          </>
        )}
        {/* {!invoiceData?.billNumber && (
          <i onClick={onGenerateInvoice} className="mdi mdi-check btn btn-success" style={{ cursor: 'pointer', fontSize: '18px' }}></i>
        )} */}
      </div>
    </div>
  );
}

export default InvoicePreview2;
