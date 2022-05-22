import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        selected?: boolean | undefined;
        removeButton?: boolean | undefined;
    };
    events: {
        click: MouseEvent;
        mouseup: MouseEvent;
        mousedown: MouseEvent;
        'click:remove': CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type TabProps = typeof __propDef.props;
export declare type TabEvents = typeof __propDef.events;
export declare type TabSlots = typeof __propDef.slots;
export default class Tab extends SvelteComponentTyped<TabProps, TabEvents, TabSlots> {
}
export {};
