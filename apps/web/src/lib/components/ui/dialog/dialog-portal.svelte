<script lang="ts">
	import { Dialog as DialogPrimitive } from 'bits-ui';

	let {
		children,
		...restProps
	}: {
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	} = $props();
</script>

<DialogPrimitive.Portal {...restProps}>
	{@render children?.()}
</DialogPrimitive.Portal>
