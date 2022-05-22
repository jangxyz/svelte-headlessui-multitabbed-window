type Options = {
  delay: number;
  toggle: string;
  onEnter: (el: HTMLElement) => void;
  onLeave: (el: HTMLElement) => void;
};
export default function hoverOn(el: HTMLElement, _options?: Partial<Options>) {
  const options: Options = {
    delay: 0,
    toggle: 'hover',
    onEnter: (el: HTMLElement) => el.classList.add('hover'),
    onLeave: (el: HTMLElement) => el.classList.remove('hover'),
    ..._options,
  };
  const { delay, toggle } = options;
  // use toggle only when there is no enter / leave behavior
  let { onEnter, onLeave } = options;
  if (!onEnter && !onLeave) {
    onEnter = (el) => el.classList.add(toggle);
    onLeave = (el) => el.classList.remove(toggle);
  }

  // states
  let enterStartTime: number | null = null;

  function onMouseEnter(ev: MouseEvent) {
    if (ev.currentTarget && onEnter) {
      // enter started, wait until delay
      enterStartTime = Date.now();
      const target = ev.currentTarget as HTMLElement;

      setTimeout(() => {
        // delay guard
        if (enterStartTime === null) return;

        onEnter(target);
      }, delay);
    }
  }
  function onMouseLeave(ev: MouseEvent) {
    // reset enter.
    enterStartTime = null;
    if (ev.currentTarget && onLeave) {
      onLeave(ev.currentTarget as HTMLElement);
    }
  }

  el.addEventListener('mouseenter', onMouseEnter);
  el.addEventListener('mouseleave', onMouseLeave);

  return {
    update() {
      //
    },
    destroy() {
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
    },
  };
}
