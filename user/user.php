<?php $page = 'user'; $pageTitle = '用户管理'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded data-panel" id="user-block">
    <div class="block-content block-content-full border-bottom">
        <div class="row g-3 align-items-end">
            <div class="col-2"><label class="form-label">用户 ID</label><input type="number" min="0" class="form-control" id="user-id" placeholder="精确 ID"></div>
            <div class="col-3"><label class="form-label">用户昵称</label><input class="form-control" id="user-name" placeholder="支持模糊搜索"></div>
            <div class="col-4"><label class="form-label">注册时间</label><div class="input-group"><span class="input-group-text"><i class="fa fa-calendar-days"></i></span><input type="text" class="form-control" id="user-create-time" placeholder="开始日期 - 结束日期" autocomplete="off"></div></div>
            <div class="col-3"><div class="d-flex gap-2"><button class="btn btn-primary flex-grow-1" id="user-search">筛选</button><button class="btn btn-alt-secondary flex-grow-1" id="user-reset">重置</button></div></div>
        </div>
    </div>
    <div class="block-content p-0"><div class="table-responsive fixed-table-area"><table class="table table-hover table-vcenter mb-0"><thead><tr><th class="ps-4">ID</th><th>用户</th><th>手机号</th><th>OpenID</th><th>登录地区</th><th>登录 IP</th><th>状态</th><th>注册时间</th><th class="text-end pe-4">操作</th></tr></thead><tbody class="js-gallery" id="user-list"></tbody></table></div></div>
    <div class="block-content block-content-full border-top"><div id="user-pagination"></div></div>
</div>

<div class="modal fade" id="user-actions-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="block block-rounded block-transparent mb-0">
                <div class="block-header block-header-default user-actions-header">
                    <div class="d-flex align-items-center gap-3">
                        <img class="user-actions-avatar" id="user-actions-avatar" src="../assets/media/avatars/avatar0.jpg" alt="用户头像">
                        <div>
                            <h3 class="h5 fw-bold mb-1">用户操作面板</h3>
                            <div class="fs-sm text-muted" id="user-actions-subtitle"></div>
                        </div>
                    </div>
                    <div class="block-options">
                        <button type="button" class="btn-block-option" data-bs-dismiss="modal" aria-label="关闭">
                            <i class="fa fa-fw fa-times"></i>
                        </button>
                    </div>
                </div>
                <div class="block-content block-content-full">
                    <div class="row g-3">
                        <div class="col-6">
                            <div class="block block-rounded block-bordered h-100 mb-0">
                                <div class="block-header border-bottom">
                                    <h3 class="block-title">登录管理</h3>
                                </div>
                                <div class="list-group list-group-flush">
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="1">
                                        <span class="item item-rounded bg-warning-light text-warning me-3"><i class="fa fa-right-from-bracket"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">踢出登录</span><small class="text-muted">立即结束当前登录会话</small></span>
                                    </button>
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="5">
                                        <span class="item item-rounded bg-danger-light text-danger me-3"><i class="fa fa-user-slash"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">禁止登录</span><small class="text-muted">禁止再次登录并踢出会话</small></span>
                                    </button>
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="6">
                                        <span class="item item-rounded bg-success-light text-success me-3"><i class="fa fa-user-check"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">恢复登录</span><small class="text-muted">解除该用户的登录限制</small></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="block block-rounded block-bordered h-100 mb-0">
                                <div class="block-header border-bottom">
                                    <h3 class="block-title">数据清理</h3>
                                </div>
                                <div class="list-group list-group-flush">
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="2">
                                        <span class="item item-rounded bg-danger-light text-danger me-3"><i class="fa fa-table-cells"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">清空定制</span><small class="text-muted">删除全部用户定制规格</small></span>
                                    </button>
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="3">
                                        <span class="item item-rounded bg-danger-light text-danger me-3"><i class="fa fa-image"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">清空图片</span><small class="text-muted">删除全部保存图片及文件</small></span>
                                    </button>
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="4">
                                        <span class="item item-rounded bg-danger-light text-danger me-3"><i class="fa fa-clock-rotate-left"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">清空记录</span><small class="text-muted">删除全部用户行为记录</small></span>
                                    </button>
                                    <button type="button" class="list-group-item list-group-item-action d-flex align-items-center py-3" data-user-action="7">
                                        <span class="item item-rounded bg-danger-light text-danger me-3"><i class="fa fa-receipt"></i></span>
                                        <span class="text-start"><span class="d-block fw-semibold">清空订单</span><small class="text-muted">删除全部支付订单</small></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
