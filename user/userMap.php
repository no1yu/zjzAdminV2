<?php $page = 'userMap'; $pageTitle = '用户地图'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded" id="user-map-block">
    <div class="block-header block-header-default">
        <div>
            <h3 class="block-title mb-1">用户地区分布</h3>
            <div class="fs-xs text-muted">颜色越深表示该地区用户越多</div>
        </div>
    </div>
    <div class="block-content p-0">
        <div id="user-region-map" class="user-region-map"></div>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
