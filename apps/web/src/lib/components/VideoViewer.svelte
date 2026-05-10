<script lang="ts">
	import type { VideoItem } from '$lib/api/youtube';
	import { watchedIds, markWatched, unmarkWatched } from '$lib/stores/watched';
	import { savedVideos, saveVideo, unsaveVideo } from '$lib/stores/saved';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import { Check, Bookmark, BookmarkCheck } from 'lucide-svelte';

	interface Props {
		video: VideoItem | null;
	}

	const { video }: Props = $props();

	const isWatched = $derived(video ? $watchedIds.has(video.videoId) : false);
	const isSaved = $derived(video ? $savedVideos.some((v) => v.videoId === video!.videoId) : false);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleMarkWatched() {
		if (!video) return;
		if (isWatched) {
			unmarkWatched(video.videoId);
		} else {
			markWatched(video.videoId);
		}
	}

	function handleSaveToggle() {
		if (!video) return;
		if (isSaved) {
			unsaveVideo(video.videoId);
		} else {
			saveVideo(video);
		}
	}
</script>

<section class="flex h-full flex-col overflow-hidden bg-background">
	{#if video}
		<!-- YouTube embed -->
		<div class="flex-shrink-0 bg-black">
			<div class="relative w-full" style="padding-bottom: 56.25%;">
				<iframe
					class="absolute inset-0 h-full w-full"
					src="https://www.youtube.com/embed/{video.videoId}?autoplay=0&rel=0&modestbranding=1"
					title={video.title}
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		</div>

		<!-- Video metadata & actions -->
		<div class="flex-1 overflow-y-auto scrollbar-thin p-4">
			<!-- Title -->
			<h1 class="text-base font-semibold leading-snug text-foreground">
				{video.title}
			</h1>

			<!-- Channel & date -->
			<p class="mt-1 text-sm text-muted-foreground">
				{video.channelTitle}
				<span class="mx-1 text-muted-foreground/40">·</span>
				{formatDate(video.publishedAt)}
			</p>

			<!-- Action buttons -->
			<div class="mt-3 flex gap-2">
				<Button
					variant={isWatched ? 'default' : 'outline'}
					size="sm"
					class="gap-1.5 text-xs h-8"
					onclick={handleMarkWatched}
				>
					<Check class="h-3.5 w-3.5" />
					{isWatched ? 'Watched' : 'Mark as Watched'}
				</Button>

				<Button
					variant={isSaved ? 'secondary' : 'outline'}
					size="sm"
					class="gap-1.5 text-xs h-8"
					onclick={handleSaveToggle}
				>
					{#if isSaved}
						<BookmarkCheck class="h-3.5 w-3.5" />
						Saved
					{:else}
						<Bookmark class="h-3.5 w-3.5" />
						Save
					{/if}
				</Button>
			</div>

			<!-- Description -->
			{#if video.description}
				<Separator class="my-4" />
				<p class="text-xs text-muted-foreground whitespace-pre-line line-clamp-6">
					{video.description}
				</p>
			{/if}
		</div>
	{:else}
		<!-- Empty state -->
		<div class="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground/30">
			<div class="text-6xl">▶</div>
			<div class="text-center">
				<p class="text-sm font-medium text-muted-foreground">No video selected</p>
				<p class="text-xs text-muted-foreground/60 mt-1">
					Select a video from the list to begin watching
				</p>
			</div>
		</div>
	{/if}
</section>
