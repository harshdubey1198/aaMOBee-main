import React, { forwardRef } from 'react';

const currencyOptions = [
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" },
  { code: "MYR", symbol: "RM" },
  { code: "USD", symbol: "$" }
];

const getCurrencySymbol = (code) => currencyOptions.find(c => c.code === code)?.symbol || code;

const convertNumberToWords = (num) => {
  num = Number(num);
  if (isNaN(num)) return "";

  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const g = ["", "Thousand", "Million", "Billion", "Trillion"];

  const convert = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    for (let i = g.length - 1; i > 0; i--) {
      const divisor = Math.pow(1000, i);
      if (n >= divisor) {
        return convert(Math.floor(n / divisor)) + " " + g[i] + (n % divisor !== 0 ? " " + convert(n % divisor) : "");
      }
    }
  };

  const [whole, decimal] = num.toString().split(".").map(Number);
  let words = convert(whole);
  if (decimal) words += ` and ${convert(decimal)} Paise`;
  return (words || "").trim();
};


const styles = {
  container: {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    backgroundColor: '#fff',
    boxSizing: 'border-box'
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderBottom: '1px solid #ccc',
    marginBottom: '20px'
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '20px',
    gap: '16px'
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    minWidth: '700px',
    borderCollapse: 'collapse',
    marginBottom: '20px',
    fontSize: '14px'
  },
  thtd: {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left',
    verticalAlign: 'top'
  },
  totals: {
    fontSize: '16px',
    textAlign: 'right',
    marginBottom: '20px'
  },
  bank: {
    fontSize: '14px',
    marginBottom: '20px'
  },
  notes: {
    fontSize: '14px',
    marginBottom: '20px'
  },
  signature: {
    textAlign: 'right',
    marginTop: '40px'
  },
  logoMobile: {
    textAlign: 'center',
    marginBottom: '16px',
    display: 'none'
  },
  logoDesktop: {
    display: 'block'
  }
};


const ViewFormat3 = forwardRef(({ invoiceData, companyData }, ref) => {
  // console.log("invoiceData:", invoiceData);
  const company = companyData || invoiceData?.firmId || {};
  const address = company?.address?.[0] || {};
  const customerAddress = invoiceData?.customerAddress || {};
  const currencySymbol = getCurrencySymbol(company?.currency || "INR");
  const items = invoiceData?.items || [];

  const customerName = invoiceData?.firstName && invoiceData?.lastName
    ? `${invoiceData.firstName} ${invoiceData.lastName}`
    : invoiceData?.customerName || "Customer";

  let subtotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;

  const calculatedItems = items.map(item => {
    const qty = item.quantity || 0;
    const itemPrice = (item.sellingPrice || 0) + (item?.selectedVariant?.[0]?.price || 0);
    const itemTotal = qty * itemPrice;

    const taxRate = (item?.itemId?.tax?.selectedTaxTypes || []).reduce((sum, tax) => sum + tax.rate, 0);
    const taxAmount = itemTotal * (taxRate / 100);

    const discount = Number(item.discount || 0);
    const finalTotal = itemTotal + taxAmount - discount;

    subtotal += itemTotal;
    totalTax += taxAmount;
    totalDiscount += discount;

    return {
      ...item,
      itemTotal,
      taxAmount,
      finalTotal,
      price: itemPrice
    };
  });

  const grandTotal = subtotal + totalTax;
  const finalNetAmount = grandTotal - totalDiscount;
  const amountPaid = Number(invoiceData?.amountPaid) || 0;
  const amountDue = Math.max(finalNetAmount - amountPaid, 0);
  const amountInWords = convertNumberToWords(Number(finalNetAmount.toFixed(2)));


  return (
    <>
      <style>
        {`
    @media (max-width: 768px) {
      .logo-mobile {
        display: block !important;
      }
      .logo-desktop {
        display: none !important;
      }
    }

    @media print {
      @page {
        size: A4;
        margin: 10mm;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin: 0;
        padding: 0;
      }

      .invoice-container {
        transform: scale(0.95); 
        transform-origin: center;
        width: 100%;
        page-break-inside: avoid;
        font-size: 11.5px !important;
        line-height: 1.3;
      }

      .invoice-container table {
        font-size: 11px !important;
      }

      .invoice-container h2,
      .invoice-container h3,
      .invoice-container h4 {
        margin: 4px 0 !important;
        font-size: 15px !important;
      }

      .invoice-container p {
        margin: 3px 0 !important;
      }

      .invoice-container img {
        max-height: 50px !important;
      }

      .no-print {
        display: none !important;
      }
    }
  `}
      </style>

      <div className="invoice-container" style={styles.container} ref={ref}>
        <h2 style={{ textAlign: 'center' }}>TAX INVOICE</h2>
        {company.avatar && (
          <div className="logo-mobile" style={styles.logoMobile}>
            <img
              src={company.avatar}
              alt="Company Logo"
              style={{ maxHeight: '80px', maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}
        <header style={styles.header}>
          <div>
            <h3>{company.companyTitle || "Company Name"}</h3>
            {(company.registeredTaxationDetail || []).filter(t => t.toShow).map((tax, i) => (
              <p key={i}><strong>{tax.fieldName}:</strong> {tax.fieldValue}</p>
            ))}
            <p>{address.h_no}, {address.city}, {address.state} - {address.zip_code}</p>
            <p><strong>Phone:</strong> {company.companyMobile} | <strong>Email:</strong> {company.email}</p>
          </div>
          {company.avatar && (
            <div className="logo-desktop" style={styles.logoDesktop}>
              <img src={company.avatar} alt="Logo" style={{ height: 80, width: 80 }} />
            </div>
          )}
        </header>

        <section style={styles.section}>
          <div>
            <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
            <p><strong>Issue Date:</strong> {invoiceData.issueDate}</p>
            <p><strong>Due Date:</strong> {invoiceData.dueDate}</p>
          </div>
          <div>
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Phone:</strong> {invoiceData.customerPhone}</p>
            <p><strong>Email:</strong> {invoiceData.customerEmail}</p>
          </div>
          <div>
            <p><strong>Address:</strong><br />
              {[customerAddress.h_no, customerAddress.nearby, customerAddress.district, customerAddress.city, customerAddress.state, customerAddress.zip_code]
                .filter(Boolean).join(", ")}
            </p>
          </div>
        </section>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.thtd}>#</th>
                <th style={styles.thtd}>Item</th>
                {/* <th style={styles.thtd}>Variant</th>
            <th style={styles.thtd}>HSN/SAC</th> */}
                <th style={styles.thtd}>Qty</th>
                <th style={styles.thtd}>Rate</th>
                <th style={styles.thtd}>Tax</th>
                <th style={styles.thtd}>Discount</th>
                <th style={styles.thtd}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.map((item, i) => (
                <tr key={i}>
                  <td style={styles.thtd}>{i + 1}</td>
                  <td style={styles.thtd}>
                    <strong>{item?.itemId?.name || 'N/A'}</strong>
                    <div dangerouslySetInnerHTML={{ __html: item?.itemId?.description || '' }} />
                  </td>
                  {/* <td style={styles.thtd}>{item?.selectedVariant?.[0]?.optionLabel || '-'}</td> */}
                  {/* <td style={styles.thtd}>{item?.ProductHsn || '-'}</td> */}
                  <td style={styles.thtd}>{item.quantity}</td>
                  <td style={styles.thtd}>{currencySymbol}{item.price.toFixed(2)}</td>
                  <td style={styles.thtd}>
                    {(item?.itemId?.tax?.selectedTaxTypes || []).length > 0 ? (
                      item.itemId.tax.selectedTaxTypes.map((tax, idx) => (
                        <div key={idx}>
                          {tax.taxType}: {tax.rate}%
                        </div>
                      ))
                    ) : (
                      "N/A"
                    )}
                  </td>

                  <td style={styles.thtd}>{currencySymbol}{item.discount?.toFixed(2) || '0.00'}</td>
                  <td style={styles.thtd}>{currencySymbol}{(item.finalTotal || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={styles.totals}>
          <p><strong>Subtotal:</strong> {currencySymbol}{subtotal.toFixed(2)}</p>
          <p><strong>Total Tax:</strong> {currencySymbol}{totalTax.toFixed(2)}</p>
          <p><strong>Total Discount:</strong> {currencySymbol}{totalDiscount.toFixed(2)}</p>
          <p><strong>Grand Total:</strong> {currencySymbol}{grandTotal.toFixed(2)}</p>
          <p><strong>Final Net Amount:</strong> {currencySymbol}{finalNetAmount.toFixed(2)}</p>
          <p><strong>Amount Paid:</strong> {currencySymbol}{amountPaid.toFixed(2)}</p>
          <p><strong>Amount Due:</strong> {currencySymbol}{amountDue.toFixed(2)}</p>
          <p><strong>In Words:</strong> {amountInWords} Only</p>
        </div>


        <div style={styles.bank}>
          <h4>Bank Details:</h4>
          {company.bankDetails?.[0] ? (
            <>
              <p><strong>Bank:</strong> {company.bankDetails[0].bankName}</p>
              <p><strong>Account #:</strong> {company.bankDetails[0].accountNumber}</p>
              <p><strong>IFSC:</strong> {company.bankDetails[0].ifscCode}</p>
              <p><strong>Branch:</strong> {company.bankDetails[0].branchName}</p>
            </>
          ) : <p>No bank details available.</p>}
        </div>

        <div style={styles.notes}>
          <p><strong>Terms & Conditions:</strong></p>
          {invoiceData?.termsAndConditions ? (
            <ol>
              {invoiceData.termsAndConditions.split("\n").map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ol>
          ) : (
            <p>Goods once sold are not returnable.</p>
          )}
        </div>

        <footer style={styles.signature}>
          <p>For {company.companyTitle}</p>
          <p>Authorized Signatory</p>
        </footer>
      </div>
    </>
  );
});

export default ViewFormat3;
