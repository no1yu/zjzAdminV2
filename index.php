<?php

declare(strict_types=1);

$config = require __DIR__ . '/config/app.php';
?>
<!doctype html>
<html lang="zh-CN" class="dark-custom-defined">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" href="assets/media/favicons/favicon.ico" type="image/x-icon">
    <title>扫码登录 · 证件照后台</title>
    <link rel="stylesheet" href="assets/css/oneui.min.css">
    <link rel="stylesheet" href="assets/css/admin.css">
</head>
<body>
<div id="page-container">
    <main id="main-container">
        <div class="login-page-bg">
            <div class="login-enterprise-shell">
                <section class="login-enterprise-brand">
                    <div class="login-brand-main">
                        <h1>证件照<br>运营管理系统</h1>
                    </div>
                </section>
                <section class="login-enterprise-panel">
                    <div class="block block-rounded login-block mb-0">
                        <div class="block-content p-0">
                            <div class="login-panel-head">
                                <h2>管理员登录</h2>
                            </div>
                            <div class="login-version-box">
                                <span class="login-version-title">请选择唤醒登录的小程序版本</span>
                                <div class="login-version-switch" data-active="release" role="radiogroup" aria-label="小程序版本">
                                    <button type="button" class="login-version-option active" data-type="release" role="radio" aria-checked="true">
                                        正式版
                                    </button>
                                    <button type="button" class="login-version-option" data-type="trial" role="radio" aria-checked="false">
                                        体验版
                                    </button>
                                </div>
                            </div>
                            <div class="login-qr-box" id="qr-shell">
                                <div class="text-center text-muted" id="qr-loading">
                                    <i class="fa fa-circle-notch fa-spin fs-3"></i>
                                </div>
                                <img id="qr-image" alt="登录二维码" style="display:none">
                                <div class="login-qr-retry d-none" id="qr-retry">
                                    <span class="login-qr-retry-icon"><i class="fa fa-arrow-rotate-right"></i></span>
                                    <span class="login-qr-retry-title">二维码暂不可用</span>
                                    <button type="button" class="btn btn-primary" id="refresh-qr">重新获取</button>
                                </div>
                            </div>
                            <div class="login-state" id="login-status" data-state="loading">
                                <span class="login-state-dot"></span>
                                <span id="login-status-text">正在连接</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </main>
</div>
<script src="assets/js/vendor/jquery.min.js"></script>
<script src="assets/js/oneui.app.min.js"></script>
<script>document.addEventListener('DOMContentLoaded', function () { One.layout('dark_mode_off'); });</script>
<script>
$(function () {
    localStorage.removeItem('token');
    let socket = null;
    let authorized = false;
    let qrObjectUrl = '';
    let qrRequest = null;
    let loginType = 'release';
    const apiBaseUrl = <?= json_encode($config['api_base_url'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;
    const websocketUrl = <?= json_encode($config['websocket_url'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?>;

    function request(endpoint, data) {
        return $.ajax({
            url: apiBaseUrl + endpoint,
            method: 'GET',
            data: data || {}
        });
    }

    function status(text, state) {
        $('#login-status-text').text(text);
        $('#login-status').attr('data-state', state || 'loading');
    }

    function showQrRetry(text) {
        $('#qr-loading').hide();
        $('#qr-image').removeAttr('src').hide();
        $('#qr-retry').removeClass('d-none');
        status(text, 'error');
    }

    function connect(code) {
        socket = new WebSocket(websocketUrl + (websocketUrl.indexOf('?') === -1 ? '?' : '&') + 'code=' + encodeURIComponent(code));
        socket.onopen = function () {
            status('等待扫码', 'ready');
        };
        socket.onmessage = function (event) {
            const message = JSON.parse(event.data || '{}');
            if (message.type !== 'authorized') return;
            authorized = true;
            status('正在登录', 'success');
            request('admin/checkLogin', {code: code}).done(function (check) {
                if (Number(check.code) === 200 && check.data) {
                    localStorage.setItem('token', String(check.data));
                    window.location.href = 'user/dashboard.php';
                    return;
                }
                showQrRetry('登录已失效');
            }).fail(function () {
                showQrRetry('登录失败');
            });
        };
        socket.onerror = function () {
            showQrRetry('连接失败');
        };
        socket.onclose = function () {
            if (!authorized) {
                showQrRetry('连接已断开');
            }
        };
    }

    function loadQr() {
        //切换小程序版本时停止上一次二维码请求，避免旧二维码覆盖新二维码
        if (qrRequest) {
            qrRequest.abort();
            qrRequest = null;
        }
        if (socket) {
            socket.onclose = null;
            socket.close();
            socket = null;
        }
        authorized = false;
        $('#qr-retry').addClass('d-none');
        $('#qr-image').removeAttr('src').hide();

        if (qrObjectUrl) {
            URL.revokeObjectURL(qrObjectUrl);
            qrObjectUrl = '';
        }
        $('#qr-loading').show();
        status('正在连接', 'loading');
        qrRequest = $.ajax({
            url: apiBaseUrl + 'admin/login',
            method: 'GET',
            data: {type: loginType},
            xhrFields: {
                responseType: 'blob'
            }
        }).done(function (image, textStatus, xhr) {
            const code = xhr.getResponseHeader('X-Admin-Login-Code');
            if (!code || !image || !image.size) {
                showQrRetry('二维码获取失败，请稍后重试');
                return;
            }
            qrObjectUrl = URL.createObjectURL(image);
            $('#qr-image').attr('src', qrObjectUrl).show();
            $('#qr-loading').hide();
            connect(code);
        }).fail(function (xhr, statusText) {
            if (statusText === 'abort') return;
            showQrRetry('无法连接后端服务');
        }).always(function () {
            qrRequest = null;
        });
    }

    $('.login-version-option').on('click', function () {
        if ($(this).hasClass('active')) return;
        loginType = String($(this).data('type'));
        $('.login-version-switch').attr('data-active', loginType);
        $('.login-version-option').removeClass('active').attr('aria-checked', 'false');
        $(this).addClass('active').attr('aria-checked', 'true');
        loadQr();
    });
    $('#refresh-qr').on('click', loadQr);
    loadQr();
});
</script>
</body>
</html>
