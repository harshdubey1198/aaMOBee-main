import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormGroup, Label } from 'reactstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { QueryFormRequest } from '../../../apiServices/service';

const contactReasons = [
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
  { value: "demo", label: "Demo" },
  { value: "onboarding", label: "Onboarding" },
  { value: "login", label: "Login Issue" },
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature Request" },
  { value: "api", label: "API Help" },
  { value: "cancel", label: "Cancel Plan" },
  { value: "upgrade", label: "Upgrade" },
  { value: "feedback", label: "Feedback" },
  { value: "payment", label: "Payment Issue" },
  { value: "account", label: "Account Update" },
  { value: "data", label: "Data Issue" },
  { value: "partner", label: "Partner Inquiry" },
  { value: "others", label: "Others" }
];

function QueryForm({ isOpen, toggle }) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [reason, setReason] = useState(null);
  const [customSubject, setCustomSubject] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message || (!reason && !customSubject)) {
      toast.error("Please fill all fields properly.");
      return;
    }

    const finalSubject = customSubject || (reason && reason.label);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: finalSubject,
        message: formData.message,
      };
      await QueryFormRequest(payload);
      toast.success("Message sent successfully!");
      setFormData({ name: '', email: '', message: '' });
      setReason(null);
      setCustomSubject('');
      toggle(); 
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message. Try again!");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} style={{zIndex: "1199" , maxWidth:"400px"}}>
      <ModalHeader toggle={toggle}>Send a Message</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Full Name</Label>
            <Input
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Email Address</Label>
            <Input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Subject</Label>
            <Select
              options={contactReasons}
              value={reason}
              onChange={(selected) => {
                setReason(selected);
                if (selected.value !== "others") {
                  setCustomSubject(selected.label);
                } else {
                  setCustomSubject('');
                }
              }}
              placeholder="Select a reason"
              isSearchable
            />
          </FormGroup>

          {reason?.value === "others" && (
            <FormGroup>
              <Label>Custom Subject</Label>
              <Input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Type your subject"
                required
              />
            </FormGroup>
          )}

          <FormGroup>
            <Label>Message</Label>
            <Input
              type="textarea"
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              required
            />
          </FormGroup>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit}>Send Message</Button>
        <Button color="secondary" onClick={toggle}>Cancel</Button>
      </ModalFooter>
    </Modal>
  );
}

export default QueryForm;
