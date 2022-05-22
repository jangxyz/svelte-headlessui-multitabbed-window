import { SvelteComponentTyped } from "svelte";
import type { WindowsState, TabState } from './types';
declare const __propDef: {
    props: {
        [x: string]: any;
        tabs: WindowsState;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            key: string | undefined;
            index: any;
            title: string;
            tabState: TabState<{
                [x: string]: unknown;
            }>;
            changeTabTitle: (index: number, newTitle: string) => void;
        };
    };
};
export declare type MultiTabbedWindowProps = typeof __propDef.props;
export declare type MultiTabbedWindowEvents = typeof __propDef.events;
export declare type MultiTabbedWindowSlots = typeof __propDef.slots;
export default class MultiTabbedWindow extends SvelteComponentTyped<MultiTabbedWindowProps, MultiTabbedWindowEvents, MultiTabbedWindowSlots> {
}
export {};
