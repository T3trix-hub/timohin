(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var qa = function (s) { return Array.prototype.slice.call(d.querySelectorAll(s)); };
  var tb = d.getElementById('theme');
  function setTheme(t, save) {
    root.dataset.theme = t;
    if (tb) { tb.setAttribute('aria-pressed', String(t === 'dark')); tb.setAttribute('aria-label', t === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'); }
    if (save) { try { localStorage.setItem('theme', t); } catch (e) {} }
  }
  setTheme(root.dataset.theme || 'light', false);
  if (tb) tb.addEventListener('click', function () { setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true); });
  var bg = d.getElementById('burger'), nav = d.getElementById('nav');
  if (bg && nav) bg.addEventListener('click', function () {
    var o = nav.classList.toggle('open');
    bg.setAttribute('aria-expanded', String(o)); bg.setAttribute('aria-label', o ? 'Закрыть меню' : 'Открыть меню');
  });
  // Фильтр меню
  var chips = qa('.chip'), groups = qa('.mg');
  chips.forEach(function (c) { c.addEventListener('click', function () {
    chips.forEach(function (x) { x.setAttribute('aria-pressed', String(x === c)); });
    groups.forEach(function (g) { g.hidden = !(c.dataset.f === 'all' || g.dataset.cat === c.dataset.f); });
  }); });
  // Изюминка: деревянная табличка «Открыто / Закрыто» с отсчётом (Минск, ежедневно 11:00–23:00)
  var bd = d.getElementById('board');
  if (bd) {
    var bs = d.getElementById('bst'), bt = d.getElementById('bt'), fb = d.getElementById('flip');
    var mins = function () {
      try {
        var h = 0, m = 0;
        new Intl.DateTimeFormat('ru-RU', { timeZone: 'Europe/Minsk', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
          .formatToParts(new Date()).forEach(function (x) { if (x.type === 'hour') h = +x.value; if (x.type === 'minute') m = +x.value; });
        return h * 60 + m;
      } catch (e) { var n = new Date(); return n.getHours() * 60 + n.getMinutes(); }
    };
    var fmt = function (m) { var h = Math.floor(m / 60), r = m % 60; return h ? h + ' ч ' + r + ' мин' : r + ' мин'; };
    var upd2 = function () {
      var m = mins(), open = m >= 660 && m < 1380;
      bs.textContent = open ? 'Открыто' : 'Закрыто';
      bt.textContent = open ? 'до закрытия ' + fmt(1380 - m) : 'откроемся через ' + fmt(m < 660 ? 660 - m : 1440 - m + 660);
      bd.classList.toggle('shut', !open);
    };
    upd2(); setInterval(upd2, 30000);
    fb.addEventListener('click', function () { var f = bd.classList.toggle('flipped'); fb.setAttribute('aria-pressed', String(f)); });
  }
  // Появление и полоска прокрутки
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches, els = qa('.reveal');
  if (calm || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); }
  else {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
    var p = d.getElementById('prog'), tick = false;
    var upd = function () { var h = root.scrollHeight - root.clientHeight; if (p) p.style.transform = 'scaleX(' + (h > 0 ? root.scrollTop / h : 0) + ')'; tick = false; };
    window.addEventListener('scroll', function () { if (!tick) { tick = true; requestAnimationFrame(upd); } }, { passive: true }); upd();
  }
})();
