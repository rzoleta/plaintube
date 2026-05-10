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

<DialogPrimitive.Description
	class={cn('text-sm text-pretty text-foreground/80', className)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Description>
