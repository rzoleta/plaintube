<script lang="ts">
	import type { PageData } from './$types';
	import { browser } from '$app/environment';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoList from '$lib/components/VideoList.svelte';
	import VideoViewer from '$lib/components/VideoViewer.svelte';
	import type { VideoItem } from '$lib/api/youtube';
	import { watchedIds, markWatched, unmarkWatched } from '$lib/stores/watched';
	import { savedVideos, saveVideo, unsaveVideo } from '$lib/stores/saved';
	import { toast } from 'svelte-sonner';
	import { signOut } from '@auth/sveltekit/client';
	import { PanelLeftOpen } from 'lucide-svelte';

	const { data }: { data: PageData } = $props();

	// ─── App state ────────────────────────────────────────────────────────────

	let activeSection = $state<string>('inbox');
	let activeChannelId = $state<string | null>(null);
	let activeChannelTitle = $state<string | null>(null);
	let activePlaylistId = $state<string | null>(null);
	let activePlaylistTitle = $state<string | null>(null);
	let selectedVideo = $state<VideoItem | null>(null);
	let sidebarHidden = $state<boolean>(false);
	/** Mirrors VideoList ordering for archive → select-next and shortcuts (stale while sidebar/list hidden). */
	let orderedVideos = $state<VideoItem[]>([]);

	type VideoViewerHandle = { playEmbeddedVideo(): void };
	let viewerRef = $state<VideoViewerHandle | null>(null);

	function toggleSidebar() {
		sidebarHidden = !sidebarHidden;
	}

	// ─── Navigation handlers ──────────────────────────────────────────────────

	function handleSelectSection(section: string) {
		activeSection = section;
		activeChannelId = null;
		activeChannelTitle = null;
		activePlaylistId = null;
		activePlaylistTitle = null;
		selectedVideo = null;
	}

	function handleSelectChannel(channelId: string, channelTitle: string) {
		activeSection = 'channel';
		activeChannelId = channelId;
		activeChannelTitle = channelTitle;
		activePlaylistId = null;
		activePlaylistTitle = null;
		selectedVideo = null;
	}

	function handleSelectPlaylist(playlistId: string, playlistTitle: string) {
		activeSection = 'playlist';
		activeChannelId = null;
		activeChannelTitle = null;
		activePlaylistId = playlistId;
		activePlaylistTitle = playlistTitle;
		selectedVideo = null;
	}

	function handleSelectVideo(video: VideoItem) {
		selectedVideo = video;
	}

	function handleOrderedVideosChange(videos: VideoItem[]) {
		orderedVideos = videos;
	}

	function handleArchive(video: VideoItem) {
		if ($watchedIds.has(video.videoId)) {
			unmarkWatched(video.videoId);
			return;
		}
		const list = orderedVideos;
		const idx = list.findIndex((x) => x.videoId === video.videoId);
		const next =
			idx >= 0 && idx + 1 < list.length ? (list[idx + 1] ?? null) : null;
		markWatched(video.videoId);
		toast.success('Archived');
		if (selectedVideo?.videoId === video.videoId) {
			selectedVideo = next;
		}
	}

	function handleSaveToggle(video: VideoItem) {
		const saved = $savedVideos.some((x) => x.videoId === video.videoId);
		if (saved) unsaveVideo(video.videoId);
		else {
			saveVideo(video);
			toast.success('Saved');
		}
	}

	function isTypingTarget(target: EventTarget | null): boolean {
		if (!target || !(target instanceof HTMLElement)) return false;
		const tag = target.tagName;
		if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
		return target.isContentEditable;
	}

	$effect(() => {
		if (!browser) return;

		function onKeydown(e: KeyboardEvent) {
			if (e.defaultPrevented) return;
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (isTypingTarget(e.target)) return;

			const list = orderedVideos;
			const k = e.key;

			if (k === ' ' || e.code === 'Space') {
				if (!selectedVideo) return;
				e.preventDefault();
				viewerRef?.playEmbeddedVideo();
				return;
			}

			if (k === 'j' || k === 'J') {
				if (list.length === 0) return;
				e.preventDefault();
				const idx = selectedVideo
					? list.findIndex((x) => x.videoId === selectedVideo!.videoId)
					: -1;
				if (idx === -1) {
					selectedVideo = list[0] ?? null;
					return;
				}
				if (idx < list.length - 1) selectedVideo = list[idx + 1] ?? null;
				return;
			}

			if (k === 'k' || k === 'K') {
				if (list.length === 0 || !selectedVideo) return;
				e.preventDefault();
				const idx = list.findIndex((x) => x.videoId === selectedVideo!.videoId);
				if (idx <= 0) return;
				selectedVideo = list[idx - 1] ?? null;
				return;
			}

			const v = selectedVideo;
			if (!v) return;

			if (k === 'e' || k === 'E') {
				e.preventDefault();
				handleArchive(v);
				return;
			}
			if (k === 's' || k === 'S') {
				e.preventDefault();
				handleSaveToggle(v);
			}
		}

		window.addEventListener('keydown', onKeydown);
		return () => window.removeEventListener('keydown', onKeydown);
	});

	async function handleSignOut() {
		await signOut({ callbackUrl: '/login' });
	}
</script>

<div
	class="relative grid h-screen overflow-hidden bg-background"
	style={sidebarHidden ? 'grid-template-columns: 100%' : 'grid-template-columns: 10% 20% 70%'}
>
	{#if !sidebarHidden}
		<!-- Column 1: Sidebar -->
		<Sidebar
			{activeSection}
			{activeChannelId}
			{activePlaylistId}
			onSelectSection={handleSelectSection}
			onSelectChannel={handleSelectChannel}
			onSelectPlaylist={handleSelectPlaylist}
			onSignOut={handleSignOut}
		/>

		<!-- Column 2: Video List -->
		<VideoList
			{activeSection}
			{activeChannelId}
			{activePlaylistId}
			{activeChannelTitle}
			{activePlaylistTitle}
			selectedVideoId={selectedVideo?.videoId ?? null}
			onSelectVideo={handleSelectVideo}
			onToggleSidebar={toggleSidebar}
			onInboxReset={() => {
				selectedVideo = null;
			}}
			onOrderedVideosChange={handleOrderedVideosChange}
			onArchiveVideo={handleArchive}
			onSaveToggleVideo={handleSaveToggle}
		/>
	{/if}

	<!-- Column 3: Video Viewer -->
	<VideoViewer
		bind:this={viewerRef}
		video={selectedVideo}
		onArchive={handleArchive}
		onSaveToggle={handleSaveToggle}
	/>

	{#if sidebarHidden}
		<button
			type="button"
			onclick={toggleSidebar}
			class="absolute top-2 left-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card/80 text-muted-foreground backdrop-blur hover:text-foreground hover:bg-card transition-colors shadow-sm"
			title="Show sidebar"
			aria-label="Show sidebar"
		>
			<PanelLeftOpen class="h-4 w-4" />
		</button>
	{/if}
</div>
