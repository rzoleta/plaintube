<script lang="ts">
	import type { VideoItem } from '$lib/api/youtube';
	import { watchedIds } from '$lib/stores/watched';

	interface Props {
		video: VideoItem;
		isActive: boolean;
		onClick: (video: VideoItem) => void;
	}

	const { video, isActive, onClick }: Props = $props();

	function formatRelativeTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffSec = Math.floor(diffMs / 1000);
		const diffMin = Math.floor(diffSec / 60);
		const diffHr = Math.floor(diffMin / 60);
		const diffDay = Math.floor(diffHr / 24);
		const diffWk = Math.floor(diffDay / 7);
		const diffMo = Math.floor(diffDay / 30);
		const diffYr = Math.floor(diffDay / 365);

		if (diffSec < 60) return 'just now';
		if (diffMin < 60) return `${diffMin}m ago`;
		if (diffHr < 24) return `${diffHr}h ago`;
		if (diffDay < 7) return `${diffDay}d ago`;
		if (diffWk < 5) return `${diffWk}w ago`;
		if (diffMo < 12) return `${diffMo}mo ago`;
		return `${diffYr}y ago`;
	}

	const isWatched = $derived($watchedIds.has(video.videoId));
	const relativeTime = $derived(formatRelativeTime(video.publishedAt));
</script>

<button
	class="flex w-full items-start gap-2 border-b border-gray-200 px-3 py-2 text-left transition-colors
		{isActive
		? 'bg-[#0078d4] text-white'
		: isWatched
			? 'bg-gray-50 text-gray-400 hover:bg-gray-100'
			: 'bg-white text-gray-900 hover:bg-gray-50'}"
	onclick={() => onClick(video)}
>
	<!-- Thumbnail -->
	<div class="relative flex-shrink-0">
		{#if video.thumbnailUrl}
			<img
				src={video.thumbnailUrl}
				alt=""
				class="h-12 w-16 object-cover bg-gray-200"
				loading="lazy"
			/>
		{:else}
			<div class="h-12 w-16 bg-gray-200 flex items-center justify-center">
				<span class="text-gray-400 text-xs">▶</span>
			</div>
		{/if}
		{#if isWatched && !isActive}
			<div class="absolute inset-0 bg-white/50 flex items-center justify-center">
				<span class="text-xs text-gray-500">✓</span>
			</div>
		{/if}
	</div>

	<!-- Text content -->
	<div class="flex-1 min-w-0">
		<p
			class="text-xs font-medium leading-tight line-clamp-2
				{isActive ? 'text-white' : isWatched ? 'text-gray-400' : 'text-gray-900'}"
		>
			{video.title}
		</p>
		<p
			class="mt-0.5 text-xs truncate
				{isActive ? 'text-blue-100' : 'text-gray-500'}"
		>
			{video.channelTitle}
		</p>
		<p
			class="text-xs
				{isActive ? 'text-blue-100' : 'text-gray-400'}"
		>
			{relativeTime}
		</p>
	</div>
</button>
