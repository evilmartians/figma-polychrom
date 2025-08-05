<script lang="ts">
	import SettingsIcon from '~ui/components/SettingsIcon.svelte';
	import Tooltip from '~ui/components/Tooltip.svelte';
	import {
		changeColorSpaceDisplayMode,
		colorSpaceDisplayMode,
		colorSpaceDisplayModesList
	} from '~ui/stores/color-space-display-mode.ts';
</script>

<Tooltip placement="top-start">
	{#snippet trigger()}
		<button
			class="interactive flex size-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
			onclick={changeColorSpaceDisplayMode}
			type="button"
		>
			<SettingsIcon />
		</button>
	{/snippet}

	<p class="flex gap-x-2">
		{#each colorSpaceDisplayModesList as mode}
			<span class={mode !== $colorSpaceDisplayMode ? 'opacity-70 dark:opacity-50' : 'font-bold'}>
				{mode}
			</span>
		{/each}
	</p>
</Tooltip>
