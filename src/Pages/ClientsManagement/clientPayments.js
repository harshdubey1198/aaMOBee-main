import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Col, Card, CardBody } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { format, differenceInDays, isValid } from "date-fns";

const ClientsPayments = () => {
  const [payments, setPayments] = useState([]);
  const [hoveredFirmId, setHoveredFirmId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isValid(date) ? format(date, "dd MMM yy") : "Invalid Date";
  };

  const calculateDaysLeft = (expirationDateString) => {
    if (!expirationDateString) return "N/A";
    const today = new Date();
    const expirationDate = new Date(expirationDateString);
    return isValid(expirationDate) ? differenceInDays(expirationDate, today) : "N/A";
  };

  // Get the token from localStorage
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const token = authuser?.token;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`${process.env.REACT_APP_URL}/payment/get-payment`, config);

        if (Array.isArray(response.data.data)) {
          setPayments(response.data.data);
        } else {
          setPayments([]);
          toast.error("No payment data found");
        }
      } catch (error) {
        console.log(error);
        toast.error("Error fetching payments");
      }
    };

    if (token) fetchPayments();
  }, [token]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="aaMOBee" breadcrumbItem="Client Payments" />
        <div className="d-flex justify-content-between mb-4">
          <p className="mm-active">
            This is the Clients-Payment page. Here you can view the list of client payments.
          </p>
        </div>
        <Col lg={12}>
          <Card>
            <CardBody>
              <div className="table-responsive mt-4">
                <table className="table table-bordered mb-0">
                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>User Email</th>
                      <th>Plan Name</th>
                      <th>Days Left</th>
                      <th>From-To</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr
                          key={payment._id}
                          onMouseEnter={() => setHoveredFirmId(payment._id)}
                          onMouseLeave={() => setHoveredFirmId(null)}
                        >
                          <td>{payment?.userId?.firstName || "N/A"}</td>
                          <td>{payment?.userId?.email || "N/A"}</td>
                          <td>{payment?.planId?.title || "N/A"}</td>
                          <td style={{ padding: "10px" }}>
                            <div style={{ fontWeight: "bold" }}>
                              {calculateDaysLeft(payment.expirationDate) !== "N/A"
                                ? `${calculateDaysLeft(payment.expirationDate)} days left`
                                : "N/A"}
                            </div>
                            <div style={{ fontSize: "12px", color: "gray" }}>
                              / {payment?.planId?.days || "N/A"} days
                            </div>
                          </td>
                          <td>
                            {formatDate(payment.paymentDate)}<br />
                            {formatDate(payment.expirationDate)}
                          </td>
                          <td>{payment.status || "N/A"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center" }}>
                          No payments found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </Col>
      </div>
      <style>{`
        .hover-details {
          position: absolute;
          background: white;
          border: 1px solid #ccc;
          padding: 10px;
          bottom: 4px;
          right: 0px;
          box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </React.Fragment>
  );
};

export default ClientsPayments;
