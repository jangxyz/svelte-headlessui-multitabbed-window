import { SvelteComponentTyped } from "svelte";
import VerticalResizeSplitter from './VerticalResizeSplitter.svelte';
declare const __propDef: {
    props: {
        index?: number | undefined;
        class?: string | ((classes: string) => string) | undefined;
        splitterClass?: string | ((defaultValue: string) => string) | undefined;
        style?: string | ((height: number | 'auto', index: number, heights: number[]) => string) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            Spiltter: typeof VerticalResizeSplitter;
        };
        splitter: {};
    };
};
export declare type VerticalResizeContainerProps = typeof __propDef.props;
export declare type VerticalResizeContainerEvents = typeof __propDef.events;
export declare type VerticalResizeContainerSlots = typeof __propDef.slots;
export default class VerticalResizeContainer extends SvelteComponentTyped<VerticalResizeContainerProps, VerticalResizeContainerEvents, VerticalResizeContainerSlots> {
}
export {};
