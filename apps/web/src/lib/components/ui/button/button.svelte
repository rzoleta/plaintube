<script lang="ts">
	import { Button as ButtonPrimitive } from 'bits-ui';
	import { buttonVariants } from './index.js';
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		variant = 'default',
		size = 'default',
		ref = $bindable(null),
		href,
		type = 'button',
		disabled,
		onclick,
		children,
		...restProps
	}: {
		class?: string;
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'default' | 'sm' | 'lg' | 'icon';
		ref?: HTMLButtonElement | null;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		children?: import('svelte').Snippet;
		[key: string]: unknown;
	} = $props();
</script>

{#if href}
	<a
		{href}
		class={cn(buttonVariants({ variant, size }), className)}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		{type}
		{disabled}
		{onclick}
		class={cn(buttonVariants({ variant, size }), className)}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
