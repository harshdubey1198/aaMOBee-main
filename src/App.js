import React, { useEffect } from "react";
import Routes from "./Routes/index";
import "./assets/scss/theme.scss";
import fakeBackend from "./helpers/AuthType/fakeBackend";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from "./utils/socket";
import gsap from "gsap";
// import beeImage from "./assets/images/Only-Bee.png"; // ✅ replace with correct path to your image
import { Helmet } from "react-helmet";
import seoConfig from "./SeoManager/seoConfig";
import { useLocation } from "react-router-dom";
import TutorialSteps from "./components/Common/TutorialSteps";
fakeBackend();
function SEOManager() {
  const { pathname } = useLocation();
  const meta = seoConfig[pathname] || {
    title: "aaMOBee",
    description: "Inventory and invoicing simplified for all business types.",
  };
  const baseUrl = "https://www.aamobee.com"; 
  const canonicalUrl = `${baseUrl}${pathname}`;
  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
       <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}

function App() {
  useEffect(() => {
    socket.connect();
    socket.on("connect", () => {
      console.log(`User and socket connected: ${socket.id}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  /* useEffect(() => {
    const cursorImage = document.createElement("img");
    cursorImage.src = beeImage;
    cursorImage.alt = "bee-cursor";
    cursorImage.className = "custom-cursor-bee";
  
    Object.assign(cursorImage.style, {
      position: "fixed",
      width: "40px",
      height: "40px",
      zIndex: 9999,
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      top: "0px",
      left: "0px",
    });
  
    console.log("🐝 Bee cursor initialized");
  
    document.body.appendChild(cursorImage);
    document.body.style.cursor = "none";
  
    const moveCursor = (e) => {
      gsap.to(cursorImage, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.25,
        ease: "power2.out",
      });
    };
  
    document.addEventListener("mousemove", moveCursor);
  
    return () => {
      document.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursorImage);
      document.body.style.cursor = "default";
    };
  }, []);   */
    // remove localstorage planId
  useEffect(() => {
    const planId = localStorage.getItem("planId");
    if (planId) {
      localStorage.removeItem("planId");
    }
  }
  , []); 
  

  return (
    <React.Fragment>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
      />
      <SEOManager />
      <Routes />
      <TutorialSteps />
    </React.Fragment> 
  );
}

export default App;
