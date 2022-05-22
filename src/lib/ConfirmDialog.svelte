<script lang="ts">
  import { Dialog, DialogOverlay, DialogTitle, DialogDescription } from '@rgossiaux/svelte-headlessui';
  import { createEventDispatcher } from 'svelte';

  const dispatchEvent = createEventDispatcher();

  export let open = false;

  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;

  export let onCancel = () => {};
  export let onConfirm = () => {};

  let cancelButton: HTMLButtonElement;
  let confirmButton: HTMLButtonElement;

  function closeDialog() {
    open = false;
    dispatchEvent('close');
  }
</script>

<Dialog
  {open}
  on:close={closeDialog}
  initialFocus={cancelButton}
  class="fixed flex justify-center inset-0 z-10 overflow-y-auto"
>
  <DialogOverlay class="fixed inset-0 bg-gray-400/[0.5]" />

  <div
    class="container flex flex-col inline-block max-w-md p-6 my-8 mx-2 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
  >
    <DialogTitle class="text-lg font-medium leading-6 text-gray-900">
      <slot name="title">
        {#if title}
          {title}
        {:else}
          Deactivate account
        {/if}
      </slot>
    </DialogTitle>

    <DialogDescription class="text-sm text-gray-700">
      <slot name="description">
        {#if description !== undefined}
          {description}
        {:else}
          This will permanently deactivate your account
        {/if}
      </slot>
    </DialogDescription>

    <slot>
      <p class="mt-2 text-sm text-gray-500">
        Are you sure you want to deactivate your account? All of your data will be permanently removed. This action
        cannot be undone.
      </p>
    </slot>

    <slot name="footer">
      <div class="flex-auto" />
      <div class="flex justify-between mt-4">
        <button
          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          bind:this={cancelButton}
          on:click={() => {
            onCancel();
            closeDialog();
          }}>Cancel</button
        >
        <button
          bind:this={confirmButton}
          class="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
          on:click={() => {
            onConfirm();
            closeDialog();
          }}>Confirm</button
        >
      </div>
    </slot>
  </div>
</Dialog>
