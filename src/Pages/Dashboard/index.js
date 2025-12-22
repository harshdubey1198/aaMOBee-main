import React from "react";
import { Row, Container, Col } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import SelfProfiling from "../Utility/SelfProfiling";
import RoleBasedAnalytics from "./RoleBasedAnalytics";
import RoleBasedAnalytics2 from "./RoleBasedAnalytics2";
import ClientSubscriptionDetails from "./ClientSubscriptionDetails";
const Dashboard = () => {
  const authuser = JSON.parse(localStorage.getItem('authUser'))?.response
  document.title = "Dashboard | aaMOBee";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="aaMOBee" breadcrumbItem="Dashboard" />
            <RoleBasedAnalytics/>
          <Row className="justify-content-between gx-3 gy-3 align-items-stretch"  style={{marginBottom:"20px"}}>
            <Col sm="12" md="6" lg="6"  className="d-flex">  
              <RoleBasedAnalytics2 />
            </Col>
            {(authuser?.role === "client_admin") && (
                <Col sm="12" md="6" lg="6">
                  <ClientSubscriptionDetails />
                </Col>
              )}
            
            <Col sm="12" md="6" lg="6"  className="d-flex">
              <SelfProfiling /> 
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
