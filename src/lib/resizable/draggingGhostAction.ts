function log(...args: unknown[]) {
  console.log('%c [draggingGhostAction]', 'color: #a00', ...args);
}

type Options = {
  domain: HTMLElement;
  //
  limitX: (ev: MouseEvent) => boolean;
  limitY: (ev: MouseEvent) => boolean;
  // cloning and styling ghost
  clone: (source: HTMLElement) => HTMLElement;
  style: (style: CSSStyleDeclaration, ghost: HTMLElement, source: HTMLElement) => void;
  class: (classList: DOMTokenList, ghost: HTMLElement, source: HTMLElement) => void;
  // attach / detach ghost
  attach: (ghost: HTMLElement, source: HTMLElement) => void;
  detach: (ghost: HTMLElement, source: HTMLElement) => void;
  onAttach: (ghost: HTMLElement, source: HTMLElement) => void;
  onDetach: (ghost: HTMLElement, source: HTMLElement) => void;
};
type OptionsInput = Partial<
  Omit<Options, 'limitX' | 'limitY'> & {
    limitX: boolean | ((ev: MouseEvent) => boolean);
    limitY: boolean | ((ev: MouseEvent) => boolean);
  }
>;

const defaultOptions = {
  domain: typeof document !== 'undefined' ? document.body : null,
  //
  limitX: false,
  limitY: false,
  clone: (source: HTMLElement) => {
    const ghost = source.cloneNode(true) as HTMLElement;
    // set position
    const [x, y] = [source.offsetLeft, source.offsetTop];
    ghost.style.position = 'absolute';
    ghost.style.left = `${x}px`;
    ghost.style.top = `${y}px`;
    // add "ghost" class
    //ghost.classList.add('ghost');
    ghost.setAttribute('class', `ghost ${ghost.getAttribute('class')}`);
    return ghost;
  },
  style: () => null,
  class: () => null,
  attach: (ghostEl: HTMLElement, source: HTMLElement) => source.insertAdjacentElement('afterend', ghostEl),
  detach: (ghostEl: HTMLElement) => ghostEl.parentElement?.removeChild(ghostEl),
  onAttach: () => null,
  onDetach: () => null,
};

function resolveOptions(options?: OptionsInput): Options {
  const options1 = {
    ...defaultOptions,
    ...options,
  };
  return {
    ...options1,
    limitX: typeof options1.limitX === 'boolean' ? () => options1.limitX : options1.limitX,
    limitY: typeof options1.limitY === 'boolean' ? () => options1.limitY : options1.limitY,
    domain: options1?.domain ?? document.body,
  } as Options;
}

//
//
//

export default function draggingGhost(el: HTMLElement, initialOptions?: OptionsInput) {
  // states
  let ghostEl: HTMLElement | null = null;
  let isMouseDown = false;
  let sourcePos: DOMRect | null = null;
  let sourceOffset: [number, number] = [0, 0];
  let mouseDownOffset: [number, number] = [0, 0];

  let options = resolveOptions(initialOptions);

  function reset(options: Options) {
    isMouseDown = false;
    // destroy ghost
    if (ghostEl) {
      options.detach(ghostEl, el);
      options.onDetach(ghostEl, el);
      ghostEl = null;
    }
    sourcePos = null;
    sourceOffset = [0, 0];
    mouseDownOffset = [0, 0];
  }

  function createGhost(sourceEl: HTMLElement, options: Options) {
    const newElement = options.clone(sourceEl);
    options.style(newElement.style, newElement, sourceEl);
    options.class(newElement.classList, newElement, sourceEl);
    options.attach(newElement, sourceEl);
    options.onAttach(newElement, sourceEl);
    return newElement;
  }

  function computeGhostPosition(ev: MouseEvent) {
    const { offsetX, offsetY, clientX, clientY, pageX, pageY, screenX, screenY } = ev;
    const x = clientX - (sourcePos?.x ?? 0) - mouseDownOffset[0] + sourceOffset[0];
    const y = clientY - (sourcePos?.y ?? 0) - mouseDownOffset[1] + sourceOffset[1];
    return { x, y };
  }

  function moveGhost(ev: MouseEvent, options: Options) {
    if (!ghostEl) {
      return;
    }
    const { x, y } = computeGhostPosition(ev);
    //log( 'move:', [x, y], '=', [clientX, clientY], '±', [sourcePos?.x, sourcePos?.y], mouseDownOffset, sourceOffset, { offsetY, clientY, pageY, screenY }, { offsetX, clientX, pageX, screenX });
    if (!options.limitX(ev)) {
      ghostEl.style.left = `${x}px`;
    }
    if (!options.limitY(ev)) {
      ghostEl.style.top = `${y}px`;
    }
  }

  function onMouseDown(ev: MouseEvent) {
    const source = ev.currentTarget as HTMLElement;

    // init state
    isMouseDown = true;
    sourcePos = source.getBoundingClientRect(); // rel. to browser
    sourceOffset = [source.offsetLeft, source.offsetTop]; // rel. to offset parent
    mouseDownOffset = [ev.offsetX, ev.offsetY]; // click position rel. to source

    // build clone of dragging source
    ghostEl = createGhost(source, options);

    log('down:', { sourcePos, mouseDownOffset, sourceOffset }, ev.currentTarget, ev.target, el, ghostEl, ev);
  }

  function onMouseUp(ev: MouseEvent) {
    if (!isMouseDown) return;
    log('up;', ev.target, ev);
    reset(options);
  }

  function onMouseMove(ev: MouseEvent) {
    if (!isMouseDown) return;
    moveGhost(ev, options);
  }

  function init(_options?: OptionsInput) {
    options = resolveOptions(_options);

    // add event listeners
    el.addEventListener('mousedown', onMouseDown);
    document.body.addEventListener('mouseup', onMouseUp);
    options.domain.addEventListener('mousemove', onMouseMove);
  }
  function destroy() {
    el.removeEventListener('mousedown', onMouseDown);
    // remove event listeners
    document.body.removeEventListener('mouseup', onMouseUp);
    options.domain.removeEventListener('mousemove', onMouseMove);

    reset(options);
  }

  function update(_options?: OptionsInput) {
    //console.log('update', options?.domain);
    // re-attach event listeners on domain element
    if (options.domain !== _options?.domain) {
      //console.log('options update?', _options?.domain, options.domain);

      // remove listeners on previous domain
      options.domain.removeEventListener('mousemove', onMouseMove);
      // add listeners on new domain
      options = resolveOptions(_options);
      options.domain.addEventListener('mousemove', onMouseMove);
    }
  }

  // init
  init(initialOptions);
  return { update, destroy };
}
