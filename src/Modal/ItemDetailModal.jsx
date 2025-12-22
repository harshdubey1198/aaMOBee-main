import React, { useEffect, useState } from "react";
import { Table, Modal, ModalHeader, ModalBody, Button, Row, Col, } from "reactstrap";
import axiosInstance from "../utils/axiosInstance";
import FetchBrands from "../Pages/Inventory-MNG/FetchBrands";
import FetchManufacturers from "../Pages/Inventory-MNG/fetchManufacturers";
import { getTaxes, getTaxesmain } from "../apiServices/service";
import Select from "react-select";

const ItemDetailModal = ({ companyTitle,setVariantIndex, setVariant, setVariantModalOpen, setSelectedItem, deleteVariant, updateItem, handleEditVariant, modalOpen, setModalOpen, selectedItem, firmId, selectedFirmId }) => {
  console.log("selectedItem : ",selectedItem);
    // console.log("Manufacturer Details : ", formValues.manufacturer);
  // console.log("Vendor Details : ", formValues.vendorId);
  // console.log("Brand Details : ", formValues.brand);
  const [vendors, setVendors] = useState([]);
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [selectedTaxComponents, setSelectedTaxComponents] = useState([]);
  // console.log("selectedItem", selectedItem?.tax);
  // console.log("selectedItem taxname", selectedItem?.tax?.taxId?.taxName);
  // console.log("selectedItem taxname", selectedItem?.tax?.taxId?.taxRates);
  const role =
    JSON.parse(localStorage.getItem("authUser"))?.response?.role || "";
  const handleBrandsFetched = (fetchedBrands) => {
    setBrands(fetchedBrands);
  };
  const handleManufacturersFetched = (fetchedManufacturers) => {
    setManufacturers(fetchedManufacturers);
  };
  const fetchTaxes = async () => {
    try {
      const response = await getTaxesmain(selectedFirmId);
      setTaxes(response.data || []);
    } catch (error) {
      console.error(error.message);
    }
  };
 



  const allCurrencies = [
    { value: "INR", label: "INR" },
    { value: "AED", label: "AED" },
    { value: "SAR", label: "SAR" },
    { value: "MYR", label: "MYR" },
  ];
  
  const selectedCurrency = allCurrencies.find(
    (currency) => currency.value === selectedItem?.itemCurrency
  );
  
  const filteredCurrencyOptions = allCurrencies.filter(
    (currency) => currency.value !== selectedItem?.itemCurrency
  );
  
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axiosInstance.get(
          `${process.env.REACT_APP_URL}/vendor/get-vendors/${selectedFirmId}`
        );
        setVendors(response.data || []);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchTaxes();
    fetchVendors();
  }, [selectedFirmId]);

  const handleTaxChange = (selectedOption) => {
    const selectedTax = taxes.find((tax) => tax._id === selectedOption.value);

    if (selectedTax) {
      setSelectedTaxComponents(
        selectedTax.taxRates.map((rate) => ({
          value: rate._id,
          label: `${rate.taxType} (${rate.rate}%)`,
        }))
      );

      setSelectedItem((prevState) => ({
        ...prevState,
        tax: {
          taxId: String(selectedTax._id),
          selectedTaxTypes: prevState.tax?.selectedTaxTypes?.length
            ? prevState.tax.selectedTaxTypes.map((type) => type._id)
            : selectedTax.taxRates.map((rate) => rate._id),
        },
      }));
    } else {
      setSelectedTaxComponents([]);
      setSelectedItem((prevState) => ({
        ...prevState,
        tax: { taxId: null, selectedTaxTypes: [] },
      }));
    }
  };

  const selectedTaxId = selectedItem?.tax?.taxId
  ? typeof selectedItem.tax.taxId === "object"
    ? selectedItem.tax.taxId._id
    : selectedItem.tax.taxId
  : "";

  const selectedTax = selectedTaxId
    ? taxes.find((tax) => tax._id === selectedTaxId)
    : undefined;


  const handleTaxTypeChange = (selectedTypes) => {
    const selectedTypeIds = selectedTypes
      ? selectedTypes.map((type) => type.value)
      : [];

    setSelectedItem((prevState) => ({
      ...prevState,
      tax: {
        ...prevState.tax,
        selectedTaxTypes: selectedTypeIds,
      },
    }));
  };
  const selectedTaxTypes = selectedItem?.tax?.selectedTaxTypes || [];
  const availableTaxTypes =
  selectedTax
    ? selectedTax.taxRates.map((rate) => ({
        value: rate._id,
        label: `${rate.taxType} (${rate.rate}%)`,
      }))
    : [];


  useEffect(() => {
    if (taxes.length > 0 && selectedTaxId) {
      setSelectedItem((prevState) => ({
        ...prevState,
        tax: {
          ...prevState.tax,
          taxId: selectedTaxId,
          selectedTaxTypes: prevState.tax?.selectedTaxTypes?.length
            ? prevState.tax.selectedTaxTypes
            : taxes
                .find((tax) => tax._id === selectedTaxId)
                ?.taxRates.map((rate) => rate._id) || [],
        },
      }));
    }
  }, [taxes]);

  return (
    <Modal
      modalClassName="custom-modal-width"
      isOpen={modalOpen}
      toggle={() => setModalOpen(!modalOpen)}
    >
      <FetchBrands firmId={selectedFirmId} onBrandsFetched={handleBrandsFetched} />
      <FetchManufacturers
        firmId={selectedFirmId}
        onManufacturersFetched={handleManufacturersFetched}
      />
      <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
        {" "}
        {selectedItem?.name} Details || Item Type :
        {/* { " " + selectedItem?.type.replace(/_/g, " ") .replace(/\b\w/g, (char) => char.toUpperCase()) || " " } */}
      </ModalHeader>
      <ModalBody>
        {selectedItem && (
          <div>
            <Row>
              <Col md={6}>
                <label>
                  <strong>Name:</strong>
                </label>
                <input
                  type="text"
                  value={selectedItem.name}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      name: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </Col>

              <Col md={6}>
                <label>
                  <strong>Description:</strong>
                </label>
                <input
                  type="text"
                  value={selectedItem.description}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      description: e.target.value,
                    })
                  }
                  className="form-control"
                />
              </Col>

              <Col md={3}>
                <label>
                  <strong>Vendor:</strong>
                </label>
                  <select
                    className="form-control"
                    value={selectedItem.vendor?._id || ""}
                    onChange={(e) => {
                      const selectedVendor = [...vendors, {
                        _id: firmId,
                        name: `Self (${companyTitle || "Our Firm"})`,
                      }].find((vendor) => vendor?._id === e.target.value);

                      setSelectedItem({
                        ...selectedItem,
                        vendor: selectedVendor || null,
                      });
                      }}
                     >
                    <option value="">Select Vendor</option>
                    {[{
                      _id: firmId,
                      name: `Self (${companyTitle || "Our Firm"})`,
                    }, ...vendors]
                      .filter((v, i, self) => v && self.findIndex(o => o._id === v._id) === i)
                      .map((vendor) => (
                        <option key={vendor._id} value={vendor._id}>
                          {vendor.name}
                        </option>
                      ))}
                  </select>


              </Col>

              <Col md={3}>
                <label>
                  <strong>Brand:</strong>
                </label>
                <select
                    className="form-control"
                    value={selectedItem.brand?._id || ""}
                    onChange={(e) => {
                      const selectedBrand = [...brands, {
                        _id: firmId,
                        name: `Self (${companyTitle || "Our Firm"})`,
                      }].find((brand) => brand?._id === e.target.value);

                      setSelectedItem({
                        ...selectedItem,
                        brand: selectedBrand || null,
                      });
                    }}
                  >
                    <option value="">Select Brand</option>
                    {[{
                      _id: firmId,
                      name: `Self (${companyTitle || "Our Firm"})`,
                    }, ...brands]
                      .filter((b, i, self) => b && self.findIndex(o => o._id === b._id) === i)
                      .map((brand) => (
                        <option key={brand._id} value={brand._id}>
                          {brand.name}
                        </option>
                      ))}
                  </select>

              </Col>

              <Col md={6}>
                <label>
                  <strong>Quantity Type:</strong>
                </label>

                <div className="d-flex">
                  <input
                    type="number"
                    value={selectedItem?.quantity}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        quantity: e.target.value,
                      })
                    }
                    className="form-control w-25 mr-2"
                  />

                  <select
                    id="qtyType"
                    name="qtyType"
                    value={selectedItem?.qtyType}
                    onChange={(e) =>
                      setSelectedItem({
                        ...selectedItem,
                        qtyType: e.target.value,
                      })
                    }
                    className="form-control w-50"
                    readOnly
                  >
                    <option value="">Select Quantity Type</option>
                    <option value="kg">Kilograms</option>
                    <option value="grams">Grams</option>
                    <option value="pcs">Pieces</option>
                    <option value="litre">Litre</option>
                    <option value="meters">Meters</option>
                    <option value="centimeters">Centimeters</option>
                    <option value="feet">Feet</option>
                  </select>
                </div>
              </Col>
              <Col md={6}>
                <label>
                  <strong>Manufacturer:</strong>
                </label>
              <select
                  className="form-control"
                  value={selectedItem.manufacturer?._id || ""}
                  onChange={(e) => {
                    const selectedManufacturer = [...manufacturers, {
                      _id: firmId,
                      name: `Self (${companyTitle || "Our Firm"})`,
                    }].find((manufacturer) => manufacturer?._id === e.target.value);

                    setSelectedItem({
                      ...selectedItem,
                      manufacturer: selectedManufacturer || null,
                    });
                  }}
                >
                  <option value="">Select Manufacturer</option>
                  {[{
                    _id: firmId,
                    name: `Self (${companyTitle || "Our Firm"})`,
                  }, ...manufacturers]
                    .filter((m, i, self) => m && self.findIndex(o => o._id === m._id) === i)
                    .map((manufacturer) => (
                      <option key={manufacturer._id} value={manufacturer._id}>
                        {manufacturer.name}
                      </option>
                    ))}
                </select>

              </Col>

              <Col md={6}>
                <label>
                  <strong>Tax:</strong>
                </label>
                <span>{selectedItem?.tax?.taxId?.taxName}</span>
                <Select
                  options={taxes.map((tax) => ({
                    value: tax._id,
                    label: tax.taxName,
                  }))}
                  value={
                    selectedTax
                      ? { value: selectedTax._id, label: selectedTax.taxName }
                      : null
                  }
                  onChange={handleTaxChange}
                  placeholder="Select Tax"
                />
              </Col>

              <Col md={6}>
                <label>
                  <strong>Tax Type(s):</strong>
                </label>
                <Select
                  isMulti
                  options={availableTaxTypes}
                  value={
                    (selectedItem?.tax?.selectedTaxTypes || [])
                      .map((selectedId) => {
                        if (!selectedId) return null; 
                  
                        const idToMatch = typeof selectedId === 'object' ? selectedId._id : selectedId;
                        const found = availableTaxTypes.find((opt) => opt.value === idToMatch);
                        
                        return found ? { value: found.value, label: found.label } : null;
                      })
                      .filter(Boolean) || []
                  }
                  
                  onChange={handleTaxTypeChange}
                  placeholder="Select Tax Type"
                />

              </Col>
              
              <Col md={6}>
                <label> <strong>Item Currency:</strong></label>
                <Select
                  options={filteredCurrencyOptions}
                  value={selectedCurrency || null}
                  onChange={(selectedOption) => {
                    setSelectedItem({
                      ...selectedItem,
                      itemCurrency: selectedOption.value,
                    });
                  }}
                  placeholder="Select Currency"
                />
              </Col>  

            </Row>
            <Row>
              <Col md={6}>
                <label>
                  <strong>Selling Price:</strong>
                </label>
                <input
                  type="number"
                  value={selectedItem?.sellingPrice}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      sellingPrice: parseFloat(e.target.value),
                    })
                  }
                  className="form-control"
             
                />
              </Col>
              <Col md={6}>
                <label>
                  <strong>Cost Price:</strong>
                </label>
                <input
                  type="number"
                  value={selectedItem?.costPrice}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      costPrice: parseFloat(e.target.value),
                    })
                  }
                  className="form-control"
               
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label>
                  <strong>HSN Code:</strong>
                </label>
                <input
                  type="text"
                  value={selectedItem?.ProductHsn}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      ProductHsn: e.target.value,
                    })
                  }
                  className="form-control"
                  readOnly
                />
              </Col>
              <Col md={6}>
                <label>
                  <strong>Item Type</strong>
                </label>
                <select
                  className="form-control"
                  value={selectedItem?.type || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="">Select the type</option>
                  <option value="raw_material">Raw Material</option>
                  <option value="finished_good">Finished Goods</option>
                </select>
              </Col>
            </Row>

            <div className="table-responsive">
              <strong>Variants:</strong>
              {selectedItem.variants.length > 0 ? (
                <table className="table table-bordered mt-3">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Variation Type</th>
                      <th>Option Label</th>
                      <th>Price ⬆️</th>
                      <th>Stock</th>
                      <th>Reserved</th>
                      <th>SKU</th>
                      <th>Barcode</th>
                      <th className="d-flex justify-content-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedItem?.variants?.map((variant, vIndex) => (
                      <tr key={vIndex}>
                        <td>{vIndex + 1}</td>
                        <td>{variant.variationType}</td>
                        <td>{variant.optionLabel}</td>
                        <td>₹ {variant.price}</td>
                        <td>{variant.stock}</td>
                        <td>{variant.reservedQuantity}</td>
                        <td>{variant.sku}</td>
                        <td>{variant.barcode}</td>
                        <td className="d-flex justify-content-center">
                          <i
                            className="bx bx-pencil"
                            style={{
                              fontSize: "22px",
                              fontWeight: "bold",
                              cursor: "pointer",
                              marginRight: "5px",
                            }}
                            onClick={() => handleEditVariant(variant, vIndex)}
                          ></i>
                          <i
                            className="bx bx-trash"
                            style={{
                              fontSize: "22px",
                              fontWeight: "bold",
                              cursor: "pointer",
                            }}
                            onClick={() => deleteVariant(variant._id)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No Variants</p>
              )}
            </div>

            {role === "client_admin" ||
            role === "firm_admin" ||
            role === "employee" ||
            role === "super_admin" ? (
              <div className="d-flex justify-content-between mt-2 gap-2">
                <Button
                  color="primary"
                  onClick={() => {
                    setVariantModalOpen(true);
                    setVariant({
                      variationType: "",
                      optionLabel: "",
                      price: "",
                      stock: "",
                      sku: "",
                      barcode: "",
                    });
                    setVariantIndex(null);
                  }}
                >
                  Add Variant
                </Button>
                <Button
                  className=" ml-2"
                  color="primary"
                  onClick={() =>
                    updateItem({
                      name: selectedItem.name,
                      description: selectedItem.description,
                      qtyType: selectedItem.qtyType,
                      quantity: selectedItem.quantity,
                      manufacturer: selectedItem.manufacturer,
                      brand: selectedItem.brand,
                      costPrice: selectedItem.costPrice,
                      sellingPrice: selectedItem.sellingPrice,
                      vendor: selectedItem.vendor,
                      type: selectedItem.type,
                      taxId: selectedItem.tax?.taxId || null, 
                      selectedTaxTypes: selectedItem.tax?.selectedTaxTypes || [],  
                      itemCurrency: selectedItem.itemCurrency,
                      ProductHsn: selectedItem.ProductHsn,
                    })
                  }                    
                >
                  Update Item
                </Button>
              </div>
            ) : (
              <span>hi</span>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ItemDetailModal;
