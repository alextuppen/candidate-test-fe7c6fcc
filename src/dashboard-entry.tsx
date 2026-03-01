import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { routes } from "./shared/routes";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { subscribeToStoreActions, asSynced } from "./shared/storeBridge";
import { dashboardStore } from "./dashboard/store";
import { updateWorkStatus } from "./dashboard/store/userSlice";
import type { WorkStatus } from "./shared/types";

subscribeToStoreActions("dashboard", ({ actionType, payload }) => {
  if (actionType === "navUser/updateWorkStatus") {
    dashboardStore.dispatch(asSynced(updateWorkStatus(payload as WorkStatus)));
  }
});

const dashboardRoot = document.getElementById("dashboard-root");

// Component to listen for navigation events from other micro-frontends
const NavigationListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Event handler for navigation events from the navigation micro-frontend
    const handleNavEvent = (event: CustomEvent<{ path: string }>) => {
      navigate(event.detail.path);
    };

    // Add the event listener
    window.addEventListener(
      "navigation-change",
      handleNavEvent as EventListener
    );

    // Clean up
    return () => {
      window.removeEventListener(
        "navigation-change",
        handleNavEvent as EventListener
      );
    };
  }, [navigate]);

  return null;
};

createRoot(dashboardRoot!).render(
  <BrowserRouter>
    <NavigationListener />
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
    <Toaster position="top-right" />
  </BrowserRouter>
);
