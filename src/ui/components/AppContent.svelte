<script lang="ts">
  import EmptySelectionMessage from '~ui/components/EmptySelectionMessage.svelte';
  import InvalidBackgroundSelectionMessage from '~ui/components/InvalidBackgroundSelectionMessage.svelte';
  import Selection from '~ui/components/Selection.svelte';
  import SelectionsList from '~ui/components/SelectionsList.svelte';
  import UnprocessedBlendModesSelectionMessage from '~ui/components/UnprocessedBlendModesSelectionMessage.svelte';
  import {
    contrastConclusion,
    isEmptySelection,
    isInvalidBackground,
    isMultiSelection,
    isSingleSelection,
    isUnprocessedBlendModes,
  } from '~ui/stores/selected-nodes.ts';
  import { isEmpty } from '~utils/not-empty.ts';
</script>

{#if $isInvalidBackground}
  <InvalidBackgroundSelectionMessage />
{:else if $isUnprocessedBlendModes}
  <UnprocessedBlendModesSelectionMessage />
{:else if $isEmptySelection || isEmpty($contrastConclusion)}
  <EmptySelectionMessage />
{:else if $isMultiSelection}
  <SelectionsList contrastConclusion={$contrastConclusion} />
{:else if $isSingleSelection}
  {#if isEmpty($contrastConclusion[0])}
    <EmptySelectionMessage />
  {:else}
    <Selection
      id={$contrastConclusion[0].id}
      isLast={true}
      size="large"
      userSelection={$contrastConclusion[0]}
    />
  {/if}
{/if}
