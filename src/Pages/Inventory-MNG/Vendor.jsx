import React, { useState, useEffect } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Button, Col, Modal, ModalBody, ModalFooter, ModalHeader, Table } from "reactstrap";
import { toast } from "react-toastify";
import VendorModal from "../../Modal/VendorModal";
import { use } from "i18next";
import FirmSwitcher from "../Firms/FirmSwitcher";
import { BackButton } from "../../components/Common/BackButton";

function Vendor() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState(null);
  const [trigger, setTrigger] = useState(0);
  const [vendorData, setVendorData] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: { h_no: "", city: "", state: "", zip_code: "", country: "", nearby: "" }
  });

  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const token = authuser.token;
  const userId = authuser.response._id;
  const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.adminId || JSON.parse(localStorage.getItem('authUser'))?.response?.firmId;
  const role = JSON.parse(localStorage.getItem("authUser")).response.role;
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;
  
  const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in vendorData.address) {
      setVendorData({ ...vendorData, address: { ...vendorData.address, [name]: value } });
    } else {
      setVendorData({ ...vendorData, [name]: value });
    }
  };

  const handleVendorSubmit = async () => {
    try {
      const url = editMode
        ? `${process.env.REACT_APP_URL}/vendor/update-vendor/${selectedVendorId}`
        : `${process.env.REACT_APP_URL}/vendor/create-vendor/${userId}`;
      const method = editMode ? "PUT" : "POST";
      if (!editMode && role === "client_admin" && selectedFirmId) {
        vendorData.firmId = selectedFirmId;
      }
      const response = await fetch(url, { method, headers: config.headers, body: JSON.stringify(vendorData) });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        setModalOpen(false);
        setVendorData({ name: "", contactPerson: "", phone: "", email: "", address: { h_no: "", city: "", state: "", zip_code: "", country: "", nearby: "" } });
        setEditMode(false);
        setSelectedVendorId(null);
        fetchVendors();
      } else {
        throw new Error(result.error || "Failed to save vendor");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchVendors = async () => {
    if (!idToUse) return;
    try {
      setLoading(true);
      const response = await fetch(`${process.env.REACT_APP_URL}/vendor/get-vendors/${idToUse}`, { method: "GET", headers: config.headers });
      const result = await response.json();

      console.log(result.data);
      if (result.data.length === 0) {
        // toast.info("No vendors found");
      } else {
        // toast.success("Vendors fetched successfully");
      }
      if (response.ok) setVendors(result.data);
      else throw new Error(result.error || "Failed to fetch vendors");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (role === "super_admin") {
    setIsSuperAdmin(true);
  } else {
    if (role === "client_admin" && selectedFirmId) {
      fetchVendors();
    } else if (role !== "client_admin") {
      fetchVendors();
    }
  }
}, [selectedFirmId, role, trigger]);

  
  const handleEditClick = (vendor) => {
    setVendorData(vendor);
    setSelectedVendorId(vendor._id);
    setEditMode(true);
    toggleModal();
  };
  const toggleDeleteModal = () => {
    setDeleteModalOpen(!deleteModalOpen);
  };
  
// Updated handleDeleteClick
const handleDeleteClick = (vendor) => {
  setVendorToDelete(vendor); // Only store vendor ID
  toggleDeleteModal();
};

// Updated confirmDeleteVendor
const confirmDeleteVendor = async () => {
  if (!vendorToDelete) return;

  try {
    const response = await fetch(`${process.env.REACT_APP_URL}/vendor/delete-vendor/${vendorToDelete._id}`, {
      method: "DELETE",
      headers: config.headers
    });

    const result = await response.json();

    if (response.ok) {
      toast.success(result.message);
      fetchVendors();
    } else {
      throw new Error(result.error || "Failed to delete vendor");
    }
  } catch (error) {
    toast.error(error.message);
  } finally {
    toggleDeleteModal();
    setVendorToDelete(null);
  }
};



  const refetchVendors = () => {
    setTrigger(trigger + 1);
  };

  if (isSuperAdmin) {
    return (
      <div className="page-content">
        <Breadcrumbs title="Product & Inventory" breadcrumbItem="Vendors" />
        <h3>Coming Soon</h3>
      </div>
    );
  }

  return (
    <div className="page-content">
      <Breadcrumbs title="Product & Inventory" breadcrumbItem=" Suppliers & Vendors" />

     <div className="d-flex justify-content-start align-items-center gap-2 mb-2">
      <BackButton/>
        <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",color: "black",transition: "color 0.3s ease"}} onClick={refetchVendors} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
          <Button
            color="primary"
            onClick={() => {
              setEditMode(false);
              setVendorData({ name: "", contactPerson: "", phone: "", email: "", address: { h_no: "", city: "", state: "", zip_code: "", country: "", nearby: "" } });
              toggleModal();
            }}
            className="p-2"
            style={{maxHeight:"27.13px",fontSize:"10.5px" , lineHeight:"1"}}
          >
            Add Vendor
          </Button>
          {(role === "client_admin" && (
              <Col  lg={3} md={6} sm={12} className="m-text-center">
                    <FirmSwitcher
                        selectedFirmId={selectedFirmId}
                        onSelectFirm={setSelectedFirmId}
                      />
                  </Col>
              ))}
     </div>

      {/* Vendor Table */}
      <Table responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Vendor Name</th>
            <th>Contact Person</th>
            <th>Phone</th>
            <th>Email</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center">Loading...</td>
            </tr>
          ) : vendors.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No vendors found</td>
            </tr>
          ) : (
            vendors.map((vendor, index) => (
              <tr key={vendor._id} onClick={() => handleEditClick(vendor)}>
                <th scope="row">{index + 1}</th>
                <td>{vendor.name}</td>
                <td>{vendor.contactPerson}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.email}</td>
                <td className="text-center" 
                  onClick={(e) => {
                    e.stopPropagation();
                  }
                  }
                >
                    <i className="bx bx-trash" style={{ cursor: "pointer", fontSize:"24px" }} onClick={() => handleDeleteClick(vendor)}></i>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
      <Modal isOpen={deleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Deletion</ModalHeader>
        <ModalBody className="d-flex flex-column justify-content-center align-items-center">
          <p>Are you sure you want to delete this vendor? This action cannot be undone.</p>
          
          {/* Show vendor details */}
          {vendorToDelete ? (
            <div className="mt-3 text-left">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Vendor Name:</strong></td>
                    <td>{vendorToDelete.name || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Contact Person:</strong></td>
                    <td>{vendorToDelete.contactPerson || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Phone:</strong></td>
                    <td>{vendorToDelete.phone || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{vendorToDelete.email || "N/A"}</td>
                  </tr>
                  <tr>
                    <td><strong>Address:</strong></td>
                    <td>
                      {vendorToDelete.address ? (
                        <>
                          {vendorToDelete.address.h_no || "N/A"}, 
                          {vendorToDelete.address.city || "N/A"}, 
                          {vendorToDelete.address.state || "N/A"}, 
                          {vendorToDelete.address.zip_code || "N/A"}, 
                          {vendorToDelete.address.country || "N/A"}
                        </>
                      ) : (
                        "Address not provided"
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading vendor details...</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteVendor}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>



      <VendorModal 
        modalOpen={modalOpen} 
        toggleModal={toggleModal} 
        vendorData={vendorData} 
        handleInputChange={handleInputChange} 
        handleVendorSubmit={handleVendorSubmit} 
        editMode={editMode} 
      />
    </div>
  );
}

export default Vendor;
