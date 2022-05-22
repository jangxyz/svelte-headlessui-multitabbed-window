import { isObject, kebabCase } from 'lodash-es';

export function resolveClasses(
  ...classes: (string | string[] | string[][] | undefined | null | false)[]
): string {
  return classes
    .filter((x) => Boolean(x))
    .map((cls) => {
      if (typeof cls === 'string') {
        return cls;
      }
      if (Array.isArray(cls)) {
        return cls.map((_cls) => resolveClasses(_cls)).join(' ');
      }
      return cls;
    })
    .join(' ');
}
export function resolveStyles(
  ...styles: (string | Record<string, string>)[]
): string {
  return styles
    .map((style) => {
      if (typeof style === 'string') {
        return style;
      }
      if (isObject(style)) {
        return Object.entries(style)
          .map(([key, value]) => `${kebabCase(key)}: ${value}`)
          .join('; ');
      }
      return style;
    })
    .join('; ');
}

export function get<A extends unknown[]>(
  target: string | ((...args: A) => string) | undefined,
  ...args: A
) {
  if (!target) {
    return '';
  }
  if (typeof target === 'function') {
    return target(...args);
  } else {
    return target;
  }
}

export function observeResize(
  elements: HTMLElement | HTMLElement[],
  entryCallback: ((entry: ResizeObserverEntry) => void) | undefined,
  overallCallback?: (entries: ResizeObserverEntry[]) => void
): ResizeObserver {
  const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      //if (entry.contentBoxSize) {
      //  // Firefox implements `contentBoxSize` as a single content rect, rather than an array
      //  const contentBoxSize = Array.isArray(entry.contentBoxSize) ? entry.contentBoxSize[0] : entry.contentBoxSize;
      //  entryCallback && entryCallback(contentBoxSize);
      //} else {
      //  entryCallback && entryCallback(entry.contentRect);
      //}
      entryCallback && entryCallback(entry);
    }
    if (overallCallback) {
      overallCallback(entries);
    }
  });

  (Array.isArray(elements) ? elements : [elements]).forEach((el) =>
    observer.observe(el)
  );

  return observer;
}
