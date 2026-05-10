<script lang="ts">
	import { Toaster as Sonner, type ToasterProps } from 'svelte-sonner';
	import { mode } from 'mode-watcher';

	let { ...restProps }: ToasterProps = $props();

	const toasterTheme = $derived(
		mode.current === 'dark'
			? 'dark'
			: mode.current === 'light'
				? 'light'
				: 'system'
	);
</script>

<Sonner
	theme={toasterTheme}
	position="bottom-right"
	class="toaster group"
	style="--normal-bg: hsl(var(--popover)); --normal-text: hsl(var(--popover-foreground)); --normal-border: hsl(var(--border));"
	{...restProps}
/>
