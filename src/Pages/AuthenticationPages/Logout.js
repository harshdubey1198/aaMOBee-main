import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import withRouter from "../../components/Common/withRouter";

import { logoutUser } from "../../store/actions";

// redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

const Logout = () => {
  const dispatch = useDispatch();
  const roleRef = useRef(null);

  const mainUsers = ["super_admin", "client_admin", "firm_admin", "accountant", "employee"];
  const crmUsers = ["ASM", "Telecaller", "SM"];

  // Access localStorage once and store it in a ref
  if (!roleRef.current) {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    roleRef.current = authUser?.response?.role || null;
    console.log("Logout Role:", roleRef.current);
  }

  const logoutSelector = createSelector(
    (state) => state.login,
    (login) => ({
      isUserLogout: login.isUserLogout,
    })
  );

  const { isUserLogout } = useSelector(logoutSelector);

  // useEffect(() => {
  //   dispatch(logoutUser());
  // }, [dispatch]);

  useEffect(() => {
  // Clear all tutorial_shown_* keys on logout
  Object.keys(sessionStorage).forEach((key) => {
    if (key.startsWith("tutorial_shown_")) {
      sessionStorage.removeItem(key);
    }
  });

  // Then dispatch logout
  dispatch(logoutUser());
}, [dispatch]);


  console.log("Final Role:", roleRef.current);

  if (isUserLogout) {
    const role = roleRef.current;

    if (crmUsers.includes(role)) {
      return <Navigate to="/crm/login" />;
    } else if (mainUsers.includes(role)) {
      return <Navigate to="/login" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return null;
};

Logout.propTypes = {
  history: PropTypes.object,
};

export default withRouter(Logout);
