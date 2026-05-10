<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import type { Subscription, Playlist } from '$lib/api/youtube';

	interface Props {
		activeSection: string;
		activeChannelId: string | null;
		activePlaylistId: string | null;
		onSelectSection: (section: string) => void;
		onSelectChannel: (channelId: string, channelTitle: string) => void;
		onSelectPlaylist: (playlistId: string, playlistTitle: string) => void;
		onSignOut: () => void;
	}

	const {
		activeSection,
		activeChannelId,
		activePlaylistId,
		onSelectSection,
		onSelectChannel,
		onSelectPlaylist,
		onSignOut
	}: Props = $props();

	let channelsExpanded = $state(true);
	let playlistsExpanded = $state(true);

	const subscriptionsQuery = createQuery<Subscription[]>({
		queryKey: ['subscriptions'],
		queryFn: async () => {
			// Check sessionStorage cache first
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
		staleTime: 1000 * 60 * 30 // 30 min
	});

	const playlistsQuery = createQuery<{ items: Playlist[]; nextPageToken: string | null }>({
		queryKey: ['playlists'],
		queryFn: async () => {
			const res = await fetch('/api/playlists');
			if (!res.ok) throw new Error('Failed to fetch playlists');
			return res.json();
		},
		staleTime: 1000 * 60 * 30
	});

	const mainSections = [
		{ id: 'inbox', label: 'Inbox' },
		{ id: 'watched', label: 'Watched' },
		{ id: 'saved', label: 'Saved' }
	];

	function isActive(section: string): boolean {
		return activeSection === section && activeChannelId === null && activePlaylistId === null;
	}
</script>

<aside class="flex h-full flex-col border-r border-gray-200 bg-gray-50 overflow-hidden">
	<!-- App header -->
	<div class="border-b border-gray-200 bg-[#0078d4] px-3 py-2">
		<span class="text-sm font-bold tracking-wide text-white">PlainTube</span>
	</div>

	<!-- Scrollable nav area -->
	<nav class="flex-1 overflow-y-auto scrollbar-thin py-1">
		<!-- Main sections -->
		{#each mainSections as section (section.id)}
			<button
				class="flex w-full items-center px-3 py-1.5 text-left text-sm transition-colors
					{isActive(section.id)
					? 'bg-[#0078d4] text-white font-medium'
					: 'text-gray-700 hover:bg-gray-200'}"
				onclick={() => onSelectSection(section.id)}
			>
				{section.label}
			</button>
		{/each}

		<!-- Divider -->
		<div class="my-1 border-t border-gray-200"></div>

		<!-- Playlists section -->
		<div>
			<button
				class="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors"
				onclick={() => (playlistsExpanded = !playlistsExpanded)}
			>
				<span>Playlists</span>
				<span class="text-gray-400">{playlistsExpanded ? '▾' : '▸'}</span>
			</button>

			{#if playlistsExpanded}
				{#if $playlistsQuery.isLoading}
					<div class="px-3 py-1 text-xs text-gray-400">Loading...</div>
				{:else if $playlistsQuery.isError}
					<div class="px-3 py-1 text-xs text-red-500">Failed to load</div>
				{:else if $playlistsQuery.data}
					{#each $playlistsQuery.data.items as playlist (playlist.id)}
						<button
							class="flex w-full items-center px-4 py-1.5 text-left text-sm transition-colors truncate
								{activePlaylistId === playlist.id
								? 'bg-[#0078d4] text-white font-medium'
								: 'text-gray-700 hover:bg-gray-200'}"
							onclick={() => onSelectPlaylist(playlist.id, playlist.title)}
							title={playlist.title}
						>
							<span class="truncate">{playlist.title}</span>
						</button>
					{:else}
						<div class="px-4 py-1 text-xs text-gray-400">No playlists</div>
					{/each}
				{/if}
			{/if}
		</div>

		<!-- Divider -->
		<div class="my-1 border-t border-gray-200"></div>

		<!-- Channels section -->
		<div>
			<button
				class="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hover:bg-gray-200 transition-colors"
				onclick={() => (channelsExpanded = !channelsExpanded)}
			>
				<span>Channels</span>
				<span class="text-gray-400">{channelsExpanded ? '▾' : '▸'}</span>
			</button>

			{#if channelsExpanded}
				{#if $subscriptionsQuery.isLoading}
					<div class="px-3 py-1 text-xs text-gray-400">Loading...</div>
				{:else if $subscriptionsQuery.isError}
					<div class="px-3 py-2 text-xs text-red-500 break-words">
						Error: {$subscriptionsQuery.error?.message ?? 'Failed to load'}
					</div>
				{:else if $subscriptionsQuery.data}
					{#each $subscriptionsQuery.data as sub (sub.channelId)}
						<button
							class="flex w-full items-center gap-2 px-4 py-1.5 text-left text-sm transition-colors
								{activeChannelId === sub.channelId
								? 'bg-[#0078d4] text-white font-medium'
								: 'text-gray-700 hover:bg-gray-200'}"
							onclick={() => onSelectChannel(sub.channelId, sub.title)}
							title={sub.title}
						>
							{#if sub.thumbnailUrl}
								<img
									src={sub.thumbnailUrl}
									alt=""
									class="h-4 w-4 rounded-full flex-shrink-0 object-cover"
								/>
							{/if}
							<span class="truncate">{sub.title}</span>
						</button>
					{:else}
						<div class="px-4 py-1 text-xs text-gray-400">No subscriptions</div>
					{/each}
				{/if}
			{/if}
		</div>
	</nav>

	<!-- Sign out button -->
	<div class="border-t border-gray-200 p-2">
		<button
			class="w-full px-3 py-1.5 text-left text-xs text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
			onclick={onSignOut}
		>
			Sign out
		</button>
	</div>
</aside>
