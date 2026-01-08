import React, { useEffect, useState } from "react";
import {Button, Table, Card, CardBody, Row, Col, Spinner} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import {deleteFirmPolicy,getFirmPolicyByFirm} from "../../../apiServices/service";
import FirmPolicyModal from "../../../Modal/HRMS/FirmPolicyModal";
import FirmSwitcher from "../../Firms/FirmSwitcher";

function FirmPolicyMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.response?.role;

  const firmId =
    authUser?.response?.firmId || authUser?.response?.adminId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (isModalOpen) setSelectedPolicy(null);
  };

  // ✅ FIXED: Normalize API response to ARRAY
  const fetchPolicies = async () => {
    if (!idToUse) return;
    try {
      setLoading(true);
      const res = await getFirmPolicyByFirm(idToUse);
       console.log("Fetched Policies:", res);
      const policyObj = res?.data;
      setPolicies(policyObj ? [policyObj] : []);
    } catch {
      toast.error("Failed to load firm policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [idToUse]);

  const handleDelete = async (id) => {
    try {
      await deleteFirmPolicy(id);
      toast.success("Policy deleted successfully");
      fetchPolicies();
    } catch (err) {
      toast.error(
        err?.message || "You do not have permission to perform this action"
      );
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="HRMS" breadcrumbItem="Firm Policies" />

        <Row className="mb-3">
          <Col md="8" className="d-flex gap-2 align-items-center">
            <Button color="primary" className="justified-button" onClick={toggleModal}>
              + Add Policy
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
              <div className="text-center py-5">
                <Spinner />
              </div>
            ) : (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Policy</th>
                    <th>HRA %</th>
                    <th>Basic %</th>
                    <th>Allowances</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {policies.length > 0 ? (
                    policies.map((policy, index) => (
                      <tr key={policy._id}>
                        <td>{index + 1}</td>
                        <td>Firm Salary Policy</td>
                        <td>{policy.hraPercent}%</td>
                        <td>{policy.basicPercent}%</td>
                        <td>
                          {policy.allowances?.map(a => (
                            <div key={a._id}>
                              {a.name} ({a.percent}%)
                            </div>
                          ))}
                        </td>
                        <td className="d-flex gap-2">
                          <Button
                            size="sm"
                            color="info"
                            onClick={() => {
                              setSelectedPolicy(policy);
                              setIsModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            onClick={() => handleDelete(policy._id)}
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No policies found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        <FirmPolicyModal
          isOpen={isModalOpen}
          toggle={toggleModal}
          firmId={idToUse}
          policy={selectedPolicy}
          onSuccess={fetchPolicies}
        />
      </div>
    </React.Fragment>
  );
}

export default FirmPolicyMain;
