<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		...restProps
	}: {
		class?: string;
		[key: string]: unknown;
	} = $props();
</script>

<DialogPrimitive.Overlay
	class={cn('fixed inset-0 z-50 bg-black/80', className)}
	{...restProps}
/>
