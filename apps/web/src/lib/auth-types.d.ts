import type { DefaultSession, DefaultJWT } from '@auth/core/types';

declare module '@auth/core/types' {
	interface Session extends DefaultSession {
		accessToken?: string;
	}
}

declare module '@auth/core/jwt' {
	interface JWT extends DefaultJWT {
		accessToken?: string;
		refreshToken?: string;
		expiresAt?: number;
	}
}
