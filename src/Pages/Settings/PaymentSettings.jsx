import React, { useEffect, useState } from "react";

import { getSettings, updateSettings } from "../../apiServices/service";
import { toast } from "react-toastify";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Row, 
  Col, 
  Button, 
  FormGroup, 
  Label, 
  Input, 
  Spinner,
  Badge,
  Alert
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const PaymentSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await getSettings();
        if (res?.data?.length > 0) {
          const s = res.data[0];
          const activeGateway = s.paymentGateways.razorpay.status
            ? "razorpay"
            : s.paymentGateways.stripe.status
            ? "stripe"
            : "";
          setSettings({ ...s, activeGateway });
        }
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handle gateway toggle
  const handleToggle = (gateway) => {
    setSettings((prev) => ({
      ...prev,
      activeGateway: gateway,
      paymentGateways: {
        razorpay: { ...prev.paymentGateways.razorpay, status: gateway === "razorpay" },
        stripe: { ...prev.paymentGateways.stripe, status: gateway === "stripe" },
      },
    }));
  };

  // Save settings to API
  const handleSave = async () => {
    if (!settings?._id) return;
    setSaving(true);
    try {
      const payload = {
        paymentGateways: settings.paymentGateways,
      };
      await updateSettings(settings._id, payload);
      toast.success("Payment settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Breadcrumbs title="Settings" breadcrumbItem="Payment Settings" />

        <Row className="justify-content-center">
          <Col xl={8} lg={10} md={12}>
            <Card className="shadow-sm border-0">
              <CardHeader className="bg-light border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="mb-1 text-primary">
                      <i className="mdi mdi-credit-card-outline me-2"></i>
                      Payment Gateway Settings
                    </h4>
                    <p className="text-muted mb-0 small">
                      Configure your preferred payment gateway for processing transactions
                    </p>
                  </div>
                  {settings?.activeGateway && (
                    <Badge color="success" pill className="px-3 py-2">
                      <i className="mdi mdi-check-circle me-1"></i>
                      {settings.activeGateway === "razorpay" ? "Razorpay" : "Stripe"} Active
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardBody className="p-4">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" size="lg" />
                    <p className="mt-3 text-muted">Loading payment settings...</p>
                  </div>
                ) : settings ? (
                  <div className="payment-gateway-selection">
                    <div className="mb-4">
                      <Label className="form-label fw-semibold text-dark mb-3">
                        <i className="mdi mdi-wallet me-2"></i>
                        Select Payment Gateway
                      </Label>
                      
                      <Alert color="info" className="border-0 bg-light-info mb-4">
                        <i className="mdi mdi-information-outline me-2"></i>
                        <strong>Note:</strong> Only one payment gateway can be active at a time. 
                        Choose the gateway that best fits your business needs.
                      </Alert>

                      <Row className="g-3">
                        <Col md={6}>
                          <div 
                            className={`gateway-option border rounded p-4 cursor-pointer transition-all ${
                              settings.activeGateway === "razorpay" 
                                ? "border-primary bg-light-primary" 
                                : "border-light hover-shadow"
                            }`}
                            onClick={() => handleToggle("razorpay")}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <div 
                                  className={`gateway-icon rounded-circle d-flex align-items-center justify-content-center me-3 ${
                                    settings.activeGateway === "razorpay" 
                                      ? "bg-primary text-white" 
                                      : "bg-light text-muted"
                                  }`}
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="mdi mdi-credit-card-multiple font-size-20"></i>
                                </div>
                                <div>
                                  <h5 className="mb-1">Razorpay</h5>
                                  <p className="text-muted mb-0 small">Popular in India</p>
                                </div>
                              </div>
                              <div className="form-check">
                                <Input
                                  type="radio"
                                  name="gateway"
                                  checked={settings.activeGateway === "razorpay"}
                                  onChange={() => handleToggle("razorpay")}
                                  className="form-check-input"
                                />
                              </div>
                            </div>
                            <div className="gateway-features">
                              <div className="d-flex align-items-center text-muted small mb-2">
                                <i className="mdi mdi-check-circle text-success me-2"></i>
                                UPI, Cards, Net Banking
                              </div>
                              <div className="d-flex align-items-center text-muted small">
                                <i className="mdi mdi-check-circle text-success me-2"></i>
                                Instant settlements
                              </div>
                            </div>
                          </div>
                        </Col>

                        <Col md={6}>
                          <div 
                            className={`gateway-option border rounded p-4 cursor-pointer transition-all ${
                              settings.activeGateway === "stripe" 
                                ? "border-primary bg-light-primary" 
                                : "border-light hover-shadow"
                            }`}
                            onClick={() => handleToggle("stripe")}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center justify-content-between mb-3">
                              <div className="d-flex align-items-center">
                                <div 
                                  className={`gateway-icon rounded-circle d-flex align-items-center justify-content-center me-3 ${
                                    settings.activeGateway === "stripe" 
                                      ? "bg-primary text-white" 
                                      : "bg-light text-muted"
                                  }`}
                                  style={{ width: "50px", height: "50px" }}
                                >
                                  <i className="mdi mdi-credit-card font-size-20"></i>
                                </div>
                                <div>
                                  <h5 className="mb-1">Stripe</h5>
                                  <p className="text-muted mb-0 small">Global payments</p>
                                </div>
                              </div>
                              <div className="form-check">
                                <Input
                                  type="radio"
                                  name="gateway"
                                  checked={settings.activeGateway === "stripe"}
                                  onChange={() => handleToggle("stripe")}
                                  className="form-check-input"
                                />
                              </div>
                            </div>
                            <div className="gateway-features">
                              <div className="d-flex align-items-center text-muted small mb-2">
                                <i className="mdi mdi-check-circle text-success me-2"></i>
                                International cards
                              </div>
                              <div className="d-flex align-items-center text-muted small">
                                <i className="mdi mdi-check-circle text-success me-2"></i>
                                Multi-currency support
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>

                    <div className="d-flex justify-content-between align-items-center pt-4 border-top">
                      <div className="text-muted small">
                        <i className="mdi mdi-shield-check-outline me-1"></i>
                        Your payment data is encrypted and secure
                      </div>
                      
                      <Button
                        color="primary"
                        size="lg"
                        onClick={handleSave}
                        disabled={saving || !settings.activeGateway}
                        className="px-4"
                      >
                        {saving ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-content-save-outline me-2"></i>
                            Save Settings
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="mdi mdi-alert-circle-outline text-warning" style={{ fontSize: "4rem" }}></i>
                    </div>
                    <h5 className="text-muted">No Settings Found</h5>
                    <p className="text-muted">
                      Unable to load payment gateway settings. Please try refreshing the page.
                    </p>
                    <Button color="primary" outline onClick={() => window.location.reload()}>
                      <i className="mdi mdi-refresh me-2"></i>
                      Refresh Page
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      <style jsx>{`
        .bg-light-primary {
          background-color: rgba(116, 120, 241, 0.1) !important;
        }
        .bg-light-info {
          background-color: rgba(58, 186, 244, 0.1) !important;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
          transform: translateY(-2px);
        }
        .transition-all {
          transition: all 0.3s ease;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .gateway-option:hover {
          transform: translateY(-2px);
        }
        .form-check-input:checked {
          background-color: #007bff;
          border-color: #007bff;
        }
      `}</style>
    </React.Fragment>
  );
};

export default PaymentSettingsPage;