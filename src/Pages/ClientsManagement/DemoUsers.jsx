import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {  Table,  Button,  Spinner,  Input,  Modal,  ModalHeader,  ModalBody,  ModalFooter,  Row,  Col,  FormGroup,  Label, Card, CardBody, Badge} from "reactstrap";
import { format, isValid, differenceInDays, differenceInHours } from "date-fns";
import { getDemoUserList, updateDemoUserExpiry } from "../../apiServices/service";
import DemoUserLogsModal from "../../Modal/ClientManagement/DemoUserLogsModal";


const DemoUsers = () => {
  const [demoUsers, setDemoUsers] = useState([]);
  const [allDemoUsers, setAllDemoUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  console.log("filters for modal",filter)
  // modals
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [expiryModalOpen, setExpiryModalOpen] = useState(false);
  const [logsModalOpen, setLogsModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [logsUserId, setLogsUserId] = useState(null);

  const [operation, setOperation] = useState("increase");
  const [time, setTime] = useState({ seconds: "", minutes: "", hours: "", days: "", months: "" });
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilterModalOpen, setStatusFilterModalOpen] = useState(false);

  const filteredDemoUsers = demoUsers.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(term) ||
      (user.lastName && user.lastName.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.mobileSecondary && `${user.mobileSecondary.countryCode}${user.mobileSecondary.number}`.includes(term))
    );
  });

  const fetchDemoUsers = async (requestedPage = page, requestedLimit = limit, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const payload = { page: requestedPage, limit: requestedLimit };
      const response = await getDemoUserList(payload);

      setDemoUsers(response.data.demoUsers || []);
      setAllDemoUsers(response.data.demoUsers || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(requestedPage);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDemoUsers();
  }, []);

  const handleLimitChange = (e) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    fetchDemoUsers(1, newLimit);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    fetchDemoUsers(newPage, limit);
  };

  const formatDateSafe = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "dd MMM yy HH:mm") : "Invalid Date";
  };

  const timeLeftSafe = (dateString) => {
    if (!dateString) return { text: "N/A", variant: "secondary" };
    const now = new Date();
    const expiry = new Date(dateString);
    if (!isValid(expiry)) return { text: "N/A", variant: "secondary" };

    const days = differenceInDays(expiry, now);
    const hours = differenceInHours(expiry, now);

    if (days < 0 || hours < 0) {
      if (selectedUser) selectedUser.isActive = false; 
      return { text: "Expired", variant: "danger" };
    }
   else if (days >= 1) {
      const variant = days > 7 ? "success" : days > 3 ? "warning" : "danger";
      return { text: `${days} day${days > 1 ? "s" : ""}`, variant };
    } else {
      const variant = hours > 12 ? "warning" : "danger";
      return { text: `${hours} hour${hours !== 1 ? "s" : ""}`, variant };
    }
  };

  // when clicking row
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setActionModalOpen(true);
  };

  const openLogsModal = (userId) => {
    setLogsUserId(userId);
    setLogsModalOpen(true);
    setActionModalOpen(false);
  };

  const openExpiryModal = () => {
    setOperation("increase");
    setTime({ seconds: "", minutes: "", hours: "", days: "", months: "" });
    setExpiryModalOpen(true);
    setActionModalOpen(false);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setTime((prev) => ({ ...prev, [name]: value }));
  };

  const handleExpiryUpdate = async () => {
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const payload = {
        userId: selectedUser._id,
        operation,
        time: {
          months: parseInt(time.months) || 0,
          days: parseInt(time.days) || 0,
          hours: parseInt(time.hours) || 0,
          minutes: parseInt(time.minutes) || 0,
          seconds: parseInt(time.seconds) || 0
        }
      };
      await updateDemoUserExpiry(payload);
      setExpiryModalOpen(false);
      fetchDemoUsers(page, limit);
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="page-content">
        <div className="loading-container">
          <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading demo users...</p>
        </div>
      </div>
    );

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Demo Users" />

        <Card className="demo-users-card shadow-sm">
          <CardBody>
            {/* Header Section */}
            <div className="d-flex justify-content-between mb-4 align-items-center flex-wrap gap-3">
              {/* <div>
                <h5 className="card-title mb-1">Demo Users Management</h5>
                <p className="text-muted mb-0 small">
                  <i className="mdi mdi-information-outline me-1"></i>
                  Manage and monitor demo user accounts and expiration times
                </p>
              </div> */}
              <div className="d-flex align-items-center gap-2 flex-wrap">
                <Input
                  type="text"
                  placeholder="Search by name, email, or mobile"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control form-control-sm"
                  style={{ width: "250px" }}
                />
                <Button 
                  color="success" 
                  size="sm" 
                  className="btn-rounded d-flex align-items-center"
                  onClick={() => setStatusFilterModalOpen(true)}
                >
                  <i className="mdi mdi-filter-outline me-1"></i> Filter
                </Button>
                <div className="d-flex align-items-center">
                  <Label className="mb-0 me-2 small text-muted">Rows:</Label>
                  <Input 
                    type="select" 
                    value={limit} 
                    onChange={handleLimitChange} 
                    className="form-select-sm"
                    style={{ width: "70px" }}
                  >
                    {[5, 10, 20, 50].map((val) => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </Input>
                </div>
                <Button 
                  color="primary" 
                  size="sm"
                  className="btn-rounded d-flex align-items-center"
                  onClick={() => fetchDemoUsers(page, limit, true)} 
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <>
                      <Spinner size="sm" className="me-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-refresh me-1"></i>
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Table Section */}
            <div className="table-responsive">
              <Table className="table-hover table-nowrap align-middle mb-0 demo-users-table">
                <thead className="table-light">
                  <tr>
                    <th>
                      <i className="mdi mdi-account-outline me-1"></i>
                      Name
                    </th>
                    <th>
                      <i className="mdi mdi-email-outline me-1"></i>
                      Email
                    </th>
                    <th>
                      <i className="mdi mdi-phone-outline me-1"></i>
                      Mobile
                    </th>
                    {/* <th>
                      <i className="mdi mdi-toggle-switch-outline me-1"></i>
                      Status
                    </th> */}
                    <th>
                      <i className="mdi mdi-calendar-clock me-1"></i>
                      Expires At
                    </th>
                    <th>
                      <i className="mdi mdi-timer-sand me-1"></i>
                      Time Left
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDemoUsers.length > 0 ? filteredDemoUsers.map((user) => {

                    const timeLeft = timeLeftSafe(user.expiresAt);
                    return (
                      <tr 
                        key={user._id} 
                        className="table-row-hover"
                        onClick={() => handleRowClick(user)}
                      >
                        <td>
                          <div className="d-flex align-items-center">
                            {/* <div className="avatar-xs me-2">
                              <span className="avatar-title rounded-circle bg-soft-primary text-primary">
                                {user.firstName.charAt(0).toUpperCase()}
                              </span>
                            </div> */}
                            <span className="fw-medium">{user.firstName + " " + (user.lastName || "")}</span>
                          </div>
                        </td>
                        <td className="text-muted">{user.email || "N/A"}</td>
                        <td className="text-muted">
                          {user.mobileSecondary ? `${user.mobileSecondary.countryCode} ${user.mobileSecondary.number}` : "N/A"}
                        </td>
                        {/* <td>
                          <Badge 
                            color={user.isActive ? "success" : "danger"} 
                            className="badge-soft-success font-size-12"
                            pill
                          >
                            {user.isActive ? (
                              <>
                                <i className="mdi mdi-check-circle me-1"></i>
                                Active
                              </>
                            ) : (
                              <>
                                <i className="mdi mdi-close-circle me-1"></i>
                                Inactive
                              </>
                            )}
                          </Badge>
                        </td> */}
                        <td>
                          <span className="text-muted small">{formatDateSafe(user.expiresAt)}</span>
                        </td>
                        <td>
                          <Badge 
                            color={timeLeft.variant} 
                            className={`badge-soft-${timeLeft.variant} font-size-11`}
                            pill
                          >
                            {timeLeft.text}
                          </Badge>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="text-center py-5">
                        <div className="empty-state">
                          <i className="mdi mdi-account-off-outline text-muted" style={{ fontSize: '3rem' }}></i>
                          <p className="text-muted mt-2 mb-0">No demo users found</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="d-flex align-items-center justify-content-between mt-4 flex-wrap gap-2">
              <p className="text-muted mb-0 small">
                Showing page {page} of {totalPages}
              </p>
              <div className="d-flex gap-2">
                <Button 
                  color="light" 
                  size="sm"
                  className="btn-rounded"
                  onClick={() => handlePageChange(page - 1)} 
                  disabled={page <= 1}
                >
                  <i className="mdi mdi-chevron-left"></i>
                  Previous
                </Button>
                <Button 
                  color="light" 
                  size="sm"
                  className="btn-rounded"
                  onClick={() => handlePageChange(page + 1)} 
                  disabled={page >= totalPages}
                >
                  Next
                  <i className="mdi mdi-chevron-right"></i>
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Action Modal */}
        <Modal 
          isOpen={actionModalOpen} 
          toggle={() => setActionModalOpen(!actionModalOpen)} 
          centered
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setActionModalOpen(!actionModalOpen)} className="border-bottom">
            <i className="mdi mdi-account-cog me-2 text-primary"></i>
            Actions for {selectedUser?.firstName}
          </ModalHeader>
          <ModalBody className="text-center py-4">
            <div className="d-flex gap-2">
              <Button 
                color="primary" 
                className="btn-rounded d-flex align-items-center justify-content-center"
                onClick={openExpiryModal}
              >
                <i className="mdi mdi-clock-edit-outline me-2"></i>
                Update Expiry Time
              </Button>
              <Button 
                color="success" 
                className="btn-rounded d-flex align-items-center justify-content-center"
                onClick={() => openLogsModal(selectedUser._id)}
              >
                <i className="mdi mdi-text-box-search-outline me-2"></i>
                View Activity Logs
              </Button>
            </div>
          </ModalBody>
        </Modal>

        {/* Expiry Update Modal */}
        <Modal 
          isOpen={expiryModalOpen} 
          toggle={() => setExpiryModalOpen(!expiryModalOpen)}
          size="lg"
          className="modal-dialog-centered"
        >
          <ModalHeader toggle={() => setExpiryModalOpen(!expiryModalOpen)} className="border-bottom">
            <i className="mdi mdi-calendar-clock me-2 text-primary"></i>
            Update Expiry Time
          </ModalHeader>
          <ModalBody className="p-4">
            <FormGroup className="mb-4">
              <Label className="form-label fw-medium">
                <i className="mdi mdi-cog-outline me-2"></i>
                Operation Type
              </Label>
              <Input 
                type="select" 
                value={operation} 
                onChange={(e) => setOperation(e.target.value)}
                className="form-select"
              >
                <option value="increase">
                  <i className="mdi mdi-plus"></i> Increase (Extend Time)
                </option>
                <option value="decrease">
                  <i className="mdi mdi-minus"></i> Decrease (Reduce Time)
                </option>
              </Input>
            </FormGroup>

            <div className="time-inputs-section">
              <Label className="form-label fw-medium mb-3">
                <i className="mdi mdi-timer-outline me-2"></i>
                Time Duration
              </Label>
              
              <Row className="g-3 mb-3">
                <Col md={6}>
                  <FormGroup>
                    <Label className="small text-muted">Months</Label>
                    <Input 
                      type="number" 
                      name="months" 
                      placeholder="0" 
                      min={0} 
                      value={time.months} 
                      onChange={handleTimeChange}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label className="small text-muted">Days</Label>
                    <Input 
                      type="number" 
                      name="days" 
                      placeholder="0" 
                      min={0} 
                      value={time.days} 
                      onChange={handleTimeChange}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row className="g-3">
                <Col md={4}>
                  <FormGroup>
                    <Label className="small text-muted">Hours</Label>
                    <Input 
                      type="number" 
                      name="hours" 
                      placeholder="0" 
                      min={0} 
                      value={time.hours} 
                      onChange={handleTimeChange}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label className="small text-muted">Minutes</Label>
                    <Input 
                      type="number" 
                      name="minutes" 
                      placeholder="0" 
                      min={0} 
                      value={time.minutes} 
                      onChange={handleTimeChange}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label className="small text-muted">Seconds</Label>
                    <Input 
                      type="number" 
                      name="seconds" 
                      placeholder="0" 
                      min={0} 
                      value={time.seconds} 
                      onChange={handleTimeChange}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter className="border-top">
            <Button 
              color="secondary" 
              className="btn-rounded"
              onClick={() => setExpiryModalOpen(false)}
            >
              <i className="mdi mdi-close me-1"></i>
              Cancel
            </Button>
            <Button 
              color="primary" 
              className="btn-rounded"
              onClick={handleExpiryUpdate} 
              disabled={updating}
            >
              {updating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Updating...
                </>
              ) : (
                <>
                  <i className="mdi mdi-check me-1"></i>
                  Update Expiry
                </>
              )}
            </Button>
          </ModalFooter>
        </Modal>
        <Modal 
          isOpen={statusFilterModalOpen} 
          toggle={() => setStatusFilterModalOpen(!statusFilterModalOpen)} 
          centered
        >
          <ModalHeader toggle={() => setStatusFilterModalOpen(!statusFilterModalOpen)}>
            Filter by Status
          </ModalHeader>
          <ModalBody className="text-center py-4">
            <div className="d-flex justify-content-center gap-2">
              <Button 
                color={filter === "active" ? "success" : "light"} 
                onClick={() => {
                  setFilter("active");
                  setSearchTerm("");
                  setDemoUsers(allDemoUsers.filter(u => differenceInDays(new Date(u.expiresAt), new Date()) > 0));
                  setStatusFilterModalOpen(false);
                }}
              >
                Active
              </Button>

              <Button 
                color={filter === "expired" ? "danger" : "light"} 
                onClick={() => {
                  setFilter("expired");
                  setSearchTerm("");
                  setDemoUsers(allDemoUsers.filter(u => differenceInDays(new Date(u.expiresAt), new Date()) <= 0));
                  setStatusFilterModalOpen(false);
                }}
              >
                Expired
              </Button>

              <Button 
                color={filter === "all" ? "secondary" : "light"} 
                onClick={() => {
                  setFilter("all");
                  setSearchTerm("");
                  setDemoUsers(allDemoUsers);
                  setStatusFilterModalOpen(false);
                }}
              >
                All
              </Button>

            </div>

          </ModalBody>
        </Modal>

        <DemoUserLogsModal
          isOpen={logsModalOpen}
          toggle={() => setLogsModalOpen(!logsModalOpen)}
          userId={logsUserId}
        />
      </div>
    </React.Fragment>
  );
};

export default DemoUsers;