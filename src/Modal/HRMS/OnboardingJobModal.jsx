import React, { useEffect, useState } from "react";
import {Modal,ModalHeader,ModalBody,ModalFooter,Button,Form,FormGroup,Label,Input,} from "reactstrap";
import { toast } from "react-toastify";
import {createOnboardingJob,updateOnboardingJob,getDepartmentsByFirm,} from "../../apiServices/service";

function OnboardingJobModal({ isOpen, toggle, firmId, job, onSuccess }) {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.response;

  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [criteria, setCriteria] = useState("");
  const [experience, setExperience] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setJobTitle("");
    setDescription("");
    setCriteria("");
    setExperience("");
    setDepartmentId("");
  };

  const fetchDepartments = async () => {
    try {
      const res = await getDepartmentsByFirm(firmId, 1);
      setDepartments(res?.data?.data || []);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      if (!job) resetForm();
    }
  }, [isOpen, firmId]);

  useEffect(() => {
    if (job) {
      setJobTitle(job.jobTitle || "");
      setDescription(job.description || "");
      setCriteria(job.criteria || "");
      setExperience(job.experience || "");
      setDepartmentId(job.departmentId?._id || "");
    }
  }, [job]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

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
      createdBy: authUser?._id,
    };

    setIsSubmitting(true);

    try {
      const res = job
        ? await updateOnboardingJob(job._id, payload)
        : await createOnboardingJob(payload);

     if (res?.message) {
        toast.success(job ? "Job updated successfully" : "Job created successfully");

        toggle();       // ✅ CLOSE MODAL
        onSuccess();    // ✅ FETCH JOB LIST
        resetForm();
      } else {
        toast.error("Operation failed");
      }
    } catch (err) {
      toast.error(err?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} backdrop="static">
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
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </FormGroup>

          <Button color="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : job ? "Update" : "Create"}
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
