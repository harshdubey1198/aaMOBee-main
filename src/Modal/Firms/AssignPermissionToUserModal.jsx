import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, } from "reactstrap";
import Select from "react-select";
import { getFirmUsersMain } from "../../apiServices/service";

export default function AssignPermissionToUserModal({ isOpen, toggle, firmId, permissions, onSubmit, }) {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  useEffect(() => {
    if (!isOpen || !firmId) return;

    const loadUsers = async () => {
      try {
        const res = await getFirmUsersMain(firmId);
        setUsers(res || []);
        console.log(res);
        
      } catch {
        setUsers([]);
      }
    };

    setSelectedUser(null);
    setSelectedPermissions([]);
    loadUsers();
  }, [isOpen, firmId]);

  const handleSave = () => {
    if (!selectedUser || selectedPermissions.length === 0) return;

    onSubmit({
      userId: selectedUser.value,
      permissions: selectedPermissions.map((p) => p.value),
    });
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>Assign Permissions To User</ModalHeader>

      <ModalBody>
        <Label>User</Label>
        <Select
          value={selectedUser}
          onChange={setSelectedUser}
          options={users.map((u) => ({
            label: `${u.firstName || ""} ${u.lastName || ""} (${u.email})`,
            value: u._id,
          }))}
          placeholder="Select user..."
        />

        <Label className="mt-3">Permissions</Label>
        <Select
          isMulti
          value={selectedPermissions}
          onChange={setSelectedPermissions}
          options={permissions.map((p) => ({ label: p, value: p }))}
          placeholder="Select permissions..."
        />
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>

        <Button color="primary" onClick={handleSave}>
          Assign
        </Button>
      </ModalFooter>
    </Modal>
  );
}
