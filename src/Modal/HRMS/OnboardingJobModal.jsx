import React, { useEffect, useState } from "react";
import { Modal, ModalHeader,ModalBody, ModalFooter, Button, Form, FormGroup,  Label, Input
} from "reactstrap";
import { toast } from "react-toastify";
import { createOnboardingJob, updateOnboardingJob, getDepartmentsByFirm } from "../../apiServices/service";

function OnboardingJobModal({ isOpen, toggle, firmId, job, onSuccess }) {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;

  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState("");
  const [experience, setExperience] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);

  const blockIfDemo = () => {
    if (authUser?.isDemo) {
      toast.error("Demo accounts cannot modify jobs");
      return true;
    }
    return false;
  };

  // fetch departments
  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentsByFirm(firmId, 1);
      setDepartments(res?.data?.data || []);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    if (isOpen) fetchDepartments();
  }, [isOpen, firmId]);

  useEffect(() => {
    if (job) {
      setJobTitle(job.jobTitle);
      setDescription(job.description || "");
      setCriteria(job.criteria || "");
      setExperience(job.experience || "");
      setDepartmentId(job.departmentId);
    } else {
      setJobTitle("");
      setDescription("");
      setCriteria("");
      setExperience("");
      setDepartmentId("");
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (blockIfDemo()) return;

    if (!departmentId) {
      toast.error("Department is required");
      return;
    }

    const payload = {
      jobTitle,
      jobSlug: jobTitle.toLowerCase().replace(/\s+/g, "-"),
      description,
      criteria,
      experience,
      departmentId,
      firmId,
      createdBy: authUser?._id
    };

    try {
      let res;
      if (job) {
        res = await updateOnboardingJob(job._id, payload);
      } else {
        res = await createOnboardingJob(payload);
      }

      if (res?.status === 200 || res?.status === 201 || res?.success) {
        toast.success(job ? "Job updated successfully" : "Job created successfully");
        toggle();
        onSuccess();
      } else {
        toast.error(res?.message || "Operation failed");
      }
    } catch (err) {
  toast.error(
       err?.response?.data?.error ||
       err?.error ||
       err?.message ||
       "Failed to deactivate job"
     );
}

  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {job ? "Update Job" : "Create Job"}
      </ModalHeader>

      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Job Title</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Department</Label>
            <Input
              type="select"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name}
                </option>
              ))}
            </Input>
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <Input
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Criteria</Label>
            <Input
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Experience</Label>
            <Input
              placeholder="e.g. 1-2 years"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </FormGroup>

          <Button color="primary" type="submit">
            {job ? "Update" : "Create"}
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

export default OnboardingJobModal;
