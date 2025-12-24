import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { getFAQBySlug } from "../../apiServices/service";
import { Spinner, Card, CardBody, Badge, Button } from "reactstrap";

function FaqDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [faq, setFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(slug);

  const fetchFAQ = async () => {
    setLoading(true);
    try {
      const data = await getFAQBySlug(slug);
      console.log(data?.data || " ");
      setFaq(data?.data || " ");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchFAQ();
  }, [slug]);

  if (loading)
    return (
      <div className="page-content d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );

  if (!faq) return <div className="page-content">FAQ not found.</div>;

  return (
    <div className="page-content">
      <Breadcrumbs title="aaMOBee" breadcrumbItem="FAQ Detail" />
      <Button color="secondary" className="mb-3" onClick={() => navigate(-1)}>
        &larr; Back
      </Button>
      <Card className="shadow-sm mt-3">
        <CardBody>
          <h4>{faq.question}</h4>
          <Badge
            color={
              faq.category === "Security" ? "danger" :
                faq.category === "Billing" ? "warning" :
                  faq.category === "Integrations" ? "success" :
                    faq.category === "Troubleshooting" ? "primary" :
                      "info"
            }
            pill
            className="mb-2"
          >
            {faq.category || "N/A"}
          </Badge>
          <p>{faq.answer}</p>

          {faq.media && faq.media.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {faq.media.map((m, idx) => (
                <div key={idx}>
                  {m.type === "video" ? (
                    <video width="200" height="120" controls>
                      <source src={m.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img src={m.url} alt="FAQ Media" style={{ width: "200px", height: "120px", objectFit: "cover" }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default FaqDetail;
