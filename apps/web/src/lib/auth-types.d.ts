import type { DefaultSession, DefaultJWT } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session extends DefaultSession {
		accessToken?: string;
		/** Set when the JWT was last updated from a provider `account` (OAuth round-trip). */
		lastOAuthAt?: number;
	}
}

declare module '@auth/core/jwt' {
	interface JWT extends DefaultJWT {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
		lastOAuthAt?: number;
	}
}
