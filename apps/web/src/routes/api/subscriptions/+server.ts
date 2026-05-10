import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllSubscriptions } from '$lib/api/youtube';

export const GET: RequestHandler = async ({ locals }) => {
	const session = await locals.auth();

	if (!session?.accessToken) {
		throw error(401, 'Not authenticated');
	}

	try {
		const subscriptions = await getAllSubscriptions(session.accessToken);
		return json(subscriptions);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		console.error('[/api/subscriptions]', message);
		throw error(500, message);
	}
};
