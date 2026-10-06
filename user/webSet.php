<?php $page = 'webSet'; $pageTitle = '系统设置'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded" id="system-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">系统配置</h3>
    </div>
    <div class="block-content block-content-full">
        <div class="row g-4">
            <div class="col-6"><label class="form-label" for="app-id">AppID</label><input class="form-control" id="app-id" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="app-secret">AppSecret</label><input class="form-control" id="app-secret" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="video-unit-id">激励视频广告位 ID</label><input class="form-control" id="video-unit-id" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="login-type">登录方式</label><select class="form-select" id="login-type"><option value="1">不获取手机号</option><option value="2">获取手机号</option></select></div>
        </div>
    </div>
    <div class="block-content block-content-full border-top text-end"><button type="button" class="btn btn-primary" id="system-save">保存</button></div>
</div>

<div class="block block-rounded" id="storage-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">图片存储配置</h3>
    </div>
    <div class="block-content block-content-full">
        <div class="row g-4">
            <div class="col-6"><label class="form-label" for="directory">图片存储站路径</label><input class="form-control" id="directory" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="pic-domain">图片站域名</label><input type="url" class="form-control" id="pic-domain" autocomplete="off"></div>
        </div>
    </div>
    <div class="block-content block-content-full border-top text-end"><button type="button" class="btn btn-primary" id="storage-save">保存</button></div>
</div>

<div class="block block-rounded" id="official-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">公众号配置</h3>
    </div>
    <div class="block-content block-content-full">
        <div class="row g-4">
            <div class="col-6"><label class="form-label" for="official-switch">个人中心显示横幅开关</label><select class="form-select" id="official-switch"><option value="1">显示</option><option value="2">关闭</option></select></div>
            <div class="col-6"><label class="form-label">公众号二维码图片</label><label class="official-qr-code-image-preview" for="official-qr-code-image-file"><img id="official-qr-code-image-preview" alt="公众号二维码图片"><span class="official-qr-code-image-upload-text">重新上传</span></label><input type="file" class="d-none" id="official-qr-code-image-file" accept="image/jpeg,image/png"></div>
        </div>
    </div>
    <div class="block-content block-content-full border-top text-end"><button type="button" class="btn btn-primary" id="official-save">保存</button></div>
</div>

<div class="block block-rounded" id="pay-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">支付配置</h3>
    </div>
    <div class="block-content block-content-full">
        <div class="d-flex align-items-center justify-content-between bg-body-light rounded p-3 mb-4">
            <div class="d-flex align-items-center text-nowrap" role="radiogroup" aria-label="支付方式">
                <label class="form-label mb-0 me-3">支付方式：</label>
                <div class="form-check form-check-inline mb-0 me-4"><input class="form-check-input" type="radio" name="pay-type" id="pay-type-wechat" value="1" checked><label class="form-check-label" for="pay-type-wechat">微信支付</label></div>
                <div class="form-check form-check-inline mb-0 me-0"><input class="form-check-input" type="radio" name="pay-type" id="pay-type-virtual" value="2"><label class="form-check-label" for="pay-type-virtual">虚拟支付</label></div>
            </div>
            <button type="button" class="btn btn-sm btn-alt-primary d-none" id="virtual-goods-view">查看道具列表</button>
        </div>
        <!-- 微信支付使用APIv3，商户私钥按照完整PEM多行内容保存 -->
        <div class="row g-4" id="wechat-pay-settings">
            <div class="col-6"><label class="form-label" for="merchant-id">商户号</label><input class="form-control" id="merchant-id" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="merchant-serial-number">商户证书序列号</label><input class="form-control" id="merchant-serial-number" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="api-v3-key">APIv3 密钥</label><input class="form-control" id="api-v3-key" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="pay-notify-url">支付回调地址</label><input type="url" class="form-control" id="pay-notify-url" autocomplete="off" placeholder="https://你的JAVA后端域名/"></div>
            <div class="col-12"><label class="form-label" for="merchant-private-key">商户私钥 PEM</label><textarea class="form-control font-monospace" id="merchant-private-key" rows="10" autocomplete="off" spellcheck="false" placeholder="-----BEGIN PRIVATE KEY-----"></textarea></div>
        </div>
        <div class="d-none" id="virtual-pay-settings">
            <div class="alert alert-primary py-2 px-3 mb-4 d-none" id="virtual-video-tip-alert" role="alert">
                <div class="d-flex align-items-center">
                    <i class="si si-info me-3"></i>
                    <div class="flex-grow-1">视频配置教程：<a class="alert-link" href="https://www.bilibili.com/video/BV1jwpF6HEB6/" target="_blank" rel="noopener noreferrer">https://www.bilibili.com/video/BV1jwpF6HEB6/</a></div>
                    <button type="button" class="btn-close ms-3" id="virtual-video-tip-close" aria-label="关闭"></button>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-6"><label class="form-label" for="virtual-offer-id">OfferID（支付应用 ID）</label><input class="form-control" id="virtual-offer-id" autocomplete="off"></div>
                <div class="col-6"><label class="form-label" for="virtual-pay-environment">支付环境</label><select class="form-select" id="virtual-pay-environment"><option value="1">现网环境</option><option value="2">沙箱环境</option></select></div>
                <div class="col-6"><label class="form-label" for="virtual-app-key">现网 AppKey</label><input class="form-control" id="virtual-app-key" autocomplete="off"></div>
                <div class="col-6"><label class="form-label" for="virtual-notify-url">消息推送地址</label><input type="url" class="form-control" id="virtual-notify-url" autocomplete="off" value="https://你的JAVA后端域名/pay/virtualNotify" placeholder="https://你的JAVA后端域名/pay/virtualNotify"></div>
                <div class="col-12"><label class="form-label" for="virtual-token">消息推送 Token</label><div class="input-group"><input class="form-control font-monospace" id="virtual-token" autocomplete="off" disabled><button type="button" class="btn btn-alt-primary virtual-random" data-target="#virtual-token" data-length="32">随机</button><button type="button" class="btn btn-alt-secondary virtual-copy" data-target="#virtual-token">复制</button></div></div>
                <div class="col-12"><label class="form-label" for="virtual-encoding-aes-key">消息加密密钥 EncodingAESKey</label><div class="input-group"><input class="form-control font-monospace" id="virtual-encoding-aes-key" autocomplete="off" disabled><button type="button" class="btn btn-alt-primary virtual-random" data-target="#virtual-encoding-aes-key" data-length="43">随机</button><button type="button" class="btn btn-alt-secondary virtual-copy" data-target="#virtual-encoding-aes-key">复制</button></div></div>
                <div class="col-6"><label class="form-label">消息加密方式</label><input class="form-control" value="安全模式" disabled></div>
                <div class="col-6"><label class="form-label">数据格式</label><input class="form-control" value="JSON" disabled></div>
            </div>
        </div>
    </div>
    <div class="block-content block-content-full border-top text-end"><button type="button" class="btn btn-primary" id="pay-save">保存</button></div>
</div>

<div class="modal fade" id="virtual-goods-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header"><h3 class="modal-title h5 fw-bold">虚拟支付道具说明</h3><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="关闭"></button></div>
            <div class="modal-body">
                <div class="alert alert-info mb-4">请在小程序后台「支付与交易 → 虚拟支付 → 基本配置 → 道具配置」添加以下道具</div>
                <div class="table-responsive">
                    <table class="table table-bordered table-vcenter mb-0 virtual-goods-table">
                        <thead><tr><th>道具 ID</th><th>道具名称</th><th>道具图片参考</th><th>道具价格（元）</th><th>道具类型</th><th>关联关系</th></tr></thead>
                        <tbody id="virtual-goods-list"></tbody>
                    </table>
                </div>
                <div class="block block-rounded block-bordered mt-4 mb-0">
                    <div class="block-header block-header-default"><h3 class="block-title">配置注意事项</h3></div>
                    <div class="block-content block-content-full">
                        <div class="row g-4 mb-4">
                            <div class="col-6">
                                <div class="bg-body-light rounded p-3 h-100">
                                    <ol class="virtual-goods-notes mb-0">
                                        <li>应用设置里面的下载价格必须要与小程序后台道具价格一致；以后修改了价格也要同步修改小程序那边的</li>
                                        <li>如果需要苹果手机的用户也能拉起虚拟支付，需要开通苹果支付，如下图</li>
                                    </ol>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="alert alert-warning p-3 mb-0 h-100">
                                    <p class="fw-semibold mb-2">注意：开通苹果支付后，会受到几个限制：</p>
                                    <ol class="virtual-goods-notes mb-0">
                                        <li>一旦开通，就无法关闭苹果支付</li>
                                        <li>你的价格最低只能设置1元，这是苹果的规定</li>
                                        <li>苹果订单一旦被投诉，会有99%的概率被强制退款</li>
                                        <li>苹果支付不支持沙箱环境</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                        <img class="virtual-payment-guide" src="../assets/media/virtual-payment-guide.png" alt="微信公众平台虚拟支付基本配置及苹果 IAP 开通位置">
                    </div>
                </div>
            </div>
            <div class="modal-footer"><button type="button" class="btn btn-alt-secondary" data-bs-dismiss="modal">关闭</button></div>
        </div>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
