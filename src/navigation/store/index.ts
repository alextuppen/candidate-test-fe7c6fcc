import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { createSyncMiddleware } from "../../shared/syncMiddleware";

const syncMiddleware = createSyncMiddleware("navigation", [
  "navUser/updateWorkStatus",
]);

export const navStore = configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(syncMiddleware),
});

export type NavRootState = ReturnType<typeof navStore.getState>;
export type NavDispatch = typeof navStore.dispatch;
