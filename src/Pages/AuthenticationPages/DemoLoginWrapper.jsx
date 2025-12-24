import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "./Login"; 

const DemoLoginWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [demoPayload, setDemoPayload] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      const demoCredentials = { email, token };
      localStorage.setItem("demousercredentials", JSON.stringify(demoCredentials));
      setDemoPayload(demoCredentials);
      // Optional: auto navigate to dashboard after storing demo credentials
      // navigate("/dashboard");
    }
  }, [location.search, navigate]);

  return <Login demoPayload={demoPayload} />;
};

export default DemoLoginWrapper;
