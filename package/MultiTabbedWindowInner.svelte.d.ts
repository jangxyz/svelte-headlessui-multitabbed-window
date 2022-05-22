import { SvelteComponentTyped } from "svelte";
import { type TabState, type WindowsState } from './types';
declare const __propDef: {
    props: {
        [x: string]: any;
        tabs?: WindowsState<{
            [x: string]: unknown;
        }> | undefined;
        windowIndex?: number | undefined;
        parentWindowId?: string | null | undefined;
    };
    events: {
        drop: any;
    } & {
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
export declare type MultiTabbedWindowInnerProps = typeof __propDef.props;
export declare type MultiTabbedWindowInnerEvents = typeof __propDef.events;
export declare type MultiTabbedWindowInnerSlots = typeof __propDef.slots;
export default class MultiTabbedWindowInner extends SvelteComponentTyped<MultiTabbedWindowInnerProps, MultiTabbedWindowInnerEvents, MultiTabbedWindowInnerSlots> {
}
export {};
