export default function hoverOn(el, _options) {
    const options = {
        delay: 0,
        toggle: 'hover',
        onEnter: (el) => el.classList.add('hover'),
        onLeave: (el) => el.classList.remove('hover'),
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
    let enterStartTime = null;
    function onMouseEnter(ev) {
        if (ev.currentTarget && onEnter) {
            // enter started, wait until delay
            enterStartTime = Date.now();
            const target = ev.currentTarget;
            setTimeout(() => {
                // delay guard
                if (enterStartTime === null)
                    return;
                onEnter(target);
            }, delay);
        }
    }
    function onMouseLeave(ev) {
        // reset enter.
        enterStartTime = null;
        if (ev.currentTarget && onLeave) {
            onLeave(ev.currentTarget);
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
