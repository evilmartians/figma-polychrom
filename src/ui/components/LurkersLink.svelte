<script lang="ts">
  import LurkersIcon from '~ui/components/LurkersIcon.svelte';
  import Tooltip from '~ui/components/Tooltip.svelte';

  import { evilMartiansSiteURL } from '../../constants.ts';
</script>

<Tooltip>
  {#snippet trigger()}
    <a
      class="interactive"
      href={evilMartiansSiteURL}
      rel="noreferrer"
      target="_blank"
    >
      <LurkersIcon />
    </a>
  {/snippet}
  <span class="whitespace-nowrap">Evil Martians</span>
</Tooltip>
