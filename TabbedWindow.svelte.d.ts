import { SvelteComponentTyped } from "svelte";
import type { TabState } from './types';
declare const __propDef: {
    props: {
        windowIndex?: number | null | undefined;
        parentWindowId?: string | null | undefined;
        tabs?: TabState<{
            [x: string]: unknown;
        }>[] | undefined;
        activeIndex?: number | undefined;
        onNewTab?: ((tab: TabState) => TabState) | undefined;
        addNewTab: (tabs: TabState[], newTabState: TabState) => TabState[];
        removeTab: (tabs: TabState[], index: number) => TabState[];
    };
    events: {
        drop: CustomEvent<any>;
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
export declare type TabbedWindowProps = typeof __propDef.props;
export declare type TabbedWindowEvents = typeof __propDef.events;
export declare type TabbedWindowSlots = typeof __propDef.slots;
export default class TabbedWindow extends SvelteComponentTyped<TabbedWindowProps, TabbedWindowEvents, TabbedWindowSlots> {
}
export {};
