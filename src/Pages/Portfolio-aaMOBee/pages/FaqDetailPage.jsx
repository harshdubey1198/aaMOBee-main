import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderwithDashboard from "../components/headerWithDashboard";
import Footer from "../components/footer";

const API_BASE_URL = process.env.REACT_APP_URL;

const FaqDetailPage = () => {
  const { slug } = useParams(); // ✅ get slug from URL
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [relatedFaqs, setRelatedFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(false);
  const hiddenButtonCategories = ["Overview", "Account", "Troubleshooting", "Reports", "Roles", "Integrations"];

  // ✅ Fetch single FAQ
  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/faqs/${slug}`);
        const data = await res.json();

        if (data.success && data.data) {
          setFaq(data.data);
        } else {
          setError("FAQ not found.");
        }
      } catch (err) {
        console.error("Error fetching FAQ:", err);
        setError("Failed to fetch FAQ details.");
      } finally {
        setLoading(false);
      }
    };

    fetchFaq();
  }, [slug]);

  // ✅ Increment views once when the FAQ is loaded
  useEffect(() => {
    if (faq?._id) {
      fetch(`${API_BASE_URL}/faqs/${slug}/increment-view`, { method: "PATCH" })
        .then((res) => res.json())
        .then((data) => {
          console.log("✅ View incremented:", data);
          if (data.success && data.data?.views !== undefined) {
            setFaq((prev) => ({
              ...prev,
              views: data.data.views,
            }));
          }
        })
        .catch((err) => console.error("❌ Error incrementing view:", err));
    }
  }, [faq?._id, slug]);

  // ✅ Fetch related FAQs by category (excluding this FAQ)
  useEffect(() => {
    const fetchRelatedFaqs = async () => {
      if (!faq?.category) return;

      try {
        const res = await fetch(`${API_BASE_URL}/faqs/all-faqs`);
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const related = data.data
            .filter((item) => {
              if (!item.category || !faq.category) return false;

              // Convert both to arrays for safety
              const faqCats = Array.isArray(faq.category) ? faq.category : [faq.category];
              const itemCats = Array.isArray(item.category) ? item.category : [item.category];

              // Check if any category overlaps
              const hasCommonCategory = itemCats.some((cat) => faqCats.includes(cat));

              // Exclude the same FAQ
              return hasCommonCategory && item.slug !== faq.slug;
            })
            .slice(0, 5); // limit to 5
          setRelatedFaqs(related);
        }
      } catch (err) {
        console.error("❌ Error fetching related FAQs:", err);
      }
    };

    fetchRelatedFaqs();
  }, [faq]);

  if (loading) return <p>Loading FAQ...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!faq) return null;

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
              Category
            </h3>

            <p
              style={{
                color: "#016a7e",
                fontWeight: "500",
                marginBottom: "1rem",
              }}
            >
              {faq.category || "General"}
            </p>

            {/* ✅ All FAQs Button */}
            <button
              onClick={() => navigate("/faq")}
              style={{
                width: "100%",
                padding: "0.6rem 1rem",
                backgroundColor: "#016a7e",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#0289a0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#016a7e")
              }
            >
              ← All FAQs
            </button>
          </aside>

          {/* ===== FAQ Center Section ===== */}
          <main style={{ flex: 1 }}>
            <h1
              style={{
                color: "#016a7e",
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
              }}
            >
              {faq.question}
            </h1>

            <div
              style={{
                background: "#fff",
                padding: "1.5rem",
                borderRadius: "10px",
                border: "1px solid #eee",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />

            {faq.media?.length > 0 && faq.media[0].url && (
              <img
                src={faq.media[0].url}
                alt="FAQ media"
                style={{
                  marginTop: "1.5rem",
                  maxWidth: "100%",
                  borderRadius: "8px",
                }}
              />
            )}

            {/* Views Count */}
            <p
              style={{
                marginTop: "1rem",
                color: "#666",
                fontSize: "0.95rem",
                fontWeight: "500",
              }}
            >
              {faq.views || 0} views
            </p>

            {/* Divider */}
            <hr
              style={{
                margin: "1.5rem 0",
                border: "none",
                borderTop: "1px solid #eee",
              }}
            />

            {/* More Details Button */}
            {!hiddenButtonCategories.includes(faq.category) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  onClick={() => {
                    if (faq?.navigateTo) {
                      switch (faq.navigateTo) {
                        case "invoicing":
                          navigate("/apps/invoicing");
                          break;
                        case "inventory-management-software":
                          navigate("/inventory-management-software");
                          break;
                        case "privacy-policy":
                          navigate("/privacy-policy");
                          break;
                        case "support":
                          navigate("/support");
                          break;
                        case "contact":
                          navigate("/apps/contact");
                          break;
                        case "privacy-policy":
                          navigate("/apps/privacy-policy");
                          break;
                        case "refund-policy":
                          navigate("/apps/refund-policy");
                          break;
                        case "features":
                          navigate("/apps/features");
                          break;
                        case "pricing":
                          navigate("/apps/pricing");
                          break;
                        case "client-mangement":
                        case "client-management":
                          navigate("/apps/client-management");
                          break;
                        default:
                          navigate(`/apps/${faq.navigateTo}`);
                          break;
                      }
                    } else if (faq?.category) {
                      navigate(`/faq/category/${faq.category}`);
                    } else {
                      navigate("/faq");
                    }

                    window.scrollTo(0, 0);
                  }}
                  style={{
                    backgroundColor: "#00a5b5",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "0.7rem 1.2rem",
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#03b7c9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#00a5b5")
                  }
                >
                  More Information →
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
                Related Questions
              </h3>

              {relatedFaqs.length > 0 ? (
                relatedFaqs.map((item) => (
                  <div key={item._id} style={{ marginBottom: "1rem" }}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/faq/${item.slug}`);
                        window.scrollTo(0, 0);
                      }}
                      style={{
                        color: "#016a7e",
                        textDecoration: "none",
                        fontWeight: "500",
                        fontSize: "0.95rem",
                        lineHeight: "1.4",
                      }}
                    >
                      {item.question}
                    </a>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#777",
                        marginTop: "0.25rem",
                      }}
                    >
                      {item.views || 0} views
                    </p>
                  </div>
                ))
              ) : (
                <p style={{ color: "#777" }}>No related questions found.</p>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FaqDetailPage;
