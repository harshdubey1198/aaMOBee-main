import React, { useEffect, useState } from 'react';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Col, Card, CardBody } from 'reactstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import {format, differenceInDays} from "date-fns"
const ClientsPayments = () => {
  const [payments, setPayments] = useState([]); 
  const [hoveredFirmId, setHoveredFirmId] = useState(null); 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMM yy");
  };
  const calculateDaysLeft = (expirationDateString) => {
    const today = new Date();
    const expirationDate = new Date(expirationDateString);
    return differenceInDays(expirationDate, today);
  };
  // Get the token from localStorage
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const token = authuser?.token;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${process.env.REACT_APP_URL}/payment/get-payment`, config);
        console.log(response.data.data , "response")
        setPayments(response.data.data); 
      } catch (error) {
        console.log(error);
        toast.error('Error fetching payments');
      }
    };

    fetchPayments();
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
                    {payments.map((payment) => (
                      <tr
                        key={payment._id}
                        onMouseEnter={() => setHoveredFirmId(payment._id)}
                        onMouseLeave={() => setHoveredFirmId(null)}
                      >
                        <td>{payment.userId.firstName}</td>
                        <td>{payment.userId.email}</td>
                        <td>{payment.planId.title}</td>
                        <td style={{ padding: "10px" }}>
                              <div style={{ fontWeight: "bold" }}>
                                {calculateDaysLeft(payment.expirationDate)} days left
                              </div>
                              <div style={{ fontSize: "12px", color: "gray" }}>
                                / {payment.planId.days} days
                              </div>
                            </td>
                        <td>{formatDate(payment.paymentDate)}<br/>{formatDate(payment.expirationDate)}</td>
                        <td>{payment.status}</td>
                      </tr>
                    ))}
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
