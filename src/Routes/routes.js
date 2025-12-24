import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
import DemoLoginWrapper from "../Pages/AuthenticationPages/DemoLoginWrapper";

/* =========================
   PRIVATE (Authenticated)
   ========================= */
const authProtectedRoutes = [
  // dashboard
  { path: "/dashboard", component: lazy(() => import("../Pages/Dashboard")) },

  { path: "/clients-management", component: lazy(() => import("../Pages/ClientsManagement")) },
  { path: "/clients-payments", component: lazy(() => import("../Pages/ClientsManagement/clientPayments")) },
  { path: "/demo-users", component: lazy(() => import("../Pages/ClientsManagement/DemoUsers")) },
  { path: "/calendar", component: lazy(() => import("../Pages/Calender")) },
  { path: "/payment-settings", component: lazy(() => import("../Pages/Settings/PaymentSettings")) },
  //FAQs
  { path: "/faq-list", component: lazy(() => import("../Pages/FAQs/FaqList")) },
  { path: "/faq-detail/:slug", component: lazy(() => import("../Pages/FAQs/FaqDetail")) },

  // plans
  { path: "/create-plan", component: lazy(() => import("../Pages/Plans/CreatePlan")) },
  { path: "/manage-plan", component: lazy(() => import("../Pages/Plans/ManagePlan")) },

  // blogs
  { path: "/all-blogs", component: lazy(() => import("../Pages/Blogs/AllBlogs")) },
  { path: "/create-blog", component: lazy(() => import("../Pages/Blogs/CreateBlog")) },
  { path: "/manage-categories", component: lazy(() => import("../Pages/Blogs/ManageCategories")) },

  // feedbacks
  { path: "/all-feedbacks", component: lazy(() => import("../Pages/Feedbacks/AllFeedbacks")) },

  // invoicing
  { path: "/create-invoice", component: lazy(() => import("../Pages/Invoicing")) },
  { path: "/edit-invoice/:invoiceId", component: lazy(() => import("../Pages/Invoicing/EditInvoiceTrader")), hidden: true },
  { path: "/all-invoices", component: lazy(() => import("../Pages/Invoicing/view")) },
  { path: "/retail-billing", component: lazy(() => import("../Pages/Invoicing/Billing")) },
  { path: "/retail-bills", component: lazy(() => import("../Pages/Invoicing/Billing/AllBills")) },
  { path: "/payments-invoice", component: lazy(() => import("../Pages/Invoicing/payments")) },
  { path: "/reports-invoice", component: lazy(() => import("../Pages/Invoicing/reports")) },
  { path: "/customers", component: lazy(() => import("../Pages/Invoicing/viewCustomer")) },
  { path: "/simple-template-printer", component: lazy(() => import("../components/InvoicingComponents/SimpleTemplatePrinter")) },

  // Inventory MNG
  { path: "/product-list", component: lazy(() => import("../Pages/Inventory-MNG/InventoryTable")) },
  { path: "/add-new-product", component: lazy(() => import("../Pages/Inventory-MNG/TableForm")) },
  { path: "/tax-settings", component: lazy(() => import("../Pages/Inventory-MNG/TableTaxation")) },
  { path: "/item-configuration", component: lazy(() => import("../Pages/Inventory-MNG/ItemConfiguration")) },
  { path: "/product-categories", component: lazy(() => import("../Pages/Inventory-MNG/categoryManager")) },
  { path: "/suppliers-vendors", component: lazy(() => import("../Pages/Inventory-MNG/Vendor")) },
  { path: "/brands-labels", component: lazy(() => import("../Pages/Inventory-MNG/Brands")) },
  { path: "/manufacturers", component: lazy(() => import("../Pages/Inventory-MNG/Manufacturers")) },

  // production & inventory
  { path: "/production/raw-materials", component: lazy(() => import("../Pages/Production-Inventory/RawMaterialTable")) },
  { path: "/production/finished-goods", component: lazy(() => import("../Pages/Production-Inventory/FinishedGood")) },
  { path: "/production/work-in-progress", component: lazy(() => import("../Pages/Production-Inventory/WorkInProgressTable")) },
  { path: "/production/orders", component: lazy(() => import("../Pages/Production-Inventory/ProductionOrders")) },
  { path: "/production/reports", component: lazy(() => import("../Pages/Production-Inventory/ProductionReports")) },
  { path: "/production/product-recipes", component: lazy(() => import("../Pages/Production-Inventory/BomPage")) },
  { path: "/production/waste-tracking", component: lazy(() => import("../Pages/Production-Inventory/WasteManagement")) },
  { path: "/production/settings", component: lazy(() => import("../Pages/Production-Inventory/ProductionSettings")) },

  // testing
  { path: "/input-suggestions", component: lazy(() => import("../Pages/TestingComponents/InputSuggestions")) },

  // for query pages
  { path: "/all-queries", component: lazy(() => import("../Pages/QueryPages/AllQueries")) },

  // firm
  { path: "/my-businesses", component: lazy(() => import("../Pages/Firms/FirmsTable")) },
  { path: "/team-access", component: lazy(() => import("../Pages/Firms/UserManage")) },
  { path: "/team-access-uc", component: lazy(() => import("../Pages/Utility/ComingSoon-Page")) },
  { path: "/business-brandings", component: lazy(() => import("../Pages/Firms/FirmsSetting")) },
  { path: "/business-branding", component: lazy(() => import("../Pages/Firms/ClientFirmBranding")) },
  { path: "/add-business", component: lazy(() => import("../Pages/Firms/CreateFirm")) },
  { path: "/switch-firm", component: lazy(() => import("../Pages/Firms/SwitchFirm")) },

  // CRM
  { path: "/crm/all-leads", component: lazy(() => import("../Pages/CRM/AllLeads")) },
  { path: "/crm/create-lead", component: lazy(() => import("../Pages/CRM/CreateLead")) },
  { path: "/crm/leads-analytics", component: lazy(() => import("../Pages/CRM/LeadAnalytics")) },
  { path: "/crm/all-tasks", component: lazy(() => import("../Pages/CRM/AllTasks")) },
  { path: "/crm/assigned-teams", component: lazy(() => import("../Pages/CRM/CrmUser")) },
  { path: "/crm/user-roles", component: lazy(() => import("../Pages/CRM/RoleManagement")) },
  { path: "/crm/reassign-tasks", component: lazy(() => import("../Pages/CRM/ReassignTask")) },
  { path: "/crm/task-followups", component: lazy(() => import("../Pages/CRM/TaskManagement")) },

  // profile/settings
  { path: "/userprofile", component: lazy(() => import("../Pages/Settings/ProfileSettings")) },
  { path: "/my-profile", component: lazy(() => import("../Pages/Settings/ProfileSettings")) },
  { path: "/notifications", component: lazy(() => import("../components/notifications/notifications")) },

  // utility
  { path: "/pages-starter", component: lazy(() => import("../Pages/Utility/Starter-Page")) },
  { path: "/pages-faqs", component: lazy(() => import("../Pages/Utility/FAQs-Page")) },
  { path: "/pricing", component: lazy(() => import("../Pages/Plans/Pricing-Page")) },

  // icons
  { path: "/icon-boxicon", component: lazy(() => import("../Pages/Icons/IconBoxicons")) },
  { path: "/icons-materialdesign", component: lazy(() => import("../Pages/Icons/IconMaterialdesign")) },
  { path: "/icons-fontawesome", component: lazy(() => import("../Pages/Icons/IconFontAwesome")) },
  { path: "/icon-dripicons", component: lazy(() => import("../Pages/Icons/IconDrip")) },

  // default redirect when authed
  // { path: "/", element: <Navigate to="/dashboard" /> },
];

/* =========================
   PUBLIC
   ========================= */
const publicRoutes = [
  // Authentication Page
  { path: "/auth", component: lazy(() => import("../Pages/AuthenticationPages/Auth")) },
  { path: "/logout", component: lazy(() => import("../Pages/AuthenticationPages/Logout")) },
  { path: "/login", component: lazy(() => import("../Pages/AuthenticationPages/Login")) },
  { path: "/demo/login", component: DemoLoginWrapper },
  // { path: "/demo/login", component: lazy(() => import("../Pages/AuthenticationPages/Login")) },
  { path: "/crm/login", component: lazy(() => import("../Pages/AuthenticationPages/Login")) },
  { path: "/forgot-password", component: lazy(() => import("../Pages/AuthenticationPages/RecoverPassword")) },
  { path: "/recover-password", component: lazy(() => import("../Pages/AuthenticationPages/RecoverPassword")) },
  { path: "/register", component: lazy(() => import("../Pages/AuthenticationPages/Register")) },
  { path: "/reset-password/:token", component: lazy(() => import("../Pages/AuthenticationPages/ResetPassword")) },
  { path: "/reset-password", element: <Navigate to="/login" /> },
  { path: "/verify-email", component: lazy(() => import("../Pages/AuthenticationPages/VerifyOtp")) },

  // Portfolio / marketing
  { path: "/", component: lazy(() => import("../Pages/Portfolio-aaMOBee")) },
  { path: "/portfolio", component: lazy(() => import("../Pages/Portfolio-aaMOBee")) },
  { path: "/login-forwarding", component: lazy(() => import("../Pages/Portfolio-aaMOBee/components/redirectors")) },
  { path: "/blogs", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/BlogsPage")) },
  { path: "/blogs/:blog_slug", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/BlogDetailPage")) },

  // payments / plan
  { path: "/payment-success", component: lazy(() => import("../Pages/AuthenticationPages/SuccessPayment")) },
  { path: "/payment-failure", component: lazy(() => import("../Pages/AuthenticationPages/FailurePayment")) },
  { path: "/plan-renewal", component: lazy(() => import("../Pages/Portfolio-aaMOBee/Plan-Renewal")) },

  // apps landing pages
  { path: "/inventory-management-software", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/Inventory")) },
  { path: "/apps/invoicing", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/Invoicing")) },
  { path: "/apps/crm-leads", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/CrmLeads")) },
  { path: "/apps/client-management", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/ClientsManagement")) },
  { path: "/apps/retail-billing", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/RetailBilling")) },
  { path: "/apps/product-management", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/ProductManagement")) },
  { path: "/apps/project-management", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/ProjectManagement")) },
  { path: "/apps/hrms", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/Hrms")) },
  { path: "/apps/payroll-management", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/PayrollManagement")) },
  { path: "/apps/leave-management", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/LeaveManagement")) },
  { path: "/apps/business-analytics-tool", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/BusinessAnalayticsTool")) },
  { path: "/apps/bookkeeping", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/BookKeeping")) },
  { path: "/apps/lms", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/LMS")) },
  { path: "/apps/affiliate-business-system", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/AffiliateBusinessSystem")) },
  { path: "/apps/cms", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/ContentMgmt")) },
  { path: "/apps/erp", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/ErpModule")) },
  { path: "/apps/expense-tracker", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/ExpanseTracker")) },
  { path: "/apps/daily-sales-tracker", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/apps/DailySalesTracker")) },

  // support / marketing
  { path: "/support", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/SupportPage")) },
  { path: "/choose-plan/signup", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/PreRegister")) },
  { path: "/contact-us", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/ContactUsPage")) },

  // legal
  { path: "/privacy-policy", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/privacy")) },
  { path: "/refund-policy", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/refund")) },

  // FAQ pages
  { path: "/faq", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/FaqPage")) },
  { path: "/faq/:slug", component: lazy(() => import("../Pages/Portfolio-aaMOBee/pages/FaqDetailPage")) },


  // utility / errors
  { path: "/auth-lock-screen", component: lazy(() => import("../Pages/AuthenticationPages/LockScreen")) },
  { path: "/pages-404", component: lazy(() => import("../Pages/Utility/Error404-Page")) },
  { path: "/pages-500", component: lazy(() => import("../Pages/Utility/Error500-Page")) },
  { path: "/maintenance", component: lazy(() => import("../Pages/Utility/Maintenance-Page")) },
  { path: "/pages-comingsoon", component: lazy(() => import("../Pages/Utility/ComingSoon-Page")) },

  // catch-all
  { path: "/*", component: lazy(() => import("../Pages/Utility/Error404-Page")) },
];

export { authProtectedRoutes, publicRoutes };
