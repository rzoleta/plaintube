<script lang="ts">
	import type { VideoItem } from '$lib/api/youtube';
	import { watchedIds, markWatched, unmarkWatched } from '$lib/stores/watched';
	import { savedVideos, saveVideo, unsaveVideo } from '$lib/stores/saved';

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

<section class="flex h-full flex-col overflow-hidden bg-white">
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
			<h1 class="text-base font-semibold leading-snug text-gray-900">
				{video.title}
			</h1>

			<!-- Channel & date -->
			<p class="mt-1 text-sm text-gray-500">
				{video.channelTitle}
				<span class="mx-1 text-gray-300">·</span>
				{formatDate(video.publishedAt)}
			</p>

			<!-- Action buttons -->
			<div class="mt-3 flex gap-2">
				<button
					class="px-3 py-1.5 text-xs border transition-colors
						{isWatched
						? 'bg-[#0078d4] text-white border-[#0078d4] hover:bg-[#006cbf]'
						: 'border-gray-300 text-gray-600 hover:bg-gray-50'}"
					onclick={handleMarkWatched}
				>
					{isWatched ? '✓ Watched' : 'Mark as Watched'}
				</button>

				<button
					class="px-3 py-1.5 text-xs border transition-colors
						{isSaved
						? 'bg-gray-700 text-white border-gray-700 hover:bg-gray-800'
						: 'border-gray-300 text-gray-600 hover:bg-gray-50'}"
					onclick={handleSaveToggle}
				>
					{isSaved ? '★ Saved' : '☆ Save'}
				</button>
			</div>

			<!-- Description -->
			{#if video.description}
				<div class="mt-4 border-t border-gray-200 pt-4">
					<p class="text-xs text-gray-500 whitespace-pre-line line-clamp-6">
						{video.description}
					</p>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Empty state -->
		<div class="flex h-full flex-col items-center justify-center gap-3 text-gray-300">
			<div class="text-6xl">▶</div>
			<div class="text-center">
				<p class="text-sm font-medium text-gray-400">No video selected</p>
				<p class="text-xs text-gray-300 mt-1">
					Select a video from the list to begin watching
				</p>
			</div>
		</div>
	{/if}
</section>
