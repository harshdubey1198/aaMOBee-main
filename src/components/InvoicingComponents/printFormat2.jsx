import React, { forwardRef } from "react";
import "../../assets/scss/bootstrap.scss";

const currencyOptions = [
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
  { code: "USD", symbol: "$" },
  { code: "MYR", symbol: "RM" },
  { code: "SAR", symbol: "﷼" },
];

const termsAndConditions =
  "Full payment is due upon receipt of this invoice. Late payments may incur additional charges or interest as per applicable laws.";

const PrintFormat2 = forwardRef(({ invoiceData, companyData }, ref) => {
  const company = companyData || {};
  const companyAddress = company.address || [];
  const currencyCode = company.currency || "INR";
  const currencySymbol =
    currencyOptions.find((c) => c.code === currencyCode)?.symbol || "₹";

  const items = invoiceData?.items || [];
  const subtotal = items.reduce((acc, item) => {
    const price = item.varSelPrice || item.price;
    return acc + price * item.quantity;
  }, 0);

  const totalTaxAmount = items.reduce((acc, item) => {
    const price = item.varSelPrice || item.price;
    const taxRate = (item.taxComponents || []).reduce(
      (sum, tax) => sum + tax.rate,
      0
    );
    return acc + (price * item.quantity * taxRate) / 100;
  }, 0);

  const totalDiscount = items.reduce((acc, item) => acc + (item.discount || 0), 0);
  const grandTotal = subtotal + totalTaxAmount - totalDiscount;
  const amountPaid = Number(invoiceData?.amountPaid) || 0;
  const balanceDue = grandTotal - amountPaid;

  const customerName =
    invoiceData?.firstName && invoiceData?.lastName
      ? `${invoiceData.firstName} ${invoiceData.lastName}`
      : invoiceData?.customerName || "Customer";
  const customerAddress = invoiceData?.customerAddress || {};

  const taxInfo = company?.registeredTaxationDetail?.find(item => item.toShow);

  return (
    <div
      ref={ref}
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "800px",
        margin: "auto",
        backgroundColor: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #ccc",
      }}
      className="p-4"
    >
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-start p-3"
        style={{
          backgroundColor: "#0D4251",
          color: "white",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
        }}
      >
        <div>
          <h2 style={{ color: '#c1f3ff' }}>INVOICE</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          {(invoiceData?.companyLogo || company.avatar) && (
            <img
              src={company.avatar || invoiceData?.companyLogo}
              alt="Company Logo"
              style={{
                height: "60px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
          )}
          <h4 style={{ color: '#c1f3ff' }}>{company.companyTitle}</h4>
          <p>{company.email}</p>
          <p>{company.companyMobile}</p>
          {companyAddress.map((addr, idx) => (
            <p key={idx} style={{ margin: 0 }}>
              {[addr.h_no, addr.nearby, addr.city, addr.state, addr.zip_code]
                .filter(Boolean)
                .join(", ")}
            </p>
          ))}
          {taxInfo && (
            <p style={{ margin: 0 }}>
              <b>{taxInfo.fieldName}:</b> {taxInfo.fieldValue}
            </p>
          )}
        </div>
      </div>

      {/* Balance Bar */}
      <div
        className="py-2 px-3 text-end fw-bold"
        style={{ backgroundColor: "#8FB3BC", fontSize: "16px", color: "#333" }}
      >
        BALANCE DUE: {currencySymbol} {balanceDue.toFixed(2)}
      </div>

      {/* Customer + Invoice Info */}
      <div className="d-flex justify-content-between mt-4">
        <div>
          <h5>{customerName}</h5>
          <p className="mb-1">
            {[customerAddress.h_no, customerAddress.nearby, customerAddress.district]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p className="mb-1">
            {[customerAddress.city, customerAddress.state, customerAddress.country, customerAddress.zip_code]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>Email: {invoiceData?.customerEmail}</p>
          <p>Phone: {invoiceData?.customerPhone}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p><strong>Invoice#:</strong> {invoiceData?.invoiceNumber || "INV-24-MAG"}</p>
          <p><strong>Invoice Date:</strong> {new Date(invoiceData?.issueDate || invoiceData?.createdAt).toLocaleDateString()}</p>
          <p><strong>Terms:</strong> {invoiceData?.terms || "Due on Receipt"}</p>
          <p><strong>Due Date:</strong> {new Date(invoiceData?.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive mt-4">
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Item & Description</th>
              <th>Price</th>
              <th>Tax</th>
              <th>Discount</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => {
              const price = item.varSelPrice || item.price;
              const quantity = item.quantity || 0;
              const itemTotal = price * quantity;
              const taxList = item.taxComponents || [];
              const taxAmount = taxList.reduce((sum, tax) => sum + (tax.rate * itemTotal) / 100, 0);
              const discount = item.discount || 0;
              const total = itemTotal + taxAmount - discount;

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item?.name}</strong>
                    <br />
                    <small dangerouslySetInnerHTML={{ __html: item.description }} />
                  </td>
                  <td>{currencySymbol}{(price * quantity).toFixed(2)}</td>
                  <td>
                    {taxList.map((tax, i) => (
                      <div key={i}>
                        {tax.taxType}: {tax.rate}%
                      </div>
                    ))}
                  </td>
                  <td>{currencySymbol}{discount.toFixed(2)}</td>
                  <td>{currencySymbol}{total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div
        className="p-3 mt-4"
        style={{ backgroundColor: "#E0EFF2", borderRadius: "5px" }}
      >
        <p className="text-end mb-1">Subtotal: {currencySymbol}{subtotal.toFixed(2)}</p>
        <p className="text-end mb-1">Total Tax: {currencySymbol}{totalTaxAmount.toFixed(2)}</p>
        <p className="text-end mb-1">Total Discount: {currencySymbol}{totalDiscount.toFixed(2)}</p>
        <h5 className="text-end">Grand Total: {currencySymbol}{grandTotal.toFixed(2)}</h5>
        <p className="text-end">Amount Paid: {currencySymbol}{amountPaid.toFixed(2)}</p>
        <h5 className="text-end">Balance Due: {currencySymbol}{balanceDue.toFixed(2)}</h5>
      </div>

      {/* Terms */}
      <div className="mt-4">
        <p style={{ fontSize: "0.9em", color: "#555" }}>
          <strong>Terms & Conditions:</strong> {termsAndConditions}
        </p>
      </div>
    </div>
  );
});

export default PrintFormat2;
