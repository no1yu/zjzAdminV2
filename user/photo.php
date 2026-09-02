<?php $page = 'photo'; $pageTitle = '成片管理'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="photo-block">
    <div class="block-content block-content-full border-bottom"><div class="row g-3 align-items-end"><div class="col-2"><label class="form-label">用户ID</label><input type="number" min="0" class="form-control" id="photo-user-id" placeholder="全部用户"></div><div class="col-3"><label class="form-label">规格名称</label><input class="form-control" id="photo-name" placeholder="支持模糊搜索"></div><div class="col-4"><label class="form-label">创建时间</label><div class="input-group"><span class="input-group-text"><i class="fa fa-calendar-days"></i></span><input type="text" class="form-control" id="photo-create-time" placeholder="开始日期 - 结束日期" autocomplete="off"></div></div><div class="col-3"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="photo-search">查询</button><button class="btn btn-alt-secondary flex-grow-1" id="photo-reset">重置</button></div></div></div></div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>成片</th><th>名称</th><th>用户ID</th><th>尺寸</th><th>服装</th><th>创建时间</th><th class="text-end pe-4">操作</th></tr></thead><tbody class="js-gallery" id="photo-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="photo-pagination"></div></div>
</div>
<div class="modal fade" id="photo-detail-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header"><h3 class="modal-title h5 fw-bold">成片详情</h3><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body" id="photo-detail-body"></div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
