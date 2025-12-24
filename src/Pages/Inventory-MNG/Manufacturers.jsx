import React, { useState } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FetchManufacturers from './fetchManufacturers';
import { Table, Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Col, Row, Container } from 'reactstrap';
import ManufacturerModal from '../../Modal/ManufacturerModal';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-toastify';
import FirmSwitcher from '../Firms/FirmSwitcher';
import { BackButton } from '../../components/Common/BackButton';

const Manufacturers = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser")).response;
  const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.adminId || JSON.parse(localStorage.getItem('authUser'))?.response?.firmId;
  const role = JSON.parse(localStorage.getItem("authUser")).response.role;
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;
  const [manufacturers, setManufacturers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] = useState(null);
  const [manufacturerToEdit, setManufacturerToEdit] = useState(null);
  const [manufacturerToAdd, setManufacturerToAdd] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [triggerManufacturer, setTriggerManufacturer] = useState(false); 
 const isDemo = authuser?.isDemo;
 const blockIfDemo = (actionName) => {
   if (isDemo) {
     toast.error(`Demo accounts cannot ${actionName}`);
     return true;
   }
   return false;
 };
  const blockIfNoBusiness = () => {
    if (!selectedFirmId) {
      toast.info("Please add/select a business first to continue");
      return true; 
    }
    return false; 
  };
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleManufacturersFetched = (fetchedManufacturers) => {
    setManufacturers(fetchedManufacturers || []);
    // console.log(fetchedManufacturers || []);
    if (fetchedManufacturers.length === 0) {
      toast.info("No manufacturers found");
    } else {
      // toast.success("Manufacturers fetched successfully");
    }
  };

  const handleManufacturerEdit = (manufacturer) => {
    setManufacturerToEdit(manufacturer);
    toggleModal();
  };

  const handleManufacturerToAdd = (manufacturer) => {
    setManufacturerToAdd(manufacturer);
    toggleModal();  
  };

  const handleManufacturerDelete = (manufacturer) => {
    setManufacturerToDelete(manufacturer);
    toggleDeleteModal();
  };

  const confirmDeleteManufacturer = async () => {
    try {
      await axiosInstance.delete(`${process.env.REACT_APP_URL}/manufacturer/delete-manufacturer/${manufacturerToDelete._id}`);
      // setManufacturers((prevManufacturers) => prevManufacturers.filter((m) => m._id !== manufacturerToDelete._id));
      setTriggerManufacturer((prev) => !prev);
      toast.success('Manufacturer deleted successfully');
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
      toast.error('Failed to delete manufacturer');
    } finally {
      toggleDeleteModal();
    }
  };

  const handleManufacturerUpdated = (updatedManufacturer) => {
    if (manufacturerToEdit) {
      setManufacturers((prevManufacturers) =>
        prevManufacturers.map((manufacturer) =>
          manufacturer._id === updatedManufacturer._id ? updatedManufacturer : manufacturer
        )
      );
    } else {
      setManufacturers((prevManufacturers) => [...prevManufacturers, updatedManufacturer]);
    }
    setManufacturerToEdit(null);
    toggleModal();
  };

  const filteredManufacturers = manufacturers.length > 0 
  ? manufacturers.filter((manufacturer) =>
      manufacturer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer?.contactPerson?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      // || manufacturer?.phone?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Product & Inventory" breadcrumbItem="Manufacturer" />
          <FetchManufacturers onManufacturersFetched={handleManufacturersFetched} firmId={idToUse} triggerManufacturer={triggerManufacturer} />
        </div>

        <Container className="mb-2">
          <Row className="d-flex flex-column flex-md-row gap-2 align-items-center justify-content-start">
            <Col xs={12} md={6} className="d-flex gap-2 justify-content-start align-items-center">
            <BackButton/>
              <Input
                type="text"
                placeholder="Search by title, lead, email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", height:"39px", padding: "10px" }}
                className="my-0"
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
                onClick={() => setTriggerManufacturer((prev) => !prev)}
              ></i>

             <Button color="primary" onClick={() => { if (blockIfNoBusiness()) return;  handleManufacturerToAdd(); }} style={{fontSize:"10.5px",lineHeight:"1",marginLeft:"5px", minWidth:'105px'}}>Add Manufacturer</Button>
            </Col>
          </Row>
        </Container>

        <div className='table-responsive relative'> 
          <Table bordered className='table table-centered table-nowrap mb-0'>
            <thead className='thead-light'>
              <tr>
                <th>Title</th>
                <th>Lead</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
           <tbody>
                {filteredManufacturers.length > 0 ? (
                  filteredManufacturers.map((manufacturer) => (
                    <tr key={manufacturer._id}>
                      <td>{manufacturer.name}</td>
                      <td>{manufacturer.contactPerson}</td>
                      <td>{manufacturer.email}</td>
                      <td>{manufacturer.phone}</td>
                      <td>
                        <i
                          className='bx bx-edit'
                          style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer' }}
                          onClick={() => { if (blockIfDemo("edit a Manufacturer")) return; handleManufacturerEdit(manufacturer); }}
                        ></i>
                        <i
                          className='bx bx-trash'
                          style={{ fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
                          onClick={() => { if (blockIfDemo("delete a Manufacturer")) return; handleManufacturerDelete(manufacturer); }}
                        ></i>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">No manufacturers found</td>
                  </tr>
                )}
              </tbody>

          </Table>
        </div>
      </div>

      <ManufacturerModal
        isOpen={isModalOpen}
        toggle={toggleModal}
        idToUse={idToUse}
        manufacturerToEdit={manufacturerToEdit}
        manufacturerAdd={manufacturerToAdd}
        onManufacturerUpdated={handleManufacturerUpdated}
        setTriggerManufacurer={setTriggerManufacturer}
      />

      <Modal isOpen={isDeleteModalOpen} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the manufacturer "{manufacturerToDelete?.name}"?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDeleteManufacturer}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default Manufacturers;
