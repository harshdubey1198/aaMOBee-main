const tutorialSteps = [

  {
    routes: ["/add-business"],
    steps: [
    //   { icon: "mdi mdi-file-document-outline", title: "Register Yourself", step: 1, color: "#fff", bgColor: "#4B49AC" },
      { icon: "mdi mdi-office-building-outline", title: "Firm Creation", step: 1 ,color: "#fff", bgColor: "#FFB600" },
      { icon: "mdi mdi-tag-outline", title: "Firm Branding", step: 2, color: "#fff", bgColor: "#28A745" }

    ]
  },
  {
    routes: ["/firm-branding", "/business-branding", "/branding"],
    steps: [
    //   { icon: "mdi mdi-file-document-outline", title: "Register Yourself", step: 1, color: "#fff", bgColor: "#4B49AC" },
    //   { icon: "mdi mdi-office-building-outline", title: "Firm Creation", step: 2, color: "#fff", bgColor: "#FFB600" },
      { icon: "mdi mdi-tag-outline", title: "Firm Branding", step: 3, color: "#fff", bgColor: "#28A745" },
      { icon: "mdi mdi-pencil-box-outline", title: "Branding Updation", step: 4, color: "#fff", bgColor: "#00ACC1" }

    ]
  },
  {
    routes: ["/team-access", "/create-user"],
    steps: [
      { icon: "mdi mdi-file-document-outline", title: "Register Yourself", step: 1, color: "#fff", bgColor: "#4B49AC" },
      { icon: "mdi mdi-office-building-outline", title: "Firm Creation", step: 2, color: "#fff", bgColor: "#FFB600" },
      { icon: "mdi mdi-tag-outline", title: "Firm Branding", step: 3, color: "#fff", bgColor: "#28A745" },
      { icon: "mdi mdi-account-plus-outline", title: "User Creation", step: 4, color: "#fff", bgColor: "#00ACC1" }
    ]
  },
  {
    routes: ["/firm-processes"],
    steps: [
      { icon: "mdi mdi-file-document-outline", title: "Register Yourself", step: 1, color: "#fff", bgColor: "#4B49AC" },
      { icon: "mdi mdi-office-building-outline", title: "Firm Creation", step: 2, color: "#fff", bgColor: "#FFB600" },
      { icon: "mdi mdi-tag-outline", title: "Firm Branding", step: 3, color: "#fff", bgColor: "#28A745" },
      { icon: "mdi mdi-account-plus-outline", title: "User Creation", step: 4, color: "#fff", bgColor: "#00ACC1" },
      { icon: "mdi mdi-cash-multiple", title: "Further Firm Processes", step: 5, color: "#fff", bgColor: "#E91E63" }
    ]
  },
  {
    routes: ["/add-new-product"],
    steps: [
      { icon: "mdi mdi-view-list-outline", title: "Select Category", step: 1, color: "#fff", bgColor: "#6C63FF" },
      { icon: "mdi mdi-tag-outline", title: "Item Details", step: 2, color: "#fff", bgColor: "#00BFA5" }, 
      { icon: "mdi mdi-factory", title: "Brand & Manufacturer", step: 3, color: "#fff", bgColor: "#FF7043" }, 
      { icon: "mdi mdi-account-tie", title: "Vendor & Type", step: 4, color: "#fff", bgColor: "#5C6BC0" }, 
      { icon: "mdi mdi-currency-inr", title: "Pricing & Quantity", step: 5, color: "#fff", bgColor: "#009688" }, 
      { icon: "mdi mdi-percent-outline", title: "Tax & HSN", step: 6, color: "#fff", bgColor: "#F06292" }, 
      { icon: "mdi mdi-shape-plus", title: "Add Variants", step: 7, color: "#fff", bgColor: "#FFA000" }
    ]
  },
  {
    routes: ["/tax-settings"],
    steps: [
      { icon: "mdi mdi-file-document-edit-outline", title: "Tax Name", step: 1, color: "#fff", bgColor: "#6C63FF", }, 
      { icon: "mdi mdi-percent", title: "Add Tax Rate", step: 2, color: "#fff", bgColor: "#00BFA5", }, 
      { icon: "mdi mdi-plus-box-outline", title: "Multiple Rates", step: 3, color: "#fff", bgColor: "#FF7043", }, 
      { icon: "mdi mdi-content-save-outline", title: "Save Tax", step: 4, color: "#fff", bgColor: "#5C6BC0", }, 
      { icon: "mdi mdi-database-refresh", title: "Manage Records", step: 5, color: "#fff", bgColor: "#009688", }
    ]
  },
  {
    routes: ["/suppliers-vendors"],
    steps: [ 
      { icon: "mdi mdi-account-box-outline", title: "Vendor Info", step: 1, color: "#fff", bgColor: "#6C63FF",  }, 
      { icon: "mdi mdi-account-tie-outline", title: "Contact Person", step: 2, color: "#fff", bgColor: "#00BFA5",  }, 
      { icon: "mdi mdi-phone-outline", title: "Contact Details", step: 3, color: "#fff", bgColor: "#FF7043",  } ,
      { icon: "mdi mdi-map-marker-outline", title: "Address", step: 4, color: "#fff", bgColor: "#5C6BC0",  }, 
      { icon: "mdi mdi-content-save-outline", title: "Save Vendor", step: 5, color: "#fff", bgColor: "#009688",  }, 
      { icon: "mdi mdi-database-search", title: "Manage Vendors", step: 6, color: "#fff", bgColor: "#F06292",  }
    ]
  },
  {
  routes: ["/brands-labels"],
  steps: [ 
    {   icon: "mdi mdi-shape-outline",   title: "Brand Name",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-earth",   title: "Country of Origin",   step: 2,   color: "#fff",   bgColor: "#00BFA5", }, 
    {   icon: "mdi mdi-text-box-outline",   title: "Description",   step: 3,   color: "#fff",   bgColor: "#FF7043", }, 
    {   icon: "mdi mdi-web",   title: "Website (Optional)",   step: 4,   color: "#fff",   bgColor: "#5C6BC0", }, 
    {   icon: "mdi mdi-content-save-outline",   title: "Save Brand",   step: 5,   color: "#fff",   bgColor: "#009688",  }, 
    {   icon: "mdi mdi-format-list-bulleted-square",   title: "Manage Brands",   step: 6,   color: "#fff",   bgColor: "#F06292", }
  ]
},
{
  routes: ["/production/product-recipes"],
  steps: [ 
    {   icon: "mdi mdi-cube-outline",   title: "Product Info",   step: 1,   color: "#fff",   bgColor: "#6C63FF"  }, 
    {   icon: "mdi mdi-shape-outline",   title: "Category & Brand",   step: 2,   color: "#fff",   bgColor: "#00BFA5"  }, 
    {   icon: "mdi mdi-account-tie",   title: "Vendor Selection",   step: 3,   color: "#fff",   bgColor: "#FF7043"  }, 
    {   icon: "mdi mdi-package-variant-closed",   title: "Add Materials",   step: 4,   color: "#fff",   bgColor: "#5C6BC0"  }, 
    {   icon: "mdi mdi-dna",   title: "Variants & Quantity",   step: 5,   color: "#fff",   bgColor: "#8E24AA"  }, 
    {   icon: "mdi mdi-currency-inr",   title: "Cost & Pricing",   step: 6,   color: "#fff",   bgColor: "#009688"  }, 
    {   icon: "mdi mdi-percent-outline",   title: "Tax Details",   step: 7,   color: "#fff",   bgColor: "#F06292"  }, 
    {   icon: "mdi mdi-content-save",   title: "Review & Save BOM",   step: 8,   color: "#fff",   bgColor: "#FFA000"  }
  ]
},
 {
  routes: ["/manufacturers"],
  steps: [ 
    {   icon: "mdi mdi-domain",   title: "Manufacturer Name",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-shape-outline",   title: "Contact Person Name",   step: 2,   color: "#fff",   bgColor: "#00BFA5", }, 
    {   icon: "mdi mdi-phone-classic",   title: "Phone & Email",   step: 3,   color: "#fff",   bgColor: "#FF7043", }, 
    {   icon: "mdi mdi-web",   title: "Website Url",   step: 4,   color: "#fff",   bgColor: "#5C6BC0", }, 
    {   icon: "mdi mdi-map-marker-outline", title: "Address Details", step: 4, color: "#fff", bgColor: "#5C6BC0",  }, 
    {   icon: "mdi mdi-content-save-outline",   title: "Save Manufacturer",   step: 5,   color: "#fff",   bgColor: "#009688",  }, 
    {   icon: "mdi mdi-format-list-bulleted-square",   title: "Manage Manufacturers",   step: 6,   color: "#fff",   bgColor: "#F06292", }
  ]
},
 {
  routes: ["/production/orders"],
  steps: [ 
    {   icon: "mdi mdi-view-list-outline",   title: "Select BOM",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-counter",   title: "Enter Quantity",   step: 2,   color: "#fff",   bgColor: "#00BFA5", }, 
    {   icon: "mdi mdi-content-save-outline",   title: "Save Production Order",   step: 3,   color: "#fff",   bgColor: "#FF7043", }, 
    {   icon: "mdi mdi-cancel",   title: "Cancel Order",   step: 4,   color: "#fff",   bgColor: "#5C6BC0", }, 
  ]
},
{
  routes: ["/production/work-in-progress"],
  steps: [ 
    {   icon: "mdi mdi-filter-variant",   title: "Filter by Status",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
  ]
},
{
  routes: ["/create-invoice"],
  steps: [ 
    {   icon: "mdi mdi-account-plus",   title: "Customer Details",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-map-marker-outline",   title: "Customer Address",   step: 2,   color: "#fff",   bgColor: "#00BFA5", }, 
    {   icon: "mdi mdi-calendar-range",   title: "Invoice Dates",   step: 3,   color: "#fff",   bgColor: "#FF7043", }, 
    {   icon: "mdi mdi-file-document",   title: "Invoice Type",   step: 4,   color: "#fff",   bgColor: "#5C6BC0", }, 
    {   icon: "mdi mdi-format-list-bulleted", title: "Add Items", step: 4, color: "#fff", bgColor: "#5C6BC0",  }, 
    {   icon: "mdi mdi-cash-check",   title: "Amount Paid",   step: 5,   color: "#fff",   bgColor: "#009688",  }, 
    {   icon: "mdi mdi-content-save",   title: "Submit Invoice",   step: 6,   color: "#fff",   bgColor: "#F06292", },
  ]
},
{
  routes: ["/retail-billing"],
  steps: [ 
    {   icon: "mdi mdi-account-plus",   title: "Customer Details",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-map-marker-outline",   title: "Customer Address",   step: 2,   color: "#fff",   bgColor: "#00BFA5", }, 
    {   icon: "mdi mdi-format-list-bulleted", title: "Add Billing Items", step: 3, color: "#fff", bgColor: "#5C6BC0",  }, 
    {   icon: "mdi mdi-cash-check",   title: "Discount",   step: 4,   color: "#fff",   bgColor: "#009688",  }, 
    {   icon: "mdi mdi-file-document-outline",   title: "Bill Summary Preview",   step: 5,   color: "#fff",   bgColor: "#009688",  }, 
    {   icon: "mdi mdi-content-save",   title: "Create Bill",   step: 6,   color: "#fff",   bgColor: "#F06292", },
  ]
},
{
  routes: ["/retail-bills"],
  steps: [ 
    {   icon: "mdi mdi-file-document-outline",   title: "View Bills",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-file-plus-outline",   title: "Create Bill",   step: 2,   color: "#fff",   bgColor: "#00BFA5", }, 
  ]
},
{
  routes: ["/customers"],
  steps: [ 
    {   icon: "mdi mdi-file-document-outline",   title: "View Customers",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-account-edit",   title: "Update Customer Details",   step: 2,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-close-circle-outline",   title: "Close Details",   step: 3,   color: "#fff",   bgColor: "#00BFA5", },  
  ]
},
{
  routes: ["/crm/all-leads"],
  steps: [ 
    {   icon: "mdi mdi-account-group",   title: "All Leads",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-plus-box",   title: "Add New Lead",   step: 2,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-file-import",   title: "Import Leads",   step: 3,   color: "#fff",   bgColor: "#FFA000", },
    {   icon: "mdi mdi-file-export",   title: "Export Leads",   step: 4,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-filter-variant",   title: "Filter Leads",   step: 5,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-pencil-outline",   title: "Edit Lead Details",   step: 6,   color: "#fff",   bgColor: "#00BFA5", }, 
    {   icon: "mdi mdi-delete-outline",   title: "Delete Lead",   step: 7,   color: "#fff",   bgColor: "#EF5350", },   
  ]
},
{
  routes: ["/crm/create-lead"],
  steps: [ 
    {   icon: "mdi mdi-account-plus-outline",   title: "Enter Lead Name",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-email-outline",   title: "Add Email & Phone",   step: 2,   color: "#fff",   bgColor: "#42A5F5", },
    {   icon: "mdi mdi-web",   title: "Enter Platform & Ad Data",   step: 3,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-identifier",   title: "Ad ID",   step: 4,   color: "#fff",   bgColor: "#FFA000", }, 
    {   icon: "mdi mdi-playlist-plus",   title: "Add Additional Fields",   step: 5,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-check-circle-outline",   title: "Add Lead",   step: 6,   color: "#fff",   bgColor: "#00BFA5", }, 
  ]
},
{
  routes: ["/crm/assigned-teams"],
  steps: [ 
    {   icon: "mdi mdi-account-multiple-outline",   title: "CRM Users",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-account-plus",   title: "Add New User",   step: 2,   color: "#fff",   bgColor: "#42A5F5", },
    {   icon: "mdi mdi-toggle-switch",   title: "Select Status",   step: 3,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-briefcase-account",   title: "Select Role",   step: 4,   color: "#fff",   bgColor: "#FFA000", }, 
    {   icon: "mdi mdi-pencil-outline",   title: "Edit Existing User",   step: 5,   color: "#fff",   bgColor: "#AB47BC", },
    {   icon: "mdi mdi-close-circle-outline",   title: "Close Details",   step: 6,   color: "#fff",   bgColor: "#00BFA5", },  

  ]
},
{
  routes: ["/crm/task-followups"],
  steps: [ 
    {   icon: "mdi mdi-clipboard-text-outline",   title: "Task List Overview",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-clipboard-check-outline",   title: "Check Status & Priority",   step: 2,   color: "#fff",   bgColor: "#42A5F5", },
    {   icon: "mdi mdi-pencil",   title: "Edit Task",   step: 3,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-format-list-checkbox",   title: "Change Task Status",   step: 4,   color: "#fff",   bgColor: "#FFA000", }, 
    {   icon: "mdi mdi-account-switch",   title: "Reassign Task",   step: 5,   color: "#fff",   bgColor: "#AB47BC", },
    {   icon: "mdi mdi-check-circle-outline",   title: "Update Task",   step: 6,   color: "#fff",   bgColor: "#00BFA5", },  
  ]
},
{
  routes: ["/my-profile"],
  steps: [ 
    {   icon: "mdi mdi-account-circle-outline",   title: "View Profile Info",   step: 1,   color: "#fff",   bgColor: "#6C63FF", }, 
    {   icon: "mdi mdi-pencil-outline",   title: "Edit Personal Details",   step: 2,   color: "#fff",   bgColor: "#42A5F5", },
    {   icon: "mdi mdi-lock-reset",   title: "Change Your Password",   step: 3,   color: "#fff",   bgColor: "#00BFA5", },
    {   icon: "mdi mdi-image-edit",   title: "Upload Profile Picture",   step: 4,   color: "#fff",   bgColor: "#FFA000", }, 
    {   icon: "mdi mdi-check-circle-outline",   title: "Update Profile",   step: 5,   color: "#fff",   bgColor: "#AB47BC", },
  ]
},


];

export default tutorialSteps;
