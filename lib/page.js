/* ============================================================
 * DSH Skin - Apple Style for DeepSeek Harness
 * page.js - 注入到客户端页面的悬浮球设置面板逻辑
 * 样式由 page.css 提供（随插件一同注入），这里只负责 DOM 与状态。
 * ============================================================ */
(function () {
  "use strict";
  if (window.__DSH_SKIN_LOADED__) return;
  window.__DSH_SKIN_LOADED__ = true;

  /* 预设背景（Apple 系统壁纸风格的 CSS 渐变） */
  var PRESETS = [
    { id: "aurora",   name: "极光",   css: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7f7fd5 100%)" },
    { id: "graphite", name: "石墨",   css: "linear-gradient(160deg, #3a3a3c 0%, #1c1c1e 100%)" },
    { id: "sunset",   name: "日落",   css: "linear-gradient(135deg, #ff9a56 0%, #ff6b95 50%, #c56cd6 100%)" },
    { id: "mint",     name: "薄荷",   css: "linear-gradient(135deg, #a8edea 0%, #5b9dd9 100%)" },
    { id: "midnight", name: "午夜",   css: "linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)" },
    { id: "peach",    name: "蜜桃",   css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)" },
    { id: "ocean",    name: "深海",   css: "linear-gradient(135deg, #2b5876 0%, #4e4376 100%)" },
    { id: "lavender", name: "薰衣草", css: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)" },
    { id: "forest",   name: "森林",   css: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)" },
    { id: "plain",    name: "纯色",   css: "none" },
  ];

  var DEFAULTS = {
    enabled: true,
    mode: "auto",
    bgType: "preset",
    presetId: "aurora",
    bgValue: "",
    alpha: 0.72,
    blur: 20,
    fabX: null,
    fabY: null,
  };
  var LS_KEY = "dsh-skin:settings";

  function load() {
    try {
      return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(LS_KEY) || "{}"));
    } catch (e) {
      return Object.assign({}, DEFAULTS);
    }
  }
  var settings = load();

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch (e) {
      alert("设置保存失败：本地存储空间不足。建议改用图片链接方式。");
    }
  }

  var root = document.documentElement;

  function apply() {
    root.setAttribute("data-dsh-enabled", settings.enabled ? "true" : "false");
    var theme = settings.mode === "auto"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : settings.mode;
    root.setAttribute("data-dsh-theme", theme);
    root.style.setProperty("--dsh-alpha", String(settings.alpha));
    root.style.setProperty("--dsh-blur", settings.blur + "px");

    var bg = "none";
    if (settings.enabled) {
      if (settings.bgType === "preset") {
        var p = null;
        for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].id === settings.presetId) p = PRESETS[i];
        if (p && p.css !== "none") bg = p.css;
      } else if ((settings.bgType === "url" || settings.bgType === "image") && settings.bgValue) {
        bg = 'url("' + settings.bgValue.replace(/"/g, "%22") + '")';
      }
    }
    root.style.setProperty("--dsh-bg-image", bg);
    root.style.setProperty("--dsh-bg-color", theme === "dark" ? "#1c1c1e" : "#f5f5f7");
  }

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
    if (settings.mode === "auto") apply();
  });

  var ICON =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none">' +
    '<circle cx="12" cy="12" r="9" fill="url(#dshg)"/>' +
    '<defs><linearGradient id="dshg" x1="3" y1="3" x2="21" y2="21">' +
    '<stop stop-color="#5AC8FA"/><stop offset=".5" stop-color="#007AFF"/>' +
    '<stop offset="1" stop-color="#AF52DE"/></linearGradient></defs>' +
    '<circle cx="12" cy="12" r="3.2" fill="rgba(255,255,255,.9)"/></svg>';

  var fab, panel;

  function buildUI() {
    if (document.getElementById("dsh-fab")) return;
    fab = document.createElement("div");
    fab.id = "dsh-fab";
    fab.className = "dsh-fab";
    fab.innerHTML = ICON;
    fab.title = "DSH 皮肤设置";
    document.body.appendChild(fab);
    if (settings.fabX != null) requestAnimationFrame(function () { setFabPos(settings.fabX, settings.fabY); });
    panel = buildPanel();
    document.body.appendChild(panel);

    var drag = null;
    fab.addEventListener("pointerdown", function (e) {
      var r = fab.getBoundingClientRect();
      drag = { sx: e.clientX, sy: e.clientY, moved: false, ox: r.left, oy: r.top };
      fab.setPointerCapture(e.pointerId);
    });
    fab.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
      if (drag.moved) setFabPos(drag.ox + dx, drag.oy + dy);
    });
    fab.addEventListener("pointerup", function () {
      if (drag && !drag.moved) panel.classList.toggle("dsh-panel--open");
      if (drag && drag.moved) {
        var r = fab.getBoundingClientRect();
        settings.fabX = r.left; settings.fabY = r.top;
        save();
      }
      drag = null;
    });
    document.addEventListener("pointerdown", function (e) {
      if (!panel.classList.contains("dsh-panel--open")) return;
      if (!panel.contains(e.target) && !fab.contains(e.target)) {
        panel.classList.remove("dsh-panel--open");
      }
    });
  }

  function setFabPos(x, y) {
    x = Math.max(8, Math.min(window.innerWidth - 56, x));
    y = Math.max(8, Math.min(window.innerHeight - 56, y));
    fab.style.left = x + "px";
    fab.style.top = y + "px";
    fab.style.right = "auto";
    fab.style.bottom = "auto";
  }

  function buildPanel() {
    var el = document.createElement("div");
    el.className = "dsh-panel";
    el.innerHTML =
      '<div class="dsh-panel__header"><div class="dsh-panel__title">皮肤设置</div><button class="dsh-panel__close">✕</button></div>' +
      '<div class="dsh-panel__section"><div class="dsh-switch-row"><span>启用皮肤</span><div class="dsh-switch" data-bind="enabled"></div></div></div>' +
      '<div class="dsh-panel__section"><div class="dsh-panel__label"><span>外观</span></div>' +
      '<div class="dsh-segmented" data-bind="mode"><button data-val="light">浅色</button><button data-val="dark">深色</button><button data-val="auto">自动</button></div></div>' +
      '<div class="dsh-panel__section"><div class="dsh-panel__label"><span>预设背景</span></div><div class="dsh-swatches" data-bind="presets"></div>' +
      '<div class="dsh-row"><input class="dsh-input" data-bind="bgUrl" type="text" placeholder="粘贴图片链接（https://...）"/><button class="dsh-btn" data-act="apply-url">应用</button></div>' +
      '<div class="dsh-row"><button class="dsh-btn dsh-btn--ghost" data-act="pick-file" style="flex:1">上传本地图片</button><button class="dsh-btn dsh-btn--ghost" data-act="clear-bg" style="flex:1">清除背景</button></div>' +
      '<input type="file" accept="image/*" data-bind="file" style="display:none"/></div>' +
      '<div class="dsh-panel__section"><div class="dsh-panel__label"><span>玻璃透明度</span><span class="dsh-panel__value" data-bind="alphaVal"></span></div>' +
      '<input class="dsh-slider" data-bind="alpha" type="range" min="10" max="100" step="1"/></div>' +
      '<div class="dsh-panel__section"><div class="dsh-panel__label"><span>背景模糊</span><span class="dsh-panel__value" data-bind="blurVal"></span></div>' +
      '<input class="dsh-slider" data-bind="blur" type="range" min="0" max="40" step="1"/></div>' +
      '<div class="dsh-panel__footer"><button class="dsh-btn dsh-btn--ghost" data-act="reset">恢复默认</button></div>';

    el.querySelector(".dsh-panel__close").onclick = function () { el.classList.remove("dsh-panel--open"); };
    el.querySelector('[data-bind="enabled"]').onclick = function () {
      settings.enabled = !settings.enabled; save(); refresh(el); apply();
    };

    var modeBtns = el.querySelectorAll('[data-bind="mode"] button');
    for (var i = 0; i < modeBtns.length; i++) {
      (function (b) {
        b.onclick = function () { settings.mode = b.dataset.val; save(); refresh(el); apply(); };
      })(modeBtns[i]);
    }

    var sws = el.querySelector('[data-bind="presets"]');
    PRESETS.forEach(function (p) {
      var s = document.createElement("div");
      s.className = "dsh-swatch";
      s.dataset.id = p.id;
      s.title = p.name;
      s.innerHTML = '<span style="background:' +
        (p.css === "none" ? "repeating-linear-gradient(45deg,#c7c7cc 0 4px,#ededf0 4px 8px)" : p.css) +
        ';border-radius:7px;"></span>';
      s.onclick = function () {
        settings.bgType = "preset"; settings.presetId = p.id; save(); refresh(el); apply();
      };
      sws.appendChild(s);
    });

    el.querySelector('[data-act="apply-url"]').onclick = function () {
      var v = el.querySelector('[data-bind="bgUrl"]').value.trim();
      if (!v) return;
      settings.bgType = "url"; settings.bgValue = v; save(); refresh(el); apply();
    };
    var fi = el.querySelector('[data-bind="file"]');
    el.querySelector('[data-act="pick-file"]').onclick = function () { fi.click(); };
    fi.onchange = function () {
      var f = fi.files && fi.files[0];
      if (!f) return;
      if (f.size > 4 * 1024 * 1024) {
        alert("图片超过 4MB，可能超出本地存储限制，建议改用图片链接。");
      }
      var r = new FileReader();
      r.onload = function () {
        settings.bgType = "image"; settings.bgValue = String(r.result); save(); refresh(el); apply();
      };
      r.readAsDataURL(f);
      fi.value = "";
    };
    el.querySelector('[data-act="clear-bg"]').onclick = function () {
      settings.bgType = "none"; settings.bgValue = ""; save(); refresh(el); apply();
    };

    var aS = el.querySelector('[data-bind="alpha"]');
    var bS = el.querySelector('[data-bind="blur"]');
    aS.oninput = function () {
      settings.alpha = aS.value / 100;
      el.querySelector('[data-bind="alphaVal"]').textContent = aS.value + "%";
      apply();
    };
    aS.onchange = save;
    bS.oninput = function () {
      settings.blur = +bS.value;
      el.querySelector('[data-bind="blurVal"]').textContent = bS.value + "px";
      apply();
    };
    bS.onchange = save;
    el.querySelector('[data-act="reset"]').onclick = function () {
      var k = { fabX: settings.fabX, fabY: settings.fabY };
      settings = Object.assign({}, DEFAULTS, k);
      save(); refresh(el); apply();
    };

    refresh(el);
    return el;
  }

  function refresh(el) {
    el.querySelector('[data-bind="enabled"]').classList.toggle("dsh-switch--on", settings.enabled);
    var modeBtns = el.querySelectorAll('[data-bind="mode"] button');
    for (var i = 0; i < modeBtns.length; i++) {
      modeBtns[i].classList.toggle("dsh-active", modeBtns[i].dataset.val === settings.mode);
    }
    var swatches = el.querySelectorAll(".dsh-swatch");
    for (var j = 0; j < swatches.length; j++) {
      swatches[j].classList.toggle(
        "dsh-swatch--active",
        settings.bgType === "preset" && swatches[j].dataset.id === settings.presetId
      );
    }
    var ui = el.querySelector('[data-bind="bgUrl"]');
    if (document.activeElement !== ui) ui.value = settings.bgType === "url" ? settings.bgValue : "";
    el.querySelector('[data-bind="alpha"]').value = Math.round(settings.alpha * 100);
    el.querySelector('[data-bind="alphaVal"]').textContent = Math.round(settings.alpha * 100) + "%";
    el.querySelector('[data-bind="blur"]').value = settings.blur;
    el.querySelector('[data-bind="blurVal"]').textContent = settings.blur + "px";
  }

  function boot() { apply(); buildUI(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
