import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {};
    events: {
        drop: CustomEvent<any>;
    } & {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export declare type DropRegionProps = typeof __propDef.props;
export declare type DropRegionEvents = typeof __propDef.events;
export declare type DropRegionSlots = typeof __propDef.slots;
export default class DropRegion extends SvelteComponentTyped<DropRegionProps, DropRegionEvents, DropRegionSlots> {
}
export {};
