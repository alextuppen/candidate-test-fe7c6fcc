import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavigationApp } from "./navigation/NavigationApp";
import { BrowserRouter } from "react-router-dom";
import { subscribeToStoreActions, asSynced } from "./shared/storeBridge";
import { navStore } from "./navigation/store";
import { updateWorkStatus } from "./navigation/store/userSlice";
import type { WorkStatus } from "./shared/types";

subscribeToStoreActions("navigation", ({ actionType, payload }) => {
  if (actionType === "dashboardUser/updateWorkStatus") {
    navStore.dispatch(asSynced(updateWorkStatus(payload as WorkStatus)));
  }
});

const navigationRoot = document.getElementById("navigation-root");

createRoot(navigationRoot!).render(
  <BrowserRouter>
    <NavigationApp />
  </BrowserRouter>
);
