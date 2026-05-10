<script lang="ts">
	import type { PageData } from './$types';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import VideoList from '$lib/components/VideoList.svelte';
	import VideoViewer from '$lib/components/VideoViewer.svelte';
	import type { VideoItem } from '$lib/api/youtube';
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
		/>
	{/if}

	<!-- Column 3: Video Viewer -->
	<VideoViewer video={selectedVideo} />

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
