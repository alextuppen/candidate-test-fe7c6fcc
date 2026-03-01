import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { createSyncMiddleware } from "../../shared/syncMiddleware";

const syncMiddleware = createSyncMiddleware("dashboard", [
  "dashboardUser/updateWorkStatus",
]);

export const dashboardStore = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncMiddleware),
});

export type DashboardRootState = ReturnType<typeof dashboardStore.getState>;
export type DashboardDispatch = typeof dashboardStore.dispatch;
