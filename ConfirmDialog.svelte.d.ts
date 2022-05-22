import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        open?: boolean | undefined;
        title?: string | undefined;
        description?: string | undefined;
        onCancel?: (() => void) | undefined;
        onConfirm?: (() => void) | undefined;
    };
    events: {
        close: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        title: {};
        description: {};
        default: {};
        footer: {};
    };
};
export declare type ConfirmDialogProps = typeof __propDef.props;
export declare type ConfirmDialogEvents = typeof __propDef.events;
export declare type ConfirmDialogSlots = typeof __propDef.slots;
export default class ConfirmDialog extends SvelteComponentTyped<ConfirmDialogProps, ConfirmDialogEvents, ConfirmDialogSlots> {
}
export {};
