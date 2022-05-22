import { SvelteComponentTyped } from "svelte";
import type { Readable } from 'svelte/store';
declare type Context = {
    containersGroupRef: HTMLElement | null;
    groupWidth: number | undefined;
    count: number;
    itemWidths: number[] | undefined;
    itemWidthPercents: number[] | undefined;
    adjustItemWidth: (itemIndex: number, width: number) => void;
    containerRefs: HTMLElement[];
    registerContainerRef: (itemIndex: number, ref: HTMLElement) => void;
};
export declare function useHorizontalResizeContext(): Readable<Context>;
import HorizontalResizeContainer from './HorizontalResizeContainer.svelte';
import HorizontalResizeSplitter from './HorizontalResizeSplitter.svelte';
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
            Container: typeof HorizontalResizeContainer;
            Splitter: typeof HorizontalResizeSplitter;
            count: number;
            groupWidth: number | undefined;
            itemWidths: number[] | undefined;
            itemWidthPercents: number[] | undefined;
            adjustItemWidth: (itemIndex: number, width: number) => void;
        };
    };
};
export declare type HorizontalResizeContainersGroupProps = typeof __propDef.props;
export declare type HorizontalResizeContainersGroupEvents = typeof __propDef.events;
export declare type HorizontalResizeContainersGroupSlots = typeof __propDef.slots;
export default class HorizontalResizeContainersGroup extends SvelteComponentTyped<HorizontalResizeContainersGroupProps, HorizontalResizeContainersGroupEvents, HorizontalResizeContainersGroupSlots> {
}
export {};
