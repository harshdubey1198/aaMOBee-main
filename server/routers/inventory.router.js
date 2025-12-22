const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventory.controller");
const { tokenVerification } = require("../middleware/auth.middleware");

// Create a new Inventory Item
router.post(
  "/create-item/:id",
  tokenVerification,
  inventoryController.createItem
);
router.get("/get-items/:id", inventoryController.getAllItems);
router.get("/get-item/:id", inventoryController.getItem);
router.put(
  "/update-item/:id",
  tokenVerification,
  inventoryController.updateItem
);
router.delete(
  "/delete-item/:id",
  tokenVerification,
  inventoryController.deleteItem
);
router.delete(
  "/:itemId/delete-variant/:variantId",
  tokenVerification,
  inventoryController.deleteVariant
);
router.put(
  "/add-variant/:itemId",
  tokenVerification,
  inventoryController.addVariant
);
// router.get('/getcategoryVariants/:id', tokenVerification, inventoryController.getCategoryVariants);
// router.post('/createcategoryVariants', tokenVerification, inventoryController.createCategoryVariants);

//industry routes
router.post("/create-industry", inventoryController.createIndustry);
router.post("/create-user-industry", inventoryController.createUserIndustry);
router.get("/user-services/:id", inventoryController.getUserService);

//diffrent count condition for client
router.get(
  "/get-count-condition/:id",
  tokenVerification,
  inventoryController.getCountCondition
);

//diffrent count condition for Firm
router.get(
  "/get-count-condition-firm/:id",
  tokenVerification,
  inventoryController.getCountConditionFirm
);

module.exports = router;
