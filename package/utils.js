import { isColumnWindow, isRowWindow } from './types';
export function findWindow(tabs, windowId) {
    const [_, ...windowIndexes] = windowId.split('.').map((x) => parseInt(x));
    return windowIndexes.reduce((current, winIndex) => {
        if (isRowWindow(current) || isColumnWindow(current)) {
            return current[1][winIndex];
        }
        // tab
        else {
            return [current[0][winIndex]];
        }
    }, tabs);
}
export function findWindowWithParents(tabs, windowId) {
    const [_, ...windowIndexes] = windowId.split('.').map((x) => parseInt(x));
    const { current, parents, winIndex } = windowIndexes.reduce(({ current, parents }, winIndex) => {
        if (isRowWindow(current) || isColumnWindow(current)) {
            //return current[1][winIndex];
            return {
                current: current[1][winIndex],
                parents: [current].concat(parents),
                winIndex,
            };
        }
        // tab
        else {
            //return [current[0][winIndex]] as TabState[];
            return {
                current: [current[0][winIndex]],
                parents: [current].concat(parents),
                winIndex,
            };
        }
    }, {
        current: tabs,
        parents: [],
        winIndex: 0,
    });
    return { current, parents, winIndex };
}
