---
title: Covertable Widget
description: Embeddable ordering widget — single-location flow
permalink: /widget
layout: widget
hideFooter: 1

'[igniter-orange::local-header]': []
'[igniter-orange::fulfillment]': []
'[igniter-orange::category-list]': []
'[igniter-orange::menu-item-list]': []
'[igniter-orange::cart-box]': []
'[igniter-orange::fulfillment-modal]': []
---
<div class="bg-white border-bottom border-1">
    <div class="container py-3">
        <div class="row align-items-start g-3">
            <div class="col-lg-8">
                <x-igniter-orange::local-header/>
            </div>
            <div class="col-lg-4">
                <div class="d-flex justify-content-lg-end">
                    <div class="local-control p-2 border rounded w-100">
                        <div class="text-center fw-bold">
                            <x-igniter-orange::fulfillment/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="sticky-top bg-white border-bottom border-1">
    <div class="container">
        <x-igniter-orange::category-list/>
    </div>
</div>

<div class="container pt-3 pb-5">
    <div class="row g-4">
        <div class="col-lg-8">
            <livewire:igniter-orange::menu-item-list/>
        </div>
        <div class="col-lg-4 d-none d-lg-block">
            <livewire:igniter-orange::cart-box/>
        </div>
    </div>
</div>

<livewire:igniter-orange::fulfillment-modal/>
