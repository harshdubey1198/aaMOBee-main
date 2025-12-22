import React, { useEffect } from "react";
import { Navigate, useLocation, matchPath } from "react-router-dom";
import { useProfile } from "../Hooks/UserHooks";
import { userRolesSidebarData } from "../Layout/VerticalLayout/SidebarData"; 

const AuthProtected = (props) => {
  const { userProfile, loading } = useProfile();
  const location = useLocation();

  const authUser = JSON.parse(localStorage.getItem('authUser'));
  const isLocked = JSON.parse(localStorage.getItem('isLocked'))
  
  useEffect(() => {
    if (authUser) {
      const token = authUser.token;
  
      try {
        const { exp } = JSON.parse(atob(token.split(".")[1])); 
        const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
        const timeUntilExpiryInSeconds = exp - currentTimeInSeconds;
        const timeUntilExpiryInMs = timeUntilExpiryInSeconds * 1000;
        
        if (timeUntilExpiryInSeconds > 0) {
          const days = Math.floor(timeUntilExpiryInSeconds / (24 * 60 * 60));
          const hours = Math.floor((timeUntilExpiryInSeconds % (24 * 60 * 60)) / (60 * 60));
          const minutes = Math.floor((timeUntilExpiryInSeconds % (60 * 60)) / 60);
          const seconds = timeUntilExpiryInSeconds % 60;
  
          // console.log(`Token Expiry In: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
          const logoutTimeout = setTimeout(() => {
            localStorage.removeItem("authUser");
            console.log("Token Expired - User Logged Out Automatically");
            window.location.href = "/login";
          }, timeUntilExpiryInMs);
          return () => clearTimeout(logoutTimeout);
        } else {
          localStorage.removeItem("authUser");
          console.log("Token Expired - User Logged Out Immediately");
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Invalid Token:", error);
        localStorage.removeItem("authUser");
        window.location.href = "/login";
      }
    }
  }, [authUser]);


  if (loading) {
    return  <Navigate to={{ pathname: "/login", state: { from: location } }} />;
  }

  // Redirect to lockscreen if isloacked is true
  if(isLocked){
    return  <Navigate to={{ pathname: "/auth-lock-screen", state: { from: location } }} />;
  }

  // Redirect to login if authUser is not found
  if (!authUser) {
    return <Navigate to={{ pathname: "/login", state: { from: location } }} />;
  }

  // Check if userProfile is present
  if (!userProfile) {
    return <Navigate to={{ pathname: "/login", state: { from: location } }} />;
  }

  const allowedRoutes = getAllowedRoutes(userProfile.role);

  const currentPath = location.pathname;
  const isAllowed = allowedRoutes.some(route =>
    matchPath({ path: route, end: true }, currentPath)
  );
  if (!isAllowed) {
    return <Navigate to="/dashboard" />;
  }
  
  return <>{props.children}</>;
};

const getAllowedRoutes = (role) => {
  const sidebarData = userRolesSidebarData(role);

  const flattenRoutes = (data) => {
    return data.reduce((acc, item) => {
      if (item.url) acc.push(item.url);
      if (item.subItem) {
        item.subItem.forEach((sub) => acc.push(sub.link));
      }
      return acc;
    }, []);
  };

  return flattenRoutes(sidebarData);
};

export default AuthProtected;

//master ->  sidebar data || user routes defined { limited routes  -> output  }
// master -> restrictions || routes defined === accessed route -> /dashboard 