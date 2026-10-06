<?php $page = 'payOrder'; $pageTitle = '订单管理'; require __DIR__ . '/header.php'; ?>
<div class="row g-3 mb-3">
    <div class="col-4">
        <div class="block block-rounded h-100 mb-0" id="order-pending-count-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">待支付总数</div><div class="fs-2 fw-bold" id="order-pending-count">0</div></div><div class="item item-rounded-lg bg-warning-light text-warning"><i class="fa fa-clock fs-3"></i></div></div></div>
    </div>
    <div class="col-4">
        <div class="block block-rounded h-100 mb-0" id="order-paid-count-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">支付成功总数</div><div class="fs-2 fw-bold" id="order-paid-count">0</div></div><div class="item item-rounded-lg bg-success-light text-success"><i class="fa fa-circle-check fs-3"></i></div></div></div>
    </div>
    <div class="col-4">
        <div class="block block-rounded h-100 mb-0" id="order-refunded-count-block"><div class="block-content block-content-full d-flex align-items-center justify-content-between"><div><div class="fs-sm fw-medium text-muted mb-1">退款成功总数</div><div class="fs-2 fw-bold" id="order-refunded-count">0</div></div><div class="item item-rounded-lg bg-info-light text-info"><i class="fa fa-arrow-rotate-left fs-3"></i></div></div></div>
    </div>
</div>
<div class="block block-rounded data-panel" id="order-block">
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-2"><label class="form-label">用户ID</label><input type="number" min="0" class="form-control" id="order-user-id" placeholder="全部用户"></div>
            <div class="col-3"><label class="form-label">商户订单号</label><input class="form-control" id="order-no" placeholder="支持模糊搜索"></div>
            <div class="col-3"><label class="form-label">微信订单号</label><input class="form-control" id="order-wx" placeholder="支持模糊搜索"></div>
            <div class="col-2"><label class="form-label">所属应用</label><select class="form-select" id="order-app-id"><option value="0">全部</option></select></div>
            <div class="col-2"><label class="form-label">订单状态</label><select class="form-select" id="order-status"><option value="0">全部订单</option><option value="1">待支付</option><option value="2">支付成功</option><option value="3">退款中</option><option value="4">退款失败</option><option value="5">退款成功</option></select></div>
            <div class="col-2"><label class="form-label">支付方式</label><select class="form-select" id="order-type"><option value="0">全部</option><option value="1">微信支付</option><option value="2">虚拟支付</option></select></div>
            <div class="col-4"><label class="form-label">创建时间</label><div class="input-group"><span class="input-group-text"><i class="fa fa-calendar-days"></i></span><input type="text" class="form-control" id="order-create-time" placeholder="开始日期 - 结束日期" autocomplete="off"></div></div>
            <div class="col-2"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="order-search">查询</button><button class="btn btn-alt-secondary flex-grow-1" id="order-reset">重置</button></div></div>
        </div>
    </div>
    <div class="block-content p-0">
        <div class="table-responsive fixed-table-area">
            <table class="table table-hover table-vcenter mb-0">
                <colgroup><col style="width:4%"><col style="width:17%"><col style="width:6%"><col style="width:6%"><col style="width:6%"><col style="width:9%"><col style="width:7%"><col style="width:7%"><col style="width:10%"><col style="width:17%"><col style="width:11%"></colgroup>
                <thead><tr><th class="ps-4">ID</th><th>订单号</th><th>用户ID</th><th>应用ID</th><th>照片ID</th><th>订单名称</th><th>金额</th><th>支付方式</th><th>状态及退款说明</th><th>时间</th><th class="text-end pe-4 order-actions-cell">操作</th></tr></thead>
                <tbody id="order-list"></tbody>
            </table>
        </div>
    </div>
    <div class="block-content block-content-full border-top"><div id="order-pagination"></div></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
