import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row, Badge, Progress } from "reactstrap";
import Chart from "react-apexcharts";
import { clientDashboard, firmUsersDashboard, superAdminDashboard } from "../../apiServices/service";
import { Link } from "react-router-dom";

const RoleBasedAnalytics2 = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const isSmallDeviceUp = () => window.innerWidth >= 576;
  const mutedSmallTextStyle = isSmallDeviceUp() ? { fontSize: "72%" } : {};
  const role = authuser?.role;
  const userId = authuser?._id;
  const [dashboardData, setDashboardData] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loading, setLoading] = useState(true);

  // Responsive device tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  const chartSize = isDesktop ? 180 : isTablet ? 150 : 120;

  const fetchClientDashboard = async () => {
    try {
      setLoading(true);
      const response = await clientDashboard(userId);
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching client dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFirmDashboard = async () => {
    try {
      setLoading(true);
      const response = await firmUsersDashboard(userId);
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching firm dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchSuperAdminDashboard = async () => {
    try {
      setLoading(true);
      const response = await superAdminDashboard(userId);
      if (response && response.data) {
        setDashboardData(response.data);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching firm dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (role === "super_admin") {
      fetchSuperAdminDashboard();
    }
    else if (role === "client_admin") {
      fetchClientDashboard();
    } else {
      fetchFirmDashboard();
    }
  }, []);

  const buildMetricsByRole = (role, data) => {
    const allMetrics = {
      totalClients: { label: "Total Clients", count: data?.TotalAdminClient, route: "/clients-management", icon: "bx bx-user", color: "primary" },
      activeClients: { label: "Active Clients", count: data?.ActivePlanCount, icon: "bx bx-check-circle", color: "success" },
      inactiveClients: { label: "Inactive Clients", count: data?.InactiveClient, icon: "bx bx-x-circle", color: "danger" },
      activeBlogs: { label: "Active Blogs", count: data?.ActiveBlogs, route: "/all-blogs", icon: "bx bx-news", color: "warning" },
      activeBlogAdmin: { label: "Active Blog Admin", count: data?.BlogAdminCount, icon: "bx bx-user-check", color: "info" },
      firms: { label: "Businesses", count: data?.TotalFirm, route: "/my-businesses", icon: "bx bx-building", color: "primary" },
      users: { label: "Users", count: data?.TotalUsers || data?.TotalFirmUsers, route: "/firm-users", icon: "bx bx-users", color: "info" },
      inventoryQuantity: { label: "Total Inventory Quantity", count: data?.TotalQuantity || data?.TotalInventoryQuantity, route: "/product-list", icon: "bx bx-package", color: "warning" },
      productionOrders: { label: "Production Orders", count: data?.TotalProductionOrders || data?.ProductionOrderCount, route: "/production/orders", icon: "bx bx-cog", color: "secondary" },
      invoices: { label: "Invoices", count: data?.TotalInvoice, route: "/all-invoices", icon: "bx bx-receipt", color: "primary" },
      bills: { label: "Bills", count: data?.TotalBills || data?.TotalBillsCount, route: "/retail-bills", icon: "bx bx-file", color: "info" },
      crmUsers: { label: "CRM Users", count: data?.TotalCRMUsers, route: "/crm/assigned-teams", icon: "bx bx-user-check", color: "success" },
      crmLeads: { label: "CRM Leads", count: data?.TotalCRMLeads || data?.TotalLeads, route: "/crm/all-leads", icon: "bx bx-target-lock", color: "warning" },
      lowStockAlerts: { label: "Low Stock", count: data?.LowStockItemsCount || data?.LowStockItemCount, route: "/dashboard", icon: "bx bx-error", color: "danger" },
      totalCustomers: { label: "Total Customers", count: data?.totalCustomers || 0, route: "/customers", icon: "bx bx-user-detail", color: "primary" },
      totalVendors: { label: "Total Vendors", count: data?.TotalVendors || 0, route: "/suppliers-vendors", icon: "bx bx-store", color: "secondary" },
      totalInventory: { label: "Inventory Items", count: data?.Totalinventory || 0, route: "/product-list", icon: "bx bx-package", color: "warning" },
    };

    const roleSpecificKeys = {
      super_admin: ["totalClients", "totalPaymentReveived", "activeClients", "inactiveClients", "dailyRegisteredUsers", "monthlyRegisteredUsers", "activeBlogs", "activeBlogAdmin"],
      client_admin: ["firms", "invoices", "crmLeads", "lowStockAlerts"],
      firm_admin: ["users", "inventoryQuantity", "productionOrders", "invoices", "bills", "crmLeads", "lowStockAlerts"],
      accountant: ["invoices", "bills", "crmLeads", "inventoryQuantity", "totalCustomers"],
      employee: ["inventoryQuantity", "productionOrders", "lowStockAlerts", "totalVendors", "totalInventory"],
    };

    const keys = roleSpecificKeys[role] || [];
    const roleMetrics = {};
    keys.forEach(key => {
      if (allMetrics[key]) {
        roleMetrics[key] = allMetrics[key];
      }
    });

    return roleMetrics;
  };

  const metrics = buildMetricsByRole(role, dashboardData);
  if (!metrics) return null;

  const roleBasedDonutKeys = {
    super_admin: ["totalClients", "totalPaymentReveived", "activeClients", "inactiveClients", "dailyRegisteredUsers", "monthlyRegisteredUsers", "activeBlogs", "activeBlogAdmin"],
    client_admin: ["firms", "invoices", "crmLeads", "lowStockAlerts"],
    firm_admin: ["users", "inventoryQuantity", "productionOrders", "invoices", "bills", "crmLeads", "lowStockAlerts"],
    accountant: ["invoices", "bills", "crmLeads", "inventoryQuantity", "totalCustomers"],
    employee: ["inventoryQuantity", "lowStockAlerts", "totalVendors", "totalInventory"],
  };

  const selectedKeys = roleBasedDonutKeys[role] || [];

  const donutSeries = [];
  const donutLabels = [];
  const donutColors = ["#667eea", "#f093fb", "#4facfe", "#43e97b", "#fa709a", "#fee140", "#a8edea", "#fed6e3"];

  selectedKeys.forEach((key) => {
    const metric = metrics[key];
    if (metric && !isNaN(metric.count)) {
      donutSeries.push(Number(metric.count));
      donutLabels.push(metric.label);
    }
  });

  const chartOptions = {
    chart: {
      type: "donut",
      background: 'transparent',
      dropShadow: {
        enabled: true,
        top: 2,
        left: 2,
        blur: 4,
        opacity: 0.1
      }
    },
    labels: donutLabels,
    colors: donutColors,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '12px',
              fontFamily: 'inherit',
              color: '#6c757d',
              offsetY: -10
            },
            value: {
              show: true,
              fontSize: '16px',
              fontFamily: 'inherit',
              fontWeight: 600,
              color: '#212529',
              offsetY: 0,
              formatter: function (val) {
                return val.toString();
              }
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 600,
              color: "#212529",
              formatter: function (w) {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return total.toString();
              },
            },
          },
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: 'light',
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function(value) {
          return value.toString();
        }
      }
    },
    stroke: {
      width: 0,
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.1,
        }
      }
    }
  };

  const getTitle = () => {
    switch (role) {
      case "super_admin": return "System Analytics";
      case "client_admin": return "Business Analytics";
      case "firm_admin": return "Performance Overview";
      case "accountant": return "Financial Analytics";
      case "employee": return "Operational Metrics";
      default: return "Analytics";
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case "super_admin": return "Complete system distribution and user analytics";
      case "client_admin": return "Business metrics and lead distribution";
      case "firm_admin": return "Team performance and operational metrics";
      case "accountant": return "Financial data and customer distribution";
      case "employee": return "Inventory and vendor distribution";
      default: return "Data distribution and insights";
    }
  };

  const getGradientBackground = () => {
    switch (role) {
      case "super_admin": return "#1E4E5B";
      case "client_admin": return "#1E4E5B";
      case "firm_admin": return "#1E4E5B";
      case "accountant": return "#1E4E5B";
      case "employee": return "#1E4E5B";
      default: return "#1E4E5B";
    }
  };

  if (loading) {
    return (
      <Card className="flex-grow-1 h-100 d-flex flex-column" style={{ borderRadius: '16px' }}>
        <CardBody className="d-flex flex-column justify-content-center align-items-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading analytics...</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="flex-grow-1 h-100 d-flex flex-column border-0 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden' }}>
      <CardBody className="p-0 d-flex flex-column h-100">
        {/* Enhanced Header with Gradient */}
        <div 
          className="p-4 text-black"
          style={{ 
            background: getGradientBackground(),
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Pattern */}
          <div 
            className="position-absolute top-0 end-0 opacity-10"
            style={{ 
              width: '100px',
              height: '100px',
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              transform: 'rotate(45deg)'
            }}
          ></div>
          
          <div className="d-flex justify-content-between align-items-center position-relative">
            <div>
              <h5 className="fw-bold text-white mb-1 d-flex align-items-center">
                <i className="bx bx-chart text-white me-2" style={{ fontSize: '24px' }}></i>
                {getTitle()}
              </h5>
              <p className="text-white-50 mb-0">{getSubtitle()}</p>
            </div>
            <Badge 
              color="light" 
              className="px-3 py-2"
              style={{ 
                fontSize: '12px', 
                borderRadius: '20px',
                color: '#333',
                fontWeight: '600'
              }}
            >
              <i className="bx bx-pulse me-1"></i>
              Live Data
            </Badge>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-grow-1 d-flex flex-column">
          <Row className="align-items-start flex-grow-1">
            <Col md="6" className="d-flex flex-column">
              <div className="mb-3 flex-grow-1">
                <h6 className="fw-bold text-dark mb-3 d-flex align-items-center">
                  <i className="bx bx-list-ul text-primary me-2" style={{ fontSize: '18px' }}></i>
                  Detailed Metrics
                </h6>
                <div className="d-flex flex-column justify-content-between h-100">
                  {Object.entries(metrics).map(([key, metric]) => (
                    <div 
                      key={key} 
                      className="mb-3 p-3 rounded"
                      style={{ 
                        backgroundColor: '#f8f9fa',
                        border: '1px solid #e9ecef',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(5px)';
                        e.currentTarget.style.backgroundColor = '#e3f2fd';
                        e.currentTarget.style.borderColor = '#2196f3';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.backgroundColor = '#f8f9fa';
                        e.currentTarget.style.borderColor = '#e9ecef';
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <div 
                            className={`me-3 p-2 rounded-circle d-flex align-items-center justify-content-center`}
                            style={{ 
                              width: '40px',
                              height: '40px',
                              background: `linear-gradient(135deg, var(--bs-${metric.color}) 0%, var(--bs-${metric.color}-rgb) 100%)`,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                          >
                            <i className={`bx ${metric.icon} text-black`} style={{ fontSize: '18px' }}></i>
                          </div>
                          <div>
                            <span className="fw-bold text-dark d-block" style={{ fontSize: '14px' }}>{metric.label}</span>
                            <small className="text-muted">Click to view details</small>
                          </div>
                        </div>
                        <Link to={metric.route} className="fw-bold text-decoration-none">
                          <div 
                            className="px-3 py-1 rounded-pill"
                            style={{ 
                              background: `linear-gradient(135deg, var(--bs-${metric.color}) 0%, var(--bs-${metric.color}-rgb) 100%)`,
                              color: 'black',
                              fontSize: '16px',
                              fontWeight: '600',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                          >
                            {metric.count?.toLocaleString() || 0}
                          </div>
                        </Link>
                      </div>
                      <Progress 
                        value={metric.count > 0 ? Math.min((metric.count / 100) * 100, 100) : 0} 
                        color={metric.color}
                        className="mb-0"
                        style={{ height: '4px', borderRadius: '2px' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {(role === "super_admin" || role === "client_admin" || role === "firm_admin" || role === "accountant" || role === "employee") && (
              <>
                {/* Enhanced Divider */}
                <div
                  className="vr d-none d-md-block"
                  style={{ 
                    height: '100%', 
                    minWidth: "2px", 
                    background: 'linear-gradient(180deg, #e9ecef 0%, #dee2e6 50%, #e9ecef 100%)',
                    margin: "0 1px",
                    borderRadius: '1px'
                  }}
                ></div>

                {/* Mobile Divider */}
                <hr className="d-block d-md-none my-3" />

                <Col md="5" className="text-center d-flex flex-column align-items-center justify-content-center">
                  <div className="mb-4">
                    <h6 className="fw-bold text-dark mb-2">Data Distribution</h6>
                    <p className="text-muted small mb-0">Visual representation of your metrics</p>
                  </div>
                  
                  <div className="position-relative mb-4">
                    <Chart
                      options={chartOptions}
                      series={donutSeries}
                      type="donut"
                      height={chartSize}
                      width={chartSize}
                    />
                    
                    <div 
                      className="position-absolute top-50 start-50 translate-middle"
                      style={{ 
                        width: '70px', 
                        height: '70px', 
                        background: 'white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                        border: '3px solid #f8f9fa'
                      }}
                    >
                      <i className="bx bx-pie-chart-alt-2 text-primary" style={{ fontSize: '28px' }}></i>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                      {donutColors.slice(0, 4).map((color, index) => (
                        <div 
                          key={index}
                          className="d-flex align-items-center p-2 rounded"
                          style={{ 
                            fontSize: '12px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #e9ecef'
                          }}
                        >
                          <div 
                            className="me-2"
                            style={{ 
                              width: '12px', 
                              height: '12px', 
                              backgroundColor: color,
                              borderRadius: '3px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                            }}
                          ></div>
                          <span className="text-muted fw-medium">{donutLabels[index] || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Col>
              </>
            )}
          </Row>

          {/* Enhanced Summary Section */}
          <div 
            className="mt-4 p-4 rounded"
            style={{ 
              background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
              border: '1px solid #e1f5fe'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h6 className="fw-bold text-primary mb-2 d-flex align-items-center">
                  <i className="bx bx-bulb me-2" style={{ fontSize: '18px' }}></i>
                  Quick Insights
                </h6>
                <p className="text-muted small mb-0">
                  {role === "super_admin" && "Monitor system health and user growth patterns"}
                  {role === "client_admin" && "Track business performance and lead conversion"}
                  {role === "firm_admin" && "Optimize team productivity and resource allocation"}
                  {role === "accountant" && "Maintain financial health and cash flow"}
                  {role === "employee" && "Ensure operational efficiency and inventory control"}
                </p>
              </div>
              <div className="text-end">
                <Badge 
                  color="success" 
                  className="px-3 py-2"
                  style={{ 
                    fontSize: '12px', 
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}
                >
                  <i className="bx bx-trending-up me-1"></i>
                  Optimized
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default RoleBasedAnalytics2;
