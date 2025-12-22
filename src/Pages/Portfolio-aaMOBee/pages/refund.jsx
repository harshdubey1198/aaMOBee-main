import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Footer from "../components/footer";
import HeaderwithDashboard from "../components/headerWithDashboard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const refundPolicyCards = [
  {
    title: "Eligibility for Refund 💸",
    points: [
      "You can request a refund within 7 calendar days from the date your subscription is activated.",
      "Refunds apply only to <b>new annual subscriptions</b>, not to upgrades, renewals, or pro-rated module additions.",
      "Returning users or reactivated accounts are not eligible for refunds under this policy.",
      "This policy is valid only for <i>first-time purchases</i> and cannot be reused after cancellation.",
    ],
  },
  {
    title: "Pro-Rata Refund Calculation 💰",
    points: [
      "If a refund is requested within the eligible <b>7-day period</b>, a pro-rata calculation is applied.",
      "The refund is based on the <i>number of days the service was used</i> before cancellation.",
      "For example, canceling on day 4 means you'll pay for 4 days, and the rest will be refunded.",
      "The formula used: <b>(Total Paid – Bank Charges) – Cost for Days Used</b>.",
    ],
  },
  {
    title: "Payment Gateway Deductions 🏦",
    points: [
      "Any <b>payment gateway charges</b> (like Stripe fees or bank transfer charges) are deducted from the refund.",
      "These charges are collected by <i>third-party providers</i> and not by aaMOBee.",
      "Final refund amount is adjusted based on actual third-party costs incurred during the transaction.",
    ],
  },
  {
    title: "Refund Timeline ⏳",
    points: [
      "Refunds are processed within <b>25 working days</b> from the cancellation approval date.",
      "The amount is refunded to your <i>original payment method</i> (e.g., card or bank).",
      "You’ll receive a <b>confirmation email</b> once the refund is processed.",
      "Weekends and national holidays in India and UAE are not counted as working days.",
    ],
  },
  {
    title: "Refund Denial Conditions ❌",
    points: [
      "Refunds are denied if requested after the <b>7-day window</b>.",
      "If the service is <i>extensively used</i> (data/report downloads), the refund will be declined.",
      "Repeated refund requests or policy misuse leads to denial.",
      "Refunds are not valid for <b>add-ons, upgrades, or renewals</b>.",
    ],
  },
  {
    title: "How to Request a Refund ✉️",
    points: [
      "Send an email to <b>paymenthelp@aamobee.com</b> to start your refund request.",
      "Include your <i>registered email</i>, <i>firm name</i>, and <i>transaction/invoice ID</i>.",
      "Mention the <b>subscription start date</b> and reason for cancellation (optional).",
      "Our support team will reply in <b>2 to 5 working days</b> with the next steps.",
    ],
  },
  {
    title: "Legal Validity & Jurisdiction ⚖️",
    points: [
      "This policy is governed by the laws of <b>India</b> and the <b>United Arab Emirates</b>.",
      "Any disputes will be handled in <i>good faith</i> with fair resolution practices.",
      "The terms comply with <b>international consumer protection standards</b>.",
      "We may update this policy <b>with or without notice</b> at any time.",
    ],
  },
];

const SupportPage = () => {
  useEffect(() => {
    gsap.utils.toArray(".animate-on-scroll").forEach((el) => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const [showProducts, setShowProducts] = useState(false);

  return (
    <>
      <HeaderwithDashboard showProducts={showProducts} setShowProducts={setShowProducts} />

      {/* Header Section */}
      <div
        className="text-dark text-center py-5"
        style={{
          background: "linear-gradient(to right, #e0ecff, #fefcea)",
          marginTop: "80px",
          minHeight: "calc(100vh - 80px)",
        }}
      >
        <div className="container">
          <h1 className="fw-bold mb-3" style={{ marginBottom: "60px" }}>
            Refund Policy – Clear Terms for Transparent Service
          </h1>
          <p className="text-muted mb-5 fs-5">
            At aaMOBee, we strive to offer high-quality services that meet the needs of every business we
            support. However, we understand that situations may arise where a user may wish to cancel
            their subscription. In such cases, our refund policy is designed to be fair, simple, and
            transparent for all parties involved.
            Please read the full refund terms below before making a purchase.
          </p>

          <div className="row g-4" style={{ lineHeight: "1.8", marginTop: "30px" }}>
            <div className="row">
              {refundPolicyCards.slice(0, 6).map((card, index) => (
                <div className="col-md-4 col-sm-6 animate-on-scroll mb-4" key={index}>
                  <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "1rem" }}>
                    <div className="card-body">
                      <h5 className="card-title fw-bold">{card.title}</h5>
                      <ul className="text-start medium">
                        {card.points.map((point, idx) => (
                          <li key={idx} dangerouslySetInnerHTML={{ __html: point }}></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 7th card in its own centered row */}
            <div className="mt-5 row justify-content-center animate-on-scroll">
              <div className="col-md-6 col-sm-8 mb-4">
                <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "1rem" }}>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{refundPolicyCards[6].title}</h5>
                    <ul className="text-start medium">
                      {refundPolicyCards[6].points.map((point, idx) => (
                        <li key={idx} dangerouslySetInnerHTML={{ __html: point }}></li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SupportPage;
