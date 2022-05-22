declare type Options = {
    delay: number;
    toggle: string;
    onEnter: (el: HTMLElement) => void;
    onLeave: (el: HTMLElement) => void;
};
export default function hoverOn(el: HTMLElement, _options?: Partial<Options>): {
    update(): void;
    destroy(): void;
};
export {};
