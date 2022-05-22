<script>import BareResizeSplitter from './BareResizeSplitter.svelte';
export let limitY = undefined;
</script>

<BareResizeSplitter direction="vertical" {limitY} {...$$restProps} on:dragstart on:dragend />
