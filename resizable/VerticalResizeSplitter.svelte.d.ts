import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        limitY?: ((ev: MouseEvent) => boolean | undefined) | undefined;
    };
    events: {
        dragstart: CustomEvent<any>;
        dragend: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type VerticalResizeSplitterProps = typeof __propDef.props;
export declare type VerticalResizeSplitterEvents = typeof __propDef.events;
export declare type VerticalResizeSplitterSlots = typeof __propDef.slots;
export default class VerticalResizeSplitter extends SvelteComponentTyped<VerticalResizeSplitterProps, VerticalResizeSplitterEvents, VerticalResizeSplitterSlots> {
}
export {};
