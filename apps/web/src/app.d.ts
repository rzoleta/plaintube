// See https://svelte.dev/docs/kit/types#app.d.ts
import type { Session } from '@auth/core/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: () => Promise<(Session & { accessToken?: string }) | null>;
		}
		interface PageData {
			session?: (Session & { accessToken?: string }) | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
