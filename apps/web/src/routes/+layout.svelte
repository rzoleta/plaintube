<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';

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
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
