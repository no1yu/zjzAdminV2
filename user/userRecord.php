<?php $page = 'userRecord'; $pageTitle = '行为记录'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="record-block">
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-2"><label class="form-label">用户ID</label><input type="number" min="0" class="form-control" id="record-user-id" placeholder="全部用户"></div>
            <div class="col-2"><label class="form-label">所属应用</label><select class="form-select" id="record-app-id"><option value="0">全部</option></select></div>
            <div class="col-2"><label class="form-label">执行结果</label><select class="form-select" id="record-status"><option value="0">全部记录</option><option value="1">成功</option><option value="2">失败</option></select></div>
            <div class="col-4"><label class="form-label">创建时间</label><div class="input-group"><span class="input-group-text"><i class="fa fa-calendar-days"></i></span><input type="text" class="form-control" id="record-create-time" placeholder="开始日期 - 结束日期" autocomplete="off"></div></div>
            <div class="col-2"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="record-search">查询</button><button class="btn btn-alt-secondary flex-grow-1" id="record-reset">重置</button></div></div>
        </div>
    </div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><colgroup><col style="width:10%"><col style="width:14%"><col style="width:8%"><col style="width:7%"><col style="width:6%"><col style="width:17%"><col style="width:7%"><col style="width:15%"><col style="width:8%"><col style="width:8%"></colgroup><thead><tr><th class="ps-4">ID</th><th>操作名称</th><th>应用ID</th><th>用户ID</th><th>照片</th><th>请求时间</th><th>结果</th><th>错误信息</th><th>耗时</th><th class="text-end pe-4">操作</th></tr></thead><tbody id="record-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="record-pagination"></div></div>
</div>

<div class="modal fade" id="record-relation-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header"><h3 class="modal-title h5 fw-bold" id="record-relation-title"></h3><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
            <div class="modal-body" id="record-relation-body"></div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
