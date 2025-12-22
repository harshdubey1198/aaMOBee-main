import React, { useEffect, useState } from "react";
import { Toast, Button, Card, CardBody, Col, Table } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { deleteFirm } from "../../apiServices/service"
import { BackButton } from "../../components/Common/BackButton";

function FirmsTable() {
  const [firms, setFirms] = useState([]);
  const [hoveredFirmId, setHoveredFirmId] = useState(null);
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const [trigger, setTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const firmsPerPage = 5;
  const navigate = useNavigate();


  useEffect(() => {
    if (authUser) {
      axios
        .get(`${process.env.REACT_APP_URL}/auth/getCompany/${authUser?._id}`)
        .then((response) => {
          const allFirms = response || [];
          const filteredFirms = allFirms.filter(firm => firm.role === 'firm');
          setFirms(filteredFirms);
        })
        .catch((error) => {
          // Toast.error("Error fetching firms");
          // console.error(error);
        });
    }
  }, [trigger]);

  const handleFirmCreate = () => {
    navigate("/add-business");
  };

  // Pagination Logic
  const indexOfLastFirm = currentPage * firmsPerPage;
  const indexOfFirstFirm = indexOfLastFirm - firmsPerPage;
  const currentFirms = firms.slice(indexOfFirstFirm, indexOfLastFirm);

  const pageNumbers = [];
  if (firms.length >= firmsPerPage) {
    for (let i = 1; i <= Math.ceil(firms.length / firmsPerPage); i++) {
      pageNumbers.push(i);
    }
  }

  const handleDeleteFirm = async (firmId) => {
    if (!window.confirm("Are you sure you want to delete this firm?")) return;

    try {
      const res = await deleteFirm(firmId);
      toast.success("Firm deleted successfully!");
      setTrigger(trigger + 1);
    } catch (error) {
      console.error("Error deleting firm:", error);
      toast.error("Failed to delete firm. Please try again.");
    }
  };

  const handleEditImage = (firmId) => {
    // open modal or file upload input
    console.log("Edit image for:", firmId);
    // e.g., setSelectedFirmId(firmId); setModalOpen(true);
  };

  const handleDeleteImage = (firmId) => {
    // make API call to delete image
    console.log("Delete image for:", firmId);
    // e.g., await deleteFirmImage(firmId);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalFirms = firms.length;
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center gap-3 mb-2">
          <BackButton />
        </div>
        <Breadcrumbs title="aaMOBee" breadcrumbItem="All My Business" />
        {/* <Breadcrumbs title="aaMOBee" breadcrumbItem="Business Management" /> */}

        <Col lg={12}>
          <Card>
            <CardBody className="position-relative">
              <i className="bx bx-refresh position-absolute" style={{ fontSize: "24px", fontWeight: "bold", cursor: "pointer", top: "8px", backgroundColor: "lightblue", padding: "2px", marginLeft: "5px", borderRadius: "5px" }} onClick={() => setTrigger(trigger + 1)} ></i>
              <i className="bx bx-plus position-absolute" style={{ fontSize: "24px", fontWeight: "bold", cursor: "pointer", top: "8px", left: "60px", backgroundColor: "lightblue", padding: "2px", marginLeft: "5px", borderRadius: "5px", }} onClick={handleFirmCreate} ></i>
              <span className="position-absolute" style={{ fontSize: "16px", fontWeight: "bold", cursor: "pointer", top: "8px", left: "100px", backgroundColor: "lightblue", padding: "2px 4px", marginLeft: "5px", borderRadius: "5px" }}>Total Firms : {totalFirms}</span>

              <div className="table-responsive mt-4">
                <Table className="table-hover table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Logo/Avatar</th>
                      <th>Company Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentFirms.length > 0 ? (
                      currentFirms.map((firm) => (
                        <tr
                          key={firm._id}
                          onMouseEnter={() => setHoveredFirmId(firm._id)}
                          onMouseLeave={() => setHoveredFirmId(null)}
                        >
                          <td style={{ position: 'relative', width: '80px', height: '50px' }}>
                            {firm.avatar ? (
                              <div
                                style={{
                                  position: 'relative',
                                  width: '50px',
                                  height: '40px',
                                }}
                                onMouseEnter={() => setHoveredFirmId(firm._id)}
                                onMouseLeave={() => setHoveredFirmId(null)}
                              >
                                <img
                                  src={firm.avatar}
                                  alt={firm.companyTitle}
                                  width="50"
                                  height="40"
                                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                                />

                                {/* {hoveredFirmId === firm._id && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50px',
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '6px',
            borderRadius: '4px',
          }}
        >
          <i
            className="bx bx-edit"
            style={{
              color: '#ffc107',
              cursor: 'pointer',
              fontSize: '18px',
            }}
            onClick={() => handleEditImage(firm._id)}
            title="Edit Image"
          ></i>

          <i
            className="bx bx-trash"
            style={{
              color: '#dc3545',
              cursor: 'pointer',
              fontSize: '18px',
            }}
            onClick={() => handleDeleteImage(firm._id)}
            title="Delete Image"
          ></i>
        </div>
      )} */}
                                {/* {hoveredFirmId === firm._id && (
                                  <div
                                    style={{
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      width: '50px',
                                      height: '40px',
                                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                      display: 'flex',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      gap: '6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    <i
                                      className="bx bx-edit"
                                      style={{
                                        color: '#ffc107',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                      }}
                                      onClick={() => handleEditImage(firm._id)}
                                      title="Edit Image"
                                    ></i>

                                    <i
                                      className="bx bx-trash"
                                      style={{
                                        color: '#dc3545',
                                        cursor: 'pointer',
                                        fontSize: '18px',
                                      }}
                                      onClick={() => handleDeleteImage(firm._id)}
                                      title="Delete Image"
                                    ></i>
                                  </div>
                                )} */}
                              </div>
                            ) : (
                              <span>
                                Please upload it <br />
                                {/* using <Link to="/firm-branding">Firm Branding page</Link> */}
                                using <Link to="/business-branding">Firm Branding page</Link>
                              </span>
                            )}
                          </td>

 <td>
                            <Link
                              to="/business-branding"
                              title="Go to business detail page"
                              className="text-primary fw-bold text-decoration-none link-hover-border"
                              onClick={() => {
                                localStorage.setItem(
                                  "defaultFirm",
                                  JSON.stringify({
                                    firmId: firm._id,
                                    fuid: firm.fuid,
                                    name: firm.firmName,
                                    companyTitle: firm.companyTitle,
                                  })
                                );
                              }}
                            >
                              {firm.companyTitle}
                            </Link>
                          </td>                          <td>{firm.email}</td>
                          <td>{firm.companyMobile}</td>
                          <td>
                            {firm.isActive ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </td>
                          <td className="text-center">
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
                              <Link to="/business-branding" onClick={() => {
                                localStorage.setItem(
                                  "defaultFirm",
                                  JSON.stringify({
                                    firmId: firm._id,
                                    fuid: firm.fuid,
                                    name: firm.firmName,
                                    companyTitle: firm.companyTitle,
                                  })
                                );
                              }} style={{ color: '#f0ad4e', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                                <i className="bx bx-edit" style={{ fontSize: "22px", cursor: "pointer", marginLeft: "5px" }}></i>
                              </Link>
                              <span style={{ color: '#ccc' }}>•</span>
                              <span
                                onClick={() => handleDeleteFirm(firm._id)}
                                style={{ color: '#dc3545', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '14px' }}
                              >
                                <i className="bx bx-trash" style={{ fontSize: "22px", cursor: "pointer", marginLeft: "5px" }}></i>
                              </span>

                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          No firms available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {firms.length >= firmsPerPage && (
                <div className="pagination-controls d-flex gap-2 mt-2 mb-3">
                  {pageNumbers.map((number) => (
                    <Button
                      key={number}
                      onClick={() => paginate(number)}
                      className={currentPage === number ? "btn-primary" : "btn-secondary"}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </div>
    </React.Fragment>
  );
}

export default FirmsTable;
