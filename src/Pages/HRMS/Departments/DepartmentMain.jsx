import React, { useEffect, useState } from "react";
import { Button, Table, Card, CardBody, Row, Col, Spinner,Input, InputGroup, InputGroupText } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { getDepartmentsByFirm, deleteDepartment, searchDepartments, } from "../../../apiServices/service";
import DepartmentModal from "../../../Modal/HRMS/DepartmentModal";
import InactiveDepartmentModal from "../../../Modal/HRMS/InactiveDepartmentModal";
import { toast } from "react-toastify";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import axios from "axios";
function DepartmentMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.response?.role;

  const firmId =
    authUser?.response?.firmId || authUser?.response?.adminId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

const [allDepartments, setAllDepartments] = useState([]);
const [loading, setLoading] = useState(false);
const [nextPageUrl, setNextPageUrl] = useState(null);
const [fetchingMore, setFetchingMore] = useState(false);
  const [page] = useState(1);

  const [search, setSearch] = useState("");

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isInactiveModalOpen, setIsInactiveModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const toggleDeptModal = () => {
    setIsDeptModalOpen(!isDeptModalOpen);
    if (isDeptModalOpen) setSelectedDepartment(null);
  };

  const toggleInactiveModal = () =>
    setIsInactiveModalOpen(!isInactiveModalOpen);

  const fetchDepartments = async (url = null) => {
    if (!idToUse) return;
    try {
      setLoading(!url);
      setFetchingMore(!!url);

      const res = url
        ? await axios.get(url)
        : await getDepartmentsByFirm(idToUse, 1);

      const fetchedData = res?.data?.data || [];
      setAllDepartments(prev => (url ? [...prev, ...fetchedData] : fetchedData));
      setNextPageUrl(res?.data?.nextPage || null);
    } catch {
      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  };

  const handleRefetch =()=>{
    fetchDepartments();
  }

    const handleSearch = async () => {
        const trimmedSearch = search.trim();

        if (trimmedSearch.length > 0 && trimmedSearch.length < 3) {
            toast.info("Please enter at least 3 characters to search");
            return;
        }

        if (trimmedSearch.length >= 3) {
            try {
            setLoading(true);
            const res = await searchDepartments(idToUse, trimmedSearch, page);
            setAllDepartments(res?.data?.data || []);
            } catch {
            toast.error("Search failed");
            } finally {
            setLoading(false);
            }
        }
        };



  useEffect(() => {
    // Reset list and nextPage whenever search or firm changes
    setAllDepartments([]);
    setNextPageUrl(null);

    const trimmedSearch = search.trim();

    if (trimmedSearch === "") {
      // fetch all departments
      fetchDepartments();
    } else if (trimmedSearch.length >= 3) {
      // fetch search result starting from page 1
      fetchDepartments(null, trimmedSearch);
    }
  }, [search, idToUse]);



  const handleEdit = (dept) => {
    setSelectedDepartment(dept);
    setIsDeptModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDepartment(id);
      toast.success("Department deactivated");
      fetchDepartments();
    } catch {
      toast.error("Failed to deactivate department");
    }
  };
useEffect(() => {
  const handleWindowScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 2;
    if (bottom && nextPageUrl && !fetchingMore) {
      fetchDepartments(nextPageUrl);
    }
  };

  window.addEventListener("scroll", handleWindowScroll);
  return () => window.removeEventListener("scroll", handleWindowScroll);
}, [nextPageUrl, fetchingMore]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="HRMS" breadcrumbItem="Departments" />

        <Row className="mb-3">
          <Col md="8" className="d-flex gap-2 align-items-center">
            <i className='bx bx-refresh cursor-pointer'  style={{fontSize: "24.5px",fontWeight: "bold",marginRight: "10px",color: "black",transition: "color 0.3s ease"}} onClick={handleRefetch} onMouseEnter={(e) => e.target.style.color = "green"}  onMouseLeave={(e) => e.target.style.color = "black"}></i>

            <Button color="primary" className="justified-button" onClick={toggleDeptModal}>
              + Add Department
            </Button>

            <Button color="success" className="justified-button" onClick={toggleInactiveModal}>
              View Inactive
            </Button>

            {role === "client_admin" && (
              <FirmSwitcher
                selectedFirmId={selectedFirmId}
                onSelectFirm={setSelectedFirmId}
              />
            )}
          </Col>

          <Col md="4">
            <InputGroup>
              <Input
                placeholder="Search department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={handleSearch}
              >
                🔍
              </InputGroupText>
            </InputGroup>
          </Col>
        </Row>

        <Card>
          <CardBody>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center py-5">
              <Spinner />
            </div>
            ) : (
              <div style={{ height: "calc(100vh - 200px)", overflowY: "auto" }} >
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
                    {allDepartments.length > 0 ? (
                      allDepartments.map((dept, index) => (
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
                            <Button size="sm" color="info" onClick={() => handleEdit(dept)}>Edit</Button>
                            <Button size="sm" color="danger" onClick={() => handleDelete(dept._id)}>Deactivate</Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          {loading ? "Loading..." : "No departments found"}
                        </td>
                      </tr>
                    )}
                    {!nextPageUrl && allDepartments.length > 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No more departments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

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