import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Table, Button, Spinner, Input, Card, CardBody, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { getAllFAQs, deleteFAQ } from "../../apiServices/service";
import { useNavigate } from "react-router-dom";
import FaqCreateModal from "../../Modal/FAQ/FaqCreateModal";

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editFaq, setEditFaq] = useState(null);
  const navigate = useNavigate();

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await getAllFAQs();
      setFaqs(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  const handleDelete = async () => {
    if (!selectedFaq) return;
    try {
      await deleteFAQ(selectedFaq.slug);
      setDeleteModalOpen(false);
      fetchFAQs();
    } catch (error) {
      console.error(error);
    }
  };

  // const filteredFaqs = faqs.filter(faq => faq.question.toLowerCase().includes(searchTerm.toLowerCase()));
  // Filter based on search term
  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort so priority 1 comes first
  const sortedFaqs = [...filteredFaqs].sort((a, b) => a.priority - b.priority);


  if (loading)
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    );

  return (
    <div className="page-content">
      <Breadcrumbs title="aaMOBee" breadcrumbItem="FAQs" />

      <Card className="shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ width: "300px" }}
            />
            <Button color="primary" onClick={() => { setEditFaq(null); setCreateModalOpen(true); }}>
              <i className="mdi mdi-plus me-1"></i> Add FAQ
            </Button>
          </div>

          <div className="table-responsive">
            <Table className="table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Question</th>
                  <th>Category</th>
                  <th>Priority</th> {/* 🆕 Added Priority column */}
                  <th>Media</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedFaqs.length > 0 ? sortedFaqs.map((faq, idx) => (
                  <tr
                    key={faq.slug}
                    title="Click to see details"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/faq-detail/${faq.slug}`)}
                  >
                    <td>{idx + 1}</td>
                    <td>{faq.question}</td>
                    <td>
                      {Array.isArray(faq.category) && faq.category.length > 0 ? (
                        faq.category.map((cat, index) => (
                          <Badge
                            key={index}
                            color={
                              cat === "Security"
                                ? "danger"
                                : cat === "Billing"
                                  ? "warning"
                                  : cat === "Integrations"
                                    ? "success"
                                    : cat === "Troubleshooting"
                                      ? "primary"
                                      : "info"
                            }
                            pill
                            className="me-1"
                          >
                            {cat}
                          </Badge>
                        ))
                      ) : (
                        <Badge color="secondary" pill>
                          N/A
                        </Badge>
                      )}
                    </td>


                    {/* 🆕 Priority Column */}
                    <td>
                      {faq.priority ? (
                        <Badge
                          color={
                            faq.priority <= 2 ? "success" :
                              faq.priority <= 5 ? "warning" :
                                "danger"
                          }
                          pill
                        >
                          {faq.priority}
                        </Badge>
                      ) : (
                        <Badge color="secondary" pill>N/A</Badge>
                      )}
                    </td>

                    <td>
                      {faq.media && faq.media.length > 0 ? (
                        faq.media.map((m, i) => (
                          <div key={i}>
                            {m.type === "video" ? (
                              <video width="100" height="60" controls>
                                <source src={m.url} type="video/mp4" />
                              </video>
                            ) : (
                              <img
                                src={m.url}
                                alt="faq media"
                                style={{ width: "60px", height: "40px" }}
                              />
                            )}
                          </div>
                        ))
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td onClick={(e) => e.stopPropagation()}>
                      <Button
                        color="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => { setEditFaq(faq); setCreateModalOpen(true); }}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => { setSelectedFaq(faq); setDeleteModalOpen(true); }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="text-center py-4">No FAQs found</td>
                  </tr>
                )}
              </tbody>
            </Table>

          </div>
        </CardBody>
      </Card>

      {/* Create / Edit Modal */}
      <FaqCreateModal
        isOpen={createModalOpen}
        toggle={() => setCreateModalOpen(!createModalOpen)}
        fetchFAQs={fetchFAQs}
        mode={editFaq ? "edit" : "create"}
        faqData={editFaq}
      />

      <Modal isOpen={deleteModalOpen} toggle={() => setDeleteModalOpen(!deleteModalOpen)} centered>
        <ModalHeader toggle={() => setDeleteModalOpen(!deleteModalOpen)}>Delete FAQ</ModalHeader>
        <ModalBody>
          Are you sure you want to delete the FAQ: <b>{selectedFaq?.question}</b>?
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
          <Button color="danger" onClick={handleDelete}>Delete</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FaqList;
