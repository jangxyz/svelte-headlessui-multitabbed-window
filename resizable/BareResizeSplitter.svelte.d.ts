import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        direction?: "vertical" | "horizontal" | undefined;
        absolute?: boolean | undefined;
        domain?: HTMLElement | undefined;
        limitY?: ((ev: MouseEvent) => boolean | undefined) | undefined;
        limitX?: ((ev: MouseEvent) => boolean | undefined) | undefined;
        class?: string | ((defaultValue: string) => string) | undefined;
        centerLineClass?: string | ((defaultValue: string) => string) | undefined;
    };
    events: {
        dragstart: CustomEvent<any>;
        dragend: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type BareResizeSplitterProps = typeof __propDef.props;
export declare type BareResizeSplitterEvents = typeof __propDef.events;
export declare type BareResizeSplitterSlots = typeof __propDef.slots;
export default class BareResizeSplitter extends SvelteComponentTyped<BareResizeSplitterProps, BareResizeSplitterEvents, BareResizeSplitterSlots> {
}
export {};
