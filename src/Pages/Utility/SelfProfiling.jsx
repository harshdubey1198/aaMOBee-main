import axios from 'axios';
import React, { useState ,useEffect } from 'react'
import { Card, CardBody, Col, Row } from 'reactstrap';

function SelfProfiling() {
    const authuser = JSON.parse(localStorage.getItem('authUser'))?.response
    // const userId = authuser?._id

    // useEffect(() => {
    //     const selfProfiling = async () => {
    //         try {
    //             const response = await axios.get(`${process.env.REACT_APP_URL}/auth/getaccount/${userId}`);
    //             // console.log(response)
    //         } catch (error) {
    //             console.error("Error fetching user count:", error);
    //         }
    //     };
    //     selfProfiling()
    // }
    // ,[])
  const getDisplayRole = (role) => {
      if (role === "client_admin") return "Super Admin";
      if (role === "super_admin") return "Control Panel";
       return role?.replace(/[_-]/g, " ")
                   .replace(/\b\w/g, (char) => char.toUpperCase());
   };

  const renderRow = (label, value) => (
    <Row className="mb-2 align-items-start justify-content-start" style={{ gap: "10px" }}>
        <Col style={{ flex: "0 0 30%" }} className="text-start fw-bold">{label}</Col>
        <Col className="text-start p-0" style={{fontSize:"12px"}}>: {value}</Col>
    </Row>
    );

// Responsive states
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Device type detection
    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;
    const isDesktop = windowWidth >= 1024;

    // Dynamic height
    const getCardHeight = () => {
        if (isDesktop) return "260px";
        if (isTablet) return "300px"; // Let it adjust naturally on tablets
        return "auto"; // Mobile will stack naturally
    };

  return (
    <React.Fragment>
        <Card className="flex-grow-1 h-100 d-flex flex-column" >
            <CardBody className="d-flex flex-column justify-content-start">
                    <div className="d-flex text-muted">
                        <div className="me-auto">
                            <h5 className="mb-0">Profile Details</h5>
                        </div>
                    </div>
                    <Row className='d-flex justify-content-evenly align-items-center mt-4'> 
                        <Col lg={4} sm={12} className="mb-3 d-flex justify-content-center align-items-center">
                         <img src={authuser?.avatar} alt="profile" className="avatar-xl" style={{ width: isDesktop ? 120 : isTablet ? 100 : 80, height: isDesktop ? 120 : isTablet ? 100 : 80, borderRadius: "50%" }} />
                        </Col>
                        <Col lg={8} sm={12} className="mb-3">
                        <div>
                            {renderRow("Name", `${authuser?.firstName} ${authuser?.lastName}`)}
                            {renderRow("Email", authuser?.email)}
                            {renderRow("Role", getDisplayRole(authuser?.role))}
                            {renderRow("Phone", authuser?.mobile)}
                        </div>
                        </Col>
                    </Row>     
            </CardBody>
        </Card>
    </React.Fragment>

  )
}

export default SelfProfiling