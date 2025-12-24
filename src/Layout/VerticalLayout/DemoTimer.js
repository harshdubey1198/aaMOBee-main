import React, { useEffect, useState } from "react";

const DemoTimer = () => {
  const getExpiryDate = () => {
    return JSON.parse(localStorage.getItem("authUser"))?.response?.expiresAt;
  };

  const calculateTimeLeft = (expiry) => {
    const difference = new Date(expiry) - new Date();
    if (difference <= 0) return null;

    return {
      hours: Math.floor(difference / (1000 * 60 * 60)),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [expiryDate, setExpiryDate] = useState(getExpiryDate());
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiryDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const latestExpiry = getExpiryDate();
      if (latestExpiry !== expiryDate) {
        setExpiryDate(latestExpiry); // update expiry if admin changes
      }

      const updatedTime = calculateTimeLeft(latestExpiry);
      if (!updatedTime) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft(updatedTime);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return (
    <div style={expiredStyle}>
      Demo Expired
    </div>
  );

  return (
    <div style={activeStyle}>
      Demo expires in: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
    </div>
  );
};

// Styles
const expiredStyle = {
  position: 'fixed', bottom: '10px', left: '10px',
  background: '#ff4d4d', color: '#fff', padding: '8px 12px',
  borderRadius: '5px', fontWeight: 'bold', zIndex: 9999,
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
};

const activeStyle = {
  position: 'fixed', bottom: '10px', left: '10px',
  background: '#ffcc00', color: '#000', padding: '8px 12px',
  borderRadius: '5px', fontWeight: 'bold', zIndex: 9999,
  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
};

export default DemoTimer;
