const test = require('node:test');
const assert = require('node:assert/strict');
const M = require('../model.js');

test('synthetic baseline, same BOM price on both sides', () => {
  const s = M.summary(M.seed().projects[0]);
  assert.equal(s.base, 930000); assert.equal(s.actual, 956500);
  assert.equal(s.delta, 26500); assert.equal(s.remaining, 40);
  assert.equal(s.status, '진행 중');
});
test('stage changes update BOM requirements, not order quantity', () => {
  const p = M.seed().projects[0]; p.stages[2] = 50;
  assert.equal(M.rows(p)[0].expected, 60);
  assert.equal(M.rows(p)[0].base, 240000);
});
test('missing stage is not zero and cannot become normal', () => {
  const p = M.seed().projects[0]; p.stages[2] = null;
  assert.equal(M.rows(p)[0].delta, null);
  assert.equal(M.summary(p).comparable, 0);
  assert.equal(M.summary(p).status, '자료 없음');
});
test('zero quantity and zero price are valid values', () => {
  const p = M.seed().projects[0]; p.stages[2] = 0;
  p.materials[0].price = 0; p.materials[0].issued = 0;
  assert.equal(M.rows(p)[0].base, 0); assert.equal(M.rows(p)[0].delta, 0);
});
test('incomplete rows do not contribute invented zeros to comparison', () => {
  const p = M.seed().projects[0]; p.materials[0].issued = null;
  const s = M.summary(p); assert.equal(s.comparable, 3);
  assert.equal(s.base, 450000); assert.equal(s.actual, 452500);
});
test('overrun is negative remaining, increased contract opens remaining', () => {
  const p = M.seed().projects[0]; p.stages[4] = 110;
  assert.equal(M.summary(p).remaining, -10);
  p.stages[0] = 120; assert.equal(M.summary(p).remaining, 10);
});
test('updates preserve previous state and before/after history', () => {
  const s = M.seed(), p = M.clone(s.projects[0]); p.stages[4] = 100;
  const next = M.save(s, p, '공정 입력', '2026-01-01T00:00:00Z');
  assert.equal(s.projects[0].stages[4], 60);
  assert.equal(next.history[0].before.stages[4], 60);
  assert.equal(next.history[0].after.stages[4], 100);
});
test('negative and invalid numbers are rejected', () => {
  for (const n of [-1, '', null, Infinity, NaN, 1000001, 'bad']) assert.throws(() => M.number(n, '수량'));
});
test('fractional quantities retain precision and amounts round per row', () => {
  assert.equal(M.money(1.25, 101), 126);
  const p = M.seed().projects[0]; p.stages[2] = 0.1; p.materials[0].usage = 0.2;
  assert.equal(M.rows(p)[0].expected, 0.02);
});
test('fractional unit price is rejected', () => {
  const p = M.seed().projects[0]; p.materials[0].price = 1.5;
  assert.throws(() => M.save(M.seed(), p, 'test'));
});
test('all five equal stages marked quantity match', () => {
  assert.equal(M.summary(M.seed().projects[1]).status, '수량 일치');
});
test('new project stores explicit missing downstream stages', () => {
  const p = { id: 'DEMO-004', name: '가상 현장', product: 'TEST', method: '기초식', unit: 'm', stages: [20, null, null, null, null], materials: [] };
  const s = M.save(M.seed(), p, '등록');
  assert.equal(s.projects.length, 4); assert.equal(s.history[0].before, null);
});
