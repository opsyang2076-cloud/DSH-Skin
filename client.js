/* ============================================================
 * DSH Skin - client.js（由 scripts/build-client.mjs 生成，勿手改）
 * DeepSeek Harness 客户端模块：注入玻璃拟态样式 + 悬浮球设置面板
 * ============================================================ */
window.__ModuleLoader__.load({
  id: 'dsh-skin',
  factory(require) {
    const CSS = "/* ============================================================\n * DSH Skin - Apple Style for DeepSeek Harness\n * page.css - 注入到客户端页面的完整样式（主题 + 设置面板）\n * 所有规则都在 html[data-dsh-enabled=\"true\"] 作用域下，\n * 关闭皮肤开关后不产生任何影响。\n * ============================================================ */\n\n:root {\n  --dsh-glass-rgb: 255, 255, 255;\n  --dsh-alpha: 0.72;\n  --dsh-blur: 20px;\n  --dsh-bg-image: none;\n  --dsh-bg-color: #f5f5f7;\n  --dsh-radius: 14px;\n  --dsh-radius-lg: 18px;\n  --dsh-text: #1d1d1f;\n  --dsh-text-secondary: #6e6e73;\n  --dsh-accent: #007aff;\n  --dsh-hairline: rgba(0, 0, 0, 0.08);\n}\n:root[data-dsh-theme=\"dark\"] {\n  --dsh-glass-rgb: 29, 29, 31;\n  --dsh-text: #f5f5f7;\n  --dsh-text-secondary: #a1a1a6;\n  --dsh-hairline: rgba(255, 255, 255, 0.10);\n}\n\n/* ---------- 全局：字体与背景 ---------- */\nhtml[data-dsh-enabled=\"true\"] body {\n  background: var(--dsh-bg-color) !important;\n  background-image: var(--dsh-bg-image) !important;\n  background-size: cover !important;\n  background-position: center !important;\n  background-attachment: fixed !important;\n}\nhtml[data-dsh-enabled=\"true\"] body,\nhtml[data-dsh-enabled=\"true\"] button,\nhtml[data-dsh-enabled=\"true\"] input,\nhtml[data-dsh-enabled=\"true\"] textarea {\n  font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\",\n    \"PingFang SC\", \"Microsoft YaHei\", \"Segoe UI\", sans-serif !important;\n  -webkit-font-smoothing: antialiased;\n}\n\n/* ---------- 通用玻璃表面（按结构匹配，匹配不到则无副作用） ---------- */\nhtml[data-dsh-enabled=\"true\"] aside,\nhtml[data-dsh-enabled=\"true\"] [class*=\"sidebar\"] {\n  background: rgba(var(--dsh-glass-rgb), calc(var(--dsh-alpha) * 0.85)) !important;\n  backdrop-filter: saturate(180%) blur(var(--dsh-blur)) !important;\n  -webkit-backdrop-filter: saturate(180%) blur(var(--dsh-blur)) !important;\n}\nhtml[data-dsh-enabled=\"true\"] [class*=\"topbar\"],\nhtml[data-dsh-enabled=\"true\"] [class*=\"top-bar\"] {\n  background: rgba(var(--dsh-glass-rgb), calc(var(--dsh-alpha) * 0.9)) !important;\n  backdrop-filter: saturate(180%) blur(var(--dsh-blur)) !important;\n  -webkit-backdrop-filter: saturate(180%) blur(var(--dsh-blur)) !important;\n}\nhtml[data-dsh-enabled=\"true\"] [class*=\"menu\"],\nhtml[data-dsh-enabled=\"true\"] [class*=\"popover\"],\nhtml[data-dsh-enabled=\"true\"] [class*=\"dropdown\"] {\n  backdrop-filter: saturate(180%) blur(calc(var(--dsh-blur) + 4px)) !important;\n  -webkit-backdrop-filter: saturate(180%) blur(calc(var(--dsh-blur) + 4px)) !important;\n}\n\n/* ---------- 细滚动条 ---------- */\nhtml[data-dsh-enabled=\"true\"] ::-webkit-scrollbar { width: 6px; height: 6px; }\nhtml[data-dsh-enabled=\"true\"] ::-webkit-scrollbar-thumb {\n  background: rgba(var(--dsh-glass-rgb), 0.35);\n  border-radius: 3px;\n}\nhtml[data-dsh-enabled=\"true\"] ::-webkit-scrollbar-track { background: transparent; }\n\n/* ============================================================\n * 悬浮球 + 设置面板\n * ============================================================ */\n.dsh-fab {\n  position: fixed;\n  right: 24px;\n  bottom: 24px;\n  z-index: 2147483646;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  border: 1px solid rgba(255, 255, 255, 0.4);\n  background: rgba(255, 255, 255, 0.72);\n  backdrop-filter: saturate(180%) blur(20px);\n  -webkit-backdrop-filter: saturate(180%) blur(20px);\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.6);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  user-select: none;\n  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease;\n}\n.dsh-fab:hover {\n  transform: scale(1.08);\n  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.24), inset 0 1px 0 rgba(255, 255, 255, 0.6);\n}\n.dsh-fab:active { transform: scale(0.94); }\n:root[data-dsh-theme=\"dark\"] .dsh-fab {\n  background: rgba(44, 44, 46, 0.72);\n  border-color: rgba(255, 255, 255, 0.15);\n}\n\n.dsh-panel {\n  position: fixed;\n  right: 24px;\n  bottom: 84px;\n  z-index: 2147483647;\n  width: 320px;\n  max-height: calc(100vh - 120px);\n  overflow-y: auto;\n  border-radius: var(--dsh-radius-lg);\n  border: 1px solid rgba(var(--dsh-glass-rgb), 0.4);\n  background: rgba(var(--dsh-glass-rgb), calc(var(--dsh-alpha) + 0.14));\n  backdrop-filter: saturate(180%) blur(calc(var(--dsh-blur) + 8px));\n  -webkit-backdrop-filter: saturate(180%) blur(calc(var(--dsh-blur) + 8px));\n  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.25);\n  color: var(--dsh-text);\n  font-family: -apple-system, BlinkMacSystemFont, \"SF Pro Text\", \"PingFang SC\",\n    \"Microsoft YaHei\", sans-serif;\n  font-size: 13px;\n  opacity: 0;\n  transform: translateY(12px) scale(0.96);\n  pointer-events: none;\n  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n.dsh-panel.dsh-panel--open { opacity: 1; transform: none; pointer-events: auto; }\n\n.dsh-panel__header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 14px 16px 10px;\n  border-bottom: 1px solid var(--dsh-hairline);\n  position: sticky;\n  top: 0;\n  background: inherit;\n  border-radius: var(--dsh-radius-lg) var(--dsh-radius-lg) 0 0;\n  backdrop-filter: inherit;\n}\n.dsh-panel__title { font-size: 15px; font-weight: 600; letter-spacing: -0.2px; }\n.dsh-panel__close {\n  border: none;\n  background: rgba(120, 120, 128, 0.16);\n  color: var(--dsh-text-secondary);\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  cursor: pointer;\n  font-size: 12px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.dsh-panel__close:hover { background: rgba(120, 120, 128, 0.28); }\n\n.dsh-panel__section { padding: 12px 16px; border-bottom: 1px solid var(--dsh-hairline); }\n.dsh-panel__section:last-child { border-bottom: none; }\n.dsh-panel__label {\n  font-size: 12px;\n  font-weight: 600;\n  color: var(--dsh-text-secondary);\n  text-transform: uppercase;\n  letter-spacing: 0.4px;\n  margin-bottom: 8px;\n  display: flex;\n  justify-content: space-between;\n}\n.dsh-panel__value { font-weight: 500; color: var(--dsh-accent); text-transform: none; letter-spacing: 0; }\n\n.dsh-swatches { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }\n.dsh-swatch {\n  height: 40px;\n  border-radius: 9px;\n  border: 2px solid transparent;\n  cursor: pointer;\n  transition: transform 0.15s ease, border-color 0.15s ease;\n  position: relative;\n  overflow: hidden;\n}\n.dsh-swatch:hover { transform: scale(1.06); }\n.dsh-swatch.dsh-swatch--active {\n  border-color: var(--dsh-accent);\n  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.25);\n}\n.dsh-swatch span {\n  position: absolute;\n  inset: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 15px;\n}\n\n.dsh-row { display: flex; gap: 8px; margin-top: 10px; }\n.dsh-input {\n  flex: 1;\n  min-width: 0;\n  padding: 7px 10px;\n  border-radius: 8px;\n  border: 1px solid var(--dsh-hairline);\n  background: rgba(120, 120, 128, 0.10);\n  color: var(--dsh-text);\n  font-size: 12px;\n  outline: none;\n}\n.dsh-input:focus {\n  border-color: rgba(0, 122, 255, 0.6);\n  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.12);\n}\n.dsh-btn {\n  padding: 7px 12px;\n  border-radius: 8px;\n  border: none;\n  background: var(--dsh-accent);\n  color: #fff;\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: transform 0.12s ease, opacity 0.15s ease;\n}\n.dsh-btn:hover { opacity: 0.9; }\n.dsh-btn:active { transform: scale(0.96); }\n.dsh-btn--ghost { background: rgba(120, 120, 128, 0.14); color: var(--dsh-text); }\n\n.dsh-segmented {\n  display: flex;\n  background: rgba(120, 120, 128, 0.14);\n  border-radius: 9px;\n  padding: 2px;\n}\n.dsh-segmented button {\n  flex: 1;\n  border: none;\n  padding: 6px 0;\n  border-radius: 7px;\n  background: transparent;\n  color: var(--dsh-text);\n  font-size: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  transition: background 0.2s ease, box-shadow 0.2s ease;\n}\n.dsh-segmented button.dsh-active {\n  background: rgba(var(--dsh-glass-rgb), 1);\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);\n}\n:root[data-dsh-theme=\"dark\"] .dsh-segmented button.dsh-active { background: rgba(80, 80, 84, 1); }\n\n.dsh-slider {\n  -webkit-appearance: none;\n  appearance: none;\n  width: 100%;\n  height: 4px;\n  border-radius: 2px;\n  background: rgba(120, 120, 128, 0.24);\n  outline: none;\n  cursor: pointer;\n  margin: 10px 0 2px;\n}\n.dsh-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 20px;\n  height: 20px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);\n  cursor: grab;\n}\n:root[data-dsh-theme=\"dark\"] .dsh-slider::-webkit-slider-thumb { background: #f5f5f7; }\n\n.dsh-switch-row {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  margin-bottom: 4px;\n}\n.dsh-switch-row span { font-size: 13px; font-weight: 500; }\n.dsh-switch {\n  position: relative;\n  width: 44px;\n  height: 26px;\n  border-radius: 13px;\n  background: rgba(120, 120, 128, 0.32);\n  cursor: pointer;\n  transition: background 0.25s ease;\n  flex-shrink: 0;\n}\n.dsh-switch::after {\n  content: \"\";\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 22px;\n  height: 22px;\n  border-radius: 50%;\n  background: #fff;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);\n  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);\n}\n.dsh-switch.dsh-switch--on { background: #34c759; }\n.dsh-switch.dsh-switch--on::after { transform: translateX(18px); }\n\n.dsh-panel__footer { display: flex; gap: 8px; padding: 12px 16px 16px; }\n.dsh-panel__footer .dsh-btn { flex: 1; }\n";

    function installStyle() {
      if (document.getElementById('dsh-skin-style')) {
        return document.getElementById('dsh-skin-style');
      }
      const style = document.createElement('style');
      style.id = 'dsh-skin-style';
      style.textContent = CSS;
      document.head.appendChild(style);
      return style;
    }

/* ============================================================
 * DSH Skin - Apple Style for DeepSeek Harness
 * page.js - 注入到客户端页面的悬浮球设置面板逻辑
 * 样式由 page.css 提供（随插件一同注入），这里只负责 DOM 与状态。
 * ============================================================ */
window.__DSH_SKIN_LOAD__ = function () {
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

  boot();
};


    return {
      inject: [],
      apply(ctx) {
        ctx.effect(() => {
          const style = installStyle();
          if (typeof window.__DSH_SKIN_LOAD__ === 'function') {
            window.__DSH_SKIN_LOAD__();
          }
          return function dispose() {
            if (style && style.parentNode) style.parentNode.removeChild(style);
            const fab = document.getElementById('dsh-fab');
            if (fab && fab.parentNode) fab.parentNode.removeChild(fab);
            const panel = document.querySelector('.dsh-panel');
            if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
          };
        });
      },
    };
  },
});
