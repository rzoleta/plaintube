import type { Session } from '@auth/core/types';
import { track } from '@vercel/analytics/sveltekit';

/** OAuth → first full load of `/` should fall within this window. */
const FRESH_OAUTH_MS = 30 * 60 * 1000;

const storageKey = (userKey: string) => `plaintube_sign_up:${userKey}`;

type UserLike = NonNullable<Session['user']>;

function stableUserKey(user: UserLike): string | null {
	return user.id ?? user.email ?? null;
}

/**
 * Fires `sign_up` once per browser per user when they land on the main app
 * shortly after completing Google OAuth (consent + callback).
 */
export function maybeTrackSignUp(session: Session): void {
	if (typeof window === 'undefined') return;

	const at = session.lastOAuthAt;
	if (at == null || Date.now() - at > FRESH_OAUTH_MS) return;

	const user = session.user;
	if (!user) return;

	const key = stableUserKey(user);
	if (!key) return;

	const sk = storageKey(key);
	if (localStorage.getItem(sk)) return;

	track('sign_up');
	localStorage.setItem(sk, '1');
}
