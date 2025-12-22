import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import Chart from "react-apexcharts";
import { clientDashboard, firmUsersDashboard,superAdminDashboard } from "../../apiServices/service";
import { Link } from "react-router-dom";

const RoleBasedAnalytics2 = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"))?.response;
  const isSmallDeviceUp = () => window.innerWidth >= 576;
  const mutedSmallTextStyle = isSmallDeviceUp() ? { fontSize: "72%" } : {};
  // const firmId = authuser?.adminId;
  const role = authuser?.role;
  const userId = authuser?._id;
  const [dashboardData, setDashboardData] = useState(null);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Responsive device tracking
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

const chartSize = isDesktop ? 150 : isTablet ? 120 : 100;

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
          console.log("Firm Dashboard Data:", response.data);
        } else {
          console.error("No data found in response");
        }
      } catch (error) {
        console.error("Error fetching firm dashboard data:", error);
      }
    }

    const fetchSuperAdminDashboard = async () => {
        try {
          const response = await superAdminDashboard(userId);
          if (response && response.data) {
            setDashboardData(response.data);
            // console.log("Super Admin Dashboard Data:", response.data);
          } else {
            console.error("No data found in response");
          }
        } catch (error) {
          console.error("Error fetching firm dashboard data:", error);
        }
      }
  
    useEffect(() => {
      if(role === "super_admin"){
       fetchSuperAdminDashboard();
      }
      else if(role === "client_admin") {
        fetchClientDashboard();
      }else {
        fetchFirmDashboard();
      }
    }, []);
    

  const buildMetricsByRole = (role, data) => {
    const allMetrics = {
      totalClients: { label: "Total Clients", count: data?.TotalAdminClient, route: "/clients-management" },
      activeClients: { label: "Active Clients", count: data?.ActivePlanCount },
      inactiveClients: { label: "Inactive Clients", count: data?.InactiveClient },
      activeBlogs: { label: "Active Blogs", count: data?.ActiveBlogs, route: "/all-blogs" },
      activeBlogAdmin: { label: "Active Blog Admin", count: data?. BlogAdminCount},
      firms: { label: "Firms", count: data?.TotalFirm, route: "/my-businesses" },
      users: { label: "Users", count: data?.TotalUsers || data?.TotalFirmUsers, route: "/firm-users" },
      inventoryQuantity: { label: "Total Inventory Quantity", count: data?.TotalQuantity || data?.TotalInventoryQuantity, route: "/product-list" },
      productionOrders: { label: "Production Orders", count: data?.TotalProductionOrders || data?.ProductionOrderCount, route: "/production/orders" },
      invoices: { label: "Invoices", count: data?.TotalInvoice, route: "/all-invoices" },
      bills: { label: "Bills", count: data?.TotalBills || data?.TotalBillsCount, route: "/retail-bills" },
      crmUsers: { label: "CRM Users", count: data?.TotalCRMUsers, route: "/crm/assigned-teams" },
      crmLeads: { label: "CRM Leads", count: data?.TotalCRMLeads || data?.TotalLeads, route: "/crm/all-leads" },
      lowStockAlerts: { label: "Low Stock", count: data?.LowStockItemsCount || data?.LowStockItemCount, route: "/dashboard" },
      totalCustomers: { label: "Total Customers", count:  data?.totalCustomers || 0, route: "/customers" },
      totalVendors: { label: "Total Vendors", count: data?.TotalVendors || 0, route: "/suppliers-vendors" },
            totalInventory: { label: "Inventory Items", count: data?.Totalinventory || 0, route: "/product-list" },
    };

    const roleSpecificKeys = {
      super_admin: ["totalClients", "totalPaymentReveived", "activeClients", "inactiveClients","dailyRegisteredUsers","monthlyRegisteredUsers","activeBlogs","activeBlogAdmin"],
      client_admin: ["firms","invoices", "crmLeads", "lowStockAlerts"],
      firm_admin: ["users", "inventoryQuantity", "productionOrders", "invoices", "bills", "crmLeads", "lowStockAlerts"],
      accountant: ["invoices", "bills", "crmLeads","inventoryQuantity","totalCustomers"],
      employee: ["inventoryQuantity", "productionOrders", "lowStockAlerts","totalVendors","totalInventory"],
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

  // if (!authuser || !dashboardData) return <div>Loading metrics...</div>;

  const metrics = buildMetricsByRole(role, dashboardData);
  if (!metrics) return null;

const roleBasedDonutKeys = {
  super_admin: ["totalClients", "totalPaymentReveived", "activeClients", "inactiveClients","dailyRegisteredUsers","monthlyRegisteredUsers","activeBlogs","activeBlogAdmin"],
  client_admin: ["firms", "invoices", "crmLeads", "lowStockAlerts"],
  firm_admin: ["users", "inventoryQuantity", "productionOrders", "invoices", "bills", "crmLeads", "lowStockAlerts"],
  accountant: ["invoices", "bills", "crmLeads","inventoryQuantity","totalCustomers"],
  employee: ["inventoryQuantity", "lowStockAlerts","totalVendors","totalInventory"],
};

const selectedKeys = roleBasedDonutKeys[role] || [];

const donutSeries = [];
const donutLabels = [];
const donutColors = ["#2cc79f", "#ffa500", "#007bff", "#dc3545", "#6610f2", "#20c997"];

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
        size: "70%",
        labels: {
          show: true, 
          name: {
            show: true, 
          },
          value: {
            show: true,
          },
          total: {
            show: true, 
            label: "Total",
            fontSize: "13px",
            fontWeight: 600,
            color: "#111",
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
  },
};


  const getTitle = () => {
    switch (role) {
      case "super_admin": return "Overall";
      case "firm_admin": return "Performance Metrics";
      case "accountant": return "Finance Overview";
      case "employee": return "Operational Overview";
      default: return "Dashboard";
    }
  };

  return (
    <Card className="flex-grow-1 h-100 d-flex flex-column"  >
      <CardBody className="d-flex flex-column justify-content-start">
        <h5 className="fw-bold mb-3">Details</h5>
        <Row className="align-items-start">
          <Col md="6">
            {Object.entries(metrics).map(([key, metric]) => (
              <div key={key} className="mb-2 d-flex justify-content-between">
                <span className={key === "lowStockAlerts" ? "text-danger" : "text-muted"}>
                  {metric.label}
                </span>
                <Link to={metric.route} className="fw-bold text-decoration-none">{metric.count}</Link>
              </div>
            ))}
          </Col>
 
          {(role === "super_admin"||role === "client_admin"||role === "firm_admin" || role === "accountant"|| role === "employee") && (
            <>
            {/* Divider for larger screens */}
              <div
                className="vr d-none d-md-block"
                style={{ height: isTablet ? "60px" : "80px", minWidth: "1px", backgroundColor: "white", margin: "0 1px" }}
              ></div>

              {/* Divider for mobile */}
              <hr className="d-block d-md-none my-3" />

              <Col md="5" className="text-center d-flex flex-column align-items-center">
            <div className="text-muted mb-2">Active Items</div>
            <Chart
              options={chartOptions}
              series={donutSeries}
              type="donut"
              height={chartSize}
              width={chartSize}
            />
          </Col>
            </>
          )}
        </Row>
      </CardBody>
    </Card>
  );
};

export default RoleBasedAnalytics2;
