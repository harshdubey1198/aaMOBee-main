import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Input, Badge, Row, Alert } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import UserTable from "../../components/FirmComponents/userTable";
import ClientUserCreateForm from "../../components/FirmComponents/clientUserForm";
import FirmUserCreateForm from "../../components/FirmComponents/firmUserForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FirmSwitcher from "./FirmSwitcher";
import { BackButton } from "../../components/Common/BackButton";

function UserManage() {
  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [firms, setFirms] = useState([]);
  const [defaultFirm, setDefaultFirm] = useState(null);
  console.log("firms",selectedFirmId);
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const [trigger, setTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    recentActivity: 0
  });
  const [formValues, setFormValues] = useState({
    adminId: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    emergencyContact: "",
    birthday: "",
    role: "",
    gender: "NA"
  });

  const clientAdminRoles = ["firm_admin", "accountant", "employee"];
  const firmAdminRoles = ["accountant", "employee"];

  useEffect(() => {
    if (selectedFirmId && firms.length > 0) {
      const selectedFirm = firms.find((firm) => firm.fuid === selectedFirmId) || "";
      localStorage.setItem(
        "defaultFirm",
        JSON.stringify({
          firmId: selectedFirm._id,
          fuid: selectedFirmId,
          name: selectedFirm.firmName,
        })
      );
      setFormValues((prevValues) => ({
        ...prevValues,
        firmId: selectedFirm._id,
        firmUniqueId: selectedFirm.fuid,
        firmName: selectedFirm.firmName,
      }));
    }
  }, [selectedFirmId, firms]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };


  
  const availableRoles =
    authuser.response.role === "client_admin"
      ? clientAdminRoles
      : firmAdminRoles;

  return (
    <React.Fragment>
      <div className="page-content">
          <BackButton />  
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Team Access" />
        
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center mb-2 mb-md-0">
            <Input
                type="text"
                placeholder="Search Users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="me-2"
                style={{ width: "250px", maxHeight: "38px" }}
              />
            <Button
              color="primary"
              className="btn btn-primary d-flex align-items-center"
              onClick={() => setTrigger((prev) => prev + 1)}
            >
              <i className="bx bx-refresh me-1"></i> Refresh
            </Button>
          </div>
          <div className="d-flex align-items-center">
           <Button
              color="success"
              className="btn btn-primary d-flex align-items-center me-2"
              onClick={() => {
                console.log("firms", selectedFirmId);
                if (!selectedFirmId) {
                  toast.info("Please add a business first to continue making team");
                  return;
                }
                toggleModal();
              }}
            >
              <i className="bx bx-plus me-1"></i> Add User
            </Button>



            {authuser?.response.role === "client_admin" && (
              <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={setSelectedFirmId}
              />
            )}
          </div>
        </div>
        <Row>
          <Col lg={12}>
            <Card className="firm-card">
              <CardBody className="p-0">
                  <UserTable selectedFirmId={selectedFirmId} trigger={trigger} searchQuery={searchQuery} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      {authuser?.response.role === "client_admin" && (
        <ClientUserCreateForm
          isOpen={modalOpen}
          toggle={toggleModal}
          // firms={firms}
          selectedFirmId={selectedFirmId}
          setTrigger={setTrigger}
          setSelectedFirmId={setSelectedFirmId}
          defaultFirm={defaultFirm}
          formValues={formValues}
          setFormValues={setFormValues}
          availableRoles={availableRoles}
        />
      )}
      {authuser?.response.role === "firm_admin" && (
        <FirmUserCreateForm
          isOpen={modalOpen}
          toggle={toggleModal}
          firms={firms}
          selectedFirmId={selectedFirmId}
          setTrigger={setTrigger}
          setSelectedFirmId={setSelectedFirmId}
          defaultFirm={defaultFirm}
          formValues={formValues}
          setFormValues={setFormValues}
          availableRoles={availableRoles}
        />
      )}
      <ToastContainer />
    </React.Fragment>
  );
}

export default UserManage;
