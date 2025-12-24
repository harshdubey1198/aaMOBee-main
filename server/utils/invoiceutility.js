const { default: mongoose } = require("mongoose");
const Customer = require("../schemas/cutomer.schema");
const InventoryItem = require("../schemas/inventoryItem.schema");
const Invoice = require("../schemas/invoice.schema");
const Tax = require("../schemas/tax.schema");

const generateInvoiceNumber = async (firmId, session) => {
  const currentDate = new Date();
  const day = String(currentDate.getDate()).padStart(2, "0");
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const year = String(currentDate.getFullYear()).slice(-2);

  const lastInvoice = await Invoice.findOne({ firmId })
    .sort({ createdAt: -1 })
    .session(session);

  if (lastInvoice) {
    const lastInvoiceParts = lastInvoice.invoiceNumber.split("-");
    const lastInvoiceIncrement = parseInt(lastInvoiceParts[4], 10);
    return `INV-${day}-${month}-${year}-${lastInvoiceIncrement + 1}`;
  } else {
    return `INV-${day}-${month}-${year}-1`;
  }
};

const handleCustomer = async (customer, firmId, createdBy, session) => {
  let existingCustomer = await Customer.findOne({
    email: customer.email,
    firmId,
  }).session(session);

  if (existingCustomer) {
    // Update existing customer if needed
    existingCustomer.firstName = customer.firstName;
    existingCustomer.lastName = customer.lastName;
    existingCustomer.mobile = customer.mobile;
    existingCustomer.address = customer.address;
    const updatedCustomer = await existingCustomer.save({ session });
    
    return {
      customerName: `${updatedCustomer.firstName} ${updatedCustomer.lastName}`,
      customerEmail: updatedCustomer.email,
      customerPhone: updatedCustomer.mobile,
      customerAddress: updatedCustomer.address,
      firmId: updatedCustomer.firmId,
    };
  }

  // Create new customer if doesn't exist
  const newCustomer = new Customer({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    mobile: customer.mobile,
    address: customer.address,
    firmId,
    createdBy,
  });

  const savedCustomer = await newCustomer.save({ session });

  return {
    customerName: `${savedCustomer.firstName} ${savedCustomer.lastName}`,
    customerEmail: savedCustomer.email,
    customerPhone: savedCustomer.mobile,
    customerAddress: savedCustomer.address,
    firmId: savedCustomer.firmId,
  };
};

// const calculateInvoiceAmount = async (items, session) => {
//   let totalAmount = 0;

//   for (let item of items) {
//     const inventoryItem = await InventoryItem.findById(item.itemId).session(session);
//     if (!inventoryItem) {
//       throw new Error(`Item with ID ${item.itemId} not found in inventory`);
//     }

//     let unitPrice = 0;

//     if (
//       item.selectedVariant &&
//       item.selectedVariant.length > 0 &&
//       item.selectedVariant[0].price
//     ) {
//       unitPrice = Number(item.selectedVariant[0].price); 
//     } else {
//       unitPrice = Number(item.sellingPrice || 0);
//     }

//     const quantity = Number(item.quantity || 1);
//     const baseTotal = unitPrice * quantity;

//     const totalTaxForItem = await calculateTotalTax(inventoryItem, baseTotal, session);
//     const taxedTotal = baseTotal + totalTaxForItem;

//     const discount = Number(item.discount || 0);
//     const finalItemTotal = Math.max(taxedTotal - discount, 0);

//     item.total = parseFloat(finalItemTotal.toFixed(2));
//     totalAmount += finalItemTotal;
//   }

//   return parseFloat(totalAmount.toFixed(2));
// };
const calculateInvoiceAmount = async (items, session) => {
  let totalAmount = 0;

  for (let item of items) {
    if (!item.itemId) {
      throw new Error('Item ID is required for all items');
    }

    const inventoryItem = await InventoryItem.findById(item.itemId).session(session);
    if (!inventoryItem) {
      throw new Error(`Item with ID ${item.itemId} not found in inventory`);
    }

    let unitPrice = Number(item.sellingPrice || 0);

    // Add variant price if variant is selected
    if (item.selectedVariant && item.selectedVariant.length > 0 && item.selectedVariant[0].price) {
      unitPrice += Number(item.selectedVariant[0].price);
    }

    const quantity = Number(item.quantity || 1);
    if (quantity <= 0) {
      throw new Error(`Quantity must be greater than 0 for item ${inventoryItem.name || item.itemId}`);
    }

    const baseTotal = unitPrice * quantity;

    const totalTaxForItem = await calculateTotalTax(inventoryItem, baseTotal, session);
    const taxedTotal = baseTotal + totalTaxForItem;

    const discount = Number(item.discount || 0);
    const finalItemTotal = Math.max(taxedTotal - discount, 0);

    item.total = parseFloat(finalItemTotal.toFixed(2));
    totalAmount += finalItemTotal;
  }

  return parseFloat(totalAmount.toFixed(2));
};


const calculateTotalTax = async (inventoryItem, itemTotal, session) => {
  if (!inventoryItem.tax || !inventoryItem.tax.taxId) {
    return 0; // No tax applied
  }

  const tax = await Tax.findById(inventoryItem.tax.taxId).session(session);
  if (!tax) {
    console.warn(`Tax with ID ${inventoryItem.tax.taxId} not found, skipping tax calculation`);
    return 0;
  }

  let totalTaxForItem = 0;
  
  if (inventoryItem.tax.selectedTaxTypes && inventoryItem.tax.selectedTaxTypes.length > 0) {
    inventoryItem.tax.selectedTaxTypes.forEach((selectedComponent) => {
      const taxComponent = tax.taxRates.find((tc) =>
        tc._id.equals(selectedComponent)
      );

      if (!taxComponent) {
        console.warn(`Selected tax component ${selectedComponent} not found in tax object, skipping`);
        return;
      }
      const taxAmount = (itemTotal * taxComponent.rate) / 100;
      totalTaxForItem += taxAmount;
    });
  }
  
  return totalTaxForItem;
};

// update stock function
const updateInventoryStock = async (items, isProforma, session) => {
  for (let item of items) {
    const inventoryItem = await InventoryItem.findById(item.itemId).session(
      session
    );
    if (!inventoryItem) {
      throw new Error(`Item with ID ${item.itemId} not found in inventory`);
    }

    if (inventoryItem.variants && inventoryItem.variants.length > 0) {
      item.selectedVariant.forEach((variant) => {
        const inventoryVariant = inventoryItem.variants.find(
          (v) => v.sku === variant.sku
        );
        if (inventoryVariant) {
          const availableStock =
            inventoryVariant.stock - inventoryVariant.reservedQuantity;
          if (isProforma) {
            if (availableStock < item.quantity) {
              throw new Error(
                `Insufficient stock to reserve for variant: ${variant.optionLabel}. Available: ${availableStock}, Requested: ${item.quantity}`
              );
            }
            inventoryVariant.reservedQuantity += item.quantity;
          } else {
            if (inventoryVariant.stock < item.quantity) {
              throw new Error(
                `Insufficient stock for variant: ${variant.optionLabel}. Available: ${inventoryVariant.stock}, Requested: ${item.quantity}`
              );
            }
            inventoryVariant.stock -= item.quantity;
            inventoryVariant.reservedQuantity -= Math.min(
              inventoryVariant.reservedQuantity,
              item.quantity
            );
          }
        } else {
          throw new Error(
            `Variant with SKU ${variant.sku} not found for item: ${inventoryItem.name}`
          );
        }
      });

      inventoryItem.quantity = inventoryItem.variants.reduce(
        (sum, v) => sum + v.stock,
        0
      );
    } else {
      const availableStock = inventoryItem.quantity;
      if (isProforma) {
        if (availableStock < item.quantity) {
          throw new Error(
            `Insufficient stock to reserve for item: ${inventoryItem.name}. Available: ${availableStock}, Requested: ${item.quantity}`
          );
        }
        inventoryItem.quantity -= item.quantity;
      } else {
        if (inventoryItem.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for item: ${inventoryItem.name}. Available: ${inventoryItem.quantity}, Requested: ${item.quantity}`
          );
        }
        inventoryItem.quantity -= item.quantity;
      }
    }

    await inventoryItem.save({ session });
  }
};

// ReleasedReservedStock
const releaseReservedStock = async (items, session) => {
  try {
    const itemIds = items.map((item) => item.itemId);

    const inventoryItems = await InventoryItem.find({
      _id: { $in: itemIds },
    }).session(session);
    if (inventoryItems.length === 0) {
      throw new Error("No matching inventory items found");
    }
    for (let item of items) {
      const inventoryItem = inventoryItems.find(
        (inv) => inv._id.toString() === item.itemId.toString()
      );
      if (!inventoryItem) {
        throw new Error(`Item with ID ${item.itemId} not found in inventory`);
      }
      if (inventoryItem.variants && inventoryItem.variants.length > 0) {
        if (!item.selectedVariant || item.selectedVariant.length === 0) {
          throw new Error(
            `Missing selected variants for item ${inventoryItem.name}`
          );
        }
        for (let variant of item.selectedVariant) {
          const inventoryVariant = inventoryItem.variants.find(
            (v) => v.sku === variant.sku
          );
          if (!inventoryVariant) {
            throw new Error(
              `Variant with SKU ${variant.sku} not found for item: ${inventoryItem.name}`
            );
          }
          if (inventoryVariant.reservedQuantity < item.quantity) {
            throw new Error(
              `Cannot release more than reserved quantity for variant: ${variant.optionLabel}`
            );
          }
          inventoryVariant.stock += item.quantity;
          inventoryVariant.reservedQuantity -= item.quantity;
        }
        inventoryItem.quantity = inventoryItem.variants.reduce(
          (sum, v) => sum + v.stock,
          0
        );
      } else {
        inventoryItem.quantity += item.quantity;
      }

      // Save the updated inventory item
      await inventoryItem.save({ session });
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateInvoiceNumber,
  handleCustomer,
  calculateInvoiceAmount,
  calculateTotalTax,
  updateInventoryStock,
  releaseReservedStock,
};
