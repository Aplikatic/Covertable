---
title: Covertable Widget
description: Embeddable ordering widget
permalink: /widget
layout: widget

'[igniter-orange::local-search]': []
---
<div class="container py-4">
    <div class="row justify-content-md-center">
        <div class="col-12 col-lg-8">
            <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                    <h1 class="h4 mb-3 text-center">Haz tu pedido</h1>
                    <p class="text-muted text-center mb-4 small">
                        Introduce tu dirección de entrega para empezar.
                    </p>
                    <livewire:igniter-orange::local-search/>
                </div>
            </div>
        </div>
    </div>
</div>
