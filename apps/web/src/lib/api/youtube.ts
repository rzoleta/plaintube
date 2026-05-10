const YT_BASE = 'https://www.googleapis.com/youtube/v3';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Subscription {
	id: string;
	channelId: string;
	title: string;
	description: string;
	thumbnailUrl: string;
}

export interface VideoItem {
	id: string;
	videoId: string;
	title: string;
	description: string;
	channelId: string;
	channelTitle: string;
	publishedAt: string;
	thumbnailUrl: string;
	playlistId?: string;
}

export interface Playlist {
	id: string;
	title: string;
	description: string;
	thumbnailUrl: string;
	itemCount: number;
}

export interface PaginatedVideos {
	items: VideoItem[];
	nextPageToken: string | null;
}

export interface PaginatedSubscriptions {
	items: Subscription[];
	nextPageToken: string | null;
}

export interface PaginatedPlaylists {
	items: Playlist[];
	nextPageToken: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function ytFetch<T>(
	path: string,
	params: Record<string, string>,
	accessToken: string
): Promise<T> {
	const url = new URL(`${YT_BASE}/${path}`);
	for (const [k, v] of Object.entries(params)) {
		url.searchParams.set(k, v);
	}

	const res = await fetch(url.toString(), {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			Accept: 'application/json'
		}
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`YouTube API error ${res.status}: ${body}`);
	}

	return res.json() as Promise<T>;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch all subscriptions for the authenticated user.
 * Paginates automatically up to 50 per page.
 */
export async function getSubscriptions(
	accessToken: string,
	pageToken?: string
): Promise<PaginatedSubscriptions> {
	interface YTSubscriptionList {
		nextPageToken?: string;
		items?: Array<{
			id: string;
			snippet: {
				resourceId: { channelId: string };
				title: string;
				description: string;
				thumbnails: { default?: { url: string }; medium?: { url: string } };
			};
		}>;
	}

	const params: Record<string, string> = {
		part: 'snippet',
		mine: 'true',
		maxResults: '50',
		order: 'alphabetical'
	};
	if (pageToken) params.pageToken = pageToken;

	const data = await ytFetch<YTSubscriptionList>('subscriptions', params, accessToken);

	const items: Subscription[] = (data.items ?? []).map((item) => ({
		id: item.id,
		channelId: item.snippet.resourceId.channelId,
		title: item.snippet.title,
		description: item.snippet.description,
		thumbnailUrl:
			item.snippet.thumbnails.medium?.url ??
			item.snippet.thumbnails.default?.url ??
			''
	}));

	return {
		items,
		nextPageToken: data.nextPageToken ?? null
	};
}

/**
 * Fetch all subscriptions across all pages.
 */
export async function getAllSubscriptions(accessToken: string): Promise<Subscription[]> {
	const all: Subscription[] = [];
	let pageToken: string | undefined;

	do {
		const page = await getSubscriptions(accessToken, pageToken);
		all.push(...page.items);
		pageToken = page.nextPageToken ?? undefined;
	} while (pageToken);

	return all;
}

/**
 * Get uploads playlist IDs for up to 50 channel IDs in one API call.
 * Returns a map of channelId → uploadsPlaylistId.
 */
export async function getBatchUploadsPlaylistIds(
	channelIds: string[],
	accessToken: string
): Promise<Map<string, string>> {
	interface YTChannelList {
		items?: Array<{
			id: string;
			contentDetails: { relatedPlaylists: { uploads: string } };
		}>;
	}

	const result = new Map<string, string>();
	// channels.list accepts comma-separated ids, max 50 per call
	for (let i = 0; i < channelIds.length; i += 50) {
		const batch = channelIds.slice(i, i + 50);
		const data = await ytFetch<YTChannelList>(
			'channels',
			{ part: 'contentDetails', id: batch.join(',') },
			accessToken
		);
		for (const item of data.items ?? []) {
			result.set(item.id, item.contentDetails.relatedPlaylists.uploads);
		}
	}
	return result;
}

/**
 * Get the uploads playlist ID for a single channel.
 */
export async function getChannelUploadsPlaylistId(
	channelId: string,
	accessToken: string
): Promise<string | null> {
	const map = await getBatchUploadsPlaylistIds([channelId], accessToken);
	return map.get(channelId) ?? null;
}

/**
 * Get videos from a playlist (channel uploads or user playlist).
 */
export async function getPlaylistVideos(
	playlistId: string,
	accessToken: string,
	pageToken?: string
): Promise<PaginatedVideos> {
	interface YTPlaylistItemList {
		nextPageToken?: string;
		items?: Array<{
			id: string;
			snippet: {
				resourceId: { videoId: string };
				title: string;
				description: string;
				channelId: string;
				channelTitle: string;
				videoOwnerChannelId?: string;
				videoOwnerChannelTitle?: string;
				publishedAt: string;
				thumbnails: {
					medium?: { url: string };
					default?: { url: string };
					high?: { url: string };
				};
				playlistId: string;
			};
		}>;
	}

	const params: Record<string, string> = {
		part: 'snippet',
		playlistId,
		maxResults: '20'
	};
	if (pageToken) params.pageToken = pageToken;

	const data = await ytFetch<YTPlaylistItemList>('playlistItems', params, accessToken);

	const items: VideoItem[] = (data.items ?? [])
		.filter((item) => item.snippet.resourceId.videoId && item.snippet.title !== 'Private video')
		.map((item) => ({
			id: item.id,
			videoId: item.snippet.resourceId.videoId,
			title: item.snippet.title,
			description: item.snippet.description,
			channelId: item.snippet.videoOwnerChannelId ?? item.snippet.channelId,
			channelTitle: item.snippet.videoOwnerChannelTitle ?? item.snippet.channelTitle,
			publishedAt: item.snippet.publishedAt,
			thumbnailUrl:
				item.snippet.thumbnails.medium?.url ??
				item.snippet.thumbnails.high?.url ??
				item.snippet.thumbnails.default?.url ??
				'',
			playlistId: item.snippet.playlistId
		}));

	return {
		items,
		nextPageToken: data.nextPageToken ?? null
	};
}

/**
 * Get the publishedAt of the most recently added item in a playlist (position 0).
 * Returns null if the playlist is empty or the call fails.
 */
export async function getPlaylistLastActivity(
	playlistId: string,
	accessToken: string
): Promise<string | null> {
	interface YTPlaylistItemList {
		items?: Array<{ snippet: { publishedAt: string } }>;
	}
	try {
		const data = await ytFetch<YTPlaylistItemList>(
			'playlistItems',
			{ part: 'snippet', playlistId, maxResults: '1' },
			accessToken
		);
		return data.items?.[0]?.snippet.publishedAt ?? null;
	} catch {
		return null;
	}
}

/**
 * Get all playlists for the authenticated user.
 */
export async function getUserPlaylists(
	accessToken: string,
	pageToken?: string
): Promise<PaginatedPlaylists> {
	interface YTPlaylistList {
		nextPageToken?: string;
		items?: Array<{
			id: string;
			snippet: {
				title: string;
				description: string;
				thumbnails: { medium?: { url: string }; default?: { url: string } };
			};
			contentDetails: { itemCount: number };
		}>;
	}

	const params: Record<string, string> = {
		part: 'snippet,contentDetails',
		mine: 'true',
		maxResults: '50'
	};
	if (pageToken) params.pageToken = pageToken;

	const data = await ytFetch<YTPlaylistList>('playlists', params, accessToken);

	const items: Playlist[] = (data.items ?? []).map((item) => ({
		id: item.id,
		title: item.snippet.title,
		description: item.snippet.description,
		thumbnailUrl:
			item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url ?? '',
		itemCount: item.contentDetails.itemCount
	}));

	return {
		items,
		nextPageToken: data.nextPageToken ?? null
	};
}
