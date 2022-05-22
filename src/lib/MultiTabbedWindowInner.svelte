<script lang="ts">
  import { uniqueId } from 'lodash-es';

  import { isColumnWindow, isRowWindow, type TabState, type WindowsState } from './types';
  import TabbedWindow from './TabbedWindow.svelte';
  import HorizontalResizeGroup from './resizable/HorizontalResizeContainersGroup.svelte';
  import VerticalResizeGroup from './resizable/VerticalResizeContainersGroup.svelte';

  export let tabs: WindowsState = [];
  //$: console.log('🚀 ~ file: MultiTabbedWindow.svelte ~ line 6 ~ tabs', tabs);
  export let windowIndex: number = 0;
  export let parentWindowId: null | string = null;
  $: fullWindowId = parentWindowId !== null ? `${parentWindowId}.${windowIndex}` : String(windowIndex);

  // assign key to tab states
  $: {
    assignTabKeys(tabs);
  }

  function assignTabKeys(windows: WindowsState): WindowsState {
    //console.log('assignTabKeys ~ windows', windows);
    //console.log('assignTabKeys ~ windows', JSON.stringify(windows), { isRowWindow: isRowWindow(windows), isColumnWindow: isColumnWindow(windows), isTabsWindow: isTabsWindow(windows), });

    // recursive call: ["row", subwindows]
    if (isRowWindow(windows)) {
      return ['row', windows[1].map((subwindows) => assignTabKeys(subwindows))];
    }

    // recursive call: ["col", subwindows]
    else if (isColumnWindow(windows)) {
      return ['column', windows[1].map((subwindows) => assignTabKeys(subwindows))];
    }

    // tab[]
    windows.forEach((tabState: TabState, index: number, entire) => {
      if (!tabState.key) {
        tabState.key = buildTabKey(tabState);
      }
    });
    return windows;
  }

  function buildTabKey(tabState: TabState): string {
    return `${uniqueId()}-${tabState.title}-${Date.now()}`;
  }
</script>

{#if tabs[0] === 'row'}
  <HorizontalResizeGroup
    class={(_classes) => `window ${_classes}`}
    data-window-id={fullWindowId}
    count={tabs[1].length}
    let:Container
  >
    {#each tabs[1] as windowTabs, windowIndex}
      <Container index={windowIndex}>
        <svelte:self
          bind:tabs={windowTabs}
          {windowIndex}
          parentWindowId={fullWindowId}
          {...$$restProps}
          on:drop
          let:index
          let:tabState
          let:changeTabTitle
        >
          <slot key={tabState.key} {index} title={tabState.title} {tabState} {changeTabTitle} />
        </svelte:self>
      </Container>
    {/each}
  </HorizontalResizeGroup>
{:else if tabs[0] === 'column'}
  <VerticalResizeGroup
    class={(_classes) => `window ${_classes}`}
    data-window-id={fullWindowId}
    count={tabs[1].length}
    let:Container
  >
    {#each tabs[1] as windowTabs, windowIndex}
      <Container index={windowIndex}>
        <svelte:self
          bind:tabs={windowTabs}
          {windowIndex}
          parentWindowId={fullWindowId}
          {...$$restProps}
          on:drop
          let:index
          let:tabState
          let:changeTabTitle
        >
          <slot key={tabState.key} {index} title={tabState.title} {tabState} {changeTabTitle} />
        </svelte:self>
      </Container>
    {/each}
  </VerticalResizeGroup>
{:else}
  <TabbedWindow
    bind:tabs
    windowIndex={0}
    parentWindowId={fullWindowId}
    on:drop
    {...$$restProps}
    let:index
    let:tabState
    let:changeTabTitle
  >
    <slot key={tabState.key} {index} title={tabState.title} {tabState} {changeTabTitle} />
  </TabbedWindow>
{/if}
