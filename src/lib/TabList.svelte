<script lang="ts">
  import { TabList } from '@rgossiaux/svelte-headlessui';
  import { get } from './resizable/utils';

  export let selected = false;

  let classes: ((props: { selected: boolean }) => string) | string | undefined = ({ selected }) =>
    'tablist flex flex-row text-xs';
  export { classes as class };
</script>

<TabList
  class={get(classes, { selected })}
  style="background-color: var(--mtw-tablist-background-color, 'transparent');"
>
  <slot />
</TabList>
