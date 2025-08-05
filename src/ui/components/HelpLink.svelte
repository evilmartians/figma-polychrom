<script lang="ts">
  import HelpIcon from '~ui/components/HelpIcon.svelte';
  import Tooltip from '~ui/components/Tooltip.svelte';

  import { APCADocumentationURL } from '../../constants.ts';
</script>

<Tooltip placement="top-end">
  {#snippet trigger()}
    <a
      class="interactive flex size-6 items-center justify-center rounded-full border-0.5 border-secondary-35 text-secondary-75 hover:border-transparent hover:bg-elevation-1 active:border-transparent active:bg-universal-25"
      href={APCADocumentationURL}
      rel="noreferrer"
      target="_blank"
    >
      <HelpIcon />
    </a>
  {/snippet}
  <span class="whitespace-nowrap">APCA in a Nutshell</span>
</Tooltip>
