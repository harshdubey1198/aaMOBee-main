import React, { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import faqImage from "../assets/FAQ-image.webp";

const API_BASE_URL = process.env.REACT_APP_URL;

const Chevron = ({ open }) => (
  <svg
    className="chevron"
    viewBox="0 0 24 24"
    width="16"
    height="16"
    aria-hidden="true"
    style={{
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 200ms",
    }}
  >
    <path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
);

const FaqItem = React.memo(function FaqItem({ faq }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (faq?.slug) {
      navigate(`/faq/${faq.slug}`); // ✅ navigate to detail page using slug
    } else {
      console.warn("No slug found for this FAQ:", faq);
    }
  };

  return (
    <div
      className="faq-item"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" ? handleClick() : null)}
      style={{
        cursor: "pointer",
        padding: "1rem",
        borderBottom: "1px solid #eee",
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "rgba(1,106,126,0.05)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#016a7e",
          fontWeight: "600",
          fontSize: "1rem",
        }}
      >
        {faq.question}
        <Chevron open={false} />
      </div>
    </div>
  );
});


function FaqSection() {
  const navigate = useNavigate();

  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const handleSuggestionClick = (suggestion) => {
  setShowSuggestions(false);

  if (suggestion?.slug) {
    navigate(`/faq/${suggestion.slug}`); // ✅ go directly to FAQ detail page
  } else {
    console.warn("No slug found for suggestion:", suggestion);
  }
};


  const onToggle = useCallback(
    (idx) => setOpenIndex((current) => (current === idx ? null : idx)),
    []
  );

  // 🔹 Fetch top FAQs on load
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/faqs/top`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const sorted = data.data.sort((a, b) => a.priority - b.priority);
          setFaqs(sorted);
        } else {
          console.error("Failed to load FAQs:", data.message);
        }
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);


  // 🔹 Debounced fuzzy search API
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/faqs/search?q=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setSuggestions(data.data.slice(0, 6));
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Search error:", err);
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);




  if (loading) {
    return (
      <div className="faq-container">
        <p>Loading FAQs...</p>
      </div>
    );
  }

  return (
    <div className="faq-container">
      <div className="faq-content">
        <div className="faq-left">
          <h1>
            Find Answers to <br /> Frequently Asked Questions
          </h1>
          <p className="subheading">Common Questions Answered:</p>
          <p className="description">
            Whether you’re new to aaMOBee or an experienced user, find answers
            to your most common questions here. Let us simplify your experience.
          </p>
        </div>

        <div className="faq-center">
          <img
            src={faqImage}
            alt="FAQ Illustration"
            className="faq-image"
            loading="lazy"
            decoding="async"
            width="560"
            height="420"
          />
        </div>

        <div className="faq-right">
          {/* 🔍 Search Bar with Dropdown */}
          <div
            className="faq-search-bar"
            style={{
              marginBottom: "1.5rem",
              textAlign: "center",
              position: "relative",
            }}
          >
            <input
              type="text"
              placeholder="Search your question..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
              style={{
                padding: "0.8rem 1rem",
                borderRadius: "10px",
                border: "1px solid #ccc",
                width: "100%",
                maxWidth: "500px",
                fontSize: "1rem",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            />
            {/* Dropdown for suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="faq-suggestions"
                style={{
                  position: "absolute",
                  top: "105%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  width: "100%",
                  maxWidth: "500px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  zIndex: 100,
                }}
              >
                {suggestions.map((sug) => (
                  <li
                    key={sug._id}
                    onClick={() => handleSuggestionClick(sug)}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      borderBottom: "1px solid #eee",
                    }}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {sug.question}
                  </li>
                ))}
              </ul>
            )}
            {searchLoading && (
              <p
                style={{
                  position: "absolute",
                  top: "105%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.9rem",
                  color: "#666",
                  marginTop: "0.5rem",
                }}
              >
                Searching...
              </p>
            )}
          </div>

          {/* ✅ Always show Top FAQs from /faqs/top */}
          <div className="faq-list">
            {faqs.length > 0 ? (
              faqs.map((faq) => (
                <FaqItem key={faq._id} faq={faq} />
              ))

            ) : (
              <p>No FAQs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FaqSection);
