<script lang="ts">
  import { MessageTypes } from '~types/messages';
  import { onMount } from 'svelte';

  import { isP3 } from '../stores/selected-nodes';
  import AppContent from './AppContent.svelte';
  import HelpLink from './HelpLink.svelte';
  import LurkersLink from './LurkersLink.svelte';
  import SettingsButton from './SettingsButton.svelte';
  import Tooltip from './Tooltip.svelte';

  onMount(() => {
    parent.postMessage(
      {
        pluginMessage: {
          type: MessageTypes.UiReady,
        },
      },
      '*'
    );
  });
</script>

<div
  class="relative flex min-h-full w-full select-none flex-col items-center p-1 pb-0 font-martianMono"
>
  <AppContent />

  <div class="mb-2 mt-auto flex w-full items-end px-1">
    <HelpLink />

    <div class="ml-auto flex items-center">
      {#if $isP3}
        <Tooltip>
          {#snippet trigger()}
            <div style:mix-blend-mode="difference" class="flex items-center">
              <p
                class="mr-3 rounded border-0.5 border-secondary-75 p-1 text-xxxs font-medium leading-[8px] text-secondary-75"
              >
                P3
              </p>
            </div>
          {/snippet}
          File color profile
        </Tooltip>
      {/if}

      <SettingsButton />
    </div>
  </div>

  <div class="absolute bottom-0 left-1/2 -translate-x-1/2">
    <LurkersLink />
  </div>
</div>
