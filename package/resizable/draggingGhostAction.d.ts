declare type Options = {
    domain: HTMLElement;
    limitX: (ev: MouseEvent) => boolean;
    limitY: (ev: MouseEvent) => boolean;
    clone: (source: HTMLElement) => HTMLElement;
    style: (style: CSSStyleDeclaration, ghost: HTMLElement, source: HTMLElement) => void;
    class: (classList: DOMTokenList, ghost: HTMLElement, source: HTMLElement) => void;
    attach: (ghost: HTMLElement, source: HTMLElement) => void;
    detach: (ghost: HTMLElement, source: HTMLElement) => void;
    onAttach: (ghost: HTMLElement, source: HTMLElement) => void;
    onDetach: (ghost: HTMLElement, source: HTMLElement) => void;
};
declare type OptionsInput = Partial<Omit<Options, 'limitX' | 'limitY'> & {
    limitX: boolean | ((ev: MouseEvent) => boolean);
    limitY: boolean | ((ev: MouseEvent) => boolean);
}>;
export default function draggingGhost(el: HTMLElement, initialOptions?: OptionsInput): {
    update: (_options?: Partial<Omit<Options, "limitX" | "limitY"> & {
        limitX: boolean | ((ev: MouseEvent) => boolean);
        limitY: boolean | ((ev: MouseEvent) => boolean);
    }> | undefined) => void;
    destroy: () => void;
};
export {};
