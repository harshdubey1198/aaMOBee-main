import React, { forwardRef, useEffect, useState } from "react";
import "../../assets/scss/bootstrap.scss";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

const currencyOptions = [
  { code: "INR", symbol: "₹" },
  { code: "AED", symbol: "د.إ" },
  { code: "USD", symbol: "$" },
  { code: "MYR", symbol: "RM" },
  { code: "SAR", symbol: "﷼" },
];

const DEFAULT_TERMS =
  "Full payment is due upon receipt of this invoice. Late payments may incur additional charges or interest as per applicable laws.";

const PrintFormat2 = forwardRef(
  (
    {
      invoiceData,
      companyData,
      // optional: let parent preset and/or capture edited terms
      terms,
      onTermsChange,
    },
    ref
  ) => {
    const company = companyData || {};
    const companyAddress = company.address || [];
    const currencyCode = company.currency || "INR";
    const currencySymbol =
      currencyOptions.find((c) => c.code === currencyCode)?.symbol || "₹";

    const items = invoiceData?.items || [];

    // --- Corrected totals: tax on base, then subtract discount ---
    const subtotal = items.reduce((acc, item) => {
      const price = Number(item?.varSelPrice ?? item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return acc + price * qty;
    }, 0);

    const totalTaxAmount = items.reduce((acc, item) => {
      const price = Number(item?.varSelPrice ?? item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      const base = price * qty;
      const taxRate = (item?.taxComponents || []).reduce(
        (sum, tax) => sum + Number(tax?.rate ?? tax?.taxRate ?? 0),
        0
      );
      return acc + (base * taxRate) / 100;
    }, 0);

    const totalDiscount = items.reduce(
      (acc, item) => acc + (Number(item?.discount) || 0),
      0
    );

    const grandTotal = subtotal + totalTaxAmount - totalDiscount;
    const amountPaid = Number(invoiceData?.amountPaid) || 0;
    const balanceDue = grandTotal - amountPaid;

    const customerName =
      invoiceData?.firstName && invoiceData?.lastName
        ? `${invoiceData.firstName} ${invoiceData.lastName}`
        : invoiceData?.customerName || "Customer";
    const customerAddress = invoiceData?.customerAddress || {};

    const taxInfo = company?.registeredTaxationDetail?.find((item) => item.toShow);

    // ---- Terms editing state ----
    const [editing, setEditing] = useState(false);
    const [termsText, setTermsText] = useState(terms ?? DEFAULT_TERMS);

    // keep local state in sync if parent changes `terms` prop
    useEffect(() => {
      if (typeof terms === "string") setTermsText(terms);
    }, [terms]);

    const handleSaveTerms = () => {
      setEditing(false);
      onTermsChange?.(termsText); // bubble up if parent wants to persist
    };

    const handleCancelTerms = () => {
      setEditing(false);
      setTermsText(terms ?? DEFAULT_TERMS); // revert to last provided or default
    };

    console.log("Company Data:", companyData);
    console.log("Invoice Data:", invoiceData);
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
            <h2 style={{ color: "#c1f3ff" }}>{invoiceData?.invoiceType}</h2>
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
            <h4 style={{ color: "#c1f3ff" }}>{company.companyTitle}</h4>
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
            <p>
              <strong>Invoice#:</strong>{" "}
              {invoiceData?.invoiceNumber || "INV-24-MAG"}
            </p>
            <p>
              <strong>Invoice Date:</strong>{" "}
              {new Date(
                invoiceData?.issueDate || invoiceData?.createdAt || Date.now()
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Terms:</strong> {invoiceData?.terms || "Due on Receipt"}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {invoiceData?.dueDate
                ? new Date(invoiceData?.dueDate).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive mt-4">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Item </th>
                <th>Description</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Discount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => {
                // --- Corrected per-item math ---
                const price = Number(item?.varSelPrice ?? item?.price) || 0;
                const quantity = Number(item?.quantity) || 0;
                const base = price * quantity;

                const taxRate = (item?.taxComponents || []).reduce(
                  (sum, tax) => sum + Number(tax?.rate ?? tax?.taxRate ?? 0),
                  0
                );
                const taxAmount = (base * taxRate) / 100;

                // Discount applied AFTER tax
                const discount = Number(item?.discount) || 0;

                const total = base + taxAmount - discount;

                const taxList = item?.taxComponents || [];

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <strong>{item?.name || item?.itemId?.name || "N/A"}</strong>
                      {item?.selectedVariant?.[0]?.optionLabel ? (
                        <>
                          <br />({item.selectedVariant[0].optionLabel})
                        </>
                      ) : null}
                    </td>
                    <td
                      dangerouslySetInnerHTML={{
                        __html:
                          item?.description || item?.itemId?.description || "",
                      }}
                    ></td>

                    {/* Show base (price*qty) in Price column */}
                    <td>
                      {currencySymbol}
                      {base.toFixed(2)}
                      <br />
                      {taxList.length ? (
                        <>
                          (
                          {taxList.map((tax, i) => (
                            <span key={i}>
                              {tax.taxType}: {Number(tax?.rate ?? tax?.taxRate ?? 0)}%
                              {i < taxList.length - 1 ? ", " : ""}
                            </span>
                          ))}
                          )
                        </>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    {/* Show tax breakdown + computed tax amount */}
                    <td>{item?.quantity}</td>
                    <td>
                      {currencySymbol}
                      {discount.toFixed(2)}
                    </td>
                    <td>
                      {currencySymbol}
                      {total.toFixed(2)}
                    </td>
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
          <p className="text-end mb-1">
            Subtotal: {currencySymbol}
            {subtotal.toFixed(2)}
          </p>
          <p className="text-end mb-1">
            Total Tax: {currencySymbol}
            {totalTaxAmount.toFixed(2)}
          </p>
          <p className="text-end mb-1">
            Total Discount: {currencySymbol}
            {totalDiscount.toFixed(2)}
          </p>
          <h5 className="text-end">
            Grand Total: {currencySymbol}
            {grandTotal.toFixed(2)}
          </h5>
          <p className="text-end">
            Amount Paid: {currencySymbol}
            {amountPaid.toFixed(2)}
          </p>
          <h5 className="text-end">
            Balance Due: {currencySymbol}
            {balanceDue.toFixed(2)}
          </h5>
        </div>

        {/* Terms + Edit actions */}
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <p style={{ fontSize: "0.9em", color: "#555", marginBottom: "6px" }}>
              <strong>Terms &amp; Conditions:</strong>
            </p>
            {/* Edit button (hidden on print) */}
            {!editing && (
              <button
                className="btn btn-sm btn-outline-secondary d-print-none"
                onClick={() => setEditing(true)}
                title="Edit Terms & Conditions"
              >
                <FaEdit style={{ marginBottom: "2px" }} /> Edit
              </button>
            )}
          </div>

          {/* Editing mode (screen only) */}
          {editing ? (
            <div className="d-print-none">
              <textarea
                className="form-control mb-2"
                rows={4}
                value={termsText}
                onChange={(e) => setTermsText(e.target.value)}
                placeholder="Enter terms & conditions…"
              />
              <div className="d-flex gap-2">
                <button className="btn btn-success btn-sm" onClick={handleSaveTerms}>
                  <FaSave style={{ marginBottom: "2px" }} /> Save
                </button>
                <button className="btn btn-danger btn-sm" onClick={handleCancelTerms}>
                  <FaTimes style={{ marginBottom: "2px" }} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            // Read-only output (also prints)
            <p style={{ whiteSpace: "pre-wrap" }}>
              {invoiceData.termsAndConditions || termsText || DEFAULT_TERMS}
            </p>
          )}
        </div>
      </div>
    );
  }
);

export default PrintFormat2;
