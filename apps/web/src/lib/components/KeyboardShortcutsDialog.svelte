<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { CircleHelp } from 'lucide-svelte';

	let open = $state(false);

	const shortcuts = [
		{ key: 'j', description: 'Select next video' },
		{ key: 'k', description: 'Select previous video' },
		{ key: 'Space', description: 'Play selected video' },
		{ key: 'e', description: 'Archive / unarchive video' },
		{ key: 's', description: 'Save / unsave video' }
	];
</script>

<button
	type="button"
	onclick={() => (open = true)}
	class="inline-flex h-5 w-5 items-center justify-center rounded text-primary-foreground/60 hover:text-primary-foreground transition-colors"
	title="Keyboard shortcuts"
	aria-label="Keyboard shortcuts"
>
	<CircleHelp class="h-3.5 w-3.5" />
</button>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay />
		<Dialog.Content class="sm:max-w-sm">
			<Dialog.Header>
				<Dialog.Title>Keyboard shortcuts</Dialog.Title>
			</Dialog.Header>
			<div class="mt-2 space-y-1">
				{#each shortcuts as { key, description }}
					<div class="flex items-center justify-between py-1.5 text-sm">
						<span class="text-muted-foreground">{description}</span>
						<kbd
							class="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs text-foreground"
						>{key}</kbd>
					</div>
				{/each}
			</div>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
