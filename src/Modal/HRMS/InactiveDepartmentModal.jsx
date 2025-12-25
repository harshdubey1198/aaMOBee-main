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
              <th>#</th>
              <th>Name</th>
              <th>Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept, index) => (
                <tr key={dept._id}>
                  <td>{index + 1}</td>
                  <td>{dept.name}</td>
                  <td>{dept.code}</td>
                  <td>
                    <Button
                      size="sm"
                      color="success"
                      onClick={() => handleReactivate(dept._id)}
                    >
                      Reactivate
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
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
