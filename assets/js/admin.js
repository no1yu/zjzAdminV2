(function ($) {
  'use strict';

  let activePage = document.body.dataset.page || 'dashboard';
  const apiBaseUrl = $('meta[name="api-base-url"]').attr('content');
  const adminToken = localStorage.getItem('token');
  if (!adminToken) {
    window.location.replace('../index.php');
    return;
  }
  const pageTitles = {dashboard: '控制台', item: '证件规格', custom: '用户定制', photo: '成片管理', payOrder: '订单管理', userRecord: '行为记录', statistics: '能力统计', user: '用户管理', feedback: '意见管理', userMap: '用户地图', appSet: '应用设置', webSetModel: '模型设置', clothesSet: '换装设置', webSetBeauty: '美颜设置', helpSet: '问题设置', functionFeedback: '功能反馈', webSet: '系统设置', webTask: '定时日志'};
  const serviceConnectionMessage = '服务连接失败，请检查后重试';
  let confirmHandler = null;
  let activeCharts = [];
  let activeSortables = [];
  let activeVectorMaps = [];
  let activeFlatpickrs = [];
  let activeApiRequests = [];
  let navigationRequest = null;
  history.scrollRestoration = 'manual';

  function escapeHtml(value) {
    return String(value === null || value === undefined ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function api(endpoint, data, json) {
    const request = {
      url: apiBaseUrl + endpoint,
      method: 'POST',
      headers: {token: adminToken},
      data: data || {}
    };
    if (data instanceof FormData) {
      request.contentType = false;
      request.processData = false;
    } else if (json) {
      request.contentType = 'application/json; charset=utf-8';
      request.data = JSON.stringify(data || {});
    }
    const xhr = $.ajax(request);
    activeApiRequests.push(xhr);
    xhr.always(function () {
      const index = activeApiRequests.indexOf(xhr);
      if (index !== -1) activeApiRequests.splice(index, 1);
    });
    return xhr.then(function (response) {
      if (response.code === 200) return response;
      if (response.code === 500) {
        localStorage.removeItem('token');
        window.location.replace('../index.php');
        return $.Deferred().reject(response).promise();
      }
      toast(response.data || response.msg || '操作失败', 'danger');
      return $.Deferred().reject(response).promise();
    }, function (xhr, status) {
      if (status === 'abort') {
        return $.Deferred().reject({aborted: true}).promise();
      }
      if (xhr.status === 500) {
        localStorage.removeItem('token');
        window.location.replace('../index.php');
        return $.Deferred().reject(xhr).promise();
      }
      if (showServiceConnectionError()) toast(serviceConnectionMessage, 'danger');
      return $.Deferred().reject(xhr).promise();
    });
  }

  function toast(message, type) {
    const color = type === 'danger' ? 'danger' : type === 'warning' ? 'warning' : 'success';
    const icon = color === 'danger' ? 'triangle-exclamation' : color === 'warning' ? 'circle-info' : 'circle-check';
    const id = 'toast-' + Date.now();
    $('#toast-container').append('<div id="' + id + '" class="toast border-0 shadow" role="alert"><div class="toast-header bg-' + color + '-light text-' + color + '"><i class="fa fa-' + icon + ' me-2"></i><strong class="me-auto">系统提示</strong><button type="button" class="btn-close" data-bs-dismiss="toast"></button></div><div class="toast-body">' + escapeHtml(message) + '</div></div>');
    const element = document.getElementById(id);
    const instance = new bootstrap.Toast(element, {delay: 5000});
    element.addEventListener('hidden.bs.toast', function () { element.remove(); });
    instance.show();
  }

  function confirmDialog(message, title, handler) {
    $('#confirm-title').text(title || '确认操作');
    $('#confirm-message').text(message || '此操作无法撤销，是否继续？');
    confirmHandler = handler;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('confirm-modal')).show();
  }

  function emptyRow(columns, text) {
    return '<tr><td colspan="' + columns + '" class="empty-state"><i class="fa fa-inbox"></i>' + escapeHtml(text || '暂无数据') + '</td></tr>';
  }

  function loadError(message, retryClass, attributes) {
    return '<div class="text-center py-5 text-muted"><i class="fa fa-circle-exclamation fs-3 text-warning"></i><div class="mt-3 mb-3">' + escapeHtml(message || serviceConnectionMessage) + '</div><button type="button" class="btn btn-sm btn-alt-primary ' + escapeHtml(retryClass || 'service-connection-retry') + '" ' + (attributes || '') + '><i class="fa fa-rotate-right me-1"></i>重新加载</button></div>';
  }

  function showServiceConnectionError() {
    const content = $('#page-content');
    if (!content.length || document.getElementById('service-connection-error')) return false;
    content.children().hide();
    content.append('<div class="block block-rounded" id="service-connection-error">' + loadError(serviceConnectionMessage, 'service-connection-retry') + '</div>');
    return true;
  }

  function setBlockLoading(selector, loading) {
    if (!document.querySelector(selector)) return;
    One.block(loading ? 'state_loading' : 'state_normal', selector);
  }

  function reloadAfterDelete(state, load) {
    if (state.page > 1 && Array.isArray(state.records) && state.records.length <= 1) {
      state.page -= 1;
    }
    load();
  }

  function createDateRangePicker(selector) {
    const picker = flatpickr(selector, {
      locale: Object.assign({}, flatpickr.l10ns.zh, {rangeSeparator: ' - '}),
      mode: 'range',
      showMonths: 2,
      dateFormat: 'Y-m-d',
      disableMobile: true
    });
    activeFlatpickrs.push(picker);
    return picker;
  }

  function getDateRange(picker) {
    const dates = picker.selectedDates;
    const startTime = dates.length > 0 ? picker.formatDate(dates[0], 'Y-m-d') : '';
    const endTime = dates.length > 1 ? picker.formatDate(dates[1], 'Y-m-d') : startTime;
    return {startTime: startTime, endTime: endTime};
  }

  function loadAppSetOptions(selector) {
    api('admin/getAppSetOptions').done(function (res) {
      const options = res.data.map(function (item) {
        return '<option value="' + item.id + '">' + escapeHtml(item.name || '') + '</option>';
      }).join('');
      $(selector).html('<option value="0">全部</option>' + options);
    });
  }

  function disposeTooltips(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(function (element) {
      const instance = bootstrap.Tooltip.getInstance(element);
      if (instance) instance.dispose();
    });
    document.querySelectorAll('.tooltip').forEach(function (element) { element.remove(); });
  }

  function releaseModalFocus(element) {
    const focusedElement = document.activeElement;
    if (focusedElement && element.contains(focusedElement)) focusedElement.blur();
  }

  function updateOverflowTooltips() {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;
    const nestedSelectors = '.order-number-cell code, .record-error-tip, .feedback-content';
    pageContent.querySelectorAll('.fixed-table-area td, ' + nestedSelectors).forEach(function (element) {
      if (element.matches('td') && element.querySelector(nestedSelectors)) return;
      const text = element.textContent.trim();
      const truncated = text && element.scrollWidth > element.clientWidth;
      if (!truncated) {
        if (element.classList.contains('js-overflow-tooltip')) {
          const instance = bootstrap.Tooltip.getInstance(element);
          if (instance) instance.dispose();
          element.classList.remove('js-overflow-tooltip', 'js-bs-tooltip-enabled');
          element.removeAttribute('data-bs-toggle');
          element.removeAttribute('data-bs-placement');
          element.removeAttribute('title');
          element.removeAttribute('data-bs-original-title');
        }
        return;
      }
      element.classList.add('js-overflow-tooltip');
      element.setAttribute('data-bs-toggle', 'tooltip');
      element.setAttribute('data-bs-placement', 'top');
      element.setAttribute('title', text);
    });
    One.helpers('bs-tooltip');
  }

  function teardownPageUi() {
    const requests = activeApiRequests.slice();
    activeApiRequests = [];
    requests.forEach(function (request) {
      if (request && request.readyState !== 4) request.abort();
    });

    activeCharts.forEach(function (chart) {
      try { chart.destroy(); } catch (error) { /* 已销毁的图表无需重复处理 */ }
    });
    activeCharts = [];

    activeSortables.forEach(function (sortable) {
      try { sortable.destroy(); } catch (error) { /* 已销毁的排序实例无需重复处理 */ }
    });
    activeSortables = [];

    activeVectorMaps.forEach(function (map) {
      try { map.remove(); } catch (error) { /* 已销毁的地图无需重复处理 */ }
    });
    activeVectorMaps = [];

    activeFlatpickrs.forEach(function (picker) {
      try { picker.destroy(); } catch (error) { /* 已销毁的日期组件无需重复处理 */ }
    });
    activeFlatpickrs = [];

    if ($.magnificPopup) $.magnificPopup.close();
    disposeTooltips(document);
    document.querySelectorAll('.modal').forEach(function (element) {
      releaseModalFocus(element);
      const instance = bootstrap.Modal.getInstance(element);
      if (instance) {
        try { instance.dispose(); } catch (error) { /* 后续统一清理残留状态 */ }
      }
      element.classList.remove('show');
      element.style.removeProperty('display');
      element.removeAttribute('aria-modal');
      element.removeAttribute('role');
      element.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.modal-backdrop').forEach(function (element) { element.remove(); });
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
    confirmHandler = null;
  }

  function renderPager(selector, current, size, total, onChange) {
    const pages = Math.max(1, Math.ceil(total / size));
    const pageNo = Math.min(Math.max(1, current), pages);
    let buttons = '';
    const start = Math.max(1, pageNo - 2);
    const end = Math.min(pages, start + 4);
    for (let i = start; i <= end; i += 1) {
      buttons += '<button class="btn btn-sm ' + (i === pageNo ? 'btn-primary' : 'btn-alt-secondary') + '" data-page="' + i + '">' + i + '</button>';
    }
    $(selector).html('<div class="pager"><div class="pager-meta">第 ' + pageNo + ' / ' + pages + ' 页，共 ' + total + ' 条</div><div class="pager-actions"><button class="btn btn-sm btn-alt-secondary" data-page="' + (pageNo - 1) + '" ' + (pageNo <= 1 ? 'disabled' : '') + '><i class="fa fa-angle-left"></i></button>' + buttons + '<button class="btn btn-sm btn-alt-secondary" data-page="' + (pageNo + 1) + '" ' + (pageNo >= pages ? 'disabled' : '') + '><i class="fa fa-angle-right"></i></button></div></div>');
    $(selector).off('click', '[data-page]').on('click', '[data-page]', function () {
      const next = Number($(this).data('page'));
      if (next >= 1 && next <= pages && next !== pageNo) onChange(next);
    });
  }

  function safeImage(url) {
    return url ? escapeHtml(url) : 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22320%22%20height%3D%22240%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%23eef0f4%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%23949aa6%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E';
  }

  function safeAvatar(url) {
    return url ? escapeHtml(url) : '../assets/media/avatars/avatar0.jpg';
  }

  function userIdButton(id) {
    return '<button type="button" class="btn btn-link p-0 fw-semibold align-baseline js-user-detail" data-user-id="' + id + '">' + escapeHtml(id) + '</button>';
  }

  function openUserDetail(id) {
    const details = bootstrap.Modal.getOrCreateInstance(document.getElementById('user-detail-modal'));
    $('#user-detail-body').html('<div class="text-center py-5 text-muted"><i class="fa fa-circle-notch fa-spin me-2"></i>加载中…</div>');
    details.show();
    api('admin/getUserSummary', {userId: id}).done(function (res) {
      const data = res.data;
      const user = data.user;
      const recent = (data.recentRecords || []).map(function (item) { return '<tr><td>' + escapeHtml(item.id) + '</td><td>' + escapeHtml(item.name || '-') + '</td><td>' + escapeHtml(item.appId) + '</td><td>' + userIdButton(item.userId) + '</td><td>' + escapeHtml(item.createTime || '-') + '</td></tr>'; }).join('');
      $('#user-detail-body').html('<div class="profile-hero"><img src="' + safeAvatar(user.avatarUrl) + '" alt="用户头像"><div><div class="h4 fw-bold mb-1">' + escapeHtml(user.nickname || '微信用户') + '</div><div class="mb-1">用户 ' + escapeHtml(user.id) + ' · ' + (user.status === 2 ? '禁止登录' : '正常') + '</div><div class="openid">' + escapeHtml(user.openid || '-') + '</div><div class="profile-login-meta"><span><i class="fa fa-location-dot"></i>' + escapeHtml(user.city || '未知地区') + '</span><span><i class="fa fa-network-wired"></i>' + escapeHtml(user.ip || '未知IP') + '</span></div></div></div><div class="summary-grid"><div class="summary-box"><strong>' + data.customCount + '</strong><span>定制规格</span></div><div class="summary-box"><strong>' + data.photoCount + '</strong><span>保存成片</span></div><div class="summary-box"><strong>' + data.recordCount + '</strong><span>行为记录</span></div></div><h4 class="h6 fw-bold mt-4">最近操作</h4><div class="table-responsive"><table class="table table-sm table-vcenter"><thead><tr><th>ID</th><th>名称</th><th>应用ID</th><th>用户ID</th><th>请求时间</th></tr></thead><tbody>' + (recent || emptyRow(5, '暂无最近操作')) + '</tbody></table></div>');
    }).fail(function (error) {
      if (error && error.aborted) return;
      $('#user-detail-body').html(loadError(serviceConnectionMessage, 'js-retry-user-detail', 'data-user-id="' + id + '"'));
    });
  }

  function initDashboard() {
    ['#stat-today-block', '#stat-user-block', '#stat-order-block', '#trend-block'].forEach(function (selector) { setBlockLoading(selector, true); });
    api('admin/adminIndex').done(function (res) {
      if (activePage !== 'dashboard') return;
      const index = res.data;
      $('#metric-today').text(index.makeNum || 0);
      $('#metric-total').text(index.makeTotal || 0);
      $('#metric-users-today').text(index.userNum || 0);
      $('#metric-users-total').text(index.userTotal || 0);
      $('#metric-orders').text(index.orderNum || 0);

      const chartData = index.chartDataVo || {time: [], data: []};
      activeCharts.push(new Chart(document.getElementById('trend-chart'), {
        type: 'line',
        data: {labels: chartData.time || [], datasets: [{label: '图片操作', data: chartData.data || [], borderColor: '#4c78dd', backgroundColor: 'rgba(76,120,221,.1)', fill: true, tension: .32, borderWidth: 2, pointRadius: 3, pointBackgroundColor: '#fff', pointBorderWidth: 2}]},
        options: {maintainAspectRatio: false, plugins: {legend: {display: false}}, scales: {x: {grid: {display: false}}, y: {beginAtZero: true, ticks: {precision: 0}}}}
      }));
    }).always(function () {
      ['#stat-today-block', '#stat-user-block', '#stat-order-block', '#trend-block'].forEach(function (selector) { setBlockLoading(selector, false); });
    });

    setBlockLoading('#stat-image-block', true);
    setBlockLoading('#ability-block', true);
    api('admin/getApplicationCount').done(function (res) {
      if (activePage !== 'dashboard') return;
      const data = res.data;
      const applications = data.applications;
      $('#metric-images').text(data.totalCount);
      activeCharts.push(new Chart(document.getElementById('ability-chart'), {
        type: 'doughnut',
        data: {labels: applications.map(function (item) { return item.name; }), datasets: [{data: applications.map(function (item) { return item.useCount; }), backgroundColor: ['#4c78dd','#46a06f','#e5a03c','#3fa4bd','#7a8797','#d56868','#738b4b','#23969a','#b6723d','#63758a','#45845d'], borderWidth: 0}]},
        options: {maintainAspectRatio: false, cutout: '68%', plugins: {legend: {position: 'bottom', labels: {boxWidth: 10, boxHeight: 10}}}}
      }));
    }).always(function () { setBlockLoading('#stat-image-block', false); setBlockLoading('#ability-block', false); });

    setBlockLoading('#recent-record-block', true);
    api('admin/getUserRecordPage', {pageNum: 1, pageSize: 10, userId: 0, appId: 0, status: 0, startTime: '', endTime: ''}).done(function (res) {
      const recordRows = res.data.records.map(function (item) {
        return '<tr><td class="ps-4">' + escapeHtml(item.id) + '</td><td>' + escapeHtml(item.name || '-') + '</td><td>' + escapeHtml(item.appId) + '</td><td>' + userIdButton(item.userId) + '</td><td><span class="fs-sm">' + escapeHtml(item.createTime || '-') + '</span></td></tr>';
      }).join('');
      $('#recent-records').html(recordRows || emptyRow(5, '暂无最新动态'));
    }).always(function () { setBlockLoading('#recent-record-block', false); });

    setBlockLoading('#recent-user-block', true);
    api('admin/getUserPage', {pageNum: 1, pageSize: 10, userId: 0, name: '', startTime: '', endTime: ''}).done(function (res) {
      const userRows = res.data.records.map(function (user) {
        return '<div class="user-list-item"><a class="img-link img-link-zoom-in img-lightbox" href="' + safeAvatar(user.avatarUrl) + '"><img src="' + safeAvatar(user.avatarUrl) + '" alt="用户头像"></a><div class="fw-semibold">' + escapeHtml(user.nickname || '微信用户') + '<span class="fw-normal text-muted">（ID:</span>' + userIdButton(user.id) + '<span class="fw-normal text-muted">）</span></div><div class="ms-auto fs-xs text-muted">' + escapeHtml(user.createTime || '') + '</div></div>';
      }).join('');
      $('#recent-users').html(userRows || '<div class="text-center py-5 text-muted">暂无用户</div>');
    }).always(function () { setBlockLoading('#recent-user-block', false); });
  }

  function initItem() {
    const state = {page: 1, size: 10, records: []};
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('item-modal'));
    function load() {
      setBlockLoading('#item-block', true);
      api('admin/getItemPage', {pageNum: state.page, pageSize: state.size, name: $.trim($('#item-name').val()), status: Number($('#item-status').val())}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        const rows = state.records.map(function (item) {
          const category = item.category;
          const names = {1: '常用寸照', 2: '各类签证', 3: '各类证件'};
          const disabled = item.status === 2;
          return '<tr><td class="ps-4">' + escapeHtml(item.id) + '</td><td><div class="spec-main">' + escapeHtml(item.name) + '</div></td><td>' + escapeHtml(item.widthPx) + ' × ' + escapeHtml(item.heightPx) + ' px</td><td>' + escapeHtml(item.widthMm) + ' × ' + escapeHtml(item.heightMm) + ' mm</td><td>' + escapeHtml(item.dpi || 300) + '</td><td><span class="category-badge category-' + category + '">' + (names[category] || '未分类') + '</span></td><td><span class="status-badge ' + (disabled ? 'status-disabled' : 'status-normal') + '">' + (disabled ? '关闭' : '开启') + '</span></td><td class="pe-4"><div class="table-actions"><button class="btn btn-sm btn-alt-primary item-edit" data-id="' + item.id + '"><i class="fa fa-pen"></i></button><button class="btn btn-sm btn-alt-danger item-delete" data-id="' + item.id + '"><i class="fa fa-trash"></i></button></div></td></tr>';
        }).join('');
        $('#item-list').html(rows || emptyRow(8, '没有找到符合条件的规格'));
        renderPager('#item-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#item-block', false); });
    }
    function open(item) {
      $('#item-modal-title').text(item ? '编辑证件规格' : '新增证件规格');
      $('#item-id').val(item ? item.id : ''); $('#item-form-name').val(item ? item.name : '');
      $('#item-width-px').val(item ? item.widthPx : ''); $('#item-height-px').val(item ? item.heightPx : ''); $('#item-width-mm').val(item ? item.widthMm : ''); $('#item-height-mm').val(item ? item.heightMm : '');
      $('#item-category').val(item ? item.category : 1); $('#item-dpi').val(item ? item.dpi : 300); $('#item-icon').val(item ? item.icon : 1); $('#item-form-status').val(item ? item.status : 1); modal.show();
    }
    $('#item-search').on('click', function () { state.page = 1; load(); });
    $('#item-reset').on('click', function () { $('#item-name').val(''); $('#item-status').val('0'); state.page = 1; load(); });
    $('#item-add').on('click', function () { open(null); });
    $('#item-sync').on('click', function () {
      const button = $(this);
      button.prop('disabled', true).text('同步中...');
      api('admin/syncItem').done(function (res) {
        const data = res.data;
        toast('同步完成：新增' + data.insertCount + '条，更新' + data.updateCount + '条，删除' + data.deleteCount + '条，自建规格保留' + data.customCount + '条');
        state.page = 1;
        load();
      }).always(function () {
        button.prop('disabled', false).text('同步规格');
      });
    });
    $('#item-list').on('click', '.item-edit', function () { const id = Number($(this).data('id')); open(state.records.find(function (item) { return item.id === id; })); });
    $('#item-list').on('click', '.item-delete', function () { const id = Number($(this).data('id')); confirmDialog('删除后小程序将不再展示该规格，确定继续吗？', '删除证件规格', function () { api('admin/deleteItem', {id: id}).done(function (res) { toast(res.data || '删除成功'); reloadAfterDelete(state, load); }); }); });
    $('#item-save').on('click', function () {
      if (!document.getElementById('item-form').reportValidity()) return;
      const data = {id: $('#item-id').val() ? Number($('#item-id').val()) : null, name: $.trim($('#item-form-name').val()), widthPx: Number($('#item-width-px').val()), heightPx: Number($('#item-height-px').val()), widthMm: Number($('#item-width-mm').val()), heightMm: Number($('#item-height-mm').val()), category: Number($('#item-category').val()), dpi: Number($('#item-dpi').val()), icon: Number($('#item-icon').val()), status: Number($('#item-form-status').val())};
      api('admin/saveItem', data, true).done(function () { modal.hide(); toast('规格保存成功'); load(); });
    });
    load();
  }

  function initCustom() {
    const state = {page: 1, size: 10, records: []};
    const datePicker = createDateRangePicker('#custom-create-time');
    function load() {
      setBlockLoading('#custom-block', true);
      const dateRange = getDateRange(datePicker);
      api('admin/getCustomPage', {pageNum: state.page, pageSize: state.size, userId: Number($('#custom-user-id').val() || 0), startTime: dateRange.startTime, endTime: dateRange.endTime}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        const rows = state.records.map(function (item) { return '<tr><td class="ps-4">' + escapeHtml(item.id) + '</td><td>' + userIdButton(item.userId) + '</td><td><div class="spec-main">' + escapeHtml(item.name) + '</div></td><td>' + escapeHtml(item.widthPx) + ' × ' + escapeHtml(item.heightPx) + ' px</td><td>' + escapeHtml(item.widthMm) + ' × ' + escapeHtml(item.heightMm) + ' mm</td><td>' + escapeHtml(item.dpi) + '</td><td>' + escapeHtml(item.createTime || '-') + '</td><td class="pe-4"><div class="table-actions"><button class="btn btn-sm btn-alt-danger custom-delete" data-id="' + item.id + '"><i class="fa fa-trash"></i></button></div></td></tr>'; }).join('');
        $('#custom-list').html(rows || emptyRow(8, '暂无用户定制规格'));
        renderPager('#custom-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#custom-block', false); });
    }
    $('#custom-search').on('click', function () { state.page = 1; load(); });
    $('#custom-reset').on('click', function () { $('#custom-user-id').val(''); datePicker.clear(); state.page = 1; load(); });
    $('#custom-list').on('click', '.custom-delete', function () { const id = Number($(this).data('id')); confirmDialog('该用户的这条定制规格将被永久删除', '删除定制规格', function () { api('admin/deleteCustom', {id: id}).done(function (res) { toast(res.data || '删除成功'); reloadAfterDelete(state, load); }); }); });
    load();
  }

  function initPhoto() {
    const state = {page: 1, size: 10, records: []};
    const datePicker = createDateRangePicker('#photo-create-time');
    const details = bootstrap.Modal.getOrCreateInstance(document.getElementById('photo-detail-modal'));
    const clothesCategoryMap = {0: '无', 1: '男装', 2: '女装', 3: '儿童装'};
    const downloadStatusMap = {1: '1（未解锁）', 2: '2（预览照或探索成片已解锁）', 3: '3（智能证件照高清已解锁）'};
    const backgroundRenderMap = {0: '0（纯色）', 1: '1（上下渐变）', 2: '2（中心渐变）'};
    function clothesText(photo) {
      const category = (photo.clothesCategory || 0);
      if (category === 0) return clothesCategoryMap[0];
      return (clothesCategoryMap[category] || '未知分类') + ' ' + escapeHtml(photo.clothesId || '-');
    }
    function getPhotoExpireTime(photo) {
      if (photo.downloadStatus !== 1) return '永久有效';
      const createTime = flatpickr.parseDate(photo.createTime, 'Y-m-d H:i:S');
      createTime.setDate(createTime.getDate() + 7);
      const expireTime = new Date(createTime.getFullYear(), createTime.getMonth(), createTime.getDate(), 2, 0, 0);
      if (expireTime <= createTime) expireTime.setDate(expireTime.getDate() + 1);
      return flatpickr.formatDate(expireTime, 'Y-m-d H:i:S');
    }
    function load() {
      setBlockLoading('#photo-block', true);
      const dateRange = getDateRange(datePicker);
      api('admin/getPhotoPage', {pageNum: state.page, pageSize: state.size, userId: Number($('#photo-user-id').val() || 0), name: $.trim($('#photo-name').val()), startTime: dateRange.startTime, endTime: dateRange.endTime}).done(function (res) {
        const data = res.data; state.records = data.records;
        const rows = state.records.map(function (item) { return '<tr><td class="ps-4">' + escapeHtml(item.id) + '</td><td><a class="img-link img-link-zoom-in img-lightbox" href="' + safeImage(item.nimg) + '"><img class="photo-table-thumb" src="' + safeImage(item.nimg) + '" alt="' + escapeHtml(item.name || '证件照') + '" loading="lazy"></a></td><td class="fw-semibold">' + escapeHtml(item.name || '未命名') + '</td><td>' + userIdButton(item.userId) + '</td><td>' + escapeHtml(item.size || '-') + '</td><td>' + clothesText(item) + '</td><td>' + escapeHtml(item.createTime || '-') + '</td><td class="pe-4"><div class="table-actions"><button class="btn btn-sm btn-alt-primary photo-detail" data-id="' + item.id + '">详情</button><button class="btn btn-sm btn-alt-danger photo-delete" data-id="' + item.id + '"><i class="fa fa-trash"></i></button></div></td></tr>'; }).join('');
        $('#photo-list').html(rows || emptyRow(8, '暂无成片'));
        renderPager('#photo-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#photo-block', false); });
    }
    $('#photo-search').on('click', function () { state.page = 1; load(); }); $('#photo-reset').on('click', function () { $('#photo-user-id,#photo-name').val(''); datePicker.clear(); state.page = 1; load(); });
    $('#photo-list').on('click', '.photo-detail', function () {
      const id = Number($(this).data('id'));
      const photo = state.records.find(function (item) { return item.id === id; });
      if (!photo) return;
      const source = photo.type == null ? '-' : photo.type === 1 ? '1（系统规格）' : '2（用户定制）';
      const beauty = photo.isBeautyOn == null ? '-' : photo.isBeautyOn === 1 ? '1（开启）' : '0（关闭）';
      const clothesCategory = photo.clothesCategory == null ? '-' : photo.clothesCategory + '（' + (clothesCategoryMap[photo.clothesCategory] || '未知分类') + '）';
      const rows = [
        ['ID', photo.id], ['用户ID', photo.userId], ['规格ID', photo.itemId], ['规格来源', source], ['名称', photo.name],
        ['正式图片', photo.nimg], ['下载状态', downloadStatusMap[photo.downloadStatus]], ['尺寸说明', photo.size], ['宽度', photo.width == null ? null : photo.width + ' px'], ['高度', photo.height == null ? null : photo.height + ' px'],
        ['DPI', photo.dpi], ['美颜', beauty], ['背景颜色', photo.backgroundColor], ['背景效果', backgroundRenderMap[photo.backgroundRender]], ['服装分类', clothesCategory], ['服装编号', photo.clothesId],
        ['图片过期时间', getPhotoExpireTime(photo)], ['创建时间', photo.createTime]
      ];
      $('#photo-detail-body').html('<div class="table-responsive"><table class="table table-bordered table-vcenter mb-0"><tbody>' + rows.map(function (row) { return '<tr><th style="width:170px">' + row[0] + '</th><td class="photo-detail-value">' + escapeHtml(row[1] == null || row[1] === '' ? '-' : row[1]) + '</td></tr>'; }).join('') + '</tbody></table></div>');
      details.show();
    });
    $('#photo-list').on('click', '.photo-delete', function () { const id = Number($(this).data('id')); confirmDialog('此操作会同时删除成片文件和数据库记录，且无法恢复', '永久删除成片', function () { api('admin/deletePhoto', {id: id}).done(function (res) { toast(res.data || '删除成功'); reloadAfterDelete(state, load); }); }); });
    load();
  }

  function initPayOrder() {
    const state = {page: 1, size: 10, records: []};
    const datePicker = createDateRangePicker('#order-create-time');
    loadAppSetOptions('#order-app-id');
    const statusMap = {
      1: {text: '待支付', className: 'status-order-pending'},
      2: {text: '已支付', className: 'status-order-paid'},
      3: {text: '已退款', className: 'status-order-refunded'}
    };

    function loadCount() {
      ['#order-pending-count-block', '#order-paid-count-block', '#order-refunded-count-block'].forEach(function (selector) { setBlockLoading(selector, true); });
      api('admin/getPayOrderCount').done(function (res) {
        const data = res.data;
        $('#order-pending-count').text(data.pendingCount.toLocaleString('zh-CN'));
        $('#order-paid-count').text(data.paidCount.toLocaleString('zh-CN'));
        $('#order-refunded-count').text(data.refundedCount.toLocaleString('zh-CN'));
      }).always(function () {
        ['#order-pending-count-block', '#order-paid-count-block', '#order-refunded-count-block'].forEach(function (selector) { setBlockLoading(selector, false); });
      });
    }

    function load() {
      setBlockLoading('#order-block', true);
      const dateRange = getDateRange(datePicker);
      api('admin/getPayOrderPage', {pageNum: state.page, pageSize: state.size, userId: Number($('#order-user-id').val() || 0), orderNo: $.trim($('#order-no').val()), orderWx: $.trim($('#order-wx').val()), appId: Number($('#order-app-id').val()), status: Number($('#order-status').val()), startTime: dateRange.startTime, endTime: dateRange.endTime}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        const rows = state.records.map(function (item) {
          const orderStatus = item.status;
          const statusInfo = statusMap[orderStatus];
          const orderWx = item.orderWx ? '<code>微信：' + escapeHtml(item.orderWx) + '</code>' : '<code class="text-muted">微信：-</code>';
          const refundNo = item.refundNo ? '<code>退款：' + escapeHtml(item.refundNo) + '</code>' : '';
          const refundWx = item.refundWx ? '<code>微信退款：' + escapeHtml(item.refundWx) + '</code>' : '';
          const refundTime = '<div class="fs-xs text-muted">退款：' + escapeHtml(item.refundTime || '-') + '</div>';
          const refundButton = orderStatus === 2 ? '<button class="btn btn-sm btn-alt-danger order-refund" data-id="' + item.id + '">退款</button>' : '';
          const deleteButton = '<button class="btn btn-sm btn-alt-secondary order-delete" data-id="' + item.id + '">删除</button>';
          return '<tr><td class="ps-4">' + escapeHtml(item.id) + '</td><td><div class="order-number-cell"><code>商户：' + escapeHtml(item.orderNo || '-') + '</code>' + orderWx + refundNo + refundWx + '</div></td><td>' + userIdButton(item.userId) + '</td><td>' + escapeHtml(item.appId) + '</td><td>' + escapeHtml(item.photoId) + '</td><td>' + escapeHtml(item.name || '-') + '</td><td>¥' + item.money.toFixed(2) + '</td><td><span class="status-badge ' + statusInfo.className + '">' + statusInfo.text + '</span></td><td><div class="order-time-cell"><div class="fs-xs text-muted">创建：' + escapeHtml(item.createTime || '-') + '</div><div class="fs-xs text-muted">支付：' + escapeHtml(item.payTime || '-') + '</div>' + refundTime + '</div></td><td class="pe-4 order-actions-cell"><div class="table-actions">' + refundButton + deleteButton + '</div></td></tr>';
        }).join('');
        $('#order-list').html(rows || emptyRow(10, '暂无订单'));
        renderPager('#order-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#order-block', false); });
    }

    $('#order-search').on('click', function () { state.page = 1; load(); });
    $('#order-reset').on('click', function () { $('#order-user-id,#order-no,#order-wx').val(''); $('#order-app-id,#order-status').val('0'); datePicker.clear(); state.page = 1; load(); });
    $('#order-list').on('click', '.order-refund', function () {
      const id = Number($(this).data('id'));
      const order = state.records.find(function (item) { return item.id === id; });
      confirmDialog('将按订单原金额 ¥' + order.money.toFixed(2) + ' 全额退回，并在退款成功后删除关联照片', '确认退款', function () {
        api('admin/refundPayOrder', {id: id}).done(function (res) {
          toast(res.data || '退款成功');
          loadCount();
          load();
        });
      });
    });
    $('#order-list').on('click', '.order-delete', function () {
      const id = Number($(this).data('id'));
      api('admin/deletePayOrder', {id: id}).done(function (res) {
        toast(res.data || '删除成功');
        reloadAfterDelete(state, load);
        loadCount();
      });
    });
    loadCount();
    load();
  }

  function initUserRecord() {
    const state = {page: 1, size: 10, records: []};
    const relationModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('record-relation-modal'));
    const datePicker = createDateRangePicker('#record-create-time');
    loadAppSetOptions('#record-app-id');
    function load() {
      setBlockLoading('#record-block', true);
      const dateRange = getDateRange(datePicker);
      api('admin/getUserRecordPage', {pageNum: state.page, pageSize: state.size, userId: Number($('#record-user-id').val() || 0), appId: Number($('#record-app-id').val()), status: Number($('#record-status').val()), startTime: dateRange.startTime, endTime: dateRange.endTime}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        const rows = state.records.map(function (item) {
          const failed = item.status === 2;
          const photoButton = item.photoId == null ? '<span class="text-muted">无照片</span>' : '<button type="button" class="btn btn-link p-0 record-photo-view" data-photo-id="' + item.photoId + '">查看</button>';
          const errorMessage = item.errorMessage || '';
          const errorText = errorMessage ? '<span class="record-error-tip">' + escapeHtml(errorMessage) + '</span>' : '';
          return '<tr><td class="ps-4 record-id-cell">' + escapeHtml(item.id) + '</td><td>' + escapeHtml(item.name || '-') + '</td><td>' + escapeHtml(item.appId) + '</td><td>' + userIdButton(item.userId) + '</td><td>' + photoButton + '</td><td>' + escapeHtml(item.createTime || '-') + '</td><td class="' + (failed ? 'text-danger' : 'text-success') + '">' + (failed ? '失败' : '成功') + '</td><td class="text-danger">' + errorText + '</td><td>' + (item.durationMs == null ? '-' : escapeHtml(item.durationMs) + ' ms') + '</td><td class="pe-4"><div class="table-actions"><button class="btn btn-sm btn-alt-danger record-delete" data-id="' + item.id + '"><i class="fa fa-trash"></i></button></div></td></tr>';
        }).join('');
        disposeTooltips(document.getElementById('record-list'));
        $('#record-list').html(rows || emptyRow(10, '暂无行为记录'));
        renderPager('#record-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#record-block', false); });
    }
    $('#record-search').on('click', function () { state.page = 1; load(); });
    $('#record-reset').on('click', function () { $('#record-user-id').val(''); $('#record-app-id,#record-status').val('0'); datePicker.clear(); state.page = 1; load(); });

    function loadPhotoRelation(id) {
      api('admin/getPhotoDetail', {id: id}).done(function (res) {
        const photo = res.data;

        //当关联照片已经被定时任务清理时，直接提示错误，不再打开详情弹窗
        if (!photo) {
          toast('照片信息已被定时器清除，无法查看', 'danger');
          return;
        }
        const source = photo.type == null ? '-' : photo.type === 1 ? '1（系统规格）' : '2（用户定制）';
        const downloadStatus = photo.downloadStatus == null ? '-' : photo.downloadStatus === 1 ? '1（未解锁）' : photo.downloadStatus === 2 ? '2（预览照或探索成片已解锁）' : '3（智能证件照高清已解锁）';
        const beauty = photo.isBeautyOn == null ? '-' : photo.isBeautyOn === 1 ? '1（开启）' : '0（关闭）';
        const clothesCategoryMap = {0: '0（未换装）', 1: '1（男装）', 2: '2（女装）', 3: '3（儿童装）'};
        const clothesCategory = photo.clothesCategory == null ? '-' : clothesCategoryMap[photo.clothesCategory] || photo.clothesCategory;
        const image = photo.nimg ? '<div class="text-center mb-4"><img class="img-fluid rounded" style="max-height:360px" src="' + safeImage(photo.nimg) + '" alt=""></div>' : '';
        const fields = [
          ['照片 ID', photo.id], ['用户 ID', userIdButton(photo.userId), true], ['应用 ID', photo.appId], ['规格 ID', photo.itemId],
          ['规格来源', source], ['名称', photo.name], ['正式图片地址', photo.nimg], ['下载状态', downloadStatus], ['尺寸说明', photo.size],
          ['输出宽度', photo.width == null ? null : photo.width + ' px'], ['输出高度', photo.height == null ? null : photo.height + ' px'],
          ['DPI', photo.dpi], ['美颜', beauty], ['服装分类', clothesCategory], ['服装编号', photo.clothesId], ['原始图片路径', photo.originalPath], ['普通透明照路径', photo.standardPath],
          ['高清透明照路径', photo.hdPath], ['当前换底路径', photo.resultPath], ['过期时间', photo.expireTime], ['创建时间', photo.createTime]
        ];
        const details = fields.map(function (field) {
          const value = field[1] == null || field[1] === '' ? '-' : field[1];
          return '<tr><th style="width:170px">' + field[0] + '</th><td class="photo-detail-value">' + (field[2] ? value : escapeHtml(value)) + '</td></tr>';
        }).join('');
        $('#record-relation-title').text('照片详情');
        $('#record-relation-body').html(image + '<div class="table-responsive"><table class="table table-bordered table-vcenter mb-0"><tbody>' + details + '</tbody></table></div>');
        relationModal.show();
      });
    }

    $('#record-list').on('click', '.record-photo-view', function () {
      loadPhotoRelation(Number($(this).data('photo-id')));
    });

    $('#record-list').on('click', '.record-delete', function () { const id = Number($(this).data('id')); confirmDialog('确定永久删除这条行为审计记录吗？', '删除行为记录', function () { api('admin/deleteUserRecord', {id: id}).done(function (res) { toast(res.data || '删除成功'); reloadAfterDelete(state, load); }); }); });
    load();
  }

  function initWebTask() {
    const state = {page: 1, size: 10, records: []};

    function loadLast() {
      setBlockLoading('#timer-first-block', true);
      setBlockLoading('#timer-second-block', true);
      api('admin/getWebTaskLast').done(function (res) {
        const tasks = res.data;
        $('#timer-first-name').text(tasks[0].taskName);
        $('#timer-first-time').text(tasks[0].endTime || '暂无执行记录');
        $('#timer-second-name').text(tasks[1].taskName);
        $('#timer-second-time').text(tasks[1].endTime || '暂无执行记录');
      }).always(function () {
        setBlockLoading('#timer-first-block', false);
        setBlockLoading('#timer-second-block', false);
      });
    }

    function load() {
      setBlockLoading('#web-task-block', true);
      api('admin/getWebTaskPage', {pageNum: state.page, pageSize: state.size, type: Number($('#web-task-type').val()), status: Number($('#web-task-status').val()), deleteCountType: Number($('#web-task-delete-count-type').val())}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        const rows = state.records.map(function (item) {
          const failed = item.status === 2;
          const errorLog = item.errorLog || '';
          const errorText = errorLog ? '<span class="record-error-tip">' + escapeHtml(errorLog) + '</span>' : '';
          return '<tr><td class="ps-4">' + escapeHtml(item.id) + '</td><td>' + escapeHtml(item.taskName) + '</td><td><div class="order-time-cell"><div class="fs-xs text-muted">开始：' + escapeHtml(item.startTime) + '</div><div class="fs-xs text-muted">结束：' + escapeHtml(item.endTime) + '</div></div></td><td>' + item.deleteCount.toLocaleString('zh-CN') + '</td><td>' + escapeHtml(item.durationMs) + ' ms</td><td><span class="status-badge ' + (failed ? 'status-disabled' : 'status-normal') + '">' + (failed ? '失败' : '成功') + '</span></td><td class="text-danger">' + errorText + '</td><td class="pe-4"><div class="table-actions"><button type="button" class="btn btn-sm btn-alt-danger web-task-delete" data-id="' + item.id + '">删除</button></div></td></tr>';
        }).join('');
        disposeTooltips(document.getElementById('web-task-list'));
        $('#web-task-list').html(rows || emptyRow(8, '暂无定时器执行日志'));
        renderPager('#web-task-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#web-task-block', false); });
    }

    $('#web-task-search').on('click', function () { state.page = 1; load(); });
    $('#web-task-reset').on('click', function () {
      $('#web-task-type').val('0');
      $('#web-task-status').val('0');
      $('#web-task-delete-count-type').val('1');
      state.page = 1;
      load();
    });
    $('#web-task-list').on('click', '.web-task-delete', function () {
      const id = Number($(this).data('id'));
      api('admin/deleteWebTask', {id: id}).done(function (res) {
        toast(res.data || '删除成功');
        loadLast();
        reloadAfterDelete(state, load);
      });
    });
    $('#web-task-clear').on('click', function () {
      confirmDialog('确定要清空定时器下所有的执行日志吗？', '一键清空日志', function () {
        api('admin/clearWebTask').done(function (res) {
          toast(res.data || '日志已清空');
          state.page = 1;
          loadLast();
          load();
        });
      });
    });
    loadLast();
    load();
  }

  function initUser() {
    const state = {page: 1, size: 10, records: [], activeId: 0};
    const actions = bootstrap.Modal.getOrCreateInstance(document.getElementById('user-actions-modal'));
    const datePicker = createDateRangePicker('#user-create-time');
    function load() {
      setBlockLoading('#user-block', true);
      const dateRange = getDateRange(datePicker);
      api('admin/getUserPage', {pageNum: state.page, pageSize: state.size, userId: Number($('#user-id').val() || 0), name: $.trim($('#user-name').val()), startTime: dateRange.startTime, endTime: dateRange.endTime}).done(function (res) {
        const data = res.data; state.records = data.records;
        const rows = state.records.map(function (user) { const disabled = user.status === 2; return '<tr><td class="ps-4">' + userIdButton(user.id) + '</td><td><div class="d-flex align-items-center gap-3"><a class="img-link img-link-zoom-in img-lightbox" href="' + safeAvatar(user.avatarUrl) + '"><img class="user-avatar" src="' + safeAvatar(user.avatarUrl) + '" alt="用户头像"></a><div><div class="fw-semibold">' + escapeHtml(user.nickname || '微信用户') + '</div>' + (user.id === 1 ? '<div class="fs-xs text-muted">管理员</div>' : '') + '</div></div></td><td>' + escapeHtml(user.phone || '-') + '</td><td><code class="fs-xs">' + escapeHtml(user.openid || '-') + '</code></td><td>' + escapeHtml(user.city || '未知地区') + '</td><td>' + escapeHtml(user.ip || '未知IP') + '</td><td><span class="status-badge ' + (disabled ? 'status-disabled' : 'status-normal') + '">' + (disabled ? '禁止登录' : '正常') + '</span></td><td>' + escapeHtml(user.createTime || '-') + '</td><td class="pe-4"><div class="table-actions"><button class="btn btn-sm btn-alt-primary js-user-detail" data-user-id="' + user.id + '">详情</button><button class="btn btn-sm btn-alt-secondary user-actions" data-id="' + user.id + '">面板</button></div></td></tr>'; }).join('');
        $('#user-list').html(rows || emptyRow(9, '没有找到符合条件的用户'));
        renderPager('#user-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).always(function () { setBlockLoading('#user-block', false); });
    }
    $('#user-search').on('click', function () { state.page = 1; load(); }); $('#user-reset').on('click', function () { $('#user-id,#user-name').val(''); datePicker.clear(); state.page = 1; load(); });
    $('#user-list').on('click', '.user-actions', function () { const id = Number($(this).data('id')); const user = state.records.find(function (item) { return item.id === id; }); state.activeId = id; $('#user-actions-avatar').attr('src', user.avatarUrl || '../assets/media/avatars/avatar0.jpg'); $('#user-actions-subtitle').text((user.nickname || '微信用户') + ' · 用户 ' + id); $('[data-user-action="1"],[data-user-action="5"]').prop('disabled', id === 1); actions.show(); });
    $('[data-user-action]').on('click', function () {
      const type = Number($(this).data('user-action'));
      const labels = {2: '清空该用户全部定制规格', 3: '永久删除该用户全部保存图片', 4: '永久删除该用户全部行为记录', 7: '永久删除该用户全部支付订单'};
      const submitAction = function () {
        api('admin/updateUserStatus', {userId: state.activeId, type: type}).done(function (res) { toast(res.data || '处理成功'); load(); });
      };
      //登录管理操作直接提交，数据清理操作继续二次确认
      if (type === 1 || type === 5 || type === 6) {
        submitAction();
        return;
      }
      //先关闭操作面板再显示确认框，确认框关闭后继续显示当前用户的操作面板
      $('#user-actions-modal').one('hidden.bs.modal', function () {
        $('#confirm-modal').one('hidden.bs.modal', function () { actions.show(); });
        confirmDialog(labels[type] + '，确定继续吗？', '用户治理确认', submitAction);
      });
      actions.hide();
    });
    load();
  }

  function initUserMap() {
    setBlockLoading('#user-map-block', true);
    api('admin/getUserMap').done(function (res) {
      const data = res.data;
      const regionValues = {};
      const regionData = {};
      let hasRegionData = false;
      data.regions.forEach(function (item) {
        regionValues[item.code] = item.count;
        regionData[item.code] = item;
        if (item.count > 0) hasRegionData = true;
      });

      const mapOptions = {
        map: 'cn_mill_en',
        backgroundColor: '#ffffff',
        zoomButtons: false,
        zoomOnScroll: false,
        regionMargin: 6,
        regionStyle: {
          initial: {fill: '#e7edf6', stroke: '#ffffff', 'stroke-width': 1, 'stroke-opacity': 1},
          hover: {'fill-opacity': 0.8, cursor: 'pointer'}
        },
        onRegionTipShow: function (event, label, code) {
          const region = regionData[code];
          label.html(region.name + '：' + region.count + ' 位用户');
        }
      };
      if (hasRegionData) {
        mapOptions.series = {regions: [{values: regionValues, scale: ['#dce8ff', '#2864d7'], normalizeFunction: 'polynomial'}]};
      }
      $('#user-region-map').vectorMap(mapOptions);
      const mapObject = $('#user-region-map').vectorMap('get', 'mapObject');
      //按照全部地区的真实边界自适应放大，避免矢量画布空白压缩地图
      mapObject.setFocus({regions: Object.keys(regionData), animate: false});
      activeVectorMaps.push(mapObject);
    }).fail(function () {
      $('#user-region-map').html(loadError(serviceConnectionMessage));
    }).always(function () {
      setBlockLoading('#user-map-block', false);
    });
  }

  function initFeedback() {
    const state = {page: 1, size: 10, records: []};
    const datePicker = createDateRangePicker('#feedback-create-time');
    const details = bootstrap.Modal.getOrCreateInstance(document.getElementById('feedback-detail-modal'));
    const typeNames = {1: '功能建议', 2: '使用体验', 3: '投诉', 4: '其他'};
    function load() {
      setBlockLoading('#feedback-block', true);
      const dateRange = getDateRange(datePicker);
      api('admin/getFeedbackPage', {pageNum: state.page, pageSize: state.size, userId: Number($('#feedback-user-id').val() || 0), type: Number($('#feedback-type').val()), startTime: dateRange.startTime, endTime: dateRange.endTime}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        $('#feedback-list').html(state.records.map(function (item) {
          const image = item.imageUrls ? '<a class="img-link img-link-zoom-in img-lightbox" href="' + safeImage(item.imageUrls) + '"><img class="feedback-image" src="' + safeImage(item.imageUrls) + '" alt="反馈图片" loading="lazy"></a>' : '-';
          return '<tr><td class="ps-4">' + item.id + '</td><td>' + userIdButton(item.userId) + '</td><td>' + escapeHtml(typeNames[item.type] || '其他') + '</td><td><div class="feedback-content">' + escapeHtml(item.content) + '</div></td><td><div class="feedback-images">' + image + '</div></td><td>' + escapeHtml(item.contact || '-') + '</td><td>' + escapeHtml(item.createTime || '-') + '</td><td class="text-end pe-4"><div class="table-actions"><button type="button" class="btn btn-sm btn-alt-primary feedback-detail" data-id="' + item.id + '">详情</button><button type="button" class="btn btn-sm btn-alt-danger feedback-delete" data-id="' + item.id + '"><i class="fa fa-trash"></i></button></div></td></tr>';
        }).join('') || emptyRow(8, '暂无意见反馈'));
        renderPager('#feedback-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).fail(function (error) {
        if (error && error.aborted) return;
        $('#feedback-list').html('<tr><td colspan="8">' + loadError(serviceConnectionMessage, 'feedback-retry') + '</td></tr>');
        $('#feedback-pagination').empty();
      }).always(function () { setBlockLoading('#feedback-block', false); });
    }
    $('#feedback-search').on('click', function () { state.page = 1; load(); });
    $('#feedback-reset').on('click', function () { $('#feedback-user-id').val(''); $('#feedback-type').val('0'); datePicker.clear(); state.page = 1; load(); });
    $('#feedback-list').on('click', '.feedback-retry', load);
    $('#feedback-list').on('click', '.feedback-detail', function () {
      const id = Number($(this).data('id'));
      const item = state.records.find(function (record) { return record.id === id; });
      if (!item) return;
      const image = item.imageUrls ? '<a class="img-link img-link-zoom-in img-lightbox" href="' + safeImage(item.imageUrls) + '"><img class="feedback-detail-image" src="' + safeImage(item.imageUrls) + '" alt="反馈图片"></a>' : '-';
      const rows = [
        ['ID', escapeHtml(item.id)],
        ['用户ID', escapeHtml(item.userId)],
        ['反馈类型', escapeHtml(typeNames[item.type] || '其他')],
        ['反馈内容', '<div class="feedback-detail-content">' + escapeHtml(item.content || '-') + '</div>'],
        ['反馈图片', image],
        ['联系方式', escapeHtml(item.contact || '-')],
        ['创建时间', escapeHtml(item.createTime || '-')]
      ];
      $('#feedback-detail-body').html('<div class="table-responsive"><table class="table table-bordered table-vcenter mb-0"><tbody>' + rows.map(function (row) { return '<tr><th style="width:140px">' + row[0] + '</th><td>' + row[1] + '</td></tr>'; }).join('') + '</tbody></table></div>');
      details.show();
    });
    $('#feedback-list').on('click', '.feedback-delete', function () {
      const id = Number($(this).data('id'));
      api('admin/deleteFeedback', {id: id}).done(function () {
        toast('反馈已删除');
        reloadAfterDelete(state, load);
      });
    });
    load();
  }

  function initClothesSet() {
    const state = {page: 1, size: 10, records: []};
    const syncModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('clothes-sync-modal'), {backdrop: 'static', keyboard: false});
    let syncRunning = false;
    let progressTimer = null;

    if (window.clothesSyncBeforeUnload) window.removeEventListener('beforeunload', window.clothesSyncBeforeUnload);
    window.clothesSyncBeforeUnload = function (event) {
      if (!syncRunning) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', window.clothesSyncBeforeUnload);

    function showSyncProgress(data) {
      const wasRunning = syncRunning;
      const total = Number(data.total || 43);
      const current = Number(data.current || 0);
      const percent = total > 0 ? Math.min(100, Math.round(current / total * 100)) : 0;
      $('#clothes-sync-name').text(data.currentName || '正在准备素材');
      $('#clothes-sync-current').text(current);
      $('#clothes-sync-total').text(total);
      $('#clothes-sync-progress').css('width', percent + '%').attr('aria-valuenow', percent);
      syncRunning = data.status === 2;
      $('#clothes-sync-spinner').toggleClass('d-none', !syncRunning);
      $('#clothes-sync-footer').toggleClass('d-none', syncRunning);
      if (data.status === 2) {
        syncModal.show();
      } else if ((data.status === 3 || data.status === 4) && wasRunning) {
        syncModal.show();
        $('#clothes-sync-name').text(data.message || (data.status === 3 ? '换装素材同步成功' : '换装素材同步失败'));
        if (data.status === 3) {
          load();
        }
      }
    }

    function pollSyncProgress() {
      if (activePage !== 'clothesSet' || !document.getElementById('clothes-sync-modal')) return;
      api('admin/getClothesImageSyncProgress').done(function (res) {
        showSyncProgress(res.data);
        if (res.data.status === 2) progressTimer = setTimeout(pollSyncProgress, 800);
      });
    }
    function load() {
      setBlockLoading('#clothes-material-block', true);
      api('admin/getClothesList', {pageNum: state.page, pageSize: state.size, id: Number($('#clothes-material-id').val() || 0), category: Number($('#clothes-material-category').val()), status: Number($('#clothes-material-status').val())}).done(function (res) {
        if (activePage !== 'clothesSet' || !document.getElementById('clothes-material-list')) return;
        const data = res.data;
        state.records = data.records;
        const categoryNames = {1: '男装', 2: '女装', 3: '儿童装'};
        $('#clothes-material-list').html(state.records.map(function (item) {
          const normal = item.status === 1;
          const imageUrl = item.imageUrl;
          return '<tr><td class="ps-4 fw-semibold">' + item.id + '</td>' +
            '<td><div class="clothes-material-preview"><a class="img-link img-link-zoom-in img-lightbox" href="' + safeImage(imageUrl) + '"><img src="' + safeImage(imageUrl) + '" alt="服装素材 ' + item.id + '"></a></div></td>' +
            '<td>' + escapeHtml(categoryNames[item.category] || '未知分类') + '</td>' +
            '<td>' + escapeHtml(String(item.clothesId).padStart(2, '0')) + '</td>' +
            '<td><span class="status-badge ' + (normal ? 'status-normal' : 'status-disabled') + '">' + (normal ? '正常' : '关闭') + '</span></td>' +
            '<td class="pe-4"><div class="table-actions"><button type="button" class="btn btn-sm ' + (normal ? 'btn-alt-danger' : 'btn-alt-success') + ' clothes-material-status" data-id="' + item.id + '" data-status="' + (normal ? 2 : 1) + '">' + (normal ? '关闭' : '恢复') + '</button></div></td></tr>';
        }).join('') || emptyRow(6, '暂无换装素材'));
        renderPager('#clothes-material-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).fail(function (error) {
        if (error && error.aborted) return;
        $('#clothes-material-list').html('<tr><td colspan="6">' + loadError(serviceConnectionMessage, 'clothes-material-retry') + '</td></tr>');
        $('#clothes-material-pagination').empty();
      }).always(function () {
        setBlockLoading('#clothes-material-block', false);
      });
    }

    $('#clothes-material-search').on('click', function () { state.page = 1; load(); });
    $('#clothes-material-reset').on('click', function () { $('#clothes-material-id').val(''); $('#clothes-material-category,#clothes-material-status').val('0'); state.page = 1; load(); });
    $('#clothes-image-sync').on('click', function () {
      const button = $(this);
      button.prop('disabled', true);
      api('admin/startClothesImageSync').done(function () {
        syncRunning = true;
        $('#clothes-sync-spinner').removeClass('d-none');
        $('#clothes-sync-footer').addClass('d-none');
        syncModal.show();
        clearTimeout(progressTimer);
        pollSyncProgress();
      }).always(function () {
        button.prop('disabled', false);
      });
    });
    $('#clothes-material-list').on('click', '.clothes-material-retry', load);
    $('#clothes-material-list').on('click', '.clothes-material-status', function () {
      const id = Number($(this).data('id'));
      const status = Number($(this).data('status'));
      const action = status === 1 ? '恢复' : '关闭';
      api('admin/updateClothesStatus', {id: id, status: status}).done(function () {
        toast('换装素材已' + action);
        if (Number($('#clothes-material-status').val()) !== 0 && state.page > 1 && state.records.length <= 1) state.page -= 1;
        load();
      });
    });
    load();
    pollSyncProgress();
  }

  function initHelpSet() {
    const state = {page: 1, size: 10, records: []};
    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('help-modal'));
    function load() {
      setBlockLoading('#help-block', true);
      api('admin/getHelpPage', {pageNum: state.page, pageSize: state.size, title: $.trim($('#help-title').val())}).done(function (res) {
        const data = res.data;
        state.records = data.records;
        $('#help-list').html(state.records.map(function (item) {
          return '<tr><td class="ps-4">' + item.id + '</td><td class="help-title-cell">' + escapeHtml(item.title) + '</td><td class="help-content-cell">' + escapeHtml(item.content) + '</td><td>' + item.sort + '</td><td class="pe-4"><div class="table-actions"><button type="button" class="btn btn-sm btn-alt-secondary help-sort-move" data-id="' + item.id + '" data-direction="1" title="上移"><i class="fa fa-arrow-up"></i></button><button type="button" class="btn btn-sm btn-alt-secondary help-sort-move" data-id="' + item.id + '" data-direction="2" title="下移"><i class="fa fa-arrow-down"></i></button><button type="button" class="btn btn-sm btn-alt-primary help-edit" data-id="' + item.id + '"><i class="fa fa-pen"></i></button><button type="button" class="btn btn-sm btn-alt-danger help-delete" data-id="' + item.id + '"><i class="fa fa-trash"></i></button></div></td></tr>';
        }).join('') || emptyRow(5, '暂无问题'));
        renderPager('#help-pagination', data.current, data.size, data.total, function (next) { state.page = next; load(); });
      }).fail(function (error) {
        if (error && error.aborted) return;
        $('#help-list').html('<tr><td colspan="5">' + loadError(serviceConnectionMessage, 'help-retry') + '</td></tr>');
        $('#help-pagination').empty();
      }).always(function () { setBlockLoading('#help-block', false); });
    }
    function open(item) {
      $('#help-modal-title').text(item ? '编辑问题' : '新增问题');
      $('#help-id').val(item ? item.id : '');
      $('#help-form-title').val(item ? item.title : '');
      $('#help-content').val(item ? item.content : '');
      $('#help-sort').val(item ? item.sort : 1);
      modal.show();
    }
    $('#help-search').on('click', function () { state.page = 1; load(); });
    $('#help-reset').on('click', function () { $('#help-title').val(''); state.page = 1; load(); });
    $('#help-add').on('click', function () { open(null); });
    $('#help-list').on('click', '.help-retry', load);
    $('#help-list').on('click', '.help-sort-move', function () {
      api('admin/updateHelpSort', {id: Number($(this).data('id')), direction: Number($(this).data('direction'))}).done(function () {
        toast('问题排序已更新');
        load();
      });
    });
    $('#help-list').on('click', '.help-edit', function () { const id = Number($(this).data('id')); open(state.records.find(function (item) { return item.id === id; })); });
    $('#help-list').on('click', '.help-delete', function () { const id = Number($(this).data('id')); confirmDialog('删除后小程序将不再展示该问题，确定继续吗？', '删除问题', function () { api('admin/deleteHelp', {id: id}).done(function () { toast('问题已删除'); reloadAfterDelete(state, load); }); }); });
    $('#help-save').on('click', function () {
      if (!document.getElementById('help-form').reportValidity()) return;
      const data = {id: $('#help-id').val() ? Number($('#help-id').val()) : null, title: $.trim($('#help-form-title').val()), content: $.trim($('#help-content').val()), sort: Number($('#help-sort').val())};
      api('admin/saveHelp', data, true).done(function () { modal.hide(); toast('问题保存成功'); load(); });
    });
    load();
  }

  function initFunctionFeedback() {
    $('#function-feedback-submit').on('click', function () {
      if (!document.getElementById('function-feedback-form').reportValidity()) return;
      setBlockLoading('#function-feedback-block', true);
      api('admin/submitFunctionFeedback', {
        title: $.trim($('#function-feedback-title').val()),
        content: $.trim($('#function-feedback-content').val()),
        contact: $.trim($('#function-feedback-contact').val())
      }, true).done(function () {
        document.getElementById('function-feedback-form').reset();
        toast('功能反馈提交成功');
      }).always(function () {
        setBlockLoading('#function-feedback-block', false);
      });
    });
  }

  function initAppSet() {
    let sortableInstances = [];

    function destroyApplicationSortable() {
      sortableInstances.forEach(function (sortable) {
        const index = activeSortables.indexOf(sortable);
        if (index !== -1) activeSortables.splice(index, 1);
        try { sortable.destroy(); } catch (error) { /* 已销毁时无需重复处理 */ }
      });
      sortableInstances = [];
    }

    function renderApplicationCard(item) {
      const id = item.id;
      //探索应用统一使用关闭、免费、广告、付费、广告或付费五种下载模式
      const options = '<option value="0">关闭</option><option value="1">免费下载</option><option value="2">看广告下载</option><option value="3">付费下载</option><option value="4">看广告或付费下载</option>';
      return '<div class="col-4 application-sort-item" data-id="' + id + '"><div class="block block-rounded h-100 mb-0 application-card" data-id="' + id + '">' +
        '<div class="block-header block-header-default"><h3 class="block-title app-card-title">' + escapeHtml(item.name || '未命名应用') + '</h3></div>' +
        '<div class="application-cover"><img class="app-cover-preview" src="' + safeImage($.trim(item.image || '')) + '" alt=""><div class="application-cover-actions">' + (!$.trim(item.image || '') ? '<button type="button" class="application-cover-action app-image-sync">同步图片</button>' : '') + '<label class="application-cover-action"><i class="fa fa-image me-1"></i>更换封面<input type="file" class="app-image-input" accept="image/jpeg,image/png"></label></div></div>' +
        '<div class="block-content block-content-full"><div class="mb-3"><label class="form-label">标题</label><input class="form-control app-name" maxlength="50" value="' + escapeHtml(item.name || '') + '"></div>' +
        '<div class="mb-3"><label class="form-label">描述</label><textarea class="form-control app-description" rows="2" maxlength="120">' + escapeHtml(item.description || '') + '</textarea></div>' +
        '<div class="row g-3"><div class="col-12"><label class="form-label">下载模式</label><select class="form-select app-status">' + options + '</select></div>' +
        '<input type="hidden" class="app-setting-value" value="0">' +
        '<div class="col-12 app-download-price-group"><label class="form-label">下载金额（元）</label><input type="number" min="0.01" step="0.01" class="form-control app-download-price" value="' + (item.downloadPrice || 0) + '"></div></div></div>' +
        '<div class="block-content block-content-full border-top text-end"><button type="button" class="btn btn-sm btn-primary app-save">保存</button></div></div></div>';
    }

    function load() {
      destroyApplicationSortable();
      disposeTooltips(document.getElementById('application-basic-list'));
      $('#application-basic-list,#application-featured-list,#application-sort-list').html('<div class="col-12"><div class="block block-rounded block-mode-loading application-loading"></div></div>');
      api('admin/getExploreSet').done(function (res) {
        if (activePage !== 'appSet' || !document.getElementById('application-sort-list')) return;
        const applications = res.data.slice().sort(function (a, b) { return a.sort - b.sort || a.id - b.id; });
        const basic = [1, 2, 15, 14].map(function (id) { return applications.find(function (item) { return item.id === id; }); }).filter(Boolean);
        const explore = applications.filter(function (item) { return item.id >= 3 && item.id !== 14 && item.id !== 15; });
        const featured = explore.slice(0, 1);
        const normal = explore.slice(1);
        $('#application-basic-list').html(basic.map(function (item) {
          const id = item.id;
          const options = id === 1
            ? '<option value="0">关闭上传</option><option value="1">允许上传</option>'
            : id === 14
              ? '<option value="0">关闭鉴黄</option><option value="1">启用鉴黄</option>'
              : '<option value="0">关闭</option><option value="1">免费使用</option>';
          const setting = id === 14
            ? '<div class="col-6"><div class="d-flex align-items-center mb-2"><label class="form-label mb-0">鉴黄阈值</label><button type="button" class="btn btn-sm btn-link text-muted p-0 ms-1 lh-1" data-bs-toggle="tooltip" data-bs-placement="top" title="建议0.6，越低=严格，越高=不严格。建议只在小程序提交审核时开启鉴黄，审核通过后关闭鉴黄" aria-label="鉴黄阈值说明"><i class="fa fa-circle-question"></i></button></div><input type="number" min="0.01" max="1" step="0.01" class="form-control app-setting-value" placeholder="0.01～1" value="' + (item.settingValue == null ? '' : item.settingValue) + '"></div>'
            : '<input type="hidden" class="app-setting-value" value="0">';
          return '<div class="col-3"><div class="block block-rounded mb-0 application-card application-basic-card" data-id="' + item.id + '"><input type="hidden" class="app-name" value="' + escapeHtml(item.name || '') + '"><input type="hidden" class="app-description" value="' + escapeHtml(item.description || '') + '"><div class="block-content block-content-full d-flex align-items-end gap-3"><div class="flex-grow-1"><div class="row g-3"><div class="' + (id === 14 ? 'col-6' : 'col-12') + '"><label class="form-label">' + escapeHtml(item.name || '基础设置') + '</label><select class="form-select app-status">' + options + '</select></div>' + setting + '</div><input type="hidden" class="app-download-price" value="0"></div><button type="button" class="btn btn-primary app-save">保存</button></div></div></div>';
        }).join('') || '<div class="col-12 text-muted py-4">暂无基础设置</div>');
        $('#application-featured-list').html(featured.map(function (item) { return renderApplicationCard(item); }).join('') || '<div class="col-12 text-muted py-4">暂无置顶应用</div>');
        $('#application-sort-list').html(normal.map(function (item) { return renderApplicationCard(item); }).join('') || '<div class="col-12 text-muted py-4">暂无探索应用</div>');
        applications.forEach(function (item) {
          const card = $('.application-card[data-id="' + item.id + '"]');
          card.find('.app-status').val(item.status);
          //付费下载和广告、付费任选时才显示金额输入框
          card.find('.app-download-price-group').toggleClass('d-none', item.status !== 3 && item.status !== 4);
        });
        $('#application-basic-list [data-bs-toggle="tooltip"]').each(function () { bootstrap.Tooltip.getOrCreateInstance(this, {container: 'body'}); });
        const featuredList = document.getElementById('application-featured-list');
        const sortList = document.getElementById('application-sort-list');
        const featuredSortable = new Sortable(featuredList, {
          group: {name: 'applications', pull: false, put: true},
          animation: 160,
          handle: '.block-header',
          draggable: '.application-sort-item',
          sort: false,
          ghostClass: 'application-sort-ghost',
          onAdd: function (event) {
            //新应用拖入置顶区后，把原置顶应用放回新应用原来的位置
            const oldFeatured = $(featuredList).children('.application-sort-item').not(event.item)[0];
            if (oldFeatured) {
              event.from.insertBefore(oldFeatured, event.from.children[event.oldIndex] || null);
            }
          }
        });
        const normalSortable = new Sortable(sortList, {
          group: {name: 'applications', pull: true, put: false},
          animation: 160,
          handle: '.block-header',
          draggable: '.application-sort-item',
          ghostClass: 'application-sort-ghost',
          onEnd: function () {
            const ids = $('#application-featured-list > .application-sort-item,#application-sort-list > .application-sort-item').map(function () { return $(this).data('id'); }).get();
            api('admin/updateExploreSort', ids, true).done(function () { toast('显示顺序已保存'); }).fail(function (error) {
              if (error && error.aborted) return;
              if (activePage === 'appSet') load();
            });
          }
        });
        sortableInstances.push(featuredSortable, normalSortable);
        activeSortables.push(featuredSortable, normalSortable);
      }).fail(function (error) {
        if (error && error.aborted) return;
        $('#application-basic-list').html('<div class="col-12">' + loadError(serviceConnectionMessage, 'application-retry') + '</div>');
        $('#application-featured-list,#application-sort-list').empty();
      });
    }
    $('.application-section').on('click', '.application-retry', load);
    $('.application-section').on('change', '.app-image-input', function () {
      const file = this.files[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) { this.value = ''; toast('封面不能超过15MB', 'warning'); return; }
      const image = $(this).closest('.application-cover').find('.app-cover-preview');
      const preview = URL.createObjectURL(file);
      image.one('load', function () { URL.revokeObjectURL(preview); }).attr('src', preview);
    });
    $('.application-section').on('change', '.app-status', function () {
      const card = $(this).closest('.application-card');
      const id = card.data('id');
      const status = Number($(this).val());
      //切换下载模式时同步显示或隐藏金额输入框
      if (id >= 3 && id !== 14 && id !== 15) card.find('.app-download-price-group').toggleClass('d-none', status !== 3 && status !== 4);
    });
    $('.application-section').on('click', '.app-image-sync', function () {
      const button = $(this);
      const id = button.closest('.application-card').data('id');
      button.prop('disabled', true).text('同步中...');
      api('admin/syncExploreImage', {id: id}).done(function () {
        toast('应用封面同步成功');
        load();
      }).always(function () {
        button.prop('disabled', false).text('同步图片');
      });
    });
    $('.application-section').on('click', '.app-save', function () {
      const card = $(this).closest('.application-card');
      const id = card.data('id');
      const name = $.trim(card.find('.app-name').val());
      const description = $.trim(card.find('.app-description').val());
      if (!name) { toast('标题不能为空', 'warning'); return; }
      if (id >= 3 && id !== 14 && id !== 15 && !description) { toast('描述不能为空', 'warning'); return; }
      const settingText = $.trim(card.find('.app-setting-value').val());
      const settingValue = Number(settingText);
      const downloadPrice = Number(card.find('.app-download-price').val() || 0);
      const status = Number(card.find('.app-status').val());
      if (id === 14 && (settingText === '' || !Number.isFinite(settingValue) || settingValue < 0.01 || settingValue > 1)) { toast('鉴黄阈值必须填写0.01到1之间的数值', 'warning'); return; }
      //只有使用付费入口时才检查金额
      if (id >= 3 && id !== 14 && id !== 15 && (status === 3 || status === 4) && (!Number.isFinite(downloadPrice) || downloadPrice < 0.01)) { toast('付费下载金额不能低于0.01元', 'warning'); return; }
      const data = new FormData();
      data.append('id', id);
      data.append('name', name);
      data.append('description', description);
      data.append('status', status);
      data.append('settingValue', settingValue);
      data.append('downloadPrice', downloadPrice);
      const file = card.find('.app-image-input')[0];
      if (file && file.files[0]) data.append('file', file.files[0]);
      api('admin/updateExploreSet', data).done(function () {
        card.find('.app-card-title').text(name);
        toast('应用设置已保存');
      });
    });
    load();
  }

  function initWebSetBeauty() {
    function sync() {
      $('#brightness-value').text($('#brightness').val());
      $('#contrast-value').text($('#contrast').val());
      $('#sharpen-value').text($('#sharpen').val());
      $('#saturation-value').text($('#saturation').val());
    }
    $('#beauty-form input[type="range"]').on('input', sync);
    setBlockLoading('#beauty-block', true);
    api('admin/getBeautySet').done(function (res) {
      const data = res.data;
      $('#brightness').val(data.brightnessStrength);
      $('#contrast').val(data.contrastStrength);
      $('#sharpen').val(data.sharpenStrength);
      $('#saturation').val(data.saturationStrength);
      sync();
    }).always(function () {
      setBlockLoading('#beauty-block', false);
    });
    $('#beauty-save').on('click', function () { api('admin/updateBeautySet', {brightnessStrength: Number($('#brightness').val()), contrastStrength: Number($('#contrast').val()), sharpenStrength: Number($('#sharpen').val()), saturationStrength: Number($('#saturation').val())}, true).done(function () { toast('美颜参数已保存'); }); });
  }

  function initWebSetModel() {
    if (localStorage.getItem('webSetModelTipDismissed') !== '1') {
      $('#model-tip-alert').removeClass('d-none');
    }
    $('#model-tip-close').on('click', function () {
      localStorage.setItem('webSetModelTipDismissed', '1');
      $('#model-tip-alert').addClass('d-none');
    });
    function changePicApiType(clearLocalUrl) {
      const picApiType = Number($('#pic-api-type-select').val());
      if (picApiType === 1) {
        $('#pic-api-url-group').removeClass('d-none');
        $('#pic-api-key-group').addClass('d-none');
        $('#cloud-register-notice').addClass('d-none');
        if (clearLocalUrl) {
          $('#pic-api-url').val('');
        }
      } else {
        $('#pic-api-url-group').addClass('d-none');
        $('#pic-api-key-group').removeClass('d-none');
        $('#cloud-register-notice').removeClass('d-none');
      }
    }
    $('#pic-api-type-select').on('change', function () {
      changePicApiType(Number($(this).val()) === 1);
    });
    setBlockLoading('#model-block', true);
    api('admin/getModelSet').done(function (res) {
      const data = res.data;
      $('#pic-api-type-select').val(data.picApiType);
      $('#pic-api-url').val(data.picApiType === 1 ? data.picApiUrl : '');
      $('#pic-api-key').val(data.picApiKey || '');
      changePicApiType(false);
      $('#human-matting-model-select').val(data.humanMattingModel);
      $('#face-detect-model-select').val(data.faceDetectModel);
      $('#matting-model-select').val(data.mattingModel);
      $('#colourize-model-select').val(data.colourizeModel);
      $('#cartoon-model-select').val(data.cartoonModel);
      $('#american-human-matting-model-select').val(data.americanHumanMattingModel);
      $('#american-face-detect-model-select').val(data.americanFaceDetectModel);
      $('#template-human-matting-model-select').val(data.templateHumanMattingModel);
      $('#template-face-detect-model-select').val(data.templateFaceDetectModel);
      $('#couple-human-matting-model-select').val(data.coupleHumanMattingModel);
      $('#couple-face-detect-model-select').val(data.coupleFaceDetectModel);
      $('#clothes-face-detect-model-select').val(data.clothesFaceDetectModel);
      $('#clothes-parsing-model-select').val(data.clothesParsingModel);
      $('#deblur-model-select').val(data.deblurModel);
    }).always(function () { setBlockLoading('#model-block', false); });

    $('#model-save').on('click', function () {
      const picApiType = Number($('#pic-api-type-select').val());
      const picApiUrl = String($('#pic-api-url').val() || '').trim();
      const picApiKey = String($('#pic-api-key').val() || '').replace(/\s+/g, '');
      const humanMattingModel = String($('#human-matting-model-select').val() || '').trim();
      const faceDetectModel = String($('#face-detect-model-select').val() || '').trim();
      const mattingModel = String($('#matting-model-select').val() || '').trim();
      const colourizeModel = String($('#colourize-model-select').val() || '').trim();
      const cartoonModel = String($('#cartoon-model-select').val() || '').trim();
      const americanHumanMattingModel = String($('#american-human-matting-model-select').val() || '').trim();
      const americanFaceDetectModel = String($('#american-face-detect-model-select').val() || '').trim();
      const templateHumanMattingModel = String($('#template-human-matting-model-select').val() || '').trim();
      const templateFaceDetectModel = String($('#template-face-detect-model-select').val() || '').trim();
      const coupleHumanMattingModel = String($('#couple-human-matting-model-select').val() || '').trim();
      const coupleFaceDetectModel = String($('#couple-face-detect-model-select').val() || '').trim();
      const clothesFaceDetectModel = String($('#clothes-face-detect-model-select').val() || '').trim();
      const clothesParsingModel = String($('#clothes-parsing-model-select').val() || '').trim();
      const deblurModel = String($('#deblur-model-select').val() || '').trim();
      if (picApiType === 1 && (!picApiUrl.startsWith('h') || !picApiUrl.endsWith('/'))) {
        toast('自建API地址错误，请输入完整地址，如http://你的ip:你的端口/ 或 http://你的域名/', 'warning');
        return;
      }
      if (picApiType === 2 && !picApiKey) {
        toast('云平台API密钥不能为空', 'warning');
        return;
      }
      if (!humanMattingModel || !faceDetectModel || !mattingModel || !colourizeModel || !cartoonModel
          || !americanHumanMattingModel || !americanFaceDetectModel || !templateHumanMattingModel || !templateFaceDetectModel
          || !coupleHumanMattingModel || !coupleFaceDetectModel
          || !clothesFaceDetectModel || !clothesParsingModel || !deblurModel) {
        toast('模型名称不能为空', 'warning');
        return;
      }
      api('admin/updateModelSet', {
        picApiType: picApiType,
        picApiUrl: picApiType === 1 ? picApiUrl : '',
        picApiKey: picApiKey,
        humanMattingModel: humanMattingModel,
        faceDetectModel: faceDetectModel,
        mattingModel: mattingModel,
        colourizeModel: colourizeModel,
        cartoonModel: cartoonModel,
        americanHumanMattingModel: americanHumanMattingModel,
        americanFaceDetectModel: americanFaceDetectModel,
        templateHumanMattingModel: templateHumanMattingModel,
        templateFaceDetectModel: templateFaceDetectModel,
        coupleHumanMattingModel: coupleHumanMattingModel,
        coupleFaceDetectModel: coupleFaceDetectModel,
        clothesFaceDetectModel: clothesFaceDetectModel,
        clothesParsingModel: clothesParsingModel,
        deblurModel: deblurModel
      }, true).done(function () { toast('模型配置已保存'); });
    });
  }

  function initWebSet() {
    setBlockLoading('#system-block', true);
    setBlockLoading('#storage-block', true);
    setBlockLoading('#official-block', true);
    setBlockLoading('#pay-block', true);
    api('admin/getWebSet').done(function (res) {
      const data = res.data;
      $('#app-id').val(data.appId || '');
      $('#app-secret').val(data.appSecret || '');
      $('#video-unit-id').val(data.videoUnitId || '');
      $('#login-type').val(data.loginType);
      $('#directory').val(data.directory || '');
      $('#pic-domain').val(data.picDomain || '');
      $('#official-switch').val(data.officialSwitch);
      $('#official-qr-code-image-preview').attr('src', safeImage(data.officialQrCodeImageUrl));
      //微信支付配置保留完整私钥PEM内容
      $('#merchant-id').val(data.merchantId || '');
      $('#merchant-serial-number').val(data.merchantSerialNumber || '');
      $('#api-v3-key').val(data.apiV3Key || '');
      $('#merchant-private-key').val(data.merchantPrivateKey || '');
      $('#pay-notify-url').val(data.payNotifyUrl || '');
    }).always(function () {
      setBlockLoading('#system-block', false);
      setBlockLoading('#storage-block', false);
      setBlockLoading('#official-block', false);
      setBlockLoading('#pay-block', false);
    });
    $('#system-save').on('click', function () {
      const appId = $.trim($('#app-id').val());
      const appSecret = $.trim($('#app-secret').val());
      if (!appId || !appSecret) { toast('AppID 和 AppSecret 不能为空', 'warning'); return; }
      const data = new FormData();
      data.append('appId', appId);
      data.append('appSecret', appSecret);
      data.append('videoUnitId', $.trim($('#video-unit-id').val()));
      data.append('loginType', $('#login-type').val());
      api('admin/updateWebSet', data).done(function () { toast('保存成功'); });
    });
    $('#storage-save').on('click', function () {
      const directory = $.trim($('#directory').val());
      const picDomain = $.trim($('#pic-domain').val());
      if (!directory || !picDomain) { toast('图片存储配置不能为空', 'warning'); return; }
      if (!/^https?:\/\/[^/\s]+(?:\/[^\s]*)?\/$/i.test(picDomain)) { toast('图片站域名错误，请输入完整地址，如http://图片站域名/或https://图片站域名/', 'warning'); return; }
      const data = new FormData();
      data.append('directory', directory);
      data.append('picDomain', picDomain);
      api('admin/updateWebSet', data).done(function () { toast('保存成功'); });
    });
    $('#official-save').on('click', function () {
      const data = new FormData();
      data.append('officialSwitch', $('#official-switch').val());
      api('admin/updateWebSet', data).done(function () { toast('保存成功'); });
    });
    $('#pay-save').on('click', function () {
      //私钥只清理首尾空白，不改动PEM内部换行
      const data = new FormData();
      data.append('merchantId', $.trim($('#merchant-id').val()));
      data.append('merchantSerialNumber', $.trim($('#merchant-serial-number').val()));
      data.append('apiV3Key', $.trim($('#api-v3-key').val()));
      data.append('merchantPrivateKey', $.trim($('#merchant-private-key').val()));
      data.append('payNotifyUrl', $.trim($('#pay-notify-url').val()));
      api('admin/updateWebSet', data).done(function () { toast('保存成功'); });
    });
    $('#official-qr-code-image-file').on('change', function () {
      const file = this.files[0];
      if (!file) return;
      if (file.size > 15 * 1024 * 1024) { this.value = ''; toast('公众号二维码图片不能超过15MB', 'warning'); return; }
      const data = new FormData();
      data.append('file', file);
      api('admin/updateWebSet', data).done(function (res) {
        $('#official-qr-code-image-preview').attr('src', safeImage(res.data));
        $('#official-qr-code-image-file').val('');
        toast('公众号二维码图片已上传');
      });
    });
  }

  function initStatistics() {
    function load() {
      $('#app-count-total').html('<div class="block block-rounded block-mode-loading" style="height:150px"></div>');
      $('#app-count-list').html('<div class="col-12"><div class="block block-rounded block-mode-loading" style="height:320px"></div></div>');
      api('admin/getApplicationCount').done(function (res) {
        if (activePage !== 'statistics') return;
        const data = res.data;
        const icons = {3: 'id-card', 4: 'table-cells', 5: 'palette', 6: 'scissors', 7: 'file-export', 8: 'wand-magic-sparkles', 9: 'flag-usa', 10: 'share-nodes', 11: 'stamp', 12: 'compress', 13: 'image', 16: 'heart'};
        const colors = ['primary', 'info', 'success', 'warning', 'danger'];
        const metrics = data.applications.map(function (item, index) { return [item.name, item.useCount, icons[item.id] || 'image', colors[index % colors.length]]; });
        metrics.push(['图片上传', data.uploadCount, 'cloud-arrow-up', 'warning']);
        metrics.push(['全部订单', data.payOrderCount, 'receipt', 'primary']);
        metrics.push(['待支付订单', data.pendingOrderCount, 'clock', 'warning']);
        metrics.push(['已支付订单', data.paidOrderCount, 'circle-check', 'success']);
        metrics.push(['已退款订单', data.refundedOrderCount, 'arrow-rotate-left', 'info']);
        $('#app-count-total').html('<div class="block block-rounded border-start border-primary border-4"><div class="block-content block-content-full d-flex align-items-center justify-content-between py-4"><div><div class="fs-sm fw-semibold text-muted mb-1">总使用量</div><div class="fs-1 fw-bold">' + data.totalCount.toLocaleString('zh-CN') + '</div><div class="fs-sm text-muted mt-1">全部功能累计使用次数（不含订单数据）</div></div><div class="item item-rounded-lg bg-primary-light text-primary"><i class="fa fa-chart-column fs-3"></i></div></div></div>');
        $('#app-count-list').html(metrics.map(function (metric) { return '<div class="col-3"><div class="block block-rounded d-flex flex-column h-100 mb-0"><div class="block-header block-header-default"><h3 class="block-title">' + escapeHtml(metric[0]) + '</h3><span class="badge bg-body text-muted">累计</span></div><div class="block-content block-content-full flex-grow-1 d-flex align-items-center justify-content-between"><div class="fs-2 fw-bold">' + metric[1].toLocaleString('zh-CN') + '</div><div class="item item-rounded-lg bg-' + metric[3] + '-light text-' + metric[3] + '"><i class="fa fa-' + metric[2] + '"></i></div></div></div></div>'; }).join(''));
      }).fail(function (error) {
        if (error && error.aborted) return;
        $('#app-count-total').html('<div class="block block-rounded">' + loadError(serviceConnectionMessage, 'app-count-retry') + '</div>');
        $('#app-count-list').empty();
      });
    }
    $('#app-count-total').on('click', '.app-count-retry', load);
    load();
  }

  $('#confirm-submit').on('click', function () { bootstrap.Modal.getOrCreateInstance(document.getElementById('confirm-modal')).hide(); if (typeof confirmHandler === 'function') confirmHandler(); confirmHandler = null; });
  $('#confirm-modal').on('hidden.bs.modal', function () { confirmHandler = null; });
  $(document).on('hide.bs.modal', '.modal', function () { releaseModalFocus(this); });
  $(document).on('click', '.service-connection-retry', function () { window.location.reload(); });
  $('#logout-btn').on('click', function () { api('admin/logout').always(function () { localStorage.removeItem('token'); window.location.href = '../index.php'; }); });
  $(document).on('click', '.js-user-detail', function () { openUserDetail(Number($(this).data('user-id'))); });
  $(document).on('click', '.js-retry-user-detail', function () { openUserDetail(Number($(this).data('user-id'))); });

  const controllers = {dashboard: initDashboard, item: initItem, custom: initCustom, photo: initPhoto, payOrder: initPayOrder, userRecord: initUserRecord, statistics: initStatistics, user: initUser, feedback: initFeedback, userMap: initUserMap, appSet: initAppSet, webSetModel: initWebSetModel, clothesSet: initClothesSet, webSetBeauty: initWebSetBeauty, helpSet: initHelpSet, functionFeedback: initFunctionFeedback, webSet: initWebSet, webTask: initWebTask};

  function navigate(page, updateHistory) {
    if (!controllers[page] || page === activePage) return;
    $('#page-content').addClass('is-switching');

    // 当上一个页面还在加载时，先停止上一个请求
    if (navigationRequest) navigationRequest.abort();
    const currentRequest = $.get(page + '.php', {partial: 1});
    navigationRequest = currentRequest;
    currentRequest.done(function (html) {

      // 当响应已经不是最后一次点击的页面时，不再替换当前页面
      if (navigationRequest !== currentRequest) return;
      teardownPageUi();
      $('#page-content').html(html);
      activePage = page;
      document.body.dataset.page = page;
      $('#current-page-title').text(pageTitles[page]);
      document.title = pageTitles[page] + ' · 证件照后台';
      $('.js-page-link').removeClass('active');
      $('.js-page-link[data-page="' + page + '"]').addClass('active');
      if (updateHistory) history.pushState({page: page}, '', page + '.php');
      window.scrollTo(0, 0);
      controllers[page]();
      One.helpers('jq-magnific-popup');
    }).fail(function (xhr, status) {
      if (status === 'abort') return;
      toast('页面加载失败', 'danger');
    }).always(function () {

      // 当结束的是最后一次页面请求时，才清除当前加载状态
      if (navigationRequest === currentRequest) {
        $('#page-content').removeClass('is-switching');
        navigationRequest = null;
      }
    });
  }

  $(document).on('click', '.js-page-link', function (event) {
    event.preventDefault();
    navigate(String($(this).data('page') || 'dashboard'), true);
  });

  window.addEventListener('popstate', function () {
    const filename = window.location.pathname.split('/').pop() || 'dashboard.php';
    navigate(filename.replace(/\.php$/, '') || 'dashboard', false);
  });

  const pageContent = document.getElementById('page-content');
  if (pageContent) {
    new MutationObserver(function () {
      window.requestAnimationFrame(updateOverflowTooltips);
    }).observe(pageContent, {childList: true, subtree: true});
  }

  if (controllers[activePage]) {
    controllers[activePage]();
    One.helpers('jq-magnific-popup');
  }
})(jQuery);
