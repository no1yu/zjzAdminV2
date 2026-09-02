<?php $page = 'appSet'; $pageTitle = '应用设置'; require __DIR__ . '/header.php'; ?>
<div class="application-section mb-4">
    <div class="d-flex align-items-center justify-content-between mb-2"><h2 class="h6 fw-bold mb-0">基础设置</h2></div>
    <div class="row g-3" id="application-basic-list"></div>
</div>
<div class="application-section mb-4">
    <div class="d-flex align-items-center justify-content-between mb-2"><h2 class="h6 fw-bold mb-0">置顶应用</h2><span class="fs-xs text-muted">将探索应用的标题拖到这里即可更换</span></div>
    <div class="row g-3" id="application-featured-list"></div>
</div>
<div class="application-section">
    <div class="d-flex align-items-center justify-content-between mb-2"><h2 class="h6 fw-bold mb-0">探索应用</h2><span class="fs-xs text-muted">按住卡片标题拖动调整显示顺序</span></div>
    <div class="row g-3" id="application-sort-list"></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
