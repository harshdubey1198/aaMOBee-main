import React, { useEffect, useState, useRef, useCallback } from "react";
import {Button,Table,Card,CardBody,Row,Col,Spinner, Input,
} from "reactstrap";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import { toast } from "react-toastify";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
// search designations
import { deleteDesignation, getDesignationsByDepartment,getDepartmentsByFirm,searchDesignations } from "../../../apiServices/service";
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
  const [departments, setDepartments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  // Pagination state for departments
  const [departmentPage, setDepartmentPage] = useState(1);
  const [departmentHasMore, setDepartmentHasMore] = useState(true);
  const [departmentLoading, setDepartmentLoading] = useState(false);

  // Pagination state for designations
  const [designationPage, setDesignationPage] = useState(1);
  const [designationHasMore, setDesignationHasMore] = useState(true);
  const [designationLoading, setDesignationLoading] = useState(false);

  const [search, setSearch] = useState("");
  const searchTimeout = useRef(null);

  // Refs for infinite scroll
  const departmentSelectRef = useRef(null);
  const tableContainerRef = useRef(null);

  const fetchDepartments = async (page = 1, append = false) => {
    if (!idToUse || departmentLoading) return;

    setDepartmentLoading(true);
    if (!append) setLoading(true);

    try {
      const res = await getDepartmentsByFirm(idToUse, page);
      const newDepartments = res?.data?.data || [];
      
      if (append) {
        setDepartments(prev => [...prev, ...newDepartments]);
      } else {
        setDepartments(newDepartments);
      }

      // Check if there are more pages
      const hasNext = res?.data?.nextPage !== null;
      setDepartmentHasMore(hasNext);
      
    } catch (err) {
      toast.error("Failed to load departments");
    } finally {
      setDepartmentLoading(false);
      if (!append) setLoading(false);
    }
  };

  const fetchDesignations = async (page = 1, append = false) => {
    if (!departmentId || designationLoading) return;

    setDesignationLoading(true);
    if (!append) setLoading(true);

    try {
      const res = await getDesignationsByDepartment(departmentId, page);
      console.log("Designations response:",res?.data?.data?.data);
      const newDesignations = res?.data?.data?.data || [];
      
      if (append) {
        setDesignations(prev => [...prev, ...newDesignations]);
      } else {
        setDesignations(newDesignations);
      }

      // Check if there are more pages
      const hasNext = res?.data?.data?.nextPage !== null;
      setDesignationHasMore(hasNext);
      
    } catch (err) {
      toast.error("Failed to load designations");
    } finally {
      setDesignationLoading(false);
      if (!append) setLoading(false);
    }
  };

  const fetchSearchDesignations = async (value, page = 1, append = false) => {
  const trimmed = value?.trim();
  if (!trimmed || trimmed.length < 3 || !departmentId) return;
  setDesignationLoading(true);

  try {
    const res = await searchDesignations({
      firmId: idToUse,
      departmentId,
      search: value,
      page
    });

    const newData = res?.data?.data || [];

    setDesignations(prev =>
      append ? [...prev, ...newData] : newData
    );

    setDesignationHasMore(res?.data?.data?.nextPage !== null);
  } catch (err) {
    toast.error("Search failed");
  } finally {
    setDesignationLoading(false);
  }
};

  // Handle department dropdown scroll
  const handleDepartmentScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // Check if scrolled to bottom
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (departmentHasMore && !departmentLoading) {
        const nextPage = departmentPage + 1;
        setDepartmentPage(nextPage);
        fetchDepartments(nextPage, true);
      }
    }
  }, [departmentPage, departmentHasMore, departmentLoading]);

  // Handle designations table scroll
  const handleTableScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    
    // Check if scrolled to bottom
    if (scrollHeight - scrollTop <= clientHeight + 100) {
      if (designationHasMore && !designationLoading) {
        const nextPage = designationPage + 1;
        setDesignationPage(nextPage);
        search && search.trim().length >= 3
        ? fetchSearchDesignations(search, nextPage, true)
        : fetchDesignations(nextPage, true);

      }
    }
  }, [designationPage, designationHasMore, designationLoading]);

  const handleEdit = (desg) => {
    setSelectedDesignation(desg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDesignation(id);
      toast.success("Designation deactivated");
      // Reset and fetch from page 1
      setDesignationPage(1);
      setDesignations([]);
      fetchDesignations(1, false);
    } catch (err) {
      toast.error("Failed to deactivate designation");
    }
  };

 const handleRefetch = () => fetchDesignations(1, false);


  useEffect(() => {
    if (!idToUse) return;
    setDepartmentPage(1);
    setDepartments([]);
    setDepartmentHasMore(true);
    fetchDepartments(1, false);
    setSearch("");

  }, [idToUse]);

  useEffect(() => {
    if (!departmentId || !idToUse) return;
    setDesignationPage(1);
    setDesignations([]);
    setDesignationHasMore(true);
    fetchDesignations(1, false);
  }, [departmentId, idToUse]);

  return (
    <div className="page-content">
      <Breadcrumbs title="HRMS" breadcrumbItem="Designations" />

      <Card className="mb-3">
        <CardBody>
          <Row className="align-items-center">
            <Col md="3">
              <select
                ref={departmentSelectRef}
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                onScroll={handleDepartmentScroll}
                style={{ maxHeight: '200px', overflowY: 'auto' }}
              >
                <option value="">
                  {loading ? "Loading departments..." : "— Select Department —"}
                </option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
                {departmentLoading && (
                  <option disabled>Loading more...</option>
                )}
              </select>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Row className="mb-3 align-items-center">
       <Col md="8" className="d-flex gap-2 align-items-center">
                   <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",marginRight: "10px",color: "black",transition: "color 0.3s ease"}} onClick={handleRefetch} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>
          <Button color="primary" className="justified-button"
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

          <Button color="success" className="justified-button"
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

        <Col md="4">
                   <Input
                placeholder="Search designation..."
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);

                  clearTimeout(searchTimeout.current);

                  searchTimeout.current = setTimeout(() => {
                    const trimmed = value.trim();
                    setDesignationPage(1);

                    if (trimmed.length >= 3) {
                      fetchSearchDesignations(trimmed, 1, false);
                    } 
                    else if (trimmed.length === 0) {
                      fetchDesignations(1, false); // ✅ reset to full list
                    }
                  }, 400);
                }}
              />          


                  </Col>
      </Row>

      <Card>
        <CardBody>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner />
            </div>
          ) : (
            <div 
              ref={tableContainerRef}
              onScroll={handleTableScroll}
              style={{ maxHeight: '600px', overflowY: 'auto' }}
            >
              <Table bordered hover responsive>
                <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
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
                    <>
                      {designations.map((desg, index) => (
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
                      ))}
                      {designationLoading && (
                        <tr>
                          <td colSpan="6" className="text-center py-3">
                            <Spinner size="sm" /> Loading more...
                          </td>
                        </tr>
                      )}
                      {!designationHasMore && designations.length > 0 && (
                        <tr>
                          <td colSpan="6" className="text-center text-muted py-2">
                            No more designations
                          </td>
                        </tr>
                      )}
                    </>
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No designations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>

      <DesignationModal
        isOpen={isModalOpen}
        toggle={() => {
          setIsModalOpen(!isModalOpen);
          setSelectedDesignation(null);
        }}
        firmId={idToUse}
        departmentId={departmentId}
        departmentName={
          departments.find((d) => d._id === departmentId)?.name || ""
        }
        designation={selectedDesignation}
        onSuccess={() => {
          setDesignationPage(1);
          setDesignations([]);
          fetchDesignations(1, false);
        }}
      />

      <InactiveDesignationModal
        isOpen={isInactiveModalOpen}
        toggle={() => setIsInactiveModalOpen(!isInactiveModalOpen)}
        departmentId={departmentId}
        onSuccess={() => {
          setDesignationPage(1);
          setDesignations([]);
          fetchDesignations(1, false);
        }}
      />
    </div>
  );
}

export default DesignationMain;