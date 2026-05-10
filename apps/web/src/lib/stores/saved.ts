import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';
import type { VideoItem } from '$lib/api/youtube';

const STORAGE_KEY = 'plaintube:saved';

function loadSaved(): VideoItem[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw) as unknown;
		return Array.isArray(parsed) ? (parsed as VideoItem[]) : [];
	} catch {
		return [];
	}
}

function persist(items: VideoItem[]): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// ignore storage errors
	}
}

const _store = writable<VideoItem[]>(loadSaved());

export const savedVideos = derived(_store, ($s) => $s);

export function saveVideo(video: VideoItem): void {
	_store.update((s) => {
		if (s.some((v) => v.videoId === video.videoId)) return s;
		const next = [video, ...s];
		persist(next);
		return next;
	});
}

export function unsaveVideo(videoId: string): void {
	_store.update((s) => {
		const next = s.filter((v) => v.videoId !== videoId);
		persist(next);
		return next;
	});
}

export function isSaved(videoId: string): boolean {
	let result = false;
	_store.subscribe((s) => (result = s.some((v) => v.videoId === videoId)))();
	return result;
}
