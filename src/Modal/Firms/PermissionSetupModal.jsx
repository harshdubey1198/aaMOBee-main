import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, } from "reactstrap";
import Select from "react-select";

export default function PermissionSetupModal({isOpen,toggle,operationType, permissions,user,onSubmit,}) {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected([]);
  }, [isOpen]);

  const options =
    operationType === "add"
      ? permissions
          ?.filter(p => !user?.permissionsHolding?.includes(p))
          ?.map(p => ({ label: p, value: p }))
      : (user?.permissionsHolding || []).map(p => ({
          label: p,
          value: p,
        }));

  const handleSave = () => {
    if (!selected.length) return;
    onSubmit(selected.map(s => s.value));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>
        {operationType === "add"
          ? `Assign Permissions — ${user?.email}`
          : `Remove Permissions — ${user?.email}`}
      </ModalHeader>

      <ModalBody>
        <Label>Select Permissions</Label>

        <Select
          isMulti
          value={selected}
          options={options}
          onChange={setSelected}
          placeholder="Select permissions..."
        />
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSave}>
          {operationType === "add" ? "Assign" : "Remove"}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
