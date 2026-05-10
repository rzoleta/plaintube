<script lang="ts">
	import { cn } from '$lib/utils.js';
	let {
		class: className,
		children,
		...restProps
	}: { class?: string; children?: import('svelte').Snippet; [key: string]: unknown } = $props();
</script>

<div class={cn('p-6 pt-0', className)} {...restProps}>
	{@render children?.()}
</div>
