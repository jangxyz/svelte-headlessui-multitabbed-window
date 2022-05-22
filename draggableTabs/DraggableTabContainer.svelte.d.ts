import { SvelteComponentTyped } from "svelte";
import type { Readable } from 'svelte/store';
export declare type DropPosition = 'left' | 'right' | 'top' | 'bottom' | 'full';
export declare type WindowIndex = number | null;
declare type DraggablePanelState = {
    windowId: string;
};
declare type DraggableTabState = DraggablePanelState & {
    tabIndex: number;
};
export declare type ContextState = {
    droppableRegion: HTMLElement | null;
    setDroppableRegion: (el: HTMLElement | null) => void;
    isTabMouseDown: boolean;
    isTabDraggingOnPanel: boolean;
    dragStartWindowId: string | null;
    dragStartTabIndex: number | null;
    droppingWindowId: string | null;
    isDroppableRegionLeft: boolean;
    isDroppableRegionRight: boolean;
    isDroppableRegionUp: boolean;
    isDroppableRegionDown: boolean;
    isDroppableRegionFull: boolean;
    dropPosition: DropPosition;
    onTabPanelMouseenter: (ev: CustomEvent, panel: DraggablePanelState) => void;
    onTabPanelMouseleave: (ev: CustomEvent, panel: DraggablePanelState) => void;
    onTabPanelMousemove: (ev: CustomEvent, panel: DraggablePanelState) => void;
    buildTabMousedownHandler: ({ onClickTab, windowId, tabIndex, delay, }: {
        onClickTab: (index: number) => void;
        delay?: number;
    } & DraggableTabState) => (ev: MouseEvent) => void;
};
export declare function useDraggableContext(): Readable<ContextState>;
declare const __propDef: {
    props: {};
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {
            isTabMouseDown: boolean;
            isTabDraggingOnPanel: boolean;
            draggingTabClone: null;
            droppableRegion: (el: HTMLElement | null) => void;
            dropPosition: DropPosition;
            isDroppableRegionLeft: boolean;
            isDroppableRegionRight: boolean;
            isDroppableRegionUp: boolean;
            isDroppableRegionDown: boolean;
            isDroppableRegionFull: boolean;
            buildTabMousedownHandler: ({ tabIndex, windowId, onClickTab, delay, }: {
                onClickTab: (tabIndex: number, windowId: string) => void;
                delay?: number | undefined;
            } & DraggablePanelState & {
                tabIndex: number;
            }) => (ev: MouseEvent) => void;
            onTabPanelMouseenter: (ev: CustomEvent, { windowId }: DraggablePanelState) => void;
            onTabPanelMouseleave: (ev: CustomEvent, { windowId }: DraggablePanelState) => void;
            onTabPanelMousemove: (ev: CustomEvent, { windowId }: DraggablePanelState) => void;
        };
    };
};
export declare type DraggableTabContainerProps = typeof __propDef.props;
export declare type DraggableTabContainerEvents = typeof __propDef.events;
export declare type DraggableTabContainerSlots = typeof __propDef.slots;
export default class DraggableTabContainer extends SvelteComponentTyped<DraggableTabContainerProps, DraggableTabContainerEvents, DraggableTabContainerSlots> {
}
export {};
