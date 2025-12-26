import React, { useEffect, useState } from "react";
import {Button,Table,Card,CardBody,Row,Col,Spinner,
} from "reactstrap";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import { toast } from "react-toastify";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { deleteDesignation, getDesignationsByDepartment,getDepartmentsByFirm } from "../../../apiServices/service";
import DesignationModal from "../../../Modal/HRMS/DesignationModal";
import InactiveDesignationModal from "../../../Modal/HRMS/InactiveDesignationModal";

function DesignationMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.response?.role;

  const firmId =
    authUser?.response?.firmId || authUser?.response?.adminId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

  const [departmentId, setDepartmentId] = useState("");

  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  

  const fetchDepartments = async () => {
  if (!idToUse) return;
  try {
    const res = await getDepartmentsByFirm(idToUse, 1);
    setDepartments(res?.data?.data || []);
  } catch (err) {
    toast.error("Failed to load departments");
  }
};

const fetchDesignations = async () => {
  if (!departmentId) return;

  try {
    const res = await getDesignationsByDepartment(departmentId, 1);
  // ✅ ONLY LINE CHANGED
   setDesignations( res.data.data || []);


  } catch (err) {
    toast.error("Failed to load designations");
  }
};


  const handleEdit = (desg) => {
    setSelectedDesignation(desg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDesignation(id);
      toast.success("Designation deactivated");
      fetchDesignations();
    } catch (err) {
      toast.error("Failed to deactivate designation");
    }
  };
 

  useEffect(() => {
  if (!idToUse) return;
  fetchDepartments();
}, [idToUse]);

useEffect(() => {
  if (!departmentId || !idToUse) return;
  fetchDesignations();
}, [departmentId, idToUse]);



  return (
    <div className="page-content">
      <Breadcrumbs title="HRMS" breadcrumbItem="Designations" />

      <Card className="mb-3">
  <CardBody>
    <Row className="align-items-center">
     <Col md="3">
      <select
        className="form-select"
        value={departmentId}
        onChange={(e) => setDepartmentId(e.target.value)}
      >
        <option value="">— Select Department —</option>
        {departments.map((dept) => (
          <option key={dept._id} value={dept._id}>
            {dept.name}
          </option>
        ))}
      </select>
    </Col>
        </Row>
      </CardBody>
    </Card>


      <Row className="mb-3 align-items-center">
        <Col className="d-flex gap-2 align-items-center">
          <Button
            color="primary"
            onClick={() => {
              if (!departmentId) {
                toast.error("Please select department first");
                return;
              }
              setIsModalOpen(true);
            }}
          >
            + Add Designation
          </Button>

          <Button
            color="secondary"
            onClick={() => setIsInactiveModalOpen(true)}
            disabled={!departmentId}
          >
            View Inactive
          </Button>

          {role === "client_admin" && (
            <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={(id) => {
                setSelectedFirmId(id);

              }}
            />
          )}
        </Col>
      </Row>

      <Card>
        <CardBody>
          {loading ? (
            <Spinner />
          ) : (
            <Table bordered hover responsive>
              <thead>
                 <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Level</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
             <tbody>
                {designations.length > 0 ? (
                  designations.map((desg, index) => (
                    <tr key={desg._id || desg.id}>

                      <td>{index + 1}</td>
                      <td>{desg.title}</td>
                      <td className="text-capitalize">{desg.level}</td>
                      <td>
                        <span
                          className={`badge ${
                            desg.status === "active" ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {desg.status}
                        </span>
                      </td>
                      <td>
                        {desg.createdAt
                          ? new Date(desg.createdAt).toLocaleDateString()
                          : "—"}

                      </td>
                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          color="info"
                          onClick={() => handleEdit(desg)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(desg._id)}
                        >
                          Deactivate
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No designations found
                    </td>
                  </tr>
                )}
              </tbody>

            </Table>
          )}
        </CardBody>
      </Card>

      <DesignationModal
        isOpen={isModalOpen}
        toggle={() => {
          setIsModalOpen(!isModalOpen);
          setSelectedDesignation(null);
        }}
        firmId={idToUse}           // ✅ FIX
        departmentId={departmentId} // ✅ FIX
        designation={selectedDesignation}
        onSuccess={fetchDesignations}
      />

      <InactiveDesignationModal
        isOpen={isInactiveModalOpen}
        toggle={() => setIsInactiveModalOpen(!isInactiveModalOpen)}
        departmentId={departmentId}
        onSuccess={fetchDesignations}
      />
    </div>
  );
}

export default DesignationMain;
