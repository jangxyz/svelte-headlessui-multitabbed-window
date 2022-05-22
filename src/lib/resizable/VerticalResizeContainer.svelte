<script lang="ts">
  import { onMount } from 'svelte';

  import { get, resolveStyles } from './utils';
  import { useVerticalResizeContext } from './VerticalResizeContainersGroup.svelte';
  import VerticalResizeSplitter from './VerticalResizeSplitter.svelte';

  export let index = -1;
  let ref: HTMLElement | null = null;
  const api = useVerticalResizeContext();

  // class=
  const DEFAULT_CLASS = 'resize-container relative flex flex-col overflow-hidden';
  let classes: string | ((classes: string) => string) = DEFAULT_CLASS;
  export { classes as class };
  // splitterClass=
  const DEFAULT_SPLITTER_CLASS = (classes: string) => `${classes} w-full`;
  export let splitterClass: string | ((defaultValue: string) => string) = DEFAULT_SPLITTER_CLASS;
  // style=
  export let style: string | ((height: number | 'auto', index: number, heights: number[]) => string) = (size) =>
    resolveStyles({ height: typeof size === 'number' ? `${size}%` : size });
  let heightPercent: number | 'auto' = 'auto';
  $: heightPercent = $api.itemHeightPercents?.[index] ?? 'auto';

  $: domain = $api.containersGroupRef;

  onMount(() => {
    if (ref) {
      $api.registerContainerRef(index, ref);
    }
  });

  let afterMount = false;
  onMount(() => {
    afterMount = true;
  });

  function adjustItemHeight({ startPos, endPos }: { startPos: DOMRectReadOnly; endPos: DOMRectReadOnly }) {
    const diff = { x: endPos.x - startPos.x, y: endPos.y - startPos.y };
    if ($api.itemHeights !== undefined) {
      const itemHeight = $api.itemHeights[index];
      //console.log('VerticalResizeContainer.svelte ~ on:dragend ~ diff', itemHeight + diff.y, { diff, itemHeight, index, itemHeights: $api.itemHeights, });
      $api.adjustItemHeight(index, itemHeight + diff.y);
    }
  }

  $: nextContainerRef = $api.containerRefs[index + 1];
  let containerRect: DOMRect | undefined = undefined;
  let nextContainerRect: DOMRect | undefined = undefined;
  //$: console.log('🚀 ~ file: VerticalResizeContainer.svelte ~ line 55 ~ containerRect', index, containerRect, ref);
  //$: console.log( '🚀 ~ file: VerticalResizeContainer.svelte ~ line 63 ~ nextContainerRect', index, nextContainerRect, nextContainerRef);

  function yAllowedRange(clientY: number): boolean {
    let isBelowPrevContainer = true;
    if (containerRect) {
      isBelowPrevContainer = clientY >= containerRect.top;
    }
    //
    let isAboveNextContainer = true;
    if (nextContainerRef) {
      nextContainerRect = nextContainerRef.getBoundingClientRect();
      isAboveNextContainer = clientY < nextContainerRect.bottom;
    }
    return isBelowPrevContainer && isAboveNextContainer;
  }

  function onDragStart(ev: CustomEvent) {
    containerRect = ref?.getBoundingClientRect();
    nextContainerRef = $api.containerRefs[index + 1];
    nextContainerRect = nextContainerRef?.getBoundingClientRect();
    //console.log('dragstart', ev);
  }
  function onDragEnd(ev: CustomEvent) {
    adjustItemHeight(ev.detail);
    //console.log('dragend', ev);
  }
</script>

<div
  bind:this={ref}
  class={get(classes, DEFAULT_CLASS)}
  style={get(style, heightPercent, index, $api.itemHeightPercents ?? [])}
>
  <div class="container-content flex flex-auto">
    <slot Spiltter={VerticalResizeSplitter} />
  </div>
</div>

<slot name="splitter">
  {#if index !== $api.count - 1}
    {#if domain || afterMount}
      <VerticalResizeSplitter
        class={splitterClass}
        {domain}
        on:dragstart={onDragStart}
        on:dragend={onDragEnd}
        limitY={(ev) => !yAllowedRange(ev.clientY)}
      />
    {/if}
  {/if}
</slot>
