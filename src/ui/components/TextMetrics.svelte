<script lang="ts">
  import PictureIcon from '~ui/components/PictureIcon.svelte';
  import StopIcon from '~ui/components/StopIcon.svelte';
  import WarningIcon from '~ui/components/WarningIcon.svelte';
  import { conclusions } from '~ui/services/apca/conclusion.ts';
  import { ThemeVariablesKeys } from '~ui/types';
  import { fontLookupAPCA } from 'apca-w3';

  interface Props {
    apca: number;
  }
  const { apca }: Props = $props();

  const [, , , , regular, , , bold] = fontLookupAPCA(apca);
</script>

{#if Math.abs(apca) < conclusions['Not Readable']}
  <StopIcon />
{:else if Math.abs(apca) < conclusions['Non-Text']}
  <WarningIcon />
{:else if Math.abs(apca) < conclusions['Large Text']}
  <PictureIcon />
{:else}
  <div style:color="var({ThemeVariablesKeys.fg})" class="flex items-center">
    <div class="mr-3 flex items-center">
      <p
        style:border-color=" var({ThemeVariablesKeys.fg})"
        class="mr-2 rounded border-0.5 p-1 text-xxxs font-medium leading-[8px]"
      >
        Rg
      </p>
      <p class="text-xxs leading-none">{regular}px</p>
    </div>
    <div class="flex items-center">
      <p
        style:border-color="var({ThemeVariablesKeys.fg})"
        class="mr-2 rounded border-0.5 p-1 text-xxxs font-medium leading-[8px]"
      >
        Bd
      </p>
      <p class="text-xxs leading-none">{bold}px</p>
    </div>
  </div>
{/if}
