<script lang="ts">
  import BasicColorPreviewIcon from '~ui/components/BasicColorPreviewIcon.svelte';
  import LayeredColorPreviewIcon from '~ui/components/LayeredColorPreviewIcon.svelte';

  interface Props {
    borderColor: string;
    indicatorColor: string;
    isBlended: boolean;
  }

  const { borderColor, indicatorColor, isBlended }: Props = $props();
</script>

{#if isBlended}
  <div class="flex">
    <LayeredColorPreviewIcon {borderColor} {indicatorColor} />
  </div>
{:else}
  <BasicColorPreviewIcon {borderColor} {indicatorColor} />
{/if}
