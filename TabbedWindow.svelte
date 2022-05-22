<script>import { TabGroup, TabPanel, TabPanels } from '@rgossiaux/svelte-headlessui';
import ConfirmDialog from './ConfirmDialog.svelte';
import { useDraggableContext, DropRegion } from './draggableTabs';
import Tab from './Tab.svelte';
import TabList from './TabList.svelte';
export let windowIndex = null;
export let parentWindowId = null;
$: windowId = parentWindowId ? parentWindowId : String(windowIndex);
export let tabs = [];
//$: console.log('🚀 ~ file: TabbedWindow.svelte ~ line 14 ~ tabs', tabs, { windowId });
export let activeIndex = 0;
export let onNewTab = (tab) => tab;
export let addNewTab;
export let removeTab;
// add new tab button
$: {
    if (tabs.length > 0 && tabs.at(-1)?.title !== '+') {
        tabs.push(onNewTab({ title: '+' }));
    }
}
let tabRemovalIndex = null;
// draggables
let draggable = useDraggableContext();
//
function _addNewTab(title) {
    addNewTab(tabs, onNewTab({ title: title ?? '' }));
}
function _removeTab(index) {
    tabs = removeTab(tabs, index);
}
function changeTabTitle(index, newTitle) {
    tabs[index].title = newTitle;
}
function onClickTab(index) {
    // last tab
    if (index === tabs.length - 1) {
        _addNewTab();
    }
    activeIndex = index;
}
</script>

<TabGroup
	class="window tab-window-container flex flex-col"
	data-window-id={windowId}
	data-parent-window-id={parentWindowId}
>
	<TabList on:click:new-tab={() => _addNewTab()}>
		{#each tabs as { key }, tabIndex (key)}
			{@const active = tabIndex === activeIndex}
			<Tab
				selected={active}
				removeButton={tabIndex !== tabs.length - 1}
				on:mousedown={$draggable.buildTabMousedownHandler({
					onClickTab,
					tabIndex,
					windowId,
					delay: 300
				})}
				on:click:remove={() => (tabRemovalIndex = tabIndex)}
			>
				{tabs[tabIndex].title}
			</Tab>
		{/each}
	</TabList>

	<TabPanels
		class="tab-panels relative h-full w-full"
		on:mouseenter={(ev) => $draggable.onTabPanelMouseenter(ev, { windowId })}
		on:mouseleave={(ev) => $draggable.onTabPanelMouseleave(ev, { windowId })}
		on:mousemove={(ev) => $draggable.onTabPanelMousemove(ev, { windowId })}
	>
		<div
			class="h-full w-full p-2 text-black border-top"
			style="background-color: var(--mtw-tabpanel-background-color, #000);"
		>
			{#each tabs as tabState, index (tabState.key)}
				<TabPanel class="h-full w-full">
					<slot key={tabState.key} {index} title={tabState.title} {tabState} {changeTabTitle} />
				</TabPanel>
			{/each}
		</div>

		{#if $draggable.isTabDraggingOnPanel && $draggable.droppingWindowId === windowId}
			<DropRegion on:drop />
		{/if}
	</TabPanels>
</TabGroup>

<ConfirmDialog
	title="Close tab"
	description=""
	open={tabRemovalIndex !== null}
	on:close={() => (tabRemovalIndex = null)}
	onConfirm={() => typeof tabRemovalIndex === 'number' && _removeTab(tabRemovalIndex)}
>
	<p class="mt-2 text-sm text-gray-500">Close Tab "{tabs[tabRemovalIndex ?? 0].title}"?</p>
</ConfirmDialog>

<style>
	.tab-window-container :global(.tablist) {
		background-color: #1e1e1e;
	}</style>
