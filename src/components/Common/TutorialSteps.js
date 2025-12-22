import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import tutorialStepsConfig from "../../constants/tutorialSteps";
import gsap from "gsap";

const TutorialSteps = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownOnce, setHasShownOnce] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const tutorialRef = useRef(null);
  const timerRef = useRef(null);
  const isHoveredRef = useRef(false);

  const matchedConfig = tutorialStepsConfig.find((entry) =>
    entry.routes.includes(pathname)
  );

  const steps = matchedConfig?.steps || [];

  const startAutoCloseTimer = () => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        setIsOpen(false);
        setShowButton(true);
      }
    }, 2500);
  };

  const handleClose = () => {
    clearTimeout(timerRef.current);
    setIsOpen(false);
    setShowButton(true);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowButton(false);
    gsap.fromTo(
      tutorialRef.current,
      { x: 400, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
    startAutoCloseTimer();
  };

  // useEffect(() => {
  //   if (steps.length) {
  //     setHasShownOnce(true);
  //     setShowButton(false);
  //     timerRef.current = setTimeout(() => {
  //       handleOpen();
  //     }, 1000);
  //     return () => clearTimeout(timerRef.current);
  //   }
  // }, [pathname]);

//   useEffect(() => {
//   if (steps.length) {
//     const hasShownKey = `tutorial_shown_${pathname}`;
//     const hasAlreadyShown = sessionStorage.getItem(hasShownKey);

//     if (!hasAlreadyShown) {
//       sessionStorage.setItem(hasShownKey, "true");
//       setHasShownOnce(true);
//       setShowButton(false);

//       timerRef.current = setTimeout(() => {
//         handleOpen();
//       }, 1000);

//       return () => clearTimeout(timerRef.current);
//     } else {
//       setHasShownOnce(true); // show the icon, not auto-open
//       setIsOpen(false);
//       setShowButton(true);
//     }
//   }
// }, [pathname]);

useEffect(() => {
  if (steps.length) {
    const hasShownKey = `tutorial_shown_${pathname}`;
    const hasAlreadyShown = sessionStorage.getItem(hasShownKey);

    if (!hasAlreadyShown) {
      sessionStorage.setItem(hasShownKey, "true");
      setHasShownOnce(true);
      setShowButton(true); // just show the icon, don't auto-open
    } else {
      setHasShownOnce(true);
      setIsOpen(false);
      setShowButton(true);
    }
  }
}, [pathname]);


const hasClearedRef = useRef(false);

useEffect(() => {
  if (!hasClearedRef.current) {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('tutorial_shown_')) {
        sessionStorage.removeItem(key);
      }
    });
    hasClearedRef.current = true;
  }
}, []);

  if (!steps.length) return null;

  return (
    <>
      {!isOpen && hasShownOnce && showButton && (
        <button className="tutorial-toggle-btn" onClick={handleOpen}>
          <i className="mdi mdi-lightbulb-on-outline"></i>
        </button>
      )}

      {isOpen && (
        <div
          className="tutorial-container"
          ref={tutorialRef}
          onMouseEnter={() => { // for the auto close event 
            isHoveredRef.current = true;
            clearTimeout(timerRef.current);
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
            startAutoCloseTimer();
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Getting Started</h6>
            <i className="mdi mdi-close tutorial-close-icon" onClick={handleClose}></i>
          </div>

          <div className="process-flow-horizontal">
            <div className="process-row d-flex justify-content-start align-items-center flex-nowrap gap-0">
             <div className="steps-container">
                  {steps.map((item, index, arr) => (
                    <React.Fragment key={index}>
                      <div className="step" style={{ borderColor: item.bgColor }}>
                        <div className="circle" style={{ borderColor: item.bgColor }}>
                          <i className={item.icon}></i>
                        </div>
                        {index !== arr.length - 1 && (
                          <>
                            <div className="arrow" style={{ color: item.bgColor }}>{`0${index + 1}`}</div>
                            <div className="arrow-cut"></div>
                          </>
                        )}
                        <p className="label">{item.title}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TutorialSteps;