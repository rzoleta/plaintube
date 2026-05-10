<script lang="ts">
	import { derived, readable } from 'svelte/store';
	import { createInfiniteQuery, createQuery, type InfiniteData } from '@tanstack/svelte-query';
	import VideoCard from './VideoCard.svelte';
	import type { VideoItem, PaginatedVideos, Subscription } from '$lib/api/youtube';
	import { watchedStore } from '$lib/stores/watched';
	import { savedStore } from '$lib/stores/saved';

	interface Props {
		activeSection: string;
		activeChannelId: string | null;
		activePlaylistId: string | null;
		activeChannelTitle: string | null;
		activePlaylistTitle: string | null;
		selectedVideoId: string | null;
		onSelectVideo: (video: VideoItem) => void;
	}

	const {
		activeSection,
		activeChannelId,
		activePlaylistId,
		activeChannelTitle,
		activePlaylistTitle,
		selectedVideoId,
		onSelectVideo
	}: Props = $props();

	// Reactive props as stores for TanStack Query options
	// We use a helper derived from a readable that reads the prop each time it ticks
	// Since Svelte 5 rune props are reactive, wrapping them forces TanStack to see changes.
	function reactiveStore<T>(getter: () => T) {
		// Returns a Svelte store that updates whenever the component re-renders
		// by using a writable that's updated via $effect
		let subscribers: Array<(v: T) => void> = [];
		let value = getter();

		function notify(v: T) {
			for (const s of subscribers) s(v);
		}

		// Update will be called by the $effect below
		const store = {
			subscribe(fn: (v: T) => void) {
				subscribers.push(fn);
				fn(value);
				return () => {
					subscribers = subscribers.filter((s) => s !== fn);
				};
			},
			update(v: T) {
				value = v;
				notify(v);
			}
		};
		return store;
	}

	// Create reactive stores from props
	const channelIdStore = reactiveStore(() => activeChannelId);
	const playlistIdStore = reactiveStore(() => activePlaylistId);
	const sectionStore = reactiveStore(() => activeSection);

	$effect(() => {
		channelIdStore.update(activeChannelId);
		playlistIdStore.update(activePlaylistId);
		sectionStore.update(activeSection);
	});

	// ─── Channel videos query ─────────────────────────────────────────────────

	const channelOptions = derived(channelIdStore, ($channelId) => ({
		queryKey: ['channel-videos', $channelId ?? ''] as const,
		queryFn: async ({ pageParam }: { pageParam: string | null }) => {
			const url = new URL(`/api/channel/${$channelId}/videos`, window.location.origin);
			if (pageParam) url.searchParams.set('pageToken', pageParam);
			const res = await fetch(url.toString());
			if (!res.ok) throw new Error('Failed to fetch channel videos');
			return res.json() as Promise<PaginatedVideos>;
		},
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage: PaginatedVideos) => lastPage.nextPageToken ?? null,
		enabled: $channelId !== null
	}));

	const channelVideosQuery = createInfiniteQuery<
		PaginatedVideos,
		Error,
		InfiniteData<PaginatedVideos>,
		readonly [string, string],
		string | null
	>(channelOptions);

	// ─── Playlist videos query ────────────────────────────────────────────────

	const playlistOptions = derived(playlistIdStore, ($playlistId) => ({
		queryKey: ['playlist-videos', $playlistId ?? ''] as const,
		queryFn: async ({ pageParam }: { pageParam: string | null }) => {
			const url = new URL(`/api/playlist/${$playlistId}/videos`, window.location.origin);
			if (pageParam) url.searchParams.set('pageToken', pageParam);
			const res = await fetch(url.toString());
			if (!res.ok) throw new Error('Failed to fetch playlist videos');
			return res.json() as Promise<PaginatedVideos>;
		},
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage: PaginatedVideos) => lastPage.nextPageToken ?? null,
		enabled: $playlistId !== null
	}));

	const playlistVideosQuery = createInfiniteQuery<
		PaginatedVideos,
		Error,
		InfiniteData<PaginatedVideos>,
		readonly [string, string],
		string | null
	>(playlistOptions);

	// ─── Subscriptions (for inbox loading indicator) ──────────────────────────

	const subOptions = derived(
		[sectionStore, channelIdStore, playlistIdStore],
		([$section, $channelId, $playlistId]) => ({
			queryKey: ['subscriptions'] as const,
			queryFn: async () => {
				const cached = sessionStorage.getItem('plaintube:subscriptions');
				if (cached) return JSON.parse(cached) as Subscription[];
				const res = await fetch('/api/subscriptions');
				if (!res.ok) throw new Error('Failed to fetch subscriptions');
				const data = (await res.json()) as Subscription[];
				sessionStorage.setItem('plaintube:subscriptions', JSON.stringify(data));
				return data;
			},
			staleTime: 1000 * 60 * 30,
			enabled: $section === 'inbox' && !$channelId && !$playlistId
		})
	);

	const subscriptionsQuery = createQuery<Subscription[], Error, Subscription[], readonly string[]>(
		subOptions
	);

	// ─── Derived state ────────────────────────────────────────────────────────

	const allChannelVideos = $derived(
		($channelVideosQuery.data?.pages ?? []).flatMap((p) => p.items)
	);

	const allPlaylistVideos = $derived(
		($playlistVideosQuery.data?.pages ?? []).flatMap((p) => p.items)
	);

	const sectionTitle = $derived(
		activeChannelId
			? (activeChannelTitle ?? 'Channel')
			: activePlaylistId
				? (activePlaylistTitle ?? 'Playlist')
				: activeSection === 'inbox'
					? 'Inbox'
					: activeSection === 'watched'
						? 'Watched'
						: activeSection === 'saved'
							? 'Saved'
							: ''
	);

	const finalVideos = $derived((): VideoItem[] => {
		if (activeChannelId) {
			// When in inbox mode for a channel, filter watched
			if (activeSection === 'inbox') {
				return allChannelVideos.filter((v) => !watchedStore.isWatched(v.videoId));
			}
			return allChannelVideos;
		}
		if (activePlaylistId) {
			return allPlaylistVideos;
		}
		switch (activeSection) {
			case 'watched': {
				const watchedIds = watchedStore.ids;
				return savedStore.videos.filter((v) => watchedIds.has(v.videoId));
			}
			case 'saved':
				return savedStore.videos;
			default:
				return [];
		}
	});

	const isLoading = $derived(
		activeChannelId
			? $channelVideosQuery.isLoading
			: activePlaylistId
				? $playlistVideosQuery.isLoading
				: activeSection === 'inbox'
					? $subscriptionsQuery.isLoading
					: false
	);

	const isError = $derived(
		activeChannelId
			? $channelVideosQuery.isError
			: activePlaylistId
				? $playlistVideosQuery.isError
				: false
	);

	const hasNextPage = $derived(
		activeChannelId
			? ($channelVideosQuery.hasNextPage ?? false)
			: activePlaylistId
				? ($playlistVideosQuery.hasNextPage ?? false)
				: false
	);

	const isFetchingNextPage = $derived(
		activeChannelId
			? $channelVideosQuery.isFetchingNextPage
			: activePlaylistId
				? $playlistVideosQuery.isFetchingNextPage
				: false
	);

	function loadMore() {
		if (activeChannelId) {
			void $channelVideosQuery.fetchNextPage();
		} else if (activePlaylistId) {
			void $playlistVideosQuery.fetchNextPage();
		}
	}
</script>

<section class="flex h-full flex-col border-r border-gray-200 overflow-hidden bg-white">
	<!-- Section header -->
	<div class="border-b border-gray-200 bg-gray-50 px-3 py-2 flex-shrink-0">
		<h2 class="text-sm font-semibold text-gray-700">{sectionTitle}</h2>
	</div>

	<!-- Video list -->
	<div class="flex-1 overflow-y-auto scrollbar-thin">
		{#if isLoading}
			<div class="flex items-center justify-center py-12 text-sm text-gray-400">
				Loading...
			</div>
		{:else if isError}
			<div class="flex items-center justify-center py-12 text-sm text-red-500">
				Failed to load videos.
			</div>
		{:else if finalVideos().length === 0}
			<div class="flex flex-col items-center justify-center py-12 text-sm text-gray-400 gap-1 px-4 text-center">
				{#if activeSection === 'inbox' && !activeChannelId && !activePlaylistId}
					<p class="text-xs">Select a channel from the sidebar to load its videos.</p>
				{:else if activeSection === 'watched'}
					<p class="text-xs">No watched videos yet.</p>
					<p class="text-xs text-gray-300">Watch videos and mark them as watched.</p>
				{:else if activeSection === 'saved'}
					<p class="text-xs">No saved videos yet.</p>
					<p class="text-xs text-gray-300">Save videos to watch later.</p>
				{:else}
					<p class="text-xs">No videos found.</p>
				{/if}
			</div>
		{:else}
			{#each finalVideos() as video (video.videoId)}
				<VideoCard
					{video}
					isActive={selectedVideoId === video.videoId}
					onClick={onSelectVideo}
				/>
			{/each}

			<!-- Load more -->
			{#if hasNextPage}
				<div class="p-3 text-center border-t border-gray-100">
					<button
						class="px-4 py-1.5 text-xs border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
						onclick={loadMore}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? 'Loading...' : 'Load more'}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</section>
