<?php $page = 'webTask'; $pageTitle = '定时日志'; require __DIR__ . '/header.php'; ?>
<div class="row g-3 mb-3">
    <div class="col-6">
        <div class="block block-rounded h-100 mb-0" id="timer-first-block">
            <div class="block-content block-content-full d-flex align-items-center justify-content-between">
                <div>
                    <div class="fs-sm fw-medium text-muted mb-1" id="timer-first-name">未解锁照片清理</div>
                    <div class="fs-4 fw-semibold" id="timer-first-time">暂无执行记录</div>
                    <div class="fs-xs text-muted mt-1">最后执行时间</div>
                </div>
                <div class="item item-rounded-lg bg-warning-light text-warning"><i class="fa fa-clock-rotate-left fs-3"></i></div>
            </div>
        </div>
    </div>
    <div class="col-6">
        <div class="block block-rounded h-100 mb-0" id="timer-second-block">
            <div class="block-content block-content-full d-flex align-items-center justify-content-between">
                <div>
                    <div class="fs-sm fw-medium text-muted mb-1" id="timer-second-name">临时编辑数据清理</div>
                    <div class="fs-4 fw-semibold" id="timer-second-time">暂无执行记录</div>
                    <div class="fs-xs text-muted mt-1">最后执行时间</div>
                </div>
                <div class="item item-rounded-lg bg-info-light text-info"><i class="fa fa-hourglass-half fs-3"></i></div>
            </div>
        </div>
    </div>
</div>
<div class="block block-rounded data-panel" id="web-task-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">执行日志</h3>
        <div class="block-options"><button type="button" class="btn btn-sm btn-alt-danger" id="web-task-clear">一键清空日志</button></div>
    </div>
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-3"><label class="form-label">类型</label><select class="form-select" id="web-task-type"><option value="0">全部类型</option><option value="1">未解锁照片清理</option><option value="2">临时编辑数据清理</option></select></div>
            <div class="col-2"><label class="form-label">状态</label><select class="form-select" id="web-task-status"><option value="0">全部状态</option><option value="1">成功</option><option value="2">失败</option></select></div>
            <div class="col-2"><label class="form-label">删除数量</label><select class="form-select" id="web-task-delete-count-type"><option value="0">全部</option><option value="1" selected>有删除</option><option value="2">无删除</option></select></div>
            <div class="col-auto"><button class="btn btn-primary" id="web-task-search">查询</button></div>
            <div class="col-auto"><button class="btn btn-alt-secondary" id="web-task-reset">重置</button></div>
        </div>
    </div>
    <div class="block-content p-0">
        <div class="table-responsive fixed-table-area">
            <table class="table table-hover table-vcenter mb-0">
                <colgroup><col style="width:6%"><col style="width:18%"><col style="width:22%"><col style="width:10%"><col style="width:10%"><col style="width:9%"><col style="width:17%"><col style="width:8%"></colgroup>
                <thead><tr><th class="ps-4">ID</th><th>定时器</th><th>执行时间</th><th>删除数量</th><th>执行耗时</th><th>状态</th><th>错误日志</th><th class="text-end pe-4">操作</th></tr></thead>
                <tbody id="web-task-list"></tbody>
            </table>
        </div>
    </div>
    <div class="block-content block-content-full border-top"><div id="web-task-pagination"></div></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
