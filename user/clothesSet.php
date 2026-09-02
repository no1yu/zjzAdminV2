<?php $page = 'clothesSet'; $pageTitle = '换装设置'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="clothes-material-block">
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-2"><label class="form-label">素材 ID</label><input type="number" min="0" class="form-control" id="clothes-material-id" placeholder="精确 ID"></div>
            <div class="col-3"><label class="form-label">服装分类</label><select class="form-select" id="clothes-material-category"><option value="0">全部</option><option value="1">男装</option><option value="2">女装</option><option value="3">儿童装</option></select></div>
            <div class="col-3"><label class="form-label">状态</label><select class="form-select" id="clothes-material-status"><option value="0">全部</option><option value="1">正常</option><option value="2">关闭</option></select></div>
            <div class="col-4"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="clothes-material-search">筛选</button><button class="btn btn-alt-secondary flex-grow-1" id="clothes-material-reset">重置</button><button class="btn btn-alt-primary flex-grow-1" id="clothes-image-sync">同步图片</button></div></div>
        </div>
    </div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>素材</th><th>服装分类</th><th>服装编号</th><th>状态</th><th class="text-end pe-4">操作</th></tr></thead><tbody class="js-gallery" id="clothes-material-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="clothes-material-pagination"></div></div>
</div>

<div class="modal fade" id="clothes-sync-modal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h3 class="modal-title h5 fw-bold">同步换装素材</h3></div><div class="modal-body p-4"><div class="d-flex align-items-center mb-3"><div class="spinner-border spinner-border-sm text-primary me-3" id="clothes-sync-spinner"></div><div><div class="fw-semibold" id="clothes-sync-name">正在准备素材</div><div class="fs-sm text-muted mt-1">当前第 <span id="clothes-sync-current">0</span> 条，总计 <span id="clothes-sync-total">43</span> 条</div></div></div><div class="progress mb-3" style="height:8px"><div class="progress-bar" id="clothes-sync-progress" role="progressbar" style="width:0%"></div></div><div class="alert alert-primary d-flex align-items-center mb-0"><i class="fa fa-circle-info me-2"></i><div>没下载完之前请勿离开页面和关闭浏览器窗口</div></div></div><div class="modal-footer d-none" id="clothes-sync-footer"><button type="button" class="btn btn-primary" data-bs-dismiss="modal">我知道了</button></div></div></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
