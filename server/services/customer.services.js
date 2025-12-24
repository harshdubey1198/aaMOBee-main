const { customerFilter, buildFilter } = require("../filter");
const Customer = require("../schemas/cutomer.schema");

const customerServices = {};

// SEARCH FOR A CUSTOMER UNDER THAT FIRM
customerServices.searchCustomer = async (searchQuery, firmId) => {
  if (!searchQuery || !firmId) {
    throw new Error("Search query and firmId are required");
  }

  const filter = {
    firmId,
    deleted_at: null,
    ...buildFilter(searchQuery)
  }
  const customer = await Customer.find(filter).limit(20).lean();

  if (customer.length === 0) {
    throw new Error("No Customer Found");
  }
   customer.sort((a, b) => {
    const aStartsWith = a.firstName?.toLowerCase().startsWith(searchQuery) || a.lastName?.toLowerCase().startsWith(searchQuery);
    const bStartsWith = b.firstName?.toLowerCase().startsWith(searchQuery) || b.lastName?.toLowerCase().startsWith(searchQuery);

    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return 0; // Keep default if same priority
  });
    return customer.slice(0, 10); // return top 10

};

// GET ALL CUSTOMERS UNDER THAT FIRM
customerServices.getAllCustomers = async (firmId) => {
  if (!firmId) {
    throw new Error("firmId is required");
  }
  const customers = await Customer.find({firmId: firmId, deleted_at:null}).sort({ createdAt: -1 })
  .populate({
    path: "firmId",
    select: "companyTitle email avatar",
  })
  .populate({
    path: "createdBy",
    select: "firstName lastName email",
  });

  if(customers.length === 0){
    throw new Error("No Customers found for this firms")
  }   
  return customers
}

// GET SINGLE CUSTOMER SUCCEFULLY
customerServices.getCustomer = async (customerId) => {
  if (!customerId) {
    throw new Error("customerId is required");
  }
  const customer = await Customer.find({_id: customerId, deleted_at:null})
  .populate({
    path: "firmId",
    select: "companyTitle email avatar",
  })
  .populate({
    path: "createdBy",
    select: "firstName lastName email",
  });
  if(!customer){
    throw new Error("Customer Not Found")
  }
  return customer
}

// CUSTOMER DELETED 
customerServices.deleteCustomer = async (customerId) => {
    const existingCustomer = await Customer.findOne({_id: customerId, deleted_at:null})
    if (!existingCustomer) {
        throw new Error('Customer not found');
    }

    const deletedCustomer = await Customer.findByIdAndUpdate(
        {_id: customerId},
        {deleted_at: Date.now()},
        {new: true}
    )
    return deletedCustomer
}

// CUSTOMER UPDATE
customerServices.updateCustomer = async (customerId, customerData) => {
  try {
      const existingCustomer = await Customer.findOne({ _id: customerId, deleted_at: null });

      if (!existingCustomer) {
          throw new Error('Customer not found');
      }

      if (customerData.address) {
          customerData.address = { 
              ...existingCustomer.address.toObject(),  
              ...customerData.address                 
          };
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(
          customerId,
          { $set: customerData }, 
          { new: true, runValidators: true }  
      );

      return updatedCustomer;
  } catch (error) {
      console.error("Error updating customer:", error);
      throw new Error(error.message || 'Failed to update customer');
  }
};



module.exports = customerServices;
