import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input} from "reactstrap";
import { createFirmPolicy, updateFirmPolicy } from "../../apiServices/service";
import { toast } from "react-toastify";

function FirmPolicyModal({ isOpen, toggle, firmId, policy, onSuccess }) {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;

  const [policyName, setPolicyName] = useState("");
  const [hraPercentage, setHraPercentage] = useState("");
  const [basicPercentage, setBasicPercentage] = useState("");

  // ✅ NEW: Allowances state
  const [allowances, setAllowances] = useState([{ name: "", percent: "" }]);

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
      setHraPercentage(policy.hraPercent);
      setBasicPercentage(policy.basicPercent);
      setAllowances(
        policy.allowances?.length
          ? policy.allowances
          : [{ name: "", percent: "" }]
      );
    } else {
      setPolicyName("");
      setHraPercentage("");
      setBasicPercentage("");
      setAllowances([{ name: "", percent: "" }]);
    }
  }, [policy]);

  // ✅ Allowance handlers
  const handleAllowanceChange = (index, field, value) => {
    const updated = [...allowances];
    updated[index][field] = value;
    setAllowances(updated);
  };

  const addAllowance = () => {
    setAllowances([...allowances, { name: "", percent: "" }]);
  };

  const removeAllowance = (index) => {
    setAllowances(allowances.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockIfDemo()) return;

    const payload = {
      firmId,
      policyName,
      basicPercent: Number(basicPercentage),
      hraPercent: Number(hraPercentage),
      allowances: allowances.map((a) => ({
        name: a.name,
        percent: Number(a.percent)
      }))
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
        err?.response?.data?.message ||
          err?.message ||
          "You do not have permission to perform this action"
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

          {/* ✅ Allowances UI */}
          <FormGroup>
            <Label>Allowances</Label>

            {allowances.map((item, index) => (
              <div key={index} className="d-flex gap-2 mb-2">
                <Input
                  type="text"
                  placeholder="Allowance Name"
                  value={item.name}
                  onChange={(e) =>
                    handleAllowanceChange(index, "name", e.target.value)
                  }
                  required
                />

                <Input
                  type="number"
                  placeholder="%"
                  value={item.percent}
                  onChange={(e) =>
                    handleAllowanceChange(index, "percent", e.target.value)
                  }
                  required
                />

                {allowances.length > 1 && (
                  <Button
                    color="danger"
                    type="button"
                    onClick={() => removeAllowance(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}

            <Button color="secondary" type="button" onClick={addAllowance}>
              + Add Allowance
            </Button>
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
