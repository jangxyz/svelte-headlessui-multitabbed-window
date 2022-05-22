<script context="module">const CONTEXT_NAME = 'multitabbed-window-draggable-context';
export function useDraggableContext() {
    let context = getContext(CONTEXT_NAME);
    if (context === undefined) {
        throw new Error('no context');
    }
    return context;
}
</script>

<script>import { getContext, setContext, tick } from 'svelte';
import { writable } from 'svelte/store';
let draggingTabClone = null;
let droppableRegion = null;
function setDroppableRegion(el) {
    droppableRegion = el;
}
// mouse state
let isTabMouseDown = false;
let isTabDraggingOnPanel = false;
let dragStartWindowId = null;
let dragStartTabIndex = null;
let droppingWindowId = null;
// droppable tab panel states
let isDroppableRegionLeft = false;
let isDroppableRegionRight = false;
let isDroppableRegionUp = false;
let isDroppableRegionDown = false;
$: isDroppableRegionFull = // none of above
    !isDroppableRegionLeft && !isDroppableRegionRight && !isDroppableRegionUp && !isDroppableRegionDown;
let dropPosition;
$: dropPosition = (() => {
    if (isDroppableRegionLeft)
        return 'left';
    if (isDroppableRegionRight)
        return 'right';
    if (isDroppableRegionUp)
        return 'top';
    if (isDroppableRegionDown)
        return 'bottom';
    return 'full';
})();
// set api to context
let api = writable({
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
function log(...args) {
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
function updateClonePosition({ 
//x, y, // clientX, clientY,
offsetX, offsetY, }) {
    const x = offsetX;
    const y = offsetY;
    if (draggingTabClone) {
        draggingTabClone.style.left = `${x}px`;
        draggingTabClone.style.top = `${y}px`;
    }
}
function computeDropRegionPosition({ offsetX, offsetY }) {
    if (droppableRegion) {
        const { clientWidth, clientHeight } = droppableRegion;
        isDroppableRegionLeft = offsetX < clientWidth / 4;
        isDroppableRegionRight = offsetX >= (clientWidth / 4) * 3;
        isDroppableRegionUp = offsetY < clientHeight / 4;
        isDroppableRegionDown = offsetY >= (clientHeight / 4) * 3;
        log({ isDroppableRegionLeft, isDroppableRegionRight, isDroppableRegionUp, isDroppableRegionDown }, { clientWidth, clientHeight });
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
function buildTabMousedownHandler({ tabIndex, windowId, onClickTab, delay, }) {
    return function onTabMousedown(ev) {
        setTimeout(() => {
            log('click tab', tabIndex);
            onClickTab(tabIndex, windowId);
        }, delay ?? 300);
        log('down:', ev.target, ev, { delay });
        isTabMouseDown = true;
        dragStartWindowId = windowId;
        dragStartTabIndex = tabIndex;
        // build clone of dragging tab
        draggingTabClone = ev.target.cloneNode(true);
        draggingTabClone.style.position = 'absolute';
        log('build draggingTabClone', draggingTabClone);
    };
}
function onTabPanelMouseenter(ev, { windowId }) {
    if (!isTabMouseDown)
        return;
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
function onTabPanelMouseleave(ev, { windowId }) {
    if (!isTabMouseDown)
        return;
    log('mouseleave:', ev.target);
    resetDraggingOnPanel();
}
function onTabPanelMousemove(ev, { windowId }) {
    if (!isTabMouseDown)
        return;
    if (ev.target === draggingTabClone) {
        return;
    }
    const mouseevent = ev;
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
