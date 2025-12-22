import React, { useState } from 'react';
import { Card, CardBody, Col, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';

function TaskDetailedTableModal({ isOpen, toggle, task, loading, onUpdate }) {
  const [selectedLead, setSelectedLead] = useState(null);

  const handleRowClick = (lead) => {
    setSelectedLead(lead);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="xl">
      <ModalHeader toggle={toggle}>
        <h2>Task Details</h2>
      </ModalHeader>
      <ModalBody>
        {task && (
          <Card className="shadow-sm border-0 mb-3">
            <CardBody>
              <Row>
                {[
                  { label: 'Assigned By', value: task.assignedBy.firstName + " " + task.assignedBy.lastName },
                  { label: 'Assigned To', value: task.assignedTo?.map(emp => `${emp.firstName} ${emp.lastName}`).join(', ') },
                  { label: 'Priority', value: task.priority },
                  { label: 'Status', value: task.status.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) },
                ].map((item, index) => (
                  <Col md={6} key={index} className="mb-2">
                    <strong>{item.label}:</strong> {item.value}
                  </Col>
                ))}
              </Row>
            </CardBody>
          </Card>
        )}
        {task?.remarks?.length > 0 && (
          <Card className="shadow-sm border-0 mt-1">
            <CardBody>
              <h5 className="mb-1">Task Remarks</h5>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th style={{minWidth:"100px"}}>Message</th>
                      <th style={{minWidth:"100px"}}>Email</th>
                      <th style={{minWidth:"100px"}}>By</th>
                      <th style={{minWidth:"100px"}}>Role</th>
                      <th style={{minWidth:"100px"}}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {task.remarks.map((remark, index) => (
                      <tr key={remark._id || index}>
                        <td>{index + 1}</td>
                        <td>{remark.message}</td>
                        <td>{remark.createdBy?.email || "N/A"}</td>
                        <td>{remark.createdBy ? `${remark.createdBy.firstName} ${remark.createdBy.lastName}` : "N/A"}</td>
                        <td>
                            {remark.createdBy?.roleId?.roleName
                              ? remark.createdBy.roleId.roleName
                                  .split("_")
                                  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                                  .join(" ")
                              : remark.createdBy?.role
                              ? remark.createdBy.role
                                  .split("_")
                                  .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                                  .join(" ")
                              : "N/A"}
                          </td>
                        <td>{new Date(remark.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true
                        })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        )}
        <div className="d-flex flex-wrap gap-1">
          {/* Leads Table */}
           <Card className="shadow-sm border-0 flex-grow-1">
            <CardBody>
            {/* <div className='table-responsive' style={{ overflowX: "auto" }}> */}
            <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto", borderRadius: "8px", border: "1px solid rgba(0, 0, 0, 0.1)", }} >
              <table className="table table-bordered" >
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {task?.leadIds.map((lead, index) => (
                    <tr
                      key={index}
                      onClick={() => handleRowClick(lead)}
                      style={{ cursor: "pointer", backgroundColor: selectedLead === lead ? "#f0f8ff" : "transparent" }}
                    >
                      <td>{lead.firstName} {lead.lastName}</td>
                      <td>{lead.email}</td>
                      <td>{lead.mobileNumber}</td>
                      <td>{lead.status}</td>
                      <td>{task.priority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </CardBody>
          </Card>

            <div style={{ flex: "1 1 100%", marginTop: "10px" }}>
            <Card className="shadow glass-card border-0">
              <CardBody>
                {selectedLead ? (
                  <>
                    <h4 className="mb-4 text-primary fw-bold">Lead Preview</h4>
                    <Row>
                      {Object.entries(selectedLead)
                        .filter(
                          ([key, value]) =>
                            ![
                              "mode", "_id", "additionalFields", "assignmentHistory", "createdAt",
                              "updatedAt", "createdBy", "updatedBy", "deleted_at", "firmId", "deletedAt",
                              "deletedBy", "__v", "remarks", "leadIds", "assignedTo", "assignedBy", "notes", "dueDate"
                            ].includes(key) &&
                            value !== null &&
                            value !== undefined &&
                            value !== ""
                        )
                        .map(([key, value], index) => (
                          <Col md={6} key={index} className="mb-3">
                            <div className="glass-field-box p-3 rounded shadow-sm">
                              <div className="fw-semibold text-secondary small">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, str => str.toUpperCase())}
                              </div>
                              <div className="fw-bold text-dark">
                                {typeof value === "string" || typeof value === "number"
                                  ? value
                                  : JSON.stringify(value)}
                              </div>
                            </div>
                          </Col>
                        ))}
                    </Row>
                  </>
                ) : (
                  <p className="text-muted">Click on a lead to see full preview</p>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}

export default TaskDetailedTableModal;
