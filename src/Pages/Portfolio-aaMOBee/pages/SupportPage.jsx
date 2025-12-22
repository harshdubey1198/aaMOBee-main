import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Footer from "../components/footer";
import HeaderwithDashboard from "../components/headerWithDashboard";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
      <HeaderwithDashboard showProducts={showProducts} setShowProducts={setShowProducts}/>

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
                <h1 className="fw-bold mb-3">aaMOBee Customer Support</h1>
                <p className="text-muted mb-5 fs-5">We’re here to help — wherever you are</p>

                <div className="row g-4">
                <div className="col-md-4 animate-on-scroll">
                    <div className="card shadow-sm h-100 border-0" style={{ borderRadius: "1rem" }}>
                    <div className="card-body">
                        <h5 className="card-title fw-bold">Classic Support 🧰</h5>
                        <p className="card-text text-muted">
                        Great for startups and new businesses. Reach us via email, call, or chat.
                        Includes standard onboarding and resolution within business hours.
                        </p>
                        <ul className="text-start small">
                        <li>✔ Email & Chat Support</li>
                        <li>✔ Basic Setup Help</li>
                        <li>✔ Response in 12–24 hrs</li>
                        </ul>
                    </div>
                    </div>
                </div>

                <div className="col-md-4 animate-on-scroll">
                    <div className="card shadow h-100 border-0" style={{ borderRadius: "1rem" }}>
                    <div className="card-body">
                        <h5 className="card-title fw-bold">Premium Support 🚀</h5>
                        <p className="card-text text-muted">
                        Faster response, onboarding sessions, and 24/7 channel support. Designed for growing teams.
                        </p>
                        <ul className="text-start small">
                        <li>✔ 24x7 Email & WhatsApp</li>
                        <li>✔ Expert Onboarding</li>
                        <li>✔ SLA-based Response</li>
                        </ul>
                    </div>
                    </div>
                </div>

                <div className="col-md-4 animate-on-scroll">
                    <div className="card shadow-lg h-100 border-0" style={{ borderRadius: "1rem" }}>
                    <div className="card-body">
                        <h5 className="card-title fw-bold">Enterprise Support 🏢</h5>
                        <p className="card-text text-muted">
                        Dedicated Technical Account Manager (TAM), performance reviews, and proactive strategy support.
                        </p>
                        <ul className="text-start small">
                        <li>✔ TAM Assignment</li>
                        <li>✔ Quarterly Performance Calls</li>
                        <li>✔ Early Access to Features</li>
                        </ul>
                    </div>
                    </div>
                </div>
                </div>

                <div className="mt-5 row justify-content-center animate-on-scroll">
                <div className="col-md-8">
                    <div className="p-4 bg-white rounded shadow-sm">
                    <h5 className="mb-3">Need quick help?</h5>
                    <p className="text-muted mb-1">
                        Use WhatsApp during support hours for fastest resolution.
                    </p>
                    <p className="text-muted mb-1">📱 <strong>India:</strong> Mon–Sat, 10 AM–6 PM IST</p>
                    <p className="text-muted mb-1">📱 <strong>UAE:</strong> Mon–Fri, 9 AM–5 PM GST</p>
                    <p className="text-muted">📧 Email: support@aamobee.com</p>
                    </div> 
                </div>
                </div>
            </div>
     </div>
     {/* Middle Section: Services Info */}
        <section className="py-5 animate-on-scroll" style={{ background: "#f5faff" }}>
        <Container>
            <h2 className="text-center mb-4 fw-bold">aaMOBee Services We Offer</h2>
            <p className="text-center text-muted mb-5">
            From onboarding to training, we’ve got you covered with our all-in-one enterprise services.
            </p>
            <Row className="g-4">
            <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm border-0">
                <Card.Img
                    variant="top"
                    src="https://cdn-icons-png.flaticon.com/512/2706/2706759.png"
                    alt="Turnkey Solutions"
                    style={{ height: "150px", objectFit: "contain", padding: "20px" }}
                />
                <Card.Body>
                    <Card.Title>Turnkey Solutions</Card.Title>
                    <Card.Text className="text-muted small">
                    If you're a mid to large business, our Enterprise Solutions team will implement, customize, and optimize your aaMOBee suite for end-to-end efficiency.
                    </Card.Text>
                    <a href="#" className="text-primary small">Learn more &gt;</a>
                </Card.Body>
                </Card>
            </Col>
            <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm border-0">
                <Card.Img
                    variant="top"
                    src="https://cdn-icons-png.flaticon.com/512/1904/1904425.png"
                    alt="Configuration Help"
                    style={{ height: "150px", objectFit: "contain", padding: "20px" }}
                />
                <Card.Body>
                    <Card.Title>Configuration Help</Card.Title>
                    <Card.Text className="text-muted small">
                    Skip the setup stress. Our Jumpstart service offers dedicated experts to configure your aaMOBee modules—fast and tailored to your goals.
                    </Card.Text>
                    <a href="#" className="text-primary small">Learn more &gt;</a>
                </Card.Body>
                </Card>
            </Col>
            <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm border-0">
                <Card.Img
                    variant="top"
                    src="https://cdn-icons-png.flaticon.com/512/2942/2942846.png"
                    alt="Product Training"
                    style={{ height: "150px", objectFit: "contain", padding: "20px" }}
                />
                <Card.Body>
                    <Card.Title>Product Training</Card.Title>
                    <Card.Text className="text-muted small">
                    Learn how to get the best out of aaMOBee with online or on-site hands-on training from our expert coaches—covering setup, workflows, and best practices.
                    </Card.Text>
                    <a href="#" className="text-primary small">Learn more &gt;</a>
                </Card.Body>
                </Card>
            </Col>
            <Col md={6} lg={3}>
                <Card className="h-100 shadow-sm border-0">
                <Card.Img
                    variant="top"
                    src="https://cdn-icons-png.flaticon.com/512/4341/4341139.png"
                    alt="Onboarding"
                    style={{ height: "150px", objectFit: "contain", padding: "20px" }}
                />
                <Card.Body>
                    <Card.Title>Onboarding</Card.Title>
                    <Card.Text className="text-muted small">
                    Get personalized onboarding with one-on-one walkthroughs of your aaMOBee modules to ensure every feature fits your unique business needs.
                    </Card.Text>
                </Card.Body>
                </Card>
            </Col>
            </Row>
        </Container>
        </section>


      <Footer className="animate-on-scroll"/>
    </>
  );
};

export default SupportPage;
