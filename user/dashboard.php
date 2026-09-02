<?php $page = 'dashboard'; $pageTitle = '控制台'; require __DIR__ . '/header.php'; ?>
<div class="row g-3 mb-3">
    <div class="col-3">
        <div class="block block-rounded h-100 mb-0" id="stat-today-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">今日功能使用</div><div class="fs-2 fw-bold" id="metric-today">0</div><div class="fs-xs text-muted mt-1">累计 <span id="metric-total">0</span></div></div><div class="item item-rounded-lg bg-primary-light text-primary"><i class="fa fa-wand-magic-sparkles"></i></div></div></div>
    </div>
    <div class="col-3">
        <div class="block block-rounded h-100 mb-0" id="stat-user-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">今日新增</div><div class="fs-2 fw-bold" id="metric-users-today">0</div><div class="fs-xs text-muted mt-1">总用户 <span id="metric-users-total">0</span></div></div><div class="item item-rounded-lg bg-success-light text-success"><i class="fa fa-user-plus"></i></div></div></div>
    </div>
    <div class="col-3">
        <div class="block block-rounded h-100 mb-0" id="stat-order-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">今日订单</div><div class="fs-2 fw-bold" id="metric-orders">0</div><div class="fs-xs text-muted mt-1">今日订单数量</div></div><div class="item item-rounded-lg bg-warning-light text-warning"><i class="fa fa-receipt"></i></div></div></div>
    </div>
    <div class="col-3">
        <div class="block block-rounded h-100 mb-0" id="stat-image-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">图片处理</div><div class="fs-2 fw-bold" id="metric-images">0</div><div class="fs-xs text-muted mt-1">全部能力累计</div></div><div class="item item-rounded-lg bg-info-light text-info"><i class="fa fa-images"></i></div></div></div>
    </div>
</div>

<div class="row g-3 mb-3">
    <div class="col-8"><div class="block block-rounded h-100 mb-0" id="trend-block"><div class="block-header block-header-default"><h3 class="block-title">近 7 日操作</h3></div><div class="block-content block-content-full"><div class="dashboard-chart"><canvas id="trend-chart"></canvas></div></div></div></div>
    <div class="col-4"><div class="block block-rounded h-100 mb-0" id="ability-block"><div class="block-header block-header-default"><h3 class="block-title">能力使用</h3></div><div class="block-content block-content-full"><div class="dashboard-chart"><canvas id="ability-chart"></canvas></div></div></div></div>
</div>

<div class="row g-3">
    <div class="col-8"><div class="block block-rounded h-100 mb-0" id="recent-record-block"><div class="block-header block-header-default"><h3 class="block-title">最新记录</h3><a class="btn btn-sm btn-alt-primary js-page-link" data-page="userRecord" href="userRecord.php">更多</a></div><div class="block-content p-0"><div class="table-responsive dashboard-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>操作名称</th><th>应用ID</th><th>用户ID</th><th>请求时间</th></tr></thead><tbody id="recent-records"></tbody></table></div></div></div></div>
<div class="col-4"><div class="block block-rounded h-100 mb-0" id="recent-user-block"><div class="block-header block-header-default"><h3 class="block-title">新用户</h3><a class="btn btn-sm btn-alt-primary js-page-link" data-page="user" href="user.php">更多</a></div><div class="block-content"><div class="js-gallery" id="recent-users"></div></div></div></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
