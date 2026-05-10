<script lang="ts">
	import { toggleMode } from 'mode-watcher';
	import { Moon, Sun } from 'lucide-svelte';
	import { cn } from '$lib/utils.js';

	let { class: className }: { class?: string } = $props();
</script>

<button
	onclick={toggleMode}
	class={cn(
		'hover:bg-accent hover:text-accent-foreground text-muted-foreground inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors',
		className
	)}
	aria-label="Toggle dark mode"
>
	<Sun class="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
	<Moon
		class="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
	/>
</button>
