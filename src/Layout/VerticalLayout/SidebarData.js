export const masterAdminSidebarData = () => [
  {
    label: "Dashboard",
    icon: "mdi mdi-home-variant-outline",
    url: "/dashboard",
  },

  {
    label: "Clients",
    icon: "mdi mdi-account-multiple-outline",
    subItem: [
      { sublabel: "Manage Clients", link: "/clients-management" },
      { sublabel: "Client Portal", link: "/clients-portal" },
      { sublabel: "Demo Users", link:"/demo-users"},
      { sublabel: "Track Payments", link: "/clients-payments" },
      { sublabel: "Client Invoices", link: "/clients/invoices" },
      { sublabel: "Client Statements", link: "/clients/statements" },
    ],
  },
  {
    label:"Pricing & Plans",
    icon:"mdi mdi-cash-multiple",
    subItem:[
      {sublabel:"Create New Plan",link:"/create-plan"},
      {sublabel:"Manage Plans",link:"/manage-plan"},
      { sublabel:"Pricing", link:"/pricing"},    
    ]
  },
  {
    label: "Firms",
    icon: "mdi mdi-domain",
    subItem: [
      // { sublabel: "Create New Firm", link: "/add-business" },
      // { sublabel: "Manage Firms", link: "/my-businesses" },
      // { sublabel: "Team Access", link: "/team-access-uc" },
      // { sublabel: "Firm Branding", link: "/firm-branding-uc" },
        { sublabel: "Add New Business", link: "/add-business" },
        { sublabel: "Business Branding", link: "/business-branding" },
        { sublabel: "Team Access", link: "/team-access" },
        { sublabel: "All My Businesses", link: "/my-businesses" }
    ],
  },
  {
    label: "Products & Inventory",
    icon: "mdi mdi-archive-outline",
    subItem: [
      { sublabel: "Product List", link: "/product-list" },
      { sublabel: "Tax Settings", link: "/tax-settings" },
    ],
  },
  {
    label: "Invoices",
    icon: "mdi mdi-file-document-outline",
    subItem: [
      { sublabel: "All Invoices", link: "/all-invoices" },
      { sublabel: "Recurring Invoices", link: "/invoices/recurring" },
      { sublabel: "Payment Tracking", link: "/invoices/payment-tracking" },
      { sublabel: "Bulk Invoice Generation", link: "/invoices/bulk-generation" },
      { sublabel: "Invoice Templates", link: "/invoices/templates" },
      { sublabel: "Create Quote/Proforma", link: "/quotes/create" },
      { sublabel: "Manage Quotes/Proformas", link: "/quotes/manage" },
      { sublabel: "Convert to Invoice", link: "/quotes/convert" },
    ],
  },
  {
    label : "Blogs",
    icon : "mdi mdi-newspaper-variant-outline",
    subItem : [
      {sublabel:"All Blogs",link:"/all-blogs"},
      {sublabel:"Create Blog",link:"/create-blog"},
      {sublabel:"Manage Categories",link:"/manage-categories"},
    ]
  },
  {
    label: "Feedbacks",
    icon: "mdi mdi-comment-account-outline",
    subItem: [
      { sublabel: "View Feedbacks", link: "/all-feedbacks" },
      { sublabel: "Feedback Analytics", link: "/feedbacks/analytics" },
    ],
  },
  {
    label: "FAQs",
    icon: "mdi mdi-comment-account-outline",
    subItem: [
      { sublabel: "FAQ List", link: "/faq-list" },
      { sublabel: "Feedback Analytics", link: "/faq-detail/:slug",hidden:true },
    ],
  },
  {
    label : "Queries",
    icon : "mdi mdi-comment-question-outline",
    subItem : [
      {sublabel:"All Queries",link:"/all-queries"},
      // {sublabel:"Create Query",link:"/create-query"},
      // {sublabel:"Query Analytics",link:"/query-analytics"},
    ]
  },
  {
    label: "Vendors",
    icon: "mdi mdi-truck-delivery-outline",
    subItem: [
      // { sublabel: "Manage Vendors", link: "/suppliers-vendors" },
      { sublabel: "Track Payments", link: "/vendors/payments" },
      { sublabel: "Vendor Invoices", link: "/vendors/invoices" },
      { sublabel: "Supplier Information", link: "/vendors/info" },
      { sublabel: "Supplier Statements", link: "/vendors/statements" },
    ],
  },

  {
    label: "Delivery Challans",
    icon: "mdi mdi-truck-outline",
    subItem: [
      { sublabel: "Create Delivery Challan", link: "/delivery-challans/create" },
      { sublabel: "Manage Delivery Challans", link: "/delivery-challans/manage" },
      { sublabel: "Track Deliveries", link: "/delivery-challans/track" },
    ],
  },
  {
    label: "Credit/Debit Notes",
    icon: "mdi mdi-note-plus-outline",
    subItem: [
      { sublabel: "Create Credit Note", link: "/credit-notes/create" },
      { sublabel: "Manage Credit Notes", link: "/credit-notes/manage" },
      { sublabel: "Apply to Invoices", link: "/credit-notes/apply" },
      { sublabel: "Create Debit Note", link: "/debit-notes/create" },
      { sublabel: "Manage Debit Notes", link: "/debit-notes/manage" },
      { sublabel: "Apply to Purchase Bills", link: "/debit-notes/apply" },
    ],
  },
  {
    label: "Purchase Section",
    icon: "mdi mdi-file-document-edit-outline",
    subItem: [
      { sublabel: "Create Purchase Order", link: "/purchase-orders/create" },
      { sublabel: "Manage Purchase Orders", link: "/purchase-orders/manage" },
      { sublabel: "Record Purchase Bill", link: "/purchase-bills/record" },
      { sublabel: "Manage Purchase Bills", link: "/purchase-bills/manage" },
      { sublabel: "Track Payments", link: "/purchase-bills/payments" },
      { sublabel: "Link to Purchase Orders", link: "/purchase-bills/link-orders" },
    ],
  },
  {
    label: "Settings",
    icon: "mdi mdi-cog-outline",
    subItem: [
      { sublabel: "General Settings", link: "/preferences/general" },
      { sublabel: "Payment Settings", link: "/payment-settings" },
      { sublabel: "Security Settings", link: "/preferences/security" },
      { sublabel: "Role Management" , link:"/crm/user-roles"},
      // { sublabel: "Notification Settings", link: "/preferences/notifications" },
      { sublabel: "Integration Settings", link: "/preferences/integrations" },
      { sublabel: "Tax Settings", link: "/preferences/tax" },
      { sublabel: "Country-Specific Laws & Tax Settings", link: "/preferences/country-laws" },
    ],
  },
  {
    label: "Support",
    icon: "mdi mdi-help-circle-outline",
    subItem: [
      { sublabel: "Help Desk", link: "/support/help-desk" },
      { sublabel: "Knowledge Base", link: "/support/knowledge-base" },
      { sublabel: "Live Chat", link: "/support/live-chat" },
      { sublabel: "Submit a Ticket", link: "/support/submit-ticket" },
    ],
  },
  {
    label: "Profile",
    icon: "mdi mdi-account-circle-outline",
    subItem: [
      { sublabel: "User Profile", link: "/my-profile" },
      // { sublabel: "Account Settings", link: "/profile/account-settings" },
      { sublabel: "Logout", link: "/logout" },
    ],
  },
];

  export const clientAdminSidebarData = () => [
   
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },

    {
      label:"Business Setup",
      icon:"mdi mdi-domain",
      subItem: [
        { sublabel: "Add New Business", link: "/add-business" },
        { sublabel: "Business Branding", link: "/business-branding" },
        { sublabel: "Team Access", link: "/team-access" },
        { sublabel: "All My Businesses", link: "/my-businesses" }
      ],
    },
    {
      label:"Pricing",
      icon:"mdi mdi-cash-multiple",
      url:"/pricing",
    },
    {
      label: "Products & Inventory",
      icon: "mdi mdi-archive-outline",
      subItem: [
        { sublabel: "Product List", link: "/product-list" },
        // { sublabel: "Add New Product", link: "/add-new-product" },       
        {sublabel : "Add New Product", link: "/add-new-product" },
        {sublabel : "Product Categories" ,link :"/product-categories"},
        { sublabel: "Tax Settings", link: "/tax-settings" },
        {sublabel : "Suppliers & Vendors", link: "/suppliers-vendors" },
        {sublabel : "Brands & Labels" ,link :"/brands-labels"},
        {sublabel : "Manufacturers" ,link :"/manufacturers"},
        // { sublabel: "Item Config", link: "/item-configuration" },
      ],
    },
    {
      label:"Production/Manufacturing",
      icon:"mdi mdi-archive-outline",
      subItem:[
          // {sublabel: "Raw Material", link:"/production/raw-materials"},
          {sublabel: "Product Recipes", link:"/production/product-recipes"},
          {sublabel: "Production Orders", link:"/production/orders"},
          {sublabel: "Work In Progress", link:"/production/work-in-progress"},
          // {sublabel: "Finished Goods", link:"/production/finished-goods"},
          {sublabel: "Production Reports", link:"/production/reports"},
          {sublabel: "Waste Tracking", link:"/production/waste-tracking"},
          // {sublabel: "Production Settings", link:"/production/settings"},
      ],
    },
    {
      label: "Invoicing",
      icon: "mdi mdi-file-document-outline",
      subItem: [
        { sublabel: "Create Invoice", link: "/create-invoice" },
        { sublabel: "Edit Invoice", link: "/edit-invoice/:invoiceId", hidden:true },
        { sublabel: "All Invoices", link: "/all-invoices" },
        { sublabel: "Retail Billing", link: "/retail-billing" },
        { sublabel: "Retail Bills", link: "/retail-bills" },
        { sublabel: "Customers", link: "/customers" },
        // { sublabel: "Expenses", link: "/expenses" },
        // { sublabel: "Reports", link: "/reports" },
      ],
    },
    // {
    //   label:"Input Suggestions",
    //   icon:"mdi mdi-comment-account-outline",
    //   url:"/input-suggestions",
    // },
    // {
      {
        label:"Leads & CRM",
        icon:"mdi mdi-account-multiple-outline",
        subItem: [
          { sublabel: "All Leads", link: "/crm/all-leads" },
          { sublabel: "Add New Lead", link: "/crm/create-lead" },
          { sublabel: "Lead Analytics", link: "/crm/leads-analytics" },
          { sublabel: "Assigned Team" , link:"/crm/assigned-teams"},
          // { sublabel: "Role Management" , link:"/crm/user-roles"},
          { sublabel: "Tasks & Follow-ups" , link:"/crm/task-followups"},
        ]
      },
    
    
      
      
      // {
        //   label: "Authentication",
    //   icon: "mdi mdi-account-circle-outline",
    //   subItem: [
      //     { sublabel: "Login", link: "/auth-login" },
    //     { sublabel: "Register", link: "/auth-register" },
    //     { sublabel: "Recover Password", link: "/recover-password" },
    //     { sublabel: "Lock Screen", link: "/auth-lock-screen" },
    //   ],
    // },
    {
      label: "Settings",
        icon: "mdi mdi-cog-outline",
        subItem: [
          { sublabel: "My Profile", link: "/my-profile" },
          // { sublabel: "Accounts Settings", link: "/accounts-setting" },
          // { sublabel: "Recover Password", link: "/recover-password" },
          // { sublabel: "Lock Screen", link: "/auth-lock-screen" },
        ],
      }
      
      // {
        //   label: "Extra Pages",
        //   icon: "mdi mdi-file-document-outline",
        //   subItem: [
          
        //     { sublabel: "Ui Cards", link: "/ui-cards" },
        //     { sublabel: "Ui Buttons", link: "/ui-buttons" },
        //     { sublabel: "Ui Modals", link: "/ui-modals" },
        //     { sublabel: "Boxicons", link: "/icon-boxicon" },
        //     { sublabel: "MDI", link: "/icons-materialdesign" },
        //     { sublabel: "FA-Icons", link: "/icons-fontawesome" },
        //     { sublabel: "Drip-Icons", link: "/icon-dripicons" },
        //   ],
        
        // }
      ];

  export const firmAdminSidebarData =()=>[
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    
    // {
      //   label: "google maps",
      //   icon: "mdi mdi-home-variant-outline",
      //   url: "/maps-google",
      // },
    {
      label:"Company",
      icon:"mdi mdi-domain",
      subItem: [
        { sublabel: "Business Branding", link: "/business-brandings" },
        { sublabel: "Team Access", link: "/team-access" }
      ],
    },
    {
      label:"Pricing",
      icon:"mdi mdi-cash-multiple",
      url:"/pricing",
    },
    {
      label: "Products & Inventory",
      icon: "mdi mdi-archive-outline",
      subItem: [
        {sublabel : "Product List", link: "/product-list" },
        {sublabel : "Add New Product", link: "/add-new-product" },
        {sublabel : "Product Categories" ,link :"/product-categories"},
        {sublabel : "Tax Settings", link: "/tax-settings" },
        {sublabel : "Suppliers & Vendors", link: "/suppliers-vendors" },
        {sublabel : "Brands & Labels" ,link :"/brands-labels"},
        {sublabel : "Manufacturers" ,link :"/manufacturers"},
        
      ],
    },
    
    {
      label:"Production/Manufacturing",
      icon:"mdi mdi-archive-outline",
      subItem:[
        // {sublabel: "Raw Material", link:"/production/raw-materials"},
        {sublabel: "Product Recipes", link:"/production/product-recipes"},
        {sublabel: "Production Orders", link:"/production/orders"},
        {sublabel: "Work In Progress", link:"/production/work-in-progress"},
        // {sublabel: "Finished Goods", link:"/production/finished-goods"},
        {sublabel: "Production Reports", link:"/production/reports"},
        {sublabel: "Waste Tracking", link:"/production/waste-tracking"},
        // {sublabel: "Production Settings", link:"/production/settings"},
      ],
    },
    // {
      //   label:"Input Suggestions",
      //   icon:"mdi mdi-comment-account-outline",
      //   url:"/input-suggestions",
      // },
      {
      label: "Invoicing",
      icon: "mdi mdi-file-document-outline",
      subItem: [
        { sublabel: "Create Invoice", link: "/create-invoice" },
        { sublabel: "Edit Invoice", link: "/edit-invoice/:invoiceId", hidden:true },
        { sublabel: "All Invoices", link: "/all-invoices" },
        { sublabel: "Retail Billing", link: "/retail-billing" },
        { sublabel: "Retail Bills", link: "/retail-bills" },
        { sublabel: "Customers", link: "/customers" },
        // { sublabel: "Print Template", link: "/simple-template-printer" },
    
      ],
    },
    {
      label:"Leads & CRM",
      icon:"mdi mdi-account-multiple-outline",
      subItem: [
        { sublabel: "All Leads", link: "/crm/all-leads" },
        { sublabel: "Add New Lead", link: "/crm/create-lead" },
        { sublabel: "Lead Analytics", link: "/crm/leads-analytics" },
        { sublabel: "Assigned Team" , link:"/crm/assigned-teams"},
        // { sublabel: "Role Management" , link:"/crm/user-roles"},
        { sublabel: "Tasks & Follow-ups" , link:"/crm/task-followups"},
        // { sublabel: "Reassign Tasks" , link:"/crm/reassign-tasks"},
        
        // { sublabel: "Lead Status", link: "/crm/lead-status" },
      ]
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      subItem: [
        { sublabel: "My Profile", link: "/my-profile" },
        ],
      } 
      
  ]
  
  export const accountantSidebarData = () => [
    
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    
    {
      label: "Products & Inventory",
      icon: "mdi mdi-archive-outline",
      subItem: [
        { sublabel: "Product List", link: "/product-list" },
        {sublabel : "Product Categories" ,link :"/product-categories"},
        { sublabel: "Tax Settings", link: "/tax-settings" },
      ],
    },
    {
      label: "Invoicing",
      icon: "mdi mdi-file-document-outline",
      subItem: [
        { sublabel: "Create Invoice", link: "/create-invoice" },
        { sublabel: "Edit Invoice", link: "/edit-invoice/:invoiceId", hidden:true },
        { sublabel: "All Invoices", link: "/all-invoices" },
        { sublabel: "Retail Billing", link: "/retail-billing" },
        { sublabel: "Retail Bills", link: "/retail-bills" },
        { sublabel: "Customers", link: "/customers" },
      ],
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/my-profile",
    },
  ];
  
  export const generalEmployeeSidebarData = () => [
  
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },

    {
      label: "Products & Inventory",
      icon: "mdi mdi-archive-outline",
      subItem: [
        { sublabel: "Inventory Management", link: "/product-list" },
        { sublabel: "Add New Product", link: "/add-new-product" },
        {sublabel : "Product Categories" ,link :"/product-categories"},
        { sublabel: "Tax Settings", link: "/tax-settings" },
        { sublabel: "Suppliers & Vendors", link: "/suppliers-vendors" },
      ],
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/my-profile",
    }
  ];
  
  export const asmSidebarData = () => [
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    {
      label : "Leads & CRM",
      icon : "mdi mdi-account-multiple-outline",
      subItem : [
        // {sublabel:"Daily Tasks",link:"/crm/all-tasks"},
        {sublabel:"All Leads",link:"/crm/all-leads"},
        {sublabel:"Add New Lead",link:"/crm/create-lead"},
        {sublabel:"Lead Analytics",link:"/crm/leads-analytics"},
        { sublabel: "Tasks & Follow-ups" , link:"/crm/task-followups"},
        // { sublabel: "Assigned Team" , link:"/crm/assigned-teams"},
        // {sublabel:"Reassign Tasks",link:"/crm/reassign-tasks"},
      ]
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/my-profile",
    }
  ];

  export const salesManagerSidebarData = () => [
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    {
      label : "Leads & CRM",
      icon : "mdi mdi-account-multiple-outline",
      subItem : [
        {sublabel:"Daily Tasks",link:"/crm/all-tasks"},
        {sublabel:"All Leads",link:"/crm/all-leads"},
        // {sublabel:"Add New Lead",link:"/crm/create-lead"},
        { sublabel: "Tasks & Follow-ups" , link:"/crm/task-followups"},

        {sublabel:"Lead Analytics",link:"/crm/leads-analytics"},
        // {sublabel:"Reassign Tasks",link:"/crm/reassign-tasks"},

      ]
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/my-profile",
    }
  ];

  export const telecallerSidebarData =() =>[

    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    {
      label:"Leads & CRM",
      icon:"mdi mdi-account-multiple-outline",
      subItem: [
        {sublabel:"Daily Tasks",link:"/crm/all-tasks"},
        // { sublabel: "All Leads", link: "/crm/all-leads" },
        // { sublabel: "Add New Lead", link: "/crm/create-lead" },
        // { sublabel: "Lead Analytics", link: "/crm/leads-analytics" },
        // { sublabel: "Lead Status", link: "/crm/lead-status" },
      ]
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/my-profile",
    }
   
    
    ];
  
  export const viewerSidebarData = () => [
  
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
  
  ];
  
  export const readOnlySidebarData = () => [
   
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
  ];
  
  export const defaultSidebarData = () => [
    {
      label: "Menu",
    },
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/settings",
    }
  ];

  export const blogAdminSidebarData = () => [
    {
      label: "Dashboard",
      icon: "mdi mdi-home-variant-outline",
      url: "/dashboard",
    },
    {
      label: "Blogs",
      icon: "mdi mdi-newspaper-variant-outline",
      subItem: [
        { sublabel: "All Blogs", link: "/all-blogs" },
        { sublabel: "Create Blog", link: "/create-blog" },
        { sublabel: "Manage Categories", link: "/manage-categories" },
      ],
    },
    {
      label: "Settings",
      icon: "mdi mdi-cog-outline",
      url: "/my-profile",
    },
    
  ];
  
  export const userRolesSidebarData = (role) => {
    switch (role) {
      case 'super_admin':
        return masterAdminSidebarData();
      case 'client_admin':
        return clientAdminSidebarData();
      case 'firm_admin':
        return firmAdminSidebarData();
      case 'accountant':
          return accountantSidebarData();
      case 'readOnly':
        return readOnlySidebarData();
      case 'employee':
        return generalEmployeeSidebarData();
      case 'ASM':
        return asmSidebarData();
      case 'SM':
        return salesManagerSidebarData();
      case 'Telecaller':
        return telecallerSidebarData();
      case 'blog_admin':
        return blogAdminSidebarData();
      case 'Viewer':
        return viewerSidebarData();
      default:
        return defaultSidebarData();
    }
  };