/* Independent synthetic prototype. No application imports or network/persistence APIs. */
(() => {
  "use strict";
  const icons = window.ProxDemoIcons;
  const icon = (name) => icons[name] || "";
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const money = (value) => `${Math.round(value).toLocaleString("ko-KR")}원`;
  const quantity = (value) => Number(value).toLocaleString("ko-KR");
  const localDate = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")].join("-");
  const today = new Date();
  const relativeDate = (days) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + days);
    return localDate(date);
  };
  const names = ["가상 한빛 보행로 정비공사", "가상 청솔 공원 난간공사", "가상 별빛 광장 정비공사",
    "가상 은하 보행교 개선공사", "가상 산들 마을 쉼터공사", "가상 푸른 교육관 정비공사"];
  const corporations = ["가상 A법인", "가상 B법인", "가상 C법인", "가상 D법인"];
  const seedOrders = () => Array.from({ length: 12 }, (_, index) => {
    const amount = (index + 4) * 1375000;
    const count = 36 + index * 7;
    return {
      id: index + 1, code: `DEMO-${String(index + 1).padStart(3, "0")}`,
      corp: corporations[index % corporations.length], site: names[index % names.length],
      client: `가상 발주처 ${String.fromCharCode(65 + index % 4)}`,
      owner: `데모 영업 ${index % 3 + 1}`, manager: `데모 공사 ${index % 2 + 1}`,
      date: relativeDate(-index * 7), due: relativeDate(7 + index * 3), amount,
      status: index < 3 ? "완료" : "진행", paid: index < 2 ? amount : Math.round(amount * (index % 3) / 4),
      lines: [
        { name: "가상 보행로 난간", spec: "W2000 × H1100", qty: count, unit: "M" },
        { name: "가상 연결 부속", spec: "표준형", qty: count * 2, unit: "EA" },
      ],
    };
  });
  const seedProducts = () => [
    { id: 1, name: "가상 보행로 난간", spec: "W2000 × H1100", lines: [
      { name: "가상 금속 자재", group: "자재", price: 24500, qty: 2 },
      { name: "가상 연결 부속", group: "자재", price: 3200, qty: 4 },
      { name: "가상 설치 작업", group: "시공", price: 18000, qty: 1 },
    ] },
    { id: 2, name: "가상 공원 울타리", spec: "W1800 × H1200", lines: [
      { name: "가상 패널", group: "자재", price: 36200, qty: 1 },
      { name: "가상 기둥", group: "자재", price: 15800, qty: 2 },
      { name: "가상 설치 작업", group: "시공", price: 21000, qty: 1 },
    ] },
    { id: 3, name: "가상 쉼터 구조물", spec: "표준형", lines: [
      { name: "가상 프레임", group: "자재", price: 86400, qty: 1 },
      { name: "가상 조립 작업", group: "시공", price: 34000, qty: 1 },
      { name: "가상 운반", group: "경비", price: 12000, qty: 1 },
    ] },
  ];
  const navigation = [
    ["dashboard", "대시보드", "House"], ["orders", "수주현황", "ClipboardList"],
    ["construction", "시공현황", "Wrench"], ["sales", "영업현황", "TrendingUp"],
    ["receivables", "수금현황", "ReceiptText"], ["cost", "원가계산", "Calculator"],
    ["recon", "결산대사", "ClipboardCheck"],
  ];
  let orders = seedOrders();
  let products = seedProducts();
  let productId = 1;
  let active = "dashboard";
  let selectedPage = 1;
  const filters = {};
  const workspace = document.getElementById("workspace");
  const dialogLayer = document.getElementById("dialog-layer");
  let returnFocus = null;
  let messages = [
    { subject: "가상 보행로 자재 확인", body: "가상 일정에 맞춰 자재 목록을 확인했습니다.", recipient: "데모 공사 1" },
    { subject: "가상 공원 공사 일정", body: "가상 현장 일정 확인을 요청합니다.", recipient: "데모 영업 2" },
  ];

  const button = (label, action, symbol, primary = false, extra = "") =>
    `<button type="button" data-action="${action}" class="${primary ? "primary" : ""}" ${extra}>${icon(symbol)}${escape(label)}</button>`;
  const empty = () => `<div class="empty"><span>조건에 맞는 가상 자료가 없습니다.</span>${button("조건 초기화", "clear-filter", "RotateCcw")}</div>`;
  const heading = (title, actions = "") => `<div class="page-heading"><div><h1>${title}</h1><p class="subtitle">가상 법인 4개 · 가상 프로젝트 12개</p></div>${actions}</div>`;
  const section = (title, contents, action = "") => `<section class="section"><div class="section-heading"><h2>${title}</h2>${action}</div>${contents}</section>`;
  const projectLink = (row) => `<button type="button" class="row-button" data-action="project" data-id="${row.id}">${escape(row.code)}</button>`;

  function table(columns, rows, name, ledger = true) {
    if (!rows.length) return empty();
    return `<div class="table-region" role="region" aria-label="${escape(name)}" tabindex="0"><table class="wide-table ${ledger ? "ledger" : ""}"><thead><tr>${columns.map((column) =>
      `<th scope="col" class="${column.number ? "number" : ""}">${escape(column.label)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${columns.map((column) =>
      `<td data-label="${escape(column.label)}" class="${column.number ? "number" : ""} ${column.full ? "full" : ""}">${column.render ? column.render(row) : escape(row[column.key])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function pager(total) {
    const pages = Math.max(1, Math.ceil(total / 8));
    return `<div class="pagination"><span class="muted">총 ${total}건</span><button type="button" class="icon-button" data-action="previous" title="이전 페이지" aria-label="이전 페이지" ${selectedPage <= 1 ? "disabled" : ""}>${icon("ChevronLeft")}</button><span>${selectedPage} / ${pages}</span><button type="button" class="icon-button" data-action="next" title="다음 페이지" aria-label="다음 페이지" ${selectedPage >= pages ? "disabled" : ""}>${icon("ChevronRight")}</button></div>`;
  }

  function filterSection(dated = true) {
    const current = filters[active] || { q: "", from: "", to: "", status: "" };
    return section("조회 조건", `<div class="section-content"><form id="filter-form" class="filters ${dated ? "" : "simple"}"><label>검색<input type="search" name="q" value="${escape(current.q)}" placeholder="프로젝트, 현장명, 가상 담당자" /></label>${dated ?
      `<label>등록일 From<input type="date" name="from" value="${current.from}" /></label><label>등록일 To<input type="date" name="to" value="${current.to}" /></label>` :
      `<label>상태<select name="status"><option value="">전체</option><option ${current.status === "진행" ? "selected" : ""}>진행</option><option ${current.status === "완료" ? "selected" : ""}>완료</option></select></label>`}<button class="primary" type="submit">${icon("Search")}검색</button></form>${dated ? `<div class="filter-presets" role="group" aria-label="조회 기간">${[ ["month", "이번 달"], ["quarter", "이번 분기"], ["year", "올해"], ["all", "전체 기간"] ].map(([key, label]) =>
      `<button type="button" data-action="preset" data-preset="${key}">${label}</button>`).join("")}</div>` : ""}<p id="filter-status" class="status danger" role="status"></p></div>`);
  }

  function filteredRows() {
    const current = filters[active] || { q: "", from: "", to: "", status: "" };
    return orders.filter((row) => (!current.q || Object.values(row).some((value) =>
      String(value).toLowerCase().includes(current.q.toLowerCase()))) &&
      (!current.from || row.date >= current.from) && (!current.to || row.date <= current.to) &&
      (!current.status || row.status === current.status));
  }

  function dashboard() {
    const remaining = orders.reduce((sum, row) => sum + row.amount - row.paid, 0);
    const compactRemaining = remaining >= 100000000 ? `${(remaining / 100000000).toFixed(2)}억원`
      : `${Math.round(remaining / 10000).toLocaleString("ko-KR")}만원`;
    return heading("대시보드", button("메시지 작성", "compose", "Send", true)) +
      `<div class="metric-strip"><div class="metric"><span>가상 수주</span><strong>${orders.length}건</strong></div><div class="metric"><span>가상 진행 현장</span><strong>${orders.filter((row) => row.status === "진행").length}건</strong></div><div class="metric"><span>가상 미수금</span><strong>${compactRemaining}</strong></div></div>` +
      `<div class="dashboard-grid">${section("담당 프로젝트", table([
        { label: "프로젝트", render: projectLink }, { label: "현장명", key: "site", full: true },
        { label: "가상 담당자", key: "owner" }, { label: "납품예정일", key: "due" },
      ], orders.slice(0, 5), "담당 프로젝트"))}${section("가상 메시지", `<ul class="feed">${messages.slice(-4).reverse().map((message) => `<li><strong>${escape(message.subject)}</strong><p>${escape(message.body)}</p><span class="muted">${escape(message.recipient)}</span></li>`).join("")}</ul>`)}</div>` +
      section("다가오는 가상 일정", table([
        { label: "예정일", key: "due" }, { label: "현장명", key: "site", full: true },
        { label: "공사 담당", key: "manager" }, { label: "상태", render: (row) => `<span class="info">${row.status}</span>` },
      ], orders.slice(0, 4), "가상 일정"));
  }

  function listPage() {
    const rows = filteredRows();
    selectedPage = Math.min(selectedPage, Math.max(1, Math.ceil(rows.length / 8)));
    const selected = rows.slice((selectedPage - 1) * 8, selectedPage * 8);
    const common = [ { label: "프로젝트", render: projectLink }, { label: "법인", key: "corp" },
      { label: "현장명", key: "site", full: true } ];
    let columns;
    if (active === "orders") columns = [...common, { label: "수요처", key: "client" },
      { label: "영업 담당", key: "owner" }, { label: "공사 담당", key: "manager" },
      { label: "시공물량", number: true, render: (row) => quantity(row.lines[0].qty) + " M" },
      { label: "가상 계약금액", number: true, render: (row) => money(row.amount) },
      { label: "등록일", key: "date" }, { label: "납품예정일", key: "due" }];
    if (active === "construction") columns = [...common, { label: "공사 담당", key: "manager" },
      { label: "등록일", key: "date" }, { label: "가상 시공물량", number: true,
        render: (row) => quantity(row.status === "완료" ? row.lines[0].qty : Math.floor(row.lines[0].qty / 2)) + " M" },
      { label: "상태", render: (row) => `<span class="${row.status === "완료" ? "success" : "info"}">${row.status}</span>` }];
    if (active === "sales") columns = [...common, { label: "영업 담당", key: "owner" },
      { label: "가상 계약금액", number: true, render: (row) => money(row.amount) },
      { label: "가상 입금액", number: true, render: (row) => money(row.paid) },
      { label: "수금 상태", render: (row) => row.amount === row.paid ? '<span class="success">수금 완료</span>' : row.paid ? '<span class="info">부분 입금</span>' : "미입금" }];
    if (active === "receivables") columns = [...common, { label: "가상 청구금액", number: true,
      render: (row) => money(row.amount) }, { label: "가상 수금금액", number: true,
      render: (row) => money(row.paid) }, { label: "가상 미수금", number: true,
      render: (row) => `<span class="${row.amount > row.paid ? "warning" : "success"}">${money(row.amount - row.paid)}</span>` },
      { label: "수금예정일", key: "due" }];
    if (active === "recon") columns = [...common, { label: "가상 계약금액", number: true,
      render: (row) => money(row.amount) }, { label: "가상 비용", number: true,
      render: (row) => money(Math.round(row.amount * 0.7)) }, { label: "가상 차액", number: true,
      render: (row) => money(row.amount - Math.round(row.amount * 0.7)) }, { label: "자료 상태", render: () => "가상 예시" }];
    const title = navigation.find(([key]) => key === active)[1];
    const dated = ["orders", "construction", "recon"].includes(active);
    return heading(title) + filterSection(dated) + section("가상 자료 목록",
      table(columns, selected, title + " 목록") + pager(rows.length));
  }

  function costPage() {
    const product = products.find((row) => row.id === productId);
    const total = product.lines.reduce((sum, row) => sum + Math.round(row.price * row.qty), 0);
    return heading("원가계산") + `<div class="cost-grid">${section("가상 제품", `<div class="product-list">${products.map((row) =>
      `<button type="button" data-action="product" data-id="${row.id}" aria-pressed="${row.id === productId}"><strong>${escape(row.name)}</strong><span class="muted">${escape(row.spec)}</span></button>`).join("")}</div>`)}${section(product.name,
      `<div class="table-region cost-lines" role="region" aria-label="가상 단가 계산" tabindex="0"><table class="ledger"><thead><tr><th>항목</th><th>단가</th><th>수량</th><th>합계</th></tr></thead><tbody>${product.lines.map((row, index) => `<tr><td data-label="항목" class="full"><strong>${escape(row.name)}</strong><span class="muted"> / ${row.group}</span></td><td data-label="단가"><input type="number" min="0" max="100000000" step="1" data-cost="price" data-index="${index}" value="${row.price}" aria-label="${row.name} 단가" /></td><td data-label="수량"><input type="number" min="0" max="10000" step="0.1" data-cost="qty" data-index="${index}" value="${row.qty}" aria-label="${row.name} 수량" /></td><td data-label="합계" class="number" data-amount="${index}">${money(row.price * row.qty)}</td></tr>`).join("")}</tbody></table></div><div class="cost-total"><span>단가 × 수량 가상 합계</span><strong id="cost-total">${money(total)}</strong></div><div class="section-content"><p class="muted">회사 원가 산식·단가 자료 미포함</p><p id="cost-status" class="status danger" role="status"></p></div>`)} </div>`;
  }

  function render() {
    document.getElementById("navigation").innerHTML = navigation.map(([key, name, symbol]) =>
      `<button type="button" data-action="navigate" data-page="${key}" ${active === key ? 'aria-current="page"' : ""}>${icon(symbol)}${name}</button>`).join("");
    workspace.innerHTML = active === "dashboard" ? dashboard() : active === "cost" ? costPage() : listPage();
  }

  function closeNavigation() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("nav-backdrop").hidden = true;
    document.getElementById("menu-toggle").setAttribute("aria-expanded", "false");
  }

  function openDialog(title, body, compact = false) {
    returnFocus = document.activeElement;
    dialogLayer.innerHTML = `<div class="dialog-backdrop"><section class="dialog ${compact ? "compact" : ""}" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><header class="dialog-heading"><h2 id="dialog-title">${escape(title)}</h2><button type="button" class="icon-button" data-action="close-dialog" aria-label="닫기" title="닫기">${icon("X")}</button></header><div class="dialog-body">${body}</div></section></div>`;
    document.body.classList.add("dialog-open");
    dialogLayer.querySelector('button').focus();
  }

  function closeDialog() {
    dialogLayer.innerHTML = "";
    document.body.classList.remove("dialog-open");
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  }

  function projectDialog(id) {
    const row = orders.find((order) => order.id === id);
    if (!row) return;
    const facts = [["프로젝트", row.code], ["현장명", row.site], ["가상 법인", row.corp],
      ["가상 발주처", row.client], ["가상 영업 담당", row.owner], ["가상 공사 담당", row.manager],
      ["가상 계약금액", money(row.amount)], ["납품예정일", row.due]];
    openDialog(row.code + " / 가상 프로젝트", `<dl class="facts">${facts.map(([key, value]) =>
      `<div><dt>${escape(key)}</dt><dd>${escape(value)}</dd></div>`).join("")}</dl>${table([
        { label: "가상 제품", key: "name", full: true }, { label: "규격", key: "spec" },
        { label: "수량", number: true, render: (line) => quantity(line.qty) }, { label: "단위", key: "unit" },
      ], row.lines, "가상 프로젝트 품목")}`);
  }

  function composeDialog() {
    openDialog("가상 메시지 작성", `<form id="message-form" class="form-stack"><label>받는 대상<select name="recipient">${["데모 공사 1", "데모 공사 2", "데모 영업 1", "데모 영업 2", "데모 영업 3"].map((name) => `<option>${name}</option>`).join("")}</select></label><label>제목<input name="subject" maxlength="80" required /></label><label>메시지<textarea name="body" maxlength="500" required></textarea></label><div class="form-actions"><button type="button" data-action="close-dialog">취소</button><button type="submit" class="primary">${icon("Send")}가상 보내기</button></div></form>`, true);
  }

  document.getElementById("menu-toggle").innerHTML = icon("Menu");
  document.getElementById("reset").innerHTML = icon("RotateCcw");
  document.getElementById("menu-toggle").addEventListener("click", () => {
    const open = document.getElementById("sidebar").classList.toggle("open");
    document.getElementById("nav-backdrop").hidden = !open;
    document.getElementById("menu-toggle").setAttribute("aria-expanded", String(open));
  });
  document.getElementById("nav-backdrop").addEventListener("click", closeNavigation);
  document.getElementById("reset").addEventListener("click", () => openDialog("가상 데이터 초기화",
    `<p>이 미리보기에서 변경한 가상 단가와 메시지를 초기화할까요?</p><div class="form-actions">${button("취소", "close-dialog", "X")}${button("초기화", "confirm-reset", "RotateCcw", true)}</div>`, true));

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target || target.disabled) return;
    const action = target.dataset.action;
    if (action === "navigate") {
      active = target.dataset.page;
      selectedPage = 1;
      closeNavigation();
      render();
      workspace.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
    if (action === "project") projectDialog(Number(target.dataset.id));
    if (action === "close-dialog") closeDialog();
    if (action === "compose") composeDialog();
    if (action === "previous" || action === "next") {
      selectedPage += action === "previous" ? -1 : 1;
      render();
    }
    if (action === "clear-filter") {
      filters[active] = { q: "", from: "", to: "", status: "" };
      selectedPage = 1;
      render();
    }
    if (action === "preset") {
      const values = Object.fromEntries(new FormData(document.getElementById("filter-form")));
      const preset = target.dataset.preset;
      const firstMonth = preset === "quarter" ? Math.floor(today.getMonth() / 3) * 3 : preset === "year" ? 0 : today.getMonth();
      filters[active] = { ...values, from: preset === "all" ? "" : localDate(new Date(today.getFullYear(), firstMonth, 1)),
        to: preset === "all" ? "" : localDate(today) };
      selectedPage = 1;
      render();
    }
    if (action === "product") { productId = Number(target.dataset.id); render(); }
    if (action === "confirm-reset") {
      orders = seedOrders(); products = seedProducts(); productId = 1; messages = messages.slice(0, 2);
      for (const key of Object.keys(filters)) delete filters[key];
      selectedPage = 1; closeDialog(); render(); workspace.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  });

  document.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    if (event.target.id === "filter-form") {
      if (data.from && data.to && data.from > data.to) {
        document.getElementById("filter-status").textContent = "시작일은 종료일보다 늦을 수 없습니다.";
        return;
      }
      filters[active] = { ...data, q: (data.q || "").trim() };
      selectedPage = 1;
      render();
    }
    if (event.target.id === "message-form") {
      if (!data.subject.trim() || !data.body.trim()) return;
      messages.push(data); closeDialog(); render();
    }
  });

  document.addEventListener("input", (event) => {
    const input = event.target;
    if (!input.dataset.cost) return;
    const product = products.find((row) => row.id === productId);
    const line = product.lines[Number(input.dataset.index)];
    const value = Number(input.value);
    const maximum = input.dataset.cost === "price" ? 100000000 : 10000;
    if (!Number.isFinite(value) || value < 0 || value > maximum || input.value === "") {
      document.getElementById("cost-status").textContent = "허용 범위 안의 0 이상 숫자를 입력하세요.";
      input.setAttribute("aria-invalid", "true");
      return;
    }
    input.removeAttribute("aria-invalid");
    document.getElementById("cost-status").textContent = "";
    line[input.dataset.cost] = input.dataset.cost === "price" ? Math.round(value) : value;
    document.querySelector(`[data-amount="${input.dataset.index}"]`).textContent = money(line.price * line.qty);
    document.getElementById("cost-total").textContent = money(product.lines.reduce((sum, row) => sum + Math.round(row.price * row.qty), 0));
  });

  document.addEventListener("keydown", (event) => {
    const dialog = dialogLayer.querySelector(".dialog");
    if (event.key === "Escape") {
      if (dialog) closeDialog(); else closeNavigation();
    }
    if (event.key !== "Tab" || !dialog) return;
    const elements = [...dialog.querySelectorAll('button:not(:disabled), input, select, textarea, [tabindex="0"]')];
    const first = elements[0], last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  window.addEventListener("hashchange", () => {
    if (location.hash === "#dashboard") { active = "dashboard"; selectedPage = 1; closeNavigation(); render(); window.scrollTo(0, 0); }
  });
  render();
})();
