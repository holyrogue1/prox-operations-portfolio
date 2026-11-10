/* Standalone public demo: all identifiers and quantities are fictional. */
(() => {
  'use strict';
  const M = window.EagleDemo;
  const KEY = 'eagletrack-public-demo-v1';
  const $ = selector => document.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const fmt = n => n === null ? '미입력' : new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 3 }).format(n);
  const signed = n => n === null ? '미입력' : (n > 0 ? '+' : '') + fmt(n);
  const tone = n => n === null ? 'muted' : n < 0 ? 'negative' : n > 0 ? 'positive' : 'good';
  const icon = name => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  let state = M.seed();
  let storageWarning = false;
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.version === 1 && saved.projects.length) {
      saved.projects.forEach(M.validateProject);
      if (!Array.isArray(saved.history)) throw new Error('history');
      state = saved;
    }
  } catch { storageWarning = true; }
  let view = 'overview', selected = state.projects[0].id, search = '', status = '전체', editing = null;
  const project = () => state.projects.find(p => p.id === selected) || state.projects[0];
  const icons = () => window.lucide?.createIcons();
  const options = () => state.projects.map(p => `<option value="${esc(p.id)}" ${p.id === selected ? 'selected' : ''}>${esc(p.id)} / ${esc(p.name)}</option>`).join('');
  function notify(message) { $('#notice').className = 'notice'; $('#notice').textContent = message; }
  function persist(next) {
    state = next;
    try { localStorage.setItem(KEY, JSON.stringify(state)); notify('저장했습니다. 공정 수량과 자재비를 다시 계산했습니다.'); }
    catch { notify('현재 화면에 반영했습니다. 브라우저 저장 공간을 사용할 수 없어 새로 열면 초기화됩니다.'); }
  }
  function pair(label, base, actual, unit = '원') {
    const max = Math.max(base ?? 0, actual ?? 0, 1);
    return `<div class="pair"><h3>${esc(label)}</h3><div class="bar-label bom"><span>BOM 기준</span><strong>${fmt(base)}${base === null ? '' : unit}</strong></div><div class="bar-track"><div class="bar" style="width:${(base ?? 0) / max * 100}%"></div></div><div class="bar-label production"><span>생산지시 (BOM 단가 적용)</span><strong>${fmt(actual)}${actual === null ? '' : unit}</strong></div><div class="bar-track"><div class="bar red" style="width:${(actual ?? 0) / max * 100}%"></div></div></div>`;
  }
  function stageFlow(p) {
    return `<div class="flow">${M.stages.map((name, i) => {
      const q = p.stages[i], prev = p.stages[i - 1];
      return `<div class="stage"><span>${name}</span><strong class="${q === null ? 'muted' : ''}">${q === null ? '-' : fmt(q)}</strong><span>${q === null ? '자료 없음' : esc(p.unit)}</span><small>${i && q !== null && prev !== null ? '앞 단계 대비 ' + signed(q - prev) : i ? '비교 전' : '기준 수량'}</small></div>`;
    }).join('')}</div>`;
  }
  function overview() {
    const sums = state.projects.map(M.summary);
    const matched = sums.filter(s => !s.missing && !s.mismatches).length;
    const missing = sums.filter(s => s.missing).length;
    const diffCount = sums.reduce((n, s) => n + s.materials.filter(r => r.delta !== null && r.delta !== 0).length, 0);
    const p = project(), s = M.summary(p);
    const list = state.projects.filter(p => (p.id + ' ' + p.name + ' ' + p.product).toLowerCase().includes(search.toLowerCase()) && (status === '전체' || M.summary(p).status === status));
    return `<div class="metrics"><div class="metric"><span>전체 프로젝트</span><strong>${state.projects.length}</strong><small>가상 프로젝트</small></div><div class="metric"><span>전 공정 수량 일치</span><strong class="good">${matched}</strong><small>모든 단계 입력 기준</small></div><div class="metric"><span>자료 없는 프로젝트</span><strong class="warning">${missing}</strong><small>0과 미입력을 구분</small></div><div class="metric"><span>BOM 대비 수량 차이</span><strong class="negative">${diffCount}</strong><small>원자재 행 기준</small></div></div>
    <div class="work-grid"><section class="section"><div class="section-heading"><h2>프로젝트별 진행 현황</h2><span class="meta">${list.length}개 프로젝트</span></div><div class="toolbar"><label>검색 <input id="search" type="search" value="${esc(search)}" placeholder="프로젝트 / 품목"></label><label>상태 <select id="status">${['전체', '수량 일치', '진행 중', '자료 없음'].map(x => `<option ${status === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label></div><div class="table-wrap"><table><thead><tr><th>프로젝트 / 품목</th><th>진행 상태</th><th class="num">계약</th><th class="num">시공</th><th class="num">잔량</th></tr></thead><tbody>${list.map(p => {
      const s = M.summary(p);
      return `<tr class="${p.id === selected ? 'selected' : ''}"><td><button class="project-pick" data-project="${esc(p.id)}">${esc(p.id)} ${icon('chevron-right')}</button><p>${esc(p.name)}</p><p class="meta">${esc(p.product)}</p></td><td><span class="status ${s.status === '수량 일치' ? 'good' : 'warning'}">${s.status}</span></td><td class="num">${fmt(p.stages[0])} ${esc(p.unit)}</td><td class="num">${fmt(p.stages[4])}</td><td class="num ${s.remaining !== null && s.remaining < 0 ? 'negative' : ''}">${fmt(s.remaining)}</td></tr>`;
    }).join('') || '<tr><td colspan="5">검색 결과가 없습니다.</td></tr>'}</tbody></table></div></section>
    <section class="section"><div class="section-heading"><h2>선택 프로젝트</h2><button data-edit="project" class="small-action">${icon('pencil')}수정</button></div><p class="meta">${esc(p.id)} / ${esc(p.method)}</p><h2>${esc(p.name)}</h2><p>${esc(p.product)}</p>${stageFlow(p)}<button class="primary" data-edit="stage">${icon('clipboard-plus')}공정 실적 입력</button><p class="table-note">각 단계의 누적 수량 기준</p><hr class="divider"><div class="section-heading"><h3>자재비 비교</h3><button data-view="materials" class="small-action">자재 상세 ${icon('arrow-right')}</button></div><div class="bars">${pair('비교 가능한 자재 소계', s.comparable ? s.base : null, s.comparable ? s.actual : null)}</div><p class="table-note">${s.comparable}/${s.total}개 자재 비교 / 같은 BOM 단가, 같은 생산 수량 기준</p></section></div>`;
  }
  function materials() {
    const p = project(), s = M.summary(p);
    return `<div class="toolbar"><label>프로젝트 <select id="project-select">${options()}</select></label><button data-edit="material">${icon('plus')}원자재 등록</button></div>
    <section class="section"><div class="section-heading"><div><h2>${esc(p.product)} 자재비 비교</h2><p class="meta">${esc(p.name)} / ${esc(p.method)} / 완제품 생산지시 ${fmt(p.stages[2])} ${esc(p.unit)}</p></div><span class="meta">BOM 파랑 / 생산지시 빨강</span></div>
    <div class="comparison-totals"><div><p class="bom">BOM 필요량 기준</p><strong class="amount bom">${s.comparable ? fmt(s.base) + '원' : '미입력'}</strong></div><div><p class="production">생산지시량 × BOM 단가</p><strong class="amount production">${s.comparable ? fmt(s.actual) + '원' : '미입력'}</strong></div><div><p>금액 차이 (지시 - BOM)</p><strong class="amount ${tone(s.comparable ? s.delta : null)}">${s.comparable ? signed(s.delta) + '원' : '미입력'}</strong></div></div>
    <div class="work-grid"><div class="bars">${s.materials.map(r => pair(r.name, r.base, r.actual)).join('') || '<p class="empty">등록된 원자재가 없습니다.</p>'}</div><div><h3>원자재 수량 차이</h3><div class="bars">${s.materials.map(r => `<div><div class="bar-label"><span>${esc(r.name)}</span><strong class="${tone(r.delta)}">${signed(r.delta)} ${r.delta === null ? '' : esc(r.unit)}</strong></div><p class="meta">필요 ${fmt(r.expected)} / 지시 ${fmt(r.issued)} ${esc(r.unit)}</p></div>`).join('')}</div></div></div>
    <p class="table-note">비교 ${s.comparable}/${s.total}개 자재. 필요한 양은 완제품 생산지시량 × 제품 1${esc(p.unit)}당 소요량입니다. 생산지시는 실제 투입 실적이 아닙니다.</p></section>
    <section class="section"><div class="section-heading"><h2>원자재별 계산 근거</h2><span class="meta">동일 단위 / BOM 단가 기준</span></div><div class="table-wrap"><table><thead><tr><th>원자재 / 규격</th><th class="num">1${esc(p.unit)}당 소요량</th><th class="num">BOM 필요량</th><th class="num">생산지시량</th><th class="num">BOM 단가</th><th class="num">금액 차이</th><th>수정</th></tr></thead><tbody>${s.materials.map(r => `<tr><td><strong>${esc(r.name)}</strong><p class="meta">${esc(r.id)} / ${esc(r.spec)} / ${esc(r.unit)}</p></td><td class="num">${fmt(r.usage)}</td><td class="num">${fmt(r.expected)}</td><td class="num">${fmt(r.issued)}</td><td class="num">${fmt(r.price)}원</td><td class="num ${tone(r.amountDelta)}">${signed(r.amountDelta)}${r.amountDelta === null ? '' : '원'}</td><td><button class="icon-button" data-material="${esc(r.id)}" aria-label="${esc(r.name)} 수정" title="${esc(r.name)} 수정">${icon('pencil')}</button></td></tr>`).join('') || '<tr><td colspan="7">원자재를 등록해 주세요.</td></tr>'}</tbody></table></div></section>`;
  }
  function differences(event) {
    if (!event.before) return ['프로젝트 최초 등록'];
    const changes = [];
    M.stages.forEach((s, i) => { if (event.before.stages[i] !== event.after.stages[i]) changes.push(`${s}: ${fmt(event.before.stages[i])} → ${fmt(event.after.stages[i])} ${event.after.unit}`); });
    ['name', 'product', 'method'].forEach((key, i) => { if (event.before[key] !== event.after[key]) changes.push(`${['현장명', '품목', '공법'][i]}: ${event.before[key]} → ${event.after[key]}`); });
    event.after.materials.forEach(m => {
      const prev = event.before.materials.find(r => r.id === m.id);
      if (!prev) changes.push(`${m.name}: 새 원자재 등록`);
      else ['name', 'spec', 'unit', 'usage', 'price', 'issued'].forEach((key, i) => { if (prev[key] !== m[key]) changes.push(`${m.name} / ${['이름', '규격', '단위', '소요량', 'BOM 단가', '생산지시량'][i]}: ${prev[key] ?? '미입력'} → ${m[key] ?? '미입력'}`); });
    });
    return changes.length ? changes : ['동일한 값으로 저장'];
  }
  function history() {
    return `<section class="section"><div class="section-heading"><h2>입력과 변경 기록</h2><span class="meta">${state.history.length}건 / 이 브라우저</span></div><div class="event-list">${state.history.map(e => `<article class="event"><time datetime="${esc(e.at)}">${new Date(e.at).toLocaleString('ko-KR')}</time><div><strong>${esc(e.projectId)} / ${esc(e.action)}</strong><p>작성: 데모 사용자</p><ul>${differences(e).map(d => `<li>${esc(d)}</li>`).join('')}</ul></div></article>`).join('') || '<p class="empty">아직 변경 기록이 없습니다.</p>'}</div></section>`;
  }
  function render() {
    $('#page-title').textContent = { overview: '통합 현황', materials: 'BOM 자재 비교', history: '변경 이력' }[view];
    document.querySelectorAll('.app-nav [data-view]').forEach(b => b.setAttribute('aria-current', b.dataset.view === view ? 'page' : 'false'));
    $('#content').innerHTML = view === 'overview' ? overview() : view === 'materials' ? materials() : history();
    icons();
  }
  const field = (label, name, value, type = 'text', extra = '') => `<label>${label}<input name="${name}" type="${type}" value="${esc(value)}" ${type === 'number' ? 'min="0" max="1000000" step="0.001"' : 'maxlength="80"'} ${extra}></label>`;
  function openEditor(type, materialId) {
    const p = project(), m = p.materials.find(m => m.id === materialId);
    editing = { type, materialId };
    const titles = { new: '프로젝트 등록', project: '프로젝트 수정', stage: '공정 실적 입력', material: m ? '원자재 수정' : '원자재 등록', reset: '가상 데이터 초기화' };
    $('#editor-title').textContent = titles[type];
    $('#form-error').textContent = '';
    if (type === 'reset') $('#fields').innerHTML = '<p>이 브라우저의 입력 내용과 변경 이력을 지우고 최초 가상 데이터로 되돌립니다.</p>';
    else if (type === 'new' || type === 'project') $('#fields').innerHTML = `<div class="form-grid">${field('프로젝트 이름', 'name', type === 'new' ? '' : p.name, 'text', 'required')}${field('완제품 이름', 'product', type === 'new' ? '' : p.product, 'text', 'required')}<label>설치 형태<select name="method">${['앙카식', '기초식'].map(x => `<option ${p.method === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label><label>완제품 단위<select name="unit" ${type === 'project' ? 'disabled' : ''}>${['m', '개', '경간'].map(x => `<option ${p.unit === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>${field('수주 계약 수량', 'qty', type === 'new' ? '' : p.stages[0], 'number', 'required')}</div>`;
    else if (type === 'stage') $('#fields').innerHTML = `<p class="form-context">${esc(p.id)} / ${esc(p.product)} / 단위 ${esc(p.unit)}</p><div class="form-grid">${M.stages.slice(1).map((s, i) => field(s + ' 누적 수량', 'stage' + (i + 1), p.stages[i + 1] ?? '', 'number')).join('')}</div><p class="table-note">공란은 미입력, 숫자 0은 실적 0입니다.</p>`;
    else $('#fields').innerHTML = `<p class="form-context">${esc(p.product)} / 제품 1${esc(p.unit)} 기준</p><div class="form-grid">${field('원자재 이름', 'name', m?.name || '', 'text', 'required')}${field('규격', 'spec', m?.spec || '', 'text', 'required')}<label>원자재 단위<select name="unit">${['개', 'm', 'kg', '세트', '㎡'].map(x => `<option ${m?.unit === x ? 'selected' : ''}>${x}</option>`).join('')}</select></label>${field('제품 1' + p.unit + '당 소요량', 'usage', m?.usage ?? '', 'number', 'required')}${field('BOM 단가 (원)', 'price', m?.price ?? '', 'number', 'required')}${field('생산지시 원자재 수량', 'issued', m?.issued ?? '', 'number')}</div><p class="table-note">소요량·생산지시량·단가는 선택한 원자재 단위 기준입니다.</p>`;
    icons(); $('#editor').showModal();
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.view) { view = b.dataset.view; render(); }
    else if (b.dataset.project) { selected = b.dataset.project; render(); }
    else if (b.dataset.material) openEditor('material', b.dataset.material);
    else if (b.dataset.edit) openEditor(b.dataset.edit);
    else if (b.hasAttribute('data-close')) $('#editor').close();
    else if (b.id === 'new-project') openEditor('new');
    else if (b.id === 'reset') openEditor('reset');
  });
  document.addEventListener('change', e => {
    if (e.target.id === 'project-select') { selected = e.target.value; render(); }
    if (e.target.id === 'status') { status = e.target.value; render(); }
  });
  document.addEventListener('input', e => {
    if (e.target.id === 'search') { const caret = e.target.selectionStart; search = e.target.value; render(); $('#search').focus(); $('#search').setSelectionRange(caret, caret); }
  });
  $('#editor-form').addEventListener('submit', e => {
    e.preventDefault();
    try {
      const f = new FormData(e.target), get = key => String(f.get(key) ?? '').trim();
      const optional = key => get(key) === '' ? null : M.number(get(key), '수량');
      let p = M.clone(project());
      if (editing.type === 'reset') { persist(M.seed()); selected = state.projects[0].id; search = ''; status = '전체'; }
      else {
        if (editing.type === 'new') {
          const index = Math.max(...state.projects.map(p => Number(p.id.split('-')[1]) || 0)) + 1;
          p = { id: 'DEMO-' + String(index).padStart(3, '0'), name: get('name'), product: get('product'), method: get('method'), unit: get('unit'), stages: [M.number(get('qty'), '계약 수량'), null, null, null, null], materials: [] };
        } else if (editing.type === 'project') { Object.assign(p, { name: get('name'), product: get('product'), method: get('method') }); p.stages[0] = M.number(get('qty'), '계약 수량'); }
        else if (editing.type === 'stage') M.stages.slice(1).forEach((_, i) => { p.stages[i + 1] = optional('stage' + (i + 1)); });
        else {
          const row = { id: editing.materialId || 'MAT-USER-' + String(Date.now()), name: get('name'), spec: get('spec'), unit: get('unit'), usage: M.number(get('usage'), '소요량'), price: M.number(get('price'), '단가'), issued: optional('issued') };
          const i = p.materials.findIndex(m => m.id === row.id);
          if (i < 0) p.materials.push(row); else p.materials[i] = row;
        }
        persist(M.save(state, p, $('#editor-title').textContent)); selected = p.id;
      }
      $('#editor').close(); render();
    } catch (error) { $('#form-error').textContent = error.message; }
  });
  render();
  if (storageWarning) notify('저장 자료를 읽을 수 없어 최초 가상 데이터를 표시합니다.');
})();
