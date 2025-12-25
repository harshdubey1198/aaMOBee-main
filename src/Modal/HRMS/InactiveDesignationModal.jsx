import React, { useEffect, useState } from "react";
import {Modal,ModalHeader,ModalBody,ModalFooter,Button,Table,
} from "reactstrap";
import { getInactiveDesignationsByDepartment, reactivateDesignation,
} from "../../apiServices/service";
import { toast } from "react-toastify";

function InactiveDesignationModal({isOpen,toggle,departmentId,onSuccess,
}) {
  const [designations, setDesignations] = useState([]);
  const [page] = useState(1);

  const fetchInactiveDesignations = async () => {
    try {
      const res = await getInactiveDesignationsByDepartment(
        departmentId,
        page
      );
      setDesignations(res?.data?.data || []);
    } catch (err) {
      toast.error("Failed to load inactive designations");
    }
  };

  useEffect(() => {
    if (isOpen && departmentId) fetchInactiveDesignations();
  }, [isOpen, departmentId]);

  const handleReactivate = async (id) => {
    try {
      await reactivateDesignation(id);
      toast.success("Designation reactivated");
      fetchInactiveDesignations();
      onSuccess();
    } catch (err) {
      toast.error("Failed to reactivate designation");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Inactive Designations</ModalHeader>

      <ModalBody>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {designations.length > 0 ? (
              designations.map((desg, index) => (
                <tr key={desg._id}>
                  <td>{index + 1}</td>
                  <td>{desg.title}</td>
                  <td>{desg.level}</td>
                  <td>
                    <Button
                      size="sm"
                      color="success"
                      onClick={() => handleReactivate(desg._id)}
                    >
                      Reactivate
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No inactive designations
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

export default InactiveDesignationModal;
