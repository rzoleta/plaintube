<script lang="ts">
	import { cn } from '$lib/utils.js';
	let {
		class: className,
		children,
		...restProps
	}: { class?: string; children?: import('svelte').Snippet; [key: string]: unknown } = $props();
</script>

<div
	class={cn('bg-card text-card-foreground rounded-xl border shadow', className)}
	{...restProps}
>
	{@render children?.()}
</div>
