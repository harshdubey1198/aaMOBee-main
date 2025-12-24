import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axiosInstance from '../../utils/axiosInstance';
import Select from "react-select";
import InventoryItemForm from '../../Pages/Inventory-MNG/TableForm';
import { Row, Col } from 'react-bootstrap';
import VariantModal from '../../Pages/Inventory-MNG/VariantModal';


const InvoiceItems = ({ items, selectedFirmId, isAddItemVisible ,removeItem, invoiceData, setInvoiceData, role, companyData, ...props }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [variantItemId, setVariantItemId] = useState(null);
  const [variantRefreshKey, setVariantRefreshKey] = useState(0);
  const [variantForm, setVariantForm] = useState({ variationType: "", optionLabel: "", price: "", stock: "", sku: "", barcode: "" });
  const onVariantFormChange = (e) => { const { name, value } = e.target; setVariantForm(p => ({ ...p, [name]: value })); };
  
  
  // console.log("item data for edit : " , items);
  // const [error, setError] = useState(null);
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const firmId = authuser?.response?.adminId;
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
  const currency = getCurrencyDetails(companyData?.currency || "INR");
  const showAdd = Boolean(isAddItemVisible || (Array.isArray(items) && items.length === 0));

    useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const idToUse = role === "client_admin" ? selectedFirmId : firmId;
        if (!idToUse) return;
        const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/inventory/get-items/${idToUse}`);
        setInventoryItems(response.data);
        
                 // Initialize existing items with proper data
         if (items && items.length > 0) {
          //  console.log("🔧 Original items:", items);
           const updatedItems = items.map(item => {
            //  console.log("🔧 Processing item:", item);
             if (item.itemId && item.itemId._id) {
               // Item already has data from database, preserve it
                                const updatedItem = {
                   ...item,
                   itemId: item.itemId._id, // Convert from object to string ID
                   price: item.sellingPrice || item.price || 0,
                   quantity: item.quantity || 0,
                   discount: item.discount || 0,
                   total: item.total || 0,
                   afterTax: item.afterTax || 0,
                   selectedVariant: item.selectedVariant || [],
                   taxComponents: item.taxComponents || []
                 };
               
                               // Recalculate totals
                if (updatedItem.quantity && updatedItem.price) {
                  const calculatedTotal = calculateTotal(
                    updatedItem.quantity, 
                    0, 
                    updatedItem.price, 
                    updatedItem.taxComponents || [],
                    updatedItem.discount
                  );
                  updatedItem.total = calculatedTotal.total;
                  updatedItem.afterTax = calculatedTotal.afterTax;
                }
               
              //  console.log("🔧 Updated item:", updatedItem);
               return updatedItem;
             }
             return item;
           });
           
           console.log("🔧 Final updated items:", updatedItems);
           setInvoiceData(prevData => ({
             ...prevData,
             items: updatedItems
           }));
         }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, [selectedFirmId, firmId, createItemModalOpen, variantRefreshKey]);

  // Recalculate totals when items change
  useEffect(() => {
    if (items && items.length > 0) {
      const updatedItems = items.map(item => {
        if (item.itemId && item.quantity && item.price) {
          const quantity = item.quantity || 0;
          const price = item.price || 0;
          const discount = item.discount || 0;
          
                     // Get tax components from inventory item or use existing ones
           let taxComponents = item.taxComponents || [];
           if (!taxComponents.length && item.itemId) {
             const inventoryItem = inventoryItems.find(inv => inv._id === item.itemId);
             if (inventoryItem?.tax?.selectedTaxTypes) {
               taxComponents = inventoryItem.tax.selectedTaxTypes;
             }
           }
           
            const calculatedTotal = calculateTotal(quantity, item.varSelPrice || 0, price, taxComponents, discount);          
            return {
                ...item,
                total: calculatedTotal.total,
                afterTax: calculatedTotal.afterTax,
                taxComponents: taxComponents
              };
            }
        return item;
      });
      
      setInvoiceData(prevData => ({
        ...prevData,
        items: updatedItems
      }));
    }
  }, [items, inventoryItems]);


  const getSellingPrice = (itemId) => {
    const selectedItem = inventoryItems.find((invItem) => invItem._id === itemId);
    return selectedItem ? selectedItem.sellingPrice : 0;
  };

  const getMaxQuantity = (itemId, selectedVariantName) => {
    const selectedItem = inventoryItems.find((invItem) => invItem._id === itemId);
    if (!selectedItem) return 1;

    if (selectedItem.variants && selectedItem.variants.length > 0) {
      const selectedVariant = selectedItem.variants.find(
        (variant) => variant.optionLabel === selectedVariantName
      );
      if (selectedVariant) {
        const availableQuantity = selectedVariant.stock - selectedVariant.reservedQuantity;
        return availableQuantity > 0 ? availableQuantity : 0;
      }
    }
    return selectedItem.quantity || 0;
  };


  // const calculateTotal = (quantity,varSelPrice, price, tax, discount) => {
  //   // const totalBeforeTax =  quantity * varSelPrice;
  //   const totalBeforeTax = (varSelPrice > 0) ? (quantity * varSelPrice) : (quantity * price);
  //   const totalTax = totalBeforeTax * (tax / 100);
  //   const totalDiscount = totalBeforeTax * (discount / 100);
  //   const total = totalBeforeTax + totalTax - totalDiscount ;
  //   return parseFloat(total.toFixed(2));
  // };

const calculateTotal = (quantity, varSelPrice, price, taxComponents, discount) => {
  const basePrice = (varSelPrice && varSelPrice > 0) ? quantity * varSelPrice : quantity * price;

  let totalTax = 0;
  if (Array.isArray(taxComponents) && taxComponents.length > 0) {
    totalTax = taxComponents.reduce((acc, tax) => {
      const taxRate = Number(tax.rate ?? tax.taxRate ?? 0);
      return acc + (basePrice * (taxRate / 100));
    }, 0);
  }

  const total = basePrice + totalTax - (discount || 0);

  return {
    total: parseFloat(Math.max(0, total).toFixed(2)),
    afterTax: parseFloat(totalTax.toFixed(2)),
  };
};




  const handleItemSelection = (index, selectedItemId) => {
    if (!selectedItemId) {
      const updatedItems = [...items];
             updatedItems[index] = {
         itemId: "",
         name: "",
         description: "",
         quantity: 0,
         price: 0,
         ProductHsn: "",
         discount: 0,
         total: 0,
         selectedVariant: [],
         taxComponents: [],
       };

      setInvoiceData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
      return;
    }

    const updatedItems = [...items];
         updatedItems[index] = {
       itemId: selectedItemId,
       name: "",
       description: "",
       quantity: 0,
       price: 0,
       ProductHsn: "",
       discount: 0,
       total: 0,
       selectedVariant: [],
       taxComponents: [],
     };

 const selectedItem = inventoryItems.find((invItem) => invItem._id === selectedItemId);
     if (selectedItem) {
       const price = getSellingPrice(selectedItem._id);
       const taxComponents = (selectedItem?.items?.taxComponents?.length ? selectedItem.items.taxComponents : (selectedItem.itemId?.tax?.selectedTaxTypes || []));
       updatedItems[index] = {
          ...updatedItems[index],
          name: selectedItem.name,
          description: selectedItem.description || '',
          price,
          ProductHsn: selectedItem.ProductHsn,
          taxComponents, // Set tax components in the item
          total: calculateTotal(0, 0, price, taxComponents, 0).total,
          itemId: selectedItemId, // Ensure itemId is set
        };

      setInvoiceData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    }
  };


  const handleVariantChange = (itemId, variantName, index) => {
    const updatedItems = [...items];
    const selectedItem = updatedItems[index];

    if (!variantName) {
      updatedItems[index] = {
        ...selectedItem,
        selectedVariant: [],
        price: getSellingPrice(itemId),
      };
      const { quantity = 0, discount = 0 } = updatedItems[index];

             const taxComponents = inventoryItems.find((invItem) => invItem._id === itemId)?.tax?.selectedTaxTypes || [];
       updatedItems[index].taxComponents = taxComponents;

       const itemPrice = updatedItems[index].price;
       updatedItems[index].total = calculateTotal(quantity, 0, itemPrice, taxComponents, discount).total;
       updatedItems[index].afterTax = calculateTotal(quantity, 0, itemPrice, taxComponents, discount).afterTax;

      setInvoiceData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
      return;
    }

    const selectedVariant = inventoryItems.find((invItem) => invItem._id === itemId)?.variants.find((variant) => variant.optionLabel === variantName);

    if (selectedVariant) {
      const basePrice = getSellingPrice(itemId);
      const variantPrice = selectedVariant.price || 0;
      const quantity = selectedItem.quantity || 0;
      const discount = selectedItem.discount || 0;
      const sku = selectedVariant.sku || "";
      const barcode = selectedVariant.barcode || "";
      const variationType = selectedVariant.variationType || "";
      // console.log(sku);
      const price = basePrice;
      const varSelPrice = basePrice + variantPrice;

             const taxComponents = inventoryItems.find((invItem) => invItem._id === itemId)?.tax?.selectedTaxTypes || [];
       updatedItems[index] = {
         ...selectedItem,
         selectedVariant: [{ optionLabel: variantName, sku: sku, variationType, barcode, varSelPrice, price: variantPrice }],
         price,
         varSelPrice,
         variationType,
         barcode,
         sku,
         taxComponents,
       };

       updatedItems[index].total = calculateTotal(quantity, varSelPrice, price, taxComponents, discount).total;
       updatedItems[index].afterTax = calculateTotal(quantity, varSelPrice, price, taxComponents, discount).afterTax;

      setInvoiceData((prevData) => ({
        ...prevData,
        items: updatedItems,
      }));
    }
  };





  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    const selectedItem = newItems[index];
    const quantity = selectedItem.quantity || 0;
    const price = selectedItem.price || 0;
    const varSelPrice = selectedItem.varSelPrice || 0;
    const discount = selectedItem.discount || 0;
         const taxComponents = inventoryItems.find((invItem) => invItem._id === selectedItem.itemId)?.tax?.selectedTaxTypes || [];
     newItems[index].total = calculateTotal(quantity, varSelPrice, price, taxComponents, discount).total;
     newItems[index].afterTax = calculateTotal(quantity, varSelPrice, price, taxComponents, discount).afterTax;

    setInvoiceData(prevData => ({ ...prevData, items: newItems }));
  };

  // const totalItems = items.length;
  // const totalPrice = items.reduce((acc, item) => acc + (item.total || 0), 0);
  // const totalTax = items.reduce((acc, item) => acc + (item.afterTax || 0), 0);
  // console.log("Total Tax:", totalTax);
  // const totalDiscount = items.reduce((acc, item) => acc + (item.discount || 0), 0);

  // const totalAfterTax = items.reduce((acc, item) => {
  //   const itemTotal = item.total || 0;
  //   const itemAfterTax = item.afterTax || 0;
  //   return acc + (itemTotal + itemAfterTax - (item.discount || 0));
  // }, 0);

  // const totalInclusiveTaxes = items.reduce((acc, item) => acc + (item.total || 0), 0);
  const totalItems = items.length;

  // ✅ Correct before-tax calculation:
  const totalBeforeTax = items.reduce((acc, item) => {
    const quantity = item.quantity || 0;
    const price = (item.varSelPrice && item.varSelPrice > 0) ? item.varSelPrice : (item.price || 0);
    return acc + (quantity * price);
  }, 0);

     // ✅ Use existing afterTax & discount:
   const totalTax = items.reduce((acc, item) => acc + (item.afterTax || 0), 0);
   const totalDiscount = items.reduce((acc, item) => acc + (item.discount || 0), 0);

   // Calculate tax breakdown by tax type
   const taxBreakdown = {};
   items.forEach(item => {
     if (item.taxComponents && item.taxComponents.length > 0) {
       item.taxComponents.forEach(tax => {
         const taxName = tax.taxName || tax.name || 'Tax';
         const taxRate = tax.rate || tax.taxRate || 0;
         const key = `${taxName} (${taxRate}%)`;
         
         if (!taxBreakdown[key]) {
           taxBreakdown[key] = 0;
         }
         
         const itemBasePrice = (item.quantity || 0) * ((item.varSelPrice && item.varSelPrice > 0 ? item.varSelPrice : item.price) || 0);         const itemDiscount = item.discount || 0;
         const taxableAmount = itemBasePrice - itemDiscount;
         const taxAmount = taxableAmount * (taxRate / 100);
         taxBreakdown[key] += taxAmount;
       });
     }
   });

   // ✅ Final amount to be paid:
   const totalAfterTax = totalBeforeTax + totalTax - totalDiscount;

  // ✅ Keep this if you're using it for amountPaid cap:
  const totalInclusiveTaxes = totalAfterTax;


  if (loading) return <Spinner color="primary" />;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInvoiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleAmountPaidChange = (e) => {
  const input = e.target.value;
  // console.log("🔢 Amount Paid Input:", input, "Type:", typeof input);

  if (input === '') {
    setInvoiceData((prevData) => ({
      ...prevData,
      amountPaid: '', 
    }));
    return;
  }

  const value = parseFloat(input);
  // console.log("🔢 Parsed value:", value, "Type:", typeof value);
  
  if (isNaN(value) || value < 0) return;

  // Allow any positive value, don't cap it
  setInvoiceData((prevData) => ({
    ...prevData,
    amountPaid: value,
  }));
  
  // console.log("🔢 Updated amountPaid to:", value);
};




  return (
    <div>
      {items.length === 0 ? (
  <div className="d-flex justify-content-center align-items-center empty-placeholder py-4">
    <div className="p-4 rounded bg-white text-center w-100">
      <h5 className="text-muted mb-2">No Invoice Items Added</h5>
      <p className="text-muted mb-3">Please add your first item to start the invoice.</p>
      {showAdd && (
        <button
          type="button"
          className="btn btn-outline-info fw-semibold shadow-sm"
          onClick={() =>
            setInvoiceData(prev => ({
              ...prev,
              items: [
                ...prev.items,
                                 {
                   itemId: "",
                   name: "",
                   variant: "",
                   quantity: 1,
                   price: 0,
                   discount: 0,
                   selectedVariant: [],
                   total: 0,
                   afterTax: 0,
                   taxComponents: [],
                   varSelPrice: 0
                 }
              ]
            }))
          }
        >
          ➕ Add Item
        </button>
      )}
    </div>
  </div>
) : (

        <Row className="g-4">

          {/* Left Side – Invoice Items */}
          <Col md={8}>
            {items.length === 0 && (
              <div className="d-flex justify-content-center align-items-center empty-placeholder py-4">
                <div className="shadow p-4 rounded bg-light text-center w-100">
                  <h5 className="text-muted mb-2">No Invoice Items Added</h5>
                  <p className="text-muted mb-0">Please use the form below to add items to the invoice.</p>
                </div>
              </div>
            )}

            {items.map((item, index) => (
              <div className="bg-white border rounded-3 shadow-sm p-4 mb-4" key={index}>
                <div className="row g-3 align-items-end">
                  {/* Item Name */}
                  <div className="col-lg-4 col-md-6">
                    <Label for={`name-${index}`} className="fw-semibold">Item Name</Label>
                                         <Select
                       id={`name-${index}`}
                       value={item.itemId
                         ? {
                           label:
                             inventoryItems.find((inv) => inv._id === item.itemId)?.name ||
                             item?.name ||
                             "",
                           value: item.itemId,
                         }
                         : null}
                      onChange={(selectedOption) => {
                        if (selectedOption?.value === "create_new") {
                          setCreateItemModalOpen(true);
                        } else {
                          handleItemSelection(index, selectedOption?.value || "");
                        }
                      }}
                      options={[
                        ...inventoryItems.map((inv) => ({
                          label: inv.name,
                          value: inv._id,
                        })),
                        { label: "+ Add New Item", value: "create_new" },
                      ]}
                      placeholder="Select or add item"
                      isSearchable
                      isClearable
                      styles={{
                        option: (provided, state) => {
                          const isAddNew = state.data.value === "create_new";
                          return {
                            ...provided,
                            backgroundColor: isAddNew
                              ? state.isFocused
                                ? "#0b3945"
                                : "#0D4251"
                              : provided.backgroundColor,
                            color: isAddNew ? "#fff" : provided.color,
                            fontWeight: isAddNew ? "bold" : "normal",
                          };
                        },
                      }}
                    />
                  </div>

                  {/* Variant */}
                  {inventoryItems.find((inv) => inv._id === item.itemId)?.variants?.length > 0 && (
                    <div className="col-lg-3 col-md-4">
                      <Label className="fw-semibold">Variant</Label>
                      <Input
                        type="select"
                        value={item.selectedVariant?.[0]?.optionLabel || ""}
                        onChange={(e) =>
                          handleVariantChange(item.itemId, e.target.value, index)
                        }
                      >
                        <option value="">Select Variant</option>
                        {inventoryItems
                          .find((inv) => inv._id === item.itemId)
                          ?.variants.map((variant) => (
                            <option key={variant._id} value={variant.optionLabel}>
                              {variant.optionLabel} - {variant.price}
                              {currency}
                            </option>
                          ))}
                      </Input>
                    </div>
                  )}

                  {/* Qty */}
                  <div className="col-lg-2 col-md-4">
                    <Label className="fw-semibold">Qty</Label>
                    <Input
                      type="text"
                      value={item.quantity || ''}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (e.target.value === '' || !isNaN(val)) {
                          handleItemChange(index, 'quantity', Math.max(0, Math.min(val, getMaxQuantity(item.itemId, item.selectedVariant?.[0]?.optionLabel || ""))));
                        }
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>

                                     {/* Price */}
                   <div className="col-lg-2 col-md-4">
                     <Label className="fw-semibold">Price</Label>
                     <Input
                       type="number"
                       readOnly
                       value={(item.varSelPrice && item.varSelPrice > 0 ? item.varSelPrice : item.price) || 0}    
                     />
                   </div>

                  {/* Discount */}
                  <div className="col-lg-3 col-md-4">
                    <Label className="fw-semibold">Discount (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.discount ?? ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        handleItemChange(index, 'discount', raw === '' ? '' : Math.max(0, Number(raw) || 0));
                      }}
                    />
                  </div>

                                     {/* Total */}
                   <div className="col-lg-3 col-md-4">
                     <Label className="fw-semibold">Total</Label>
                                           <Input
                        type="number"
                        readOnly
                        value={item.total?.toFixed(2) || 0}
                      />
                      {item.afterTax > 0 && (
                        <small className="text-muted d-block mt-1">
                          Tax: {currency} {item.afterTax?.toFixed(2) || 0}
                          {item.taxComponents && item.taxComponents.length > 0 && (
                            <span className="ms-1" title={`Tax Breakdown: ${item.taxComponents.map(tax => `${tax.taxName || 'Tax'}: ${tax.rate || tax.taxRate}%`).join(', ')}`}>
                              <i className="bx bx-info-circle text-info"></i>
                            </span>
                          )}
                        </small>
                      )}
                    </div>

                  {/* Delete Button */}
                  <div className="col-lg-1 col-md-2 text-end mt-2">
                    <button
                      type="button"
                      className="btn btn-light border-0 p-0"
                      title="Remove Item"
                      onClick={() => removeItem(index)}
                      style={{ fontSize: '1.2rem', color: '#dc3545' }}
                    >
                      <i className="bx bx-trash"></i>
                    </button>
                  </div>

                {item.itemId && (
                  <div className="col-md-4 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-info w-100 fw-semibold shadow-sm"
                      onClick={() => {
                        const normalizedId = typeof item.itemId === 'object' ? (item.itemId._id || item.itemId.value || item.itemId.id) : item.itemId;
                        console.log('Selected Item ID:', normalizedId);
                        setVariantForm({ variationType: "", optionLabel: "", price: "", stock: "", sku: "", barcode: "" });
                        setVariantItemId(typeof item.itemId === 'object' ? (item.itemId._id || item.itemId.value || item.itemId.id) : item.itemId);

                        setVariantModalOpen(true);
                      }}
                    >
                      ➕ Add Variant
                    </button>
                  </div>
                )}
                  {/* ➕ Add Item (Only on Last) */}
                  {index === items.length - 1 && (
                    <div className="col-md-4 mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-info w-100 fw-semibold shadow-sm"
                        onClick={() =>
                          setInvoiceData((prevData) => ({
                            ...prevData,
                            items: [
                              ...prevData.items,
                                                             {
                                 itemId: "",
                                 name: '',
                                 variant: '',
                                 quantity: 1,
                                 price: 0,
                                 discount: 0,
                                 selectedVariant: [],
                                 total: 0,
                                 afterTax: 0,
                                 taxComponents: [],
                                 varSelPrice: 0
                               }
                            ]
                          }))
                        }
                      >
                        ➕ Add Item
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Col>


          {/* Right Side – Summary + Amount Paid */}
          <Col md={4}>

            {/* Final Invoice Amount Card */}
            <div className="card border border-primary rounded-3 shadow-sm mb-4">
              <div className="card-body py-3">
                <h5 className="card-title text-primary mb-0">Final Invoice Amount</h5>
                <hr className="my-2" />
                                 <h4 className="text-success fw-bold mb-0">
                   {currency} {totalAfterTax.toFixed(2)}
                 </h4>
              </div>
            </div>

                         {/* Invoice Summary Card */}
             <div className="card border border-secondary rounded-3 shadow-sm mb-4">
               <div className="card-body">
                 <h5 className="card-title text-primary mb-3">Invoice Summary</h5>
                 <ul className="list-group list-group-flush">
                   <li className="list-group-item d-flex justify-content-between border-0 px-0">
                     <span>Total Items</span>
                     <strong>{totalItems}</strong>
                   </li>
                                        <li className="list-group-item d-flex justify-content-between border-0 px-0">
                       <span>Total (Before Tax)</span>
                       <strong>{currency} {totalBeforeTax.toFixed(2)}</strong>
                     </li>
                     <li className="list-group-item d-flex justify-content-between border-0 px-0">
                       <span>Total Tax</span>
                       <strong className="text-danger">{currency} {totalTax.toFixed(2)}</strong>
                     </li>
                     {Object.keys(taxBreakdown).length > 0 && (
                       <li className="list-group-item border-0 px-0">
                         <small className="text-muted">Tax Breakdown:</small>
                         {Object.entries(taxBreakdown).map(([taxName, amount]) => (
                           <div key={taxName} className="d-flex justify-content-between">
                             <small className="text-muted">{taxName}</small>
                             <small className="text-danger">{currency} {amount.toFixed(2)}</small>
                           </div>
                         ))}
                       </li>
                     )}
                     <li className="list-group-item d-flex justify-content-between border-0 px-0">
                       <span>Total Discount</span>
                       <strong className="text-success">-{currency} {totalDiscount.toFixed(2)}</strong>
                     </li>
                                        <li className="list-group-item d-flex justify-content-between border-0 px-0 border-top">
                       <span className="fw-bold">Total After Tax</span>
                       <strong className="fw-bold text-primary">{currency} {totalAfterTax.toFixed(2)}</strong>
                     </li>
                 </ul>
               </div>
             </div>
              <VariantModal
                {...props}
                isOpen={variantModalOpen}
                toggleModal={() => setVariantModalOpen(false)}
                ItemId={variantItemId}
                variant={variantForm}
                handleVariantChange={onVariantFormChange}
                addVariant={() => {}}
                onVariantSaved={() => setVariantRefreshKey(k => k + 1)}
              />
            {/* Amount Paid Card */}
            <div className="card border border-secondary rounded-3 shadow-sm">
              <div className="card-body">
                <FormGroup>
                  <Label for="amountPaid" className="form-label">Amount Paid</Label>
                  <Input
                    className="form-control"
                    type="number"
                    name="amountPaid"
                    id="amountPaid"
                    placeholder="Enter amount paid"
                    value={invoiceData.amountPaid ?? ''}
                    onChange={handleAmountPaidChange}
                    required
                    min={0}
                    step="0.01"
                    onWheel={(e) => e.target.blur()}
                  />
                  <small className="text-muted d-block mt-1">
                    Enter the amount that has been paid
                  </small>
                </FormGroup>
              </div>
            </div>
          </Col>


        </Row>
      )}


      <Modal isOpen={createItemModalOpen} toggle={() => setCreateItemModalOpen(!createItemModalOpen)}>
        <ModalHeader toggle={() => setCreateItemModalOpen(!createItemModalOpen)}>
          Add New Item
        </ModalHeader>
        <ModalBody>
          <InventoryItemForm isModal={true} />
        </ModalBody>
       
      </Modal>



    </div>
  );
};

export default InvoiceItems;
