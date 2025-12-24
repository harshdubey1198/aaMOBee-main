import React, { useEffect, useState } from "react";
import { Toast, Button, Card, CardBody, Col, Table, Row, Badge, Spinner } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { deleteFirm } from "../../apiServices/service"
import { BackButton } from "../../components/Common/BackButton";

function FirmsTable() {
  const [firms, setFirms] = useState([]);
  const [hoveredFirmId, setHoveredFirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const [trigger, setTrigger] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const firmsPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser) {
      setLoading(true);
      axios
        .get(`${process.env.REACT_APP_URL}/auth/getCompany/${authUser?._id}`)
        .then((response) => {
          const allFirms = response || [];
          const filteredFirms = allFirms.filter(firm => firm.role === 'firm');
          setFirms(filteredFirms);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching firms:", error);
          setLoading(false);
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

  const handleLogoUpload = async (firmId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.put(`${process.env.REACT_APP_URL}/auth/update/${firmId}`, formData, {
        headers: {
          Authorization: `Bearer ${authUser.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Logo uploaded successfully!");
      setTrigger(trigger + 1); // Trigger re-fetch
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo.");
    }
  };


  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalFirms = firms.length;

  if (loading) {
    return (
      <div className="page-content" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <Spinner color="primary" />
            <p className="mt-2 text-muted" style={{ fontSize: '14px' }}>Loading your businesses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        {/* Header Section */}

        <div className="mb-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="fw-bold text-dark mb-0">My Businesses</h2>
            <Button
              color="primary"
              className="d-flex align-items-center gap-2 px-3 py-2"
              onClick={handleFirmCreate}
              style={{
                borderRadius: '8px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: 'none',
                fontSize: '14px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              <i className="bx bx-plus" style={{ fontSize: '16px' }}></i>
              Add Business
            </Button>
          </div>
        </div>
        
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} sm={12} className="mb-3">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                    <i className="bx bx-buildings text-primary" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '1.2rem' }}>{totalFirms}</h3>
                    <p className="text-muted mb-0 small" style={{ fontSize: '12px' }}>Total Businesses</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={3} md={6} sm={12} className="mb-3">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                    <i className="bx bx-check-circle text-success" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '1.2rem' }}>{firms.filter(f => f.isActive).length}</h3>
                    <p className="text-muted mb-0 small" style={{ fontSize: '12px' }}>Active Businesses</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={3} md={6} sm={12} className="mb-3">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                    <i className="bx bx-image text-warning" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '1.2rem' }}>{firms.filter(f => f.avatar).length}</h3>
                    <p className="text-muted mb-0 small" style={{ fontSize: '12px' }}>With Logo</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg={3} md={6} sm={12} className="mb-3">
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '12px' }}>
              <CardBody className="p-3">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                    <i className="bx bx-cog text-info" style={{ fontSize: '20px' }}></i>
                  </div>
                  <div>
                    <h3 className="mb-1 fw-bold" style={{ fontSize: '1.2rem' }}>{firms.length - firms.filter(f => f.avatar).length}</h3>
                    <p className="text-muted mb-0 small" style={{ fontSize: '12px' }}>Need Setup</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Business Cards Grid */}
        <Row>
          {currentFirms.length > 0 ? (
            currentFirms.map((firm) => (
              <Col lg={4} md={6} sm={12} className="mb-4" key={firm._id}>
                <Card
                  className="border-0 shadow-sm h-100"
                  style={{
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    background: '#ffffff',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    setHoveredFirmId(firm._id);
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.12)';
                  }}
                  onMouseLeave={(e) => {
                    setHoveredFirmId(null);
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <CardBody className="p-4">
                    {/* Header with Logo and Status */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center">
                        <div
                          className="me-3"
                          style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(0, 0, 0, 0.05)'
                          }}
                        >
                          {firm.avatar ? (
                            <img
                              src={firm.avatar}
                              alt={firm.companyTitle}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                              }}
                            />
                          ) : (
                            <i className="bx bx-buildings text-muted" style={{ fontSize: '24px' }}></i>
                          )}
                        </div>
                        <div>
                          <h6 className="mb-1 fw-bold text-dark" style={{ fontSize: '1rem' }}>{firm.companyTitle}</h6>
                          <Badge
                            color={firm.isActive ? "success" : "secondary"}
                            className="px-2 py-1"
                            style={{
                              fontSize: '10px',
                              borderRadius: '12px',
                              fontWeight: '500',
                              padding: '4px 10px'
                            }}
                          >
                            {firm.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>

                      {/* Action Menu */}
                      {/* <div className="dropdown">
                        <button
                          className="btn btn-link text-muted p-0"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="bx bx-dots-vertical-rounded" style={{ fontSize: '24px' }}></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <Link
                              className="dropdown-item d-flex align-items-center gap-2"
                              to="/business-branding"
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
                              onMouseEnter={(e) => {
                                e.target.style.fontWeight = "600";
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.fontWeight = "normal";
                              }}
                              title="Send email"
                            >
                              <i className="bx bx-edit"></i>
                              Edit Business
                            </Link>
                          </li>
                          <li>
                            <Link
                              className="dropdown-item d-flex align-items-center gap-2"
                              to="/business-branding"
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
                              <i className="bx bx-palette"></i>
                              Branding
                            </Link>
                          </li>
                          <li><hr className="dropdown-divider" /></li>
                          <li>
                            <button
                              className="dropdown-item d-flex align-items-center gap-2 text-danger"
                              onClick={() => handleDeleteFirm(firm._id)}
                            >
                              <i className="bx bx-trash"></i>
                              Delete Business
                            </button>
                          </li>
                        </ul>
                      </div> */}
                    </div>

                    {/* Business Details */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bx bx-envelope text-muted me-2" style={{ fontSize: '14px' }}></i>
                        <span className="text-muted small" style={{ fontSize: '13px' }}>{firm.email || 'No email provided'}</span>
                      </div>
                      <div className="d-flex align-items-center mb-2">
                        <i className="bx bx-phone text-muted me-2" style={{ fontSize: '14px' }}></i>
                        <span className="text-muted small" style={{ fontSize: '13px' }}>{firm.companyMobile || 'No phone provided'}</span>
                      </div>
                      {!firm.avatar && (
                        <div className="d-flex align-items-center">
                          <i className="bx bx-image text-warning me-2" style={{ fontSize: '14px' }}></i>
                          <span className="text-warning small" style={{ fontSize: '13px' }}>Logo needed</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-2">
                      <Button
                        color="primary"
                        size="sm"
                        className="justify-content-center"
                        style={{
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '8px 12px',
                          border: 'none',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
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
                          navigate("/business-branding");
                        }}
                      >
                        <i className="bx bx-edit me-1" style={{ fontSize: '14px' }}></i>
                        Manage
                      </Button>
                      {/* <Button
                        color="light"
                        size="sm"
                        style={{
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '500',
                          padding: '8px 12px',
                          border: '1px solid #e9ecef',
                          backgroundColor: '#f8f9fa',
                          color: '#495057',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e9ecef';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }}
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
                          navigate("/business-branding");
                        }}
                      >
                        <i className="bx bx-palette" style={{ fontSize: '14px' }}></i>
                      </Button> */}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            <Col lg={12}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <CardBody className="p-5 text-center">
                  <div className="mb-4">
                    <i className="bx bx-buildings text-muted" style={{ fontSize: '48px' }}></i>
                  </div>
                  <h5 className="mb-2 fw-bold text-dark">No Businesses Found</h5>
                  <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                    You haven't created any businesses yet. Start by adding your first business profile.
                  </p>
                  <Button
                    color="primary"
                    size="md"
                    className="px-4 py-2"
                    onClick={handleFirmCreate}
                    style={{
                      borderRadius: '8px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      fontSize: '14px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    <i className="bx bx-plus me-1" style={{ fontSize: '16px' }}></i>
                    Create Your First Business
                  </Button>
                </CardBody>
              </Card>
            </Col>
          )}
        </Row>

        {/* Pagination */}
        {firms.length >= firmsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <nav aria-label="Business pagination">
              <ul className="pagination">
                {pageNumbers.map((number) => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(number)}
                      style={{
                        borderRadius: '6px',
                        margin: '0 2px',
                        border: 'none',
                        padding: '8px 14px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease',
                        backgroundColor: currentPage === number ? '#0d6efd' : '#f8f9fa',
                        color: currentPage === number ? 'white' : '#6c757d',
                        boxShadow: currentPage === number ? '0 2px 4px rgba(0, 0, 0, 0.15)' : '0 1px 2px rgba(0, 0, 0, 0.05)',
                        fontSize: '13px'
                      }}
                      onMouseEnter={(e) => {
                        if (currentPage !== number) {
                          e.target.style.backgroundColor = '#e9ecef';
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentPage !== number) {
                          e.target.style.backgroundColor = '#f8f9fa';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
                        }
                      }}
                    >
                      {number}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Refresh Button */}
        <div className="position-fixed" style={{ bottom: '20px', right: '20px', zIndex: 1000 }}>
          <Button
            color="primary"
            className="rounded-circle"
            style={{
              width: '48px',
              height: '48px',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease',
              background: '#0d6efd'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px) rotate(90deg)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) rotate(0deg)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
            onClick={() => setTrigger(trigger + 1)}
          >
            <i className="bx bx-refresh" style={{ fontSize: '20px', color: 'white' }}></i>
          </Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default FirmsTable;
