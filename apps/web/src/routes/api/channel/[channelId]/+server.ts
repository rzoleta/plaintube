import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getChannelInfo } from '$lib/api/youtube';

export const GET: RequestHandler = async ({ locals, params }) => {
	const session = await locals.auth();
	if (!session?.accessToken) throw error(401, 'Not authenticated');

	try {
		const info = await getChannelInfo(params.channelId, session.accessToken);
		if (!info) throw error(404, 'Channel not found');
		return json(info);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, message);
	}
};
