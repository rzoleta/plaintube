<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		children,
		...restProps
	}: {
		class?: string;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<DialogPrimitive.Content
	class={cn(
		'fixed left-1/2 top-1/2 z-[51] grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border border-border bg-background p-6 text-foreground shadow-lg sm:rounded-lg',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Content>
