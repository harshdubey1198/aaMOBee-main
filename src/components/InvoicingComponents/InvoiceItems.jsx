import React, { useState, useEffect } from 'react';
import { FormGroup, Label, Input, Spinner, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axiosInstance from '../../utils/axiosInstance';
import Select from "react-select";
import InventoryItemForm from '../../Pages/Inventory-MNG/TableForm';
import { Row, Col } from 'react-bootstrap';


const InvoiceItems = ({ items, selectedFirmId, isAddItemVisible ,removeItem, invoiceData, setInvoiceData, role, companyData }) => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createItemModalOpen, setCreateItemModalOpen] = useState(false);
  // console.log("item data for edit : " , items[0]?.itemId.name);
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
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryItems();
  }, [selectedFirmId, firmId, createItemModalOpen]);


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

    const basePrice = varSelPrice > 0 ? quantity * varSelPrice : quantity * price;

    const totalTax = Array.isArray(taxComponents)
      ? taxComponents.reduce((acc, tax) => acc + (basePrice * (tax.rate / 100)), 0)
      : 0;

    const taxedPrice = basePrice + totalTax;

    const total = taxedPrice - discount;

    return {
      total: parseFloat(total.toFixed(2)),
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
      tax: 0,
      ProductHsn: "",
      taxComponents: [],
      discount: 0,
      total: 0,
      selectedVariant: [],
    };

    const selectedItem = inventoryItems.find((invItem) => invItem._id === selectedItemId);
    if (selectedItem) {
      const price = getSellingPrice(selectedItem._id);
      const taxComponents = selectedItem.tax?.selectedTaxTypes || []; // Get tax components
      updatedItems[index] = {
        ...updatedItems[index],
        name: selectedItem.name,
        description: selectedItem.description || '',
        price,
        ProductHsn: selectedItem.ProductHsn,
        taxComponents, // Set tax components in the item
        total: calculateTotal(0, 0, price, taxComponents, 0).total,
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
    // console.log(taxComponents);
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
    const price = item.varSelPrice > 0 ? item.varSelPrice : item.price || 0;
    return acc + (quantity * price);
  }, 0);

  // ✅ Use existing afterTax & discount:
  const totalTax = items.reduce((acc, item) => acc + (item.afterTax || 0), 0);
  const totalDiscount = items.reduce((acc, item) => acc + (item.discount || 0), 0);

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

  if (input === '') {
    setInvoiceData((prevData) => ({
      ...prevData,
      amountPaid: '', 
    }));
    return;
  }

  const value = parseFloat(input);
  if (isNaN(value)) return;

  const cappedValue = Math.max(0, Math.min(totalInclusiveTaxes, value));

  setInvoiceData((prevData) => ({
    ...prevData,
    amountPaid: cappedValue,
  }));
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
                            item?.itemId?.name ||
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
                      value={(item.selectedVariant?.length > 0 ? item.varSelPrice : item.price) || 0}
                    />
                  </div>

                  {/* Discount */}
                  <div className="col-lg-3 col-md-4">
                    <Label className="fw-semibold">Discount (₹)</Label>
                    <Input
                      type="number"
                      min="0"
                      value={item.discount || 0}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        handleItemChange(index, 'discount', isNaN(value) || value < 0 ? 0 : value);
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
                  {currency} {invoiceData.items.reduce((acc, item) => acc + (item.total || 0), 0).toFixed(2)}
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
                    <strong>{currency} {totalTax.toFixed(2)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between border-0 px-0">
                    <span>Total After Tax</span>
                    <strong>{currency} {totalAfterTax.toFixed(2)}</strong>
                  </li>
                </ul>
              </div>
            </div>

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
                    max={totalInclusiveTaxes}
                    onWheel={(e) => e.target.blur()}
                  />
                  <small className="text-muted d-block mt-1">
                    (Cannot exceed ₹ {totalInclusiveTaxes.toFixed(2)})
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
