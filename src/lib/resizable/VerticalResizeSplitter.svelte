<script lang="ts">
  import BareResizeSplitter from './BareResizeSplitter.svelte';
  export let limitY: ((ev: MouseEvent) => boolean | undefined) | undefined = undefined;
</script>

<BareResizeSplitter direction="vertical" {limitY} {...$$restProps} on:dragstart on:dragend />
