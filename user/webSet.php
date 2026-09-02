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
        <h3 class="block-title">微信支付配置</h3>
    </div>
    <div class="block-content block-content-full">
        <!-- 微信支付使用APIv3，商户私钥按照完整PEM多行内容保存 -->
        <div class="row g-4">
            <div class="col-6"><label class="form-label" for="merchant-id">商户号</label><input class="form-control" id="merchant-id" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="merchant-serial-number">商户证书序列号</label><input class="form-control" id="merchant-serial-number" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="api-v3-key">APIv3 密钥</label><input class="form-control" id="api-v3-key" autocomplete="off"></div>
            <div class="col-6"><label class="form-label" for="pay-notify-url">支付回调地址</label><input type="url" class="form-control" id="pay-notify-url" autocomplete="off" placeholder="https://你的JAVA后端域名/"></div>
            <div class="col-12"><label class="form-label" for="merchant-private-key">商户私钥 PEM</label><textarea class="form-control font-monospace" id="merchant-private-key" rows="10" autocomplete="off" spellcheck="false" placeholder="-----BEGIN PRIVATE KEY-----"></textarea></div>
        </div>
    </div>
    <div class="block-content block-content-full border-top text-end"><button type="button" class="btn btn-primary" id="pay-save">保存</button></div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
