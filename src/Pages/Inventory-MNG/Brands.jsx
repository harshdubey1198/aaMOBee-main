import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Container, Table, Modal, ModalBody, ModalFooter, Button, Input, Row, Col } from 'reactstrap';
import FetchBrands from './FetchBrands';
import BrandModal from '../../Modal/BrandModal';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import FirmSwitcher from '../Firms/FirmSwitcher';
import { BackButton } from '../../components/Common/BackButton';

const Brands = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser")).response;
  const [brands, setBrands] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [brandToEdit, setBrandToEdit] = useState(null);
  const [brandToAdd, setBrandToAdd] = useState(null);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [triggerBrand, setTriggerBrand] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.adminId || JSON.parse(localStorage.getItem('authUser'))?.response?.firmId;
  const role = JSON.parse(localStorage.getItem("authUser")).response.role;
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;


  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);

  const handleBrandsFetched = (fetchedBrands) => setBrands(fetchedBrands);
const fetchBrands = async () => {
  if (!idToUse) return;
  try {
    const response = await axiosInstance.get(
      `${process.env.REACT_APP_URL}/brand/get-brands/${idToUse}`
    );

    if (response.data?.length === 0 || response.data === null) {
      setBrands([]);
      toast.info("No brands found");
    } else {
      setBrands(response.data);
      // toast.success("Brands fetched successfully");
    }
  } catch (error) {
    setBrands([]);
    if (error.response?.error === "No brands found for this Firm") {
      toast.info("No brands found");
    } else {
      toast.error("No brands found for this Firm");
    }
    console.error(error.message);
  }
};

  useEffect(()=>{
    fetchBrands();
  },[triggerBrand , selectedFirmId]);

  const handleBrandEdit = (brand) => {
    setBrandToEdit(brand);
    toggleModal();
  };
  
  const handleBrandAdd = (brand) => {
    setBrandToAdd(brand);
    toggleModal();
  };

  const handleBrandDelete = (brand) => {
    setBrandToDelete(brand);
    toggleDeleteModal();
  };

  const refetchBrands = () => {
      setTriggerBrand((prev) => prev + 1)
      console.log("triggerBrand", triggerBrand);
    }


  const confirmDelete = async () => {
    if (!brandToDelete) return;
    try {
      const response = await axiosInstance.delete(`${process.env.REACT_APP_URL}/brand/delete-brand/${brandToDelete._id}`);
      setBrands(brands.filter((brand) => brand._id !== brandToDelete._id));
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to delete brand.");
    } finally {
      setBrandToDelete(null);
      toggleDeleteModal();
    }
  };

  const handleBrandUpdated = (updatedBrand) => {
    setBrands((prevBrands) =>
      prevBrands.map((brand) =>
        brand._id === updatedBrand._id ? updatedBrand : brand
      )
    );
    setBrandToEdit(null);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Product & Inventory" breadcrumbItem="Brands & Labels" />
          <FetchBrands onBrandsFetched={handleBrandsFetched} triggerBrand={setTriggerBrand} firmId={firmId} />
        </div>

        <Container className="mb-2">
        <div className="d-flex flex-column flex-md-row gap-2 align-items-center">
          <BackButton/>
          <Col xs={12} md={9} className="d-flex gap-2 justify-content-start ">
              <Input
                type="text"
                placeholder="Search by name or country"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ width: "100%" , height:"26.8px", padding: "10px" }}
              />
              {(role === "client_admin" && (
          
                      <FirmSwitcher
                          selectedFirmId={selectedFirmId}
                          onSelectFirm={setSelectedFirmId}
                        />
                   
                ))}
            </Col>
            <Col xs={3} md={3} className="d-flex justify-content-start">
              <i
                className="bx bx-refresh"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  backgroundColor: "lightblue",
                  padding: "5px",
                  borderRadius: "5px",
                }}
                onClick={refetchBrands}
              ></i>
              <i
                className="bx bx-plus"
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  backgroundColor: "lightblue",
                  padding: "5px",
                  marginLeft: "8px",
                  borderRadius: "5px",
                }}
                onClick={handleBrandAdd}
              ></i>
            </Col>
          </div>
        </Container>        
        <div className='table-responsive'>
          <Table bordered className='table table-centered table-nowrap mb-0'>
            <thead className='thead-light'>
              <tr>
                <th>Brand Name</th>
                <th>Country</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
           <tbody>
              {filteredBrands.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No brands found</td>
                </tr>
              ) : (
                filteredBrands.map((brand) => (
                  <tr key={brand._id}>
                    <td>
                      <a 
                        href={brand.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', color: '#007bff' }}
                      >
                        {brand.name}
                      </a>
                    </td>
                    <td>{brand.country}</td>
                    <td>{brand.description.length > 30 ? brand.description.slice(0, 30) + "..." : brand.description}</td>
                    <td>
                      <i
                        className='bx bx-edit'
                        style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => handleBrandEdit(brand)}
                      ></i>
                      <i
                        className='bx bx-trash'
                        style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
                        onClick={() => handleBrandDelete(brand)}
                      ></i>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </Table>
        </div>
      </div>

      <BrandModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        brandToEdit={brandToEdit}
        onBrandUpdated={handleBrandUpdated}
        setTriggerBrand={setTriggerBrand}
        brandToAdd={brandToAdd}
        idToUse={idToUse}
      />
      
      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalBody>Are you sure you want to delete this brand?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>Delete</Button>
          <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Brands;
