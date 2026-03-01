import { Middleware } from "@reduxjs/toolkit";
import { publishStoreAction } from "./storeBridge";

interface SyncableAction {
  type: string;
  payload: unknown;
  _storeSync?: boolean;
}

function isSyncableAction(action: unknown): action is SyncableAction {
  return (
    typeof action === "object" &&
    action !== null &&
    "type" in action &&
    typeof (action as { type: unknown }).type === "string"
  );
}

export function createSyncMiddleware(
  storeId: string,
  syncedActionTypes: string[]
): Middleware {
  return () => (next) => (action) => {
    const result = next(action);

    if (
      isSyncableAction(action) &&
      syncedActionTypes.includes(action.type) &&
      !action._storeSync
    ) {
      publishStoreAction({
        actionType: action.type,
        payload: action.payload,
        sourceStore: storeId,
      });
    }

    return result;
  };
}
