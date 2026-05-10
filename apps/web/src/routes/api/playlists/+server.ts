import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserPlaylists, getPlaylistLastActivity } from '$lib/api/youtube';

export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth();

	if (!session?.accessToken) {
		throw error(401, 'Not authenticated');
	}

	const pageToken = url.searchParams.get('pageToken') ?? undefined;

	try {
		const result = await getUserPlaylists(session.accessToken, pageToken);

		// Fetch the most recently added item date from each playlist in parallel,
		// then sort playlists by that date descending (most recently active first).
		const lastActivityDates = await Promise.all(
			result.items.map((p) => getPlaylistLastActivity(p.id, session.accessToken!))
		);

		const sorted = result.items
			.map((p, i) => ({ ...p, lastActivity: lastActivityDates[i] ?? '' }))
			.sort((a, b) => {
				if (!a.lastActivity && !b.lastActivity) return 0;
				if (!a.lastActivity) return 1;
				if (!b.lastActivity) return -1;
				return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
			});

		return json({ ...result, items: sorted });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		throw error(500, `Failed to fetch playlists: ${message}`);
	}
};
