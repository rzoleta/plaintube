<script lang="ts">
	import { derived } from 'svelte/store';
	import { createInfiniteQuery, createQuery, type InfiniteData } from '@tanstack/svelte-query';
	import VideoCard from './VideoCard.svelte';
	import type { VideoItem, PaginatedVideos, Subscription } from '$lib/api/youtube';
	import { watchedIds } from '$lib/stores/watched';
	import { savedVideos } from '$lib/stores/saved';
	import { Button } from '$lib/components/ui/button/index.js';
	import { PanelLeftClose } from 'lucide-svelte';

	interface Props {
		activeSection: string;
		activeChannelId: string | null;
		activePlaylistId: string | null;
		activeChannelTitle: string | null;
		activePlaylistTitle: string | null;
		selectedVideoId: string | null;
		onSelectVideo: (video: VideoItem) => void;
		onToggleSidebar?: () => void;
	}

	const {
		activeSection,
		activeChannelId,
		activePlaylistId,
		activeChannelTitle,
		activePlaylistTitle,
		selectedVideoId,
		onSelectVideo,
		onToggleSidebar
	}: Props = $props();

	// Reactive props as stores for TanStack Query options
	function reactiveStore<T>(getter: () => T) {
		let subscribers: Array<(v: T) => void> = [];
		let value = getter();

		function notify(v: T) {
			for (const s of subscribers) s(v);
		}

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

	// ─── Inbox query (all subscribed channels merged) ────────────────────────

	const inboxOptions = derived(
		[sectionStore, channelIdStore, playlistIdStore],
		([$section, $channelId, $playlistId]) => ({
			queryKey: ['inbox'] as const,
			queryFn: async () => {
				const res = await fetch('/api/inbox');
				if (!res.ok) throw new Error(await res.text());
				return res.json() as Promise<PaginatedVideos>;
			},
			staleTime: 1000 * 60 * 10, // 10 min — inbox is expensive to fetch
			enabled: $section === 'inbox' && !$channelId && !$playlistId
		})
	);

	const inboxQuery = createQuery<PaginatedVideos, Error, PaginatedVideos, readonly string[]>(
		inboxOptions
	);

	// Shared with Sidebar queryKey — warms cache for saved/archived channel avatars.
	const subscriptionsQuery = createQuery<Subscription[], Error, Subscription[], readonly string[]>({
		queryKey: ['subscriptions'],
		queryFn: async () => {
			const cached = sessionStorage.getItem('plaintube:subscriptions');
			if (cached) {
				return JSON.parse(cached) as Subscription[];
			}
			const res = await fetch('/api/subscriptions');
			if (!res.ok) throw new Error('Failed to fetch subscriptions');
			const data = (await res.json()) as Subscription[];
			sessionStorage.setItem('plaintube:subscriptions', JSON.stringify(data));
			return data;
		},
		staleTime: 1000 * 60 * 30
	});

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
						? 'Archived'
						: activeSection === 'saved'
							? 'Saved'
							: ''
	);

	const useChannelThumbnailInList = $derived(
		!activeChannelId &&
			!activePlaylistId &&
			(activeSection === 'inbox' || activeSection === 'saved' || activeSection === 'watched')
	);

	const subscriptionChannelThumbById = $derived(
		new Map(($subscriptionsQuery.data ?? []).map((s) => [s.channelId, s.thumbnailUrl]))
	);

	function channelListThumbnail(video: VideoItem): string | undefined {
		if (!useChannelThumbnailInList) return undefined;
		const fromVideo = video.channelThumbnailUrl?.trim();
		if (fromVideo) return fromVideo;
		const fromSub = subscriptionChannelThumbById.get(video.channelId)?.trim();
		return fromSub || undefined;
	}

	const finalVideos = $derived((): VideoItem[] => {
		if (activeChannelId) {
			return allChannelVideos.filter((v) =>
				activeSection === 'inbox' ? !$watchedIds.has(v.videoId) : true
			);
		}
		if (activePlaylistId) return allPlaylistVideos;
		switch (activeSection) {
			case 'inbox':
				return ($inboxQuery.data?.items ?? []).filter((v) => !$watchedIds.has(v.videoId));
			case 'watched':
				return $savedVideos.filter((v) => $watchedIds.has(v.videoId));
			case 'saved':
				return $savedVideos;
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
					? $inboxQuery.isLoading
					: false
	);

	const isError = $derived(
		activeChannelId
			? $channelVideosQuery.isError
			: activePlaylistId
				? $playlistVideosQuery.isError
				: activeSection === 'inbox'
					? $inboxQuery.isError
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

<section class="flex h-full flex-col border-r border-border overflow-hidden bg-background">
	<!-- Section header -->
	<div class="border-b border-border bg-card px-3 py-2 flex-shrink-0 flex items-center justify-between gap-2">
		<h2 class="text-sm font-semibold text-foreground truncate">{sectionTitle}</h2>
		{#if onToggleSidebar}
			<button
				type="button"
				onclick={onToggleSidebar}
				class="shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
				title="Hide sidebar"
				aria-label="Hide sidebar"
			>
				<PanelLeftClose class="h-4 w-4" />
			</button>
		{/if}
	</div>

	<!-- Video list -->
	<div class="flex-1 overflow-y-auto scrollbar-thin">
		{#if isLoading}
			<div class="flex items-center justify-center py-12 text-sm text-muted-foreground">
				Loading...
			</div>
		{:else if isError}
			<div class="flex items-center justify-center py-12 text-sm text-destructive">
				Failed to load videos.
			</div>
		{:else if finalVideos().length === 0}
			<div
				class="flex flex-col items-center justify-center py-12 text-sm text-muted-foreground gap-1 px-4 text-center"
			>
				{#if activeSection === 'inbox' && !activeChannelId && !activePlaylistId}
					<p class="text-xs">Select a channel from the sidebar to load its videos.</p>
				{:else if activeSection === 'watched'}
					<p class="text-xs">No archived videos yet.</p>
					<p class="text-xs text-muted-foreground/60">Archive videos to remove them from your inbox.</p>
				{:else if activeSection === 'saved'}
					<p class="text-xs">No saved videos yet.</p>
					<p class="text-xs text-muted-foreground/60">Save videos to watch later.</p>
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
					listThumbnailUrl={channelListThumbnail(video)}
					listThumbnailAsAvatar={useChannelThumbnailInList}
				/>
			{/each}

			<!-- Load more -->
			{#if hasNextPage}
				<div class="p-3 text-center border-t border-border">
					<Button
						variant="outline"
						size="sm"
						class="text-xs h-7"
						onclick={loadMore}
						disabled={isFetchingNextPage}
					>
						{isFetchingNextPage ? 'Loading...' : 'Load more'}
					</Button>
				</div>
			{/if}
		{/if}
	</div>
</section>
