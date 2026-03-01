const STORE_SYNC_EVENT = "store:sync" as const;

interface StoreSyncPayload {
  actionType: string;
  payload: unknown;
  sourceStore: string;
}

export function publishStoreAction(data: StoreSyncPayload): void {
  window.dispatchEvent(new CustomEvent(STORE_SYNC_EVENT, { detail: data }));
}

export function subscribeToStoreActions(
  sourceStore: string,
  handler: (data: StoreSyncPayload) => void
): () => void {
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<StoreSyncPayload>).detail;
    if (detail.sourceStore === sourceStore) return;
    handler(detail);
  };

  window.addEventListener(STORE_SYNC_EVENT, listener);
  return () => window.removeEventListener(STORE_SYNC_EVENT, listener);
}

export function asSynced<T extends { type: string }>(
  action: T
): T & { _storeSync: true } {
  return { ...action, _storeSync: true };
}
