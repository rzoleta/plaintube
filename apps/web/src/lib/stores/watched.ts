import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import type { VideoItem } from '$lib/api/youtube';

const IDS_KEY = 'plaintube:watched';
const ITEMS_KEY = 'plaintube:archived';

function loadWatched(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(IDS_KEY);
		if (!raw) return new Set();
		const parsed = JSON.parse(raw) as string[];
		return new Set(Array.isArray(parsed) ? parsed : []);
	} catch {
		return new Set();
	}
}

function loadArchived(): VideoItem[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(ITEMS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? (parsed as VideoItem[]) : [];
	} catch {
		return [];
	}
}

function persistIds(ids: Set<string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(IDS_KEY, JSON.stringify(Array.from(ids)));
	} catch {}
}

function persistItems(items: VideoItem[]): void {
	if (!browser) return;
	try {
		localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
	} catch {}
}

const _ids = writable<Set<string>>(loadWatched());
const _items = writable<VideoItem[]>(loadArchived());

export const watchedIds = derived(_ids, ($s) => $s);
export const archivedVideos = derived(_items, ($s) => $s);

export function markWatched(video: VideoItem): void {
	_ids.update((s) => {
		const next = new Set([...s, video.videoId]);
		persistIds(next);
		return next;
	});
	_items.update((s) => {
		if (s.some((v) => v.videoId === video.videoId)) return s;
		const next = [video, ...s];
		persistItems(next);
		return next;
	});
}

export function unmarkWatched(videoId: string): void {
	_ids.update((s) => {
		const next = new Set(s);
		next.delete(videoId);
		persistIds(next);
		return next;
	});
	_items.update((s) => {
		const next = s.filter((v) => v.videoId !== videoId);
		persistItems(next);
		return next;
	});
}

export function isWatched(videoId: string): boolean {
	let result = false;
	_ids.subscribe((s) => (result = s.has(videoId)))();
	return result;
}
