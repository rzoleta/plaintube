<script lang="ts">
	import '../app.css';
	import { dev } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	injectAnalytics({ mode: dev ? 'development' : 'production' });

	const { children } = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1000 * 60 * 5, // 5 minutes
				retry: 1
			}
		}
	});
</script>

<ModeWatcher />
<Toaster />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
