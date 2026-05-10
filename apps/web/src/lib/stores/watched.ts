import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

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

function persist(ids: Set<string>): void {
	if (!browser) return;
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
	} catch {
		// ignore storage errors
	}
}

const _store = writable<Set<string>>(loadWatched());

export const watchedIds = derived(_store, ($s) => $s);

export function markWatched(videoId: string): void {
	_store.update((s) => {
		const next = new Set([...s, videoId]);
		persist(next);
		return next;
	});
}

export function unmarkWatched(videoId: string): void {
	_store.update((s) => {
		const next = new Set(s);
		next.delete(videoId);
		persist(next);
		return next;
	});
}

export function isWatched(videoId: string): boolean {
	let result = false;
	_store.subscribe((s) => (result = s.has(videoId)))();
	return result;
}
