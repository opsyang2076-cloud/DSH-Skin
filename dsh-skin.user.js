// ==UserScript==
// @name         DSH Skin - Apple Style for DeepSeek
// @name:zh-CN   DSH 皮肤 - DeepSeek 苹果风格主题
// @namespace    https://github.com/your-username/dsh-skin
// @version      1.0.0
// @description  Apple-style glassmorphism skin for DeepSeek web chat. Custom background, adjustable glass transparency and blur.
// @description:zh-CN  DeepSeek 网页版的苹果风格玻璃拟态皮肤。支持自定义背景、调节玻璃透明度与模糊度。
// @author       DSH Skin Contributors
// @match        https://chat.deepseek.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/your-username/dsh-skin
// @supportURL   https://github.com/your-username/dsh-skin/issues
// ==/UserScript==

/*
 * 油猴脚本版：与 Chrome 扩展版功能一致。
 * 面板样式与主题样式通过 JS 注入 <style> 实现，方便单文件分发。
 * 安装方式：在 Tampermonkey 中新建脚本，粘贴本文件全部内容保存即可。
 */

(function () {
  "use strict";
  if (window.__DSH_SKIN_LOADED__) return;
  window.__DSH_SKIN_LOADED__ = true;

  const GM_CSS = `
:root{--dsh-glass-rgb:255,255,255;--dsh-glass-border:rgba(255,255,255,.55);--dsh-glass-highlight:rgba(255,255,255,.85);
--dsh-alpha:.72;--dsh-blur:20px;--dsh-bg-image:none;--dsh-bg-color:#f5f5f7;
--dsh-radius:14px;--dsh-radius-lg:18px;--dsh-shadow:0 4px 24px rgba(0,0,0,.12);--dsh-shadow-sm:0 1px 4px rgba(0,0,0,.08);
--dsh-text:#1d1d1f;--dsh-text-secondary:#6e6e73;--dsh-accent:#007aff;--dsh-hairline:rgba(0,0,0,.08)}
:root[data-dsh-theme=dark]{--dsh-glass-rgb:29,29,31;--dsh-glass-border:rgba(255,255,255,.12);--dsh-glass-highlight:rgba(255,255,255,.10);
--dsh-text:#f5f5f7;--dsh-text-secondary:#a1a1a6;--dsh-hairline:rgba(255,255,255,.10);--dsh-shadow:0 4px 24px rgba(0,0,0,.45)}
html[data-dsh-enabled=true] body,html[data-dsh-enabled=true] button,html[data-dsh-enabled=true] input,html[data-dsh-enabled=true] textarea{font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei","Segoe UI",sans-serif!important;-webkit-font-smoothing:antialiased}
html[data-dsh-enabled=true] body::before{content:"";position:fixed;inset:0;z-index:0;background:var(--dsh-bg-color);background-image:var(--dsh-bg-image);background-size:cover;background-position:center;background-attachment:fixed;pointer-events:none}
html[data-dsh-enabled=true] body>*{position:relative;z-index:1}
html[data-dsh-enabled=true] aside,html[data-dsh-enabled=true] [class*=sidebar]{background:rgba(var(--dsh-glass-rgb),calc(var(--dsh-alpha)*.85))!important;backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;-webkit-backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;border-right:1px solid var(--dsh-hairline)!important;color:var(--dsh-text)!important}
html[data-dsh-enabled=true] header,html[data-dsh-enabled=true] [class*=top-bar],html[data-dsh-enabled=true] [class*=header]{background:rgba(var(--dsh-glass-rgb),calc(var(--dsh-alpha)*.9))!important;backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;-webkit-backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;border-bottom:1px solid var(--dsh-hairline)!important;color:var(--dsh-text)!important}
html[data-dsh-enabled=true] main,html[data-dsh-enabled=true] [class*=chat-container],html[data-dsh-enabled=true] [class*=conversation]{background:transparent!important}
html[data-dsh-enabled=true] [class*=message-item-user],html[data-dsh-enabled=true] [class*=user-message]{background:rgba(0,122,255,calc(var(--dsh-alpha)*.9))!important;backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;-webkit-backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;border-radius:var(--dsh-radius-lg)!important;border-bottom-right-radius:6px!important;color:#fff!important;box-shadow:var(--dsh-shadow-sm)!important}
html[data-dsh-enabled=true] [class*=message-item-machine],html[data-dsh-enabled=true] [class*=bot-message],html[data-dsh-enabled=true] .ds-markdown{background:rgba(var(--dsh-glass-rgb),var(--dsh-alpha))!important;backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;-webkit-backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;border-radius:var(--dsh-radius-lg)!important;border-bottom-left-radius:6px!important;border:1px solid var(--dsh-glass-border)!important;box-shadow:var(--dsh-shadow-sm)!important;color:var(--dsh-text)!important}
html[data-dsh-enabled=true] [class*=chat-input],html[data-dsh-enabled=true] [class*=input-container],html[data-dsh-enabled=true] textarea{background:rgba(var(--dsh-glass-rgb),calc(var(--dsh-alpha)*.95))!important;backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;-webkit-backdrop-filter:saturate(180%) blur(var(--dsh-blur))!important;border-radius:var(--dsh-radius-lg)!important;border:1px solid var(--dsh-glass-border)!important;color:var(--dsh-text)!important}
html[data-dsh-enabled=true] textarea:focus{border-color:rgba(0,122,255,.6)!important;box-shadow:0 0 0 4px rgba(0,122,255,.15)!important;outline:none!important}
html[data-dsh-enabled=true] ::-webkit-scrollbar{width:6px;height:6px}html[data-dsh-enabled=true] ::-webkit-scrollbar-thumb{background:rgba(var(--dsh-glass-rgb),.35);border-radius:3px}
html[data-dsh-enabled=true] .dsh-fab{position:fixed;right:24px;bottom:24px;z-index:2147483646;width:48px;height:48px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(255,255,255,.72);backdrop-filter:saturate(180%) blur(20px);-webkit-backdrop-filter:saturate(180%) blur(20px);box-shadow:0 8px 32px rgba(0,0,0,.18),inset 0 1px 0 rgba(255,255,255,.6);cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;transition:transform .2s cubic-bezier(.34,1.56,.64,1),box-shadow .2s ease}
html[data-dsh-enabled=true] .dsh-fab:hover{transform:scale(1.08)}
:root[data-dsh-theme=dark] .dsh-fab{background:rgba(44,44,46,.72);border-color:rgba(255,255,255,.15)}
.dsh-panel{position:fixed;right:24px;bottom:84px;z-index:2147483647;width:320px;max-height:calc(100vh - 120px);overflow-y:auto;border-radius:var(--dsh-radius-lg);border:1px solid var(--dsh-glass-border);background:rgba(var(--dsh-glass-rgb),calc(var(--dsh-alpha) + .14));backdrop-filter:saturate(180%) blur(calc(var(--dsh-blur) + 8px));-webkit-backdrop-filter:saturate(180%) blur(calc(var(--dsh-blur) + 8px));box-shadow:0 16px 48px rgba(0,0,0,.25),inset 0 1px 0 var(--dsh-glass-highlight);color:var(--dsh-text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","PingFang SC","Microsoft YaHei",sans-serif;font-size:13px;opacity:0;transform:translateY(12px) scale(.96);pointer-events:none;transition:opacity .25s ease,transform .25s cubic-bezier(.34,1.56,.64,1)}
.dsh-panel.dsh-panel--open{opacity:1;transform:none;pointer-events:auto}
.dsh-panel__header{display:flex;align-items:center;justify-content:space-between;padding:14px 16px 10px;border-bottom:1px solid var(--dsh-hairline);position:sticky;top:0;background:inherit;border-radius:var(--dsh-radius-lg) var(--dsh-radius-lg) 0 0}
.dsh-panel__title{font-size:15px;font-weight:600;letter-spacing:-.2px}
.dsh-panel__close{border:none;background:rgba(120,120,128,.16);color:var(--dsh-text-secondary);width:22px;height:22px;border-radius:50%;cursor:pointer;font-size:12px;display:flex;align-items:center;justify-content:center}
.dsh-panel__section{padding:12px 16px;border-bottom:1px solid var(--dsh-hairline)}.dsh-panel__section:last-child{border-bottom:none}
.dsh-panel__label{font-size:12px;font-weight:600;color:var(--dsh-text-secondary);text-transform:uppercase;letter-spacing:.4px;margin-bottom:8px;display:flex;justify-content:space-between}
.dsh-panel__value{font-weight:500;color:var(--dsh-accent);text-transform:none;letter-spacing:0}
.dsh-swatches{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
.dsh-swatch{height:40px;border-radius:9px;border:2px solid transparent;cursor:pointer;transition:transform .15s ease,border-color .15s ease;position:relative;overflow:hidden}
.dsh-swatch:hover{transform:scale(1.06)}
.dsh-swatch.dsh-swatch--active{border-color:var(--dsh-accent);box-shadow:0 0 0 2px rgba(0,122,255,.25)}
.dsh-swatch span{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:15px}
.dsh-row{display:flex;gap:8px;margin-top:10px}
.dsh-input{flex:1;min-width:0;padding:7px 10px;border-radius:8px;border:1px solid var(--dsh-hairline);background:rgba(120,120,128,.10);color:var(--dsh-text);font-size:12px;outline:none}
.dsh-input:focus{border-color:rgba(0,122,255,.6);box-shadow:0 0 0 3px rgba(0,122,255,.12)}
.dsh-btn{padding:7px 12px;border-radius:8px;border:none;background:var(--dsh-accent);color:#fff;font-size:12px;font-weight:500;cursor:pointer;white-space:nowrap;transition:transform .12s ease,opacity .15s ease}
.dsh-btn:active{transform:scale(.96)}
.dsh-btn--ghost{background:rgba(120,120,128,.14);color:var(--dsh-text)}
.dsh-segmented{display:flex;background:rgba(120,120,128,.14);border-radius:9px;padding:2px}
.dsh-segmented button{flex:1;border:none;padding:6px 0;border-radius:7px;background:transparent;color:var(--dsh-text);font-size:12px;font-weight:500;cursor:pointer;transition:background .2s ease,box-shadow .2s ease}
.dsh-segmented button.dsh-active{background:rgba(var(--dsh-glass-rgb),1);box-shadow:0 1px 4px rgba(0,0,0,.15)}
:root[data-dsh-theme=dark] .dsh-segmented button.dsh-active{background:rgba(80,80,84,1)}
.dsh-slider{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(120,120,128,.24);outline:none;cursor:pointer;margin:10px 0 2px}
.dsh-slider::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.3);cursor:grab}
.dsh-switch-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}
.dsh-switch-row span{font-size:13px;font-weight:500}
.dsh-switch{position:relative;width:44px;height:26px;border-radius:13px;background:rgba(120,120,128,.32);cursor:pointer;transition:background .25s ease;flex-shrink:0}
.dsh-switch::after{content:"";position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.25);transition:transform .25s cubic-bezier(.34,1.56,.64,1)}
.dsh-switch.dsh-switch--on{background:#34c759}
.dsh-switch.dsh-switch--on::after{transform:translateX(18px)}
.dsh-panel__footer{display:flex;gap:8px;padding:12px 16px 16px}
.dsh-panel__footer .dsh-btn{flex:1}
`;

  /* 以下逻辑与扩展版 content.js 保持一致（单文件内联） */
  const PRESETS = [
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

  const DEFAULTS = { enabled: true, mode: "auto", bgType: "preset", presetId: "aurora", bgValue: "", alpha: 0.72, blur: 20, fabX: null, fabY: null };
  const LS_KEY = "dsh-skin:settings";
  let settings = (() => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(LS_KEY) || "{}") }; } catch (e) { return { ...DEFAULTS }; } })();

  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch (e) { alert("设置保存失败：本地存储空间不足。建议改用图片链接方式。"); } }

  const root = document.documentElement;
  function apply() {
    root.setAttribute("data-dsh-enabled", settings.enabled ? "true" : "false");
    let theme = settings.mode === "auto" ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") : settings.mode;
    root.setAttribute("data-dsh-theme", theme);
    root.style.setProperty("--dsh-alpha", String(settings.alpha));
    root.style.setProperty("--dsh-blur", settings.blur + "px");
    let bg = "none";
    if (settings.enabled) {
      if (settings.bgType === "preset") { const p = PRESETS.find(x => x.id === settings.presetId); if (p && p.css !== "none") bg = p.css; }
      else if ((settings.bgType === "url" || settings.bgType === "image") && settings.bgValue) bg = 'url("' + settings.bgValue.replace(/"/g, "%22") + '")';
    }
    root.style.setProperty("--dsh-bg-image", bg);
    root.style.setProperty("--dsh-bg-color", theme === "dark" ? "#1c1c1e" : "#f5f5f7");
  }
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { if (settings.mode === "auto") apply(); });

  const ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="url(#dshg)"/><defs><linearGradient id="dshg" x1="3" y1="3" x2="21" y2="21"><stop stop-color="#5AC8FA"/><stop offset=".5" stop-color="#007AFF"/><stop offset="1" stop-color="#AF52DE"/></linearGradient></defs><circle cx="12" cy="12" r="3.2" fill="rgba(255,255,255,.9)"/></svg>';
  let fab, panel;

  function buildUI() {
    if (document.getElementById("dsh-fab")) return;
    fab = document.createElement("div"); fab.id = "dsh-fab"; fab.className = "dsh-fab";
    fab.innerHTML = ICON; fab.title = "DSH 皮肤设置";
    document.body.appendChild(fab);
    if (settings.fabX != null) requestAnimationFrame(() => setFabPos(settings.fabX, settings.fabY));
    panel = buildPanel(); document.body.appendChild(panel);

    let drag = null;
    fab.addEventListener("pointerdown", e => { drag = { sx: e.clientX, sy: e.clientY, moved: false, ox: fab.getBoundingClientRect().left, oy: fab.getBoundingClientRect().top }; fab.setPointerCapture(e.pointerId); });
    fab.addEventListener("pointermove", e => { if (!drag) return; const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy; if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true; if (drag.moved) setFabPos(drag.ox + dx, drag.oy + dy); });
    fab.addEventListener("pointerup", () => { if (drag && !drag.moved) panel.classList.toggle("dsh-panel--open"); if (drag && drag.moved) { settings.fabX = fab.getBoundingClientRect().left; settings.fabY = fab.getBoundingClientRect().top; save(); } drag = null; });
    document.addEventListener("pointerdown", e => { if (!panel.classList.contains("dsh-panel--open")) return; if (!panel.contains(e.target) && !fab.contains(e.target)) panel.classList.remove("dsh-panel--open"); });
  }

  function setFabPos(x, y) {
    x = Math.max(8, Math.min(window.innerWidth - 56, x));
    y = Math.max(8, Math.min(window.innerHeight - 56, y));
    fab.style.left = x + "px"; fab.style.top = y + "px"; fab.style.right = "auto"; fab.style.bottom = "auto";
  }

  function buildPanel() {
    const el = document.createElement("div");
    el.className = "dsh-panel";
    el.innerHTML = `
      <div class="dsh-panel__header"><div class="dsh-panel__title">皮肤设置</div><button class="dsh-panel__close">✕</button></div>
      <div class="dsh-panel__section"><div class="dsh-switch-row"><span>启用皮肤</span><div class="dsh-switch" data-bind="enabled"></div></div></div>
      <div class="dsh-panel__section"><div class="dsh-panel__label"><span>外观</span></div>
        <div class="dsh-segmented" data-bind="mode"><button data-val="light">浅色</button><button data-val="dark">深色</button><button data-val="auto">自动</button></div></div>
      <div class="dsh-panel__section"><div class="dsh-panel__label"><span>预设背景</span></div><div class="dsh-swatches" data-bind="presets"></div>
        <div class="dsh-row"><input class="dsh-input" data-bind="bgUrl" type="text" placeholder="粘贴图片链接（https://...）"/><button class="dsh-btn" data-act="apply-url">应用</button></div>
        <div class="dsh-row"><button class="dsh-btn dsh-btn--ghost" data-act="pick-file" style="flex:1">上传本地图片</button><button class="dsh-btn dsh-btn--ghost" data-act="clear-bg" style="flex:1">清除背景</button></div>
        <input type="file" accept="image/*" data-bind="file" style="display:none"/></div>
      <div class="dsh-panel__section"><div class="dsh-panel__label"><span>玻璃透明度</span><span class="dsh-panel__value" data-bind="alphaVal"></span></div>
        <input class="dsh-slider" data-bind="alpha" type="range" min="10" max="100" step="1"/></div>
      <div class="dsh-panel__section"><div class="dsh-panel__label"><span>背景模糊</span><span class="dsh-panel__value" data-bind="blurVal"></span></div>
        <input class="dsh-slider" data-bind="blur" type="range" min="0" max="40" step="1"/></div>
      <div class="dsh-panel__footer"><button class="dsh-btn dsh-btn--ghost" data-act="reset">恢复默认</button></div>`;

    el.querySelector(".dsh-panel__close").onclick = () => el.classList.remove("dsh-panel--open");
    el.querySelector('[data-bind="enabled"]').onclick = e => { settings.enabled = !settings.enabled; save(); refresh(el); apply(); };
    el.querySelectorAll('[data-bind="mode"] button').forEach(b => b.onclick = () => { settings.mode = b.dataset.val; save(); refresh(el); apply(); });

    const sws = el.querySelector('[data-bind="presets"]');
    PRESETS.forEach(p => {
      const s = document.createElement("div"); s.className = "dsh-swatch"; s.dataset.id = p.id; s.title = p.name;
      s.innerHTML = '<span style="background:' + (p.css === "none" ? "repeating-linear-gradient(45deg,#c7c7cc 0 4px,#ededf0 4px 8px)" : p.css) + ';border-radius:7px;"></span>';
      s.onclick = () => { settings.bgType = "preset"; settings.presetId = p.id; save(); refresh(el); apply(); };
      sws.appendChild(s);
    });

    el.querySelector('[data-act="apply-url"]').onclick = () => {
      const v = el.querySelector('[data-bind="bgUrl"]').value.trim();
      if (!v) return;
      settings.bgType = "url"; settings.bgValue = v; save(); refresh(el); apply();
    };
    const fi = el.querySelector('[data-bind="file"]');
    el.querySelector('[data-act="pick-file"]').onclick = () => fi.click();
    fi.onchange = () => {
      const f = fi.files && fi.files[0]; if (!f) return;
      if (f.size > 4 * 1024 * 1024) alert("图片超过 4MB，可能超出本地存储限制，建议改用图片链接。");
      const r = new FileReader();
      r.onload = () => { settings.bgType = "image"; settings.bgValue = String(r.result); save(); refresh(el); apply(); };
      r.readAsDataURL(f); fi.value = "";
    };
    el.querySelector('[data-act="clear-bg"]').onclick = () => { settings.bgType = "none"; settings.bgValue = ""; save(); refresh(el); apply(); };

    const aS = el.querySelector('[data-bind="alpha"]'), bS = el.querySelector('[data-bind="blur"]');
    aS.oninput = () => { settings.alpha = aS.value / 100; el.querySelector('[data-bind="alphaVal"]').textContent = aS.value + "%"; apply(); };
    aS.onchange = save;
    bS.oninput = () => { settings.blur = +bS.value; el.querySelector('[data-bind="blurVal"]').textContent = bS.value + "px"; apply(); };
    bS.onchange = save;
    el.querySelector('[data-act="reset"]').onclick = () => { const k = { fabX: settings.fabX, fabY: settings.fabY }; settings = { ...DEFAULTS, ...k }; save(); refresh(el); apply(); };

    refresh(el);
    return el;
  }

  function refresh(el) {
    el.querySelector('[data-bind="enabled"]').classList.toggle("dsh-switch--on", settings.enabled);
    el.querySelectorAll('[data-bind="mode"] button').forEach(b => b.classList.toggle("dsh-active", b.dataset.val === settings.mode));
    el.querySelectorAll(".dsh-swatch").forEach(s => s.classList.toggle("dsh-swatch--active", settings.bgType === "preset" && s.dataset.id === settings.presetId));
    const ui = el.querySelector('[data-bind="bgUrl"]');
    if (document.activeElement !== ui) ui.value = settings.bgType === "url" ? settings.bgValue : "";
    el.querySelector('[data-bind="alpha"]').value = Math.round(settings.alpha * 100);
    el.querySelector('[data-bind="alphaVal"]').textContent = Math.round(settings.alpha * 100) + "%";
    el.querySelector('[data-bind="blur"]').value = settings.blur;
    el.querySelector('[data-bind="blurVal"]').textContent = settings.blur + "px";
  }

  function boot() {
    const style = document.createElement("style");
    style.id = "dsh-skin-style";
    style.textContent = GM_CSS;
    (document.head || document.documentElement).appendChild(style);
    apply();
    buildUI();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
