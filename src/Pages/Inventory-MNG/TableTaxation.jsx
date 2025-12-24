import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Button, Table } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TaxationModal from '../../Modal/taxationModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import FirmSwitcher from '../Firms/FirmSwitcher';
import { BackButton } from '../../components/Common/BackButton';

function TaxationTable() {
  const [modalOpen, setModalOpen] = useState(false);
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const authuser = JSON.parse(localStorage.getItem('authUser'));
  const token = authuser.token;
  const userId = authuser.response._id;
  const firmId = JSON.parse(localStorage.getItem('authUser'))?.response?.adminId || JSON.parse(localStorage.getItem('authUser'))?.response?.firmId;
    const role = JSON.parse(localStorage.getItem("authUser")).response.role;
    const [selectedFirmId, setSelectedFirmId] = useState(null);
    const idToUse = role === "client_admin" ? selectedFirmId : firmId;
  const [trigger, setTrigger] = useState(0);
    const blockIfNoBusiness = () => {
      if (!selectedFirmId) {
        toast.info("Please add/select a business first to continue");
        return true; 
      }
      return false; 
    };
  const toggleModal = () => setModalOpen(!modalOpen);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const authUser = authuser?.response;

  const blockIfDemo = (actionName) => {
    if (authUser?.isDemo) {
      toast.error(`Demo accounts cannot ${actionName}`);
      return true;
    }
    return false;
  };
  const fetchTaxes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL}/tax/get-taxes/${idToUse}`,
        config
      );
      setTaxes(response.data);
      (response.data.length === 0) && toast.info("No taxes found");
      // (response.data.length > 0) && toast.success("Taxes fetched successfully");
    } catch (error) {
      console.error('Error fetching taxes:', error);
    }
  };

  const handleTaxCreatedOrUpdated = (tax) => {
    if (selectedTax) {
      setTaxes(taxes.map(t => t._id === tax._id ? tax : t));
    } else {
      setTaxes([...taxes, tax]);
    }
    setSelectedTax(null);
  };

  const handleEditClick = (tax) => {
    setSelectedTax(tax);
    toggleModal();
  };

  const handleDeleteClick = async (taxId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this tax?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_URL}/tax/delete-tax/${taxId}`,
        config
      );
      setTaxes(taxes.filter(t => t._id !== taxId));
      toast.success(response.data.message || "Tax deleted successfully");
    } catch (error) {
      console.error('Error deleting tax:', error);
      toast.error('Failed to delete tax');
    }
  };

  useEffect(() => {
    fetchTaxes();
  }, [trigger , selectedFirmId]);

  const refetchTaxes = () => {
    setTrigger(trigger + 1);
  };  

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Taxation Management" breadcrumbItem="Tax Settings" />
        <Col lg="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-start gap-2 align-items-center">
                <BackButton/>
                

        
              <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",color: "black",transition: "color 0.3s ease"}} onClick={refetchTaxes} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
              <Button color="primary" className="p-2" style={{maxHeight:"27.13px",fontSize:"10.5px" , lineHeight:"1"}} onClick={() => {  if (blockIfNoBusiness()) return; setSelectedTax(null); toggleModal(); }}>
                  Add New Tax
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
              <Table className="mt-4" responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tax Name</th>
                    <th>Tax Types</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {taxes.map((tax, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{tax.taxName}</td>
                      <td>
                        {tax.taxRates.map((rate, idx) => (
                          <div key={idx}>
                            {rate.taxType}: {rate.rate}%
                          </div>
                        ))}
                      </td>
                      <td>
                        <i
                          className="bx bx-edit mx-1"
                          onClick={() => { if (blockIfDemo("edit a Tax")) return; handleEditClick(tax); }}
                          style={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }}
                        ></i>
                        <i
                          className="bx bx-trash mx-1"
                          onClick={() => { if (blockIfDemo("delete a Tax")) return; handleDeleteClick(tax._id); }}
                          style={{ fontSize: "22px", fontWeight: "bold", cursor: "pointer" }}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
        </Col>
        <TaxationModal
          isOpen={modalOpen}
          toggle={toggleModal}
          config={config}
          userId={userId}
          tax={selectedTax}
          idToUse={idToUse}
          onTaxCreatedOrUpdated={handleTaxCreatedOrUpdated}
        />
      </div>
    </React.Fragment>
  );
}

export default TaxationTable;
