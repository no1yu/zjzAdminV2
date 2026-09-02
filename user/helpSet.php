<?php $page = 'helpSet'; $pageTitle = '问题设置'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="help-block">
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-7"><label class="form-label">标题</label><input class="form-control" id="help-title" placeholder="支持模糊搜索"></div>
            <div class="col-auto"><button class="btn btn-primary" id="help-search">筛选</button></div>
            <div class="col-auto"><button class="btn btn-alt-secondary" id="help-reset">重置</button></div>
            <div class="col text-end"><button class="btn btn-success" id="help-add">新增问题</button></div>
        </div>
    </div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>标题</th><th>内容</th><th>排序</th><th class="text-end pe-4">操作</th></tr></thead><tbody id="help-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="help-pagination"></div></div>
</div>

<div class="modal fade" id="help-modal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h3 class="modal-title h5 fw-bold" id="help-modal-title">新增问题</h3><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><form id="help-form" class="row g-3"><input type="hidden" id="help-id"><div class="col-12"><label class="form-label">标题</label><input class="form-control" id="help-form-title" maxlength="255" required></div><div class="col-12"><label class="form-label">内容</label><textarea class="form-control" id="help-content" rows="5" maxlength="1000" required></textarea></div><div class="col-6"><label class="form-label">排序</label><input class="form-control" id="help-sort" type="number" min="1" required></div></form></div><div class="modal-footer"><button type="button" class="btn btn-alt-secondary" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-primary" id="help-save">保存</button></div></div></div></div>
<?php require __DIR__ . '/footer.php'; ?>
