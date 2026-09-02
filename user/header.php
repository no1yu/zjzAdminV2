<?php

declare(strict_types=1);

$config = require dirname(__DIR__) . '/config/app.php';
$partial = isset($_GET['partial']) && $_GET['partial'] === '1';
$meta = ['title' => $pageTitle];
if ($partial) {
    return;
}
?>
<!doctype html>
<html lang="zh-CN" class="dark-custom-defined">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="icon" href="../assets/media/favicons/favicon.ico" type="image/x-icon">
    <meta name="api-base-url" content="<?= htmlspecialchars((string) $config['api_base_url'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
    <script>if (!localStorage.getItem('token')) window.location.replace('../index.php');</script>
    <title><?= htmlspecialchars((string) $meta['title'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?> · 证件照后台</title>
    <link rel="stylesheet" href="../assets/css/flatpickr.min.css">
    <link rel="stylesheet" href="../assets/css/magnific-popup.css">
    <link rel="stylesheet" href="../assets/css/oneui.min.css">
    <link rel="stylesheet" href="../assets/css/jquery-jvectormap.css">
    <link rel="stylesheet" href="../assets/css/admin.css">
</head>
<body data-page="<?= htmlspecialchars((string) $page, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?>">
<div id="page-container" class="sidebar-o sidebar-dark side-scroll page-header-fixed main-content-boxed">
    <nav id="sidebar" aria-label="主导航">
        <div class="content-header sidebar-brand-header">
            <a class="fw-semibold text-dual d-flex align-items-center gap-2" href="dashboard.php">
                <span class="brand-logo"><i class="fa fa-camera-retro"></i></span>
                <span class="smini-hide fs-5">证件照后台</span>
            </a>
        </div>
        <div class="js-sidebar-scroll">
            <div class="content-side">
                <ul class="nav-main">
                    <li class="nav-main-heading">工作台</li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'dashboard' ? 'active' : '' ?>" data-page="dashboard" href="dashboard.php"><i class="nav-main-link-icon si si-speedometer"></i><span class="nav-main-link-name">控制台</span></a></li>
                    <li class="nav-main-heading">数据统计</li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'statistics' ? 'active' : '' ?>" data-page="statistics" href="statistics.php"><i class="nav-main-link-icon si si-chart"></i><span class="nav-main-link-name">能力统计</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'userMap' ? 'active' : '' ?>" data-page="userMap" href="userMap.php"><i class="nav-main-link-icon si si-map"></i><span class="nav-main-link-name">用户地图</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'userRecord' ? 'active' : '' ?>" data-page="userRecord" href="userRecord.php"><i class="nav-main-link-icon si si-clock"></i><span class="nav-main-link-name">行为记录</span></a></li>
                    <li class="nav-main-heading">数据管理</li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'item' ? 'active' : '' ?>" data-page="item" href="item.php"><i class="nav-main-link-icon si si-size-fullscreen"></i><span class="nav-main-link-name">证件规格</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'custom' ? 'active' : '' ?>" data-page="custom" href="custom.php"><i class="nav-main-link-icon si si-grid"></i><span class="nav-main-link-name">用户定制</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'photo' ? 'active' : '' ?>" data-page="photo" href="photo.php"><i class="nav-main-link-icon si si-picture"></i><span class="nav-main-link-name">成片管理</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'payOrder' ? 'active' : '' ?>" data-page="payOrder" href="payOrder.php"><i class="nav-main-link-icon si si-wallet"></i><span class="nav-main-link-name">订单管理</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'user' ? 'active' : '' ?>" data-page="user" href="user.php"><i class="nav-main-link-icon si si-users"></i><span class="nav-main-link-name">用户管理</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'feedback' ? 'active' : '' ?>" data-page="feedback" href="feedback.php"><i class="nav-main-link-icon si si-bubble"></i><span class="nav-main-link-name">意见管理</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'webTask' ? 'active' : '' ?>" data-page="webTask" href="webTask.php"><i class="nav-main-link-icon si si-calendar"></i><span class="nav-main-link-name">定时日志</span></a></li>
                    <li class="nav-main-heading">系统配置</li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'webSet' ? 'active' : '' ?>" data-page="webSet" href="webSet.php"><i class="nav-main-link-icon si si-settings"></i><span class="nav-main-link-name">系统设置</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'webSetModel' ? 'active' : '' ?>" data-page="webSetModel" href="webSetModel.php"><i class="nav-main-link-icon si si-layers"></i><span class="nav-main-link-name">模型设置</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'appSet' ? 'active' : '' ?>" data-page="appSet" href="appSet.php"><i class="nav-main-link-icon si si-rocket"></i><span class="nav-main-link-name">应用设置</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'clothesSet' ? 'active' : '' ?>" data-page="clothesSet" href="clothesSet.php"><i class="nav-main-link-icon fa fa-shirt"></i><span class="nav-main-link-name">换装设置</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'webSetBeauty' ? 'active' : '' ?>" data-page="webSetBeauty" href="webSetBeauty.php"><i class="nav-main-link-icon si si-magic-wand"></i><span class="nav-main-link-name">美颜设置</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'helpSet' ? 'active' : '' ?>" data-page="helpSet" href="helpSet.php"><i class="nav-main-link-icon si si-question"></i><span class="nav-main-link-name">问题设置</span></a></li>
                    <li class="nav-main-item"><a class="nav-main-link js-page-link <?= $page === 'functionFeedback' ? 'active' : '' ?>" data-page="functionFeedback" href="functionFeedback.php"><i class="nav-main-link-icon si si-envelope"></i><span class="nav-main-link-name">功能反馈</span></a></li>
                    <li class="nav-main-item mt-3"><button type="button" class="nav-main-link nav-main-link-button" id="logout-btn"><i class="nav-main-link-icon si si-logout"></i><span class="nav-main-link-name">退出登录</span></button></li>
                </ul>
            </div>
        </div>
    </nav>
    <header id="page-header">
        <div class="content-header">
            <div class="d-flex align-items-center gap-2">
                <div class="header-title-wrap"><div class="fw-semibold text-dark" id="current-page-title"><?= htmlspecialchars((string) $meta['title'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?></div></div>
            </div>
        </div>
    </header>
    <main id="main-container">
        <div class="content" id="page-content">
