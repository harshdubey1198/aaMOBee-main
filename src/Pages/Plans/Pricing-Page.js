import React, { useEffect, useState } from "react";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { Container, Row, Col, Card, CardBody, Button, Table } from "reactstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { ScaleLoader } from "react-spinners";
import { getPaymentDetailsMain } from "../../apiServices/service";
import PaymentHistoryModal from "../../Modal/paymentHistoryModal";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const Pricing = () => {
  document.title = "Pricing | aaMOBee";
  const [plans, setPlans] = useState([]);
  const [selectedPlanDetails, setSelectedPlanDetails] = useState(null);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [openCountries, setOpenCountries] = useState({});
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientAdmin, setClientAdmin] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [adminPlan, setAdminPlan] = useState(null);
  const navigate = useNavigate();
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const [isDemoUser, setIsDemoUser] = useState(authuser?.response?.isDemo || false);
  const role = authuser?.response?.role;
  const token = authuser?.token;
  const [loading, setLoading] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const predefinedFeatures = [
    "Dashboard", "Client Management", "Profile Management",
    "Firm Management [One Firm, One User/Role]",    // Economy
    "Firm Management [One Firm, Role/Many Users]",  // Premium
    "Firm Management [Unlimited Firms, Unlimited User/Role]", // Elite
    "Inventory Management", "Manufacturer Inventory", "Invoicing", "Retail Billing", "CRM Leads"
  ];

  const toggleCountry = (idx) => {
    setOpenCountries((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };
  const handlePaymentHistory = async () => {
    if (role === "client_admin") {
      try {
        const result = await getPaymentDetailsMain(authuser.response._id);
        const sortedPayments = result.data.sort(
          (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate)
        );
        setPaymentHistory(sortedPayments);
        // console.log(sortedPayments);
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    handlePaymentHistory()
  }, []);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let startTime = Date.now();

      try {
        if (role === "firm_admin") {
          const response = await axiosInstance.get(
            `${process.env.REACT_APP_URL}/plan/firmplan/${authuser.response.adminId}`
          );
          setSelectedPlanDetails(response?.data?.adminId?.planId);
        }
        if (role === "client_admin" && !isDemoUser) {
          const response = await axiosInstance.get(
            `${process.env.REACT_APP_URL}/plan/${authuser.response.planId}`
          );
          console.log(response)
          // setSelectedPlanDetails(response?.data?.adminId?.planId);
        }
        else {
          setShowAllPlans(false);
          if (isDemoUser) setShowAllPlans(true);
          const allPlansResponse = await axiosInstance.get(
            `${process.env.REACT_APP_URL}/plan/all`
          );
          setPlans(allPlansResponse.response);
        }

        if (authuser?.response?.planId) {
          const planResponse = await axios.get(
            `${process.env.REACT_APP_URL}/plan/${authuser.response.planId}`,
            config
          );
          setSelectedPlanDetails(planResponse.response);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 3000 - elapsedTime); // Ensure a minimum of 3 seconds

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    fetchData();
  }, [token]);


  // const handlePaymentPlan = (plan) => {

  //   const data = {
  //     userId: authuser.response._id,
  //     planId: plan._id,
  //     amount: plan.price,
  //   };

  //   axiosInstance
  //     .post(`${process.env.REACT_APP_URL}/payment/create-payment`, data)
  //     .then(() => {
  //       toast.success("Payment has been done successfully");
  //       setPaymentSuccess(true);

  //       const updatedAuthUser = {
  //         ...authuser,
  //         response: { ...authuser.response, planId: plan._id },
  //       };
  //       localStorage.setItem("authUser", JSON.stringify(updatedAuthUser));

  //       setSelectedPlanDetails(plan);
  //     })
  //     .catch((error) => {
  //       toast.error("Error creating payment");
  //       console.log("Error creating payment:", error);
  //     });
  // };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Utility" breadcrumbItem="Pricing" />
          {loading ? (
            <div className="d-flex justify-content-center my-4">
              <ScaleLoader color="#0d4251" />
            </div>
          ) : (
            <>
              {selectedPlanDetails && (
                <Row className="justify-content-center">
                  <Col lg={8}>
                    <Card className="shadow-sm mb-4">
                      <CardBody>
                        <div className="text-center mb-4">
                          <h4 className="text-success">Your Current Plan</h4>
                          <h5 className="font-size-18 fw-bold">{selectedPlanDetails.title}</h5>
                          <p className="text-muted">{selectedPlanDetails.caption}</p>
                          <p className="mb-1">
                            <strong>Max Firms:</strong>{" "}
                            {selectedPlanDetails.maxFirms !== undefined
                              ? selectedPlanDetails.maxFirms
                              : "Not specified"}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="plan-features mb-4">
                          <div
                            onClick={() => setFeaturesOpen(!featuresOpen)}
                            style={{ cursor: "pointer" }}
                            className="d-flex align-items-center mb-3"
                          >
                            {featuresOpen ? (
                              <FiChevronDown className="me-2" />
                            ) : (
                              <FiChevronRight className="me-2" />
                            )}
                            <h5 className="font-size-15 mb-0">Plan Features</h5>
                          </div>

                          {featuresOpen && (
                            <div className="d-flex justify-content-center">
                              <div className="text-start w-75">
                                {[
                                  ...[...new Set(predefinedFeatures.map(f => f.split("[")[0].trim()))]
                                    .filter(mainFeature =>
                                      selectedPlanDetails.features.some(
                                        f => f.split("[")[0].trim() === mainFeature
                                      )
                                    ),
                                  ...[...new Set(predefinedFeatures.map(f => f.split("[")[0].trim()))]
                                    .filter(mainFeature =>
                                      !selectedPlanDetails.features.some(
                                        f => f.split("[")[0].trim() === mainFeature
                                      )
                                    )
                                ].map((mainFeature, index) => {
                                  const matchedFeature = predefinedFeatures.find(
                                    f => f.split("[")[0].trim() === mainFeature
                                  );
                                  const isSelected = selectedPlanDetails.features.some(
                                    f => f.split("[")[0].trim() === mainFeature
                                  );

                                  const subLabel = matchedFeature.includes("[")
                                    ? matchedFeature.substring(
                                      matchedFeature.indexOf("[") + 1,
                                      matchedFeature.indexOf("]")
                                    )
                                    : null;

                                  return (
                                    <p key={index} className="mb-2">
                                      <i
                                        className={`mdi ${isSelected
                                          ? "mdi-checkbox-marked-circle-outline text-success"
                                          : "mdi-close-circle-outline text-danger"
                                          } font-size-16 align-middle me-2`}
                                      ></i>
                                      {mainFeature}
                                      {subLabel && (
                                        <span className="text-muted small ms-2">[{subLabel}]</span>
                                      )}
                                    </p>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Pricing */}
                        {selectedPlanDetails.prices && paymentHistory[0] && (
                          <div className="plan-prices">
                            <h5 className="font-size-15 mb-3">Pricing</h5>
                            {selectedPlanDetails.prices
                              .filter(
                                p => p.currency.toUpperCase() === paymentHistory[0].currency.toUpperCase()
                              )
                              .map((p, idx) => (
                                <Card key={idx} className="mb-2 shadow-sm">
                                  <CardBody className="p-2">
                                    <div
                                      onClick={() => toggleCountry(`current-${idx}`)}
                                      style={{ cursor: "pointer" }}
                                      className="d-flex align-items-center justify-content-between"
                                    >
                                      <h6 className="fw-bold mb-0 d-flex align-items-center">
                                        <span style={{ minWidth: "120px", display: "inline-block" }}>
                                          {p.country.charAt(0).toUpperCase() + p.country.slice(1)}
                                        </span>
                                        <span className="ms-2">({p.currency}) – Base {p.basePrice}</span>
                                      </h6>

                                      {openCountries[`current-${idx}`] ? (
                                        <FiChevronDown />
                                      ) : (
                                        <FiChevronRight />
                                      )}
                                    </div>

                                    {openCountries[`current-${idx}`] && (
                                      <div className="mt-2">
                                        <Table bordered size="sm" responsive className="mb-0">
                                          <thead className="table-light">
                                            <tr>
                                              <th>Duration</th>
                                              <th>Validity (Days)</th>
                                              <th>Original Price</th>
                                              <th>Offer Price</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {p.offers.map((o, i) => {
                                              const isBought = o.discountedPrice === paymentHistory[0]?.amount;
                                              return (
                                                <tr
                                                  key={i}
                                                  style={isBought ? { backgroundColor: "#e6ffed", fontWeight: "bold" } : {}}
                                                >
                                                  <td>{o.durationValue} {o.durationType}</td>
                                                  <td>{o.days}</td>
                                                  <td><s>{o.originalPrice}</s></td>
                                                  <td className={isBought ? "text-success" : ""}>
                                                    {o.discountedPrice} {isBought && "✅"}
                                                  </td>
                                                </tr>
                                              );
                                            })}


                                          </tbody>
                                        </Table>
                                      </div>
                                    )}
                                  </CardBody>
                                </Card>
                              ))}
                          </div>
                        )}

                        {role === "client_admin" && (
                          <div className="text-center mt-3">
                            <Button color="primary" onClick={toggleModal}>
                              Show Payment History
                            </Button>
                          </div>
                        )}
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}


            </>
          )}

          {plans.length > 0 && (
            <Row className="justify-content-center my-2">
              <Col lg={5} className="text-center">
                {role !== "super_admin" && role !== "firm_admin" && !isDemoUser && (
                  <Button
                    color="primary"
                    onClick={() => setShowAllPlans(!showAllPlans)}
                  >
                    {showAllPlans ? "Hide All Plans" : "Show All Plans"}
                  </Button>
                )}
              </Col>
            </Row>
          )}

          <PaymentHistoryModal
            isOpen={modalOpen}
            toggle={toggleModal}
            paymentHistory={paymentHistory}
          />
          {(role === "super_admin" || isDemoUser || (role !== "firm_admin" && showAllPlans)) && (

            <Row className="justify-content-center">
              <div className="text-center mb-2">
                <h4>
                  {role === "super_admin"
                    ? "All Available Plans"
                    : isDemoUser
                      ? "Available plans to purchase"
                      : "Choose your Pricing plan"}
                </h4>
              </div>
              {isDemoUser && (
                <Row className="justify-content-center mb-3">
                  <Col lg={8} className="text-center">
                    <div className="alert alert-info">
                      You are currently exploring a <strong>trial/demo plan</strong>. All plans are visible for exploration.
                    </div>
                  </Col>
                </Row>
              )}

              {plans.map((plan, key) => (
                <Col xl={4} md={6} key={key} className="mb-2">
                  <Card className="d-flex flex-column h-100">
                    <CardBody className="p-4 d-flex flex-column flex-grow-1">
                      <div className="text-left">
                        <div className="d-flex mb-1 pt-3" style={{ minHeight: "120px" }}>
                          <div className="flex-shrink-0 me-3 ">
                            <div className="avatar-sm">
                              <span className="avatar-title rounded-circle bg-primary">
                                <i className={plan.icon + " font-size-20"}></i>
                              </span>
                            </div>
                          </div>
                          <div className="flex-grow-1">
                            <h5 className="font-size-16">{plan.title}</h5>
                            <p className="text-muted" style={{ wordWrap: "break-word" }}>
                              {plan.caption}
                            </p>
                          </div>
                        </div>


                        <div className="plan-features mt-4">
                          <div
                            onClick={() => setFeaturesOpen(!featuresOpen)}
                            style={{ cursor: "pointer" }}
                            className="d-flex align-items-center mb-3"
                          >
                            {featuresOpen ? (
                              <FiChevronDown className="me-2" />
                            ) : (
                              <FiChevronRight className="me-2" />
                            )}
                            <h5 className="font-size-15 mb-0">Plan Features</h5>
                          </div>

                          {featuresOpen && (
                            <div>
                              {[
                                ...[...new Set(predefinedFeatures.map(f => f.split('[')[0].trim()))]
                                  .filter(mainFeature =>
                                    plan.features.some(f => f.split('[')[0].trim() === mainFeature)
                                  ),
                                ...[...new Set(predefinedFeatures.map(f => f.split('[')[0].trim()))]
                                  .filter(mainFeature =>
                                    !plan.features.some(f => f.split('[')[0].trim() === mainFeature)
                                  )
                              ].map((mainFeature, index) => {
                                const matchedFeature = predefinedFeatures.find(f =>
                                  f.split('[')[0].trim() === mainFeature
                                );
                                const isSelected = plan.features.some(f =>
                                  f.split('[')[0].trim() === mainFeature
                                );

                                const subLabel = matchedFeature.includes('[')
                                  ? matchedFeature.substring(matchedFeature.indexOf('[') + 1, matchedFeature.indexOf(']'))
                                  : null;

                                return (
                                  <p key={index} className="text-start mb-2">
                                    <i
                                      className={`mdi ${isSelected
                                        ? "mdi-checkbox-marked-circle-outline text-success"
                                        : "mdi-close-circle-outline text-danger"
                                        } font-size-16 align-middle me-2`}
                                    ></i>
                                    {mainFeature}
                                    {subLabel && (
                                      <div className="text-muted small mt-1 ms-4">[{subLabel}]</div>
                                    )}
                                  </p>
                                );
                              })}
                            </div>
                          )}
                        </div>


                        {/* { role !== "super_admin" && role!=="firm_admin" && (
                            <Button
                              color="primary"
                              className="mt-4"
                              onClick={() => handlePaymentPlan(plan)}
                            >
                              Choose Plan
                            </Button>x
                          )} */}
                        {plan.prices?.map((p, idx) => (
                          <div key={idx} className="mt-3">
                            <div
                              onClick={() => toggleCountry(`${plan._id}-${idx}`)}
                              style={{ cursor: "pointer" }}
                              className="d-flex align-items-center justify-content-between"
                            >
                              <h6 className="fw-bold mb-0">
                                {p.country.charAt(0).toUpperCase() + p.country.slice(1)} ({p.currency}) – Base {p.basePrice}
                              </h6>
                              {openCountries[`${plan._id}-${idx}`] ? (
                                <FiChevronDown />
                              ) : (
                                <FiChevronRight />
                              )}
                            </div>

                            {openCountries[`${plan._id}-${idx}`] && (
                              <div className="mt-2">
                                <Table bordered size="sm" responsive className="mb-0">
                                  <thead className="table-light">
                                    <tr>
                                      <th>Duration</th>
                                      <th>Days</th>
                                      <th>Original</th>
                                      <th>Discounted</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {p.offers.map((o, i) => (
                                      <tr key={i}>
                                        <td className="text-capitalize">
                                          {o.durationValue} {o.durationType}
                                        </td>
                                        <td>{o.days}</td>
                                        <td><s>{o.originalPrice}</s></td>
                                        <td className="fw-bold text-success">{o.discountedPrice}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </Table>
                              </div>
                            )}
                          </div>
                        ))}


                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Pricing;
