import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getChannelUploadsPlaylistId, getPlaylistVideos } from '$lib/api/youtube';

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const session = await locals.auth();

	if (!session?.accessToken) {
		throw error(401, 'Not authenticated');
	}

	const { channelId } = params;
	const pageToken = url.searchParams.get('pageToken') ?? undefined;

	try {
		const playlistId = await getChannelUploadsPlaylistId(channelId, session.accessToken);
		if (!playlistId) {
			throw error(404, `No uploads playlist found for channel ${channelId}`);
		}

		const result = await getPlaylistVideos(playlistId, session.accessToken, pageToken);
		return json(result);
	} catch (err) {
		if (err instanceof Response) throw err;
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch channel videos: ${message}`);
	}
};
