<?php $page = 'functionFeedback'; $pageTitle = '功能反馈'; require __DIR__ . '/header.php'; ?>
<div class="block block-rounded overflow-hidden mb-4">
    <div class="bg-primary-dark">
        <div class="block-content block-content-full py-4">
            <div class="row align-items-center g-4">
                <div class="col-8">
                    <h2 class="h3 fw-bold text-white mb-3">让我们把产品做得更好</h2>
                    <p class="text-white-75 mb-2">无论您遇到了 Bug、希望增加新的功能，还是发现了其他小程序中值得借鉴的设计，都欢迎提交给开发团队</p>
                    <p class="text-white-75 mb-0">开发团队会在每周五认真查看每一条反馈，并通过您留下的联系方式回复处理情况</p>
                </div>
                <div class="col-4">
                    <div class="rounded bg-black-10 p-3">
                        <div class="fw-semibold text-white mb-3"><i class="fa fa-headset me-2"></i>直接联系开发团队</div>
                        <div class="d-flex justify-content-between text-white-75 mb-2"><span>QQ</span><span class="fw-semibold text-white">24677102</span></div>
                        <div class="d-flex justify-content-between text-white-75 mb-2"><span>微信</span><span class="fw-semibold text-white">webxuan</span></div>
                        <div class="d-flex justify-content-between text-white-75"><span>用户交流 QQ 群</span><span class="fw-semibold text-white">151601935</span></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="block block-rounded" id="function-feedback-block">
    <div class="block-header block-header-default">
        <h3 class="block-title">填写反馈</h3>
    </div>
    <div class="block-content block-content-full">
        <form id="function-feedback-form" class="row g-4">
            <div class="col-7">
                <label class="form-label" for="function-feedback-title">反馈标题</label>
                <input type="text" class="form-control" id="function-feedback-title" maxlength="255" placeholder="用一句话概括您要反馈的内容" required>
            </div>
            <div class="col-5">
                <label class="form-label" for="function-feedback-contact">联系方式</label>
                <input type="text" class="form-control" id="function-feedback-contact" maxlength="255" placeholder="QQ、微信、手机号或邮箱" required>
            </div>
            <div class="col-12">
                <label class="form-label" for="function-feedback-content">详细内容</label>
                <textarea class="form-control" id="function-feedback-content" rows="9" maxlength="5000" placeholder="请详细说明遇到的问题、操作过程、期望效果，或您希望增加的具体功能" required></textarea>
                <div class="form-text">如果文字无法准确表达，可以通过上方联系方式直接联系开发团队</div>
            </div>
        </form>
    </div>
    <div class="block-content block-content-full border-top text-end">
        <button type="button" class="btn btn-primary px-4" id="function-feedback-submit">提交反馈</button>
    </div>
</div>
<?php require __DIR__ . '/footer.php'; ?>
