import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getPlaylistVideos } from '$lib/api/youtube';

export const GET: RequestHandler = async ({ locals, params, url }) => {
	const session = await locals.auth();

	if (!session?.accessToken) {
		throw error(401, 'Not authenticated');
	}

	const { playlistId } = params;
	const pageToken = url.searchParams.get('pageToken') ?? undefined;

	try {
		const result = await getPlaylistVideos(playlistId, session.accessToken, pageToken);
		return json(result);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch playlist videos: ${message}`);
	}
};
