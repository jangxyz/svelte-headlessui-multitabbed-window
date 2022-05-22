import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        [x: string]: any;
        limitX?: ((ev: MouseEvent) => boolean | undefined) | undefined;
    };
    events: {
        dragstart: CustomEvent<any>;
        dragend: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type HorizontalResizeSplitterProps = typeof __propDef.props;
export declare type HorizontalResizeSplitterEvents = typeof __propDef.events;
export declare type HorizontalResizeSplitterSlots = typeof __propDef.slots;
export default class HorizontalResizeSplitter extends SvelteComponentTyped<HorizontalResizeSplitterProps, HorizontalResizeSplitterEvents, HorizontalResizeSplitterSlots> {
}
export {};
