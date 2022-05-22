<script lang="ts">
  import { onMount } from 'svelte';

  import { get, resolveStyles } from './utils';
  import { useHorizontalResizeContext } from './HorizontalResizeContainersGroup.svelte';
  import HorizontalResizeSplitter from './HorizontalResizeSplitter.svelte';

  export let index = -1;
  let ref: HTMLElement | null = null;
  const api = useHorizontalResizeContext();

  // class=
  const DEFAULT_CLASS = 'resize-container relative flex flex-row';
  let classes: string | ((classes: string) => string) = DEFAULT_CLASS;
  export { classes as class };
  // splitterClass=
  const DEFAULT_SPLITTER_CLASS = (classes: string) => `${classes}`;
  export let splitterClass: string | ((defaultValue: string) => string) = DEFAULT_SPLITTER_CLASS;
  // style=
  export let style: string | ((width: number | 'auto', index: number, widths: number[]) => string) = (size) =>
    resolveStyles({ width: typeof size === 'number' ? `${size}%` : size });
  let widthPercent: number | 'auto' = 'auto';
  $: widthPercent = $api.itemWidthPercents?.[index] ?? 'auto';

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

  function adjustItemWidth({ startPos, endPos }: { startPos: DOMRectReadOnly; endPos: DOMRectReadOnly }) {
    const diff = { x: endPos.x - startPos.x, y: endPos.y - startPos.y };
    if ($api.itemWidths !== undefined) {
      const itemWidth = $api.itemWidths[index];
      //console.log('HorizontalResizeContainer.svelte ~ on:dragend ~ diff', diff);
      $api.adjustItemWidth(index, itemWidth + diff.x);
    }
  }

  $: nextContainerRef = $api.containerRefs[index + 1];
  let containerRect: DOMRect | undefined = undefined;
  let nextContainerRect: DOMRect | undefined = undefined;

  function xAllowedRange(clientX: number): boolean {
    let isBehindPrevContainer = true;
    if (containerRect) {
      isBehindPrevContainer = clientX >= containerRect.top;
    }
    //
    let isAheadNextContainer = true;
    if (nextContainerRef) {
      nextContainerRect = nextContainerRef.getBoundingClientRect();
      isAheadNextContainer = clientX < nextContainerRect.bottom;
    }
    return isBehindPrevContainer && isAheadNextContainer;
  }

  function onDragStart(ev: CustomEvent) {
    containerRect = ref?.getBoundingClientRect();
    nextContainerRef = $api.containerRefs[index + 1];
    nextContainerRect = nextContainerRef?.getBoundingClientRect();
    //console.log('dragstart', ev);
  }
  function onDragEnd(ev: CustomEvent) {
    adjustItemWidth(ev.detail);
  }
</script>

<div class={get(classes, DEFAULT_CLASS)} style={get(style, widthPercent, index, $api.itemWidthPercents ?? [])}>
  <div class="container-content flex flex-auto">
    <slot Spiltter={HorizontalResizeSplitter} />
  </div>
</div>

<slot name="splitter">
  {#if index !== $api.count - 1}
    {#if domain || afterMount}
      <HorizontalResizeSplitter
        class={splitterClass}
        {domain}
        on:dragstart={onDragStart}
        on:dragend={onDragEnd}
        limitX={(ev) => !xAllowedRange(ev.clientX)}
      />
    {/if}
  {/if}
</slot>
