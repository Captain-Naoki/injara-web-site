/* INJARA — site vitrine : langues, animations, formulaire */
(function () {
  'use strict';

  /* ---------- Configuration ---------- */
  var CONFIG = {
    // Les demandes de démo / devis sont envoyées à cette adresse.
    email: 'team@injara.site',
    // Service d'envoi (sans serveur). Remplacez par votre propre point d'accès si besoin.
    endpoint: 'https://formsubmit.co/ajax/team@injara.site'
  };

  var LANGS = ['fr', 'en', 'de', 'es', 'nl'];
  var lang = window.__LANG || 'fr';
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* Textes utilisés uniquement par le script (version française par défaut) */
  var FR = {
    'fm.send.demo': 'Envoyer ma demande de démo',
    'fm.send.quote': 'Envoyer ma demande de devis',
    'fs.sending': 'Envoi en cours…',
    'fs.ok': 'Merci ! Votre demande a bien été envoyée. Nous vous répondons rapidement.',
    'fs.err': "L'envoi n'a pas abouti. Écrivez-nous directement à team@injara.site.",
    'fs.invalid': "Merci de remplir les champs obligatoires et d'accepter la politique de confidentialité.",
    'fs.subj.demo': 'Demande de démo INJARA',
    'fs.subj.quote': 'Demande de devis INJARA'
  };
  var dict = null;
  function t(key) { return (dict && dict[key]) || FR[key] || key; }

  /* ---------- i18n ---------- */
  function applyDict() {
    if (!dict) return;
    $$('[data-t]').forEach(function (el) {
      var v = dict[el.getAttribute('data-t')];
      if (v == null) return;
      if (el.tagName === 'TITLE') document.title = v; else el.innerHTML = v;
    });
    $$('[data-t-attr]').forEach(function (el) {
      el.getAttribute('data-t-attr').split(',').forEach(function (pair) {
        var p = pair.split('='), v = dict[p[1]];
        if (v != null) el.setAttribute(p[0].trim(), v);
      });
    });
  }
  function loadLang(done) {
    if (lang === 'fr') return done();
    var s = document.createElement('script');
    s.src = 'js/i18n/' + lang + '.js';
    s.onload = function () { dict = (window.I18N || {})[lang] || null; applyDict(); done(); };
    s.onerror = function () { lang = 'fr'; root.lang = 'fr'; done(); };
    document.head.appendChild(s);
  }
  function setLang(l) {
    if (LANGS.indexOf(l) < 0 || l === lang) return;
    try { localStorage.setItem('injara-lang', l); } catch (e) {}
    var u = new URL(location.href);
    if (l === 'fr') u.searchParams.delete('lang'); else u.searchParams.set('lang', l);
    document.body.style.opacity = '0';
    setTimeout(function () { location.href = u.toString(); }, 220);
  }
  /* Drapeaux du sélecteur de langue */
  var FLAG_OPEN = '<svg class="flag" viewBox="0 0 60 40" preserveAspectRatio="none" aria-hidden="true">';
  var FLAGS = {
    fr: '<path fill="#0055a4" d="M0 0h20v40H0z"/><path fill="#fff" d="M20 0h20v40H20z"/><path fill="#ef4135" d="M40 0h20v40H40z"/>',
    en: '<path fill="#012169" d="M0 0h60v40H0z"/><path stroke="#fff" stroke-width="8" d="M0 0l60 40M60 0L0 40"/><path stroke="#c8102e" stroke-width="3.500" d="M0 0l60 40M60 0L0 40"/><path stroke="#fff" stroke-width="13" d="M30 0v40M0 20h60"/><path stroke="#c8102e" stroke-width="7.500" d="M30 0v40M0 20h60"/>',
    de: '<path fill="#000" d="M0 0h60v14H0z"/><path fill="#dd0000" d="M0 13.300h60v14H0z"/><path fill="#ffce00" d="M0 26.600h60V40H0z"/>',
    es: '<path fill="#aa151b" d="M0 0h60v40H0z"/><path fill="#f1bf00" d="M0 10h60v20H0z"/>',
    nl: '<path fill="#ae1c28" d="M0 0h60v14H0z"/><path fill="#fff" d="M0 13.300h60v14H0z"/><path fill="#21468b" d="M0 26.600h60V40H0z"/>'
  };
  var LANG_NAMES = { fr: 'Français', en: 'English', de: 'Deutsch', es: 'Español', nl: 'Nederlands' };
  function flag(l) { return FLAG_OPEN + FLAGS[l] + '</svg>'; }

  function initLangMenu() {
    var box = $('#lang'); if (!box) return;
    var btn = $('.lang-btn', box);
    btn.innerHTML = flag(lang) + '<span class="lang-cur">' + lang.toUpperCase() + '</span><svg class="ic ic-sm"><use href="#i-chev"/></svg>';
    $$('[data-lang]', box).forEach(function (b) {
      var l = b.getAttribute('data-lang');
      b.innerHTML = flag(l) + '<span>' + LANG_NAMES[l] + '</span><b>' + l.toUpperCase() + '</b>';
      if (l === lang) b.classList.add('on');
      b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
    });
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = box.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function () { box.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') box.classList.remove('open'); });
  }

  /* ---------- Menu mobile ---------- */
  function initNav() {
    var burger = $('#burger'); if (!burger) return;
    function close() { root.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = root.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('#nav a').forEach(function (a) { a.addEventListener('click', close); });
    window.addEventListener('resize', close);
  }

  /* ---------- Apparition au défilement ---------- */
  function initReveal() {
    var els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window) || reduced) { els.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function countUp(el) {
    var to = +el.getAttribute('data-count'), t0 = null, dur = 1400;
    if (reduced) { el.textContent = to; return; }
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    setTimeout(function () { requestAnimationFrame(step); }, 250);
  }

  /* ---------- Phrase qui s'éclaire mot à mot ---------- */
  var words = [], statement = null;
  function initSplit() {
    statement = $('[data-split]'); if (!statement) return;
    var parts = statement.textContent.trim().split(/\s+/);
    statement.setAttribute('aria-label', parts.join(' '));
    statement.innerHTML = parts.map(function (w) { return '<span class="w" aria-hidden="true">' + w + '</span>'; }).join(' ');
    words = $$('.w', statement);
  }
  function updateSplit(vh) {
    if (!statement) return;
    var r = statement.getBoundingClientRect();
    var start = vh * 0.88, end = vh * 0.38;
    var p = (start - r.top) / (start - end + r.height * 0.6);
    var n = Math.round(Math.max(0, Math.min(1, p)) * words.length);
    for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < n);
  }

  /* ---------- Étapes (section épinglée) ---------- */
  var wrap, steps = [], mocks = [], stepNow, stepsList, cur = -1, pinned = false, autoTimer = null;
  function setStep(i) {
    if (i === cur) return;
    cur = i;
    steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.classList.toggle('is-done', k < i); });
    mocks.forEach(function (m, k) { m.classList.toggle('is-active', k === i); m.classList.toggle('is-past', k < i); });
    if (stepNow) stepNow.textContent = i + 1;
    if (stepsList) stepsList.style.setProperty('--p', i / (steps.length - 1));
  }
  function initSteps() {
    wrap = $('#stepsWrap'); if (!wrap) return;
    stepsList = $('#steps'); steps = $$('.step', stepsList); mocks = $$('#stage .mock'); stepNow = $('#stepNow');
    var mq = window.matchMedia('(min-width: 961px)');
    function mode() { pinned = mq.matches; if (pinned) stopAuto(); }
    mode(); (mq.addEventListener ? mq.addEventListener('change', mode) : mq.addListener(mode));
    steps.forEach(function (s, i) {
      $('button', s).addEventListener('click', function () {
        if (pinned) {
          var top = wrap.getBoundingClientRect().top + window.scrollY;
          var span = wrap.offsetHeight - window.innerHeight;
          window.scrollTo({ top: top + span * ((i + 0.5) / steps.length), behavior: reduced ? 'auto' : 'smooth' });
        } else { stopAuto(true); setStep(i); }
      });
    });
    setStep(0);
    // Sur mobile : défilement automatique des étapes tant que la zone est visible
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        if (pinned || userStopped) return;
        if (en[0].isIntersecting) startAuto(); else stopAuto();
      }, { threshold: 0.35 }).observe($('#stage'));
    }
  }
  var userStopped = false;
  function startAuto() { if (autoTimer || reduced) return; autoTimer = setInterval(function () { setStep((cur + 1) % steps.length); }, 4800); }
  function stopAuto(user) { clearInterval(autoTimer); autoTimer = null; if (user) userStopped = true; }
  function updateSteps(vh) {
    if (!wrap || !pinned) return;
    var r = wrap.getBoundingClientRect(), span = r.height - vh;
    var p = Math.max(0, Math.min(0.9999, -r.top / span));
    setStep(Math.floor(p * steps.length));
  }

  /* ---------- Onglets d'aperçu ---------- */
  function initPreview() {
    var tabs = $('#ptabs'); if (!tabs) return;
    var btns = $$('button', tabs), panels = $$('#ppanels .ppanel'), ind = $('.ptab-ind', tabs);
    panels.forEach(function (p) {
      var id = p.getAttribute('data-clone'); if (!id) return;
      var src = $('#' + id + ' .win'); if (src) p.appendChild(src.cloneNode(true));
    });
    var active = 0, timer = null, stopped = false;
    function moveInd() { var b = btns[active]; ind.style.width = b.offsetWidth + 'px'; ind.style.transform = 'translateX(' + b.offsetLeft + 'px)'; }
    function show(i) {
      active = i;
      btns.forEach(function (b, k) { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
      panels.forEach(function (p, k) { p.classList.toggle('is-active', k === i); });
      moveInd();
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { stopped = true; clearInterval(timer); show(i); }); });
    window.addEventListener('resize', moveInd);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInd);
    show(0);
    if ('IntersectionObserver' in window && !reduced) {
      new IntersectionObserver(function (en) {
        clearInterval(timer);
        if (en[0].isIntersecting && !stopped) timer = setInterval(function () { show((active + 1) % btns.length); }, 6000);
      }, { threshold: 0.4 }).observe(tabs.parentNode);
    }
  }

  /* ---------- FAQ ---------- */
  function initFaq() {
    var items = $$('#faqList .qa');
    items.forEach(function (qa) {
      var b = $('button', qa);
      b.addEventListener('click', function () {
        var open = !qa.classList.contains('open');
        items.forEach(function (o) { o.classList.remove('open'); $('button', o).setAttribute('aria-expanded', 'false'); });
        if (open) { qa.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------- Effets au pointeur ---------- */
  function initPointer() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('.glow').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    var hero = $('.hero'), cards = $$('.hcard, .cluster');
    if (!hero || reduced) return;
    $$('.cluster').forEach(function (c, i) { c.setAttribute('data-depth', [-14, 18, 16, -20][i % 4]); });
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
    function loop() {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      cards.forEach(function (c) {
        var d = +c.getAttribute('data-depth');
        c.style.setProperty('--px', (cx * d).toFixed(2) + 'px');
        c.style.setProperty('--py', (cy * d).toFixed(2) + 'px');
      });
      raf = (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.001) ? requestAnimationFrame(loop) : null;
    }
    hero.addEventListener('pointermove', function (e) {
      tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('pointerleave', function () { tx = ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- Hero : titre mot à mot, boutons magnétiques ---------- */
  function initHero() {
    var n = 0;
    $$('#heroTitle .line').forEach(function (line) {
      line.innerHTML = line.textContent.trim().split(/\s+/).map(function (w) {
        return '<span class="hw" style="--w:' + (n++) + '">' + w + '</span>';
      }).join(' ');
    });
    if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = ((e.clientX - (r.left + r.width / 2)) * 0.3).toFixed(1) + 'px ' + ((e.clientY - (r.top + r.height / 2)) * 0.4).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }

  /* ---------- Bandeau défilant ---------- */
  function initMarquee() {
    var track = $('.marquee-track'); if (!track) return;
    track.appendChild(track.firstElementChild.cloneNode(true));
  }

  /* ---------- Défilement : barre, en-tête, rotations, navigation ---------- */
  function initScroll() {
    var bar = $('.progress span'), header = $('#header');
    // Éléments qui tournent avec la molette (soleil INJARA) : rotation lissée, dans les deux sens
    var turns = $$('[data-turn]').map(function (el) { return { el: el, f: +el.getAttribute('data-turn') }; });
    var turnCur = window.scrollY, turnRaf = null;
    function turnApply() { turns.forEach(function (t) { t.el.style.rotate = (turnCur * t.f).toFixed(2) + 'deg'; }); }
    function turnLoop() {
      var target = window.scrollY;
      turnCur += (target - turnCur) * 0.1;
      if (Math.abs(target - turnCur) < 0.4) { turnCur = target; turnRaf = null; } else { turnRaf = requestAnimationFrame(turnLoop); }
      turnApply();
    }
    var links = $$('.nav a[href^="#"]:not(.btn)');
    var sections = links.map(function (a) { return $(a.getAttribute('href')); });
    var alwaysSolid = header && header.classList.contains('is-solid');
    var ticking = false;
    var hero = $('#top'), heroIn = $('#heroIn'), clusters = $('#clusters'), photo = $('#heroPhoto');
    function heroScroll(y) {
      if (!hero || reduced) return;
      var h = hero.offsetHeight; if (y > h) return;
      var p = Math.max(0, Math.min(1, y / h));
      var tf = 'translate3d(0,' + (-90 * p).toFixed(1) + 'px,0)';
      heroIn.style.transform = tf; // pas de fondu : le texte et les blocs restent nets
      if (clusters) clusters.style.transform = tf; // les blocs restent opaques, au premier plan
      if (photo) photo.style.translate = '0 ' + (18 * p).toFixed(2) + '%';
    }
    // Losanges ndop : nombre de rangées (de 96 px) dévoilées selon l'avancée dans la section
    var wms = $$('.wm'), WM_ROW = 96, WM_ROWS = 6;
    function updateWm(vh) {
      wms.forEach(function (s) {
        var r = s.getBoundingClientRect();
        var p = (vh - r.top) / (vh * 0.55 + r.height * 0.45);
        var rows = Math.max(0, Math.min(WM_ROWS, Math.ceil(p * WM_ROWS)));
        if (s._wmRows !== rows) { s._wmRows = rows; s.style.setProperty('--wmh', (rows * WM_ROW) + 'px'); }
      });
    }
    function frame() {
      ticking = false;
      var y = window.scrollY, vh = window.innerHeight;
      var max = document.documentElement.scrollHeight - vh;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
      if (header && !alwaysSolid) header.classList.toggle('is-solid', y > 40);
      if (turns.length) { if (reduced) { turnCur = y; turnApply(); } else if (!turnRaf) turnRaf = requestAnimationFrame(turnLoop); }
      heroScroll(y); updateSplit(vh); updateSteps(vh); updateWm(vh);
      var current = -1;
      sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.4) current = i; });
      links.forEach(function (a, i) { a.classList.toggle('is-current', i === current); });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    frame();
  }

  /* ---------- Formulaire ---------- */
  function initForm() {
    var form = $('#contactForm'); if (!form) return;
    var status = $('#formStatus'), label = $('.btn-label', form);
    function want() { return form.elements.want.value; }
    function syncLabel() { label.textContent = t(want() === 'quote' ? 'fm.send.quote' : 'fm.send.demo'); }
    function choose(v) { $$('input[name=want]', form).forEach(function (r) { r.checked = r.value === v; }); syncLabel(); }
    $$('input[name=want]', form).forEach(function (r) { r.addEventListener('change', syncLabel); });
    $$('[data-want]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault(); choose(a.getAttribute('data-want'));
        form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 600);
      });
    });
    // Liens directs vers le formulaire : …/#demo ou …/#devis (aussi avec ?lang=xx)
    function fromHash() {
      if (location.hash === '#devis') choose('quote');
      else if (location.hash === '#demo') choose('demo');
      else syncLabel();
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
    function say(cls, html) { status.className = 'form-status ' + cls; status.innerHTML = html; }
    var volField = $('#volField');
    function volume() { var c = $('input[name=volume]:checked', form); return c ? c.parentNode.textContent.trim() : ''; }
    form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); $('.consent', form).classList.remove('invalid-c'); });
    form.addEventListener('change', function (e) { if (e.target.name === 'volume') volField.classList.remove('invalid'); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      ['name', 'email', 'company'].forEach(function (n) {
        var f = form.elements[n], bad = !f.value.trim() || (n === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.value.trim()));
        f.classList.toggle('invalid', bad); if (bad) ok = false;
      });
      if (!volume()) { ok = false; volField.classList.add('invalid'); }
      if (!form.elements.consent.checked) { ok = false; $('.consent', form).classList.add('invalid-c'); }
      if (!ok) { say('err', t('fs.invalid')); return; }
      if (form.elements._honey.value) return; // anti-robot
      var isQuote = want() === 'quote';
      var data = {
        _subject: t(isQuote ? 'fs.subj.quote' : 'fs.subj.demo') + ' — ' + form.elements.company.value.trim(),
        _template: 'table', _captcha: 'false', _replyto: form.elements.email.value.trim(),
        Demande: isQuote ? 'Devis' : 'Démo',
        Nom: form.elements.name.value.trim(),
        Email: form.elements.email.value.trim(),
        Entreprise: form.elements.company.value.trim(),
        'CV par mois': volume(),
        Message: form.elements.message.value.trim() || '—',
        Langue: lang.toUpperCase()
      };
      form.classList.add('sending'); say('', t('fs.sending'));
      fetch(CONFIG.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== 'true') throw new Error('send'); }); })
        .then(function () { form.reset(); syncLabel(); say('ok', t('fs.ok')); })
        .catch(function () {
          var body = Object.keys(data).filter(function (k) { return k[0] !== '_'; }).map(function (k) { return k + ' : ' + data[k]; }).join('\n');
          var href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent(data._subject) + '&body=' + encodeURIComponent(body);
          say('err', t('fs.err').replace(CONFIG.email, '<a href="' + href + '">' + CONFIG.email + '</a>'));
        })
        .then(function () { form.classList.remove('sending'); });
    });
  }

  /* ---------- Démarrage ---------- */
  function init() {
    root.classList.remove('i18n-pending');
    var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
    initLangMenu(); initNav(); initHero(); initMarquee(); initSplit(); initSteps(); initPreview();
    initFaq(); initReveal(); initPointer(); initForm(); initScroll();
    // La traduction se charge après le défilement automatique du navigateur : on refait le saut vers l'ancre.
    if (location.hash.length > 1) {
      var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) setTimeout(function () {
        var el = target.closest('form') || target;
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 90, behavior: 'instant' });
      }, 60);
    }
  }
  loadLang(init);
})();
