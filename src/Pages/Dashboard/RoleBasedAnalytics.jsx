import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row, Badge, Progress } from "reactstrap";
import { Link } from "react-router-dom";
import { clientDashboard, firmUsersDashboard, superAdminDashboard } from "../../apiServices/service";

const RoleBasedAnalytics = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const isSmallDeviceUp = () => window.innerWidth >= 576;
  const mutedSmallTextStyle = isSmallDeviceUp() ? { fontSize: "72%" } : {};
  const userId = authuser?._id;
  const superadminId = authuser?._id;
  const role = authuser?.role;
  const [dashboardData, setDashboardData] = useState();
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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
      const response = await superAdminDashboard(superadminId);
      if (response && response.data) {
        setDashboardData(response.data);
        setMonthlyRevenueData(response.data.MonthlyRevenue);
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
    if (monthlyRevenueData.length > 1) {
      const interval = setInterval(() => {
        setCurrentMonthIndex((prevIndex) => (prevIndex + 1) % monthlyRevenueData.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [monthlyRevenueData]);

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

  if (!authuser) return null;

  const buildMetricsByRole = (role, data) => {
    const allMetrics = {
      totalClients: { label: "Total Clients", count: data?.TotalAdminClient, route: "/clients-management", icon: "bx bx-user", color: "#1E4E5B" },
      totalPaymentReveived: { label: "Total Payment Received", count: data?.TotalPaymentReceived, route: "/clients-payments", icon: "bx bx-money", color: "#2ECC71" },
      activeClients: { label: "User Active Plans", count: data?.ActivePlanCount, route: "/dashboard", icon: "bx bx-check-circle", color: "#2ECC71" },
      inactiveClients: { label: "User Inactive Plans", count: data?.InactiveClient, route: "/dashboard", icon: "bx bx-x-circle", color: "#E74C3C" },
      dailyRegisteredUsers: { label: "Daily Registered Users", count: data?.DailyRegisteredUsers, route: "/dashboard", icon: "bx bx-user-plus", color: "#3498DB" },
      monthlyRegisteredUsers: { label: "Monthly Registered Users", count: data?.MontlyRegisteredUsers, route: "/dashboard", icon: "bx bx-group", color: "#3498DB" },
      activeBlogs: { label: "Active Blogs", count: data?.ActiveBlogs, route: "/all-blogs", icon: "bx bx-news", color: "#F7931E" },
      yearlyRevenue: { label: "Yearly Revenue", count: data?.YearlyRevenue?.[0]?.totalAmount || 0, route: "/clients-payments", icon: "bx bx-trending-up", color: "#2ECC71" },
      firms: { label: "Businesses", count: data?.TotalFirm, route: "/my-businesses", icon: "bx bx-building", color: "#1E4E5B" },
      users: { label: "Users", count: data?.TotalUsers || data?.TotalFirmUsers, route: "/team-access", icon: "bx bx-user", color: "#3498DB" },
      inventory: { label: "Inventory", count: data?.TotalQuantity || data?.TotalInventoryQuantity, route: "/product-list", icon: "bx bx-package", color: "#F7931E" },
      productionOrders: { label: "Production Orders", count: data?.TotalProductionOrders || data?.ProductionOrderCount, route: "/production/orders", icon: "bx bx-cog", color: "#95A5A6" },
      invoices: { label: "Invoices", count: data?.TotalInvoice, route: "/all-invoices", icon: "bx bx-receipt", color: "#1E4E5B" },
      bills: { label: "Bills", count: data?.TotalBills || data?.TotalBillsCount, route: "/retail-bills", icon: "bx bx-file", color: "#3498DB" },
      crmUsers: { label: "CRM Users", count: data?.TotalCRMUsers, route: "/crm/assigned-teams", icon: "bx bx-user-check", color: "#2ECC71" },
      crmLeads: { label: "CRM Leads", count: data?.TotalCRMLeads || data?.TotalLeads, route: "/crm/all-leads", icon: "bx bx-target-lock", color: "#F7931E" },
      lowStockAlerts: { label: "Low Stock", count: data?.LowStockItemsCount || data?.LowStockItemCount, route: "/dashboard", icon: "bx bx-error", color: "#E74C3C" },
      pendingPayments: { label: "Pending Payments", count: data?.TotalOverdueAmount || 0, route: "/dashboard", icon: "bx bx-time", color: "#F7931E" },
      overdueInvoices: { label: "Overdue Invoices", count: data?.TotalOverDueInvoicesCount || 0, route: "/dashboard", icon: "bx bx-alarm", color: "#E74C3C" },
      shiftHours: { label: "Shift Hours", count: data?.ShiftHours || data?.TotalShiftHours || 0, route: "/dashboard", icon: "bx bx-time-five", color: "#3498DB" },
      totalCustomers: { label: "Total Customers", count: data?.TotalCustomers || 0, route: "/dashboard", icon: "bx bx-user-detail", color: "#1E4E5B" },
      totalVendors: { label: "Total Vendors", count: data?.TotalVendors || 0, route: "/suppliers-vendors", icon: "bx bx-store", color: "#95A5A6" },
      manufacturers: { label: "Manufacturers", count: data?.TotalManufacturers || 0, route: "/dashboard", icon: "bx bx-factory", color: "#34495E" },
      brands: { label: "Brands", count: data?.TotalBrands || 0, route: "/dashboard", icon: "bx bx-tag", color: "#3498DB" },
    };

    const roleSpecificKeys = {
      super_admin:  ["totalClients", "totalPaymentReveived", "activeClients", "inactiveClients", "dailyRegisteredUsers", "monthlyRegisteredUsers", "activeBlogs", "yearlyRevenue"],
      client_admin: ["firms", "users", "inventory", "productionOrders", "invoices", "bills", "crmUsers", "crmLeads"],
      firm_admin:   ["users", "inventory", "productionOrders", "invoices", "bills", "crmUsers", "crmLeads"],
      accountant:   ["invoices", "bills", "crmLeads", "pendingPayments", "overdueInvoices"],
      employee:     ["inventory", "productionOrders", "lowStockAlerts", "shiftHours", "assignedTasks", "completedTasks", "totalCustomers", "totalVendors", "manufacturers", "brands"],
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

  const getTitle = () => {
    switch (role) {
      case "super_admin": return "Overall Analytics";
      case "client_admin": return "Business Overview";
      case "firm_admin": return "Performance Metrics";
      case "accountant": return "Financial Overview";
      case "employee": return "Operational Dashboard";
      default: return "Dashboard";
    }
  };

  const getSubtitle = () => {
    switch (role) {
      case "super_admin": return "Complete system overview and revenue analytics";
      case "client_admin": return "Monitor your businesses and key performance indicators";
      case "firm_admin": return "Track operational metrics and team performance";
      case "accountant": return "Financial health and payment tracking";
      case "employee": return "Daily operations and task management";
      default: return "Key metrics and insights";
    }
  };

  const MetricCard = ({ metric, key }) => {
    if (!metric) return null;
    
    const getProgressValue = () => {
      const count = metric.count || 0;
      if (count === 0) return 0;
      if (count < 10) return 25;
      if (count < 50) return 50;
      if (count < 100) return 75;
      return 100;
    };

    const getTrendIcon = () => {
      const count = metric.count || 0;
      if (count > 0) return "bx bx-trending-up text-success";
      return "bx bx-minus text-muted";
    };

    return (
      <Link to={metric.route} className="text-decoration-none">
        <Card 
          className="border-0 shadow-sm h-100 metric-card"
          style={{ 
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
          }}
        >
          <CardBody className="p-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div 
                className="p-2 rounded-circle"
                style={{ 
                  backgroundColor: `${metric.color}20`,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className={metric.icon} style={{ fontSize: '20px', color: metric.color }}></i>
              </div>
              {/* <i className={metric.icon} style={{ fontSize: '16px' }}></i> */}
            </div>
            <h4 className="fw-bold mb-1" style={{ color: metric.color }}>
              {typeof metric.count === "number" && metric.label.includes("Revenue")
                ? `₹${metric.count.toLocaleString()}`
                : metric.count?.toLocaleString() ?? 0}
            </h4>
            <p className="text-muted small mb-2">{metric.label}</p>
            <Progress 
              value={getProgressValue()} 
              style={{ 
                height: '4px', 
                borderRadius: '2px',
                backgroundColor: '#f8f9fa'
              }}
            >
              <div 
                className="progress-bar" 
                style={{ 
                  backgroundColor: metric.color,
                  borderRadius: '2px'
                }}
              ></div>
            </Progress>
          </CardBody>
        </Card>
      </Link>
    );
  };

  if (loading) {
    return (
      <Row className="gx-3 mt-1">
        <Col lg={12}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <CardBody className="p-5 text-center">
              <div className="spinner-border" style={{ color: '#1E4E5B' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading dashboard data...</p>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <React.Fragment>
      <Row className="gx-3 mt-1">
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CardBody className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h4 className="fw-bold text-dark mb-1">{getTitle()}</h4>
                  <p className="text-muted mb-0">{getSubtitle()}</p>
                </div>
                <Badge 
                  style={{ 
                    backgroundColor: '#1E4E5B', 
                    color: 'white',
                    fontSize: '14px', 
                    borderRadius: '20px',
                    padding: '8px 16px'
                  }}
                >
                  <i className="bx bx-refresh me-1"></i>
                  Real-time Data
                </Badge>
              </div>
              
              <Row className="g-3">
                {Object.entries(metrics).map(([key, metric]) => (
                  <Col lg={3} md={4} sm={6} key={key}>
                    <MetricCard metric={metric} key={key} />
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card className="shadow-sm h-100" style={{ borderRadius: '16px' }}>
            <CardBody className="d-flex flex-column justify-content-start p-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <i className="bx bx-stats me-2" style={{ fontSize: '20px', color: '#1E4E5B' }}></i>
                Key Insights
              </h5>
              
              {role === "super_admin" && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Today's Registrations</h6>
                      <p className="text-muted small mb-0">New user signups</p>
                    </div>
                    <Badge style={{ backgroundColor: '#2ECC71', color: 'white' }} className="px-2 py-1">
                      {metrics.dailyRegisteredUsers?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Monthly Growth</h6>
                      <p className="text-muted small mb-0">User acquisition</p>
                    </div>
                    <Badge style={{ backgroundColor: '#3498DB', color: 'white' }} className="px-2 py-1">
                      {metrics.monthlyRegisteredUsers?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">Active Content</h6>
                      <p className="text-muted small mb-0">Published blogs</p>
                    </div>
                    <Badge style={{ backgroundColor: '#F7931E', color: 'white' }} className="px-2 py-1">
                      {metrics.activeBlogs?.count || 0}
                    </Badge>
                  </div>
                </div>
              )}

              {role === "client_admin" && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Inventory Status</h6>
                      <p className="text-muted small mb-0">Total items in stock</p>
                    </div>
                    <Badge style={{ backgroundColor: '#F7931E', color: 'white' }} className="px-2 py-1">
                      {metrics.inventory?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Invoice Count</h6>
                      <p className="text-muted small mb-0">Generated invoices</p>
                    </div>
                    <Badge style={{ backgroundColor: '#1E4E5B', color: 'white' }} className="px-2 py-1">
                      {metrics.invoices?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">Lead Pipeline</h6>
                      <p className="text-muted small mb-0">Active leads</p>
                    </div>
                    <Badge style={{ backgroundColor: '#2ECC71', color: 'white' }} className="px-2 py-1">
                      {metrics.crmLeads?.count || 0}
                    </Badge>
                  </div>
                </div>
              )}

              {role === "firm_admin" && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Team Size</h6>
                      <p className="text-muted small mb-0">Active users</p>
                    </div>
                    <Badge style={{ backgroundColor: '#3498DB', color: 'white' }} className="px-2 py-1">
                      {metrics.users?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Production Orders</h6>
                      <p className="text-muted small mb-0">Active orders</p>
                    </div>
                    <Badge style={{ backgroundColor: '#95A5A6', color: 'white' }} className="px-2 py-1">
                      {metrics.productionOrders?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">Financial Health</h6>
                      <p className="text-muted small mb-0">Total invoices</p>
                    </div>
                    <Badge style={{ backgroundColor: '#1E4E5B', color: 'white' }} className="px-2 py-1">
                      {metrics.invoices?.count || 0}
                    </Badge>
                  </div>
                </div>
              )}

              {role === "accountant" && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Pending Payments</h6>
                      <p className="text-muted small mb-0">Requires attention</p>
                    </div>
                    <Badge style={{ backgroundColor: '#F7931E', color: 'white' }} className="px-2 py-1">
                      ₹{metrics.pendingPayments?.count?.toLocaleString() || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Overdue Invoices</h6>
                      <p className="text-muted small mb-0">Past due</p>
                    </div>
                    <Badge style={{ backgroundColor: '#E74C3C', color: 'white' }} className="px-2 py-1">
                      {metrics.overdueInvoices?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">Total Bills</h6>
                      <p className="text-muted small mb-0">Processed bills</p>
                    </div>
                    <Badge style={{ backgroundColor: '#3498DB', color: 'white' }} className="px-2 py-1">
                      {metrics.bills?.count || 0}
                    </Badge>
                  </div>
                </div>
              )}

              {role === "employee" && (
                <div className="mb-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Shift Hours</h6>
                      <p className="text-muted small mb-0">Logged this week</p>
                    </div>
                    <Badge style={{ backgroundColor: '#3498DB', color: 'white' }} className="px-2 py-1">
                      {metrics.shiftHours?.count || 0}h
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                      <h6 className="fw-bold mb-1">Low Stock Items</h6>
                      <p className="text-muted small mb-0">Needs restocking</p>
                    </div>
                    <Badge style={{ backgroundColor: '#E74C3C', color: 'white' }} className="px-2 py-1">
                      {metrics.lowStockAlerts?.count || 0}
                    </Badge>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h6 className="fw-bold mb-1">Total Vendors</h6>
                      <p className="text-muted small mb-0">Active suppliers</p>
                    </div>
                    <Badge style={{ backgroundColor: '#95A5A6', color: 'white' }} className="px-2 py-1">
                      {metrics.totalVendors?.count || 0}
                    </Badge>
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <div className="p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                  <h6 className="fw-bold text-dark mb-2">
                    <i className="bx bx-trending-up me-1" style={{ color: '#2ECC71' }}></i>
                    Performance Summary
                  </h6>
                  <p className="text-muted small mb-0">
                    Your business is performing well! Keep monitoring these key metrics for optimal results.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default RoleBasedAnalytics;
