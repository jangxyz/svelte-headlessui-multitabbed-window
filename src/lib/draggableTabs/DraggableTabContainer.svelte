<script context="module" lang="ts">
  import type { Writable, Readable } from 'svelte/store';

  export type DropPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';
  export type WindowIndex = number | null;

  type DraggablePanelState = {
    windowId: string;
    //windowIndex: WindowIndex;
  };
  type DraggableTabState = DraggablePanelState & { tabIndex: number };

  export type ContextState = {
    // elements
    droppableRegion: HTMLElement | null;
    setDroppableRegion: (el: HTMLElement | null) => void;
    // states
    isTabMouseDown: boolean;
    isTabDraggingOnPanel: boolean;
    dragStartWindowId: string | null;
    dragStartTabIndex: number | null;
    droppingWindowId: string | null;
    // drop position
    isDroppableRegionLeft: boolean;
    isDroppableRegionRight: boolean;
    isDroppableRegionUp: boolean;
    isDroppableRegionDown: boolean;
    isDroppableRegionFull: boolean;
    dropPosition: DropPosition;
    // callbacks
    //onTabPanelMousedown: (ev: CustomEvent, windowIndex: WindowIndex, windowId: string) => void;
    onTabPanelMouseenter: (ev: CustomEvent, panel: DraggablePanelState) => void;
    onTabPanelMouseleave: (ev: CustomEvent, panel: DraggablePanelState) => void;
    onTabPanelMousemove: (ev: CustomEvent, panel: DraggablePanelState) => void;
    buildTabMousedownHandler: ({
      onClickTab,
      windowId,
      tabIndex,
      //windowIndex,
      delay,
    }: {
      onClickTab: (index: number) => void;
      delay?: number;
    } & DraggableTabState) => (ev: MouseEvent) => void;
    //buildTabMouseenterHandler: ({ windowId, tabIndex, windowIndex }: DraggableTabState) => (ev: CustomEvent) => void;
  };

  const CONTEXT_NAME = 'multitabbed-window-draggable-context';

  export function useDraggableContext(): Readable<ContextState> {
    let context: Writable<ContextState> | undefined = getContext(CONTEXT_NAME);
    if (context === undefined) {
      throw new Error('no context');
    }
    return context;
  }
</script>

<script lang="ts">
  import { getContext, setContext, tick } from 'svelte';
  import { writable } from 'svelte/store';

  let draggingTabClone: HTMLElement | null = null;
  let droppableRegion: HTMLElement | null = null;
  function setDroppableRegion(el: HTMLElement | null) {
    droppableRegion = el;
  }

  // mouse state
  let isTabMouseDown = false;
  let isTabDraggingOnPanel = false;
  let dragStartWindowId: string | null = null;
  let dragStartTabIndex: number | null = null;
  let droppingWindowId: string | null = null;

  // droppable tab panel states
  let isDroppableRegionLeft = false;
  let isDroppableRegionRight = false;
  let isDroppableRegionUp = false;
  let isDroppableRegionDown = false;
  $: isDroppableRegionFull = // none of above
    !isDroppableRegionLeft && !isDroppableRegionRight && !isDroppableRegionUp && !isDroppableRegionDown;

  let dropPosition: DropPosition;
  $: dropPosition = (() => {
    if (isDroppableRegionLeft) return 'left';
    if (isDroppableRegionRight) return 'right';
    if (isDroppableRegionUp) return 'top';
    if (isDroppableRegionDown) return 'bottom';
    return 'full';
  })();

  // set api to context
  let api = writable<ContextState>({
    droppableRegion,
    setDroppableRegion,
    // states
    isTabMouseDown,
    isTabDraggingOnPanel,
    dragStartWindowId,
    dragStartTabIndex,
    droppingWindowId,
    isDroppableRegionLeft,
    isDroppableRegionRight,
    isDroppableRegionUp,
    isDroppableRegionDown,
    isDroppableRegionFull,
    dropPosition,
    // functions
    buildTabMousedownHandler,
    onTabPanelMouseenter,
    onTabPanelMouseleave,
    onTabPanelMousemove,
  });
  setContext(CONTEXT_NAME, api);
  // update api on change
  $: api.update((obj) => {
    return {
      ...obj,
      isTabMouseDown,
      isTabDraggingOnPanel,
      dragStartWindowId,
      dragStartTabIndex,
      droppingWindowId,
      isDroppableRegionLeft,
      isDroppableRegionRight,
      isDroppableRegionUp,
      isDroppableRegionDown,
      isDroppableRegionFull,
      dropPosition,
    };
  });

  //

  function log(...args: unknown[]) {
    //console.log('DraggableTabContainer', ...args);
  }

  function reset() {
    isTabMouseDown = false;
    dragStartWindowId = null;
    dragStartTabIndex = null;
    if (draggingTabClone) {
      draggingTabClone.parentNode?.removeChild(draggingTabClone);
      draggingTabClone = null;
    }
    resetDraggingOnPanel();
  }

  function resetDraggingOnPanel() {
    isTabDraggingOnPanel = false;
    droppingWindowId = null;
  }

  type PositionedTarget = {
    x: number;
    y: number;
    clientX: number;
    clientY: number;
    offsetX: number;
    offsetY: number;
  };

  function updateClonePosition({
    //x, y, // clientX, clientY,
    offsetX,
    offsetY,
  }: PositionedTarget) {
    const x = offsetX;
    const y = offsetY;
    if (draggingTabClone) {
      draggingTabClone.style.left = `${x}px`;
      draggingTabClone.style.top = `${y}px`;
    }
  }
  function computeDropRegionPosition({ offsetX, offsetY }: PositionedTarget) {
    if (droppableRegion) {
      const { clientWidth, clientHeight } = droppableRegion;
      isDroppableRegionLeft = offsetX < clientWidth / 4;
      isDroppableRegionRight = offsetX >= (clientWidth / 4) * 3;
      isDroppableRegionUp = offsetY < clientHeight / 4;
      isDroppableRegionDown = offsetY >= (clientHeight / 4) * 3;
      log(
        { isDroppableRegionLeft, isDroppableRegionRight, isDroppableRegionUp, isDroppableRegionDown },
        { clientWidth, clientHeight }
      );
    }
  }

  function restrictDroppableRegionHeightToScreen() {
    if (droppableRegion) {
      const { height: documentHeight } = document.documentElement.getBoundingClientRect();
      const { top, height } = droppableRegion.getBoundingClientRect();
      if (top + height > documentHeight) {
        droppableRegion.style.height = `${documentHeight - top}px`;
        log('restrict droppable regions height to:', documentHeight - top);
      }
    }
  }

  //
  // event handlers (or builders)

  function buildTabMousedownHandler({
    tabIndex,
    windowId,
    onClickTab,
    delay,
  }: {
    onClickTab: (tabIndex: number, windowId: string) => void;
    delay?: number;
  } & DraggableTabState) {
    return function onTabMousedown(ev: MouseEvent) {
      setTimeout(() => {
        log('click tab', tabIndex);
        onClickTab(tabIndex, windowId);
      }, delay ?? 300);
      log('down:', ev.target, ev, { delay });

      isTabMouseDown = true;
      dragStartWindowId = windowId;
      dragStartTabIndex = tabIndex;
      // build clone of dragging tab
      draggingTabClone = (ev.target as HTMLElement).cloneNode(true) as HTMLElement;
      draggingTabClone.style.position = 'absolute';
      log('build draggingTabClone', draggingTabClone);
    };
  }

  function onTabPanelMouseenter(ev: CustomEvent, { windowId }: DraggablePanelState) {
    if (!isTabMouseDown) return;
    log('mouseenter:', ev.target, windowId);

    // NOTE this must be BEFORE the following tick clause, since it
    // renders the droppable region on next tick.
    isTabDraggingOnPanel = true;
    droppingWindowId = windowId;

    tick().then(() => {
      restrictDroppableRegionHeightToScreen();
      // attach dragging tab clone
      if (droppableRegion && draggingTabClone && !draggingTabClone.parentNode) {
        droppableRegion.appendChild(draggingTabClone);
        log('attach draggingTabClone to:', draggingTabClone.parentElement, draggingTabClone);
      }
    });
  }

  function onTabPanelMouseleave(ev: CustomEvent, { windowId }: DraggablePanelState) {
    if (!isTabMouseDown) return;
    log('mouseleave:', ev.target);
    resetDraggingOnPanel();
  }

  function onTabPanelMousemove(ev: CustomEvent, { windowId }: DraggablePanelState) {
    if (!isTabMouseDown) return;
    if (ev.target === draggingTabClone) {
      return;
    }

    const mouseevent = ev as unknown as MouseEvent;
    //log('move:', ev.target, { x, y }, { clientX, clientY, offsetX, offsetY }, draggingTabClone, { ev });

    updateClonePosition(mouseevent);
    computeDropRegionPosition(mouseevent);
  }
</script>

<svelte:body
  on:mouseup={(ev) => {
    if (!isTabMouseDown) return;
    log('mouseup:', ev);
    reset();
  }} />

<slot
  {isTabMouseDown}
  {isTabDraggingOnPanel}
  {draggingTabClone}
  droppableRegion={setDroppableRegion}
  {dropPosition}
  {isDroppableRegionLeft}
  {isDroppableRegionRight}
  {isDroppableRegionUp}
  {isDroppableRegionDown}
  {isDroppableRegionFull}
  {buildTabMousedownHandler}
  {onTabPanelMouseenter}
  {onTabPanelMouseleave}
  {onTabPanelMousemove}
/>
