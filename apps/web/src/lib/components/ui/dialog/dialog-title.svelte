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

<DialogPrimitive.Title
	class={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)}
	{...restProps}
>
	{@render children?.()}
</DialogPrimitive.Title>
