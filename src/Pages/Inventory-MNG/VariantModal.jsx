import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Button } from "reactstrap";
import { updateInventoryItemById } from "../../apiServices/service";

const VariantModal = ({ isOpen, toggleModal, variant, qtyType , handleVariantChange, addVariant ,ItemId, onVariantSaved }) => {
  // console.log(isOpen, "isopen")
  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>{variant.variationType ? "Edit Variant" : "Add Variant"}</ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label for="variationType">Variant Type</Label><span style={{ color: "red" }}>*</span>
          <Input type="text" id="variationType" name="variationType" value={variant.variationType} required onChange={handleVariantChange} />
        </FormGroup>
        <FormGroup>
          <Label for="optionLabel">Option Label<span style={{ color: "red" }}>*</span></Label>
          <Input type="text" id="optionLabel" name="optionLabel" value={variant.optionLabel} required onChange={handleVariantChange} />
        </FormGroup>
        <FormGroup>
          <Label for="price">Price Adjustment(Enter Net Difference)</Label><span style={{ color: "red" }}>*</span>
          <Input type="number" id="price" name="price" value={variant.price} onChange={handleVariantChange} />
        </FormGroup>
        <FormGroup>
          <Label for="stock">
            Stock / Quantity
            {qtyType === 'service' && (
              <span style={{ fontSize: "12px", color: "gray", marginLeft:"20px" }}>
                (By default, services have unlimited quantity. Change only if needed.)
              </span>
            )}
            {qtyType !== 'service' && <span style={{ color: "red" }}>*</span>}
          </Label>          
          {qtyType === 'service' ? (<>
            <Input
              type="number"
              id="stock"
              name="stock"
              min={1}
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange({
                  target: {
                    name: e.target.name,
                    value: Math.max(1, Number(e.target.value)) 
                  }
                })
              }
            />
            
            </>
          ) : (
            <>
              <Input
                type="number"
                id="stock"
                name="stock"
                min={1}
                // disabled={Number(variant.stock) === 100000}
                value={Number(variant.stock) === 100000 ? '' : variant.stock}
                onChange={handleVariantChange}
              />
            </>
          )}
        </FormGroup>

        {/* <FormGroup>
          <Label for="sku">SKU (Stock Keeping Unit)</Label>
          <Input type="text" id="sku" name="sku" value={variant.sku} onChange={handleVariantChange} />
        </FormGroup>
        <FormGroup>
          <Label for="barcode">Barcode </Label>
          <Input type="text" id="barcode" name="barcode" value={variant.barcode} onChange={handleVariantChange} />
        </FormGroup> */}
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={async () => {
            const finalStock = qtyType === 'service'
              ? Number(variant.stock || 1)
              : (Number(variant.stock) || 100000);

            if (ItemId) {
              await updateInventoryItemById(
                String(ItemId?._id || ItemId),
                { variants: [{ ...variant, price: Number(variant.price), stock: finalStock }] }
              );
              onVariantSaved && onVariantSaved();
              toggleModal();
            } else {
              handleVariantChange({ target: { name: 'stock', value: finalStock } });
              addVariant();
            }
          }}
        >
          {variant.variationType ? "Update Variant" : "Add Variant"}
        </Button>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default VariantModal;
