import React, { forwardRef, useEffect, useState } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const convertNumberToWords = (num) => {
  if (num === null || num === undefined || isNaN(Number(num))) return "";

  // normalize to 2 decimals so paise is accurate
  const [rupeesStr, paiseStr] = Number(num).toFixed(2).split(".");
  const rupees = parseInt(rupeesStr, 10);
  const paise = parseInt(paiseStr, 10);

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const twoDigits = (n) => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10), o = n % 10;
    return tens[t] + (o ? " " + ones[o] : "");
  };

  const threeDigits = (n) => {
    // 0..999 with Indian-style "and" between hundreds and the remainder
    if (n === 0) return "";
    const h = Math.floor(n / 100);
    const rem = n % 100;
    let part = "";
    if (h) part += ones[h] + " Hundred";
    if (rem) part += (h ? " and " : "") + twoDigits(rem);
    return part;
  };

  // break into Indian groups
  const crore = Math.floor(rupees / 10000000);                 // 1,00,00,000
  const lakh = Math.floor((rupees % 10000000) / 100000);       // 1,00,000
  const thousand = Math.floor((rupees % 100000) / 1000);       // 1,000
  const remainder = rupees % 1000;                             // 0..999

  const parts = [];
  if (crore) parts.push(threeDigits(crore) + " Crore");
  if (lakh) parts.push(threeDigits(lakh) + " Lakh");
  if (thousand) parts.push(threeDigits(thousand) + " Thousand");
  if (remainder) parts.push(threeDigits(remainder));

  let rupeesWords = parts.join(" ");
  if (!rupeesWords) rupeesWords = "Zero";

  let result = rupeesWords + " Rupees";
  if (paise) result += " and " + twoDigits(paise) + " Paise";

  return result.trim();
};

const currencyOptions = [
  { code: "INR", symbol: "₹" }, { code: "AED", symbol: "د.إ" },
  { code: "SAR", symbol: "﷼" }, { code: "MYR", symbol: "RM" },
  { code: "USD", symbol: "$" }
];
const getCurrencySymbol = (code) => currencyOptions.find(c => c.code === code)?.symbol || "₹";

const DEFAULT_TERMS = `Goods once sold are not returnable.
Payment is due upon receipt unless otherwise agreed.
Late payments may attract interest as per applicable laws.`;

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
  },
  editBtn: {
    border: '1px solid #6c757d',
    background: 'transparent',
    color: '#6c757d',
    borderRadius: '4px',
    fontSize: '12px',
    padding: '4px 8px',
    cursor: 'pointer'
  },
  actionBtn: {
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    padding: '6px 10px',
    cursor: 'pointer'
  },
  saveBtn: {
    background: '#198754',
    color: '#fff'
  },
  cancelBtn: {
    background: '#dc3545',
    color: '#fff'
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    resize: 'vertical',
    boxSizing: 'border-box'
  }
};

const PrintFormat3 = forwardRef(({ invoiceData, companyData, terms, onTermsChange }, ref) => {
  const company = companyData || invoiceData?.firmId || {};
  const address = company?.address?.[0] || {};
  const customerAddress = invoiceData?.customerAddress || {};
  const currencySymbol = getCurrencySymbol(company?.currency || "INR");

  const items = invoiceData?.items || [];
  const customerName = (invoiceData?.firstName && invoiceData?.lastName)
    ? `${invoiceData.firstName} ${invoiceData.lastName}`
    : invoiceData?.customerName || "Customer";

  // ---- totals ----
  let subtotal = 0, totalTax = 0, totalDiscount = 0;

  const calculatedItems = items.map((item) => {
    const itemPrice = Number(item?.varSelPrice ?? item?.price) || 0; // unit rate
    const qty = Number(item?.quantity) || 0;
    const base = itemPrice * qty;                                   // rate × qty (pre-tax)

    // tax on base (BEFORE discount)
    const taxList = item?.taxComponents || [];
    const totalTaxRate = taxList.reduce(
      (sum, tax) => sum + Number(tax?.rate ?? tax?.taxRate ?? 0),
      0
    );
    const taxAmount = (base * totalTaxRate) / 100;

    // discount AFTER tax
    const discount = Number(item?.discount) || 0;

    // line total follows your rule
    const total = base + taxAmount - discount;

    // accumulate totals
    subtotal += base;
    totalTax += taxAmount;
    totalDiscount += discount;

    return {
      ...item,
      itemPrice,   // unit rate
      qty,
      base,        // amount (rate × qty)
      taxAmount,
      discount,
      total,
      taxList
    };
  });

  const grandTotal = subtotal + totalTax - totalDiscount;
  const amountPaid = Number(invoiceData?.amountPaid || 0);
  const balance = grandTotal - amountPaid;
  const amountInWords = convertNumberToWords(Math.round(grandTotal));

  // ---- Terms editing state ----
  const [editingTerms, setEditingTerms] = useState(false);
  const [termsText, setTermsText] = useState(
    typeof terms === 'string' && terms.trim().length ? terms : DEFAULT_TERMS
  );

  useEffect(() => {
    if (typeof terms === 'string') {
      setTermsText(terms.trim().length ? terms : DEFAULT_TERMS);
    }
  }, [terms]);

  const handleSaveTerms = () => {
    setEditingTerms(false);
    onTermsChange?.(termsText);
  };

  const handleCancelTerms = () => {
    setEditingTerms(false);
    setTermsText(typeof terms === 'string' && terms.trim().length ? terms : DEFAULT_TERMS);
  };

  // helper: render lines as an ordered list
  const renderTermsList = (text) => {
    const lines = (text || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (!lines.length) return <p>—</p>;
    return (
      <ol style={{ paddingLeft: '18px', margin: '8px 0' }}>
        {lines.map((line, i) => <li key={i}>{line}</li>)}
      </ol>
    );
  };

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .logo-mobile { display: block !important; }
            .logo-desktop { display: none !important; }
          }
          @media print {
            .no-print { display: none !important; }
          }
        `}
      </style>

      <div style={styles.container} ref={ref}>
        <h2 style={{ textAlign: 'center' }}>{invoiceData?.invoiceType}</h2>

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
            <p>
              {[address.h_no, address.city, address.state, address.zip_code].filter(Boolean).join(", ")}
            </p>
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
            <p><strong>Invoice #:</strong> {invoiceData?.invoiceNumber || 'INV-24-MAG'}</p>
            <p><strong>Date:</strong> {new Date(invoiceData?.issueDate || invoiceData?.createdAt || Date.now()).toLocaleDateString()}</p>
            <p><strong>Due:</strong> {invoiceData?.dueDate ? new Date(invoiceData.dueDate).toLocaleDateString() : "-"}</p>
          </div>
          <div>
            <p><strong>Customer:</strong> {customerName}</p>
            <p><strong>Phone:</strong> {invoiceData?.customerPhone}</p>
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
                <th style={styles.thtd}>Description</th>
                <th style={styles.thtd}>Rate</th>
                <th style={styles.thtd}>Qty</th>
                <th style={styles.thtd}>Amount</th>
                <th style={styles.thtd}>Total</th>
              </tr>
            </thead>
            <tbody>
              {calculatedItems.map((item, i) => (
                <tr key={i}>
                  {/* # */}
                  <td style={styles.thtd}>{i + 1}</td>

                  {/* Item + variant */}
                  <td style={styles.thtd}>
                    <strong>{item.name || item?.itemId?.name || "N/A"}</strong>
                    {item?.selectedVariant?.[0]?.optionLabel ? (
                      <>
                        <br />({item.selectedVariant[0].optionLabel})
                      </>
                    ) : null}
                  </td>

                  {/* Description (HTML) */}
                  <td
                    style={styles.thtd}
                    dangerouslySetInnerHTML={{
                      __html: item?.description || item?.itemId?.description || ""
                    }}
                  />

                  {/* Rate (unit price) + tax breakdown */}
                  <td style={styles.thtd}>
                    {currencySymbol}{item.itemPrice.toFixed(2)}
                    {item.taxList?.length ? (
                      <>
                        <br />
                        (
                        {item.taxList.map((tax, idx) => (
                          <span key={idx}>
                            {idx > 0 ? ", " : ""}
                            {tax.taxType}: {Number(tax?.rate ?? tax?.taxRate ?? 0)}%
                          </span>
                        ))}
                        )
                      </>
                    ) : (
                      <>
                        <br />(N/A)
                      </>
                    )}
                  </td>

                  {/* Qty */}
                  <td style={styles.thtd}>{item.qty}</td>

                  {/* Amount (base = rate × qty) */}
                  <td style={styles.thtd}>
                    {currencySymbol}{item.base.toFixed(2)}
                  </td>

                  {/* Total (base + tax − discount) */}
                  <td style={styles.thtd}>
                    {currencySymbol}{item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={styles.bank}>
            <h4>Bank Details:</h4>
            <div style={{ marginLeft: '8px' }}>
              <p><strong>Bank:</strong> {invoiceData?.bankName || company?.bankName || 'N/A'}</p>
              <p><strong>Account #:</strong> {invoiceData?.accountNumber || company?.accountNumber || 'N/A'}</p>
              <p><strong>IFSC:</strong> {company?.ifscCode || 'N/A'}</p>
              <p><strong>Branch:</strong> {company?.branchName || 'N/A'}</p>
            </div>
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
        </div>

        {/* Terms & Conditions with Edit/Save/Cancel */}
        <div style={styles.notes}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0 }}><strong>Terms &amp; Conditions:</strong></p>
            {!editingTerms && (
              <button
                type="button"
                className="no-print"
                onClick={() => setEditingTerms(true)}
                style={styles.editBtn}
                title="Edit Terms & Conditions"
              >
                <FaEdit style={{ marginBottom: '2px' }} /> Edit
              </button>
            )}
          </div>

          {editingTerms ? (
            <div className="no-print" style={{ marginTop: '10px' }}>
              <textarea
                style={styles.textarea}
                value={termsText}
                onChange={(e) => setTermsText(e.target.value)}
                placeholder={`Enter one term per line...\nExample:\nGoods once sold are not returnable.\nPayment due upon receipt.`}
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={handleSaveTerms}
                  style={{ ...styles.actionBtn, ...styles.saveBtn }}
                >
                  <FaSave style={{ marginBottom: '2px' }} /> Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelTerms}
                  style={{ ...styles.actionBtn, ...styles.cancelBtn }}
                >
                  <FaTimes style={{ marginBottom: '2px' }} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '8px' }}>
              {renderTermsList(termsText)}
            </div>
          )}
        </div>

        <footer style={styles.signature}>
          <p>For {company.companyTitle || "Company Name"}</p>
          <p>Authorized Signatory</p>
        </footer>
      </div>
    </>
  );
});

export default PrintFormat3;
