import { browser } from '$app/environment';

const STORAGE_KEY = 'plaintube:watched';

function loadWatched(): Set<string> {
	if (!browser) return new Set();
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return new Set();
		const parsed = JSON.parse(raw) as string[];
		return new Set(Array.isArray(parsed) ? parsed : []);
	} catch {
		return new Set();
	}
}

function saveWatched(ids: Set<string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
	} catch {
		// ignore storage errors
	}
}

// ─── Svelte 5 rune-based store ────────────────────────────────────────────────

let _watchedIds = $state<Set<string>>(loadWatched());

export const watchedStore = {
	get ids() {
		return _watchedIds;
	},
	markWatched(videoId: string) {
		_watchedIds = new Set([..._watchedIds, videoId]);
		saveWatched(_watchedIds);
	},
	unmarkWatched(videoId: string) {
		const next = new Set(_watchedIds);
		next.delete(videoId);
		_watchedIds = next;
		saveWatched(_watchedIds);
	},
	isWatched(videoId: string): boolean {
		return _watchedIds.has(videoId);
	},
	clear() {
		_watchedIds = new Set();
		saveWatched(_watchedIds);
	}
};
