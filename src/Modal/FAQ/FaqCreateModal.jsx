import React, { useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, FormGroup, Label, Input, Spinner, } from "reactstrap";
import Select from "react-select";
import { createFAQ, updateFAQ } from "../../apiServices/service";

function FaqCreateModal({ isOpen, toggle, fetchFAQs, mode = "create", faqData = null }) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: [],
    media: [],
    priority: "",
    navigateTo: "",
  });
  const [loading, setLoading] = useState(false);

  const [existingMedia, setExistingMedia] = useState([]); // 🆕 holds old media from backend

  const categoryOptions = [
    { value: "Overview", label: "Overview" },
    { value: "Account", label: "Account" },
    { value: "Roles", label: "Roles" },
    { value: "Features", label: "Features" },
    { value: "Clients", label: "Clients" },
    { value: "Reports", label: "Reports" },
    { value: "Security", label: "Security" },
    { value: "Billing", label: "Billing" },
    { value: "Integrations", label: "Integrations" },
    { value: "Invoices", label: "Invoices" },
    { value: "Inventory Management", label: "Inventory Management" },
    { value: "Support", label: "Support" },
    { value: "Policies", label: "Policies" },
  ];


  // ✅ Prefill form data (edit or create)
  useEffect(() => {
    if (mode === "edit" && faqData) {
      setFormData({
        question: faqData.question || "",
        answer: faqData.answer || "",
        category: Array.isArray(faqData.category)
          ? faqData.category
          : faqData.category
            ? [faqData.category]
            : [],
        media: [],
        priority: faqData.priority || 1,
        navigateTo: faqData.navigateTo || "", // ✅ Prefill
      });
      setExistingMedia(faqData.media || []);
    } else {
      setFormData({
        question: "",
        answer: "",
        category: "",
        media: [],
        priority: 1,
        navigateTo: "", // ✅ Reset
      });
      setExistingMedia([]);
    }

  }, [mode, faqData]);


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mediaFiles = files.map((file) => ({
      file,
      type: file.type.startsWith("video") ? "video" : "image",
      url: URL.createObjectURL(file),
    }));
    setFormData({ ...formData, media: [...formData.media, ...mediaFiles] });
  };

  const removeMedia = (index) => {
    const newMedia = [...formData.media];
    newMedia.splice(index, 1);
    setFormData({ ...formData, media: newMedia });
  };

  const handleSubmit = async () => {
    if (!formData.question || !formData.answer)
      return alert("Question & Answer are required");

    setLoading(true);
    try {
      // ✅ Create FormData to send text + files together
      const fd = new FormData();
      fd.append("question", formData.question);
      fd.append("answer", formData.answer);
      fd.append("category", JSON.stringify(formData.category));
      fd.append("priority", formData.priority);
      fd.append("navigateTo", formData.navigateTo);

      // 🆕 Include existing media list after deletions
      fd.append("existingMedia", JSON.stringify(existingMedia.map(m => m.url || m)));

      // ✅ Append new uploads
      formData.media.forEach((m) => {
        if (m.file) {
          fd.append("faqMedia", m.file);
        }
      });

      let response;
      let url = "";
      let method = "";

      // ✅ If creating new FAQ
      if (mode === "create") {
        url = `${process.env.REACT_APP_URL}/faqs/create-faq`;
        method = "POST";
      }
      // ✅ If editing existing FAQ
      else if (mode === "edit" && faqData?.slug) {
        url = `${process.env.REACT_APP_URL}/faqs/${faqData.slug}`;
        method = "PUT";

        // 🆕 Optional: uncomment if you want to *replace* existing media with new uploads
        // fd.append("replaceMedia", "true");
      } else {
        throw new Error("Invalid mode or missing FAQ slug");
      }

      // ✅ Send the request (multipart form-data)
      response = await fetch(url, { method, body: fd });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        const text = await response.text();
        console.error("Raw response:", text);
        throw new Error("Invalid JSON response");
      }

      console.log("Server response:", data);

      // ✅ Handle response
      if (data.success) {
        // alert(mode === "create" ? "FAQ created successfully!" : "FAQ updated successfully!");
        setFormData({ question: "", answer: "", category: "", media: [], priority: "" });
        toggle();
        fetchFAQs();
      } else {
        alert(`Failed: ${data.message || "Something went wrong."}`);
      }
    } catch (err) {
      console.error("Error submitting FAQ:", err);
      alert("Something went wrong while submitting the FAQ.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
      <ModalHeader toggle={toggle}>{mode === "edit" ? "Edit FAQ" : "Create FAQ"}</ModalHeader>
      <ModalBody>
        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <Label>Question</Label>
              <Input
                type="text"
                placeholder="Enter question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </FormGroup>
          </Col>

          <Col md={6}>
            <FormGroup>
              <Label>Categories (Select Multiple)</Label>
              <Select
                isMulti
                name="categories"
                options={categoryOptions}
                value={categoryOptions.filter((opt) =>
                  formData.category.includes(opt.value)
                )}
                onChange={(selectedOptions) =>
                  setFormData({
                    ...formData,
                    category: selectedOptions.map((opt) => opt.value),
                  })
                }
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select one or more categories..."
              />
            </FormGroup>
          </Col>
        </Row>

        {/* 🆕 Navigation Page Dropdown */}
        <Row className="mb-3">
          <Col md={6}>
            <FormGroup>
              <Label>Navigation Page</Label>
              <Input
                type="select"
                value={formData.navigateTo}
                onChange={(e) =>
                  setFormData({ ...formData, navigateTo: e.target.value })
                }
              >
                <option value="">Select a Page</option>
                <option value="support">Support Page</option>
                <option value="privacy-policy">Security & Privacy Policy</option>
                <option value="contact">Contact Page</option>
                <option value="refund-policy">Refund Policy</option>
                <option value="features">Features Page</option>
                <option value="pricing">Pricing Page</option>
                <option value="client-management">Client Management</option>
                <option value="retail-billing">Retail Billing</option>
                <option value="inventory-management-software">
                  Inventory Management
                </option>
                <option value="invoicing">Invoice</option>
              </Input>
            </FormGroup>
          </Col>

          {/* ✅ Priority moved below Navigation Page */}
          <Col md={6}>
            <FormGroup>
              <Label>Priority</Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter priority"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: Math.max(1, parseInt(e.target.value) || 1),
                  })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        {/* ✅ Answer */}
        <Row className="mb-3">
          <Col md={12}>
            <FormGroup>
              <Label>Answer</Label>
              <Input
                type="textarea"
                placeholder="Enter answer"
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
              />
            </FormGroup>
          </Col>
        </Row>

        {/* ✅ Upload Media Section */}
        <Row className="mb-3">
          <Col md={12}>
            <FormGroup>
              <Label>Upload Media (Images / Videos)</Label>
              <Input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </FormGroup>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {/* Existing and new media display (same as before) */}
              {existingMedia.map((m, idx) => (
                <div key={`existing-${idx}`} style={{ position: "relative" }}>
                  <img
                    src={m.url || m}
                    alt="faq media"
                    style={{ width: "100px", height: "80px", objectFit: "cover" }}
                  />
                  <Button
                    color="danger"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: "0 5px",
                    }}
                    onClick={() => {
                      const updated = [...existingMedia];
                      updated.splice(idx, 1);
                      setExistingMedia(updated);
                    }}
                  >
                    &times;
                  </Button>
                </div>
              ))}

              {formData.media.map((m, idx) => (
                <div key={`new-${idx}`} style={{ position: "relative" }}>
                  {m.type === "video" ? (
                    <video width="100" height="80" controls src={m.url}></video>
                  ) : (
                    <img
                      src={m.url}
                      alt="faq media"
                      style={{ width: "100px", height: "80px", objectFit: "cover" }}
                    />
                  )}
                  <Button
                    color="danger"
                    size="sm"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      padding: "0 5px",
                    }}
                    onClick={() => removeMedia(idx)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? <Spinner size="sm" /> : mode === "edit" ? "Update" : "Save"}
        </Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default FaqCreateModal;
