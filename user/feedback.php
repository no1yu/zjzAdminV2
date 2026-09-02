<?php $page = 'feedback'; $pageTitle = '意见管理'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="feedback-block">
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-2"><label class="form-label">用户 ID</label><input type="number" min="0" class="form-control" id="feedback-user-id" placeholder="全部用户"></div>
            <div class="col-2"><label class="form-label">反馈类型</label><select class="form-select" id="feedback-type"><option value="0">全部</option><option value="1">功能建议</option><option value="2">使用体验</option><option value="3">投诉</option><option value="4">其他</option></select></div>
            <div class="col-5"><label class="form-label">创建时间</label><div class="input-group"><span class="input-group-text"><i class="fa fa-calendar-days"></i></span><input type="text" class="form-control" id="feedback-create-time" placeholder="开始日期 - 结束日期" autocomplete="off"></div></div>
            <div class="col-3"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="feedback-search">筛选</button><button class="btn btn-alt-secondary flex-grow-1" id="feedback-reset">重置</button></div></div>
        </div>
    </div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>用户</th><th>反馈类型</th><th>反馈内容</th><th>反馈图片</th><th>联系方式</th><th>创建时间</th><th class="text-end pe-4">操作</th></tr></thead><tbody class="js-gallery" id="feedback-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="feedback-pagination"></div></div>
</div>
<div class="modal fade" id="feedback-detail-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header"><h3 class="modal-title h5 fw-bold">意见详情</h3><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body js-gallery" id="feedback-detail-body"></div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
