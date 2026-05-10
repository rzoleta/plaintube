<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let {
		open = $bindable(false),
		onOpenChange,
		onOpenChangeComplete,
		children,
		...restProps
	}: {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		onOpenChangeComplete?: (open: boolean) => void;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<DialogPrimitive.Root bind:open {onOpenChange} {onOpenChangeComplete} {...restProps}>
	{@render children?.()}
</DialogPrimitive.Root>
