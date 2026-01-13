import axios from "axios";
import constant from "./constant";

const token = JSON.parse(localStorage.getItem("authUser"))?.token;
const id = JSON.parse(localStorage.getItem("authUser"))?.response?._id;
const creatorId = JSON.parse(localStorage.getItem("authUser"))?.response?._id;
const firmId =
  JSON.parse(localStorage.getItem("authUser"))?.response?.adminId ||
  JSON.parse(localStorage.getItem("authUser"))?.response?.firmId;
const Role = JSON.parse(localStorage.getItem("authUser"))?.response?.role;

const createAxiosInstance = axios.create({
  baseURL: `${constant.appBaseUrl}/api/`,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: token ? `Bearer ${token}` : null,
  },
});

const axiosInstance = axios.create({
  baseURL: `${constant.appBaseUrl}/api/`,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("authUser"))?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response?.data || "Something went wrong")
);

export const updateUserById = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(`/auth/update/${id}`, updateData);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get all leads
export const getAllLeads = async () => {
  try {
    const response = await axiosInstance.get("/lead/get-leads");
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get all leads by firm id
export const getLeadsByFirmId = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/lead/get-lead-by-firm/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// lead by id
export const getLeadById = async (id) => {
  try {
    const response = await axiosInstance.get(`/lead/get-lead/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to add lead
export const addLead = async (lead) => {
  try {
    const response = await axiosInstance.post("/lead/create-lead", lead);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to update lead
export const updateLeadById = async (id, lead) => {
  try {
    const response = await axiosInstance.put(`/lead/update-lead/${id}`, lead);
    return response.data;
  } catch (error) {
    return error;
  }
};
// to delete lead
export const deleteLeadById = async (id) => {
  try {
    const response = await axiosInstance.delete(`/lead/delete-lead/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
// multiple delete leads
export const deleteMultipleLeads = async (data) => {
  try {
    const response = await axiosInstance.delete("/lead/delete-multiple-leads", {
      data,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// to assign lead to employee
export const assignLeadsToEmployee = async (data) => {
  try {
    const response = await axiosInstance.post("/task/create-task", data);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get firm users
export const getFirmUsers = async () => {
  try {
    const response = await axiosInstance.get("/auth/getCompany");
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getFirmUsersMain = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/auth/getCompany/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// ro get company for admin
export const getCompanyForAdmin = async (id) => {
  try {
    const response = await axiosInstance.get(`/auth/getCompany/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get user id data using crmuser id
export const getCrmUserById = async () => {
  try {
    const response = await axiosInstance.get(`crmuser/crmsuser-account/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get tasks
export const getAllTasks = async () => {
  try {
    const response = await axiosInstance.get("/task/get-tasks");
    return response.data;
  } catch (error) {
    return error;
  }
};

// get tasks by firmId

export const getTasksByFirmId = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/task/get-task-by-firm/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// to update the task
export const updateTask = async (id, task) => {
  try {
    const response = await axiosInstance.put(`/task/update-task/${id}`, task);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to reassign task to employee
export const updateAssignees = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/task/update-assignee/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//to update task
export const updateTaskOrLead = async (id, updateData) => {
  try {
    const response = await axiosInstance.put(
      `/task/update-task/${id}`,
      updateData
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get tasks by assignee id
export const getTasksByAssignee = async (id) => {
  try {
    const response = await axiosInstance.get(`/task/assignedto/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

//   role management
export const getRoles = async () => {
  try {
    const response = await axiosInstance.get("/role/get-roles");
    const filteredRoles = response.data.data.filter(
      (role) => role.deleted_at === null
    );
    // console.log(filteredRoles);
    return filteredRoles;
  } catch (error) {
    return error;
  }
};

// to create role
export const createRole = async (role) => {
  try {
    const response = await axiosInstance.post("/role/create-role", role);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Failed to create role");
    }
    throw new Error("Network error or server not responding");
  }
};

// update role
export const updateRoleById = async (id, role) => {
  try {
    const response = await axiosInstance.put(`/role/update-role/${id}`, role);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to delete role
export const deleteRoleById = async (id) => {
  try {
    const response = await axiosInstance.delete(`/role/delete-role/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to create crm users
export const createCrmUser = async (user) => {
  try {
    const response = await axiosInstance.post(
      `/crmuser/create-crmsuser/${creatorId}`,
      user
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
// to update crm users
export const updateCrmUser = async (userId, user) => {
  try {
    const response = await axiosInstance.put(
      `/crmuser/update-crmsuser/${userId}`,
      user
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// update crm user password
export const updateCrmUserPassword = async (passwordData) => {
  try {
    const response = await axiosInstance.post(
      `/crmuser/update-crmpassword/${id}`,
      passwordData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating CRM user password:", error);
    throw error.response?.data || error;
  }
};

// to get crm users
export const getCrmUsers = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/crmuser/get-crmsuser/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to upload leads by xlsx , csv , json
export const uploadLeads = async (data) => {
  try {
    const response = await axiosInstance.post("/lead/importLead", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
export const createUser = async (data, clientId) => {

    const response = await axiosInstance.post(
      `/auth/createUser/${clientId}`, data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );  
    return response;

};


//  to export leads
export const exportLeads = async (data) => {
  try {
    const response = await axiosInstance.post("/lead/exportLead", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//  update lead status by userId and leadId
export const updateLeadStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/lead/update-leadstatus/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

//  get firm data using id
export const getFirmById = async () => {
  try {
    const response = await axiosInstance.get(`/auth/getfirm/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getCompanyData = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/auth/getfirm/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// get all plans
export const getAllPlans = async () => {
  try {
    const response = await axiosInstance.get("/plan/all");
    return response.data.response;
  } catch (error) {
    return error;
  }
};
export const demoUserLogin = async (email, token) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      token,
    });
    return response.data.response;
  } catch (error) {
    return error?.response?.data || { message: "Demo login failed" };
  } 
};
//  to approve status of client
export const approveClient = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/auth/approveClient/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

//  to inactive status of client
export const inactiveClient = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/auth/userInactive/${id}`, data);
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : error;
  }
};

//  blogcategory create api

export const createBlogCategory = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/blogcategory/create-blogCategory/${id}`,
      data
    );
    console.log(id);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get all blog categories
export const getBlogCategories = async () => {
  try {
    const response = await axiosInstance.get(
      "/blogcategory/get-blogcategories"
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get single blog category by id
export const getBlogCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/blogcategory/get-blogCategory/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// to update blog category

export const updateBlogCategory = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/blogcategory/update-blogCategory/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// to delete blog category
export const deleteBlogCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/blogcategory/delete-blogCategory/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// to create blog
export const createBlog = async (data) => {
  try {
    const response = await createAxiosInstance.post(`/blog/create-blog`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get all blogs
export const getBlogs = async () => {
  try {
    const response = await axiosInstance.get("/blog/get-blogs");
    return response.data;
  } catch (error) {
    return error;
  }
};

// to get blog by Id
export const getBlogById = async (id) => {
  try {
    const response = await axiosInstance.get(`/blog/get-blog/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to update blog by id
export const updateBlog = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/blog/update-blog/${id}`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

// get blogs by blog_slug
export const getBlogBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/blog/get-blog-slug/${slug}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// to delete blog by id
export const deleteBlog = async (id) => {
  try {
    const response = await axiosInstance.delete(`/blog/delete-blog/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// feedback api services

export const createFeedback = async (data) => {
  try {
    const response = await createAxiosInstance.post(
      `/feedback/create-feedback`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllFeedbacks = async () => {
  try {
    const response = await axiosInstance.get("/feedback/get-feedbacks");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getFeedbackById = async (id) => {
  try {
    const response = await axiosInstance.get(`/feedback/get-feedback/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateFeedback = async (id, data) => {
  try {
    const response = await createAxiosInstance.put(
      `/feedback/update-feedback/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteFeedbackById = async (id) => {
  try {
    const response = await axiosInstance.delete(
      `/feedback/delete-feedback/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// get item category
export const getItemCategories = async () => {
  try {
    const response = await axiosInstance.get(
      `/category/get-categories/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getItemSubCategories = async (categoryId) => {
  try {
    const response = await axiosInstance.get(
      `/category/subcategories/${categoryId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getVendors = async () => {
  try {
    const response = await axiosInstance.get(`/vendor/get-vendors/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getBrands = async () => {
  try {
    const response = await axiosInstance.get(`/brand/get-brands/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getTaxes = async () => {
  try {
    const response = await axiosInstance.get(`/tax/get-taxes/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getBoms = async (firmId) => {
  try {
    const response = await axiosInstance.post(`/bom/get-bom`, {
      firmId,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getInventoryItems = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/inventory/get-items/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateInventoryItemById = (id, payload) =>
  axiosInstance.put(`/inventory/update-item/${id}`, payload).then(res => res.data);

export const createBom = async (data) => {
  try {
    const response = await axiosInstance.post(`/bom/create-bom`, data);
    return response.data;
  } catch (error) {
    return error;
  }
};

//get all production orders using firmId in the body , post api
export const getProductionOrders = async () => {
  try {
    const response = await axiosInstance.post(
      `/productionorder/get-productionorders`,
      {
        firmId,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
// get production order by id
export const getProductionOrderById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/productionorder/get-productionorder/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// create production order
export const createProductionOrder = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/productionorder/create-productionorder`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// update production order quantity
export const updateProductionOrderQuantity = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/productionorder/update-productionorder/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// update production order status
export const updateProductionOrderStatus = async (id, data) => {
  try {
    const response = await axiosInstance.put(
      `/productionorder/update-productionorderstatus/${id}`,
      data
    );
    return response;
  } catch (error) {
    return error;
  }
};

// to get firm wise wastage
export const getFirmWastage = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/wasteinventory/get-wasteManagments/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getWastageById = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/wasteinventory/get-wasteManagment/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// get customers for firm
export const getCustomers = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/customer/get-customers/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
// update customer
export const updateCustomer = async (customerId, customerData) => {
  try {
    const response = await axiosInstance.put(
      `/customer/update-customer/${customerId}`,
      customerData
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getItemCategoriesmain = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/category/get-categories/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getVendorsmain = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/vendor/get-vendors/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getBrandsmain = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/brand/get-brands/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getProductionOrdersmain = async (firmId) => {
  try {
    const response = await axiosInstance.post(
      `/productionorder/get-productionorders`,
      {
        firmId,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getTaxesmain = async (firmId) => {
  try {
    const response = await axiosInstance.get(`/tax/get-taxes/${firmId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getPaymentDetails = async () => {
  try {
    const response = await axiosInstance.get(`/payment/payment-detail/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getPaymentDetailsMain = async (id) => {
  try {
    const response = await axiosInstance.get(`/payment/payment-detail/${id}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const createBilling = async (data) => {
  try {
    const response = await axiosInstance.post(`/billing/create-bill`, data);
    return response;
  } catch (error) {
    return error;
  }
};
export const createItem = async (data, createdBy) => {
    const response = await axiosInstance.post(`/inventory/create-item/${createdBy}`, data);
    return response;
};
// get firm bills by firm Id
export const getFirmBills = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/billing/get-bills-by-firm/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//  Set Permissions (POST)
export const setUserPermissions = async (userId, sidebarAccess) => {
  try {
    const response = await axiosInstance.post(
      `/auth/set-permissions/${userId}`,
      {
        sidebarAccess,
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

//   Get Permissions (GET)

export const getUserSidebar = async (userId) => {
  try {
    const response = await axiosInstance.get(`/auth/get-sidebar/${userId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// Query Form Request (POST)
export const QueryFormRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/blog/create-contact-message`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// Send Contact OTP Request (POST)
export const SendContactOtpRequest = async (data) => {
  try {
    const response = await axiosInstance.post(
      `/blog/send-contact-otp`,
      data
    );
    return response.data;
  } catch (error) {
    return error;
  }
};


// Get All Contact Messages (GET)
export const getAllContactMessages = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(
      `/blog/get-all-contact-messages?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// get user services for inventory creation

export const getUserServices = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/inventory/user-services/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// create firmIndustryService
export const createFirmIndustryService = async (data) => {
  try { 
    const response = await axiosInstance.post(
      "/inventory/create-user-industry",
      data
    );
    return response.data;
  } catch (error) {
    // console.error("Error creating firm industry service:", error);
    throw error.response?.data || error;
  }
};

// get clients data for the dashboard
export const clientDashboard = async (userId) => {
  try {
    const response = await axiosInstance.get(`/inventory/get-count-condition/${userId}`);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching client dashboard data:", error);
    throw error.response?.data || error;
  }
}
// for firm users dashboard 
export const firmUsersDashboard = async (userId) => {
  try {
    const response = await axiosInstance.get(`/inventory/get-count-condition-firm/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching firm users dashboard data:", error);
    throw error.response?.data || error;
  }
};

// for Super Admin dashboard
export const superAdminDashboard = async (userId) => {
  try {
    const response = await axiosInstance.get(`/role/getData/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching firm users dashboard data:", error);
    throw error.response?.data || error;
    
  }
};


export const getInvoiceById = async (id) => {
    try {
        const response = await axiosInstance.get(`/invoice/get-invoice/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching invoice:", error);
        throw error;
    }
};

// ✅ Update invoice by ID
export const updateInvoiceById = async (id, updatedInvoiceData) => {
    try {
        const response = await axiosInstance.put(`/invoice/edit-invoice/${id}`, updatedInvoiceData);
        return response.data;
    } catch (error) {
        console.error("Error updating invoice:", error);
        throw error;
    }
};

export const rejectInvoiceById = async (id) => {
    const response = await axiosInstance.put(`/invoice/reject-invoice/${id}`);
    return response.data;
};
export const deleteFirm = async (firmId) => {
    const response = await axiosInstance.delete(`/auth/delete-firm/${firmId}`);
    return response;
};


// Razorpay Integration 
export const createRazorPayment = async (data) => {
  try { 
    const response = await axiosInstance.post(
      "/payment/razorpay/create-order",
      data
    );
    return response.data;
  } catch (error) {
    // console.error("Error creating firm industry service:", error);
    throw error.response?.data || error;
  }
};
export const verifyRazorPayment = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/payment/verify",   // maps to http://localhost:7200/api/payments/verify
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getSettings = async()=>{
  try{
    const response = await axiosInstance.get('/settings/get-settings')
    return response.data;
  }catch(error){
    throw error;
  }
}
export const updateSettings = async (id, payload) => {
  try {
    const response = await axiosInstance.post(`/settings/update-settings/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createDemoUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/demo/create-demo-user", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginDemoUser = async (payload) => {
  try {
    const response = await axiosInstance.post("/auth/login", payload);
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDemoUserList = async (payload) => {
  try {
    const { page = 1, limit = 10 } = payload;
    const response = await axiosInstance.post(`/auth/get-demouser`, { page, limit });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateDemoUserExpiry = async (payload) => {
  try {
    const response = await axiosInstance.put("/auth/demoUser-ExpiryUpdate", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllDemoUserLogs = async () => {
  try {
    const response = await axiosInstance.get("/auth/get-all-demouser-logs");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDemoUserLogsById = async (userId) => {
  if (!userId) throw new Error("userId is required");
  try {
    const response = await axiosInstance.get(`/auth/get-demouser-logs/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// FAQ Section 

// FAQ APIs using slug
export const createFAQ = async (faqData) => {
  try {
    const response = await axiosInstance.post("/faqs/create-faq", faqData);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getAllFAQs = async () => {
  try {
    const response = await axiosInstance.get("/faqs/all-faqs");
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getFAQBySlug = async (slug) => {
  try {
    const response = await axiosInstance.get(`/faqs/${slug}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const updateFAQ = async (slug, faqData) => {
  try {
    const response = await axiosInstance.put(`/faqs/${slug}`, faqData);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const deleteFAQ = async (slug) => {
  try {
    const response = await axiosInstance.delete(`/faqs/${slug}`);
    return response.data;
  } catch (error) {
    return error;
  }
};
export const getItemSalesData = async (itemId) => {
  try {
    const response = await axiosInstance.get(`/inventory/item-sales-data/${itemId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching item sales data:", error);
    throw error; 
  }
};

export const aiChat = async (message) => {
  try {
    const response = await axiosInstance.post("/chat/ask", {
      question: message, // Send 'question' as the key, make sure it matches the backend's expected key
    });

    console.log("Backend Response:", response.data);  // Log to check if the response is correct
    return response.data;  // Make sure the backend sends { success, reply, context }
  } catch (error) {
    console.error("AI Chat API Error:", error);
    throw error;  // Throw error to be caught by sendToAI function
  }
};

// Save user data along with chats
export const saveUserData = async (payload) => {
  try {
    const response = await axiosInstance.post('/chatbot/data', payload);

    console.log("API Response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in saveUserData API call:", error);
    throw new Error("Failed to save user data");
  }
};

// HRMS APIs are listed below :- {Department Management}

/* 1. Create Department */
export const createDepartment = async (payload) => {
  try {
    const response = await axiosInstance.post(`/department/create`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* 2. Get Department by ID */
export const getDepartmentById = async (departmentId) => {
  try {
    const response = await axiosInstance.get(`/department/${departmentId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 3. Get Departments by Firm (Active) */
export const getDepartmentsByFirm = async (firmId, page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/department/by-firm/${firmId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 4. Update Department */
export const updateDepartment = async (departmentId, payload) => {
  try {
    const response = await axiosInstance.put(
      `/department/${departmentId}`,
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 5. Delete Department */
export const deleteDepartment = async (departmentId) => {
  try {
    const response = await axiosInstance.delete(
      `/department/${departmentId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 6. Reactivate Department */
export const reactivateDepartment = async (departmentId) => {
  try {
    const response = await axiosInstance.put(
      `/department/reactivate/${departmentId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 7. Get Departments by Parent */
export const getDepartmentsByParent = async (parentId, page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/department/by-parent/${parentId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 8. Get Inactive Departments by Firm */
export const getInactiveDepartmentsByFirm = async (firmId, page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/department/inactive/by-firm/${firmId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 9. Get All Departments (Active + Inactive) by Firm */
export const getAllDepartmentsByFirm = async (firmId, page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/department/all/by-firm/${firmId}?page=${page}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

// 10. To get departments designations available  toGetDesignationsListOfTheDepartmentById
export const toGetDesignationsListOfTheDepartmentById = async (departmentId) => {
  try {
    const response = await axiosInstance.get(`/department/with-designations/${departmentId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

// 11th api for search department
export const searchDepartments = async (firmId, search, page = 1) => {
  try {
    const response = await axiosInstance.post(`/department/search`, {
      firmId,
      search,
      page
    });
    return response.data;
  } catch (error) {
    return error;
  }
}

// {Designation Management}

// HRMS Designation APIs


/* 1. Create Designation */
export const createDesignation = async (payload) => {
  try {
    const response = await axiosInstance.post(
      `/designation/create`,
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 2. Get Designations by Department (Active) */
export const getDesignationsByDepartment = async (departmentId, page = 1) => {
  try {
    const response = await axiosInstance.get(
      `/designation/by-department/${departmentId}?page=${page}`
    );
    return response;
  } catch (error) {
    return error;
  }
};

/* 3. Get Designation by ID */
export const getDesignationById = async (designationId) => {
  try {
    const response = await axiosInstance.get(
      `/designation/${designationId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 4. Update Designation */
export const updateDesignation = async (designationId, payload) => {
  try {
    const response = await axiosInstance.put(
      `/designation/${designationId}`,
      payload
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 5. Delete Designation (Soft Delete) */
export const deleteDesignation = async (designationId) => {
  try {
    const response = await axiosInstance.delete(
      `/designation/${designationId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 6. Reactivate Designation */
export const reactivateDesignation = async (designationId) => {
  try {
    const response = await axiosInstance.put(
      `/designation/reactivate/${designationId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 7. Get Inactive Designations (by Firm OR Department) */
export const getInactiveDesignations = async ({
  firmId,
  departmentId,
  page = 1,
}) => {
  try {
    let query = `?page=${page}`;

    if (firmId) query += `&firmId=${firmId}`;
    if (departmentId) query += `&departmentId=${departmentId}`;

    const response = await axiosInstance.get(
      `/designation/inactive${query}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 8. Get Inactive Designations by Department */
export const getInactiveDesignationsByDepartment = async (
  departmentId,
  page = 1
) => {
  try {
    const response = await axiosInstance.get(
      `/designation/inactive?departmentId=${departmentId}&page=${page}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

/* 8. Search Designations (by title + department + firm) */
export const searchDesignations = async ({
  firmId,
  departmentId,
  search,
  page = 1,
}) => {
  try {
    const requestBody = {
      firmId,
      departmentId,
      search,
      page,
    };

    const response = await axiosInstance.post(`/designation/search`, requestBody);

    return response.data;
  } catch (error) {
    return error;
  }
};
// HRMS job & onboarding APIs
// CREATE JOB
export const createOnboardingJob = async (payload) => {
  try {
    const res = await axiosInstance.post("/job/create", payload);
    return res.data;
  } catch (err) {
    throw err;

  }
};

// GET ALL JOBS
export const getAllOnboardingJobs = async () => {
  try {
    const res = await axiosInstance.get("/job/alljobs");
    return res.data;
  } catch (err) {
   throw err;

  }
};

// SEARCH JOBS (firmId required)
export const searchOnboardingJobs = async (payload) => {
  try {
    const res = await axiosInstance.post("/job/search", payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// GET BY ID
export const getOnboardingJobById = async (jobId) => {
  try {
    const res = await axiosInstance.get(`/job/${jobId}`);
    return res.data;
  } catch (err) {
    throw err; 
  }
};

// UPDATE JOB
export const updateOnboardingJob = async (jobId, payload) => {
  try {
    const res = await axiosInstance.put(`/job/${jobId}`, payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// SOFT DELETE JOB (jobId + userId)
export const deleteOnboardingJob = async (payload) => {
  try {
    const res = await axiosInstance.post("/job/delete", payload);
    return res.data;
  } catch (err) {
    throw err;

  }
};

// JOBS CREATED BY USER
export const getJobsByUser = async (userId) => {
  try {
    const res = await axiosInstance.get(`/job/by-user/${userId}`);
    return res.data;
  } catch (err) {
    return err;
  }
};

// JOBS BY FIRM
export const getJobsByFirm = async (firmId) => {
  try {
    const res = await axiosInstance.get(`/job/by-firm/${firmId}`);
    return res.data;
  } catch (err) {
    return err;
  }
};

// JOBS BY DEPARTMENT
export const getJobsByDepartment = async (departmentId) => {
  try {
    const res = await axiosInstance.get(`/job/by-department/${departmentId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

// HRMS permission api's
// ADD PERMISSION TO USER
export const addHrmsPermission = async (payload) => {
  try {
    const res = await axiosInstance.post("/permission/add", payload);
    return res.data;
  } catch (err) {
    throw err;

  }
};

// REMOVE PERMISSION FROM USER
export const removeHrmsPermission = async (payload) => {
  try {
    const res = await axiosInstance.post("/permission/remove", payload);
    return res.data;
  } catch (err) {
    return err;
  }
};

// GET ALL AVAILABLE PERMISSIONS (from permissions.js)
export const getAllHrmsPermissions = async () => {
  try {
    const res = await axiosInstance.get("/permission/getAll");
    return res.data;
  } catch (err) {
    return err;
  }
};

// GET PERMISSIONS OF A USER
export const getHrmsPermissionsByUser = async (userId) => {
  try {
    const res = await axiosInstance.get(`/permission/user/${userId}`);
    return res.data;
  } catch (err) {
    return err;
  }
};

// LIST USERS HAVING A SPECIFIC PERMISSION
export const getUsersByHrmsPermission = async (permission) => {
  try {
    const res = await axiosInstance.get(
      `/permission/by-permission/${permission}`
    );
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getFirmUsersWithPermissions = async (payload) => {
  try {
    const res = await axiosInstance.post(
      "/permission/firm-users",
      payload
    );
    return res.data;
  } catch (err) {
   return err;

  }
};

// Employee Management → Firm Policy APIs

  //  CREATE FIRM POLICY

export const createFirmPolicy = async (data) => {
  try {
    const response = await axiosInstance.post(
      "/firm-policy/create",
      data
    );
    return response.data;
  } catch (error) {
    return (error);
  }
};

  //  GET POLICY BY FIRM ID

export const getFirmPolicyByFirm = async (firmId) => {
  try {
    const response = await axiosInstance.get(
      `/firm-policy/by-firm/${firmId}`
    );
    return response.data;
  } catch (error) {
    return error.response?.data || error.message;
  }
};

  //  UPDATE FIRM POLICY
export const updateFirmPolicy = async (policyId, data) => {
  try {
    const response = await axiosInstance.put(
      `/firm-policy/update/${policyId}`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

//  DELETE FIRM POLICY

export const deleteFirmPolicy = async (policyId) => {
  try {
    const response = await axiosInstance.delete(
      `/firm-policy/delete/${policyId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Employee API -----------------------

  //  CREATE EMPLOYEE

export const createEmployee = async (payload) => {
  try {
    const res = await axiosInstance.post("/employee/create", payload);
    return res.data;
  } catch (err) {
    throw err;
  }
};

  //  GET EMPLOYEE BY ID
  
export const getEmployeeById = async (employeeId) => {
  try {
    const res = await axiosInstance.get(`/employee/${employeeId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

  //  GET EMPLOYEES BY FIRM

export const getEmployeesByFirm = async (firmId) => {
  try {
    const res = await axiosInstance.get(`/employee/by-firm/${firmId}`);
    return res.data;
  } catch (err) {
    throw err;
  }
};

  //  UPDATE EMPLOYEE

export const updateEmployee = async (employeeId, payload) => {
  try {
    const res = await axiosInstance.put(
      `/employee/update/${employeeId}`,
      payload
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

  //  DELETE EMPLOYEE

export const deleteEmployee = async (employeeId) => {
  try {
    const res = await axiosInstance.delete(
      `/employee/delete/${employeeId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Employee Compensation
  //  CREATE EMPLOYEE COMPENSATION

export const createEmployeeCompensation = async (payload) => {
  try {
    const res = await axiosInstance.post(
      "/employee-compensation/create",
      payload
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//  GET COMPENSATION BY EMPLOYEE
export const getEmployeeCompensationByEmployee = async (employeeId) => {
  try {
    const res = await axiosInstance.get(
      `/employee-compensation/by-employee/${employeeId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

//  UPDATE EMPLOYEE COMPENSATION

export const updateEmployeeCompensation = async (
  compensationId,
  payload
) => {
  try {
    const res = await axiosInstance.put(
      `/employee-compensation/update/${compensationId}`,
      payload
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

  // DELETE EMPLOYEE COMPENSATION
  
export const deleteEmployeeCompensation = async (compensationId) => {
  try {
    const res = await axiosInstance.delete(
      `/employee-compensation/delete/${compensationId}`
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};


export default axiosInstance;