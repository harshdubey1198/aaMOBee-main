import React, { useEffect, Suspense, lazy, useRef } from "react";
import "./assets/scss/theme.scss";
import { Helmet } from "react-helmet";
import seoConfig from "./SeoManager/seoConfig";
import { useLocation } from "react-router-dom";

// dev-only fake backend
if (process.env.NODE_ENV === "development") {
  import("./helpers/AuthType/fakeBackend").then((m) => m.default());
}


// Split the router itself
const AppRoutes = lazy(() => import("./Routes/index"));

// Load Toastify (and its CSS) only when mounted
const ToastContainerLazy = lazy(async () => {
  const mod = await import("react-toastify");
  await import("react-toastify/dist/ReactToastify.css");
  return { default: mod.ToastContainer };
});

function SEOManager() {
  const { pathname } = useLocation();
  const meta =
    seoConfig[pathname] || {
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
  // JS doesn’t support generics; remove `<any>`
  const socketRef = useRef(null);

  // remove localstorage planId once
  useEffect(() => {
    const planId = localStorage.getItem("planId");
    if (planId) localStorage.removeItem("planId");
  }, []);

   const isAuthed =
      !!localStorage.getItem("authUser") || !!localStorage.getItem("token");

  // Connect socket only for authenticated users, and lazy-load the client
  useEffect(() => {
    let mounted = true;
    // const isAuthed =
    //   !!localStorage.getItem("authUser") || !!localStorage.getItem("token");

    if (isAuthed) {
      (async () => {
        const { default: socket } = await import("./utils/socket");
        if (!mounted) return;
        socket.connect();
        socket.on("connect", () => {
          console.log(`User and socket connected: ${socket.id}`);
        });
        socketRef.current = socket;
      })();
    } 

    return () => {
      mounted = false;
      const s = socketRef.current;
      if (s) {
        s.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <ToastContainerLazy
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
        />
      </Suspense>

      {isAuthed && (
        <Suspense fallback={null}>
          <ToastContainerLazy
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
          />
        </Suspense>
      )}

      <SEOManager />

      <Suspense fallback={<div />}>
        <AppRoutes />
      </Suspense>
    </>
  );
}

export default App;
