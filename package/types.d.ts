declare type SomeObject = Record<string, unknown>;
export declare type TabState<T extends Record<string, unknown> = SomeObject> = {
    title: string;
    key?: string;
} & T;
export declare type TabStateList<T extends Record<string, unknown> = SomeObject> = TabState<T>[];
export declare type RowWindows<T extends Record<string, unknown> = SomeObject> = ['row', WindowsState<T>[]];
export declare type ColumnWindows<T extends Record<string, unknown> = SomeObject> = ['column', WindowsState<T>[]];
export declare type WindowsState<T extends Record<string, unknown> = SomeObject> = TabStateList<T> | RowWindows<T> | ColumnWindows<T>;
export declare function isRowWindow(windows: WindowsState): windows is RowWindows;
export declare function isColumnWindow(windows: WindowsState): windows is ColumnWindows;
export declare function isTabsWindow(windows: WindowsState): windows is TabStateList;
export {};
