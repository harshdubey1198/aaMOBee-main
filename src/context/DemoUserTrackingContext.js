import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { sendDemoLog } from "../utils/socket"; // server logging function

const DemoUserTrackingContext = createContext(null);
export const useDemoTracker = () => useContext(DemoUserTrackingContext);

export const DemoUserTrackingProvider = ({ children }) => {
  const location = useLocation();
  const startTimeRef = useRef(Date.now());
  const prevRouteRef = useRef(location.pathname);
  const [timeDisplay, setTimeDisplay] = useState("00_00_00");

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const isDemoUser = authUser?.response?.isDemo;
  const demoUserId = authUser?.response?._id;

  const actionLogsRef = useRef([]);
  const routeLogsRef = useRef([]);

  // Helper to save logs to localStorage
  const saveToLocalStorage = (key, data) => {
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    existing.push(data);
    localStorage.setItem(key, JSON.stringify(existing));
  };

  const formatTime = (ms) => {
    let totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    totalSeconds %= 3600;
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${hours}_${minutes}_${seconds}`;
  };

  // ---------------- Timer for display ----------------
  useEffect(() => {
    if (!isDemoUser) return;
    const interval = setInterval(() => {
      const ms = Date.now() - startTimeRef.current;
      setTimeDisplay(formatTime(ms));
    }, 1000);
    return () => clearInterval(interval);
  }, [isDemoUser]);

  // ---------------- Route tracking ----------------
  useEffect(() => {
    if (!isDemoUser) return;
    const prevRoute = prevRouteRef.current;

    if (prevRoute) {
      const timeSpent = Date.now() - startTimeRef.current;
      const routeLog = {
        route: prevRoute,
        timeSpent: formatTime(timeSpent),
        timestamp: new Date(),
      };
      routeLogsRef.current.push(routeLog);
      saveToLocalStorage("demo_route_time", routeLog); // save locally
      sendDemoLog({ demoUserId, routeLogs: [routeLog], actionLogs: [] }); // send to server
    }

    startTimeRef.current = Date.now();
    prevRouteRef.current = location.pathname;
  }, [location.pathname, isDemoUser, demoUserId]);

  // ---------------- Before unload (tab close) ----------------
  useEffect(() => {
    if (!isDemoUser) return;
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTimeRef.current;
      const routeLog = {
        route: prevRouteRef.current,
        timeSpent: formatTime(timeSpent),
        timestamp: new Date(),
      };
      routeLogsRef.current.push(routeLog);
      saveToLocalStorage("demo_route_time", routeLog); // save locally
      sendDemoLog({
        demoUserId,
        routeLogs: [routeLog],
        actionLogs: actionLogsRef.current,
      }); // send all actions
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDemoUser, demoUserId]);

  // ---------------- Click & form submit tracking ----------------
  useEffect(() => {
    if (!isDemoUser) return;

    const handleClick = (e) => {
      const el = e.target;
      const log = {
        type: "click",
        tag: el.tagName.toLowerCase(),
        id: el.id || null,
        className: el.className || null,
        text: el.innerText || null,
        route: location.pathname,
        timestamp: new Date(),
      };
      actionLogsRef.current.push(log);
      saveToLocalStorage("demo_user_actions", log); // save locally
      sendDemoLog({ demoUserId, routeLogs: [], actionLogs: [log] }); // send to server
    };

    const handleSubmit = (e) => {
      const form = e.target;
      const data = Object.fromEntries(new FormData(form).entries());
      const log = {
        type: "form_submit",
        route: location.pathname,
        formId: form.id || null,
        data,
        timestamp: new Date(),
      };
      actionLogsRef.current.push(log);
      saveToLocalStorage("demo_user_actions", log);
      sendDemoLog({ demoUserId, routeLogs: [], actionLogs: [log] });
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, [isDemoUser, location.pathname, demoUserId]);

  // ---------------- Input / change tracking ----------------
  useEffect(() => {
    if (!isDemoUser) return;

    const handleInputChange = (e) => {
      const el = e.target;
      const tag = el.tagName.toLowerCase();
      if (["input", "textarea", "select"].includes(tag)) {
        const log = {
          type: "input_change",
          tag,
          inputType: el.type,
          id: el.id || null,
          className: el.className || null,
          name: el.name || null,
          value: el.value,
          route: location.pathname,
          timestamp: new Date(),
        };
        actionLogsRef.current.push(log);
        saveToLocalStorage("demo_user_actions", log); // save locally
        sendDemoLog({ demoUserId, routeLogs: [], actionLogs: [log] }); // send to server
      }
    };

    document.addEventListener("input", handleInputChange);
    document.addEventListener("change", handleInputChange);

    return () => {
      document.removeEventListener("input", handleInputChange);
      document.removeEventListener("change", handleInputChange);
    };
  }, [isDemoUser, location.pathname, demoUserId]);

  return (
    <DemoUserTrackingContext.Provider value={{}}>
      {children}
      {isDemoUser && window.location.href.includes("localhost") && (
        <div
          style={{
            position: "fixed",
            bottom: 80,
            right: 10,
            padding: "5px 10px",
            backgroundColor: "rgba(0,0,0,0.7)",
            color: "#fff",
            borderRadius: 5,
            fontFamily: "monospace",
            zIndex: 9999,
          }}
        >
          Time Spent: {timeDisplay}
        </div>
      )}
    </DemoUserTrackingContext.Provider>
  );
};
