import { browser } from "$app/environment";
import { writable, derived } from "svelte/store";

const STORAGE_KEY = "plaintube:inboxResetAt";

function loadResetAt(): string | null {
  if (!browser) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return raw;
  } catch {
    return null;
  }
}

function persist(iso: string | null): void {
  if (!browser) return;
  try {
    if (iso == null) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, iso);
  } catch {
    // ignore storage errors
  }
}

const _store = writable<string | null>(loadResetAt());

export const inboxResetAt = derived(_store, ($s) => $s);

/** Clears the inbox view: only videos published after this instant are shown. */
export function resetInbox(): void {
  const iso = new Date().toISOString();
  _store.set(iso);
  persist(iso);
}

/** Removes the cutoff; inbox shows all unwatched items again (sidebar ∞). */
export function clearInboxReset(): void {
  _store.set(null);
  persist(null);
}
