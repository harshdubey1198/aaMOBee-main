import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation, matchPath } from "react-router-dom";

// redux
import { useSelector } from "react-redux";
import { createSelector } from "reselect";

// constants
import { layoutTypes } from "../constants/layout";

// layouts
import NonAuthLayout from "../Layout/NonAuthLayout";
import VerticalLayout from "../Layout/VerticalLayout";
import HorizontalLayout from "../Layout/HorizontalLayout";
import AuthProtected from "./AuthProtected";

// Chatbot component
import Chatbot from "../Pages/Portfolio-aaMOBee/modals/Chatbot"; // Import the Chatbot component

import { authProtectedRoutes, publicRoutes } from "./routes";

// Load ONLY when needed
const FeedbackModal = lazy(() => import("../Modal/FeedbackModal"));

const getLayout = (layoutType) => {
  switch (layoutType) {
    case layoutTypes.HORIZONTAL:
      return HorizontalLayout;
    case layoutTypes.VERTICAL:
    default:
      return VerticalLayout;
  }
};

// hoisted selector
const layoutSelector = createSelector(
  (state) => state.Layout,
  (state) => ({ layoutType: state.layoutType })
);

// small page skeleton
const PageSkeleton = () => (
  <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
    <div aria-hidden className="spinner" />
  </div>
);

const Index = () => {
  const { layoutType } = useSelector(layoutSelector);
  const Layout = getLayout(layoutType);
  const location = useLocation(); 

  // optional prefetch
  useEffect(() => {
    const prefetch = () => {
      import("../Pages/Inventory-MNG/InventoryTable");
      import("../Pages/Invoicing/view");
    };
    if (window.requestIdleCallback) {
      window.requestIdleCallback(prefetch);
    } else {
      setTimeout(prefetch, 700);
    }
  }, []);

  useEffect(() => {
    const prefetchPublic = () => {
      import("../Pages/Portfolio-aaMOBee");
      import("../Pages/Portfolio-aaMOBee/pages/BlogsPage");
    };
    if (window.requestIdleCallback) {
      window.requestIdleCallback(prefetchPublic);
    } else {
      setTimeout(prefetchPublic, 1000);
    }
  }, []);

  const isAuthed =
    !!localStorage.getItem("authUser") || !!localStorage.getItem("token");

    // 🔍 Check if current route matches any private (auth protected) route
  const isOnPrivateRoute = authProtectedRoutes.some((route) =>
    matchPath(
      { path: route.path, end: false }, // supports routes with params like /edit-invoice/:id
      location.pathname
    )
  );

  return (
    <>
      {/* ✅ Chatbot only on NON-private routes */}
      {!isOnPrivateRoute && <Chatbot />}

      <Suspense fallback={<div />}>
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map((route, idx) => (
            <Route
              key={`pub-${idx}`}
              path={route.path}
              element={
                route.element ? (
                  route.element 
                ) : (
                  <NonAuthLayout>
                    <Suspense fallback={<PageSkeleton />}>
                      <route.component />
                    </Suspense>
                  </NonAuthLayout>
                )
              }
            />
          ))}

          {/* Auth Protected Routes */}
          {authProtectedRoutes.map((route, idx) => (
            <Route
              key={`priv-${idx}`}
              path={route.path}
              element={
                route.element ? (
                  <AuthProtected>{route.element}</AuthProtected>
                ) : (
                  <AuthProtected>
                    <Layout>
                      <Suspense fallback={<PageSkeleton />}>
                        <route.component />
                      </Suspense>
                    </Layout>
                  </AuthProtected>
                )
              }
            />
          ))}
        </Routes>
      </Suspense>

      {/* Mount once only if authed; no redirect wrapper here */}
      {isAuthed ? (
        <Suspense fallback={null}>
          <FeedbackModal />
        </Suspense>
      ) : null}
    </>
  );
};

export default Index;
