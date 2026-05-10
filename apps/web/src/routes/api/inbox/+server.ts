import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	getAllSubscriptions,
	getBatchUploadsPlaylistIds,
	getPlaylistVideos,
	type VideoItem
} from '$lib/api/youtube';

// Fetch recent videos from each subscribed channel and merge into one
// chronological feed. Limits each channel to 10 videos to stay quota-safe.
export const GET: RequestHandler = async ({ locals, url }) => {
	const session = await locals.auth();
	if (!session?.accessToken) throw error(401, 'Not authenticated');

	const token = session.accessToken;
	const pageParam = url.searchParams.get('pageToken'); // not used yet — future pagination

	try {
		// 1. All subscriptions (cached on client; server always fetches fresh)
		const subs = await getAllSubscriptions(token);
		if (subs.length === 0) return json({ items: [], nextPageToken: null });

		// 2. Batch-resolve uploads playlist IDs (50 channels per API call)
		const channelIds = subs.map((s) => s.channelId);
		const uploadsMap = await getBatchUploadsPlaylistIds(channelIds, token);

		// 3. Fetch the most recent 10 videos from each channel in parallel,
		//    capped at 50 concurrent requests to avoid hammering the API.
		const BATCH = 50;
		const allVideos: VideoItem[] = [];

		for (let i = 0; i < channelIds.length; i += BATCH) {
			const batch = channelIds.slice(i, i + BATCH);
			const results = await Promise.allSettled(
				batch.map(async (channelId) => {
					const playlistId = uploadsMap.get(channelId);
					if (!playlistId) return [];
					const page = await getPlaylistVideos(playlistId, token);
					return page.items.slice(0, 10);
				})
			);
			for (const r of results) {
				if (r.status === 'fulfilled') allVideos.push(...r.value);
			}
		}

		// 4. Sort newest first and dedupe by videoId
		const seen = new Set<string>();
		const deduped = allVideos
			.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
			.filter((v) => {
				if (seen.has(v.videoId)) return false;
				seen.add(v.videoId);
				return true;
			});

		const channelThumbById = new Map(subs.map((s) => [s.channelId, s.thumbnailUrl]));
		const items: VideoItem[] = deduped.map((v) => ({
			...v,
			channelThumbnailUrl: channelThumbById.get(v.channelId) ?? v.channelThumbnailUrl
		}));

		return json({ items, nextPageToken: null });
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		console.error('[/api/inbox]', message);
		throw error(500, message);
	}
};
