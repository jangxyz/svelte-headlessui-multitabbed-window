import { SvelteComponentTyped } from "svelte";
import HorizontalResizeSplitter from './HorizontalResizeSplitter.svelte';
declare const __propDef: {
    props: {
        index?: number | undefined;
        class?: string | ((classes: string) => string) | undefined;
        splitterClass?: string | ((defaultValue: string) => string) | undefined;
        style?: string | ((width: number | 'auto', index: number, widths: number[]) => string) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            Spiltter: typeof HorizontalResizeSplitter;
        };
        splitter: {};
    };
};
export declare type HorizontalResizeContainerProps = typeof __propDef.props;
export declare type HorizontalResizeContainerEvents = typeof __propDef.events;
export declare type HorizontalResizeContainerSlots = typeof __propDef.slots;
export default class HorizontalResizeContainer extends SvelteComponentTyped<HorizontalResizeContainerProps, HorizontalResizeContainerEvents, HorizontalResizeContainerSlots> {
}
export {};
