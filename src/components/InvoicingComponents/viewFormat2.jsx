import React, { forwardRef } from 'react';


const termsAndConditions = "Full payment is due upon receipt of this invoice. Late payments may incur additional charges or interest as per the applicable laws.";

const styles = {
    container: {
        backgroundColor: '#0D4251',
        maxWidth: '800px',
        margin: 'auto',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '30px 20px',
        color: 'white',
    },
    balanceBar: {
        backgroundColor: '#8FB3BC',
        padding: '10px 20px',
        fontWeight: 'bold',
        fontSize: '16px',
        color: '#333',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    contentWrapper: {
        backgroundColor: 'white',
        padding: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    th: {
        border: "1px solid #ddd",
        padding: "8px",
        backgroundColor: "#f5f5f5",
        color: "#888",
        textTransform: "uppercase",
        fontWeight: "bold",
        textAlign: "left"
    },
    td: {
        border: "1px solid #ddd",
        padding: "8px",
        verticalAlign: "top",
    },
    summaryBox: {
        backgroundColor: '#E0EFF2',
        padding: '20px',
        borderRadius: '5px',
        marginTop: '20px',
    },
    balanceDue: {
        padding: '10px',
        fontWeight: 'bold',
        textAlign: 'right',
        color: '#000',
        borderRadius: '5px',
        marginTop: '10px',
    },
    rightAlign: {
        textAlign: "right",
        margin: "5px 0",
    },
    terms: {
        fontSize: "0.9em",
        color: "#555",
        marginTop: "30px",
    },
};

const currencyOptions = [
    { code: "INR", symbol: "₹" },
    { code: "AED", symbol: "AED" },
    { code: "USD", symbol: "$" },
    { code: "MYR", symbol: "RM" },
    { code: "SAR", symbol: "﷼" },
];

const ViewFormat2 = forwardRef(({ invoiceData }, ref) => {
    const selectInvoice = invoiceData?.firmId || {};
    const companyAddress = selectInvoice.address || [];
    const currencyCode = selectInvoice.currency || "INR";
    const currencySymbol = currencyOptions.find(c => c.code === currencyCode)?.symbol || currencyCode;

    const items = invoiceData?.items || [];
    let subtotal = 0;

    let totalTaxAmount = 0;
    let totalDiscount = 0;

    items.forEach(item => {
        const unitPrice = (item.sellingPrice || 0) + (item?.selectedVariant?.[0]?.price || 0);
        const quantity = item.quantity || 0;
        const itemTotal = unitPrice * quantity;

        subtotal += itemTotal;
        totalDiscount += parseFloat(item?.discount || 0);

        const taxComponents = item?.itemId?.tax?.selectedTaxTypes || [];
        taxComponents.forEach(tax => {
            totalTaxAmount += (itemTotal * (tax.rate || 0)) / 100;
        });
    });

    const grandTotal = subtotal + totalTaxAmount - totalDiscount;
    const customerName = invoiceData?.firstName && invoiceData?.lastName
        ? `${invoiceData.firstName} ${invoiceData.lastName}`
        : invoiceData?.customerName || "Customer";
    const customerAddress = invoiceData?.customerAddress || {};

    return (
        <div ref={ref} style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={{ color: '#c1f3ff' }} >INVOICE</h1>
                <div style={{ textAlign: 'right' }}>
                    {(invoiceData?.companyLogo || selectInvoice?.avatar) && (
                        <img
                            src={invoiceData?.companyLogo || selectInvoice?.avatar}
                            alt="Company Logo"
                            style={{
                                height: "60px",
                                objectFit: "contain",
                                marginBottom: "10px",
                            }}
                        />
                    )}
                    <h2 style={{ margin: '0', color: '#c1f3ff' }}>{selectInvoice.companyTitle}</h2>
                    <p style={{ margin: 0 }}>{selectInvoice?.email}</p>
                    <p style={{ margin: 0 }}>{selectInvoice?.companyMobile}</p>
                    {companyAddress.map((addr, idx) => (
                        <p key={idx} style={{ margin: 0 }}>
                            {[addr?.h_no, addr?.nearby, addr?.district, addr?.city, addr?.state, addr?.country, addr?.zip_code]
                                .filter(Boolean).join(', ')}
                        </p>
                    ))}
                    {selectInvoice?.firmId?.registeredTaxationDetail?.find(item => item.toShow) && (
                        <p style={{ margin: 0 }}>
                            <b>{selectInvoice.firmId.registeredTaxationDetail.find(item => item.toShow).fieldName}:</b>{" "}
                            {selectInvoice.firmId.registeredTaxationDetail.find(item => item.toShow).fieldValue}
                        </p>
                    )}
                </div>
            </div>

            {/* Balance Bar */}
            <div style={styles.balanceBar}>
                BALANCE DUE: <span style={{ marginLeft: '10px' }}>{currencySymbol} {invoiceData?.amountDue}</span>
            </div>

            {/* Content */}
            <div style={styles.contentWrapper}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3>{customerName}</h3>
                        <p style={{ margin: 0 }}>
                            {[customerAddress?.h_no, customerAddress?.nearby, customerAddress?.district].filter(Boolean).join(', ')}
                        </p>
                        <p style={{ margin: 0 }}>
                            {[customerAddress?.city, customerAddress?.state, customerAddress?.country, customerAddress?.zip_code].filter(Boolean).join(', ')}
                        </p>
                        <p>Email: {invoiceData?.customerEmail}</p>
                        <p>Phone: {invoiceData?.customerPhone}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p>Invoice#: {invoiceData?.invoiceNumber || invoiceData?.invoice?.number}</p>
                        <p>Invoice Date: {new Date(invoiceData?.createdAt || invoiceData?.invoice?.date).toLocaleDateString()}</p>
                        <p>Terms: {invoiceData?.invoice?.terms || 'Due on Receipt'}</p>
                        <p>Due Date: {new Date(invoiceData?.dueDate || invoiceData?.invoice?.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Table */}
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>#</th>
                            <th style={styles.th}>Item & Description</th>
                            <th style={styles.th}>Amount</th>
                            <th style={styles.th}>Tax</th>
                            <th style={styles.th}>Discount</th>
                            <th style={styles.th}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const unitPrice = (item.sellingPrice || 0) + (item?.selectedVariant?.[0]?.price || 0);
                            const quantity = item.quantity || 0;
                            const itemTotal = unitPrice * quantity;

                            return (
                                <tr key={index}>
                                    <td style={styles.td}>{index + 1}</td>
                                    <td style={styles.td}>
                                        <strong>{item?.itemId?.name || "N/A"}</strong>
                                        <br />
                                        {item?.itemId?.description}
                                    </td>
                                    <td style={styles.td}>
                                        <strong>{currencySymbol}{item.quantity *
                                            (item.sellingPrice + (item?.selectedVariant?.[0]?.price || 0))}</strong>
                                        <br />
                                        {currencySymbol}{unitPrice.toFixed(2)} × {quantity}
                                    </td>
                                    <td style={styles.td}>
                                        {(item?.itemId?.tax?.selectedTaxTypes || []).map((tax, i) => (
                                            <div key={i}>
                                                {tax.taxType}: {tax.rate}%
                                            </div>
                                        ))}
                                    </td>
                                    <td style={styles.td}>{currencySymbol}{(item?.discount || 0).toFixed(2)}</td>
                                    <td style={styles.td}>{currencySymbol}{item?.total}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* Summary */}
                <div style={styles.summaryBox}>
                    <div style={styles.rightAlign}>Sub Total: {currencySymbol}{grandTotal.toFixed(2)}</div>
                    <div style={styles.rightAlign}>Total Discount: {currencySymbol}{totalDiscount.toFixed(2)}</div>
                    <div style={styles.rightAlign}><strong>Grand Total:</strong> {currencySymbol}{grandTotal.toFixed(2)}</div>
                    <div style={styles.rightAlign}>Amount Paid: {currencySymbol}{(invoiceData?.amountPaid || 0).toFixed(2)}</div>
                    <div style={styles.balanceDue}>Balance Due: {currencySymbol}{invoiceData?.amountDue}</div>
                </div>

                {/* Terms */}
                <p style={styles.terms}>
                    <strong>Terms & Conditions:</strong> {termsAndConditions}
                </p>
            </div>
        </div>
    );
});

export default ViewFormat2;
