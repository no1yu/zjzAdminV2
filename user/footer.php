<?php if ($partial) { return; } ?>
        </div>
    </main>
</div>

<div class="modal fade" id="user-detail-modal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><h3 class="modal-title h5 fw-bold">用户详情</h3><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body" id="user-detail-body"></div></div></div></div>
<div class="modal fade" id="confirm-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header border-0 pb-0"><div class="modal-icon bg-danger-light text-danger"><i class="fa fa-triangle-exclamation"></i></div><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body pt-3"><h3 class="h5 fw-bold" id="confirm-title">确认操作</h3><p class="text-muted mb-0" id="confirm-message"></p></div><div class="modal-footer border-0"><button type="button" class="btn btn-alt-secondary" data-bs-dismiss="modal">取消</button><button type="button" class="btn btn-danger" id="confirm-submit">确认执行</button></div></div></div>
</div>
<div class="toast-container position-fixed top-0 end-0 p-3" id="toast-container"></div>

<script src="../assets/js/vendor/jquery.min.js"></script>
<script src="../assets/js/oneui.app.min.js"></script>
<script src="../assets/js/vendor/jquery.magnific-popup.min.js"></script>
<script>document.addEventListener('DOMContentLoaded', function () { One.layout('dark_mode_off'); });</script>
<script src="../assets/js/vendor/chart.umd.min.js"></script>
<script src="../assets/js/vendor/sortable.min.js"></script>
<script src="../assets/js/vendor/jquery-jvectormap.min.js"></script>
<script src="../assets/js/vendor/jquery-jvectormap-cn-mill-en.js"></script>
<script src="../assets/js/vendor/flatpickr.min.js"></script>
<script src="../assets/js/vendor/flatpickr.zh.js"></script>
<script src="../assets/js/admin.js"></script>
</body>
</html>
