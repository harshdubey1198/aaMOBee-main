import React, { useState, useEffect } from "react";
import { Row, Container, Col, Card, CardBody, Badge, Button, Spinner } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import SelfProfiling from "../Utility/SelfProfiling";
import RoleBasedAnalytics from "./RoleBasedAnalytics";
import RoleBasedAnalytics2 from "./RoleBasedAnalytics2";
import ClientSubscriptionDetails from "./ClientSubscriptionDetails";
import { toast } from 'react-toastify';

const Dashboard = () => {
  const authuser = JSON.parse(localStorage.getItem('authUser'))?.response;
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(false);

  document.title = "Dashboard | aaMOBee";

  // Set greeting based on time of day
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [currentTime]);

  const getQuickActions = () => {
    const actions = [
      { 
        title: "Create Invoice", 
        icon: "bx bx-receipt", 
        color: "primary", 
        route: "/create-invoice",
        description: "Generate new invoice",
        gradient: "linear-gradient(135deg, rgb(13, 66, 81) 0%, rgb(180, 200, 210) 100%)"
      },
      { 
        title: "Add Business", 
        icon: "bx bx-building", 
        color: "success", 
        route: "/add-business",
        description: "Register new business",
        gradient: "linear-gradient(135deg, rgb(20, 83, 99) 0%, rgb(190, 210, 220) 100%)"
      },
      { 
        title: "Manage Inventory", 
        icon: "bx bx-package", 
        color: "warning", 
        route: "/product-list",
        description: "Update stock levels",
        gradient: "linear-gradient(135deg, rgb(28, 95, 110) 0%, rgb(200, 218, 225) 100%)"
      },
      { 
        title: "CRM Leads", 
        icon: "bx bx-user-plus", 
        color: "info", 
        route: "/crm/all-leads",
        description: "View lead pipeline",
        gradient: "linear-gradient(135deg, rgb(36, 108, 125) 0%, rgb(210, 225, 230) 100%)"
      }
    ];
    return actions;
  };
  

  const handleQuickAction = (route) => {
    setLoading(true);
    setTimeout(() => {
      navigate(route);
      setLoading(false);
    }, 300);
  };

  // Get user's display name with fallbacks
  const getUserDisplayName = () => {
    if (authuser?.name) return authuser.name;
    if (authuser?.firstName && authuser?.lastName) return `${authuser.firstName} ${authuser.lastName}`;
    if (authuser?.firstName) return authuser.firstName;
    if (authuser?.email) return authuser.email.split('@')[0];
    return "User";
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container fluid={true} className="px-4 py-3">
          {/* Enhanced Header Section */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  {greeting}, {getUserDisplayName()}! 👋
                </h2>
                <p className="text-muted mb-0">
                  Welcome back! Here's what's happening with your business today.
                </p>
                <small className="text-muted">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString()}
                </small>
              </div>
              <div className="text-end">
                <Badge 
                  style={{ 
                    backgroundColor: '#2ECC71', 
                    color: 'white',
                    fontSize: '14px', 
                    borderRadius: '20px',
                    padding: '8px 16px',
                    border: 'none'
                  }}
                  className="mb-2"
                >
                  <i className="bx bx-check-circle me-1"></i>
                  System Online
                </Badge>
                <div className="text-muted small">
                  Last updated: {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <Breadcrumbs title="aaMOBee" breadcrumbItem="Dashboard" />
          </div>

          {/* Enhanced Quick Actions Section */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: "20px", overflow: "hidden" }}>
                <CardBody className="p-4" style={{ background: "#1E4E5B" }}>
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="fw-bold text-white mb-1 d-flex align-items-center">
                        <i className="bx bx-bolt text-warning me-2" style={{ fontSize: "24px" }}></i>
                        Quick Actions
                      </h5>
                      <p className="text-white-50 mb-0 " style={{paddingLeft:"4px"}}>
                        Access your most important features instantly
                      </p>
                    </div>
                    <div className="text-white-50">
                      <i className="bx bx-zap" style={{ fontSize: "32px" }}></i>
                    </div>
                  </div>

                  {/* Grid */}
                  <Row className="g-3">
                    {getQuickActions().map((action, index) => (
                      <Col key={index} xs={12} sm={6} md={6} lg={4} xl={3}>
                        <div
                          className="quick-action-card h-100"
                          style={{
                            borderRadius: "16px",
                            padding: "20px",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            position: "relative",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            wordWrap: "break-word",
                            whiteSpace: "normal",
                            minHeight: "auto",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.1)";
                          }}
                          onClick={() => handleQuickAction(action.route)}
                        >
                          {/* Background overlay */}
                          <div
                            className="position-absolute top-0 start-0 w-100 h-100 opacity-10"
                            style={{
                              background: action.gradient,
                              borderRadius: "16px",
                            }}
                          ></div>

                          {/* Icon corner */}
                          <div
                            className="position-absolute top-0 end-0 p-3 opacity-20"
                            style={{
                              background: action.gradient,
                              borderRadius: "0 16px 0 16px",
                              width: "70px",
                              height: "70px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i className={`bx ${action.icon}`} style={{ fontSize: "36px", color: "white" }}></i>
                          </div>

                          {/* Content */}
                          <div className="position-relative z-1 h-100 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex align-items-center mb-2">
                                <div
                                  className="me-1 p-2 rounded-circle"
                                  style={{
                                    background: action.gradient,
                                    width: "40px",
                                    height: "40px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                >
                                  <i className={`bx ${action.icon}`} style={{ fontSize: "20px", color: "white" }}></i>
                                </div>
                                <span className="fw-bold text-white" style={{ fontSize: "16px" }}>
                                  {action.title}
                                </span>
                              </div>
                              <p
                                className="mb-0 text-white-50"
                                style={{
                                  fontSize: "13px",
                                  lineHeight: "1.4",
                                  wordWrap: "break-word",
                                  whiteSpace: "normal",
                                }}
                              >
                                {action.description}
                              </p>
                            </div>

                            {/* Arrow */}
                            <div className="d-flex justify-content-end">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center"
                                style={{
                                  width: "32px",
                                  height: "32px",
                                  background: "#333",
                                }}
                              >
                                <i className="bx bx-right-arrow-alt" style={{ fontSize: "16px", color: "white" }}></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          {/* Main Analytics Section */}
          <RoleBasedAnalytics/>

          {/* Secondary Analytics Row */}
          <Row className="justify-content-between gx-3 gy-3 align-items-stretch" style={{marginBottom:"20px"}}>
            <Col sm="12" md="12" lg="8" className="d-flex">  
              <RoleBasedAnalytics2 />
            </Col>
            {(authuser?.role === "client_admin" && !authuser?.isDemo) && (
              <Col sm="12" md="12" lg="4">
                <ClientSubscriptionDetails />
              </Col>
            )}
            <Col sm="12" md="12" lg="6" className="d-flex">
              <SelfProfiling /> 
            </Col>
          </Row>

          {/* System Status & Tips Section */}
          <Row className="mb-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
                <CardBody className="p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="bx bx-bulb text-info me-2" style={{ fontSize: '20px' }}></i>
                    Pro Tips & Insights
                  </h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-info bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bx bx-trending-up text-info" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">Revenue Optimization</h6>
                          <p className="text-muted small mb-0">
                            Track your monthly revenue trends and identify peak performance periods.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bx bx-user-check text-success" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">Customer Management</h6>
                          <p className="text-muted small mb-0">
                            Monitor your CRM leads and customer engagement metrics regularly.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bx bx-package text-warning" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">Inventory Control</h6>
                          <p className="text-muted small mb-0">
                            Keep track of low stock items to avoid stockouts and maintain efficiency.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-start">
                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                          <i className="bx bx-receipt text-primary" style={{ fontSize: '18px' }}></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-1">Invoice Management</h6>
                          <p className="text-muted small mb-0">
                            Monitor overdue invoices and pending payments to maintain cash flow.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                <CardBody className="p-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center">
                    <i className="bx bx-cog text-secondary me-2" style={{ fontSize: '20px' }}></i>
                    System Status
                  </h5>
                  <div className="space-y-3">
                    <div className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <span className="small">Database</span>
                      <Badge style={{ backgroundColor: '#2ECC71', color: 'white' }} className="px-2 py-1">Connected</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <span className="small">API Services</span>
                      <Badge style={{ backgroundColor: '#2ECC71', color: 'white' }} className="px-2 py-1">Online</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <span className="small">File Storage</span>
                      <Badge style={{ backgroundColor: '#2ECC71', color: 'white' }} className="px-2 py-1">Active</Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{ backgroundColor: '#f8f9fa' }}>
                      <span className="small">Email Service</span>
                      <Badge style={{ backgroundColor: '#2ECC71', color: 'white' }} className="px-2 py-1">Ready</Badge>
                    </div>
                  </div>
                  {/* <div className="mt-4 p-3 rounded" style={{ backgroundColor: '#e3f2fd' }}>
                    <h6 className="fw-bold text-primary mb-2">
                      <i className="bx bx-info-circle me-1"></i>
                      Need Help?
                    </h6>
                    <p className="text-muted small mb-2">
                      Our support team is available 24/7 to assist you with any questions.
                    </p>
                    <Button 
                      style={{ 
                        backgroundColor: '#F7931E', 
                        border: 'none',
                        borderRadius: '8px' 
                      }}
                      size="sm"
                      onClick={() => toast.info("Support feature coming soon!")}
                    >
                      Contact Support
                    </Button>
                  </div> */}
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Loading Overlay */}
          {loading && (
            <div 
              className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
              style={{ 
                backgroundColor: 'rgba(0,0,0,0.5)', 
                zIndex: 9999 
              }}
            >
              <div className="text-center text-white">
                <Spinner color="light" size="lg" />
                <p className="mt-3">Loading...</p>
              </div>
            </div>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
