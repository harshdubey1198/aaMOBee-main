import React, { useState, useRef, useEffect } from "react";
import { aiChat, saveUserData } from "../../../apiServices/service";

const Chatbot = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! I'm aaMOBee Support Bot. Ask me anything!" }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ AI API
  const sendToAI = async (text) => {
  try {
    const data = await aiChat(text);

   let cleanedText = data?.answer || "";

// ✅ HARD DELETE anything starting with 【
cleanedText = cleanedText.replace(/【[^]*?(?:\n|$)/g, "");

// ❌ Remove markdown bold
cleanedText = cleanedText.replace(/\*\*/g, "");

// ❌ Remove headings like ### or ####
cleanedText = cleanedText.replace(/^#{1,6}\s*/gm, "");

// ❌ Remove [1:xyz] style refs
cleanedText = cleanedText.replace(/\[\d+:.*?\]/g, "");

// ❌ Remove ANY .pdf file names
cleanedText = cleanedText.replace(/[\w\s\-–—()]+\.pdf/gi, "");

// ❌ Remove lines mentioning documents
cleanedText = cleanedText.replace(/^.*(document|file|pdf|source|from these|summarized from).*\n?/gim, "");

// ❌ Clean extra spacing
cleanedText = cleanedText.replace(/\n\s*\n/g, "\n").trim();

return cleanedText || "AI is temporarily unavailable.";


  } catch (error) {
    console.error("Chatbot API Error:", error);
    return "AI is temporarily unavailable.";
  }
};


  // ✅ Save user data
  const handleFormSubmit = async () => {
    if (!name.trim() || !mobileNumber.trim() || !email.trim()) {
      setFormError("All fields are required");
      return;
    }

    const phonePattern = /^\d{10}$/;
    if (!phonePattern.test(mobileNumber)) {
      setFormError("Please enter a valid 10-digit mobile number");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(email)) {
      setFormError("Please enter a valid email address");
      return;
    }

    try {
      setFormError("");
      const introText = `Name: ${name}\nEmail: ${email}\nPhone: ${mobileNumber}`;

      setMessages(prev => [
        ...prev,
        { type: "user", text: introText }
      ]);

      setIsTyping(true);

      // ✅ NOW sends chats[] also
      await saveUserData({
        name,
        mobileNumber,
        email,
        chats: [
          {
            sender: "user",
            text: introText
          }
        ]
      });

      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [
          ...prev,
          {
            type: "bot",
            text: "Thank you! \n\nHow can I help you today?"
          }
        ]);

        setIsFormSubmitted(true);
      }, 700);

    } catch (error) {
      console.error("Error saving form:", error);
      setFormError("Failed to save details. Try again.");
      setIsTyping(false);
    }
  };

  // ✅ Send message to AI
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userText = inputMessage;

    // Show user message
    setMessages(prev => [...prev, { type: "user", text: userText }]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // ✅ Save user message in DB
      await saveUserData({
        name,
        mobileNumber,
        email,
        chats: [
          { sender: "user", text: userText }
        ]
      });

      // AI response
      const aiReply = await sendToAI(userText);

      setTimeout(async () => {
        setMessages(prev => [...prev, { type: "bot", text: aiReply }]);

        // ✅ Save bot message in DB
        await saveUserData({
          name,
          mobileNumber,
          email,
          chats: [
            { sender: "bot", text: aiReply }
          ]
        });

        setIsTyping(false);
      }, 600);

    } catch (error) {
      console.error("Chat saving error:", error);
      setIsTyping(false);
    }
  };

const formatMessage = (text) => {
  if (!text) return null;

  // Remove unwanted references and markdown
text = text
  // ✅ HARD DELETE anything starting with 【
  .replace(/【[^]*?(?:\n|$)/g, "")

  // ❌ Remove headings like ### or ####
  .replace(/^#{1,6}\s*/gm, "")

  // ❌ Remove square bracket refs
  .replace(/\[\d+:.*?\]/g, "")

  // ❌ Remove bold
  .replace(/\*\*/g, "")

  // ❌ Remove .pdf filenames
  .replace(/[\w\s\-–—()]+\.pdf/gi, "");


  const lines = text.split("\n").filter(l => l.trim() !== "");

  return lines.map((line, index) => {

    // ✅ Match: 1. Something:
    const isHeader = line.match(/^\d+\.\s.+:/);

    if (isHeader) {
      return (
        <div
          key={index}
          style={{
            fontWeight: "700",
            margin: "12px 0"
          }}
        >
          {line.trim()}
        </div>
      );
    }

    // Normal bullet / text
    return (
      <div key={index} style={{ marginBottom: "6px" }}>
        {line}
      </div>
    );
  });
};



  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowChatbot(prev => !prev)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          backgroundColor: "#faa624",
          color: "white",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease",
          overflow: "visible",
        }}
      >
        {showChatbot ? (
          <span style={{ fontSize: "28px", color: "white" }}>✕</span>
        ) : (
          <svg width="70" height="70" viewBox="0 0 70 70" style={{ position: "absolute" }}>
            <circle cx="35" cy="38" r="15" fill="white"/>
            <line x1="35" y1="23" x2="35" y2="18" stroke="white" strokeWidth="2"/>
            <circle cx="35" cy="16" r="2.5" fill="white"/>
            <circle cx="30" cy="36" r="2.5" fill="#00d9ff"/>
            <circle cx="40" cy="36" r="2.5" fill="#00d9ff"/>
            <rect x="28" y="42" width="14" height="4" rx="2" fill="#0a1e42"/>
            <path d="M 25 52 Q 25 50 27 50 L 43 50 Q 45 50 45 52" 
                  stroke="white" 
                  strokeWidth="3" 
                  fill="none"
                  strokeLinecap="round"/>
            <g transform="translate(48, 20)">
              <rect x="0" y="0" width="18" height="12" rx="3" fill="#00d9ff"/>
              <polygon points="0,8 -3,10 0,12" fill="#00d9ff"/>
              <text x="9" y="9" 
                    textAnchor="middle" 
                    fontSize="8" 
                    fontWeight="bold" 
                    fill="#0a1e42">HI!</text>
            </g>
          </svg>
        )}
      </button>

      {/* Chatbox */}
      {showChatbot && (
        <div
          style={{
   position: "fixed",
   top: isExpanded ? "calc(50% + 40px)" : "auto",
   left: isExpanded ? "50%" : "auto",
   transform: isExpanded ? "translate(-50%, -50%)" : "none",
   bottom: isExpanded ? "auto" : "100px",
   right: isExpanded ? "auto" : "30px",
   width: isExpanded ? "min(95vw, 1200px)" : "360px",
   height: isExpanded ? "min(90vh, 800px)" : "500px",
   backgroundColor: "white",
   borderRadius: "20px",
   boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
   zIndex: 9999,
   display: "flex",
   flexDirection: "column",
   transition: "all 0.3s ease",
   overflow: "hidden"
}}

        >
          {/* Header */}
          <div
            style={{
              backgroundColor: "rgb(0, 48, 63)",
              color: "white",
              padding: isExpanded ? "20px 30px" : "15px 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              transition: "padding 0.3s ease"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{
                width: isExpanded ? "45px" : "35px",
                height: isExpanded ? "45px" : "35px",
                backgroundColor: "#faa624",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease"
              }}>
                <svg width={isExpanded ? "25" : "20"} height={isExpanded ? "25" : "20"} viewBox="0 0 40 40">
                  <circle cx="20" cy="22" r="10" fill="white"/>
                  <circle cx="17" cy="21" r="1.5" fill="#00d9ff"/>
                  <circle cx="23" cy="21" r="1.5" fill="#00d9ff"/>
                  <rect x="16" y="25" width="8" height="2" rx="1" fill="#0a1e42"/>
                </svg>
              </div>
              <div>
                <h5 style={{ 
                  margin: 0, 
                  fontSize: isExpanded ? "20px" : "16px",
                  fontWeight: "600",
                  transition: "font-size 0.3s ease"
                }}>
                  aaMOBee Support
                </h5>
                {isExpanded && (
                  <p style={{ 
                    margin: 0, 
                    fontSize: "13px", 
                    opacity: 0.8,
                    marginTop: "2px"
                  }}>
                    Always here to help
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  padding: isExpanded ? "8px 16px" : "6px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: isExpanded ? "13px" : "11px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  backdropFilter: "blur(10px)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                }}
              >
                {isExpanded ? "□ Minimize" : "⛶ Expand"}
              </button>

              <button
                onClick={() => {
                  setShowChatbot(false);
                  setIsExpanded(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  fontSize: "28px",
                  cursor: "pointer",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "none";
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: isExpanded ? "25px 30px" : "15px",
              backgroundColor: "#f8f9fa",
              transition: "padding 0.3s ease"
            }}
          >
            <div style={{ 
              maxWidth: isExpanded ? "900px" : "100%",
              margin: "0 auto"
            }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                    marginBottom: "15px",
                    animation: "fadeIn 0.3s ease"
                  }}
                >
                  <div
                    style={{
                      maxWidth: isExpanded ? "60%" : "75%",
                      padding: isExpanded ? "12px 18px" : "10px 15px",
                      borderRadius: "18px",
                      backgroundColor: msg.type === "user" ? "#0d6efd" : "#fff",
                      color: msg.type === "user" ? "#fff" : "#333",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      whiteSpace: "pre-line",
                      fontSize: isExpanded ? "15px" : "14px",
                      lineHeight: "1.5",
                      transition: "all 0.3s ease"
                    }}
                  >
                  {msg.type === "bot" ? formatMessage(msg.text) : msg.text}
                  </div>
                </div>
              ))}

              {/* Form */}
              {!isFormSubmitted && (
                <div style={{ marginBottom: "10px" }}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      padding: isExpanded ? "25px" : "15px",
                      borderRadius: "18px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      maxWidth: isExpanded ? "500px" : "100%",
                      margin: "0 auto",
                      transition: "all 0.3s ease"
                    }}
                  >
                    <p style={{
                      fontSize: isExpanded ? "15px" : "13px",
                      textAlign: "center",
                      marginBottom: isExpanded ? "20px" : "12px",
                      color: "#666",
                      fontWeight: "500"
                    }}>
                      Please help me with the following details
                    </p>

                    <input
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        ...inputStyle,
                        padding: isExpanded ? "12px 15px" : "10px",
                        fontSize: isExpanded ? "15px" : "13px"
                      }}
                    />
                    <input
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        ...inputStyle,
                        padding: isExpanded ? "12px 15px" : "10px",
                        fontSize: isExpanded ? "15px" : "13px"
                      }}
                    />
                    <input
                      placeholder="Phone Number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      style={{
                        ...inputStyle,
                        padding: isExpanded ? "12px 15px" : "10px",
                        fontSize: isExpanded ? "15px" : "13px"
                      }}
                    />

                    {formError && (
                      <p style={{ 
                        color: "#dc3545", 
                        fontSize: isExpanded ? "13px" : "11px",
                        marginBottom: "10px",
                        textAlign: "center"
                      }}>
                        {formError}
                      </p>
                    )}

                    <button
                      onClick={handleFormSubmit}
                      style={{
                        width: "100%",
                        padding: isExpanded ? "12px" : "10px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "#faa624",
                        color: "#fff",
                        fontSize: isExpanded ? "15px" : "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#e89515";
                        e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#faa624";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      SEND
                    </button>
                  </div>
                </div>
              )}

              {/* Typing */}
              {isTyping && (
                <div style={{ 
                  paddingLeft: "5px", 
                  color: "#999",
                  fontSize: isExpanded ? "14px" : "13px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{
                    display: "flex",
                    gap: "4px"
                  }}>
                    <span style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#999",
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0s"
                    }}></span>
                    <span style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#999",
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0.16s"
                    }}></span>
                    <span style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#999",
                      borderRadius: "50%",
                      animation: "bounce 1.4s infinite ease-in-out both",
                      animationDelay: "0.32s"
                    }}></span>
                  </div>
                  Typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          {isFormSubmitted && (
            <div
              style={{
                padding: isExpanded ? "20px 30px" : "12px",
                borderTop: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                transition: "padding 0.3s ease"
              }}
            >
              <div style={{ 
                display: "flex", 
                gap: "10px",
                maxWidth: isExpanded ? "900px" : "100%",
                margin: "0 auto"
              }}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your question..."
                  style={{
                    flex: 1,
                    padding: isExpanded ? "14px 20px" : "10px 15px",
                    borderRadius: "25px",
                    border: "1px solid #ddd",
                    fontSize: isExpanded ? "15px" : "14px",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#0d6efd";
                    e.target.style.boxShadow = "0 0 0 3px rgba(13,110,253,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ddd";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  style={{
                    padding: isExpanded ? "14px 28px" : "10px 20px",
                    borderRadius: "25px",
                    border: "none",
                    backgroundColor: "#0d6efd",
                    color: "white",
                    fontSize: isExpanded ? "15px" : "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0b5ed7";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(13,110,253,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#0d6efd";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
            }
            40% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginBottom: "10px",
  fontSize: "13px",
  outline: "none",
  transition: "all 0.2s ease"
};

export default Chatbot;