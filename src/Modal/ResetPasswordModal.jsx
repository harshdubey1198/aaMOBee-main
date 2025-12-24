import React, { useState, useEffect } from "react";
import {Modal,ModalHeader,ModalBody,ModalFooter,Button,Input,FormGroup,Label,} from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPasswordModal({ isOpen, toggle, user, config, fetchUsers, type = "auth" }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Clear inputs whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [isOpen]);

  // Save new password
const handleSave = async () => {
  if (!newPassword || !confirmPassword) {
    toast.error("Please fill out both password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("New password and confirm password do not match.");
    return;
  }

  try {
    const endpoint =
      type === "crm"
        ? `${process.env.REACT_APP_URL}/crmuser/admin-reset-crmpassword/${user._id}`
        : `${process.env.REACT_APP_URL}/auth/changePassword/${user._id}`;

    const response = await axios.put(endpoint, { newPassword }, config);

    // console.log("Password reset response:", response); // log full object

    // check inside response.data
    if (response?.message) {
      toast.success(response.message);

      fetchUsers();
      toggle();

      //clear only the input fields
      setNewPassword("");
      setConfirmPassword("");
    }
  } catch (error) {
    console.error("Error updating password", error);
    toast.error(error.response?.data?.message || "Error occurred while updating password.");
  }
};

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        Reset Password - {user?.firstName}
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </FormGroup>

        <FormGroup>
          <Label>Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSave}>
          Save
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ResetPasswordModal;
