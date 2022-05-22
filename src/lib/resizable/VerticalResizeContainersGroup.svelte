<script context="module" lang="ts">
  import type { Readable } from 'svelte/store';

  // api
  const CONTEXT_NAME = 'vertical-resize-container-context';
  type Context = {
    containersGroupRef: HTMLElement | null;
    groupHeight: number | undefined;
    count: number;
    itemHeights: number[] | undefined;
    itemHeightPercents: number[] | undefined;
    adjustItemHeight: (itemIndex: number, height: number) => void;
    containerRefs: HTMLElement[];
    registerContainerRef: (itemIndex: number, ref: HTMLElement) => void;
  };

  export function useVerticalResizeContext() {
    const resizableContext = getContext<Readable<Context>>(CONTEXT_NAME);
    if (!resizableContext) {
      throw new Error('no context');
    }
    return resizableContext;
  }
</script>

<script lang="ts">
  import { getContext, onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import { get, observeResize, resolveClasses } from './utils';
  import VerticalResizeContainer from './VerticalResizeContainer.svelte';
  import VerticalResizeSplitter from './VerticalResizeSplitter.svelte';

  const DEFAULT_CLASS = resolveClasses('resize-containers-group vertical', [
    'h-full flex flex-col flex-nowrap', //
  ]);
  let classes: string | ((classes: string) => string) = DEFAULT_CLASS;
  export { classes as class };

  export let count = 1;

  let containersGroupRef: HTMLDivElement | null = null;
  let groupHeight: number | undefined;
  let itemHeights: number[] | undefined;
  let itemHeightPercents: number[] | undefined;
  $: console.log('itemHeights:', groupHeight, itemHeights);

  $: groupHeight = containersGroupRef?.clientHeight;
  // update group height on resize
  onMount(() => {
    let observer: ResizeObserver | undefined;
    if (containersGroupRef) {
      observer = observeResize(containersGroupRef, (entry) => {
        groupHeight = entry.contentRect.height;
      });
    }

    return () => observer && observer.disconnect();
  });

  // update item heights on groupHeight change
  $: itemHeights = (() => {
    if (groupHeight === undefined) return;
    const height = groupHeight;
    return [...new Array(count)].map(() => height / count);
  })();
  // recompute item height percents
  $: itemHeightPercents = (() => {
    if (groupHeight === undefined) return;
    if (!Array.isArray(itemHeights)) return;
    return itemHeights.map((height) => (height * 100) / (groupHeight as number));
  })();

  function adjustItemHeight(itemIndex: number, height: number) {
    if (count === 1) return;
    if (!itemHeights) return;
    if (itemHeights[itemIndex] === undefined) return;

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
  let containerRefs: HTMLElement[] = new Array(count);
  function registerContainerRef(itemIndex: number, ref: HTMLElement) {
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
  let api = writable<Context>(context);
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
