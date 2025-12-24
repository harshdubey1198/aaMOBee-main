import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderwithDashboard from "../components/headerWithDashboard";
import Footer from "../components/footer";

const API_BASE_URL = process.env.REACT_APP_URL;

const FaqPage = () => {
  const navigate = useNavigate();
  const [showProducts, setShowProducts] = useState(false);
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [trendingFaqs, setTrendingFaqs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Questions");

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 10;

  const categories = [
    "All Questions",
    "Overview",
    "Account",
    "Roles",
    "Features",
    "Clients",
    "Reports",
    "Security",
    "Billing",
    "Integrations",
    "Invoices",
    "Inventory Management",
    "Support",
    "Policies",
  ];

  // ✅ Fetch all FAQs and trending FAQs
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/faqs/all-faqs`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const sorted = data.data.sort((a, b) => a.priority - b.priority);
          setFaqData(sorted);
        } else {
          setError("Failed to load FAQs.");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Failed to fetch FAQs.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTrendingFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/faqs/trending-faqs`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setTrendingFaqs(data.data);
        }
      } catch (err) {
        console.error("❌ Trending fetch error:", err);
      }
    };

    fetchFaqs();
    fetchTrendingFaqs();
  }, []);

  // ✅ Filter FAQs (handles array categories properly)
  const filteredFaqs = faqData.filter((faq) => {
    const matchesSearch = faq.question
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Some FAQs have multiple categories (array)
    const categories = Array.isArray(faq.category)
      ? faq.category
      : [faq.category || "Uncategorized"];

    const matchesCategory =
      selectedCategory === "All Questions" ||
      categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });


  // ✅ Pagination logic
  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);
  const startIndex = (currentPage - 1) * faqsPerPage;
  const endIndex = startIndex + faqsPerPage;
  const currentFaqs = filteredFaqs.slice(startIndex, endIndex);

  // ✅ Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to top when page changes
    }
  };

  return (
    <>
      <HeaderwithDashboard
        showProducts={showProducts}
        setShowProducts={setShowProducts}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#f9fafc",
          minHeight: "100vh",
          paddingTop: "6rem",
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: "1200px",
            width: "100%",
            gap: "2rem",
            padding: "2rem",
          }}
        >
          {/* ===== Left Sidebar ===== */}
          <aside
            style={{
              width: "220px",
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem 1rem",
              border: "1px solid #eee",
              height: "fit-content",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
            }}
          >
            <h3
              style={{
                fontSize: "1.15rem",
                marginBottom: "1rem",
                color: "#222",
                fontWeight: "600",
                borderBottom: "1px solid #f0f0f0",
                paddingBottom: "0.5rem",
              }}
            >
              Categories
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1); // reset page when category changes
                  }}
                  style={{
                    padding: "0.6rem 0.8rem",
                    borderRadius: "6px",
                    backgroundColor:
                      selectedCategory === cat ? "#e9f8f3" : "transparent",
                    color: selectedCategory === cat ? "#0b7d60" : "#333",
                    fontWeight: selectedCategory === cat ? "600" : "400",
                    cursor: "pointer",
                    marginBottom: "0.25rem",
                    transition: "all 0.2s ease",
                  }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          {/* ===== FAQ Section ===== */}
          <main style={{ flex: 1 }}>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search your question..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              style={{
                width: "100%",
                padding: "0.8rem 1rem",
                borderRadius: "8px",
                border: "1px solid #ddd",
                marginBottom: "1.5rem",
                fontSize: "1rem",
                outline: "none",
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            />

            {loading ? (
              <p>Loading FAQs...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : currentFaqs.length === 0 ? (
              <p>No matching questions found.</p>
            ) : (
              currentFaqs.map((faq, index) => (
                <div
                  key={faq._id || index}
                  onClick={() => navigate(`/faq/${faq.slug}`)}
                  style={{
                    background: "#fff",
                    marginBottom: "0.6rem",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
                  }}
                >
                  <h3
                    style={{
                      color: "#016a7e",
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    {faq.question}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      backgroundColor: "#e0f7ff",
                      color: "#007b8e",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "5px",
                      marginTop: "0.3rem",
                    }}
                  >
                    {/* Show only the category that matches the selection */}
                    {Array.isArray(faq.category)
                      ? selectedCategory === "All Questions"
                        ? faq.category[0] // if viewing all, just show the first one
                        : faq.category.find((cat) => cat === selectedCategory) ||
                        faq.category[0] // fallback
                      : faq.category || "Uncategorized"}
                  </span>

                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#777",
                      marginTop: "0.3rem",
                    }}
                  >
                    {faq.views != null ? faq.views : 0} views
                  </p>
                </div>
              ))
            )}

            {/* ✅ Pagination Controls */}
            {filteredFaqs.length > faqsPerPage && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "1.5rem",
                }}
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor: currentPage === 1 ? "#f1f1f1" : "#fff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  Previous
                </button>

                <span
                  style={{
                    fontSize: "0.95rem",
                    color: "#555",
                  }}
                >
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    backgroundColor:
                      currentPage === totalPages ? "#f1f1f1" : "#fff",
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </main>

          {/* ===== Right Sidebar ===== */}
          <aside style={{ width: "260px" }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "1.25rem",
                boxShadow: "0 2px 8px rgba(0,0,0,0.03)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.1rem",
                  color: "#222",
                  fontWeight: "600",
                  marginBottom: "1rem",
                }}
              >
                🔥 Trending Questions
              </h3>

              {trendingFaqs.length > 0 ? (
                trendingFaqs.map((faq, i) => (
                  <div key={faq._id || i} style={{ marginBottom: "1.2rem" }}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/faq/${faq.slug}`);
                      }}
                      href="#"
                      style={{
                        color: "#016a7e",
                        textDecoration: "none",
                        fontSize: "0.95rem",
                        fontWeight: "500",
                        lineHeight: "1.4",
                      }}
                    >
                      {faq.question}
                    </a>

                    {/* ✅ Category Badge */}
                    <div style={{ marginTop: "0.35rem" }}>
                      {Array.isArray(faq.category) && faq.category.length > 0 ? (
                        faq.category.slice(0, 1).map((cat, idx) => (
                          <span
                            key={idx}
                            style={{
                              display: "inline-block",
                              backgroundColor: "#e0f7ff",
                              color: "#007b8e",
                              fontSize: "0.7rem",
                              fontWeight: "500",
                              padding: "0.15rem 0.5rem",
                              borderRadius: "5px",
                              marginTop: "0.2rem",
                            }}
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span
                          style={{
                            display: "inline-block",
                            backgroundColor: "#f1f1f1",
                            color: "#666",
                            fontSize: "0.7rem",
                            fontWeight: "500",
                            padding: "0.15rem 0.5rem",
                            borderRadius: "5px",
                            marginTop: "0.2rem",
                          }}
                        >
                          Uncategorized
                        </span>
                      )}
                    </div>

                    {/* ✅ Views */}
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#777",
                        marginTop: "0.25rem",
                      }}
                    >
                      {faq.views != null ? faq.views : 0} views
                    </p>
                  </div>
                ))
              ) : (
                <p>No trending questions yet.</p>
              )}

            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FaqPage;
