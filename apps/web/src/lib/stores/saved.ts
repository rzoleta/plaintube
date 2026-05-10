import { browser } from '$app/environment';
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

function saveSaved(items: VideoItem[]): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
	} catch {
		// ignore storage errors
	}
}

// ─── Svelte 5 rune-based store ────────────────────────────────────────────────

let _savedVideos = $state<VideoItem[]>(loadSaved());

export const savedStore = {
	get videos() {
		return _savedVideos;
	},
	saveVideo(video: VideoItem) {
		if (_savedVideos.some((v) => v.videoId === video.videoId)) return;
		_savedVideos = [video, ..._savedVideos];
		saveSaved(_savedVideos);
	},
	unsaveVideo(videoId: string) {
		_savedVideos = _savedVideos.filter((v) => v.videoId !== videoId);
		saveSaved(_savedVideos);
	},
	isSaved(videoId: string): boolean {
		return _savedVideos.some((v) => v.videoId === videoId);
	},
	clear() {
		_savedVideos = [];
		saveSaved(_savedVideos);
	}
};
