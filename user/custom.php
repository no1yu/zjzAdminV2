<?php $page = 'custom'; $pageTitle = '用户定制'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="custom-block">
    <div class="block-content block-content-full border-bottom"><div class="row g-3 align-items-end"><div class="col-3"><label class="form-label">用户 ID</label><input type="number" min="0" class="form-control" id="custom-user-id" placeholder="全部用户"></div><div class="col-5"><label class="form-label">创建时间</label><div class="input-group"><span class="input-group-text"><i class="fa fa-calendar-days"></i></span><input type="text" class="form-control" id="custom-create-time" placeholder="开始日期 - 结束日期" autocomplete="off"></div></div><div class="col-4"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="custom-search">筛选</button><button class="btn btn-alt-secondary flex-grow-1" id="custom-reset">重置</button></div></div></div></div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>用户</th><th>规格名称</th><th>像素尺寸</th><th>物理尺寸</th><th>DPI</th><th>创建时间</th><th class="text-end pe-4">操作</th></tr></thead><tbody id="custom-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="custom-pagination"></div></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
