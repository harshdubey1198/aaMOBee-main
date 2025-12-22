import React from "react";
import { Card, CardBody, Row, Col } from "reactstrap";
import { getPaymentDetailsMain } from "../../apiServices/service";

const ClientSubscriptionDetails = () => {
  const [paymentData, setPaymentData] = React.useState();
  const authUser = JSON.parse(localStorage.getItem('authUser'))?.response;
  const fetchPaymentData = async () => {
    try {
        const response = await getPaymentDetailsMain(authUser?._id);
        // console.log(response);
        setPaymentData(response.data[0]); 
    } catch (error) {
        console.error("Error fetching payment data:", error);
    }
    };

    React.useEffect(() => {
        fetchPaymentData();
    }, []);

  const subscription = paymentData;

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const renderRow = (label, value) => (
    <Row className="mb-2 align-items-start justify-content-evenly" style={{ gap: "10px" }}>
      <Col style={{ flex: "0 0 50%" }} className="text-start fw-bold">{label}</Col>
      <Col className="text-start">: {value}</Col>
    </Row>
  );

  return (
    <Card className="shadow-sm h-90">
      <CardBody>
        <h5 className="mb-4">Subscription Details</h5>
        {renderRow("Plan Name", subscription?.planId?.title)}
        {renderRow("Plan Duration", `${subscription?.planId?.days} days`)}
        {renderRow("Amount Paid", `${subscription?.amount} ${subscription?.currency?.toUpperCase()}`)}
        {renderRow("Status", subscription?.status)}
        {renderRow("Payment Date", formatDate(subscription?.paymentDate))}
        {renderRow("Expires On", formatDate(subscription?.expirationDate))}
      </CardBody>
    </Card>
  );
};

export default ClientSubscriptionDetails;
