import React, { useEffect, useState } from "react";
import {Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label,Input,
} from "reactstrap";
import {createDesignation,updateDesignation,getDesignationsByDepartment,} from "../../apiServices/service";
import { toast } from "react-toastify";

function DesignationModal({isOpen,toggle, firmId, departmentId, designation, onSuccess,
}) {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;

  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("");

  const blockIfDemo = () => {
    if (authUser?.isDemo) {
      toast.error("Demo accounts cannot modify designations");
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (designation) {
      setTitle(designation.title);
      setLevel(designation.level);
    } else {
      setTitle("");
      setLevel("");
    }
  }, [designation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockIfDemo()) return;

    const payload = {
      firmId,
      departmentId,
      title,
      level,
    };

    try {
      if (designation) {
        await updateDesignation(designation._id, payload);
        toast.success("Designation updated");
      } else {
        await createDesignation(payload);
        toast.success("Designation created");
      }
      toggle();
      onSuccess();
    } catch (err) {
      toast.error("Failed to save designation");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {designation ? "Update Designation" : "Create Designation"}
      </ModalHeader>

      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Designation Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Level</Label>
            <Input
              type="select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              required
            >
              <option value="">— Select Level —</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid</option>
              <option value="senior">Senior</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
            </Input>
          </FormGroup>

          <Button color="primary" type="submit">
            {designation ? "Update" : "Create"}
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

export default DesignationModal;
