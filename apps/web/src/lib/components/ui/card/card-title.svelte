<script lang="ts">
	import { cn } from '$lib/utils.js';
	let {
		class: className,
		children,
		...restProps
	}: { class?: string; children?: import('svelte').Snippet; [key: string]: unknown } = $props();
</script>

<h3 class={cn('font-semibold leading-none tracking-tight', className)} {...restProps}>
	{@render children?.()}
</h3>
