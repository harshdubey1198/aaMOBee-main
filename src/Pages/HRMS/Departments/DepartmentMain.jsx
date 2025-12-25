import React, { useEffect, useState } from "react";
import { Button, Table, Card, CardBody, Row, Col, Spinner, } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getDepartmentsByFirm, deleteDepartment, } from "../../../apiServices/service";
import DepartmentModal from "../../../Modal/HRMS/DepartmentModal";
import InactiveDepartmentModal from "../../../Modal/HRMS/InactiveDepartmentModal";
import { toast } from "react-toastify";
import FirmSwitcher from "../../Firms/FirmSwitcher";

function DepartmentMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.response?.role;

  const firmId =
    authUser?.response?.firmId || authUser?.response?.adminId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);

  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page] = useState(1);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const toggleDeptModal = () => {
    setIsDeptModalOpen(!isDeptModalOpen);
    if (isDeptModalOpen) setSelectedDepartment(null);
  };

  const toggleInactiveModal = () =>
    setIsInactiveModalOpen(!isInactiveModalOpen);

  const fetchDepartments = async () => {
    if (!idToUse) return;
    try {
      setLoading(true);
      const res = await getDepartmentsByFirm(idToUse, page);
      setDepartments(res?.data?.data || []);
      console.log(res);
      
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [idToUse]);

  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setIsDeptModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deactivated");
      fetchDepartments();
    } catch (err) {
      toast.error("Failed to deactivate department");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="HRMS" breadcrumbItem="Departments" />

        <Row className="mb-3 align-items-center">
          <Col className="d-flex gap-2 align-items-center">
            <Button color="primary" onClick={toggleDeptModal}>
              + Add Department
            </Button>

            <Button color="secondary" onClick={toggleInactiveModal}>
              View Inactive
            </Button>

            {role === "client_admin" && (
              <FirmSwitcher
                selectedFirmId={selectedFirmId}
                onSelectFirm={setSelectedFirmId}
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
                    <th>Name</th>
                    <th>Code</th>
                    <th>Parent Department</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.length > 0 ? (
                    departments.map((dept, index) => (
                      <tr key={dept._id}>
                        <td>{index + 1}</td>
                        <td>{dept.name}</td>
                        <td>{dept.code}</td>
                         <td>
                            {dept.parentDepartmentId ? (
                            <>
                                <div><strong>{dept.parentDepartmentId.name}</strong></div>
                                <div className="text-muted">{dept.parentDepartmentId.code}</div>
                            </>
                            ) : (
                            <span className="text-muted">—</span>
                            )}
                        </td>
                        <td className="d-flex gap-2">
                          <Button
                            size="sm"
                            color="info"
                            onClick={() => handleEdit(dept)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => handleDelete(dept._id)}
                          >
                            Deactivate
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No departments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        <DepartmentModal
          isOpen={isDeptModalOpen}
          toggle={toggleDeptModal}
          firmId={idToUse}
          department={selectedDepartment}
          onSuccess={fetchDepartments}
        />

        <InactiveDepartmentModal
          isOpen={isInactiveModalOpen}
          toggle={toggleInactiveModal}
          firmId={idToUse}
          onSuccess={fetchDepartments}
        />
      </div>
    </React.Fragment>
  );
}

export default DepartmentMain;