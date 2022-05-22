import { SvelteComponentTyped } from "svelte";
import type { Readable } from 'svelte/store';
declare type Context = {
    containersGroupRef: HTMLElement | null;
    groupHeight: number | undefined;
    count: number;
    itemHeights: number[] | undefined;
    itemHeightPercents: number[] | undefined;
    adjustItemHeight: (itemIndex: number, height: number) => void;
    containerRefs: HTMLElement[];
    registerContainerRef: (itemIndex: number, ref: HTMLElement) => void;
};
export declare function useVerticalResizeContext(): Readable<Context>;
import VerticalResizeContainer from './VerticalResizeContainer.svelte';
import VerticalResizeSplitter from './VerticalResizeSplitter.svelte';
declare const __propDef: {
    props: {
        [x: string]: any;
        class?: string | ((classes: string) => string) | undefined;
        count?: number | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            Container: typeof VerticalResizeContainer;
            Splitter: typeof VerticalResizeSplitter;
            count: number;
            groupHeight: number | undefined;
            itemHeights: number[] | undefined;
            itemHeightPercents: number[] | undefined;
            adjustItemHeight: (itemIndex: number, height: number) => void;
        };
    };
};
export declare type VerticalResizeContainersGroupProps = typeof __propDef.props;
export declare type VerticalResizeContainersGroupEvents = typeof __propDef.events;
export declare type VerticalResizeContainersGroupSlots = typeof __propDef.slots;
export default class VerticalResizeContainersGroup extends SvelteComponentTyped<VerticalResizeContainersGroupProps, VerticalResizeContainersGroupEvents, VerticalResizeContainersGroupSlots> {
}
export {};
