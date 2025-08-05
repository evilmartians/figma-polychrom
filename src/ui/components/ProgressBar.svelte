<script lang="ts">
	import RewardingAnimationBodyText from '~ui/components/RewardingAnimationBodyText.svelte';
	import RewardingAnimationContentText from '~ui/components/RewardingAnimationContentText.svelte';
	import RewardingAnimationFluentText from '~ui/components/RewardingAnimationFluentText.svelte';
	import { conclusions } from '~ui/services/apca/conclusion.ts';
	import { rewardAnimationLaunch } from '~ui/stores/selected-nodes.ts';
	import { ThemeVariablesKeys } from '~ui/types';

	interface Props {
		apca: number;
		height: number;
	}

	const { apca, height }: Props = $props();
	const SCALE = 2;
	const APCA_NEGATIVE_MAX_SCALE = 108;
	const APCA_POSITIVE_MAX_SCALE = 106;
	const SERIF_OFFSET = 2;
	const maxScale = apca > 0 ? APCA_POSITIVE_MAX_SCALE : APCA_NEGATIVE_MAX_SCALE;
	const barWidth = maxScale * SCALE;
	const filledSegmentWidth = Math.abs(apca) * SCALE;
	const [, ...conclusionScores] = Object.values(conclusions).reverse();
	const conclusionArray = Array.from({ length: conclusionScores.length }).map((_, i) => {
		const value = conclusionScores[i] ?? 0;
		const isContextText = value === conclusions['Content Text'];
		const isBodyText = value === conclusions['Body Text'];
		const isFluentText = value === conclusions['Fluent Text'];
		const position = value * SCALE - SERIF_OFFSET;

		return {
			isBodyText,
			isContextText,
			isFluentText,
			position
		};
	});
</script>

<div class="flex items-center justify-center">
	<div class="flex items-center">
		<span style="color: var({ThemeVariablesKeys.secondary})" class="mr-2 text-xxs"> 0 </span>

		<div
			style="
        background-color: var({ThemeVariablesKeys.secondary12});
        height: {height}px;
        width: {barWidth}px;
      "
			class="relative rounded-full"
		>
			<div
				style="
          background-image: linear-gradient(to right, var({ThemeVariablesKeys.fg70}) 70%, var({ThemeVariablesKeys.fg}) 85%);
          height: {height}px;
          width: {filledSegmentWidth}px;
        "
				class="rounded-full"
			>
				{#each conclusionArray as { isBodyText, isContextText, isFluentText, position }}
					<div
						style="
            --color-sparkles: var({ThemeVariablesKeys.fg});
            background-color: var({ThemeVariablesKeys.bg});
            left: {position}px;"
						class="absolute top-1/2 w-px -translate-y-1/2 {isContextText ? 'h-1' : 'h-0.5'}"
					>
						{#if $rewardAnimationLaunch.contentText}
							<RewardingAnimationContentText />
						{/if}

						{#if isBodyText && $rewardAnimationLaunch.bodyText === true}
							<RewardingAnimationBodyText />
						{/if}

						{#if isFluentText && $rewardAnimationLaunch.fluentText === true}
							<RewardingAnimationFluentText />
						{/if}
					</div>
				{/each}
			</div>
		</div>
		<span style="color: var({ThemeVariablesKeys.secondary})" class="ml-2 text-xxs">
			{maxScale}
		</span>
	</div>
</div>
