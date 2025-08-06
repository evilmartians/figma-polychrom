<script lang="ts">
  import BasicColorPreviewIcon from '~ui/components/BasicColorPreviewIcon.svelte';
  import LayeredColorPreviewIcon from '~ui/components/LayeredColorPreviewIcon.svelte';

  const { borderColor, indicatorColor, isBlended }: {
    borderColor: string;
    indicatorColor: string;
    isBlended: boolean;
  } = $props();
</script>

{#if isBlended}
  <div class="flex">
    <LayeredColorPreviewIcon {borderColor} {indicatorColor} />
  </div>
{:else}
  <BasicColorPreviewIcon {borderColor} {indicatorColor} />
{/if}
