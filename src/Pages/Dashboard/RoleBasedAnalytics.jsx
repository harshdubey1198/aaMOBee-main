import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { clientDashboard, firmUsersDashboard, superAdminDashboard } from "../../apiServices/service";

const RoleBasedAnalytics = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const isSmallDeviceUp = () => window.innerWidth >= 576;
  const mutedSmallTextStyle = isSmallDeviceUp() ? { fontSize: "72%" } : {};
  const userId = authuser?._id;
  // const firmId = authuser?.adminId;
  const superadminId = authuser?._id;
  const role = authuser.role;
  const [dashboardData, setDashboardData] = useState();
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const fetchClientDashboard = async () => {
    try {
      const response = await clientDashboard(userId);
      if (response && response.data) {
        setDashboardData(response.data);
        // console.log("Client Dashboard Data:", response.data);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching client dashboard data:", error);
    }
  };

  const fetchFirmDashboard = async () => {
    try {
      const response = await firmUsersDashboard(userId);
      if (response && response.data) {
        setDashboardData(response.data);
        // console.log("Firm Dashboard Data:", response.data);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching firm dashboard data:", error);
    }
  }
  const fetchSuperAdminDashboard = async () => {
    try {
      const response = await superAdminDashboard(superadminId);
      if (response && response.data) {
        setDashboardData(response.data);
        setMonthlyRevenueData(response.data.MonthlyRevenue);
        // console.log("Super Admin Dashboard Data:", response.data);
      } else {
        console.error("No data found in response");
      }
    } catch (error) {
      console.error("Error fetching firm dashboard data:", error);
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
      totalClients: { label: "Total Clients", count: data?.TotalAdminClient, route: "/clients-management" },
      totalPaymentReveived: { label: "Total Payment Received", count: data?.TotalPaymentReceived, route: "/dashboard" },
      activeClients: { label: "Total Payment Received", count: data?.ActivePlanCount, route: "/dashboard" },
      inactiveClients: { label: "Total Payment Received", count: data?.InactiveClient, route: "/dashboard" },
      dailyRegisteredUsers: { label: "Daily Registered Users", count: data?.DailyRegisteredUsers, route: "/dashboard" },
      monthlyRegisteredUsers: { label: "Monthly Registered Users", count: data?.MontlyRegisteredUsers, route: "/dashboard" },
      activeBlogs: { label: "Active Blogs", count: data?.ActiveBlogs, route: "/all-blogs" },
      yearlyRevenue: { label: "Yearly Revenue", count: data?.YearlyRevenue, route: "/dashboard" },
      firms: { label: "Firms", count: data?.TotalFirm, route: "/my-businesses" },
      users: { label: "Users", count: data?.TotalUsers || data?.TotalFirmUsers, route: "/dashboard" },
      inventory: { label: "Inventory", count: data?.TotalQuantity || data?.TotalInventoryQuantity, route: "/product-list" },
      productionOrders: { label: "Production Orders", count: data?.TotalProductionOrders || data?.ProductionOrderCount, route: "/production/orders" },
      invoices: { label: "Invoices", count: data?.TotalInvoice, route: "/all-invoices" },
      bills: { label: "Bills", count: data?.TotalBills || data?.TotalBillsCount, route: "/retail-bills" },
      crmUsers: { label: "CRM Users", count: data?.TotalCRMUsers, route: "/crm/assigned-teams" },
      crmLeads: { label: "CRM Leads", count: data?.TotalCRMLeads || data?.TotalLeads, route: "/crm/all-leads" },
      lowStockAlerts: { label: "Low Stock", count: data?.LowStockItemsCount || data?.LowStockItemCount, route: "/dashboard" },
      pendingPayments: { label: "Pending Payments", count: data?.TotalOverdueAmount || 0, route: "/dashboard" },
      overdueInvoices: { label: "Overdue Invoices", count: data?.TotalOverDueInvoicesCount || 0, route: "/dashboard" },
      shiftHours: { label: "Shift Hours", count: data?.ShiftHours || data?.TotalShiftHours || 0, route: "/dashboard" },
      totalCustomers: { label: "Total Customers", count: data?.TotalCustomers || 0, route: "/dashboard" },
      totalVendors: { label: "Total Vendors", count: data?.TotalVendors || 0, route: "/suppliers-vendors" },
            manufacturers: { label: "Manufacturers", count: data?.TotalManufacturers || 0, route: "/dashboard" },
      brands: { label: "Brands", count: data?.TotalBrands || 0, route: "/dashboard" },

    };

    const roleSpecificKeys = {
      super_admin: ["totalClients", "totalPaymentReveived", "activeClients", "inactiveClients", "dailyRegisteredUsers", "monthlyRegisteredUsers", "activeBlogs", "yearlyRevenue",],
      client_admin: ["firms", "users", "inventory", "productionOrders", "invoices", "bills", "crmUsers", "crmLeads"],
      firm_admin: ["users", "inventory", "productionOrders", "invoices", "bills", "crmUsers", "crmLeads"],
      accountant: ["invoices", "bills", "crmLeads", "pendingPayments", "overdueInvoices"],
      employee: ["inventory", "productionOrders", "lowStockAlerts", "shiftHours", "assignedTasks", "completedTasks","totalCustomers","totalVendors","manufacturers","brands"],
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
  // if (!dashboardData) return <div>Loading metrics...</div>;
  const getTitle = () => {
    switch (role) {
      case "super_admin": return "Overall";
      case "client_admin": return "Overall Metrics";
      case "firm_admin": return "Performance Metrics";
      case "accountant": return "Finance Overview";
      case "employee": return "Operational Overview";
      default: return "Dashboard";
    }
  };

  const MetricBox = ({ label, sublabel, metric, textClass = "text-primary", border = false }) => {
    if (!metric) return null;
    return (
      <Link to={metric.route} className={`text-decoration-none text-dark flex-fill p-2 ${border ? "border-end" : ""}`}>
        <h4 className={textClass}>
          {typeof metric.count === "number" && label === "Monthly Revenue"
            ? `₹${metric.count.toLocaleString()}`
            : metric.count ?? 0}
        </h4>
        <div className="text-muted small">{label}</div>
        <small className="d-block mt-1">{sublabel}</small>
      </Link>
    );
  };

  return (
    <React.Fragment>
      <Row className="gx-3 mt-1">
        <Col md="8" className="mb-0 d-flex flex-column">
          <Card className="shadow-sm h-100">
            <CardBody>
              <h5 className="fw-bold mb-3">{getTitle()}</h5>
              <div className="d-flex flex-wrap justify-content-between text-center">
                <MetricBox label="Total Payment Received" sublabel="All Time" metric={metrics.totalPaymentReveived} textClass="text-info" border />
                <MetricBox label="Total Clients" sublabel="Across All" metric={metrics.totalClients} textClass="text-success" border />
                <MetricBox label="Active Plans" sublabel="Across All" metric={metrics.activeClients} textClass="text-primary" border />
                <MetricBox label="Inactive Plans" sublabel="Across All" metric={metrics.inactiveClients} textClass="text-danger" border />
                {role === "super_admin" && (
                  <MetricBox
                    label="Year Revenue"
                    sublabel={dashboardData?.YearlyRevenue?.[0]?.year || "Year"}
                    metric={{ count: dashboardData?.YearlyRevenue?.[0]?.totalAmount || 0 }}
                    textClass="text-success"
                    border
                  />
                )}
                <MetricBox label="Monthly Revenue" sublabel="This Month" metric={metrics.monthlyRevenue} textClass="text-success" border />
                <MetricBox label="Expense Reports" sublabel="Filed This Month" metric={metrics.expenseReports} textClass="text-info" />
                <MetricBox label="Late Tasks" sublabel="Completed After Deadline" metric={metrics.lateTasks} textClass="text-danger" border />
                {/* <MetricBox label="Shift Hours" sublabel="Logged This Week" metric={metrics.shiftHours} textClass="text-primary" /> */}
                <MetricBox label="Firms" sublabel="Under Client" metric={metrics.firms} textClass="text-primary" border />
                <MetricBox label="Users" sublabel={role === "client_admin" ? "Across All Firms" : "In Your Firm"} metric={metrics.users} textClass="text-success" border />
                <MetricBox label="CRM Users" sublabel="CRM Access" metric={metrics.crmUsers} textClass="text-warning" border />
                <MetricBox label="CRM Leads" sublabel="Lead Pipeline" metric={metrics.crmLeads} textClass="text-info" />
                <MetricBox label="Pending Payments" sublabel="To Vendors" metric={metrics.pendingPayments} textClass="text-danger" border />
                <MetricBox label="Overdue Invoices" sublabel="Needs Attention" metric={metrics.overdueInvoices} textClass="text-danger" />
                <MetricBox label="Assigned Tasks" sublabel="In Progress" metric={metrics.assignedTasks} textClass="text-primary" border />
                <MetricBox label="Completed Tasks" sublabel="This Week" metric={metrics.completedTasks} textClass="text-success" />
                <MetricBox label="Low Stocks" sublabel="Across Inventory" metric={metrics.lowStockAlerts} textClass="text-danger" />
                <MetricBox label="Total Customers" sublabel="Across Firm" metric={metrics.totalCustomers} textClass="text-primary" border />
                <MetricBox label="Total Vendors" sublabel="Across Firm" metric={metrics.totalVendors} textClass="text-primary" border />
              </div>
            </CardBody>
          </Card>
        </Col>

        <Col md="4" className="mb-0 d-flex flex-column">
          <Card className="shadow-sm h-100">
            <CardBody className="d-flex flex-column justify-content-start">
              <h5 className="fw-bold mb-3">Key Stats</h5>
              <Row className="mb-3">
                {role === "super_admin" && (
                  <>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Today Registered Users</div>
                      <h5 className="mb-0">{metrics.dailyRegisteredUsers.count}</h5>
                    </Col>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Monthly Registered Users</div>
                      <h5 className="mb-0">{metrics.monthlyRegisteredUsers.count}</h5>
                    </Col>
                  </>
                )}
                {role === "client_admin" && (
                  <>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Inventory in Hand</div>
                      <Link to={metrics.inventory.route}><h5 className="mb-0">{metrics.inventory.count}</h5></Link>
                    </Col>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Total Invoices</div>
                      <Link to={metrics.invoices.route}><h5 className="mb-0">{metrics.invoices.count}</h5></Link>
                    </Col>
                  </>
                )}

                {role === "firm_admin" && (
                  <>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Inventory in Hand</div>
                      <Link to={metrics.inventory.route}><h5 className="mb-0">{metrics.inventory.count}</h5></Link>
                    </Col>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Total Invoices</div>
                      <Link to={metrics.invoices.route}><h5 className="mb-0">{metrics.invoices.count}</h5></Link>
                    </Col>
                  </>
                )}

                {role === "accountant" && (
                  <>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Pending Payments</div>
                      <h5 className="mb-0">{metrics.pendingPayments.count}</h5>
                    </Col>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Overdue Invoices</div>
                      <h5 className="mb-0">{metrics.overdueInvoices.count}</h5>
                    </Col>
                  </>
                )}

                {role === "employee" && (
                  <>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Shift Hours</div>
                      <Link to={metrics.shiftHours}><h5 className="mb-0">{metrics.shiftHours.count}</h5></Link>
                    </Col>
                    <Col xs="6">
                      <div className="text-muted small" style={mutedSmallTextStyle}>Manufacturers</div>
                      <Link to={metrics.manufacturers.route}><h5 className="mb-0">{metrics.manufacturers.count}</h5></Link>
                    </Col>
                  </>
                )}
              </Row>

              <Row>
                {["super_admin", "client_admin", "firm_admin", "accountant", "employee"].includes(role) && (
                  <>
                    {metrics.bills && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Total Bills</div>
                        <Link to={metrics.bills.route}><h5 className="mb-0">{metrics.bills.count}</h5></Link>
                      </Col>
                    )}
                    {metrics.productionOrders && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Production Orders</div>
                        <Link to={metrics.productionOrders.route}><h5 className="mb-0">{metrics.productionOrders.count}</h5></Link>
                      </Col>
                    )}
                    {metrics.dailyRegisteredUsers && role === "super_admin" && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Active Blogs</div>
                        <Link to={metrics.activeBlogs.route}><h5 className="mb-0">{metrics.activeBlogs.count}</h5></Link>
                      </Col>
                    )}
                    {role === "super_admin" && (
                      <>
                        <Col xs="6">
                          <div className="text-muted small" style={mutedSmallTextStyle}>Monthly Revenue</div>
                          <h5 className="mb-0">
                            ₹{monthlyRevenueData[currentMonthIndex]?.totalAmount?.toLocaleString() || 0}
                          </h5>
                          <small className="text-muted">{monthlyRevenueData[currentMonthIndex]?.month || ""}</small>
                        </Col>
                      </>
                    )}

                    {metrics.invoices && role === "accountant" && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Total Invoices</div>
                        <Link to={metrics.invoices.route}><h5 className="mb-0">{metrics.invoices.count}</h5></Link>
                      </Col>
                    )}
                    {metrics.assignedTasks && role === "employee" && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Assigned Tasks</div>
                        <Link to={metrics.assignedTasks.route}><h5 className="mb-0">{metrics.assignedTasks.count}</h5></Link>
                      </Col>
                    )}
                    {metrics.completedTasks && role === "employee" && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Completed Tasks</div>
                        <Link to={metrics.completedTasks.route}><h5 className="mb-0">{metrics.completedTasks.count}</h5></Link>
                      </Col>
                    )}
                    {metrics.brands && role === "employee" && (
                      <Col xs="6">
                        <div className="text-muted small" style={mutedSmallTextStyle}>Brands</div>
                        <Link to={metrics.brands.route}><h5 className="mb-0">{metrics.brands.count}</h5></Link>
                      </Col>
                    )}
                  </>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default RoleBasedAnalytics;
