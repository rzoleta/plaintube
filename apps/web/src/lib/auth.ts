import { SvelteKitAuth } from '@auth/sveltekit';
import Google from '@auth/sveltekit/providers/google';
import { env } from '$env/dynamic/private';
import type { JWT } from '@auth/core/jwt';
import type { Session } from '@auth/core/types';

export const { handle, signIn, signOut } = SvelteKitAuth({
	secret: env.AUTH_SECRET,
	trustHost: true,
	providers: [
		Google({
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					scope:
						'openid email profile https://www.googleapis.com/auth/youtube.readonly',
					access_type: 'offline',
					prompt: 'consent'
				}
			}
		})
	],
	callbacks: {
		async jwt({ token, account }) {
			const t = token as JWT;
			if (account) {
				t.accessToken = account.access_token;
				t.refreshToken = account.refresh_token;
				t.expiresAt = account.expires_at;
				t.lastOAuthAt = Date.now();
			}
			return t;
		},
		async session({ session, token }) {
			const s = session as Session;
			const t = token as JWT;
			s.accessToken = t.accessToken;
			s.lastOAuthAt = t.lastOAuthAt;
			return s;
		}
	}
});
