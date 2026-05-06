/*!
 * Covertable Widget Loader v0.1
 * Embeds the Covertable ordering widget on third-party websites.
 *
 * Usage:
 *   <script src="https://<tenant>.covertable.es/widget.js"
 *           data-button-text="Pedir online"
 *           data-button-position="bottom-right"></script>
 *
 * Optional data-* attributes:
 *   data-button-text       Text shown on the launcher button (default: "Pedir online")
 *   data-button-position   bottom-right | bottom-left | top-right | top-left | inline
 *                          (default: bottom-right). "inline" injects the button at
 *                          the position of the <script> tag instead of fixed.
 *   data-target            CSS selector for the element where the button is appended
 *                          (overrides data-button-position).
 *   data-auto-open         "true" to open the widget on page load (default: false).
 */
(function () {
    'use strict';

    if (window.__covertableWidgetLoaded) return;
    window.__covertableWidgetLoaded = true;

    var script = document.currentScript || (function () {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();

    var origin = (function () {
        try {
            return new URL(script.src).origin;
        } catch (e) {
            return window.location.origin;
        }
    })();

    var config = {
        buttonText: script.getAttribute('data-button-text') || 'Pedir online',
        buttonPosition: script.getAttribute('data-button-position') || 'bottom-right',
        target: script.getAttribute('data-target'),
        autoOpen: script.getAttribute('data-auto-open') === 'true',
        widgetUrl: origin + '/widget'
    };

    var state = { open: false, iframe: null, overlay: null, button: null };

    function injectStyles() {
        if (document.getElementById('covertable-widget-styles')) return;
        var css =
            '.covertable-btn{position:fixed;z-index:2147483646;padding:14px 22px;' +
            'border-radius:999px;border:none;background:#111;color:#fff;' +
            'font:600 15px/1 system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;' +
            'cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.18);transition:transform .15s ease}' +
            '.covertable-btn:hover{transform:translateY(-1px)}' +
            '.covertable-btn--inline{position:static;display:inline-block}' +
            '.covertable-btn--bottom-right{right:24px;bottom:24px}' +
            '.covertable-btn--bottom-left{left:24px;bottom:24px}' +
            '.covertable-btn--top-right{right:24px;top:24px}' +
            '.covertable-btn--top-left{left:24px;top:24px}' +
            '.covertable-overlay{position:fixed;inset:0;z-index:2147483647;' +
            'background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;' +
            'padding:24px;backdrop-filter:blur(2px)}' +
            '.covertable-overlay.is-open{display:flex}' +
            '.covertable-frame{width:100%;max-width:920px;height:100%;max-height:90vh;' +
            'border:none;border-radius:16px;background:#fff;box-shadow:0 24px 60px rgba(0,0,0,.35)}' +
            '.covertable-close{position:absolute;top:16px;right:20px;background:rgba(255,255,255,.95);' +
            'border:none;width:36px;height:36px;border-radius:999px;cursor:pointer;' +
            'font:600 18px/1 system-ui,sans-serif;color:#111;box-shadow:0 4px 14px rgba(0,0,0,.18)}';
        var style = document.createElement('style');
        style.id = 'covertable-widget-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function createButton() {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'covertable-btn';
        btn.textContent = config.buttonText;

        if (config.target) {
            var target = document.querySelector(config.target);
            if (target) target.appendChild(btn);
            else document.body.appendChild(btn);
        } else if (config.buttonPosition === 'inline') {
            btn.classList.add('covertable-btn--inline');
            script.parentNode.insertBefore(btn, script);
        } else {
            btn.classList.add('covertable-btn--' + config.buttonPosition);
            document.body.appendChild(btn);
        }

        btn.addEventListener('click', open);
        return btn;
    }

    function createOverlay() {
        var overlay = document.createElement('div');
        overlay.className = 'covertable-overlay';
        overlay.innerHTML =
            '<button type="button" class="covertable-close" aria-label="Cerrar">&times;</button>' +
            '<iframe class="covertable-frame" src="about:blank" allow="payment; geolocation"></iframe>';
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
        overlay.querySelector('.covertable-close').addEventListener('click', close);

        state.iframe = overlay.querySelector('.covertable-frame');
        state.overlay = overlay;
    }

    function open() {
        if (state.open) return;
        state.open = true;
        if (state.iframe.src === 'about:blank' || !state.iframe.src) {
            state.iframe.src = config.widgetUrl;
        }
        state.overlay.classList.add('is-open');
        document.documentElement.style.overflow = 'hidden';
    }

    function close() {
        if (!state.open) return;
        state.open = false;
        state.overlay.classList.remove('is-open');
        document.documentElement.style.overflow = '';
    }

    function handleMessage(e) {
        if (!e.data || typeof e.data !== 'object') return;
        if (e.source !== state.iframe.contentWindow) return;
        if (e.data.type === 'covertable:close') close();
    }

    function init() {
        injectStyles();
        createOverlay();
        state.button = createButton();
        window.addEventListener('message', handleMessage);
        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && state.open) close();
        });
        if (config.autoOpen) open();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.Covertable = { open: open, close: close };
})();
