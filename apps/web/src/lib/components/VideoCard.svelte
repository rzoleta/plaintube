<script lang="ts">
  import type { VideoItem } from '$lib/api/youtube';
  import { watchedIds, markWatched, unmarkWatched } from '$lib/stores/watched';
  import { savedVideos, saveVideo, unsaveVideo } from '$lib/stores/saved';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { cn } from '$lib/utils.js';
  import { Archive, Bookmark, BookmarkCheck } from 'lucide-svelte';

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
  const isSaved = $derived($savedVideos.some((v) => v.videoId === video.videoId));
  const relativeTime = $derived(formatRelativeTime(video.publishedAt));

  function handleArchive(e: MouseEvent) {
    e.stopPropagation();
    if (isWatched) unmarkWatched(video.videoId);
    else markWatched(video.videoId);
  }

  function handleSave(e: MouseEvent) {
    e.stopPropagation();
    if (isSaved) unsaveVideo(video.videoId);
    else saveVideo(video);
  }
</script>

<div
  class={cn(
    'group relative flex w-full items-start gap-2 border-b border-border px-3 py-2 text-left transition-colors cursor-pointer',
    isActive
      ? 'bg-primary text-primary-foreground'
      : isWatched
        ? 'bg-muted/50 text-muted-foreground hover:bg-muted'
        : 'bg-card text-card-foreground hover:bg-accent',
  )}
  role="button"
  tabindex="0"
  onclick={() => onClick(video)}
  onkeydown={(e) => e.key === 'Enter' && onClick(video)}
>
  <!-- Thumbnail -->
  <div class="relative flex-shrink-0">
    {#if video.thumbnailUrl}
      <img
        src={video.thumbnailUrl}
        alt=""
        class={cn('h-12 w-16 object-cover bg-muted', isWatched && !isActive && 'opacity-50')}
        loading="lazy"
      />
    {:else}
      <div class="h-12 w-16 bg-muted flex items-center justify-center">
        <span class="text-muted-foreground text-xs">▶</span>
      </div>
    {/if}
    {#if isWatched && !isActive}
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="text-xs text-muted-foreground bg-background/70 rounded-sm px-0.5">✓</span>
      </div>
    {/if}
  </div>

  <!-- Text content -->
  <div class="flex-1 min-w-0">
    <p
      class={cn(
        'text-xs font-medium leading-tight line-clamp-2',
        isActive
          ? 'text-primary-foreground'
          : isWatched
            ? 'text-muted-foreground'
            : 'text-foreground',
      )}
    >
      {video.title}
    </p>
    <p
      class={cn(
        'mt-0.5 text-xs truncate',
        isActive ? 'text-primary-foreground/70' : 'text-muted-foreground',
      )}
    >
      {video.channelTitle}
    </p>
    <div class="mt-1">
      <Badge
        variant={isActive ? 'secondary' : 'outline'}
        class={cn(
          'text-[10px] px-1 py-0 h-4 font-normal',
          isActive &&
            'bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30',
        )}
      >
        {relativeTime}
      </Badge>
    </div>
  </div>

  <!-- Hover action buttons -->
  <div
    class={cn(
      'absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity',
      isActive && 'opacity-0 group-hover:opacity-100',
    )}
  >
    <button
      class={cn(
        'flex h-8 w-8 items-center justify-center rounded transition-colors',
        isActive
          ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20'
          : 'text-muted-foreground hover:text-foreground hover:bg-background/80',
      )}
      onclick={handleArchive}
      title={isWatched ? 'Unarchive' : 'Archive'}
    >
      <Archive class="h-4 w-4" />
    </button>
    <button
      class={cn(
        'flex h-8 w-8 items-center justify-center rounded transition-colors',
        isActive
          ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/20'
          : isSaved
            ? 'text-foreground hover:bg-background/80'
            : 'text-muted-foreground hover:text-foreground hover:bg-background/80',
      )}
      onclick={handleSave}
      title={isSaved ? 'Unsave' : 'Save'}
    >
      {#if isSaved}
        <BookmarkCheck class="h-4 w-4" />
      {:else}
        <Bookmark class="h-4 w-4" />
      {/if}
    </button>
  </div>
</div>
