import React, { useEffect, useState } from "react";
import { Table, Modal, ModalHeader, ModalBody, Button, Row, Col, } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import VariantModal from "./VariantModal";
import axiosInstance from "../../utils/axiosInstance";
import ItemDetailModal from "../../Modal/ItemDetailModal";
import { useNavigate } from "react-router-dom";
import { getInventoryItems, updateInventoryItemById } from "../../apiServices/service";
import { RiseLoader, ScaleLoader } from "react-spinners";
import FirmSwitcher from "../Firms/FirmSwitcher";
import { BackButton } from "../../components/Common/BackButton";
import ConfirmationModal from "../../Modal/ConfirmationModal";
function InventoryTable() {
  const [inventoryData, setInventoryData] = useState([]);
  const [firmCurrency, setFirmCurrency] = useState(null);
  const [filteredInventoryData, setFilteredInventoryData] = useState(inventoryData);
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [customItemsPerPage, setCustomItemsPerPage] = useState("");
  const [variant, setVariant] = useState({ variationType: "", optionLabel: "", price: "", stock: "", sku: "", barcode: "", });
  const role = JSON.parse(localStorage.getItem("authUser"))?.response?.role || "";
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventoryData.slice(indexOfFirstItem, indexOfLastItem);
  const [variantIndex, setVariantIndex] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const token = JSON.parse(localStorage.getItem("authUser")).token;
  const userId = JSON.parse(localStorage.getItem("authUser")).response.adminId;
  const authuser = JSON.parse(localStorage.getItem("authUser")).response;
  const isDemo = authuser?.isDemo;

  const blockIfDemo = (actionName) => {
    if (isDemo) {
      toast.error(`Demo accounts cannot ${actionName}`);
      return true;
    }
    return false;
};
  const firmId = authuser?.adminId;
  useEffect(() => {
    if (!selectedFirmId) {
      setSelectedFirmId(firmId);
    }

    const fetchInventoryData = async () => {
      setLoading(true);
      try {
        const response = await getInventoryItems(selectedFirmId);
        setInventoryData(response.data || []);
        setFirmCurrency(response.currency || "INR");
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        toast.error("Failed to fetch inventory items.");
      }
      setLoading(false);
    };

    fetchInventoryData();
  }, [selectedFirmId, trigger]);

  const [defaultFirm, setDefaultFirm] = useState('');
  useEffect(() => {
    const firm = JSON.parse(localStorage.getItem("defaultFirm"));
    if (firm) {
      setDefaultFirm(firm); // firmId and companyTitle come from here
    }
  }, [selectedFirmId]);
  const currencyOptions = [
    { code: "INR", symbol: "INR", name: "Indian Rupee" },
    { code: "AED", symbol: "AED", name: "UAE Dirham" },
    { code: "SAR", symbol: "SAR", name: "Saudi Riyal" },
    { code: "MYR", symbol: "MYR", name: "Malaysian Ringgit" },
    { code: "USD", symbol: "USD", name: "US Dollar" },
  ];

  const getCurrencyDetails = (currencyCode) => {
    const currency = currencyOptions.find((option) => option.code === currencyCode);
    return currency ? currency.symbol : currencyCode;
  };


  const refetchItems = () => {
    setTrigger((prev) => prev + 1);
  };
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredInventoryData.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);


  const handleItemsPerPageChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCustomItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  const handleCustomItemsPerPage = () => {
    const value = parseInt(customItemsPerPage, 10);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1);
    } else {
      toast.error("Please enter a valid number of items per page.");
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    console.log(item);
    // console.log(selectedItem.vendor.name);
    setModalOpen(true);
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariant((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleDeleteInventory = async (item) => {
    try {
      await axiosInstance.delete(
        `${process.env.REACT_APP_URL}/inventory/delete-item/${item._id}`

      );
      setTrigger((prev) => prev + 1);
      // setModalOpen(!modalOpen);
    } catch (error) {
      console.error("Error deleting Inventory:", error);
    }
  };

  const handleAddItemPage = () => {
    if (!selectedFirmId) {
      toast.info("Please add/select a business first to continue adding items");
      return;
    }
    navigate("/add-new-product");
  };

  const addOrUpdateVariant = async () => {
    if (
      variant.variationType &&
      variant.optionLabel &&
      variant.price &&
      variant.stock

    ) {
      try {
        let response;
        if (variantIndex !== null) {
          // Update existing variant
          response = await axiosInstance.put(
            `${process.env.REACT_APP_URL}/inventory/update-item/${selectedItem._id}`,
            {
              variants: [
                {
                  _id: selectedItem.variants[variantIndex]._id,
                  ...variant,
                },
              ],
            }
          );

          const updatedVariants = [...selectedItem.variants];
          updatedVariants[variantIndex] = { ...variant, _id: updatedVariants[variantIndex]._id };
          setSelectedItem({
            ...selectedItem,
            variants: updatedVariants,
          });
        } else {
          // Add new variant
          response = await axiosInstance.put(
            `${process.env.REACT_APP_URL}/inventory/add-variant/${selectedItem._id}`,

            variant
          );

          setSelectedItem({
            ...selectedItem,
            variants: [...selectedItem.variants, variant],
          });
        }

        setTrigger((prev) => prev + 1);
        setModalOpen(!modalOpen);
        toast.success(response.message);

      } catch (error) {
        console.error("Error adding or updating variant:", error);
      }

      setVariant({
        variationType: "",
        optionLabel: "",
        price: "",
        stock: "",
        sku: "",
        barcode: "",
      });
      setVariantModalOpen(false);
    } else {
      toast.error("Please fill in all variant details");
    }
  };


  const deleteVariant = async (variantId) => {
    if (selectedItem) {
      try {
        await axiosInstance.delete(
          `${process.env.REACT_APP_URL}/inventory/${selectedItem._id}/delete-variant/${variantId}`);
        setSelectedItem((prevState) => ({
          ...prevState,
          variants: prevState.variants.filter((v) => v._id !== variantId),
        }));
        setTrigger((prev) => prev + 1);
        setModalOpen(!modalOpen);
        toast.success("Variant deleted successfully!");
      } catch (error) {
        console.error("Error deleting variant:", error);
      }
    }
  };

const updateItem = async (updatedFields) => {
  try {
    const data = await updateInventoryItemById(
      selectedItem._id,
      { ...updatedFields, type: selectedItem.type }
    );
    setSelectedItem(prev => ({ ...prev, ...updatedFields, type: selectedItem.type }));
    toast.success(data.message);
    setModalOpen(!modalOpen);
    setTrigger(prev => prev + 1);
  } catch (error) {
    console.error("Error updating item:", error);
  }
};
  const handleEditVariant = (variant, index) => {
    console.log("Editing Variant:", variant);
    console.log("Variant Index:", index);
    setVariant(variant);
    setVariantIndex(index);
    setVariantModalOpen(true);
  };

  const handleSortByType = (type) => {
    if (type === " ") {
      setFilteredInventoryData(inventoryData);
    }

    if (!type) {
      setFilteredInventoryData(inventoryData);
    } else {
      const sortedData = inventoryData.filter((item) => item.type === type);
      setFilteredInventoryData(sortedData);
    }
  };

  useEffect(() => {
    setFilteredInventoryData(inventoryData);
  }, [inventoryData]);


  useEffect(() => {
    handleSortByType(" ");
  }, []);

const [filterOptions, setFilterOptions] = useState({
  sortBy: "name",
  order: "asc",
  minPrice: "",
  maxPrice: "",
  brandId: "",
  vendorId: "",
  manufacturerId: "",
  taxId: ""
});

const brandOptions = Array.from(
  new Map(inventoryData
    .filter(item => item.brand?._id)
    .map(item => [item.brand._id, { id: item.brand._id, name: item.brand.name }])
  ).values()
);
const vendorOptions = Array.from(
  new Map(inventoryData
    .filter(item => item.vendor?._id)
    .map(item => [item.vendor._id, { id: item.vendor._id, name: item.vendor.name }])
  ).values()
);

const manufacturerOptions = Array.from(
  new Map(inventoryData
    .filter(item => item.manufacturer?._id)
    .map(item => [item.manufacturer._id, { id: item.manufacturer._id, name: item.manufacturer.name }])
  ).values()
);
const taxOptions = Array.from(
  new Map(
    inventoryData
      .filter(item => item.tax?.taxId?._id)
      .map(item => [
        item.tax.taxId._id,
        { id: item.tax.taxId._id, name: item.tax.taxId.taxName }
      ])
  ).values()
);

  const handleFilterChange = (field, value) => {
    setFilterOptions((prev) => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
let filtered = [...inventoryData];

// 1️⃣ Apply multi-select filters first
if (filterOptions.brandId) {
  filtered = filtered.filter(item => item.brand?._id === filterOptions.brandId);
}
if (filterOptions.vendorId) {
  filtered = filtered.filter(item => item.vendor?._id === filterOptions.vendorId);
}
if (filterOptions.manufacturerId) {
  filtered = filtered.filter(item => item.manufacturer?._id === filterOptions.manufacturerId);
}
if (filterOptions.taxId) {
  filtered = filtered.filter(item => item.tax?.taxId?._id === filterOptions.taxId);
}

// 2️⃣ Then apply the main sortBy filter logic
switch (filterOptions.sortBy) {
  case "low_stock":
    filtered = filtered.filter(item => item.quantity < 5);
    break;

  case "category":
    filtered.sort((a, b) => {
      const aVal = a.category?.name?.toLowerCase() || "";
      const bVal = b.category?.name?.toLowerCase() || "";
      return filterOptions.order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    break;

  case "vendor":
    filtered.sort((a, b) => {
      const aVal = a.vendor?.name?.toLowerCase() || "";
      const bVal = b.vendor?.name?.toLowerCase() || "";
      return filterOptions.order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    break;

  case "manufacturer":
    filtered.sort((a, b) => {
      const aVal = a.manufacturer?.name?.toLowerCase() || "";
      const bVal = b.manufacturer?.name?.toLowerCase() || "";
      return filterOptions.order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    break;

  case "brand":
    filtered.sort((a, b) => {
      const aVal = a.brand?.name?.toLowerCase() || "";
      const bVal = b.brand?.name?.toLowerCase() || "";
      return filterOptions.order === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    break;

  case "selling_price":
    const min = parseFloat(filterOptions.minPrice) || 0;
    const max = parseFloat(filterOptions.maxPrice) || Infinity;
    filtered = filtered.filter(item =>
      item.sellingPrice >= min && item.sellingPrice <= max
    );
    break;

  case "name":
  default:
    filtered.sort((a, b) => {
      const nameA = a.name?.toLowerCase() || "";
      const nameB = b.name?.toLowerCase() || "";
      return filterOptions.order === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
    break;
}

setFilteredInventoryData(filtered);

};

  useEffect(() => {
    applyFilters();
  }, [filterOptions, inventoryData]);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const toggleFilterDropdown = () => setShowFilterDropdown(!showFilterDropdown);

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs
          title="Product & Inventory"
          breadcrumbItem="Product List"
        />

        <div className="d-flex flex-wrap justify-content-start align-items-center gap-2 mb-3" >

          {role === "client_admin" ? (
            <FirmSwitcher selectedFirmId={selectedFirmId} onSelectFirm={setSelectedFirmId} />
          ) : null

          }

          <i className='bx bx-refresh cursor-pointer' style={{ fontSize: "24.5px", fontWeight: "bold", color: "black", transition: "color 0.3s ease" }} onClick={refetchItems} onMouseEnter={(e) => e.target.style.color = "green"} onMouseLeave={(e) => e.target.style.color = "black"}></i>

          <label htmlFor="itemsPerPageSelect" className="m-0">Items per page:</label>
          <select
            id="itemsPerPageSelect"
            className="form-select"
            style={{ width: "auto", maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }}
            onChange={handleItemsPerPageChange}
          >
            <option value="10"  >10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="70">70</option>
            <option value="100">100</option>
          </select>

          <label htmlFor="customItemsInput" className="m-0">Or enter custom:</label>
          <input
            id="customItemsInput"
            type="number"
            min="1"
            value={customItemsPerPage}
            onChange={(e) => setCustomItemsPerPage(e.target.value)}
            className="form-control"
            style={{ width: "100px", maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }}
          />
          <Button color="primary" className="p-2" style={{ maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }} onClick={handleCustomItemsPerPage}>
            Set
          </Button>

          {role !== "accountant" ? (
            <Button
              color="primary"
              className="p-2"
              style={{ maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }}
              onClick={handleAddItemPage}
            >
              Add Item
            </Button>
          ) : null}



          <select
            type="select"
            className="form-select"
            style={{ width: "auto", maxHeight: "27.13px", fontSize: "10.5px", lineHeight: "1" }}
            onChange={(e) => handleSortByType(e.target.value)}
          >
            <option value="">All Items</option>
            <option value="raw_material" className="table-raw-materials">Raw Material</option>
            <option value="finished_good" className="table-row-blue">Finished Goods</option>
          </select>
          <span className="badge bg-success p-2 d-flex align-items-center">Total Items: {inventoryData.length}</span>
          <div className="d-flex flex-wrap justify-content-start align-items-center gap-2 mb-3" style={{ position: "relative" }} >
            <i
              className="mdi mdi-filter"
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "5px 7px",
                border: "1px solid #ccc",
              }}
              onClick={toggleFilterDropdown}
            />



          </div>
        </div>
          {showFilterDropdown && (
              <div className="show filter-dropdown" >
              {/* Row 1: Sort By & Order */}
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label>Sort By:</label>
                  <select
                    value={filterOptions.sortBy}
                    onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                    className="form-control"
                  >
                    <option value="name">Name</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="category">Category</option>
                    <option value="vendor">Vendor</option>
                    <option value="brand">Brand</option>
                    <option value="selling_price">Selling Price (range)</option>
                  </select>
                </div>

                {["name", "category", "vendor", "brand"].includes(filterOptions.sortBy) && (
                  <div style={{ flex: 1 }}>
                    <label>Order:</label>
                    <select
                      value={filterOptions.order}
                      onChange={(e) => handleFilterChange("order", e.target.value)}
                      className="form-control"
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Row 2: Brand / Vendor / Manufacturer */}
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              <div style={{ flex: 1 }}>
                <label>Brand:</label>
                <select
                  value={filterOptions.brandId || ""}
                  onChange={(e) => handleFilterChange("brandId", e.target.value)}
                  className="form-control"
                >
                  <option value="">All Brands</option>
                  {brandOptions.map(brand => (
                    <option key={brand.id} value={brand.id}>{brand.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label>Vendor:</label>
                <select
                  value={filterOptions.vendorId || ""}
                  onChange={(e) => handleFilterChange("vendorId", e.target.value)}
                  className="form-control"
                >
                  <option value="">All Vendors</option>
                  {vendorOptions.map(v => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label>Manufacturer:</label>
                <select
                  value={filterOptions.manufacturerId || ""}
                  onChange={(e) => handleFilterChange("manufacturerId", e.target.value)}
                  className="form-control"
                >
                  <option value="">All Manufacturers</option>
                  {manufacturerOptions.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label>Tax:</label>
                <select
                  value={filterOptions.taxId || ""}
                  onChange={(e) => handleFilterChange("taxId", e.target.value)}
                  className="form-control"
                >
                  <option value="">All Taxes</option>
                  {taxOptions.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

            </div>

              {/* Row 3: Selling Price */}
              {filterOptions.sortBy === "selling_price" && (
                <div style={{ marginTop: "10px" }}>
                  <label>Selling Price Range:</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="number"
                      placeholder="Min"
                      className="form-control"
                      value={filterOptions.minPrice || ""}
                      onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="form-control"
                      value={filterOptions.maxPrice || ""}
                      onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
            {/* <RiseLoader color="#0d4251" /> */}
            <ScaleLoader color="#0d4251" />
          </div>
        ) : (

          <div className="table-responsive">
            <Table bordered className="mb-0">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Brand</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    const rowClass =
                      item.type === "raw_material" ? "table-raw-materials" :
                        item.type === "finished_good" ? "table-row-blue" : "table-row-yellow";

                    return (
                      <tr key={index} className={rowClass}>
                        <td className={rowClass} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}>{item.name}</td>
                        <td className={rowClass} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}>{item.description}</td>
                        <td className={rowClass} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}>{item.quantity} {item.qtyType}</td>
                        <td className={rowClass} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}>{item.brand?.name}</td>
                        <td className={rowClass} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}>{getCurrencyDetails(firmCurrency)} {item.costPrice?.toFixed(2)}</td>
                        <td className={rowClass} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}>{getCurrencyDetails(firmCurrency)} {item.sellingPrice?.toFixed(2)}</td>
                        <td> 
                          {role === "accountant" ? null : (
                            <i className="bx bx-edit" style={{ fontSize: "22px", cursor: "pointer", marginLeft: "5px" }} onClick={() => { if (blockIfDemo("edit inventory")) return; handleViewDetails(item); }}></i>
                          )}
                          <i className="bx bx-trash" style={{ fontSize: "22px", cursor: "pointer", marginLeft: "5px" }} onClick={() => { if (blockIfDemo("delete inventory")) return; setItemToDelete(item); setConfirmModal(true); }}></i>
                          
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No inventory items found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        )
        }

          <ConfirmationModal
            isOpen={confirmModal}
            toggle={() => setConfirmModal(false)}
            selectedUser={itemToDelete}
            action="delete"
            onConfirm={() => {
              if (itemToDelete) {
                handleDeleteInventory(itemToDelete);
              }
              setConfirmModal(false);
            }}
          />

        <div className="pagination-controls d-flex gap-2 mt-2">
          {pageNumbers.map(number => (
            <Button key={number} onClick={() => paginate(number)} className={currentPage === number ? "btn-primary" : "btn-secondary"}>
              {number}
            </Button>
          ))}
        </div>
        <ItemDetailModal
          companyTitle={defaultFirm?.companyTitle}
          setVariantIndex={setVariantIndex}
          setVariant={setVariant}
          setVariantModalOpen={setVariantModalOpen}
          setSelectedItem={setSelectedItem}
          deleteVariant={deleteVariant}
          updateItem={updateItem}
          handleEditVariant={handleEditVariant}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          selectedItem={selectedItem}
          firmId={firmId}
          selectedFirmId={selectedFirmId}
        />

        <VariantModal
          isOpen={variantModalOpen}
          toggleModal={() => setVariantModalOpen(!variantModalOpen)}
          variant={variant}
          qtyType={selectedItem?.qtyType} 
          handleVariantChange={handleVariantChange}
          addVariant={addOrUpdateVariant}
        />
      </div>
    </React.Fragment>
  );
}

export default InventoryTable;
