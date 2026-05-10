<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import type { Subscription, Playlist } from '$lib/api/youtube';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import DarkModeToggle from '$lib/components/ui/dark-mode-toggle/DarkModeToggle.svelte';
	import { ChevronDown, ChevronRight, LogOut } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';

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
		{ id: 'watched', label: 'Archived' },
		{ id: 'saved', label: 'Saved' }
	];

	function isActive(section: string): boolean {
		return activeSection === section && activeChannelId === null && activePlaylistId === null;
	}
</script>

<aside class="flex h-full flex-col overflow-hidden border-r border-border bg-card">
	<!-- App header -->
	<div class="flex-shrink-0 bg-primary px-3 py-2.5">
		<span class="text-sm font-bold tracking-wide text-primary-foreground">PlainTube</span>
	</div>

	<!-- Scrollable nav area -->
	<nav class="flex-1 overflow-y-auto scrollbar-thin px-1.5 py-1.5 space-y-0.5">
		<!-- Main sections -->
		{#each mainSections as section (section.id)}
			<Button
				variant={isActive(section.id) ? 'default' : 'ghost'}
				size="sm"
				class="w-full justify-start text-xs h-7"
				onclick={() => onSelectSection(section.id)}
			>
				{section.label}
			</Button>
		{/each}

		<Separator class="my-1.5" />

		<!-- Playlists section -->
		<div>
			<button
				class="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
				onclick={() => (playlistsExpanded = !playlistsExpanded)}
			>
				<span>Playlists</span>
				{#if playlistsExpanded}
					<ChevronDown class="h-3 w-3" />
				{:else}
					<ChevronRight class="h-3 w-3" />
				{/if}
			</button>

			{#if playlistsExpanded}
				<div class="mt-0.5 space-y-0.5">
					{#if $playlistsQuery.isLoading}
						<div class="px-2 py-1 text-xs text-muted-foreground">Loading...</div>
					{:else if $playlistsQuery.isError}
						<div class="px-2 py-1 text-xs text-destructive">Failed to load</div>
					{:else if $playlistsQuery.data}
						{#each $playlistsQuery.data.items as playlist (playlist.id)}
							<Button
								variant={activePlaylistId === playlist.id ? 'default' : 'ghost'}
								size="sm"
								class="w-full justify-start text-xs h-7 pl-4 truncate"
								onclick={() => onSelectPlaylist(playlist.id, playlist.title)}
								title={playlist.title}
							>
								<span class="truncate">{playlist.title}</span>
							</Button>
						{:else}
							<div class="px-4 py-1 text-xs text-muted-foreground">No playlists</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>

		<Separator class="my-1.5" />

		<!-- Channels section -->
		<div>
			<button
				class="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
				onclick={() => (channelsExpanded = !channelsExpanded)}
			>
				<span>Channels</span>
				{#if channelsExpanded}
					<ChevronDown class="h-3 w-3" />
				{:else}
					<ChevronRight class="h-3 w-3" />
				{/if}
			</button>

			{#if channelsExpanded}
				<div class="mt-0.5 space-y-0.5">
					{#if $subscriptionsQuery.isLoading}
						<div class="px-2 py-1 text-xs text-muted-foreground">Loading...</div>
					{:else if $subscriptionsQuery.isError}
						<div class="px-2 py-2 text-xs text-destructive break-words">
							Error: {$subscriptionsQuery.error?.message ?? 'Failed to load'}
						</div>
					{:else if $subscriptionsQuery.data}
						{#each $subscriptionsQuery.data as sub (sub.channelId)}
							<Button
								variant={activeChannelId === sub.channelId ? 'default' : 'ghost'}
								size="sm"
								class="w-full justify-start text-xs h-7 pl-3 gap-1.5"
								onclick={() => onSelectChannel(sub.channelId, sub.title)}
								title={sub.title}
							>
								{#if sub.thumbnailUrl}
									<img
										src={sub.thumbnailUrl}
										alt=""
										class={cn(
											'h-4 w-4 rounded-full flex-shrink-0 object-cover',
											activeChannelId === sub.channelId ? 'opacity-100' : 'opacity-80'
										)}
									/>
								{/if}
								<span class="truncate">{sub.title}</span>
							</Button>
						{:else}
							<div class="px-4 py-1 text-xs text-muted-foreground">No subscriptions</div>
						{/each}
					{/if}
				</div>
			{/if}
		</div>
	</nav>

	<!-- Bottom actions -->
	<div class="flex-shrink-0 border-t border-border p-1.5 flex items-center justify-between gap-1">
		<Button
			variant="ghost"
			size="sm"
			class="flex-1 justify-start gap-1.5 text-xs h-7 text-muted-foreground"
			onclick={onSignOut}
		>
			<LogOut class="h-3.5 w-3.5" />
			Sign out
		</Button>
		<DarkModeToggle />
	</div>
</aside>
