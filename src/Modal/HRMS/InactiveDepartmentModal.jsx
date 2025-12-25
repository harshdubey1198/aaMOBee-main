import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Table, } from "reactstrap";
import {getInactiveDepartmentsByFirm,reactivateDepartment,} from "../../apiServices/service";
import { toast } from "react-toastify";

function InactiveDepartmentModal({ isOpen, toggle, firmId, onSuccess }) {
  const [departments, setDepartments] = useState([]);
  const [page] = useState(1);

  const fetchInactiveDepartments = async () => {
    try {
      const res = await getInactiveDepartmentsByFirm(firmId, page);
      setDepartments(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load inactive departments");
    }
  };

  useEffect(() => {
    if (isOpen) fetchInactiveDepartments();
  }, [isOpen]);

  const handleReactivate = async (id) => {
    try {
      await reactivateDepartment(id);
      toast.success("Department reactivated");
      fetchInactiveDepartments();
      onSuccess();
    } catch (err) {
      toast.error("Failed to reactivate department");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Inactive Departments</ModalHeader>
      <ModalBody>
        <Table bordered responsive>
          <thead>
            <tr>
                <th>Name</th>
                <th>Sub-department</th>
                <th>Code</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>

          <tbody>
            {departments.length > 0 ? (
                departments.map((parent) =>
                parent.children?.map((child, idx) => (
                    <tr key={child._id}>
                    <td>{parent.name}</td>
                    <td>{child.name}</td>
                    <td>{child.code}</td>
                    <td>{child.status}</td>
                    <td>
                        {child.status === "inactive" && (
                        <Button
                            size="sm"
                            color="success"
                            onClick={() => handleReactivate(child._id)}
                        >
                            Reactivate
                        </Button>
                        )}
                    </td>
                    </tr>
                ))
                )
            ) : (
                <tr>
                <td colSpan="5" className="text-center">
                    No inactive departments
                </td>
                </tr>
            )}
            </tbody>

        </Table>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default InactiveDepartmentModal;
