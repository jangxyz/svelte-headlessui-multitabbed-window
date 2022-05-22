<script>import BareResizeSplitter from './BareResizeSplitter.svelte';
export let limitX = undefined;
</script>

<BareResizeSplitter direction="horizontal" {limitX} {...$$restProps} on:dragstart on:dragend />
