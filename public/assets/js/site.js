/* 에셋온 홈페이지 공통 동작 */
(function () {
  const cfg = window.ASSETON_CONFIG || {};

  // 헤더 경계선
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 4);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // 드롭다운
  const menus = document.querySelectorAll('.gnb button.menu');
  const closeAll = (except) => menus.forEach((b) => {
    if (b === except) return;
    b.setAttribute('aria-expanded', 'false');
    const dd = document.getElementById(b.getAttribute('aria-controls'));
    dd && dd.classList.remove('open');
  });
  menus.forEach((b) => {
    const dd = document.getElementById(b.getAttribute('aria-controls'));
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = b.getAttribute('aria-expanded') !== 'true';
      closeAll(b);
      b.setAttribute('aria-expanded', String(open));
      dd.classList.toggle('open', open);
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.gnb')) closeAll(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAll(); closeMobile(); } });

  // 모바일 메뉴
  const tog = document.querySelector('.nav-toggle');
  const mnav = document.getElementById('mnav');
  const closeMobile = () => { if (!tog) return; tog.setAttribute('aria-expanded', 'false'); mnav.classList.remove('open'); document.body.style.overflow = ''; };
  tog && tog.addEventListener('click', () => {
    const open = tog.getAttribute('aria-expanded') !== 'true';
    tog.setAttribute('aria-expanded', String(open));
    tog.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
    mnav.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // 탭 (키보드 좌우 이동 지원)
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    const select = (t) => {
      tabs.forEach((x) => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = document.getElementById(x.getAttribute('aria-controls'));
        if (p) p.hidden = !on;
      });
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
        select(n); n.focus();
      });
    });
  });

  // 가로로 넘치는 탭 줄에서 현재 페이지 탭이 보이도록
  document.querySelectorAll('.tabs a[aria-current="page"]').forEach((a) => {
    const bar = a.parentElement;
    if (bar.scrollWidth > bar.clientWidth) bar.scrollLeft = a.offsetLeft - (bar.clientWidth - a.offsetWidth) / 2;
  });

  // 연락처 표시
  const c = cfg.contact || {};
  document.querySelectorAll('[data-contact]').forEach((el) => {
    const k = el.getAttribute('data-contact');
    const v = c[k];
    if (!v) return;
    const dd = el.querySelector('dd') || el;
    if (k === 'email') dd.innerHTML = `<a href="mailto:${v}">${v}</a>`;
    else if (k === 'phone') dd.innerHTML = `<a href="tel:${v.replace(/[^0-9+]/g, '')}">${v}</a>`;
    else dd.textContent = v;
    el.hidden = false;
  });
})();
