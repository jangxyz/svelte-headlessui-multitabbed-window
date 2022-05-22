type SomeObject = Record<string, unknown>;

export type TabState<T extends Record<string, unknown> = SomeObject> = { title: string; key?: string } & T;

export type TabStateList<T extends Record<string, unknown> = SomeObject> = TabState<T>[];
export type RowWindows<T extends Record<string, unknown> = SomeObject> = ['row', WindowsState<T>[]];
export type ColumnWindows<T extends Record<string, unknown> = SomeObject> = ['column', WindowsState<T>[]];
export type WindowsState<T extends Record<string, unknown> = SomeObject> =
  | TabStateList<T>
  | RowWindows<T>
  | ColumnWindows<T>;

export function isRowWindow(windows: WindowsState): windows is RowWindows {
  return windows[0] === 'row';
}
export function isColumnWindow(windows: WindowsState): windows is ColumnWindows {
  return windows[0] === 'column';
}
export function isTabsWindow(windows: WindowsState): windows is TabStateList {
  return !isRowWindow(windows) && !isColumnWindow(windows);
}
