import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserPlaylists } from '$lib/api/youtube';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session?.accessToken) {
		throw error(401, 'Not authenticated');
	}

	const pageToken = url.searchParams.get('pageToken') ?? undefined;

	try {
		const result = await getUserPlaylists(session.accessToken, pageToken);
		const sorted = [...result.items].sort((a, b) => a.title.localeCompare(b.title));
		return json({ ...result, items: sorted });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch playlists: ${message}`);
	}
};
