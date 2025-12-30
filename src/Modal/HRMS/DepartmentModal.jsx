import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, } from "reactstrap";
import { createDepartment, getDepartmentsByFirm, updateDepartment, } from "../../apiServices/service";
import { toast } from "react-toastify";

function DepartmentModal({ isOpen, toggle, firmId, department, onSuccess }) {
  const authUser = JSON.parse(localStorage.getItem("authUser")).response;

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [parentDepartmentId, setParentDepartmentId] = useState("");
  const [parentDepartments, setParentDepartments] = useState([]);

  const blockIfDemo = () => {
    if (authUser?.isDemo) {
      toast.error("Demo accounts cannot modify departments");
      return true;
    }
    return false;
  };

  const fetchParentDepartments = async () => {
    try {
      const res = await getDepartmentsByFirm(firmId, 1);
      setParentDepartments(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load parent departments");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchParentDepartments();
    }
  }, [isOpen, firmId]);

  useEffect(() => {
    if (department) {
      setName(department.name);
      setCode(department.code);
      setParentDepartmentId(department.parentDepartmentId || "");
    } else {
      setName("");
      setCode("");
      setParentDepartmentId("");
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockIfDemo()) return;

    const payload = {
      firmId,
      name,
      code,
      ...(parentDepartmentId && { parentDepartmentId }),
    };

     try {
      let res;
      if (department) {
        res = await updateDepartment(department._id, payload);
      } else {
        res = await createDepartment(payload);
      }
      
      // Check if API call was successful
      if (res?.data?.success || res?.status === 200 || res?.status === 201) {
        toast.success(res?.data?.message || (department ? "Department updated successfully" : "Department created successfully"));
        toggle();
        onSuccess();
      } else {
        // API returned but with error
        const msg = res?.data?.message || res?.message || "Operation failed";
        toast.error(msg);
      }
   } catch (err) {
  const msg =
    err?.response?.data?.message ||
    err?.response?.message ||
    err?.response?.error ||
    "You do not have permission to perform this action";

  toast.error(msg);
}
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {department ? "Update Department" : "Create Department"}
      </ModalHeader>

      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Department Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Department Code</Label>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Parent Department (Optional)</Label>
            <Input
              type="select"
              value={parentDepartmentId}
              onChange={(e) => setParentDepartmentId(e.target.value)}
            >
              <option value="">— No Parent (Top Level) —</option>
              {parentDepartments
                .filter((d) => !department || d._id !== department._id)
                .map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
            </Input>
          </FormGroup>

          <Button color="primary" type="submit">
            {department ? "Update" : "Create"}
          </Button>
        </Form>
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default DepartmentModal;