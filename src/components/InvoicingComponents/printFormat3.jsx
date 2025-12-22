import React, { forwardRef } from 'react';

const convertNumberToWords = (num) => {
  const a = ["", "One", "Two", "Three",  "Nineteen"];
  const b = ["", "", "Twenty", "Thirty",  "Ninety"];
  const g = ["", "Thousand", "Million", "Billion", "Trillion"];

  const convert = (n) => {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : "");
    if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : "");
    for (let i = g.length - 1; i > 0; i--) {
      const divisor = Math.pow(1000, i);
      if (n >= divisor) {
        return convert(Math.floor(n / divisor)) + " " + g[i] +
          (n % divisor !== 0 ? " " + convert(n % divisor) : "");
      }
    }
  };

  const [whole, decimal] = num.toString().split(".").map(Number);
  let words = convert(whole);
  if (decimal) words += ` and ${convert(decimal)} Paise`;
  return words.trim();
};

const currencyOptions = [
  { code: "INR", symbol: "₹" }, { code: "AED", symbol: "د.إ" }, 
  { code: "SAR", symbol: "﷼" }, { code: "MYR", symbol: "RM" }, 
  { code: "USD", symbol: "$" }
];
const getCurrencySymbol = (code) => currencyOptions.find(c => c.code === code)?.symbol || "₹";

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
    alignItems: 'flex-start',
    gap: '16px',
    borderBottom: '1px solid #ccc',
    marginBottom: '20px'
  },
  logoMobile: {
    display: 'none',
    textAlign: 'center',
    marginBottom: '16px'
  },
  logoDesktop: {
    display: 'block'
  },
  section: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
    fontSize: '14px',
    marginBottom: '20px'
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
  }
};


const PrintFormat3 = forwardRef(({ invoiceData, companyData }, ref) => {
  const company = companyData || invoiceData?.firmId || {};
  const address = company?.address?.[0] || {};
  const customerAddress = invoiceData?.customerAddress || {};
  const currencySymbol = getCurrencySymbol(company?.currency || "INR");

  const items = invoiceData?.items || [];
  const customerName = invoiceData?.firstName && invoiceData?.lastName
    ? `${invoiceData.firstName} ${invoiceData.lastName}`
    : invoiceData?.customerName || "Customer";

  let subtotal = 0, totalTax = 0, totalDiscount = 0;
  const calculatedItems = items.map((item) => {
    const itemPrice = item.varSelPrice || item.price || 0;
    const qty = item.quantity || 0;
    const discount = Number(item.discount || 0);
    const taxList = item.taxComponents || [];
    const itemTotal = itemPrice * qty;
    const taxableAmount = itemTotal - discount;
    const taxAmount = taxList.reduce((sum, tax) => sum + (taxableAmount * tax.rate) / 100, 0);
    const total = taxableAmount + taxAmount;

    subtotal += itemTotal;
    totalTax += taxAmount;
    totalDiscount += discount;

    return { ...item, itemPrice, qty, discount, taxList, itemTotal, taxAmount, total };
  });

  const grandTotal = subtotal + totalTax - totalDiscount;
  const amountPaid = Number(invoiceData?.amountPaid || 0);
  const balance = grandTotal - amountPaid;
  const amountInWords = convertNumberToWords(Math.round(grandTotal));

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
  `}
</style>
    <div style={styles.container} ref={ref}>
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
          {(company.registeredTaxationDetail || [])
            .filter(t => t.toShow)
            .map((tax, i) => (
              <p key={i}><strong>{tax.fieldName}:</strong> {tax.fieldValue}</p>
            ))}
          <p>{address.h_no}, {address.city}, {address.state} - {address.zip_code}</p>
          <p><strong>Phone:</strong> {company.companyMobile} | <strong>Email:</strong> {company.email}</p>
        </div>
        {company.avatar && (
    <div className="logo-desktop" style={styles.logoDesktop}>
      <img src={company.avatar} alt="Logo" style={{ height: "100px", width: "150px" }} />
    </div>
  )}
      </header>

      <section style={styles.section}>
        <div>
          <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber || 'INV-24-MAG'}</p>
          <p><strong>Date:</strong> {new Date(invoiceData.issueDate || invoiceData.createdAt).toLocaleDateString()}</p>
          <p><strong>Due:</strong> {new Date(invoiceData.dueDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p><strong>Customer:</strong> {customerName}</p>
          <p><strong>Phone:</strong> {invoiceData.customerPhone}</p>
        </div>
        <div>
          <p><strong>Address:</strong><br />
            {[customerAddress.h_no, customerAddress.city, customerAddress.state, customerAddress.zip_code]
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
            <th style={styles.thtd}>Rate</th>
            <th style={styles.thtd}>Qty</th>
            <th style={styles.thtd}>Amount</th>
            <th style={styles.thtd}>Tax</th>
            <th style={styles.thtd}>Total</th>
          </tr>
        </thead>
        <tbody>
          {calculatedItems.map((item, i) => (
            <tr key={i}>
              <td style={styles.thtd}>{i + 1}</td>
              <td style={styles.thtd}><strong>{item.name}</strong></td>
              <td style={styles.thtd}>{currencySymbol}{item.itemPrice.toFixed(2)}</td>
              <td style={styles.thtd}>{item.qty}</td>
              <td style={styles.thtd}>{currencySymbol}{item.itemTotal.toFixed(2)}</td>
              <td style={styles.thtd}>
                {item.taxList.map((tax, idx) => (
                  <div key={idx}>{tax.taxType}: {tax.rate}%</div>
                ))}
              </td>
              <td style={styles.thtd}>{currencySymbol}{item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div style={{ textAlign: 'right', maxWidth: '300px', marginLeft: 'auto' }}>
        <p><strong>Subtotal:</strong> {currencySymbol}{subtotal.toFixed(2)}</p>
        <p><strong>Total Tax:</strong> {currencySymbol}{totalTax.toFixed(2)}</p>
        <p><strong>Total Discount:</strong> {currencySymbol}{totalDiscount.toFixed(2)}</p>
        <p><strong>Grand Total:</strong> {currencySymbol}{grandTotal.toFixed(2)}</p>
        <p><strong>Amount Paid:</strong> {currencySymbol}{amountPaid.toFixed(2)}</p>
        <p><strong>Balance:</strong> {currencySymbol}{balance.toFixed(2)}</p>
        <p><strong>In Words:</strong> {amountInWords} Only</p>
      </div>

      <div style={styles.bank}>
        <h4>Bank Details:</h4>
        <p><strong>Bank:</strong>{invoiceData?.bankName || company?.bankName || 'N/A'}</p>
        <p><strong>Account #:</strong>{invoiceData?.accountNumber || company?.accountNumber || 'N/A'}</p>
        <p><strong>IFSC:</strong> {company.ifscCode}</p>
        <p><strong>Branch:</strong> {company.branchName}</p>
      </div>

      <div style={styles.notes}>
        <p><strong>Terms & Conditions:</strong></p>
        <ol><li>Goods once sold are not returnable.</li></ol>
      </div>

      <footer style={styles.signature}>
        <p>For {company.companyTitle}</p>
        <p>Authorized Signatory</p>
      </footer>
    </div>
    </>
  );
});

export default PrintFormat3;
