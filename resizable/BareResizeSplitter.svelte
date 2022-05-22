<script>import { createEventDispatcher } from 'svelte';
import draggingGhost from './draggingGhostAction';
import hoverOn from './hoverOnAction';
import { get, resolveClasses, resolveStyles } from './utils';
const dispatchEvent = createEventDispatcher();
export let direction = 'horizontal';
export let absolute = false;
export let domain = undefined;
export let limitY = undefined;
export let limitX = undefined;
const DEFAULT_GET_CLASS = () => resolveClasses(['splitter', direction], [absolute ? 'absolute' : 'relative'], [
    'bg-[color:var(--mtw-splitter-background-color)]',
    //'hover:bg-[color:var(--mtw-splitter-background-color-hover)]'
], [
//'opacity-50',
//'hover:opacity-100'
]);
let classes = DEFAULT_GET_CLASS;
export { classes as class };
const DEFAULT_CENTERLINE_CLASS = 'center-line relative';
export let centerLineClass = DEFAULT_CENTERLINE_CLASS;
//
// drag
let isMouseDown = false;
let startPos = null;
function onMousedown(ev) {
    isMouseDown = true;
    const { x, y, clientX, clientY, offsetX, offsetY } = ev;
    //startPos = (ev.currentTarget as HTMLElement).getBoundingClientRect().toJSON();
    startPos = { x, y };
    //console.log('onMousedown ~ startPos', startPos, { x, y, clientX, clientY, offsetX, offsetY });
    dispatchEvent('dragstart', { x, y, startPos });
}
function onMouseup(ev) {
    if (!isMouseDown)
        return;
    const { x, y, clientX, clientY, offsetX, offsetY } = ev;
    const endPos = { x, y };
    //console.log('onMouseup ~ endPos', endPos, { x, y, clientX, clientY, offsetX, offsetY });
    dispatchEvent('dragend', { x, y, startPos, endPos });
    //
    isMouseDown = false;
    startPos = null;
}
</script>

<svelte:body on:mouseup={onMouseup} />

<div
  class={get(classes, DEFAULT_GET_CLASS())}
  on:mousedown={onMousedown}
  use:hoverOn={{
    delay: 500,
    toggle: 'hover',
    //onEnter: (el) => {
    //  el.classList.add('hover');
    //  //console.log('enter.');
    //},
    //onLeave: (el) => {
    //  if (isMouseDown) return;
    //  el.classList.remove('hover');
    //  //console.log('leave.');
    //},
  }}
  use:draggingGhost={{
    domain,
    //limitY: direction === 'horizontal',
    limitY(ev) {
      if (direction === 'horizontal') {
        return true;
      }
      if (limitY) {
        const result = limitY(ev);
        if (typeof result === 'boolean') {
          if (result === true) {
            console.log('limitY.');
          }
          return result;
        }
      }
      return false;
    },
    //limitX: direction === 'vertical',
    limitX(ev) {
      if (direction === 'vertical') {
        return true;
      }
      if (limitX) {
        const result = limitX(ev);
        if (typeof result === 'boolean') {
          return result;
        }
      }
      return false;
    },
    //clone,
    class(classList) {
      // add .hover
      classList.add('hover');
      // remove any :hover classes
      const classNames = classList.toString().split(' ');
      classList.remove(...classNames.filter((cls) => cls.match(/\bhover:\b/)));
    },
    style(style) {
      style.zIndex = '1';
      // make it non-clickable
      style.pointerEvents = 'none';
    },
    //attach,
    //detach,
    onAttach: (_, sourceEl) => {
      sourceEl.classList.add('hover');
      //console.log('attach', 'hover');
    },
    //onDetach: (_, sourceEl) => sourceEl.classList.remove('hover'),
  }}
>
  <slot>
    <div class={get(centerLineClass, DEFAULT_CENTERLINE_CLASS)} />
  </slot>
</div>

<style>
  .splitter.hover {
    background-color: var(--mtw-splitter-background-color-hover, transparent);
  }
  .splitter .center-line {
    background-color: var(--mtw-splitter-center-line-border-color, #fff);
  }
  .splitter.hover .center-line {
    /*.splitter:hover .center-line {*/
    opacity: 0;
  }

  /* vertical */

  .splitter.vertical {
    height: var(--mtw-splitter-vertical-size, var(--mtw-splitter-size, 5px));
    /*padding-top: var(--mtw-splitter-padding-size, 3px);
    padding-bottom: var(--mtw-splitter-padding-size, 3px);*/
    cursor: row-resize;
  }
  .splitter.vertical .center-line {
    height: var(--mtw-splitter-border-size, 2px);
    width: 100%;
    top: var(--mtw-splitter-vertical-padding-size, var(--mtw-splitter-padding-size, 2px));
    /*border-top-width: 1px;*/
  }

  .splitter.horizontal {
    width: var(--mtw-splitter-horizontal-size, var(--mtw-splitter-size, 7px));
    /*padding-left: var(--mtw-splitter-padding-size, 3px);
    padding-right: var(--mtw-splitter-padding-size, 3px);*/
    cursor: col-resize;
  }
  .splitter.horizontal .center-line {
    width: var(--mtw-splitter-border-size, 2px);
    height: 100%;
    left: var(--mtw-splitter-horizontal-padding-size, var(--mtw-splitter-padding-size, 3px));
    /*border-left-width: 1px;*/
  }</style>
