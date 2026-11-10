/* Independently authored synthetic portfolio model. No production dependencies. */
(function (root) {
  'use strict';
  const stages = ['수주', '품의', '생산지시', '출고', '시공'];
  const clone = value => JSON.parse(JSON.stringify(value));
  function seed() {
    return { version: 1, projects: [
      { id: 'DEMO-001', name: '가상 서쪽 산책로', product: 'DEMO-FENCE-A', method: '앙카식', unit: 'm', stages: [100, 100, 100, 80, 60], materials: [
        { id: 'MAT-01', name: '기둥 파이프', spec: '데모 규격 A', unit: 'm', usage: 1.2, price: 4000, issued: 126 },
        { id: 'MAT-02', name: '고정 볼트', spec: '데모 규격 B', unit: '개', usage: 4, price: 500, issued: 420 },
        { id: 'MAT-03', name: '보호 캡', spec: '데모 규격 C', unit: '개', usage: 0.5, price: 2000, issued: 50 },
        { id: 'MAT-04', name: '연결 브래킷', spec: '데모 규격 D', unit: '개', usage: 1, price: 1500, issued: 95 }
      ] },
      { id: 'DEMO-002', name: '가상 동쪽 보행로', product: 'DEMO-FENCE-B', method: '기초식', unit: 'm', stages: [80, 80, 80, 80, 80], materials: [
        { id: 'MAT-11', name: '기초 기둥', spec: '데모 규격 E', unit: 'm', usage: 1.5, price: 5000, issued: 120 },
        { id: 'MAT-12', name: '연결 밴드', spec: '데모 규격 F', unit: '개', usage: 2, price: 800, issued: 160 }
      ] },
      { id: 'DEMO-003', name: '가상 북쪽 안전 구간', product: 'DEMO-GUARD-C', method: '기초식', unit: 'm', stages: [60, 60, 54, null, null], materials: [
        { id: 'MAT-21', name: '방호 패널', spec: '데모 규격 G', unit: '개', usage: 0.5, price: 12000, issued: 27 },
        { id: 'MAT-22', name: '지지대', spec: '데모 규격 H', unit: 'm', usage: 2, price: 4500, issued: 108 }
      ] }
    ], history: [] };
  }
  function number(value, label) {
    if (value === '' || value === null || !Number.isFinite(Number(value)) || Number(value) < 0 || Number(value) > 1000000) throw new Error(label + ': 0 이상 1,000,000 이하로 입력해 주세요.');
    return Number(value);
  }
  function money(qty, price) { return Math.round(qty * price); }
  function rows(project) {
    return project.materials.map(m => {
      const expected = project.stages[2] === null ? null : Math.round(project.stages[2] * m.usage * 1000000) / 1000000;
      const base = expected === null ? null : money(expected, m.price);
      const actual = m.issued === null ? null : money(m.issued, m.price);
      return { ...m, expected, base, actual, delta: expected === null || m.issued === null ? null : Math.round((m.issued - expected) * 1000000) / 1000000, amountDelta: base === null || actual === null ? null : actual - base };
    });
  }
  function summary(project) {
    const materials = rows(project);
    const comparable = materials.filter(r => r.base !== null && r.actual !== null);
    const missing = project.stages.filter(q => q === null).length;
    const mismatches = project.stages.slice(1).filter((q, i) => q !== null && project.stages[i] !== null && q !== project.stages[i]).length;
    return { materials, comparable: comparable.length, total: materials.length,
      base: comparable.reduce((sum, r) => sum + r.base, 0),
      actual: comparable.reduce((sum, r) => sum + r.actual, 0),
      delta: comparable.reduce((sum, r) => sum + r.amountDelta, 0),
      remaining: project.stages[4] === null ? null : project.stages[0] - project.stages[4],
      status: missing ? '자료 없음' : mismatches ? '진행 중' : '수량 일치', missing, mismatches };
  }
  function validateProject(p) {
    if (!p.id || !p.name || !p.product || !['기초식', '앙카식'].includes(p.method) || !['m', '개', '경간'].includes(p.unit)) throw new Error('프로젝트와 품목 정보를 확인해 주세요.');
    if (p.stages.length !== 5 || p.stages[0] === null) throw new Error('수주 수량이 필요합니다.');
    p.stages.forEach(q => { if (q !== null) number(q, '공정 수량'); });
    p.materials.forEach(m => {
      if (!m.id || !m.name || !m.unit) throw new Error('자재 이름과 단위가 필요합니다.');
      number(m.usage, '소요량'); number(m.price, '단가');
      if (!Number.isInteger(m.price)) throw new Error('단가는 정수 원 단위로 입력해 주세요.');
      if (m.issued !== null) number(m.issued, '생산지시량');
    });
  }
  function save(state, project, action, at = new Date().toISOString()) {
    validateProject(project);
    const previous = state.projects.find(p => p.id === project.id);
    const next = clone(state);
    const index = next.projects.findIndex(p => p.id === project.id);
    if (index < 0) next.projects.push(clone(project)); else next.projects[index] = clone(project);
    next.history.unshift({ id: at + '-' + next.history.length, at, projectId: project.id, action, before: previous ? clone(previous) : null, after: clone(project) });
    return next;
  }
  const api = { stages, seed, clone, number, money, rows, summary, save, validateProject };
  if (typeof module !== 'undefined') module.exports = api;
  else root.EagleDemo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
