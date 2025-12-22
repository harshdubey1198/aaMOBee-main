import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Footer from "../components/footer";
import HeaderwithDashboard from "../components/headerWithDashboard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SecureCloud from "../assets/img/cloud-secure.svg";
import DataPrivacy from "../assets/img/data-protection.svg";
import Commitment from "../assets/img/commitment.svg";
import Transparency from "../assets/img/transparency.webp";
import Compliance from "../assets/img/Compliance.webp";
import Backup from "../assets/img/backup.webp";
import RBAC from "../assets/img/RBAC.webp";
gsap.registerPlugin(ScrollTrigger);

const policies = [
  {
    heading: "1. Secure Cloud Infrastructure",
    points: [
      "All your data is stored on secure, cloud-based servers provided by trusted global infrastructure providers.",
      "These servers are located in highly protected data centers with multiple layers of physical and digital security.",
      "All communication between your device and our servers is encrypted using industry-standard HTTPS/SSL encryption.",
    ],
    gradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    imgSrc: SecureCloud
},
{
    heading: "2. Data Privacy and Confidentiality",
    points: [
      "We do not access, view, or use your business data unless explicitly requested by you for support or troubleshooting purposes.",
      "All sensitive data, including client records, invoices, financial information, and documents, are accessible only by you or your authorized users.",
      "We have strict internal controls in place to prevent unauthorized access to any user data.",
    ],
    gradient: "linear-gradient(135deg, rgb(255 255 255) 0%, rgb(174 251 89 / 17%) 100%)",
    imgSrc: DataPrivacy
},
{
    heading: "3. No Selling or Sharing of Data",
    points: [
      "aaMOBee does not sell, rent, or share your data with any third-party vendors, advertisers, or partners.",
      "Your data will never be used for marketing, analytics, or any activity unrelated to your business account.",
      "We fully respect your right to confidentiality and data ownership.",
    ],
    gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    imgSrc: SecureCloud
},
{
    heading: "4. Role-Based Access Control",
    points: [
      "You control who in your team can access specific data.",
      "With our role-based permissions system, you can assign view-only, edit, or full-access roles to staff users.",
      "This ensures data is only available to the people you trust within your organization.",
    ],
    gradient: "linear-gradient(90deg, rgb(212, 252, 121) 0% ,  rgb(255 255 255) 90%)",
    imgSrc: RBAC
},
{
    heading: "5. Backups and Redundancy",
    points: [
      "Your data is automatically backed up at regular intervals to prevent loss in case of system failure.",
      "Multiple backups are stored in secure locations, ensuring quick recovery and continuity in the event of a technical issue.",
      "Backup data is also encrypted and protected with the same level of security as live data.",
    ],
    gradient: "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
    imgSrc: Backup
},
{
    heading: "6. Transparency and User Rights",
    points: [
        "You have the right to request a copy of your data or request deletion of your account at any time.",
        "You can export your data in standard formats for offline storage or migration.",
        "If you choose to stop using aaMOBee, your data will be deleted securely upon request after a grace period, unless required by applicable laws.",
    ],
    gradient: "linear-gradient(135deg, #c2e9fb 0%, #ffffff 100%)",
    imgSrc: Transparency
},
{
    heading: "7. Compliance and Standards",
    points: [
        "aaMOBee follows best practices for data protection aligned with international standards like GDPR and local laws such as India’s IT Act.",
        "We continually monitor and upgrade our systems to meet the highest security and privacy benchmarks.",
    ],
    gradient: "linear-gradient(90deg, rgb(255, 255, 255) 0%, grey 320%)",
    imgSrc: Compliance
},
{
    heading: "8. Our Commitment",
    points: [
        "We prioritize privacy by design in every new feature we build.",
      "We continuously invest in improving data security protocols.",
      "We treat your business information with the same care and confidentiality we expect for our own.",
    ],
    gradient: "white",
    imgSrc: Commitment
  },
];

const PrivacyPolicyPage = () => {
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    gsap.utils.toArray(".policy-card").forEach((el, i) => {
      gsap.from(el, {
        opacity: 0,
        x: i % 2 === 0 ? -80 : 80,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  return (
    <>
      <HeaderwithDashboard showProducts={showProducts} setShowProducts={setShowProducts} />

      <div style={{ background: "linear-gradient(to right, #f7f9fc, #e0f7fa)", paddingTop: "100px", overflowX: "hidden" }}>
        <Container className="py-5">
          <h1 className="text-center fw-bold mb-4">Data Security & Privacy Policy</h1>
          <p className="text-center fs-5 mb-5 text-muted">
            At aaMOBee, protecting your business data is our top priority. Here's how we keep it safe and private.
          </p>

          {policies.map((section, idx) => (
              <div
                className="policy-card mb-5 p-4 rounded-4 text-dark"
                key={idx}
                style={{
                  background: section.gradient,
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="row align-items-center">
                  {/* Left image if even index */}
                  {idx % 2 === 0 && (
                    <div className="col-md-4 d-none d-md-block">
                      <img
                        src={section.imgSrc}
                        alt={section.heading}
                        className="img-fluid"
                        style={{ maxHeight: "240px", objectFit: "contain" }}
                      />
                    </div>
                  )}

                  {/* Content block */}
                  <div className="col-md-8">
                    <h4 className="fw-semibold">{section.heading}</h4>
                    <ul className="mt-3 ps-3">
                      {section.points.map((point, index) => (
                        <li key={index} style={{ lineHeight: "1.8" }}>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Right image if odd index */}
                  {idx % 2 !== 0 && (
                    <div className="col-md-4 d-none d-md-block">
                      <img
                        src={section.imgSrc}
                        alt={section.heading}
                        className="img-fluid"
                        style={{ maxHeight: "240px", objectFit: "contain" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}


          <div
            className="policy-card mt-5 text-center p-4 rounded-4"
            style={{
              background: "linear-gradient(135deg, #ffffff80, #dfe9f3cc)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p className="fw-bold mb-2">Need Help?</p>
            <p>
              If you have any questions or concerns, reach out to us at{" "}
              <a href="mailto:support@aamobee.com" className="text-primary fw-semibold">
                support@aamobee.com
              </a>
            </p>
          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
