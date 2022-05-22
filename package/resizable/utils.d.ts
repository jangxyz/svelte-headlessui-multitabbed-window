export declare function resolveClasses(...classes: (string | string[] | string[][] | undefined | null | false)[]): string;
export declare function resolveStyles(...styles: (string | Record<string, string>)[]): string;
export declare function get<A extends unknown[]>(target: string | ((...args: A) => string) | undefined, ...args: A): string;
export declare function observeResize(elements: HTMLElement | HTMLElement[], entryCallback: ((entry: ResizeObserverEntry) => void) | undefined, overallCallback?: (entries: ResizeObserverEntry[]) => void): ResizeObserver;
