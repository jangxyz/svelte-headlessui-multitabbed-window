<script context="module">// api
const CONTEXT_NAME = 'horizontal-resize-container-context';
export function useHorizontalResizeContext() {
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
import HorizontalResizeContainer from './HorizontalResizeContainer.svelte';
import HorizontalResizeSplitter from './HorizontalResizeSplitter.svelte';
const DEFAULT_CLASS = resolveClasses('resize-containers-group horizontal', [
    'w-full h-full flex flex-row flex-nowrap', //
]);
let classes = DEFAULT_CLASS;
export { classes as class };
export let count = 1;
let containersGroupRef = null;
let groupWidth;
let itemWidths;
let itemWidthPercents;
$: console.log('itemWidths:', itemWidths);
$: groupWidth = containersGroupRef?.clientWidth;
// update group width on resize
onMount(() => {
    let observer;
    if (containersGroupRef) {
        observer = observeResize(containersGroupRef, (entry) => {
            groupWidth = entry.contentRect.width;
        });
    }
    return () => observer && observer.disconnect();
});
// update item weidth on groupWidth change
$: itemWidths = (() => {
    if (groupWidth === undefined)
        return;
    const width = groupWidth;
    return [...new Array(count)].map(() => width / count);
})();
// recompute item width percents
$: itemWidthPercents = (() => {
    if (groupWidth === undefined)
        return;
    if (!Array.isArray(itemWidths))
        return;
    return itemWidths.map((width) => (width * 100) / groupWidth);
})();
function adjustItemWidth(itemIndex, width) {
    if (count === 1)
        return;
    if (!itemWidths)
        return;
    if (itemWidths[itemIndex] === undefined)
        return;
    const prevWidth = itemWidths[itemIndex];
    itemWidths[itemIndex] = width;
    //
    const nextItemWidth = itemWidths[itemIndex + 1];
    if (nextItemWidth !== undefined) {
        const diff = width - prevWidth;
        itemWidths[itemIndex + 1] = nextItemWidth - diff;
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
    groupWidth,
    count,
    itemWidths,
    itemWidthPercents,
    adjustItemWidth,
    containerRefs,
    registerContainerRef,
};
let api = writable(context);
setContext(CONTEXT_NAME, api);
// update api on change
$: api.update((obj) => {
    return {
        ...obj,
        containersGroupRef,
        count,
        groupWidth,
        itemWidths,
        itemWidthPercents,
        containerRefs,
    };
});
</script>

<div bind:this={containersGroupRef} class={get(classes, DEFAULT_CLASS)} {...$$restProps}>
  <slot
    Container={HorizontalResizeContainer}
    Splitter={HorizontalResizeSplitter}
    {count}
    {groupWidth}
    {itemWidths}
    {itemWidthPercents}
    {adjustItemWidth}
  />
</div>
