<script lang="ts">
  import type { WindowsState, TabState } from './types';
  import type { DropPosition } from './draggableTabs/DraggableTabContainer.svelte';
  import MultiTabbedWindowInner from './MultiTabbedWindowInner.svelte';
  import { DraggableTabContainer } from './draggableTabs';
  import { findWindow } from './utils';

  export let tabs: WindowsState;

  function addNewTab(tabs: TabState[], newTabState: TabState) {
    tabs.splice(tabs.length - 1, 0, newTabState); // add new prev of last, keeping "+" button
    return tabs;
  }

  function removeTab(tabs: TabState[], index: number) {
    tabs.splice(index, 1);
    return tabs;
  }

  function moveWindowTab(
    sourceWindowId: string,
    sourceTabIndex: number,
    targetWindowId: string,
    position: DropPosition
  ) {
    //
    // find source window
    const sourceWindow = findWindow(tabs, sourceWindowId) as TabState[];
    const sourceTab = sourceWindow[sourceTabIndex];
    const targetWindow = findWindow(tabs, targetWindowId) as TabState[];

    //
    removeTab(sourceWindow, sourceTabIndex);
    addNewTab(targetWindow, sourceTab);
  }
</script>

<DraggableTabContainer>
  <MultiTabbedWindowInner
    {tabs}
    {addNewTab}
    {removeTab}
    {...$$restProps}
    on:drop={({ detail }) => {
      const { dragStartWindowId, dragStartTabIndex, dropPosition, dropWindowId } = detail;
      console.log('drop', { dragStartWindowId, dragStartTabIndex, dropPosition, dropWindowId }, { tabs });
      moveWindowTab(dragStartWindowId, dragStartTabIndex, dropWindowId, dropPosition);
      tabs = tabs;
    }}
    let:index
    let:tabState
    let:changeTabTitle
  >
    <slot key={tabState.key} {index} title={tabState.title} {tabState} {changeTabTitle} />
  </MultiTabbedWindowInner>
</DraggableTabContainer>
