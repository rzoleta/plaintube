<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		orientation = 'horizontal',
		decorative = true,
		...restProps
	}: {
		class?: string;
		orientation?: 'horizontal' | 'vertical';
		decorative?: boolean;
		[key: string]: unknown;
	} = $props();
</script>

<div
	role={decorative ? 'none' : 'separator'}
	aria-orientation={decorative ? undefined : orientation}
	class={cn(
		'bg-border shrink-0',
		orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
		className
	)}
	{...restProps}
></div>
