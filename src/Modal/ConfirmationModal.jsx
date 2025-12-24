import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

const ConfirmationModal = ({
  isOpen,
  toggle,
  selectedUser,   // can be a user OR an item
  toPascalCase,
  onConfirm,
  action = "delete", // "delete" | "activate"
  itemName = ""      // for inventory items
}) => {
  let actionText = "";
  let btnColor = "danger";

  if (action === "delete") {
    actionText = "Delete";
    btnColor = "danger";
  } else if (action === "activate") {
    actionText = selectedUser?.isActive ? "Deactivate" : "Activate";
    btnColor = selectedUser?.isActive ? "danger" : "success";
  }

  const displayName =
    selectedUser
      ? toPascalCase
        ? toPascalCase(`${selectedUser?.firstName || ""} ${selectedUser?.lastName || ""}`)
        : selectedUser?.name || ""
      : itemName;

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Confirm {actionText}</ModalHeader>
      <ModalBody>
        Are you sure you want to {actionText.toLowerCase()}{" "}
        <strong>{displayName || "this item"}</strong>?
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color={btnColor} onClick={() => onConfirm(selectedUser)}>
          {actionText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmationModal;
