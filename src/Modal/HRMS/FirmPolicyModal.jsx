import React, { useEffect, useState } from "react";
import {Modal,ModalHeader,ModalBody, ModalFooter, Button, Form,FormGroup,Label,Input} from "reactstrap";
import {createFirmPolicy, updateFirmPolicy} from "../../apiServices/service";
import { toast } from "react-toastify";

function FirmPolicyModal({ isOpen, toggle, firmId, policy, onSuccess }) {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;

  const [policyName, setPolicyName] = useState("");
  const [hraPercentage, setHraPercentage] = useState("");
  const [basicPercentage, setBasicPercentage] = useState("");

  const blockIfDemo = () => {
    if (authUser?.isDemo) {
      toast.error("Demo accounts cannot modify policies");
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (policy) {
      setPolicyName(policy.policyName);
      setHraPercentage(policy.hraPercentage);
      setBasicPercentage(policy.basicPercentage);
    } else {
      setPolicyName("");
      setHraPercentage("");
      setBasicPercentage("");
    }
  }, [policy]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockIfDemo()) return;

    const payload = {
      firmId,
      policyName,
      hraPercentage,
      basicPercentage
    };

    try {
      if (policy) {
        await updateFirmPolicy(policy._id, payload);
        toast.success("Policy updated successfully");
      } else {
        await createFirmPolicy(payload);
        toast.success("Policy created successfully");
      }
      toggle();
      onSuccess();
    } catch (err) {
      toast.error(
        err?.message || "You do not have permission to perform this action"
      );
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {policy ? "Update Firm Policy" : "Create Firm Policy"}
      </ModalHeader>

      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Policy Name</Label>
            <Input
              type="text"
              value={policyName}
              onChange={(e) => setPolicyName(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>HRA Percentage</Label>
            <Input
              type="number"
              value={hraPercentage}
              onChange={(e) => setHraPercentage(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Basic Percentage</Label>
            <Input
              type="number"
              value={basicPercentage}
              onChange={(e) => setBasicPercentage(e.target.value)}
              required
            />
          </FormGroup>

          <Button color="primary" type="submit">
            {policy ? "Update" : "Create"}
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

export default FirmPolicyModal;
