import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Col, } from "reactstrap";

function LeadDetailsModal({ isOpen, toggle, lead, loading, onUpdate }) {
  const [formData, setFormData] = useState(lead || {});
  const [mode, setMode] = useState("view");
  const [additionalFields, setAdditionalFields] = useState([]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      ...(lead || {}),
      status: lead?.status ?? prevData.status ?? "",
      dueDate: lead?.dueDate ?? prevData.dueDate ?? "",
    }));
    setMode(lead?.mode || "view");
    const fields = lead?.additionalFields
      ? Object.entries(lead.additionalFields).map(([key, value]) => ({
          key,
          value,
        }))
      : [];
    setAdditionalFields(fields);
  }, [lead]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdditionalFieldChange = (index, type, value) => {
    const updated = [...additionalFields];
    updated[index][type] = value;
    setAdditionalFields(updated);

    const updatedObject = {};
    updated.forEach((item) => {
      if (item.key.trim()) {
        updatedObject[item.key] = item.value;
      }
    });

    setFormData((prev) => ({
      ...prev,
      additionalFields: updatedObject,
    }));
  };

  const handleAddField = () => {
    setAdditionalFields([...additionalFields, { key: "", value: "" }]);
  };

  const handleRemoveField = (index) => {
    const updated = additionalFields.filter((_, i) => i !== index);
    setAdditionalFields(updated);

    const updatedObject = {};
    updated.forEach((item) => {
      if (item.key.trim()) {
        updatedObject[item.key] = item.value;
      }
    });

    setFormData((prev) => ({
      ...prev,
      additionalFields: updatedObject,
    }));
  };

  const handleSubmit = () => {
    if (mode === "edit") {
      onUpdate(formData);
    }
  };

  const formatRole = (role) => {
    if (!role) return "";
    return role
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle} className="d-flex justify-content-between align-items-center">
        <span>{mode === "edit" ? "Edit Lead Details" : "View Lead Details"}</span>
          <Button style={{marginLeft:"30px"}} 
              size="sm"
              color={mode === "edit" ? "secondary" : "warning"}
              onClick={() => setMode(mode === "edit" ? "view" : "edit")}
            >
              {mode === "edit" ? "Cancel Edit" : "Edit"}
            </Button>
      </ModalHeader>
      <ModalBody>
        {loading ? (
          <div className="text-center">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <Form>
            <Row className="scrollable-thin" style={{maxHeight:"250px",overflowY:"auto",padding:"0 10px"}}>
              {Object.entries(formData)
                .filter(([key]) => key !== "notes")
                .filter(([key, value]) => key !== "isOrganic" || value === true)
                .filter(
                  ([key]) =>
                    !["mode","_id","additionalFields","assignmentHistory","createdAt","status","updatedAt","createdBy","updatedBy","firmId","deletedAt","deletedBy","__v","remarks","leadIds","assignedTo","assignedBy","notes","dueDate",].includes(key)
                )
                .filter(([_, value]) => value !== null)
                .map(([key, value]) => (
                  <Col xs="12" md="4" key={key}>
                    <FormGroup>
                      <Label for={key}>
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/\b\w/g, (char) => char.toUpperCase())
                          .trim()}
                      </Label>
                      <Input
                        type={
                          key.toLowerCase().includes("email")
                            ? "email"
                            : "text"
                        }
                        name={key}
                        value={value || ""}
                        onChange={handleChange}
                        readOnly={mode === "view"}
                      />
                    </FormGroup>
                  </Col>
                ))}
            </Row>
            <Row className="scrollable-thin" style={{maxHeight:"280px",overflowY:"auto",marginTop:"8px",padding:"0 10px"}}>
            {/* Additional Fields Editable */}
            <Row>
              <Col>

                <h5 style={{marginTop:"7px"}}>Additional Fields</h5>
                {additionalFields.map((field, index) => (
                  <Row key={index} className="mb-2">
                    <Col md={5}>
                      <Input
                        type="text"
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            index,
                            "key",
                            e.target.value
                          )
                        }
                        readOnly={mode !== "edit"}
                      />
                    </Col>
                    <Col md={5}>
                      <Input
                        type="text"
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) =>
                          handleAdditionalFieldChange(
                            index,
                            "value",
                            e.target.value
                          )
                        }
                        readOnly={mode !== "edit"}
                      />
                    </Col>
                    <Col md={2}>
                      {mode === "edit" && (
                        <Button
                          color="danger"
                          onClick={() => handleRemoveField(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </Col>
                  </Row>
                ))}
                {mode === "edit" && (
                  <Button color="secondary" onClick={handleAddField}>
                    Add Field
                  </Button>
                )}
              </Col>
            </Row>

            {/* Status and Due Date */}
            <Row className="mt-4">
              <Col xs="12" md="4">
                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    type="select"
                    name="status"
                    value={formData.status || ""}
                    onChange={handleChange}
                    disabled={mode !== "edit"}
                  >
                    <option value="">Select Status</option>
                    <option value="invalidRequest">Invalid Request</option>
                    <option value="noResponse">No Response</option>
                    <option value="budgetIssue">Budget Issue</option>
                    <option value="not-interested">Not Interested</option>
                    <option value="recall">Recall</option>
                    <option value="contacted">Contacted</option>
                    <option value="falseData">False Data</option>
                    <option value="lost">Lost</option>
                    <option value="converted">Converted</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="12" md="4">
                <FormGroup>
                  <Label for="dueDate">Due Date</Label>
                  <Input
                    type="date"
                    name="dueDate"
                    value={
                      formData.dueDate ? formData.dueDate.split("T")[0] : ""
                    }
                    onChange={handleChange}
                    readOnly={mode !== "edit"}
                  />
                </FormGroup>
              </Col>
            </Row>

            {/* Assignment History */}
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label>Assignment History</Label>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {formData.assignmentHistory &&
                    formData.assignmentHistory.length > 0 ? (
                      formData.assignmentHistory.map((assignment) => (
                        <div key={assignment._id} style={{ marginBottom: "10px" }}>
                          <div className="d-flex justify-content-between">
                            <strong style={{ width: "40%", paddingLeft: "30px" }}>
                            {formatRole(assignment.assignedBy?.roleId?.roleName || assignment.assignedBy?.role)} -{" "}

                              {assignment.assignedBy.firstName} {" "} {assignment.assignedBy.lastName}
                            </strong>
                            <span>
                              <i className="fa fa-arrow-right" />
                            </span>
                            <strong style={{ width: "40%", paddingLeft: "30px" }}>
                            {formatRole(assignment.assignedTo?.roleId?.roleName || assignment.assignedTo?.role)} -{" "}

                              {assignment.assignedTo.firstName} {" "} {assignment.assignedTo.lastName}
                            </strong>
                          </div>
                          <p style={{ fontSize: "12px", color: "#666", paddingLeft: "30px" }}>
                            {new Date(assignment.assignedAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                          <hr />
                        </div>
                      ))
                    ) : (
                      <p>No Assignment History Available</p>
                    )}
                  </div>
                </FormGroup>
              </Col>
            </Row>

            {/* Notes */}
            <Row>
              <Col xs="12">
                <FormGroup>
                  <Label for="notes">Notes</Label>
                  <div
                    style={{
                      maxHeight: "200px",
                      overflowY: "auto",
                      border: "1px solid #ddd",
                      padding: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    {formData.notes && formData.notes.length > 0 ? (
                      formData.notes.map((note) => (
                        <div key={note._id} style={{ marginBottom: "10px" }}>
                          <div className="d-flex justify-content-between">
                            <strong
                              style={{
                                maxWidth: "60%",
                                marginBottom: "5px",
                                borderRadius: "5px",
                                boxShadow: "#0000001a 0px 1px 3px",
                                background: "#f8f9fa",
                                padding: "5px",
                              }}
                            >
                              {note.message}
                            </strong>
                            <strong style={{ color: "#1c7f9b" }}>
                              - {note.createdBy.firstName} {note.createdBy.lastName}
                            </strong>
                          </div>
                          <p style={{ fontSize: "12px", color: "#666" }}>
                            {new Date(note.createdAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                          <hr />
                        </div>
                      ))
                    ) : (
                      <p>No Notes Available</p>
                    )}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            </Row>
          </Form>
        )}
      </ModalBody>
      <ModalFooter>
        {mode === "edit" && (
          <Button color="primary" onClick={handleSubmit} disabled={loading}>
            Save
          </Button>
        )}
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default LeadDetailsModal;
