import { isColumnWindow, isRowWindow, type WindowsState, type TabState } from './types';

export function findWindow(tabs: WindowsState, windowId: string): WindowsState {
  const [_, ...windowIndexes] = windowId.split('.').map((x) => parseInt(x));
  return windowIndexes.reduce<WindowsState>((current, winIndex) => {
    if (isRowWindow(current) || isColumnWindow(current)) {
      return current[1][winIndex];
    }
    // tab
    else {
      return [current[0][winIndex]] as TabState[];
    }
  }, tabs);
}

type WindowsWithParents = { current: WindowsState; parents: WindowsState[]; winIndex: number };
export function findWindowWithParents(tabs: WindowsState, windowId: string): WindowsWithParents {
  const [_, ...windowIndexes] = windowId.split('.').map((x) => parseInt(x));
  const { current, parents, winIndex } = windowIndexes.reduce<WindowsWithParents>(
    ({ current, parents }: WindowsWithParents, winIndex) => {
      if (isRowWindow(current) || isColumnWindow(current)) {
        //return current[1][winIndex];
        return {
          current: current[1][winIndex],
          parents: ([current] as WindowsState[]).concat(parents),
          winIndex,
        };
      }
      // tab
      else {
        //return [current[0][winIndex]] as TabState[];
        return {
          current: [current[0][winIndex]] as TabState[],
          parents: ([current] as WindowsState[]).concat(parents),
          winIndex,
        };
      }
    },
    {
      current: tabs,
      parents: [],
      winIndex: 0,
    }
  );
  return { current, parents, winIndex };
}
