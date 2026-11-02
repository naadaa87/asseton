/* 홈 히어로 — 점검 기록 → 작업지시 → 월간 보고 (한 번만 재생) */
(function () {
  const stage = document.querySelector('[data-flow]');
  if (!stage) return;
  const A = stage.querySelector('[data-a]');
  const B = stage.querySelector('[data-b]');
  const C = stage.querySelector('[data-c]');
  const svg = stage.querySelector('svg.wire');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawWires() {
    if (getComputedStyle(svg).display === 'none') return;
    const s = stage.getBoundingClientRect();
    svg.setAttribute('width', s.width); svg.setAttribute('height', s.height);
    svg.setAttribute('viewBox', `0 0 ${s.width} ${s.height}`);
    const r = (el) => { const b = el.getBoundingClientRect(); return { l: b.left - s.left, t: b.top - s.top, r: b.right - s.left, b: b.bottom - s.top, w: b.width, h: b.height }; };
    const a = r(A), b = r(B), c = r(C);
    const p1 = `M ${a.l + a.w * 0.62} ${a.b} C ${a.l + a.w * 0.62} ${b.t + b.h * 0.5}, ${b.l - 40} ${b.t + b.h * 0.5}, ${b.l} ${b.t + b.h * 0.5}`;
    const p2 = `M ${b.r} ${b.t + b.h * 0.4} C ${b.r + 40} ${b.t + b.h * 0.4}, ${c.l + c.w * 0.4} ${c.b + 40}, ${c.l + c.w * 0.4} ${c.b}`;
    svg.querySelector('.w1').setAttribute('d', p1);
    svg.querySelector('.w2').setAttribute('d', p2);
    svg.querySelector('.p1').setAttribute('d', p1);
    svg.querySelector('.p2').setAttribute('d', p2);
  }

  const flagRow = stage.querySelector('[data-flag]');
  const flagBox = stage.querySelector('[data-flag-box]');
  const flagChip = stage.querySelector('[data-flag-chip]');
  const woState = stage.querySelector('[data-wo-state]');
  const woSteps = stage.querySelectorAll('[data-wo-steps] span');
  const repair = stage.querySelector('[data-repair]');
  const repairN = stage.querySelector('[data-repair-n]');

  function flag() { flagRow.classList.add('flag'); flagBox.classList.remove('ok'); flagBox.classList.add('warn'); flagChip.style.opacity = '1'; }
  function step(n, label, cls) { woSteps.forEach((s, i) => s.classList.toggle('done', i < n)); woState.textContent = label; woState.className = 'chip ' + (cls || ''); }
  function finish() { repairN.textContent = '7건'; repair.classList.add('hit'); }

  function pulse(path, ms) {
    return new Promise((res) => {
      const len = path.getTotalLength ? path.getTotalLength() : 0;
      if (!len) return res();
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
      path.style.opacity = '1';
      path.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }], { duration: ms, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => {
        path.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: 'forwards' });
        res();
      };
    });
  }
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  drawWires();
  window.addEventListener('resize', drawWires);

  if (reduce) { flag(); step(4, '완료', 'on'); finish(); return; }

  async function play() {
    await wait(700);
    flag();
    await wait(500);
    await pulse(svg.querySelector('.p1'), 800);
    step(2, '배정', 'blue');
    await wait(500);
    step(3, '진행', 'blue');
    await wait(500);
    step(4, '완료', 'on');
    await wait(250);
    await pulse(svg.querySelector('.p2'), 800);
    finish();
  }
  // 화면에 보일 때 한 번 재생
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(); } }, { threshold: 0.35 });
    io.observe(stage);
  } else play();
})();
