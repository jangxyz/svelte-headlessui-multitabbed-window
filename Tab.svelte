<script>import { createEventDispatcher } from 'svelte';
import { Tab } from '@rgossiaux/svelte-headlessui';
import { resolveClasses, resolveStyles } from './resizable/utils';
const dispatchEvent = createEventDispatcher();
//type TSlotProps = $$Generic<{}>;
//let classProp: ((props: TSlotProps) => string) | string | undefined = undefined;
//export { classProp as class };
export let selected = false;
export let removeButton = true;
</script>

<Tab
  as="div"
  class={resolveClasses('tab-wrapper', selected && 'selected', ['flex inline-block p-0', 'group'])}
  style={resolveStyles({
    borderRight: `1px solid var(--mtw-tab-border-right-color, rgb(0 0 0 / 1.0))`,
    backgroundColor: selected
      ? 'var(--mtw-tab-background-color-selected, rgb(0 0 0 / 1.0))'
      : 'var(--mtw-tab-background-color, rgb(0 0 0 / 0.5))',
  })}
>
  <!--<div>-->
  <button
    type="button"
    name="tab-name"
    class={['py-1 px-2', 'bg-transparenet border-none', selected ? 'cursor-default' : 'cursor-pointer'].join(' ')}
    style={resolveStyles({
      color: selected
        ? 'var(--mtw-tab-text-color-selected, rgb(255 255 255 / 1.0))'
        : 'var(--mtw-tab-text-color, rgb(255 255 255 / 0.7))',
    })}
    on:click
    on:mouseup
    on:mousedown
  >
    <slot />
  </button>
  {#if removeButton}
    <button
      type="button"
      name="close-tab"
      on:click={() => dispatchEvent('click:remove')}
      class={[
        'w-4 h-4 mx-0.5 p-0 self-center',
        'border-none rounded-md bg-gray-400 text-white text-[14px]',
        selected ? 'bg-transparent opacity-50' : 'opacity-0',
        'group-hover:opacity-50',
        'hover:opacity-100',
      ].join(' ')}>&times;</button
    >
  {/if}
  <!--</div>-->
</Tab>

<style>
  button:not(:disabled):active {
    background-color: transparent;
  }</style>
