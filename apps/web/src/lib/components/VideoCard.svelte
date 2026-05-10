<script lang="ts">
  import type { VideoItem } from '$lib/api/youtube';
  import { watchedIds } from '$lib/stores/watched';
  import { savedVideos } from '$lib/stores/saved';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { cn } from '$lib/utils.js';
  import { Archive, Bookmark, BookmarkCheck } from 'lucide-svelte';

  interface Props {
    video: VideoItem;
    isActive: boolean;
    onClick: (video: VideoItem) => void;
    onArchive: (video: VideoItem) => void;
    onSaveToggle: (video: VideoItem) => void;
    /** When set, shown instead of the video thumbnail (e.g. channel avatar). */
    listThumbnailUrl?: string;
    /** Circular square crop (channel-style) vs 16×12 video poster. */
    listThumbnailAsAvatar?: boolean;
  }

  const {
    video,
    isActive,
    onClick,
    onArchive,
    onSaveToggle,
    listThumbnailUrl,
    listThumbnailAsAvatar = false
  }: Props = $props();

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

  /** Calendar date when older than strictly 7 days (list badge readability). */
  function formatPublishedDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const sameYear = date.getFullYear() === now.getFullYear();
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      ...(sameYear ? {} : { year: 'numeric' as const })
    });
  }

  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  const isWatched = $derived($watchedIds.has(video.videoId));
  const isSaved = $derived($savedVideos.some((v) => v.videoId === video.videoId));
  const publishedBadgeLabel = $derived.by(() => {
    const published = new Date(video.publishedAt);
    const diffMs = Date.now() - published.getTime();
    if (diffMs > SEVEN_DAYS_MS) return formatPublishedDate(video.publishedAt);
    return formatRelativeTime(video.publishedAt);
  });
  const displayThumbUrl = $derived(listThumbnailUrl ?? video.thumbnailUrl);

  function handleArchive(e: MouseEvent) {
    e.stopPropagation();
    onArchive(video);
  }

  function handleSave(e: MouseEvent) {
    e.stopPropagation();
    onSaveToggle(video);
  }
</script>

<div
  class={cn(
    'group relative flex w-full items-start gap-2 border-b border-border px-3 py-2 text-left transition-colors cursor-pointer border-l-2',
    isActive
      ? 'bg-primary/20 text-foreground border-l-primary'
      : isWatched
        ? 'bg-muted/50 text-muted-foreground hover:bg-muted border-l-transparent'
        : 'bg-card text-card-foreground hover:bg-accent border-l-transparent',
  )}
  role="button"
  tabindex="0"
  onclick={() => onClick(video)}
  onkeydown={(e) => e.key === 'Enter' && onClick(video)}
>
  <!-- Thumbnail -->
  <div class="relative flex-shrink-0">
    {#if displayThumbUrl}
      <img
        src={displayThumbUrl}
        alt=""
        class={cn(
          'object-cover bg-muted',
          listThumbnailAsAvatar ? 'h-12 w-12 rounded-full' : 'h-12 w-16',
          isWatched && !isActive && 'opacity-50'
        )}
        loading="lazy"
      />
    {:else}
      <div
        class={cn(
          'bg-muted flex items-center justify-center',
          listThumbnailAsAvatar ? 'h-12 w-12 rounded-full' : 'h-12 w-16'
        )}
      >
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
        isWatched && !isActive ? 'text-muted-foreground' : 'text-foreground',
      )}
    >
      {video.title}
    </p>
    <p
      class="mt-0.5 text-xs truncate text-muted-foreground"
    >
      {video.channelTitle}
    </p>
    <div class="mt-1">
      <Badge
        variant="outline"
        class="text-[10px] px-1 py-0 h-4 font-normal"
      >
        {publishedBadgeLabel}
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
