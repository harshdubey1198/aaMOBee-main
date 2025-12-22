const inventoryServices = require('../services/inventory.services');
const { createResult } = require('../utils/utills');

const inventoryController = {};

// CREATE INVENTORY ITEM WITH VARIANTS
inventoryController.createItem = async (req, res) => {
    try {
        const newItem = await inventoryServices.createItem(req.params.id, req.body);
        return res.status(200).json(createResult("Inventory item created successfully", newItem));
    } catch (error) {
        console.log(error, "error")
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// GET ALL ITEMS WITH VARIANTS
// inventoryController.getAllItems = async (req, res) => {
//     try {
//         const { items, firmCurrency } = await inventoryServices.getAllItems(req.params.id);
//         return res.status(200).json({ message: "Inventory items fetched successfully", data: items,  currency: firmCurrency,  error: null});
//     } catch (error) {
//         return res.status(500).json({ message: null, data: null, currency: null, error: error.message});
//     }
// };

inventoryController.getAllItems = async (req, res) => {
  try {
    const { items, firmCurrency } = await inventoryServices.getAllItems(req.params.id);
    return res.status(200).json({
      message: items.length > 0 ? "Inventory items fetched successfully" : "No inventory items found",
      data: items,
      currency: firmCurrency,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      message: null,
      data: null,
      currency: null,
      error: error.message,
    });
  }
};


// GET SINGLE ITEM
inventoryController.getItem = async (req, res) => {
    try {
        const items = await inventoryServices.getItem(req.params.id);
        return res.status(200).json(createResult("Inventory items fetched successfully", items));
    } catch (error) {
        return res.status(500).json(createResult(null, null, error.message));
    }
};

// UPDATE ITEM
inventoryController.updateItem = async (req, res) => {
    try {
        const updatedItem = await inventoryServices.updateItem(req.params.id, req.body);
        return res.status(200).json(createResult("Inventory item updated successfully", updatedItem));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// DELETE ITEM
inventoryController.deleteItem = async (req, res) => {
    try {
        const deletedItem = await inventoryServices.deleteItem(req.params.id);
        return res.status(200).json(createResult("Inventory item deleted successfully", deletedItem));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// DELETE VARIANTS FROM ARRAY 
inventoryController.deleteVariant = async (req, res) => {
    try {
        const {itemId, variantId} = req.params
        const deletedItem = await inventoryServices.deleteVariant(itemId, variantId);
        return res.status(200).json(createResult("Inventory Variants deleted successfully", deletedItem));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// ADD VARIANTS TO THE ARRAY
inventoryController.addVariant = async (req, res) => {
    try {
        const {itemId} = req.params
        const updateVaraint = await inventoryServices.addVariant(itemId, req.body);
        return res.status(200).json(createResult("Inventory Variants added successfully", updateVaraint));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};

// // GET CATEGORY BASED VARIANTS
// inventoryController.getCategoryVariants = async (req, res) => {
//     try {
//         const categoryVariants = await inventoryServices.getCategoryVariants(req.params.id);
//         return res.status(200).json(createResult("Category Based Variants Fetch successfully", categoryVariants));
//     } catch (error) {
//         return res.status(400).json(createResult(null, null, error.message));
//     }
// };

// // CREATE CATEGORY BASED VARIANTS 
// inventoryController.createCategoryVariants = async (req, res) => {
//     try {
//         const categoryVariants = await inventoryServices.createCategoryVariants(req.body);
//         return res.status(200).json(createResult("Category Based Variants Fetch successfully", categoryVariants));
//     } catch (error) {
//         return res.status(400).json(createResult(null, null, error.message));
//     }
// };

//industryController

inventoryController.createIndustry = async (req, res) => {
    try {
        const industry = await inventoryServices.createIndustry(req.body);
        return res.status(200).json(createResult("Industry created successfully", industry));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};
inventoryController.createUserIndustry = async (req, res) => {
    try {
        const industry = await inventoryServices.createUserIndustry(req.body);
        return res.status(200).json(createResult("Industry created successfully", industry));
    } catch (error) {
        return res.status(400).json(createResult(null, null, error.message));
    }
};


inventoryController.getUserService = async (req, res) => {
  try {
    const industryData = await inventoryServices.getUserService(req.params.id);
    return res.status(200).json(createResult("Service fetched successfully", industryData));
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(400).json(createResult(null, null, error.message));
  }
};

//diffrent count condition
inventoryController.getCountCondition = async (req, res) => {
  try {
    const count = await inventoryServices.getCountCondition(req.params.id);
    return res.status(200).json(createResult("Count fetched successfully", count));
  } catch (error) {
    return res.status(400).json(createResult(null, null, error.message));
  }
};
inventoryController.getCountConditionFirm = async (req, res) => {
  try {
    const count = await inventoryServices.getCountConditionFirm(req.params.id);
    return res.status(200).json(createResult("Count fetched successfully", count));
  } catch (error) {
    return res.status(400).json(createResult(null, null, error.message));
  }
};

module.exports = inventoryController;
