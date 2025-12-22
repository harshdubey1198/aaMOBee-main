const Category = require("../schemas/category.schema");
const InventoryItem = require("../schemas/inventoryItem.schema");
const Industry = require("../schemas/industry.schema");
const UserIndustryService = require("../schemas/userindustry.schema");
const User = require("../schemas/user.schema");
const CRMUser = require("../schemas/crmUser.schema");
const Invoice = require("../schemas/invoice.schema");
const Bills = require("../schemas/bill.schema");
const ProductionOrder = require("../schemas/productionorder.shcema");
const Lead = require("../schemas/lead.schema");
const Vendor = require("../schemas/vendor.schema");
const Tax = require("../schemas/tax.schema");
const Customer = require("../schemas/cutomer.schema");
const Brand = require("../schemas/brand.schema");
const Manufacturer = require("../schemas/manufacturer.schema");
const { default: mongoose } = require("mongoose");

let inventoryServices = {};

// CALCULATE STOCK FUNCTION FOR REUSABILITY
const calculateStock = (variants) => {
  // console.log(variants, "varianst")
  return variants.reduce(
    (sum, variant) => sum + (parseInt(variant.stock, 10) || 0),
    0
  );
};

// CREATE INVENTORY ITEM WITH VARIANTS
inventoryServices.createItem = async (userId, body) => {
  const {
    name,
    description,
    quantity,
    qtyType,
    ProductHsn,
    type,
    batches,
    supplier,
    manufacturer,
    itemCurrency,
    taxId,
    selectedTaxTypes,
    vendorId,
    brand,
    costPrice,
    sellingPrice,
    categoryId,
    subcategoryId,
    variants,
    firmId: payloadFirmId,
  } = body;

  const existingItem = await InventoryItem.findOne({ name, createdBy: userId });
  if (existingItem) {
    throw new Error("Item with this name already exists for this user");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  let firmIdToUse = user.adminId;
  let firmCurrency = user.currency;

  // If client_admin, override firmId from payload
  if (user.role === "client_admin" && payloadFirmId) {
    const firm = await User.findById(payloadFirmId);
    if (!firm) {
      throw new Error("Provided firmId not found");
    }
    firmIdToUse = firm._id;
    firmCurrency = firm.currency;
  }

  const [category, vendor, tax] = await Promise.all([
    Category.findById(categoryId),
    vendorId ? Vendor.findById(vendorId) : null,
    taxId ? Tax.findById(taxId) : null,
  ]);

  if (!category) throw new Error("This category is not available");
  if (subcategoryId) {
    const subcategory = await Category.findOne({ _id: subcategoryId });
    if (!subcategory || String(subcategory.parentId) !== String(categoryId)) {
      throw new Error(
        "Invalid subcategory or subcategory does not belong to the parent category"
      );
    }
  }
  if (vendorId && !vendor) throw new Error("Vendor not found");
  if (!taxId || !tax) throw new Error("Tax not found");

  const selectedTaxIds = selectedTaxTypes.map(
    (id) => new mongoose.Types.ObjectId(id)
  );
  const taxRateIds = tax.taxRates
    .filter((rate) =>
      selectedTaxIds.some((selectedId) => selectedId.equals(rate._id))
    )
    .map((rate) => rate._id);

  if (taxRateIds.length === 0)
    throw new Error("No valid tax components selected");

  const totalStock =
    variants && variants.length > 0 ? calculateStock(variants) : quantity;

  const newItem = new InventoryItem({
    name,
    description,
    quantity: totalStock,
    qtyType,
    supplier,
    manufacturer,
    brand,
    costPrice,
    sellingPrice,
    type,
    batches: batches || [],
    categoryId,
    ProductHsn,
    vendor: vendor ? vendor._id : null,
    createdBy: user._id,
    firmId: firmIdToUse,
    itemCurrency: itemCurrency || firmCurrency,
    tax: {
      taxId: tax._id,
      selectedTaxTypes: taxRateIds,
    },
    subcategoryId: subcategoryId || null,
    variants: variants || [],
  });

  await newItem.save();
  return newItem;
};

// inventoryServices.getAllItems = async (adminId) => {
//   const items = await InventoryItem.find({ firmId: adminId, deleted_at: null })
//     .populate("categoryId")
//     .populate("subcategoryId")
//     .populate("vendor")
//     .populate({ path: "createdBy", select: "firstName lastName email" })
//     .populate({ path: "tax.taxId", select: "taxName taxRates" })
//     .populate("brand")
//     .populate("manufacturer")
//     .populate({ path: "firmId", select: "currency" })
//     .lean();

//   if (!items.length) {
//     throw new Error("No items found");
//   }

//   let firmCurrency = null;
//   if (items[0].firmId && items[0].firmId.currency) {
//     firmCurrency = items[0].firmId.currency;
//   }

//   for (const item of items) {
//     if (
//       item.tax &&
//       item.tax.selectedTaxTypes?.length > 0 &&
//       item.tax.taxId?.taxRates
//     ) {
//       const selectedTaxIds = new Set(
//         item.tax.selectedTaxTypes.map((id) => id.toString())
//       );
//       item.tax.selectedTaxTypes = item.tax.taxId.taxRates.filter((rate) =>
//         selectedTaxIds.has(rate._id.toString())
//       );
//     }
//   }

//   for (const item of items) {
//     delete item.firmId;
//   }

//   return { items, firmCurrency };
// };

// GET SINGLE ITEM

inventoryServices.getAllItems = async (adminId) => {
  const items = await InventoryItem.find({ firmId: adminId, deleted_at: null })
    .populate("categoryId")
    .populate("subcategoryId")
    .populate("vendor")
    .populate({ path: "createdBy", select: "firstName lastName email" })
    .populate({ path: "tax.taxId", select: "taxName taxRates" })
    .populate("brand")
    .populate("manufacturer")
    .populate({ path: "firmId", select: "companyTitle currency" })

    .lean();

  let firmCurrency = null;
  if (items?.[0]?.firmId?.currency) {
    firmCurrency = items[0].firmId.currency;
  }

  for (const item of items) {
  if (
    item.tax &&
    item.tax.selectedTaxTypes?.length > 0 &&
    item.tax.taxId?.taxRates
  ) {
    const selectedTaxIds = new Set(
      item.tax.selectedTaxTypes.map((id) => id.toString())
    );
    item.tax.selectedTaxTypes = item.tax.taxId.taxRates.filter((rate) =>
      selectedTaxIds.has(rate._id.toString())
    );
  }

  // 🟡 Auto-fill vendor/brand/manufacturer with firmId if missing
  if (!item.vendor && item.firmId?._id) {
    item.vendor = {
      _id: item.firmId._id,
      name: `Self (${item.firmId.companyTitle || "Our Firm"})`,
    };
  }

  if (!item.brand && item.firmId?._id) {
    item.brand = {
      _id: item.firmId._id,
      name: `Self (${item.firmId.companyTitle || "Our Firm"})`,
    };
  }

  if (!item.manufacturer && item.firmId?._id) {
    item.manufacturer = {
      _id: item.firmId._id,
      name: `Self (${item.firmId.companyTitle || "Our Firm"})`,    };
  }
}


  return { items, firmCurrency };
};




inventoryServices.getItem = async (id) => {
  const item = await InventoryItem.findOne({ _id: id, deleted_at: null })
    .populate("categoryId")
    .populate("subcategoryId")
    .populate("vendor")
    .populate({ path: "createdBy", select: "firstName lastName email" })
    .populate({ path: "tax.taxId", select: "taxName taxRates" })
    .populate("brand")
    .populate("manufacturer")
    .lean();
  if (!item) {
    throw new Error("No items found");
  }
  if (item.tax.selectedTaxTypes.length > 0 && item.tax.taxId?.taxRates) {
    item.tax.selectedTaxTypes = item.tax.taxId.taxRates.filter((rate) =>
      item.tax.selectedTaxTypes.some(
        (id) => id.toString() === rate._id.toString()
      )
    );
  }
  return item;
};

// UPDATE INVENTORY ITEM
inventoryServices.updateItem = async (id, body) => {
  const {
    name,
    description,
    quantity,
    qtyType,
    taxId,
    selectedTaxTypes,
    itemCurrency,
    supplier,
    manufacturer,
    vendor,
    brand,
    costPrice,
    sellingPrice,
    categoryId,
    subcategoryId,
    type,
    variants,
  } = body;
  const existingItem = await InventoryItem.findById(id);
  if (!existingItem) {
    throw new Error("Inventory item not found");
  }

  if (categoryId) {
    const category = await Category.findOne({ _id: categoryId });
    if (!category) {
      throw new Error("This category is not Available");
    }
  }

  if (subcategoryId) {
    const subcategory = await Category.findOne({ _id: subcategoryId });
    if (
      !subcategory ||
      String(subcategory.parentId) !== String(existingItem.categoryId)
    ) {
      throw new Error(
        "Invalid subcategory or subcategory does not belong to the parent category"
      );
    }
  }

  let totalStock = existingItem.quantity;
  if (variants && variants.length > 0) {
    for (const variant of variants) {
      const { _id, price, optionLabel, stock, sku, barcode, variationType } =
        variant;
      await InventoryItem.updateOne(
        { _id: id, "variants._id": _id },
        {
          $set: {
            "variants.$.variationType": variationType,
            "variants.$.price": price,
            "variants.$.optionLabel": optionLabel,
            "variants.$.stock": stock,
            "variants.$.sku": sku,
            "variants.$.barcode": barcode,
          },
        }
      );
    }
  }

  let taxUpdate = {};
  if (taxId) {
    const tax = await Tax.findById(taxId);
    if (!tax) {
      throw new Error("Tax not found");
    }
    let finalTaxComponents = [];
    if (selectedTaxTypes && selectedTaxTypes.length > 0) {
      finalTaxComponents = tax.taxRates.filter((taxRate) =>
        selectedTaxTypes.includes(taxRate._id.toString())
      );

      // if (finalTaxComponents.length === 0) {
      //     throw new Error("No valid tax components selected");
      // }
    }

    taxUpdate = {
      taxId: tax._id,
      selectedTaxTypes: selectedTaxTypes || [],
    };
  }
  const updateItem = await InventoryItem.findById(id);
  // totalStock = calculateStock(updateItem.variants);
  totalStock =
    variants && variants.length > 0
      ? calculateStock(updateItem.variants)
      : quantity;
  const updatedItem = await InventoryItem.findByIdAndUpdate(
    id,
    {
      name,
      description,
      quantity: totalStock,
      qtyType,
      supplier,
      manufacturer,
      brand,
      type,
      vendor,
      costPrice,
      itemCurrency,
      sellingPrice,
      tax: taxId ? taxUpdate : existingItem.tax,
      categoryId,
      subcategoryId: subcategoryId || null,
    },
    { new: true }
  );
  return updatedItem;
};

// DELETE INVENTORY ITEM
inventoryServices.deleteItem = async (id) => {
  const existingItem = await InventoryItem.findOne({
    _id: id,
    deleted_at: null,
  });
  if (!existingItem) {
    throw new Error("Inventory item not found");
  }

  const deletedItem = await InventoryItem.findByIdAndUpdate(
    id,
    { deleted_at: Date.now() },
    { new: true }
  );
  return deletedItem;
};

// DELETE VARIANTS FROM EXISTING ITEM
inventoryServices.deleteVariant = async (itemId, variantId) => {
  const item = await InventoryItem.findById(itemId);
  if (!item) {
    throw new Error("Item not found");
  }
  item.variants.pull({ _id: variantId });
  item.quantity = calculateStock(item.variants);
  const updatedItem = await item.save();

  return updatedItem;
};

// ADD VARINST TO THE EXISTING ITEM AND ARRAY
inventoryServices.addVariant = async (itemId, variant) => {
  const existingItem = await InventoryItem.findOne({ _id: itemId });
  if (!existingItem) {
    throw new Error("Inventory item not found");
  }

  const existingVariant = existingItem.variants.some(
    (existingVariant) =>
      existingVariant.sku === variant.sku &&
      existingVariant.barcode === variant.barcode
  );
  if (existingVariant) {
    throw new Error("Variant already exist");
  }

  existingItem.variants.push(variant);
  existingItem.quantity = calculateStock(existingItem.variants);
  const updatedItem = await existingItem.save();
  return updatedItem;
};

//industry Service
inventoryServices.createIndustry = async (payload) => {
  const { industry, sub_industry, services } = payload;

  if (!industry || !sub_industry || !Array.isArray(services)) {
    throw new Error(
      "Missing required fields: industry, sub_industry, or services"
    );
  }

  // Check if the same industry + sub_industry already exists
  const exists = await Industry.findOne({ industry, sub_industry });
  if (exists) {
    throw new Error(
      "This industry and sub-industry combination already exists"
    );
  }

  const newEntry = await Industry.create({
    industry,
    sub_industry,
    services,
  });

  return newEntry;
};
inventoryServices.createUserIndustry = async (payload) => {
  const {
    firmId,
    createdBy,
    industry,
    sub_industry,
    services,
    is_verified = false,
  } = payload;

  // Validate inputs
  if (!firmId || !industry || !sub_industry || !Array.isArray(services)) {
    throw new Error(
      "Missing required fields: firmId, industry, sub_industry, or services"
    );
  }

  // Check if this firm already has this industry-subIndustry entry
  //   const exists = await UserIndustryService.findOne({ firmId, industry, sub_industry });
  //   if (exists) {
  //     throw new Error("This industry and sub-industry combination already exists for this firm");
  //   }

  // Create new entry
  const newEntry = await UserIndustryService.create({
    firmId,
    industry,
    sub_industry,
    services,
    is_verified,
    createdBy,
  });

  return newEntry;
};
// inventoryServices.getUserService = async (userId) => {
//   const user = await User.findById(userId);
//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (!user.firmIndustry || !user.firmSubIndustry) {
//     throw new Error("User industry or sub-industry not specified.");
//   }

//   const industryData = await Industry.findOne({
//     industry: user.firmIndustry,
//     sub_industry: user.firmSubIndustry,
//     status: 'active',
//     deleted_at: null
//   });

//   if (!industryData) {
//     throw new Error("No matching services found for the user's industry and sub-industry.");
//   }

//   return {
//     industry: industryData.industry,
//     sub_industry: industryData.sub_industry,
//     services: industryData.services
//   };
// };

inventoryServices.getUserService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const { firmIndustry, firmSubIndustry } = user;

  if (!firmIndustry || !firmSubIndustry) {
    throw new Error("User industry or sub-industry not specified.");
  }

  // Fetch ALL matching entries
  const [userIndustryList, masterIndustryList] = await Promise.all([
    UserIndustryService.find({
      firmId: userId,
      industry: firmIndustry,
      sub_industry: firmSubIndustry,
      status: "active",
      deleted_at: null,
    }),
    Industry.find({
      industry: firmIndustry,
      sub_industry: firmSubIndustry,
      status: "active",
      deleted_at: null,
    }),
  ]);

  if (userIndustryList.length === 0 && masterIndustryList.length === 0) {
    throw new Error("No matching services found for this user.");
  }

  // Merge services from all entries
  const combinedServices = [
    ...userIndustryList.flatMap((entry) => entry.services || []),
    ...masterIndustryList.flatMap((entry) => entry.services || []),
  ];

  // Deduplicate by `value`
  const uniqueServices = Object.values(
    combinedServices.reduce((acc, curr) => {
      acc[curr.value] = curr;
      return acc;
    }, {})
  );

  // Sort alphabetically by label
  //   uniqueServices.sort((a, b) => a.label.localeCompare(b.label));

  return {
    industry: firmIndustry,
    sub_industry: firmSubIndustry,
    services: uniqueServices,
  };
};

inventoryServices.getCountCondition = async (adminId) => {
  const existingUsersFirm = await User.find({ adminId, role: "firm" });


  if (existingUsersFirm.length === 0) {
    throw new Error("No users found for this firm (adminId)");
  }

  const firmIds = existingUsersFirm.map((user) => user._id);

  const associatedUsers = await User.find({ adminId: { $in: firmIds } });

  const crmUsers = await CRMUser.find({ firmId: { $in: firmIds } });
  const leads = await Lead.find({ firmId: { $in: firmIds } });
  const inventoryItems = await InventoryItem.find({ firmId: { $in: firmIds } });
  const lowStockItems = await InventoryItem.find({
    firmId: { $in: firmIds },
    quantity: { $lt: 5 },
    deleted_at: null,
  });
  const inventoryItemsQuantity = await InventoryItem.find({
    firmId: { $in: firmIds },
  });
  const invoiceCount = await Invoice.find({ firmId: { $in: firmIds } });
  const billscount = await Bills.find({ firmId: { $in: firmIds } });
  const ProductionOrderCount = await ProductionOrder.find({
    firmId: { $in: firmIds },
  });
  // console.log("inventoryItems:", inventoryItemsQuantity); // Log inventory items for debugging
  const totalQuantity = inventoryItemsQuantity.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return {
    TotalFirm: existingUsersFirm.length, // Total firm users
    TotalFirmUsers: associatedUsers.length, // Total users associated with firms
    TotalCRMUsers: crmUsers.length, // Total CRM users
    TotalLeads: leads.length, // Total leads from all firms
    TotalInventory: inventoryItems.length, // Total inventory items from all firms
    TotalInvoice: invoiceCount.length, // Total invoices from all firms
    TotalBillsCount: billscount.length, // Total bills from all firms
    ProductionOrderCount: ProductionOrderCount.length, // Total production orders from all firms
    TotalInventoryQuantity: totalQuantity, // Total inventory items from all firms
    // TotalFirm: existingUsersFirm.length,  // Total number of firms
    LowStockItemCount: lowStockItems.length,
  };
};

// inventoryServices.getCountConditionFirm = async (adminId) => {
//   const existingUsersFirm = await User.find({ adminId });

//   if (existingUsersFirm.length === 0) {
//     throw new Error("No users found for this firm (adminId)");
//   }
//   const totalemployees = await User.find({ adminId, role: "employee" });
//   const totalfirmadmin = await User.find({ adminId, role: "firm_admin" });
//   const totalaccountant = await User.find({ adminId, role: "accountant" });
//   const userIds = existingUsersFirm.map((user) => user._id);
//   console.log("userIds:", userIds);
//   const crmUsers = await CRMUser.find({ firmId: adminId });
//   const inventoryItem = await InventoryItem.find({
//     firmId: adminId,
//     deleted_at: null
//   });
//   const totalCRMLeads = await Lead.find({firmId: adminId , deleted_at: null});
//   const totalInvoice = await Invoice.find({firmId: adminId });
//   const totalBills = await Bills.find({firmId: adminId});
//   const totalQuantity = inventoryItem.reduce(
//     (total, item) => total + item.quantity,
//     0 
//   );
//   const lowStockItems = await InventoryItem.find({
//   firmId: adminId,
//   quantity: { $lt: 5 },
//   deleted_at: null,
// });

// const productionOrders = await ProductionOrder.find({firmId: adminId});

// const currentDate = new Date();
// currentDate.setHours(0, 0, 0, 0);

// const overdueInvoicesCount = await Invoice.countDocuments({
//   firmId: adminId,
//   deleted_at: null,
//   amountDue: { $gt: 0 },
//   dueDate: { $lt: currentDate },
//   approvalStatus: { $ne: 'rejected' } 
// });

// const overdueAggregation = await Invoice.aggregate([
//   { 
//     $match: { 
//       firmId: new mongoose.Types.ObjectId(adminId),
//       $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
//       amountDue: { $gt: 0 },
//       dueDate: { $lt: new Date() },
//       approvalStatus: { $ne: 'rejected' }
//     } 
//   },
//   { 
//     $group: { 
//       _id: null, 
//       totalOverdueAmount: { $sum: "$amountDue" } 
//     } 
//   }
// ]);

// const totalOverdueAmount = overdueAggregation.length > 0 ? overdueAggregation[0].totalOverdueAmount : 0;

// const totalCustomers = await Customer.countDocuments({
//     firmId: adminId,
//     isActive: true,
//     deleted_at: null
// });

// const totalVendors = await Vendor.countDocuments({
//     firmId: adminId,    
//     deleted_at: null  
// });

// const totalBrands = await Brand.countDocuments({
//     firmId: adminId,   
//     deleted_at: null 
// });

// const totalManufacturers = await Manufacturer.countDocuments({
//     firmId: adminId,   
//     deleted_at: null  
// });


//   return {
//     TotalUsers: existingUsersFirm.length,
//     Totalemployees: totalemployees.length,
//     TotalFirmAdmin: totalfirmadmin.length,
//     TotalAccountant: totalaccountant.length,
//     TotalCRMUsers: crmUsers.length,
//     totalinventory: inventoryItem.length,
//     TotalQuantity: totalQuantity, 
//     TotalCRMLeads: totalCRMLeads.length,
//     TotalInvoice: totalInvoice.length,
//     TotalBills: totalBills.length,
//     LowStockItemsCount: lowStockItems.length,
//     TotalProductionOrders : productionOrders.length,
//     TotalOverDueInvoicesCount: overdueInvoicesCount ,
//     TotalOverdueAmount: totalOverdueAmount, 
//     TotalCustomers: totalCustomers,
//     TotalVendors: totalVendors,
//     TotalBrands: totalBrands,
//     TotalManufacturers: totalManufacturers,
//   }; 
// };

inventoryServices.getCountConditionFirm = async (userId) => {
  // 1. Get user details
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const role = user.role;
  const adminId = user.adminId; // Firm ID to be used in all queries

  if (!adminId) {
    throw new Error('User does not belong to any firm');
  }

  // 2. Get all users in this firm
  const existingUsersFirm = await User.find({ adminId });

  if (existingUsersFirm.length === 0) {
    throw new Error('No users found for this firm (adminId)');
  }

  // 3. Your existing data fetching logic
  const totalemployees = await User.find({ adminId, role: "employee" });
  const totalfirmadmin = await User.find({ adminId, role: "firm_admin" });
  const totalaccountant = await User.find({ adminId, role: "accountant" });
  const crmUsers = await CRMUser.find({ firmId: adminId });
  const inventoryItem = await InventoryItem.find({ firmId: adminId, deleted_at: null });
  const totalCRMLeads = await Lead.find({ firmId: adminId, deleted_at: null });
  const totalInvoice = await Invoice.find({ firmId: adminId });
  const totalBills = await Bills.find({ firmId: adminId });

  const totalQuantity = inventoryItem.reduce((total, item) => total + item.quantity, 0);

  const lowStockItems = await InventoryItem.find({
    firmId: adminId,
    quantity: { $lt: 5 },
    deleted_at: null,
  });

  const productionOrders = await ProductionOrder.find({ firmId: adminId });

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const overdueInvoicesCount = await Invoice.countDocuments({
    firmId: adminId,
    deleted_at: null,
    amountDue: { $gt: 0 },
    dueDate: { $lt: currentDate },
    approvalStatus: { $ne: 'rejected' },
  });

  const overdueAggregation = await Invoice.aggregate([
    {
      $match: {
        firmId: new mongoose.Types.ObjectId(adminId),
        $or: [{ deleted_at: null }, { deleted_at: { $exists: false } }],
        amountDue: { $gt: 0 },
        dueDate: { $lt: new Date() },
        approvalStatus: { $ne: 'rejected' },
      },
    },
    {
      $group: {
        _id: null,
        totalOverdueAmount: { $sum: "$amountDue" },
      },
    },
  ]);

  const totalOverdueAmount = overdueAggregation.length > 0 ? overdueAggregation[0].totalOverdueAmount : 0;

  const totalCustomers = await Customer.countDocuments({
    firmId: adminId,
    isActive: true,
    deleted_at: null,
  });

  const totalVendors = await Vendor.countDocuments({
    firmId: adminId,
    deleted_at: null,
  });

  const totalBrands = await Brand.countDocuments({
    firmId: adminId,
    deleted_at: null,
  });

  const totalManufacturers = await Manufacturer.countDocuments({
    firmId: adminId,
    deleted_at: null,
  });

  // 4. Prepare full data
  const fullData = {
    TotalUsers: existingUsersFirm.length,
    Totalemployees: totalemployees.length,
    TotalFirmAdmin: totalfirmadmin.length,
    TotalAccountant: totalaccountant.length,
    TotalCRMUsers: crmUsers.length,
    Totalinventory: inventoryItem.length,
    TotalQuantity: totalQuantity,
    TotalCRMLeads: totalCRMLeads.length,
    TotalInvoice: totalInvoice.length,
    TotalBills: totalBills.length,
    LowStockItemsCount: lowStockItems.length,
    TotalProductionOrders: productionOrders.length,
    TotalOverDueInvoicesCount: overdueInvoicesCount,
    TotalOverdueAmount: totalOverdueAmount,
    TotalCustomers: totalCustomers,
    TotalVendors: totalVendors,
    TotalBrands: totalBrands,
    TotalManufacturers: totalManufacturers,
  };

  // 5. Role-based response filtering
  let roleBasedResponse = {};

  switch (role) {
    case 'firm_admin':
      roleBasedResponse = {
        TotalUsers: fullData.TotalUsers,
        Totalemployees: fullData.Totalemployees,
        TotalAccountant: fullData.TotalAccountant,
        TotalCRMUsers: fullData.TotalCRMUsers,
        TotalInvoice: fullData.TotalInvoice,
        TotalBills: fullData.TotalBills,
        TotalOverDueInvoicesCount: fullData.TotalOverDueInvoicesCount,
        TotalOverdueAmount: fullData.TotalOverdueAmount,
        TotalCustomers: fullData.TotalCustomers,
        TotalVendors: fullData.TotalVendors,
        TotalBrands: fullData.TotalBrands,
        TotalManufacturers: fullData.TotalManufacturers,
        TotalCRMLeads: fullData.TotalCRMLeads,
        Totalinventory: fullData.Totalinventory,
        LowStockItemsCount: fullData.LowStockItemsCount,
        TotalProductionOrders: fullData.TotalProductionOrders,
        TotalQuantity: fullData.TotalQuantity,
      };
      break;

    case 'accountant':
      roleBasedResponse = {
        TotalInvoice: fullData.TotalInvoice,
        TotalBills: fullData.TotalBills,
        TotalOverDueInvoicesCount: fullData.TotalOverDueInvoicesCount,
        TotalOverdueAmount: fullData.TotalOverdueAmount,
        TotalCRMLeads: fullData.TotalCRMLeads,
        TotalCustomers: fullData.TotalCustomers,
        TotalQuantity: fullData.TotalQuantity,
      };
      break;

    case 'employee':
      roleBasedResponse = {
        Totalinventory: fullData.Totalinventory,
        TotalQuantity: fullData.TotalQuantity,
        LowStockItemsCount: fullData.LowStockItemsCount,
        TotalProductionOrders: fullData.TotalProductionOrders,
        TotalCustomers: fullData.TotalCustomers,
        TotalVendors: fullData.TotalVendors,
        TotalBrands: fullData.TotalBrands,
        TotalManufacturers: fullData.TotalManufacturers,
      };
      break;

    default:
      roleBasedResponse = { message: 'Role not recognized or no specific data available' };
      break;
  }

  return roleBasedResponse;
};



module.exports = inventoryServices;
