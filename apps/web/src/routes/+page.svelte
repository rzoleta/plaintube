<script lang="ts">
	import type { PageData } from './$types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoList from '$lib/components/VideoList.svelte';
	import VideoViewer from '$lib/components/VideoViewer.svelte';
	import type { VideoItem } from '$lib/api/youtube';
	import { signOut } from '@auth/sveltekit/client';

	const { data }: { data: PageData } = $props();

	// ─── App state ────────────────────────────────────────────────────────────

	let activeSection = $state<string>('inbox');
	let activeChannelId = $state<string | null>(null);
	let activeChannelTitle = $state<string | null>(null);
	let activePlaylistId = $state<string | null>(null);
	let activePlaylistTitle = $state<string | null>(null);
	let selectedVideo = $state<VideoItem | null>(null);

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

	async function handleSignOut() {
		await signOut({ callbackUrl: '/login' });
	}
</script>

<div class="grid h-screen overflow-hidden" style="grid-template-columns: 200px 320px 1fr;">
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
	/>

	<!-- Column 3: Video Viewer -->
	<VideoViewer video={selectedVideo} />
</div>
