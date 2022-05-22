<script context="module">// api
const CONTEXT_NAME = 'vertical-resize-container-context';
export function useVerticalResizeContext() {
    const resizableContext = getContext(CONTEXT_NAME);
    if (!resizableContext) {
        throw new Error('no context');
    }
    return resizableContext;
}
</script>

<script>import { getContext, onMount, setContext } from 'svelte';
import { writable } from 'svelte/store';
import { get, observeResize, resolveClasses } from './utils';
import VerticalResizeContainer from './VerticalResizeContainer.svelte';
import VerticalResizeSplitter from './VerticalResizeSplitter.svelte';
const DEFAULT_CLASS = resolveClasses('resize-containers-group vertical', [
    'h-full flex flex-col flex-nowrap', //
]);
let classes = DEFAULT_CLASS;
export { classes as class };
export let count = 1;
let containersGroupRef = null;
let groupHeight;
let itemHeights;
let itemHeightPercents;
$: console.log('itemHeights:', groupHeight, itemHeights);
$: groupHeight = containersGroupRef?.clientHeight;
// update group height on resize
onMount(() => {
    let observer;
    if (containersGroupRef) {
        observer = observeResize(containersGroupRef, (entry) => {
            groupHeight = entry.contentRect.height;
        });
    }
    return () => observer && observer.disconnect();
});
// update item heights on groupHeight change
$: itemHeights = (() => {
    if (groupHeight === undefined)
        return;
    const height = groupHeight;
    return [...new Array(count)].map(() => height / count);
})();
// recompute item height percents
$: itemHeightPercents = (() => {
    if (groupHeight === undefined)
        return;
    if (!Array.isArray(itemHeights))
        return;
    return itemHeights.map((height) => (height * 100) / groupHeight);
})();
function adjustItemHeight(itemIndex, height) {
    if (count === 1)
        return;
    if (!itemHeights)
        return;
    if (itemHeights[itemIndex] === undefined)
        return;
    const prevHeight = itemHeights[itemIndex];
    itemHeights[itemIndex] = height;
    //
    const nextItemHeight = itemHeights[itemIndex + 1];
    if (nextItemHeight !== undefined) {
        const diff = height - prevHeight;
        itemHeights[itemIndex + 1] = nextItemHeight - diff;
    }
}
// TODO: can we change this into not using HTMLElements directly?
let containerRefs = new Array(count);
function registerContainerRef(itemIndex, ref) {
    containerRefs[itemIndex] = ref;
    containerRefs = containerRefs; // trigger api update
}
// context api
let context = {
    containersGroupRef,
    groupHeight,
    count,
    itemHeights,
    itemHeightPercents,
    adjustItemHeight,
    containerRefs,
    registerContainerRef,
};
let api = writable(context);
setContext(CONTEXT_NAME, api);
// upnrdate api on change
$: api.update((obj) => {
    return {
        ...obj,
        containersGroupRef,
        count,
        groupHeight,
        itemHeights,
        itemHeightPercents,
        containerRefs,
    };
});
</script>

<div bind:this={containersGroupRef} class={get(classes, DEFAULT_CLASS)} {...$$restProps}>
  <slot
    Container={VerticalResizeContainer}
    Splitter={VerticalResizeSplitter}
    {count}
    {groupHeight}
    {itemHeights}
    {itemHeightPercents}
    {adjustItemHeight}
  />
</div>
