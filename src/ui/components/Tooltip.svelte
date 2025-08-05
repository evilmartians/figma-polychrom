<script lang="ts">
	import type { Placement } from '@floating-ui/dom';
	import type { Snippet } from 'svelte';

	import { createFloatingActions } from 'svelte-floating-ui';
	import { flip, offset, shift } from 'svelte-floating-ui/dom';

	interface Props {
		children: Snippet;
		placement?: Placement;
		trigger: Snippet;
	}
	const { children, placement = 'top', trigger }: Props = $props();

	const [floatingRef, floatingContent] = createFloatingActions({
		autoUpdate: {
			ancestorResize: true,
			elementResize: true
		},
		middleware: [
			offset(5),
			flip({
				fallbackAxisSideDirection: 'start',
				padding: 5
			}),
			shift({ padding: 5 })
		],
		placement,
		strategy: 'absolute'
	});

	let showTooltip = $state(false);
</script>

<button
	onclick={() => (showTooltip = true)}
	onmouseenter={() => (showTooltip = true)}
	onmouseleave={() => (showTooltip = false)}
	use:floatingRef
>
	{@render trigger()}
</button>

{#if showTooltip}
	<div
		style="position:absolute"
		use:floatingContent
		class="rounded-full bg-black p-2 px-3 py-1.5 font-martianMono text-xxs font-medium text-white shadow-md dark:bg-white dark:text-black"
	>
		{@render children()}
	</div>
{/if}
