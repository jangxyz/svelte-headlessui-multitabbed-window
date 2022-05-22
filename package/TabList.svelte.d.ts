import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        selected?: boolean | undefined;
        class?: string | ((props: {
            selected: boolean;
        }) => string) | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type TabListProps = typeof __propDef.props;
export declare type TabListEvents = typeof __propDef.events;
export declare type TabListSlots = typeof __propDef.slots;
export default class TabList extends SvelteComponentTyped<TabListProps, TabListEvents, TabListSlots> {
}
export {};
