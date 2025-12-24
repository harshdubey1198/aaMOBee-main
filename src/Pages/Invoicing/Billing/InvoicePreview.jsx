import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function InvoicePreview({ idToUse, invoiceData, companyData,layoutType ,onGenerateInvoice, isPreview = false }) {
  const invoiceRef = useRef();
  console.log("companyData", companyData);
  //   const downloadPDF = async () => {
  //     if (!invoiceData || !invoiceData.billNumber) {
  //       alert("Bill Number missing!");
  //       return;
  //     }

  //     const canvas = await html2canvas(invoiceRef.current);
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF();
  //     pdf.addImage(imgData, 'PNG', 5, 2);

  //     const fileName = `${invoiceData.billNumber}.pdf`;
  //     pdf.save(fileName);
  //   };

  const downloadPDF = () => {
    if (!invoiceData || !invoiceData.billNumber) {
      alert("Bill Number missing!");
      return;
    }

    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    const marginLeft = 15;
    const marginTop = 15;
    const contentWidth = pageWidth - (2 * marginLeft);

    // Draw outer border
    doc.rect(marginLeft, marginTop, contentWidth, doc.internal.pageSize.getHeight() - 2 * marginTop);

    let y = marginTop + 5;

    // Get the company logo
    const logo = companyData?.avatar || invoiceData?.companyLogo;

    const logoWidth = 30;  // Adjust width
    const logoHeight = 30; // Adjust height

    if (logo) {
      // Add logo to PDF (Centered)
      doc.addImage(logo, 'PNG', (pageWidth - logoWidth) / 2, y, logoWidth, logoHeight); // Adjust width and height if needed
      y += logoHeight + 5; // Leave space after logo
    }

    doc.setFontSize(14);
    doc.setFont('courier', 'bold');
    doc.text(companyData?.companyTitle || 'Company Name', pageWidth / 2, y, { align: 'center' });

    y += 10;

    doc.setFontSize(10);
    doc.setFont('courier', 'normal');

    companyData?.address?.forEach((address) => {
      doc.text(`${address?.h_no}, ${address?.nearby}, ${address?.district}`, pageWidth / 2, y, { align: 'center' });
      y += 5;
      doc.text(`${address?.city}, ${address?.state}, ${address?.country}, ${address?.zip_code}`, pageWidth / 2, y, { align: 'center' });
      y += 5;
    });

    y += 5;
    doc.text(`Bill Date: ${new Date(invoiceData.billDate).toLocaleDateString('en-GB')}    Bill No: ${invoiceData.billNumber}`, marginLeft + 5, y);
    y += 5;

    doc.line(marginLeft, y, pageWidth - marginLeft, y); // Draw line across the width
    y += 5;


    doc.text(`Name: ${invoiceData.customerName}`, marginLeft + 5, y);
    y += 6;
    doc.text(`Email: ${invoiceData.customerEmail}`, marginLeft + 5, y);
    y += 6;
    doc.text(`Address: ${invoiceData.customerAddress?.h_no}, ${invoiceData.customerAddress?.city}, ${invoiceData.customerAddress?.state}, ${invoiceData.customerAddress?.country}`, marginLeft + 5, y);
    y += 5;

    doc.line(marginLeft, y, pageWidth - marginLeft, y); // Draw line across the width
    y += 5;

    // Draw Table Headers
    doc.setFont('courier', 'bold');
    const startX = marginLeft + 5;
    const colWidths = [50, 20, 30, 20, 40];
    const headers = ['Item Name', 'Qty', 'Price', 'Tax %', 'Total'];

    let x = startX;
    headers.forEach((header, index) => {
      doc.rect(x, y, colWidths[index], 10);
      doc.text(header, x + 2, y + 7);
      x += colWidths[index];
    });

    y += 10;

    // Draw Table Rows
    doc.setFont('courier', 'normal');

    invoiceData.items.forEach(item => {
      x = startX;
      const total = (item.price * item.quantity + (item.price * item.quantity * item.tax) / 100).toFixed(2);

      const rowData = [item.itemName, item.quantity.toString(), item.price.toString(), `${item.tax}%`, `${total} INR`];

      rowData.forEach((cell, index) => {
        doc.rect(x, y, colWidths[index], 10);
        doc.text(cell, x + 2, y + 7);
        x += colWidths[index];
      });

      y += 10;
    });

    y += 5;

    doc.line(marginLeft, y, pageWidth - marginLeft, y); // Draw line across the width
    y += 5;

    // Calculate Totals
    const subtotal = invoiceData.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const totalTax = invoiceData.items.reduce((acc, item) => acc + (item.price * item.quantity * item.tax) / 100, 0);
    const discountAmount = invoiceData.discountType === 'percentage'
      ? Number(invoiceData.overallDiscount / 100) * (subtotal + totalTax)
      : Number(invoiceData.overallDiscount);

    const grandTotal = subtotal + totalTax - discountAmount;

    doc.text(`Total Qty: ${invoiceData.items.reduce((acc, item) => acc + item.quantity, 0)}`, marginLeft + 5, y);
    y += 6;
    doc.text(`Sub Total: ${subtotal.toFixed(2)} INR`, marginLeft + 5, y);
    y += 6;
    doc.text(`Tax: ${totalTax.toFixed(2)} INR`, marginLeft + 5, y);
    y += 6;
    doc.text(`Discount: -${discountAmount.toFixed(2)} INR`, marginLeft + 5, y);
    y += 6;
    doc.setFont('courier', 'bold');
    doc.text(`Grand Total: ${grandTotal.toFixed(2)} INR`, marginLeft + 5, y);
    y += 5;

    doc.line(marginLeft, y, pageWidth - marginLeft, y); // Draw line across the width
    y += 5;

    //  Notes on the same line
    if (invoiceData?.notes?.trim()) {
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);

      const noteLabel = 'Notes: ';
      const noteContent = invoiceData.notes;

      const splitNotes = doc.splitTextToSize(noteLabel + noteContent, contentWidth - 10);

      doc.text(splitNotes, marginLeft + 5, y);
      y += splitNotes.length * 6;

      y += 5; // Extra space after notes
    }
    doc.line(marginLeft, y, pageWidth - marginLeft, y); // Draw line across the width
    y += 5;
    doc.setFont('courier', 'normal');
    doc.text('Thanks & Visit Again!!', pageWidth / 2, y, { align: 'center' });

    doc.save(`${invoiceData.billNumber}.pdf`);
  };

  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const win = window.open('', '', 'height=800,width=600');
    win.document.write('<html><head><title>Print Invoice</title></head><body>');
    win.document.write(printContents);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  // Calculation logic
  const subtotal = invoiceData.items.reduce(
    (acc, item) => acc + (item.price * item.quantity) + ((item.price * item.quantity * item.tax) / 100),
    0
  );
  // invoice items total sum value

  const discountAmount =
    invoiceData.discountType === 'percentage'
      ? Number(invoiceData.overallDiscount / 100) * subtotal
      : Number(invoiceData.overallDiscount);
  const totalTax = invoiceData.items.reduce(
    (acc, item) => acc + (item.price * item.quantity * item.tax) / 100,
    0
  );
  const discountedTotal = subtotal - discountAmount;
  const grandTotal = discountedTotal;
  const roundedTotal = grandTotal.toFixed(2);
  const logo = companyData?.avatar || invoiceData?.companyLogo;

  return (
    <div className='d-flex flex-column justify-content-start align-items-center' style={{ height: '100%', overflow: 'hidden' }}>


      <div ref={invoiceRef} style={{ width: '90%', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', border: '1px solid #000', padding: 0, overflowX: 'hidden', overflowY: 'auto', height: '100%' }}>
        {logo && (
          <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
            <img src={logo} alt="Company Logo" style={{ width: '100px', height: 'auto' }} />
          </div>
        )}
        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{companyData?.companyTitle || "Please update the Business Name in the Business Branding page"} </div>
        {/* <div style={{ textAlign: 'center' }}>
          {companyData?.address?.map((address, index) => (
            <div key={index}>
              <p className="my-1">{address?.h_no}, {address?.nearby}, {address?.district}</p>
              <p className="my-1">{address?.city}, {address?.state}, {address?.country}, {address?.zip_code}</p>
            </div>
          ))}
        </div> */}
        <div style={{ textAlign: 'center' }}>
          {(companyData?.registeredTaxationDetail?.find(item => item.toShow)?.fieldValue) && (
            <p>
              <b>{companyData?.registeredTaxationDetail?.find(item => item.toShow)?.fieldName}:</b>{" "}
              {companyData?.registeredTaxationDetail?.find(item => item.toShow)?.fieldValue}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'center' }}>
          {(companyData?.companyMobile) && (
            <p>
              <b>Mobile:</b>{" "}
              {companyData?.companyMobile}
            </p>
          )}
        </div>
        <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '14px' }}>
          Bill Date: {invoiceData?.billDate
            ? new Date(invoiceData.billDate).toLocaleDateString('en-GB')
            : new Date().toLocaleDateString('en-GB')}

          {invoiceData?.billNumber && (
            <span style={{ marginLeft: '20px' }}>
              Bill No: {invoiceData.billNumber}
            </span>
          )}
        </div>

        <hr style={{ color: "black" }} />

       
          <div style={{ marginLeft: "10px" }}>
            Name: {invoiceData.customerName}
            {/* {invoiceData?.customerPhone?.trim() && /[0-9]/.test(invoiceData.customerPhone) && ( */}
              <> (Mo: {invoiceData.customerPhone})</>
            {/* )} */}
          </div>
   
        {/* {invoiceData?.customerEmail?.trim() && (
          <div style={{ marginLeft: "10px" }}>Email: {invoiceData.customerEmail}</div>
        )} */}
        {(() => {
          const addressFields = [
            invoiceData?.customerAddress?.h_no,
            invoiceData?.customerAddress?.city,
            invoiceData?.customerAddress?.state,
            invoiceData?.customerAddress?.zip_code,
            invoiceData?.customerAddress?.country
          ]
            .map(item => item?.trim())
            .filter(item => item && /[a-zA-Z0-9]/.test(item));

          if (addressFields.length > 0) {
            return (
              <div style={{ marginLeft: "10px" }}>
                Address: {addressFields.join(", ")}
              </div>
            );
          }
          return null;
        })()}


        <hr style={{ color: "black" }} />

        {/* 🔥 Items Table Style Section */}
        <table style={{ width: 'calc(100% - 20px)', borderCollapse: 'collapse', marginTop: '10px', marginLeft: '10px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Item Name</th>
              <th style={thStyle}>Qty</th>
              <th style={thStyle}>Price {" " + (invoiceData.billCurrency || companyData?.currency || "INR")}</th>
              <th style={thStyle}>Tax %</th>
              <th style={thStyle}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item, index) => (
              <tr key={index}>
                <td style={tdStyle}>{item.itemName}</td>
                <td style={tdStyle}>{item.quantity}</td>
                <td style={tdStyle}>{item.price}</td>
                <td style={tdStyle}>{item.tax}%</td>
                <td style={tdStyle}> {(invoiceData.billCurrency || companyData?.currency || "INR") + " "}{(item.price * item.quantity + (item.price * item.quantity * item.tax) / 100).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>


        {/* {invoiceData?.billNumber && ( */}
        {invoiceData?.customerName && (
          <>
            <hr style={{ color: "black" }} />
            <div style={{ marginLeft: "10px" }}>
              <div>Total Qty: {invoiceData.items.reduce((acc, item) => acc + item.quantity, 0)} <br />
                Sub Total: {subtotal}{" " + (invoiceData.billCurrency || companyData?.currency || "INR")}</div>
              <div>Tax: {totalTax.toFixed(2)}{" " + (invoiceData.billCurrency || companyData?.currency || "INR")}</div>
              <div>Discount: -{Number(discountAmount.toFixed(2))}{" " + (invoiceData.billCurrency || companyData?.currency || "INR")}</div>
              <div style={{ fontWeight: 'bold' }}>Grand Total: {invoiceData?.totalAmount || roundedTotal}{" " + (invoiceData.billCurrency || companyData?.currency || "INR")}</div>
            </div>
          </>
        )}


        {invoiceData?.notes?.trim() && (
          <>
            <hr style={{ color: "black" }} />
            <div style={{ margin: '4px 10px' }}>
              Notes: {invoiceData.notes}
            </div>
            <hr style={{ color: "black" }} />
          </>
        )}

        <div style={{ textAlign: 'center' }}>Thanks & Visit Again!!</div>
      </div>
      {/* {!isPreview && ( */}
        <div className="text-end my-2 d-flex gap-2">
          {invoiceData?.billNumber && (
            <>
              <i onClick={downloadPDF} className="mdi mdi-download btn btn-info" style={{ cursor: 'pointer', fontSize: '18px', marginRight: '8px' }}></i>
              <i onClick={handlePrint} className="mdi mdi-printer btn btn-primary" style={{ cursor: 'pointer', fontSize: '18px', marginRight: '8px' }}></i>
            </>
          )}
          
            {/* <i onClick={onGenerateInvoice} className="mdi mdi-check btn btn-success" style={{ cursor: 'pointer', fontSize: '18px' }}></i> */}
        
        </div>
      {/* )} */}
    </div>
  );
}

const thStyle = {
  border: '1.5px solid #000', // Make borders thicker
  padding: '5px',
  textAlign: 'left',
  backgroundColor: '#f1f1f1'
};

const tdStyle = {
  border: '1.5px solid #000', // Make borders thicker
  padding: '5px',
  textAlign: 'left'
};


export default InvoicePreview;

