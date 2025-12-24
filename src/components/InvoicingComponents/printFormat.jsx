import React, { forwardRef } from 'react';
import '../../assets/scss/bootstrap.scss';
const currencyOptions = [
    { code: "INR", symbol: "₹", name: "Indian Rupee" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
    { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
    { code: "USD", symbol: "$", name: "US Dollar" },
];

const getCurrencyDetails = (currencyCode) => {
    const currency = currencyOptions.find((option) => option.code === currencyCode);
    return currency ? currency.code : currencyCode;
};

// const sliceDescription = (description) => {
//     if (description && description.length > 50) {
//         return description.slice(0, 50) + '...';
//     }
//     return description || ''; 
// };

const PrintFormat = forwardRef(({ invoiceData, companyData }, ref) => {
    const selectInvoice = invoiceData?.firmId || {};
    // console.log(companyData);
    const currency = getCurrencyDetails(companyData.currency || "INR");

    const items = invoiceData?.items || [];
    // console.log("🔍 PrintFormat - Items data:", items);
    // console.log("🔍 PrintFormat - First item:", items[0]);
    const companyAddress = companyData?.address || [];

    // subtotal = sum of base prices (qty * unit price)
    const subtotal = items.reduce((acc, item) => {
        const price = Number(item.varSelPrice ?? item.price) || 0;
        const qty = Number(item.quantity) || 0;
        return acc + qty * price;
    }, 0);

    // totalTaxAmount = tax on the base (before discount)
    const totalTaxAmount = items.reduce((acc, item) => {
        const price = Number(item.varSelPrice ?? item.price) || 0;
        const qty = Number(item.quantity) || 0;
        const base = qty * price;
        const taxRate = (item.taxComponents || []).reduce(
            (sum, tax) => sum + Number(tax.rate ?? tax.taxRate ?? 0),
            0
        );
        return acc + base * (taxRate / 100);
    }, 0);

    // totalDiscount = sum of discounts (deducted after tax)
    const totalDiscount = items.reduce(
        (acc, item) => acc + (Number(item.discount) || 0),
        0
    );

    const grandTotal = subtotal + totalTaxAmount - totalDiscount;

    const amountPaid = Number(invoiceData?.amountPaid) || 0;
    const customerName = invoiceData?.firstName && invoiceData?.lastName
        ? `${invoiceData.firstName} ${invoiceData.lastName}`
        : invoiceData?.customerName || 'Please select a customer';

    return (
        <div ref={ref} className="card p-0 border rounded position-relative">
            <div className="row text-center card-title-heading m-0 mb-4">
                <h2 className="text-white">{invoiceData?.invoiceType}</h2>
            </div>

            <div className="row m-text-center p-4 pb-0 m-0">
                <div className="col-lg-6 col-md-6 col-sm-12 mb-4">
                    {(invoiceData?.companyLogo || selectInvoice.avatar) && (
                        <img
                            src={selectInvoice.avatar || invoiceData?.companyLogo}
                            alt="Company Logo"
                            style={{ height: "100px", maxWidth: "200px", marginBottom: "10px", marginTop: "-36px" }}
                        />
                    )}
                    {companyAddress?.map((address, index) => (
                        <div key={index}>
                            <p className="my-1">{address?.h_no}, {address?.nearby}, {address?.district}</p>
                            <p className="my-1">{address?.city}, {address?.state}, {address?.country}, {address?.zip_code}</p>
                        </div>
                    ))}
                    <p className="my-1">{invoiceData?.companyEmail}</p>
                    {/* <p className="my-1">
                        {invoiceData?.gstin === null && (
                        <b>GSTIN:</b>)
                        }
                         {invoiceData?.gstin || selectInvoice.gstin}</p> */}

                    {(companyData?.registeredTaxationDetail?.find(item => item.toShow)?.fieldValue) && (
                        <p className="my-1">
                            <b>{companyData?.registeredTaxationDetail?.find(item => item.toShow)?.fieldName}:</b>{" "}
                            {companyData?.registeredTaxationDetail?.find(item => item.toShow)?.fieldValue}
                        </p>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 m-text-center text-end">
                    <p><strong>Invoice Number:</strong> INV-24-MAG</p>
                    <p><strong>Issue Date:</strong> {invoiceData?.issueDate || selectInvoice.issueDate}</p>
                    <p><strong>Due Date:</strong> {invoiceData?.dueDate || selectInvoice.dueDate}</p>
                    <p><strong>Amount Due:</strong> {currency} {(grandTotal - amountPaid).toFixed(2)}</p>
                </div>
            </div>

            <div className="row pb-1 m-4 border-bottom">
                <div className="col-lg-6 col-md-6 col-sm-12 m-text-center">
                    <h4>Customer Details:</h4>
                    <p className="my-1">{customerName}</p>
                    <p className="my-1">
                        {[
                            invoiceData?.customerAddress?.h_no?.trim(),
                            invoiceData?.customerAddress?.nearby?.trim(),
                            invoiceData?.customerAddress?.district?.trim()
                        ]
                            .filter(item => item)
                            .join(', ')}
                    </p>
                    <p className="my-1">
                        {[
                            invoiceData?.customerAddress?.city?.trim(),
                            invoiceData?.customerAddress?.state?.trim(),
                            invoiceData?.customerAddress?.country?.trim(),
                            invoiceData?.customerAddress?.zip_code?.trim()
                        ]
                            .filter(item => item)
                            .join(', ')}
                    </p>
                    <p className="my-1">Phone : {invoiceData?.customerPhone} | Email : {invoiceData?.customerEmail}</p>
                </div>
            </div>

            <div className="table-responsive mx-4 mt-2">
                <table className="table table-bordered">
                    <thead className='table-light'>
                        <tr>
                            <th>#</th>
                            <th>Item</th>
                            {/* <th>Variant</th> */}
                            <th>Description</th>
                            {/* <th>Taxes</th> */}
                            <th>HSN/SAC</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Discount</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const unitPrice = Number(item.varSelPrice ?? item.price) || 0;
                            const qty = Number(item.quantity) || 0;
                            const base = qty * unitPrice;

                            const taxRate = (item.taxComponents || []).reduce(
                                (sum, tax) => sum + Number(tax.rate ?? tax.taxRate ?? 0),
                                0
                            );
                            const taxAmount = base * (taxRate / 100);

                            // discount is applied AFTER tax
                            const itemDiscount = Number(item.discount) || 0;
                            const finalAmount = base + taxAmount - itemDiscount;



                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {item?.name || item?.itemId?.name || "N/A"}
                                        {item?.selectedVariant?.[0]?.optionLabel
                                            ? <><br />({item.selectedVariant[0].optionLabel})</>
                                            : null}
                                    </td>
                                    {/* <td>{item?.selectedVariant?.[0]?.optionLabel || '-'}</td> */}
                                    <td dangerouslySetInnerHTML={{ __html: item?.description || item?.itemId?.description }}></td>
                                    {/* <td>
                                         {item?.taxComponents && item?.taxComponents.length > 0 ? (
                                             <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                                                 {item?.taxComponents.map((tax, taxIndex) => (
                                                     <li key={taxIndex}>
                                                         <span>{tax?.taxType + " : " || 'N/A'}</span>
                                                         <span>{tax?.rate || 'N/A'}%</span>
                                                     </li>
                                                 ))}
                                             </ul>
                                         ) : 'N/A'}
                                     </td> */}
                                    <td>{item?.ProductHsn || item?.itemId?.ProductHsn || '-'}</td>
                                    <td>{item?.quantity} {item?.qtyType}</td>
                                    <td>
                                        {unitPrice.toFixed(2)}{" "}
                                        <br />
                                        {item?.taxComponents && item.taxComponents.length > 0 ? (
                                            <>
                                                (
                                                {item.taxComponents.map((tax, taxIndex) => (
                                                    <span key={taxIndex}>
                                                        {tax?.taxType || "N/A"}: {Number(tax?.rate ?? tax?.taxRate ?? 0)}%
                                                        {taxIndex < item.taxComponents.length - 1 ? ", " : ""}
                                                    </span>
                                                ))}
                                                )
                                            </>
                                        ) : (
                                            " (N/A)"
                                        )}
                                    </td>

                                    <td>{itemDiscount?.toFixed(2)}</td>
                                    <td>{finalAmount?.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>

                </table>
            </div>

            <div className="row bg-light m-4">
                <div className="col-lg-6 col-md-6 col-sm-12 m-text-center ">
                    <h5>Bank Details</h5>
                    <p className="my-1"><strong>Bank Name: </strong> {invoiceData?.bankName || selectInvoice?.bankName || 'Your Bank Name'}</p>
                    <p className="my-1"><strong>Account Number: </strong> {invoiceData?.accountNumber || selectInvoice?.accountNumber || 'Your Account Number'}</p>
                    <p className="my-1">
                        <strong> Branch Name: </strong>
                        {invoiceData?.branchName}
                    </p>
                    {(invoiceData?.ifscCode || selectInvoice?.ifscCode) && (
                        <p className="my-1">
                            <strong>IFSC Code:</strong> {invoiceData?.ifscCode || selectInvoice?.ifscCode}
                        </p>
                    )}
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12 m-text-center text-end">
                    <h4>Summary:</h4>
                    <p className="my-1"><strong>Subtotal:</strong> {currency} {subtotal?.toFixed(2)}</p>
                    <p className="my-1"><strong>Tax:</strong> {currency} {totalTaxAmount?.toFixed(2)}</p>
                    <p className="my-1"><strong>Discount:</strong> {currency} {totalDiscount?.toFixed(2)}</p>
                    <p className="my-1"><strong>Grand Total:</strong> {currency} {grandTotal?.toFixed(2)}</p>
                    <p className="my-1"><strong>Amount Paid:</strong> {currency} {amountPaid?.toFixed(2)}</p>
                    <p className="my-1"><strong>Balance:</strong> {currency} {(grandTotal - amountPaid).toFixed(2)}</p>
                </div>
                <h4>

                </h4>
            </div>
        </div>
    );
});

export default PrintFormat;
