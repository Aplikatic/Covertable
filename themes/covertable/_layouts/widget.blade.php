---
description: Embeddable widget layout — no header/footer, transparent background, optimized for iframe
---
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="{{ App::getLocale() }}" class="h-100">
<head>
    @include('igniter-orange::includes.head')
    @livewireStyles
    <style>
        html, body { background: transparent; }
        body.widget-mode { padding: 0; margin: 0; }
        body.widget-mode .header,
        body.widget-mode .footer { display: none !important; }
    </style>
</head>
<body class="d-flex flex-column h-100 widget-mode {{ $this->page->bodyClass }}">

<main role="main" class="flex-grow-1">
    <div id="page-wrapper">
        @themePage
    </div>
</main>

<livewire:igniter-orange::utils.modal/>
<livewire:igniter-orange::utils.flash-message/>
@livewireScripts
@include('igniter-orange::includes.scripts')

<script>
    (function () {
        function postHeight() {
            try {
                var h = Math.max(
                    document.documentElement.scrollHeight,
                    document.body.scrollHeight
                );
                window.parent.postMessage({ type: 'covertable:height', height: h }, '*');
            } catch (e) {}
        }
        window.addEventListener('load', postHeight);
        new ResizeObserver(postHeight).observe(document.body);
    })();
</script>
</body>
</html>
