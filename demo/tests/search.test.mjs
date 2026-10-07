import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = fs.readFileSync(new URL("../source/demo.js", import.meta.url), "utf8");

function createDemo(page = "orders") {
  const elements = new Map();
  const listeners = new Map();
  const getElement = (id) => {
    if (!elements.has(id)) elements.set(id, {
      innerHTML: "", textContent: "", hidden: false,
      addEventListener() {}, setAttribute() {}, focus() {},
      classList: { remove() {} },
    });
    return elements.get(id);
  };
  class FixedDate extends Date {
    constructor(...args) {
      super(...(args.length ? args : [2026, 9, 7, 12]));
    }
  }
  const context = vm.createContext({
    Date: FixedDate,
    FormData: class {
      constructor(form) { this.entries = Object.entries(form.values); }
      [Symbol.iterator]() { return this.entries[Symbol.iterator](); }
    },
    document: {
      getElementById: getElement,
      addEventListener: (name, callback) => listeners.set(name, callback),
    },
    window: { ProxDemoIcons: {}, addEventListener() {}, scrollTo() {} },
  });
  vm.runInContext(source, context);
  const click = (action, extra = {}) => {
    const target = { dataset: { action, ...extra }, disabled: false };
    listeners.get("click")({ target: { closest: () => target } });
  };
  click("navigate", { page });
  return {
    click,
    search(q, extra = {}) {
      listeners.get("submit")({
        preventDefault() {},
        target: { id: "filter-form", values: { q, from: "", to: "", status: "", ...extra } },
      });
      return this.total();
    },
    total() {
      return Number(getElement("workspace").innerHTML.match(/총 (\d+)건/)[1]);
    },
    html: () => getElement("workspace").innerHTML,
    status: () => getElement("filter-status").textContent,
  };
}

for (const [label, query, count] of [
  ["project code", "DEMO-001", 1],
  ["case and surrounding whitespace", "  demo-001  ", 1],
  ["corporation", "가상 A법인", 3],
  ["site", "한빛 보행로", 2],
  ["client", "가상 발주처 A", 3],
  ["sales contact", "데모 영업 1", 4],
  ["construction contact", "데모 공사 2", 6],
  ["nested item name", "가상 보행로 난간", 12],
  ["second nested item", "가상 연결 부속", 12],
  ["nested specification", "w2000", 12],
  ["nested unit", "EA", 12],
  ["object stringification regression", "[object Object]", 0],
  ["amounts excluded", "5500000", 0],
  ["quantities excluded", "36", 0],
  ["empty search", "", 12],
  ["whitespace-only search", "   ", 12],
  ["unknown query", "unknown project", 0],
]) {
  test(`search: ${label}`, () => {
    assert.equal(createDemo().search(query), count);
  });
}

test("item search combines with the inclusive date range", () => {
  assert.equal(createDemo().search("가상 보행로 난간", {
    from: "2026-10-01", to: "2026-10-07",
  }), 1);
});

test("item search combines with status", () => {
  assert.equal(createDemo("sales").search("가상 보행로 난간", { status: "완료" }), 3);
});

test("invalid date range leaves the previous results unchanged", () => {
  const demo = createDemo();
  demo.search("DEMO-001");
  assert.equal(demo.search("", { from: "2026-10-07", to: "2026-10-01" }), 1);
  assert.match(demo.status(), /시작일은 종료일보다 늦을 수 없습니다/);
});

test("new search resets pagination and empty results can be cleared", () => {
  const demo = createDemo();
  demo.click("next");
  assert.match(demo.html(), /2 \/ 2/);
  assert.equal(demo.search("DEMO-001"), 1);
  assert.match(demo.html(), /1 \/ 1/);
  assert.equal(demo.search("[object Object]"), 0);
  assert.match(demo.html(), /data-action="clear-filter"/);
  demo.click("clear-filter");
  assert.equal(demo.total(), 12);
});

test("search text remains escaped in the rendered input", () => {
  const demo = createDemo();
  demo.search('<script>"&');
  assert.match(demo.html(), /value="&lt;script&gt;&quot;&amp;"/);
  assert.ok(!demo.html().includes('<script>"&'));
});
