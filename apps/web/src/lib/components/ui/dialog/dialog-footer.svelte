<script lang="ts">
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

<div
	class={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2', className)}
	{...restProps}
>
	{@render children?.()}
</div>
