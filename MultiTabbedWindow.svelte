<script>import MultiTabbedWindowInner from './MultiTabbedWindowInner.svelte';
import { DraggableTabContainer } from './draggableTabs';
import { findWindow } from './utils';
export let tabs;
function addNewTab(tabs, newTabState) {
    tabs.splice(tabs.length - 1, 0, newTabState); // add new prev of last, keeping "+" button
    return tabs;
}
function removeTab(tabs, index) {
    tabs.splice(index, 1);
    return tabs;
}
function moveWindowTab(sourceWindowId, sourceTabIndex, targetWindowId, position) {
    //
    // find source window
    const sourceWindow = findWindow(tabs, sourceWindowId);
    const sourceTab = sourceWindow[sourceTabIndex];
    const targetWindow = findWindow(tabs, targetWindowId);
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
