<script>import { createEventDispatcher } from 'svelte';
import { useDraggableContext } from './DraggableTabContainer.svelte';
const dispatchEvent = createEventDispatcher();
const draggableApi = useDraggableContext();
$: isTabDraggingOnPanel = $draggableApi.isTabDraggingOnPanel;
$: dropPosition = $draggableApi.dropPosition;
let el = null;
$: if (el) {
    $draggableApi.setDroppableRegion(el);
}
</script>

{#if isTabDraggingOnPanel}
  <div
    bind:this={el}
    class={['droppable-region-container absolute w-full h-full top-0 left-0'].join(' ')}
    on:mouseup={() => {
      if (!isTabDraggingOnPanel) return;
      const { dragStartWindowId, dragStartTabIndex, dropPosition, droppingWindowId: dropWindowId } = $draggableApi;
      dispatchEvent('drop', {
        dragStartWindowId,
        dragStartTabIndex,
        dropPosition,
        dropWindowId,
      });
    }}
  >
    <div
      class={[
        'drop-region',
        dropPosition,
        isTabDraggingOnPanel ? 'tab-dragging absolute border-white bg-white bg-opacity-50 pointer-events-none' : '',
        {
          full: 'left-0 top-0 w-full h-full',
          left: 'left-0 top-0 w-1/2 h-full',
          right: 'left-1/2 top-0 w-1/2 h-full',
          top: 'left-0 top-0 w-full h-1/2',
          bottom: 'left-0 top-1/2 w-full h-1/2',
        }[dropPosition],
      ].join(' ')}
    />
  </div>
{/if}
