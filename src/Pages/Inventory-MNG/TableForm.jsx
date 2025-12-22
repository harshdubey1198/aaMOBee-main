import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, CardBody, FormGroup, Label, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter, Tooltip } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import VariantModal from "./VariantModal";
import hsnData from "../../data/hsn.json";
import BrandModal from "../../Modal/BrandModal";
import ManufacturerModal from "../../Modal/ManufacturerModal";
import FetchBrands from "./FetchBrands";
import FetchManufacturers from "./fetchManufacturers";
import { createFirmIndustryService, createItem, getItemCategories, getItemCategoriesmain, getItemSubCategories, getTaxes, getTaxesmain, getUserServices, getVendors, getVendorsmain } from "../../apiServices/service";
import Select from "react-select";
import VendorModal from "../../Modal/VendorModal";
import FirmSwitcher from "../Firms/FirmSwitcher";
import CategoryModal from "../../components/InventoryComponents/CategoryModal";
import TaxationModal from "../../Modal/taxationModal";
import { BackButton } from "../../components/Common/BackButton";

const InventoryItemForm = ({isModal}) => {
  // States for tooltip visibility
  console.log("isModal : ",isModal)
  const [categoryTooltipOpen, setCategoryTooltipOpen] = useState(false);
  const [brandTooltipOpen, setBrandTooltipOpen] = useState(false);
  const [manufacturerTooltipOpen, setManufacturerTooltipOpen] = useState(false);
  const [vendorTooltipOpen, setVendorTooltipOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryFormValues, setCategoryFormValues] = useState({
    categoryName: "",
    description: "",
    parentId: ""
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const toggleCategoryTooltip = () => setCategoryTooltipOpen(!categoryTooltipOpen);
  const toggleBrandTooltip = () => setBrandTooltipOpen(!brandTooltipOpen);  
  const toggleManufacturerTooltip = () => setManufacturerTooltipOpen(!manufacturerTooltipOpen);
  const toggleVendorTooltip = () => setVendorTooltipOpen(!vendorTooltipOpen);

  const createdBy = JSON.parse(localStorage.getItem("authUser")).response._id;
  const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.adminId || JSON.parse(localStorage.getItem('authUser'))?.response?.firmId;
  const role = JSON.parse(localStorage.getItem("authUser")).response.role;
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;
  const token = JSON.parse(localStorage.getItem("authUser")).token;
  const navigate = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [taxModalOpen, setTaxModalOpen] = useState(false);
  const [triggerTaxFetch, setTriggerTaxFetch] = useState(0);
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [vendorData, setVendorData] = useState({
    name: "",
    contactPerson: "",
    firmId: idToUse,
    phone: "",
    email: "",
    address: { h_no: "", city: "", state: "", zip_code: "", country: "", nearby: "" }
  });
  const [editIndex, setEditIndex] = useState(null);
  const [variant, setVariant] = useState({ variationType: "", optionLabel: "", price: "", stock: "", sku: "", barcode: "", });
  const [taxes, setTaxes] = useState([]);
  const [selectedTaxTypes, setSelectedTaxTypes] = useState([]);
  const [variants, setVariants] = useState([]);
  // const toggleModal = () => setModal(!modal);
  const [subcategories, setSubcategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [firmCurrency, setFirmCurrency] = useState("");
  const [formValues, setFormValues] = useState({ name: "", firmId: idToUse, itemCurrency: firmCurrency, type: "", description: "", costPrice: "", sellingPrice: "", supplier: "", manufacturer: "", brand: "", ProductHsn: "", qtyType: "", categoryId: "", subcategoryId: "", vendorId: "", quantity: "", taxId: "", selectedTaxTypes: [], });
  // console.log("Manufacturer Details : ", formValues.manufacturer);
  // console.log("Vendor Details : ", formValues.vendorId);
  // console.log("Brand Details : ", formValues.brand);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tosendTaxtype, setToSendTaxtype] = useState([]);
  const [brands, setBrands] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [triggerManufacturer, setTriggerManufacurer] = useState(0)
  const [triggerBrand, setTriggerBrand] = useState(0)
  const [triggerSuggestions, setTriggerSuggestions] = useState(0)
  const [triggerVendor, setTriggerVendor] = useState(0)
  const handleBrandsFetched = (fetchedBrands) => {
    setBrands(fetchedBrands);
  };
  const toggleTaxModal = () => setTaxModalOpen(!taxModalOpen);

  const handleManufacturersFetched = (fetchedManufacturers) => {
    const selfEmail = JSON.parse(localStorage.getItem("authUser"))?.response?.email;

    // Move self-manufacturer to top (if exists)
    const sortedManufacturers = [...fetchedManufacturers].sort((a, b) => {
      if (a.email === selfEmail) return -1;
      if (b.email === selfEmail) return 1;
      return 0;
    });

    setManufacturers(sortedManufacturers);
  };

  const [suggestedItems, setSuggestedItems] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [customService, setCustomService] = useState("");
  const [isOtherSelected, setIsOtherSelected] = useState(false);

const fetchItemSuggestions = async (firmId) => {
  if (!firmId) return;

  try {
    const response = await getUserServices(firmId);
    setSuggestedItems(response.data.services || []);
    console.log("Fetched Item Suggestions:", response.data.services);
  } catch (error) {
    console.error("Failed to fetch item suggestions:", error);
     // toast.error("Failed to fetch item suggestions.");
  }
};

 useEffect(() => {
  const firmToUse = role === "client_admin" ? selectedFirmId : firmId;

  if ((role === "client_admin" && selectedFirmId) || role === "firm_admin") {
        setSuggestedItems([]);
    fetchItemSuggestions(firmToUse); 
    fetchVendors();

    setFormValues(prev => ({
      ...prev,
      firmId: firmToUse,
      name: "",
      categoryId: "",
      subcategoryId: "",
      vendorId: "",
    }));

    setIsOtherSelected(false);
    setCustomService("");
  }
}, [selectedFirmId]);

  const handleVendorsFetched = (fetchedVendors) => {
    setVendors(fetchedVendors);
  };

  const handleReset = () => {
    setFormValues({ name: "", type: "", description: "", costPrice: "", sellingPrice: "", supplier: "", manufacturer: "", brand: "", ProductHsn: "", qtyType: "", categoryId: "", subcategoryId: "", vendorId: "", quantity: "", taxId: "", selectedTaxTypes: [], });
    setVariants([]);
  };

  const toggleBrandModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleCategoryModal = () => {
    setModalOpen(!modalOpen);
  };
  const toggleManufacturerModal = () => {
    setModal(!modal);
  };
  const toggleVendorModal = () => {
    setVendorModalOpen(!vendorModalOpen);
    setVendorData({
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: { h_no: "", city: "", state: "", zip_code: "", country: "", nearby: "" }
    });
  };
  // useEffect(() => {
  //   if (role === "client_admin" && firmId && !selectedFirmId) {
  //     setSelectedFirmId(firmId);
  //   }
  // }, [firmId, role, selectedFirmId]);
  useEffect(() => {
    const fetchFirmDetails = async () => {
      if (!idToUse) return;
      try {
        const response = await axiosInstance.get(`${process.env.REACT_APP_URL}/auth/getFirm/${idToUse}`);
        const currency = response[0]?.currency || null;
        setFirmCurrency(currency);
        console.log("Firm Currency:", currency);

        setFormValues(prev => ({
          ...prev,
          itemCurrency: prev.itemCurrency || currency
        }));
      } catch (error) {
        console.error("Failed to fetch firm details:", error.message);
        toast.error("Failed to load firm details");
      }
    };

    fetchFirmDetails();
  }, [idToUse]);

  const fetchVendors = async () => {
    try {
      const response = await getVendorsmain(idToUse);
      setVendors(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch vendors.");
      console.error(error.message);
    }
  };
  useEffect(() => {
    if (!idToUse) return;

    const fetchCategories = async () => {
      try {
        const response = await getItemCategoriesmain(idToUse);
        const parentCategories = response.data.length > 0
          ? response.data.filter(category => category.parentId === null)
          : [];
        setCategories(parentCategories);
      } catch (error) {
        console.error(error.message);
      }
    };

    const fetchTaxes = async () => {
      try {
        const response = await getTaxesmain(idToUse);
        setTaxes(response.data || []);
      } catch (error) {
        toast.error("Failed to fetch taxes.");
        console.error(error.message);
      }
    };


    fetchCategories();
    fetchTaxes();
    fetchVendors();
  }, [idToUse ,triggerTaxFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setVariant((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTaxChange = (e) => {
    setFormValues({
      ...formValues,
      taxId: e.target.value,
      selectedTaxTypes: [],
    });
  };

  const addOrUpdateVariant = () => {
    if (
      variant.variationType &&
      variant.optionLabel &&
      variant.price &&
      variant.stock &&
      variant.sku &&
      variant.barcode
    ) {
      if (editIndex !== null) {
        const updatedVariants = [...variants];
        updatedVariants[editIndex] = variant;
        setVariants(updatedVariants);
        setEditIndex(null);
      } else {
        setVariants([...variants, variant]);
      }
      setVariant({ variationType: "", optionLabel: "", price: "", stock: "", sku: "", barcode: "", });
      setVariantModalOpen(false);
    } else {
      toast.error("Please fill in all variant details");
    }
  };

  const editVariant = (index) => {
    setVariant(variants[index]);
    setEditIndex(index);
    setVariantModalOpen(true);
  };

  const deleteVariant = (index) => {
    const updatedVariants = variants.filter((_, i) => i !== index);
    setVariants(updatedVariants);
  };

  const handleCategory = async (e) => {
    const { value } = e.target;
    setFormValues((prevState) => ({
      ...prevState,
      categoryId: value,
      subcategoryId: "",
      ProductHsn: prevState.ProductHsn ? prevState.ProductHsn : "",
    }));
    setSubcategories([]);
    const selectedCategory = categories.find((category) => category._id === value);
    if (selectedCategory) {
      const hsnNumber = hsnData.find((hsn) =>
        hsn.description.toLowerCase().includes(selectedCategory.categoryName.toLowerCase())
      );
      if (hsnNumber) {
        setFormValues((prevState) => ({
          ...prevState,
          ProductHsn: hsnNumber ? hsnNumber.hsn : "",
        }));
      } else {
        setFormValues((prevState) => ({
          ...prevState,
          ProductHsn: "",
        }));
      }
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        ProductHsn: "",
      }));
    }

    if (value) {
      try {
        const response = await getItemSubCategories(value);
        const subcategoryData = response.data;
        if (subcategoryData.length === 0) {
          toast.info("This category doesn't have any subcategories.");
        } else {
          setSubcategories(subcategoryData);
        }

      } catch (error) {
        // toast.error("Failed to fetch subcategories.");
        console.error(error.message);
      }
    } else {
      setSubcategories([]);
    }
  };
  const defaultFirm = JSON.parse(localStorage.getItem("defaultFirm"));
  const selfManufacturer = {
    _id: defaultFirm?.firmId,
    name: `Self (${defaultFirm?.companyTitle || "Our Firm"})`
  };
  const selfVendor = {
    _id: defaultFirm?.firmId,
    name: `Self (${defaultFirm?.companyTitle || "Our Firm"})`
  };
  const selfBrand = {
    _id: defaultFirm?.firmId,
    name: `Self (${defaultFirm?.companyTitle || "Our Firm"})`
  };

  useEffect(() => {
    const updates = {};

    if (
      manufacturers.length === 0 &&
      selfManufacturer?._id &&
      !formValues.manufacturer
    ) {
      updates.manufacturer = selfManufacturer._id;
    }

    if (
      vendors.length === 0 &&
      selfVendor?._id &&
      !formValues.vendorId
    ) {
      updates.vendorId = selfVendor._id;
    }

    if (Object.keys(updates).length > 0) {
      setFormValues((prev) => ({
        ...prev,
        ...updates,
      }));
    }
  }, [manufacturers, vendors, selfManufacturer, selfVendor ,setSelectedFirmId]);
  
  useEffect(() => {
    if (
      brands.length === 0 &&
      selfBrand?._id &&
      !formValues.brand
    ) {
      setFormValues((prev) => ({
        ...prev,
        brand: selfBrand._id,
      }));
    }
  }, [brands, selfBrand]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (isOtherSelected && customService.trim()) {
      setFormValues(prev => ({
        ...prev,
        name: customService.trim(),
      }));
    }
    if ((!formValues.name && !customService) || !formValues.categoryId) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    
    try {
      const payload = {
        ...formValues,
        name: isOtherSelected ? customService.trim() : formValues.name,
        vendor: formValues.vendorId, 
        firmId: idToUse,
        variants
      };

      // const response = await axiosInstance.post(`${process.env.REACT_APP_URL}/inventory/create-item/${createdBy}`, payload);
      const response = await createItem(payload, createdBy);

      setFormValues({ name: "", description: "", type: "", costPrice: "", sellingPrice: "", ProductHsn: "", qtyType: "", categoryId: "", subcategoryId: "", vendorId: "", quantity: "", brand: "", manufacturer: "", supplier: "", taxId: "", selectedTaxTypes: [] });
      setVariants([]);
      setCustomService("");
      handleReset();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.error);
      // console.error("error",error);
    } finally {
      setLoading(false);
    }
  };

    const handleCreateCustomService = async () => {
    if (!customService.trim()) {
      toast.error("Please enter a valid service name");
      return;
    }

    const newService = {
      label: customService,
      value: customService.toLowerCase().replace(/\s+/g, "_")
    };

    const payload = {
      firmId: idToUse,
      createdBy: createdBy,
      industry: "service",
      sub_industry: "it_services",
      services: [newService],
      status: "active",
      is_verified: false
    };

    try {
      const response = await createFirmIndustryService(payload);

      if (response?.message) {
        toast.success(response.message);

        setSuggestedItems(prev => [...prev, newService]);

        setFormValues((prev) => ({
          ...prev,
          name: newService.label,
        }));
      
        setIsOtherSelected(false);
        setCustomService("");

        setTriggerSuggestions(prev => prev + 1);
      } else {
        toast.error("Failed to add service");
      }
    } catch (err) {
      console.error("Service creation failed", err);
      toast.error("Something went wrong while creating service");
    }
  };

  return (
    <React.Fragment>
      <FetchBrands firmId={idToUse} onBrandsFetched={handleBrandsFetched} triggerBrand={triggerBrand} />
      <FetchManufacturers firmId={idToUse} onManufacturersFetched={handleManufacturersFetched} triggerManufacturer={triggerManufacturer} />
      <div className={!isModal ? "page-content flex flex-col align-items-center justify-content-center"  : ""}>
        {!isModal && (
          <Breadcrumbs title="Product & Inventory" breadcrumbItem="Add New Product" />
        )}
        {/* <Container> */}
          <Row className={`w-100 ${!isModal ? "justify-content-center" : ""}`}>
            <Col lg={isModal ? 12 : 12} md={isModal ? 12 : 10}>
              <Card className={isModal ? "pt-0" : ""}>
                <CardBody className={isModal ? "w-100 pt-0" : ""}>
                 {!isModal && (<div className="d-flex justify-content-between align-items-center">
                    {/* <h4 className="card-title mb-4">Add Inventory Item</h4> */}
                     <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center gap-3 mb-3">
                                      <BackButton />
                                      {/* <h4 className="mb-0">Add Inventory Item</h4> */}
                                    </div>
                    {(role === "client_admin" && (
                      <Col lg={3} md={6} sm={12} className="m-text-center">
                        <FirmSwitcher
                          selectedFirmId={selectedFirmId}
                          onSelectFirm={setSelectedFirmId}
                        />
                      </Col>
                    ))}
                  </div>)}
                  <div className="d-none">
                        <FirmSwitcher
                          selectedFirmId={selectedFirmId}
                          onSelectFirm={setSelectedFirmId}
                        />
                  </div>

                  <form onSubmit={handleSubmit}>
                    <Row>
                      {/* Category Field */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="categoryId">
                            Category{' '}
                            <span className={categories.length === 0 ? 'text-danger' : 'text-success'}>
                              *
                            </span>
                          </Label>

                          <div className="d-flex align-items-center">
                            <select
                              id="categoryId"
                              name="categoryId"
                              value={formValues.categoryId}
                              onChange={handleCategory}
                              className="form-control"
                              style={{ flex: 1 }}
                              disabled={categories.length === 0}
                              onMouseEnter={toggleCategoryTooltip}  // Show tooltip when hovering over category input
                              onMouseLeave={toggleCategoryTooltip}  // Hide tooltip when mouse leaves
                              title="Top-level group for product filter"
                            >
                              <option value="">Select Category</option>
                              {categories.length > 0 &&
                                categories.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.categoryName}
                                  </option>
                                ))}
                            </select>

                            <i
                              className="bx bx-plus"
                              title="Add Category"
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: 'lightblue',
                                padding: '2px',
                                marginLeft: '5px',
                                borderRadius: '5px',
                              }}
                              onClick={() => setCategoryModalOpen(true)}
                            ></i>
                          </div>

                          {/* Category Tooltip */}
                          {categories.length === 0 && (
                            <Tooltip
                              placement="top"
                              isOpen={categoryTooltipOpen}
                              target="categoryId"
                              toggle={toggleCategoryTooltip}
                              style={{
                                backgroundColor: '#f39c12',  // Warning yellow
                                color: '#fff',               // White text color
                                borderRadius: '5px',         // Rounded corners
                                padding: '10px 15px',        // Adjust padding
                                fontSize: '14px',            // Adjust font size
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for effect
                                border: '2px solid #e67e22', // Dark orange border for warning effect
                              }}
                            >
                              Category Not Available? Please add using the "+" button.
                            </Tooltip>
                          )}
                        </FormGroup>
                      </Col>
                      
                        <CategoryModal
                          isOpen={categoryModalOpen}
                          toggle={() => setCategoryModalOpen(!categoryModalOpen)}
                          formValues={categoryFormValues}
                          setFormValues={setCategoryFormValues}
                          editMode={false}
                          selectedCategoryId={selectedCategoryId}
                          setSelectedCategoryId={setSelectedCategoryId}
                          parentCategories={categories}
                          refetchCategories={async () => {
                            try {
                              const response = await getItemCategoriesmain(idToUse);
                              const parentCategories = response.data.length > 0
                                ? response.data.filter(category => category.parentId === null)
                                : [];
                              setCategories(parentCategories);
                            } catch (error) {
                              toast.error("Failed to refresh categories");
                            }
                          }}
                          role={role}
                          selectedFirmId={selectedFirmId}
                        />
                      {
                        subcategories.length > 0 && (
                          <Col md={6}>
                            <FormGroup>
                              <Label htmlFor="subcategoryId">Subcategory</Label>
                              <div className="d-flex align-items-center">
                                <Input
                                  type="select"
                                  id="subcategoryId"
                                  name="subcategoryId"
                                  value={formValues.subcategoryId}
                                  onChange={handleChange}
                                  className="form-control"
                                  style={{ flex: 1, appearance: "none" }}
                                >
                                  <option value="">Select </option>
                                  {subcategories.length > 0 ? (
                                    subcategories.map((subcategory) => (
                                      <option key={subcategory._id} value={subcategory._id}>
                                        {subcategory.categoryName}
                                      </option>
                                    ))
                                  ) : (
                                    <option value="">No Subcategories Available</option>
                                  )}
                                </Input>

                                <i
                                  className="bx bx-refresh"
                                  style={{
                                    fontSize: "22px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    backgroundColor: "lightblue",
                                    padding: "5px",
                                    marginLeft: "8px",
                                    borderRadius: "5px",
                                  }}
                                  onClick={() => handleCategory({ target: { value: formValues.categoryId } })}
                                  title="Refresh Subcategories"
                                ></i>
                              </div>
                            </FormGroup>

                          </Col>
                        )
                      }

                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="name">Item Name</Label>
                          <Select
                            id="name"
                            name="name"
                            value={
                              isOtherSelected
                                ? { label: "Other", value: "other" }
                                : suggestedItems.find(option => option.label === formValues.name) || null
                            }
                            options={[...suggestedItems, { label: "Other", value: "other" }]}
                            placeholder="Enter Item Name"
                            isClearable
                            isSearchable
                            onChange={(selectedOption) => {
                              if (selectedOption?.value === "other") {
                                setIsOtherSelected(true);
                                setFormValues(prev => ({ ...prev, name: "" }));
                              } else {
                                setIsOtherSelected(false);
                                setFormValues(prev => ({
                                  ...prev,
                                  name: selectedOption ? selectedOption.label : ""
                                }));
                              }
                            }}
                          />

                          {isOtherSelected && (
                            <div className="d-flex align-items-center mt-2">
                              <Input
                                type="text"
                                placeholder="Enter custom service name"
                                value={customService}
                                onChange={(e) => setCustomService(e.target.value)}
                                className="form-control"
                                style={{ flex: 1 }}
                              />
                              <i
                                className="bx bx-plus"
                                style={{
                                  fontSize: "24px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                  backgroundColor: "lightblue",
                                  padding: "5px",
                                  marginLeft: "8px",
                                  borderRadius: "5px"
                                }}
                                title="Create new service"
                                onClick={handleCreateCustomService}
                              ></i>
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="description">Item Description</Label>
                          <Input type="text" id="description" name="description" placeholder="Enter item description" value={formValues.description} onChange={handleChange} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      {/* Brand Field */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="brand">
                            Brand{' '}
                            <span className={brands.length === 0 ? 'text-danger' : 'text-success'}>
                              *
                            </span>
                          </Label>

                          <div className="d-flex align-items-center">
                            <select
                              id="brand"
                              name="brand"
                              title="Name under which item is sold."
                              value={formValues.brand}
                              onChange={handleChange}
                              className="form-control"
                              style={{ flex: 1 }}
                              disabled={brands.length === 0 && !selfBrand._id}
                              onMouseEnter={toggleBrandTooltip}
                              onMouseLeave={toggleBrandTooltip}
                            >
                              <option value="">Select Brand</option>

                              {selfBrand._id && (
                                <option value={selfBrand._id}>
                                  {selfBrand.name}
                                </option>
                              )}

                              {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                  {brand.name}
                                </option>
                              ))}
                            </select>


                            <i
                              className="bx bx-plus"
                              title="Add Brand"
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: 'lightblue',
                                padding: '2px',
                                marginLeft: '5px',
                                borderRadius: '5px',
                              }}
                              onClick={toggleBrandModal}
                            ></i>
                          </div>

                          {/* Brand Tooltip */}
                          {brands.length === 0 && (
                            <Tooltip
                              placement="top"
                              isOpen={brandTooltipOpen}
                              target="brand"
                              toggle={toggleBrandTooltip}
                              style={{
                                backgroundColor: '#f39c12',  // Warning yellow
                                color: '#fff',               // White text color
                                borderRadius: '5px',         // Rounded corners
                                padding: '10px 15px',        // Adjust padding
                                fontSize: '14px',            // Adjust font size
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for effect
                                border: '2px solid #e67e22', // Dark orange border for warning effect
                              }}
                            >
                              Brand Not Available? Please add using the "+" button.
                            </Tooltip>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Manufacturer Field */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="manufacturer">
                            Manufacturer{' '}
                            <span className={manufacturers.length === 0 ? 'text-danger' : 'text-success'}>
                              *
                            </span>
                          </Label>

                          <div className="d-flex align-items-center">
                           <select
                              id="manufacturer"
                              name="manufacturer"
                              value={formValues.manufacturer}
                              onChange={handleChange}
                              className="form-control"
                              style={{ flex: 1 }}
                              disabled={manufacturers.length === 0 && !selfManufacturer._id}
                              onMouseEnter={toggleManufacturerTooltip}
                              onMouseLeave={toggleManufacturerTooltip}
                              title="Manufacturers are the parent or creators of the Product"
                            >
                              <option value="">Select Manufacturer</option>

                              {selfManufacturer._id && (
                                <option value={selfManufacturer._id}>
                                  {selfManufacturer.name}
                                </option>
                              )}

                              {manufacturers.length > 0 &&
                                manufacturers.map((manufacturer) => (
                                  <option key={manufacturer._id} value={manufacturer._id}>
                                    {manufacturer.name}
                                  </option>
                                ))}
                            </select>


                            <i
                              className="bx bx-plus"
                              title="Add Manufacturer"
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: 'lightblue',
                                padding: '2px',
                                marginLeft: '5px',
                                borderRadius: '5px',
                              }}
                              onClick={toggleManufacturerModal}
                            ></i>
                          </div>

                          {/* Manufacturer Tooltip */}
                          {manufacturers.length === 0 && (
                            <Tooltip
                              placement="top"
                              isOpen={manufacturerTooltipOpen}
                              target="manufacturer"
                              toggle={toggleManufacturerTooltip}
                              style={{
                                backgroundColor: '#f39c12',  // Warning yellow
                                color: '#fff',               // White text color
                                borderRadius: '5px',         // Rounded corners
                                padding: '10px 15px',        // Adjust padding
                                fontSize: '14px',            // Adjust font size
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for effect
                                border: '2px solid #e67e22', // Dark orange border for warning effect
                              }}
                            >
                              Manufacturer Not Available? Please add using the "+" button.
                            </Tooltip>
                          )}
                        </FormGroup>
                      </Col>

                      {/* Vendor Field */}
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="vendorId">
                            Vendor{' '}
                            <span className={vendors.length === 0 ? 'text-danger' : 'text-success'}>
                              *
                            </span>
                          </Label>

                          <div className="d-flex align-items-center">
                            <select
                              id="vendorId"
                              name="vendorId"
                              title="Vendors are the suppliers of the products"
                              value={formValues.vendorId}
                              onChange={handleChange}
                              className="form-control"
                              style={{ flex: 1 }}
                              disabled={vendors.length === 0 && !selfVendor._id}
                              onMouseEnter={toggleVendorTooltip}
                              onMouseLeave={toggleVendorTooltip}
                            >
                              <option value="">Select Vendor</option>

                              {/* ✅ Include Self Vendor */}
                              {selfVendor._id && (
                                <option value={selfVendor._id}>
                                  {selfVendor.name}
                                </option>
                              )}

                              {/* ✅ External Vendors */}
                              {vendors.map((vendor) => (
                                <option key={vendor._id} value={vendor._id}>
                                  {vendor.name}
                                </option>
                              ))}
                            </select>
                            <i
                              className="bx bx-plus"
                              title="Add Vendor"
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: 'lightblue',
                                padding: '2px',
                                marginLeft: '5px',
                                borderRadius: '5px',
                              }}
                              onClick={toggleVendorModal}
                            ></i>
                          </div>

                          {/* Vendor Tooltip */}
                          {vendors.length === 0 && (
                            <Tooltip
                              placement="top"
                              isOpen={vendorTooltipOpen}
                              target="vendorId"
                              toggle={toggleVendorTooltip}
                              style={{
                                backgroundColor: '#f39c12',  // Warning yellow
                                color: '#fff',               // White text color
                                borderRadius: '5px',         // Rounded corners
                                padding: '10px 15px',        // Adjust padding
                                fontSize: '14px',            // Adjust font size
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for effect
                                border: '2px solid #e67e22', // Dark orange border for warning effect
                              }}
                            >
                              Vendor Not Available? Please add using the "+" button.
                            </Tooltip>
                          )}
                        </FormGroup>
                      </Col>


                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="type">Product Type</Label>
                          <select id="type" name="type" value={formValues.type} onChange={handleChange} className="form-control" title="Raw/Finished Goods">
                            <option value="">Select Type</option>
                            <option value="raw_material">Raw Material</option>
                            <option value="finished_good">Finished Good</option>
                          </select>
                        </FormGroup>
                      </Col>

                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="costPrice">Cost Price</Label>
                          <Input type="number" id="costPrice" name="costPrice" placeholder="Enter cost price" value={formValues.costPrice} onChange={handleChange} />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="sellingPrice">Selling Price</Label>
                          <Input type="number" id="sellingPrice" name="sellingPrice" placeholder="Enter selling price" value={formValues.sellingPrice} onChange={handleChange} />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="itemCurrency">Item Currency</Label>
                          <select
                            id="itemCurrency"
                            name="itemCurrency"
                            value={formValues.itemCurrency || ""}
                            onChange={(e) =>
                              setFormValues({
                                ...formValues,
                                itemCurrency: e.target.value,
                              })
                            }
                            className="form-control"
                          >
                            <option value="" disabled>
                              Select Currency
                            </option>

                            {formValues.itemCurrency && (
                              <option value={formValues.itemCurrency} disabled>
                                {formValues.itemCurrency} (Current)
                              </option>
                            )}

                            {["INR", "AED", "SAR", "MYR"]
                              .filter((cur) => cur !== formValues.itemCurrency)
                              .map((cur) => (
                                <option key={cur} value={cur}>
                                  {cur}
                                </option>
                              ))}
                          </select>
                        </FormGroup>
                      </Col>

                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input type="number" id="quantity" name="quantity" placeholder="Enter quantity" value={formValues.quantity} onChange={handleChange} />
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="qtyType">Quantity Type</Label>
                          <select id="qtyType" name="qtyType" value={formValues.qtyType} onChange={handleChange} className="form-control">
                            <option value="">Select Quantity Type</option>
                            <option value="kg">Kilograms</option>
                            <option value="grams">Grams</option>
                            <option value="pcs">Pieces</option>
                            <option value="litre">Litre</option>
                            <option value="meters">Meters</option>
                            <option value="centimeters">Centimeters</option>
                            <option value="feet">Feet</option>
                            <option value="service">Service</option>
                          </select>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                     <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="tax">Tax</Label>
                          <div className="d-flex align-items-center">
                            <select
                              id="tax"
                              name="tax"
                              value={formValues.taxId}
                              onChange={handleTaxChange}
                              className="form-control"
                              style={{ flex: 1 }}
                            >
                              <option value="">Select Tax</option>
                              {taxes.length > 0 ? (
                                taxes.map((tax) => (
                                  <option key={tax._id} value={tax._id}>
                                    {tax.taxName}
                                  </option>
                                ))
                              ) : (
                                <option value="">No Taxes Available</option>
                              )}
                            </select>
                            <i
                              className="bx bx-plus"
                              style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                backgroundColor: 'lightblue',
                                padding: '2px',
                                marginLeft: '5px',
                                borderRadius: '5px',
                              }}
                              onClick={toggleTaxModal}
                            ></i>
                          </div>
                        </FormGroup>
                      </Col>

                      <TaxationModal
                          isOpen={taxModalOpen}
                          toggle={toggleTaxModal}
                          config={{
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          }}
                          userId={createdBy}
                          tax={null}
                          idToUse={idToUse}
                          onTaxCreatedOrUpdated={() => setTriggerTaxFetch(prev => prev + 1)}
                        />
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="ProductHsn">HSN</Label>
                          {/* <Input type="text" id="ProductHsn" name="ProductHsn" placeholder="Enter HSN" value={formValues.ProductHsn} /> */}
                          <Input type="text" id="ProductHsn" title="Harmonized System of Nomenclature" name="ProductHsn" placeholder="Enter HSN" value={formValues.ProductHsn} onChange={(e) => setFormValues({ ...formValues, ProductHsn: e.target.value })} />
                        </FormGroup>
                      </Col>
                      {formValues.taxId && (
                        <Row className="mt-3">
                          <Col md={6}>
                            <FormGroup>
                              <Label>Select Tax Components</Label>
                              <Select
                                isMulti
                                name="selectedTaxTypes"
                                value={formValues.selectedTaxTypes.map((id) => ({
                                  value: id,
                                  label: taxes
                                    .find((tax) => tax.taxRates.some((rate) => rate._id === id))
                                    ?.taxRates.find((rate) => rate._id === id)?.taxType +
                                    " - " +
                                    taxes
                                      .find((tax) => tax.taxRates.some((rate) => rate._id === id))
                                      ?.taxRates.find((rate) => rate._id === id)?.rate +
                                    "%",
                                }))}
                                onChange={(selectedOptions) => {
                                  const selectedIds = selectedOptions.map((option) => option.value);
                                  console.log("Selected Tax Type IDs:", selectedIds);

                                  setFormValues({
                                    ...formValues,
                                    selectedTaxTypes: selectedIds,
                                  });
                                }}
                                options={taxes
                                  .filter((tax) => tax._id === formValues.taxId)
                                  .flatMap((tax) =>
                                    tax.taxRates.map((taxRate) => ({
                                      value: taxRate._id,
                                      label: `${taxRate.taxType} - ${taxRate.rate}%`,
                                    }))
                                  )}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      )}
                    </Row>

                    <VariantModal isOpen={variantModalOpen} toggleModal={() => setVariantModalOpen(!variantModalOpen)} variant={variant} handleVariantChange={handleVariantChange} addVariant={addOrUpdateVariant} />
                    <Row className={isModal ? "" : "mt-3"}>
                      <Col md={12}>
                        <Button className="mx-2" color="primary" onClick={() => {
                          setVariantModalOpen(true);
                        }}>Add Variant</Button>
                        {/* <Button className="mx-2" color="primary" onClick={toggleBatchModal}>Add Batch</Button> */}
                        <Button className="mx-2" type="submit" color="success" disabled={loading}>{loading ? "Saving..." : "Submit"}</Button>
                        <Button className="mx-2" color="secondary" onClick={handleReset}>Reset</Button>
                      </Col>
                    </Row>
                  </form>

                  {variants.length > 0 && (
                    <div className="mt-4">
                      <h5 className="font-size-15 mb-3">Variants</h5>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Option</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>SKU</th>
                            <th>Barcode</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((variant, index) => (
                            <tr key={index}>
                              <td>{variant.variationType}</td>
                              <td>{variant.optionLabel}</td>
                              <td>{variant.price}</td>
                              <td>{variant.stock}</td>
                              <td>{variant.sku}</td>
                              <td>{variant.barcode}</td>
                              <td>
                                <i className="bx bx-edit mr-2" style={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }} onClick={() => editVariant(index)}></i>
                                <i className="bx bx-trash" style={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }} onClick={() => deleteVariant(index)}></i>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        {/* </Container> */}
        <BrandModal isOpen={modalOpen} toggle={toggleBrandModal} onBrandsFetched={handleBrandsFetched} firmId={idToUse} idToUse={idToUse} setTriggerBrand={setTriggerBrand} />
        <ManufacturerModal isOpen={modal} toggle={toggleManufacturerModal} setTriggerManufacurer={setTriggerManufacurer} idToUse={idToUse} />
        <VendorModal
          modalOpen={vendorModalOpen}
          toggleModal={toggleVendorModal}
          vendorData={vendorData}
          handleInputChange={(e) => {
            const { name, value } = e.target;
            if (name in vendorData.address) {
              setVendorData({ ...vendorData, address: { ...vendorData.address, [name]: value } });
            } else {
              setVendorData({ ...vendorData, [name]: value });
            }
          }}
          handleVendorSubmit={async () => {

            const payload = {
              ...vendorData,
            };

            // Add firmId only if client_admin
            if (role === "client_admin" && selectedFirmId) {
              payload.firmId = selectedFirmId;
            }


            try {
              const response = await fetch(`${process.env.REACT_APP_URL}/vendor/create-vendor/${createdBy}`, {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(payload),
              });

              const result = await response.json();

              if (response.ok && result.message === "Vendor created successfully") {
                console.log("Vendor created successfully");

                await fetchVendors();
                toast.success(result.message);

                setVendorModalOpen(false);
              } else {
                throw new Error(result.error || "Failed to create vendor");
              }
            } catch (error) {
              console.error(error);
              toast.error("Failed to create vendor.");
            }
          }}

          editMode={false}
        />
      </div>
    </React.Fragment>
  );
};

export default InventoryItemForm;
