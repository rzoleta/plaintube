<script lang="ts">
	import { badgeVariants } from './index.js';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		variant = 'default',
		children,
		...restProps
	}: {
		class?: string;
		variant?: 'default' | 'secondary' | 'destructive' | 'outline';
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<div class={cn(badgeVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</div>
