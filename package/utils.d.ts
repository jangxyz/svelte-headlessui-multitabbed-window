import { type WindowsState } from './types';
export declare function findWindow(tabs: WindowsState, windowId: string): WindowsState;
declare type WindowsWithParents = {
    current: WindowsState;
    parents: WindowsState[];
    winIndex: number;
};
export declare function findWindowWithParents(tabs: WindowsState, windowId: string): WindowsWithParents;
export {};
