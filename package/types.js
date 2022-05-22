export function isRowWindow(windows) {
    return windows[0] === 'row';
}
export function isColumnWindow(windows) {
    return windows[0] === 'column';
}
export function isTabsWindow(windows) {
    return !isRowWindow(windows) && !isColumnWindow(windows);
}
