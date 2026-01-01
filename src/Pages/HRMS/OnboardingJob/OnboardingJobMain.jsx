import React, { useEffect, useState } from "react";
import { Button, Table, Card, CardBody, Row, Col, Spinner, Input, InputGroup, InputGroupText,
} from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import FirmSwitcher from "../../Firms/FirmSwitcher";
import { toast } from "react-toastify";
import { deleteOnboardingJob, getJobsByFirm, searchOnboardingJobs,} from "../../../apiServices/service";
import OnboardingJobModal from "../../../Modal/HRMS/OnboardingJobModal";

function OnboardingJobMain() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.response?.role;

  const firmId =
    authUser?.response?.firmId || authUser?.response?.adminId;

  const [selectedFirmId, setSelectedFirmId] = useState(null);
  const idToUse = role === "client_admin" ? selectedFirmId : firmId;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const toggleJobModal = () => {
    setIsJobModalOpen(!isJobModalOpen);
    if (isJobModalOpen) setSelectedJob(null);
  };

  const fetchJobs = async () => {
    if (!idToUse) return;
    try {
      setLoading(true);
      const res = await getJobsByFirm(idToUse);
      setJobs(res?.data?.data || []);
    } catch {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    const trimmed = search.trim();

    if (trimmed.length > 0 && trimmed.length < 3) {
      toast.info("Please enter at least 3 characters");
      return;
    }

    if (!trimmed) {
      fetchJobs();
      return;
    }

    try {
      setLoading(true);
      const res = await searchOnboardingJobs({
        firmId: idToUse,
        search: trimmed,
      });
      setJobs(res?.data?.data || []);
    } catch {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setSelectedJob(job);
    setIsJobModalOpen(true);
  };

  const handleDelete = async (job) => {
    try {
      await deleteOnboardingJob({
        jobId: job._id,
        userId: authUser?.response?._id,
      });
      toast.success("Job deactivated");
      fetchJobs();
    } catch {
      toast.error("Failed to deactivate job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [idToUse]);

  return (
    <div className="page-content">
      <Breadcrumbs title="HRMS" breadcrumbItem="Onboarding Jobs" />

      <Row className="mb-3">
        <Col md="8" className="d-flex gap-2 align-items-center">
          <Button color="primary" className="justified-button" onClick={toggleJobModal}>
            + Add Job
          </Button>

          {role === "client_admin" && (
            <FirmSwitcher
              selectedFirmId={selectedFirmId}
              onSelectFirm={setSelectedFirmId}
            />
          )}
        </Col>

        <Col md="4">
          <InputGroup>
            <Input
              placeholder="Search job..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <InputGroupText onClick={handleSearch} style={{ cursor: "pointer" }}>
              🔍
            </InputGroupText>
          </InputGroup>
        </Col>
      </Row>

      <Card>
        <CardBody>
          {loading ? (
            <div className="text-center py-5">
              <Spinner />
            </div>
          ) : (
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.length ? (
                  jobs.map((job, i) => (
                    <tr key={job._id}>
                      <td>{i + 1}</td>
                      <td>{job.jobTitle}</td>
                      <td>{job.departmentId?.name || "—"}</td>
                      <td>{job.experience}</td>
                      <td>{job.status}</td>
                      <td className="d-flex gap-2">
                        <Button
                          size="sm"
                          color="info"
                          onClick={() => handleEdit(job)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(job)}
                        >
                          Deactivate
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No jobs found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      {isJobModalOpen && (
        <OnboardingJobModal
          isOpen={isJobModalOpen}
          toggle={toggleJobModal}
          firmId={idToUse}
          job={selectedJob}
          onSuccess={fetchJobs}  
        />
      )}
    </div>
  );
}

export default OnboardingJobMain;
