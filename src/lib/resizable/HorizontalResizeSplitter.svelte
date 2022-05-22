<script lang="ts">
  import BareResizeSplitter from './BareResizeSplitter.svelte';
  export let limitX: ((ev: MouseEvent) => boolean | undefined) | undefined = undefined;
</script>

<BareResizeSplitter direction="horizontal" {limitX} {...$$restProps} on:dragstart on:dragend />
