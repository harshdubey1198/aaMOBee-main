import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Nav, NavItem, NavLink, TabContent, TabPane, Table, Spinner, Collapse } from "reactstrap";
import classnames from "classnames";
import { getDemoUserLogsById } from "../../apiServices/service"; 
import { toast } from "react-toastify";

const DemoUserLogsModal = ({ isOpen, toggle, userId }) => {
  const [activeTab, setActiveTab] = useState("actions");
  const [logs, setLogs] = useState({ actionLogs: [], routeLogs: [] });
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("Demo User"); 
  const [openRoute, setOpenRoute] = useState(null);
  const toggleRoute = (route) => setOpenRoute(openRoute === route ? null : route);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      if (!userId) {
        toast.info("User ID not provided");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await getDemoUserLogsById(userId);

        const demoUser = response?.data?.demoUserId;
        if (!demoUser) {
          toast.info("Demo user not found");
          setFirstName("Demo User");
          setLogs({ actionLogs: [], routeLogs: [] });
          return;
        }

        setFirstName(demoUser.firstName || "Demo User");
        const rawActions = response.data?.actionLogs || [];
        const groupedActions = rawActions.reduce((acc, log) => {
        const route = log.route || "Unknown Route";
        if (!acc[route]) acc[route] = [];
        acc[route].push(log);
        return acc;
        }, {});

        setLogs({
        actionLogs: groupedActions,
        routeLogs: response.data?.routeLogs || []
        });


        if ((response.data?.actionLogs?.length === 0) && (response.data?.routeLogs?.length === 0)) {
          toast.info("No logs found for this user");
        }

      } catch (err) {
        console.error("Error fetching logs:", err?.message);
        toast.error("Failed to fetch logs: " + (err?.message || "Unknown error"));
        setLogs({ actionLogs: [], routeLogs: [] });
        setFirstName("Demo User");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) fetchLogs();
  }, [userId, isOpen]);

  return (
    <>

      <Modal isOpen={isOpen} toggle={toggle} size="lg" className="enhanced-modal">
        <ModalHeader toggle={toggle}>
          Demo User Log - {firstName}
        </ModalHeader>
        <ModalBody>
          <Nav tabs className="enhanced-tabs">
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "actions" })}
                onClick={() => toggleTab("actions")}
              >
                🎯 Actions Logs
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "routes" })}
                onClick={() => toggleTab("routes")}
              >
                🗺️ Routes Logs
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab} className="enhanced-tab-content">
            <TabPane tabId="actions">
            {loading ? (
                <div className="enhanced-spinner-container">
                <div className="enhanced-spinner"></div>
                <div className="enhanced-spinner-text">Loading action logs...</div>
                </div>
            ) : Object.keys(logs.actionLogs || {}).length > 0 ? (
                <div>
                {Object.keys(logs.actionLogs)
                    .sort((a, b) => a.localeCompare(b))
                    .map((route, idx) => {
                    const cleanRoute = route.replaceAll("/", " ").trim() || "Home";
                    return (
                        <div key={idx} className="mb-3 border rounded overflow-hidden">
                        <div
                            className="d-flex justify-content-between align-items-center bg-light p-2 px-3"
                            style={{ cursor: "pointer" }}
                            onClick={() => toggleRoute(route)}
                        >
                            <strong>{cleanRoute}</strong>
                            <span>{openRoute === route ? "▲" : "▼"}</span>
                        </div>
                        <Collapse isOpen={openRoute === route}>
                            <div className="p-3 bg-white">
                            <Table bordered responsive size="sm" className="enhanced-table">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Type</th>
                                    <th>Tag</th>
                                    <th>Class/ID</th>
                                    <th>Route</th>
                                    <th>Timestamp</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Array.isArray(logs.actionLogs[route]) &&
                                    logs.actionLogs[route].map((log, i) => (
                                    <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{log.type || "N/A"}</td>
                                        <td>{log.tag || "N/A"}</td>
                                        <td>{log.className || "N/A"}</td>
                                        <td>{cleanRoute}</td>
                                        <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </Table>
                            </div>
                        </Collapse>
                        </div>
                    );
                    })}
                </div>
            ) : (
                <div className="enhanced-empty-state">
                <div className="enhanced-empty-icon">📋</div>
                <div className="enhanced-empty-text">No action logs found</div>
                </div>
            )}
            </TabPane>

            <TabPane tabId="routes">
              {loading ? (
                <div className="enhanced-spinner-container">
                  <div className="enhanced-spinner"></div>
                  <div className="enhanced-spinner-text">Loading route logs...</div>
                </div>
              ) : logs.routeLogs.length > 0 ? (
                <Table className="enhanced-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Page Visited</th>
                      <th>Time Spent</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.routeLogs.map((log, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{log.route || "N/A"}</td>
                        <td>
                          {log.timeSpent ? (
                            <span className="time-badge">
                              {log.timeSpent.replace(/_/g, ":")}
                            </span>
                          ) : "N/A"}
                        </td>
                        <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="enhanced-empty-state">
                  <div className="enhanced-empty-icon">🗺️</div>
                  <div className="enhanced-empty-text">No route logs found</div>
                </div>
              )}
            </TabPane>
          </TabContent>
        </ModalBody>
        <ModalFooter>
          <Button className="enhanced-close-btn" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DemoUserLogsModal;