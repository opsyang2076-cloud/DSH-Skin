/* ============================================================
 * DSH Skin - Apple Style for DeepSeek
 * content.js - 设置面板与主题状态管理
 *
 * 职责：
 *   1. 读写用户设置（localStorage，键名 dsh-skin:* ）
 *   2. 将设置应用到 CSS 变量 / data 属性
 *   3. 渲染悬浮球与设置面板
 *
 * 无任何外部依赖，无网络请求。
 * ============================================================ */

(function () {
  "use strict";

  /* 防止重复注入（SPA 场景下可能出现多次执行） */
  if (window.__DSH_SKIN_LOADED__) return;
  window.__DSH_SKIN_LOADED__ = true;

  /* ----------------------------------------------------------
   * 预设背景（Apple 系统壁纸风格的 CSS 渐变）
   * ---------------------------------------------------------- */
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

  const DEFAULTS = {
    enabled: true,      // 皮肤总开关
    mode: "auto",       // light | dark | auto
    bgType: "preset",   // preset | url | image | none
    presetId: "aurora",
    bgValue: "",        // 自定义 URL 或 dataURL
    alpha: 0.72,        // 玻璃不透明度
    blur: 20,           // 模糊半径 px
    fabX: null,         // 悬浮球位置（null = 默认右下角）
    fabY: null,
  };

  const LS_KEY = "dsh-skin:settings";

  /* ----------------------------------------------------------
   * 设置读写
   * ---------------------------------------------------------- */
  let settings = load();

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return { ...DEFAULTS };
      const parsed = JSON.parse(raw);
      return { ...DEFAULTS, ...parsed };
    } catch (e) {
      console.warn("[DSH Skin] 设置读取失败，使用默认值", e);
      return { ...DEFAULTS };
    }
  }

  function save() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(settings));
    } catch (e) {
      // localStorage 写入失败常见于 dataURL 过大（超过 ~5MB 配额）
      console.warn("[DSH Skin] 设置保存失败", e);
      alert("设置保存失败：本地存储空间不足。\n建议改用图片链接方式，或换一张较小的图片。");
    }
  }

  /* ----------------------------------------------------------
   * 主题应用：把 settings 翻译成 CSS 变量与 data 属性
   * ---------------------------------------------------------- */
  const root = document.documentElement;

  function apply() {
    root.setAttribute("data-dsh-enabled", settings.enabled ? "true" : "false");

    /* 明暗模式（auto 跟随系统） */
    let theme = settings.mode;
    if (theme === "auto") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    root.setAttribute("data-dsh-theme", theme);

    root.style.setProperty("--dsh-alpha", String(settings.alpha));
    root.style.setProperty("--dsh-blur", settings.blur + "px");

    /* 背景 */
    let bg = "none";
    let bgColor = theme === "dark" ? "#1c1c1e" : "#f5f5f7";
    if (settings.enabled) {
      if (settings.bgType === "preset") {
        const p = PRESETS.find((x) => x.id === settings.presetId);
        if (p && p.css !== "none") bg = p.css;
      } else if (settings.bgType === "url" && settings.bgValue) {
        bg = `url("${settings.bgValue.replace(/"/g, "%22")}")`;
      } else if (settings.bgType === "image" && settings.bgValue) {
        bg = `url("${settings.bgValue.replace(/"/g, "%22")}")`;
      }
    }
    root.style.setProperty("--dsh-bg-image", bg);
    root.style.setProperty("--dsh-bg-color", bgColor);
  }

  /* auto 模式下跟随系统切换 */
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (settings.mode === "auto") apply();
  });

  /* ----------------------------------------------------------
   * UI：悬浮球 + 设置面板
   * ---------------------------------------------------------- */
  const ICON_PALETTE =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none">' +
    '<circle cx="12" cy="12" r="9" fill="url(#dshg)"/>' +
    '<defs><linearGradient id="dshg" x1="3" y1="3" x2="21" y2="21">' +
    '<stop stop-color="#5AC8FA"/><stop offset="0.5" stop-color="#007AFF"/>' +
    '<stop offset="1" stop-color="#AF52DE"/></linearGradient></defs>' +
    '<circle cx="12" cy="12" r="3.2" fill="rgba(255,255,255,0.9)"/></svg>';

  let fab, panel;

  function buildUI() {
    if (document.getElementById("dsh-fab")) return;

    fab = document.createElement("div");
    fab.id = "dsh-fab";
    fab.className = "dsh-fab";
    fab.innerHTML = ICON_PALETTE;
    fab.title = "DSH 皮肤设置";
    document.body.appendChild(fab);
    restoreFabPos();

    panel = buildPanel();
    document.body.appendChild(panel);

    /* 悬浮球：点击开面板，拖动换位置 */
    let dragState = null;
    fab.addEventListener("pointerdown", (e) => {
      dragState = {
        startX: e.clientX, startY: e.clientY,
        moved: false,
        origin: getFabPos(),
      };
      fab.setPointerCapture(e.pointerId);
    });
    fab.addEventListener("pointermove", (e) => {
      if (!dragState) return;
      const dx = e.clientX - dragState.startX;
      const dy = e.clientY - dragState.startY;
      if (Math.abs(dx) + Math.abs(dy) > 6) dragState.moved = true;
      if (dragState.moved) setFabPos(dragState.origin.x + dx, dragState.origin.y + dy);
    });
    fab.addEventListener("pointerup", () => {
      if (dragState && !dragState.moved) togglePanel();
      if (dragState && dragState.moved) {
        const p = getFabPos();
        settings.fabX = p.x; settings.fabY = p.y;
        save();
      }
      dragState = null;
    });

    /* 点击面板外区域自动收起 */
    document.addEventListener("pointerdown", (e) => {
      if (!panel.classList.contains("dsh-panel--open")) return;
      if (panel.contains(e.target) || fab.contains(e.target)) return;
      panel.classList.remove("dsh-panel--open");
    });
  }

  function getFabPos() {
    const r = fab.getBoundingClientRect();
    return { x: r.left, y: r.top };
  }

  function setFabPos(x, y) {
    const w = fab.offsetWidth || 48;
    const h = fab.offsetHeight || 48;
    x = Math.max(8, Math.min(window.innerWidth - w - 8, x));
    y = Math.max(8, Math.min(window.innerHeight - h - 8, y));
    fab.style.left = x + "px";
    fab.style.top = y + "px";
    fab.style.right = "auto";
    fab.style.bottom = "auto";
  }

  function restoreFabPos() {
    if (settings.fabX != null && settings.fabY != null) {
      requestAnimationFrame(() => setFabPos(settings.fabX, settings.fabY));
    }
  }

  function togglePanel() {
    panel.classList.toggle("dsh-panel--open");
  }

  /* ----------------------------------------------------------
   * 面板 DOM 构建
   * ---------------------------------------------------------- */
  function buildPanel() {
    const el = document.createElement("div");
    el.className = "dsh-panel";
    el.innerHTML = `
      <div class="dsh-panel__header">
        <div class="dsh-panel__title">皮肤设置</div>
        <button class="dsh-panel__close" title="关闭">✕</button>
      </div>

      <div class="dsh-panel__section">
        <div class="dsh-switch-row">
          <span>启用皮肤</span>
          <div class="dsh-switch" data-bind="enabled"></div>
        </div>
      </div>

      <div class="dsh-panel__section">
        <div class="dsh-panel__label"><span>外观</span></div>
        <div class="dsh-segmented" data-bind="mode">
          <button data-val="light">浅色</button>
          <button data-val="dark">深色</button>
          <button data-val="auto">自动</button>
        </div>
      </div>

      <div class="dsh-panel__section">
        <div class="dsh-panel__label"><span>预设背景</span></div>
        <div class="dsh-swatches" data-bind="presets"></div>
        <div class="dsh-row">
          <input class="dsh-input" data-bind="bgUrl" type="text"
                 placeholder="粘贴图片链接（https://...）" />
          <button class="dsh-btn" data-act="apply-url">应用</button>
        </div>
        <div class="dsh-row">
          <button class="dsh-btn dsh-btn--ghost" data-act="pick-file" style="flex:1">
            上传本地图片
          </button>
          <button class="dsh-btn dsh-btn--ghost" data-act="clear-bg" style="flex:1">
            清除背景
          </button>
        </div>
        <input type="file" accept="image/*" data-bind="file" style="display:none" />
      </div>

      <div class="dsh-panel__section">
        <div class="dsh-panel__label"><span>玻璃透明度</span>
          <span class="dsh-panel__value" data-bind="alphaVal"></span></div>
        <input class="dsh-slider" data-bind="alpha" type="range"
               min="10" max="100" step="1" />
      </div>

      <div class="dsh-panel__section">
        <div class="dsh-panel__label"><span>背景模糊</span>
          <span class="dsh-panel__value" data-bind="blurVal"></span></div>
        <input class="dsh-slider" data-bind="blur" type="range"
               min="0" max="40" step="1" />
      </div>

      <div class="dsh-panel__footer">
        <button class="dsh-btn dsh-btn--ghost" data-act="reset">恢复默认</button>
      </div>
    `;
    bindPanel(el);
    refreshPanel(el);
    return el;
  }

  function bindPanel(el) {
    /* 关闭按钮 */
    el.querySelector(".dsh-panel__close").addEventListener("click", () =>
      el.classList.remove("dsh-panel--open")
    );

    /* 总开关 */
    const sw = el.querySelector('[data-bind="enabled"]');
    sw.addEventListener("click", () => {
      settings.enabled = !settings.enabled;
      save();
      refreshPanel(el);
      apply();
    });

    /* 明暗模式分段控件 */
    el.querySelectorAll('[data-bind="mode"] button').forEach((btn) => {
      btn.addEventListener("click", () => {
        settings.mode = btn.dataset.val;
        save();
        refreshPanel(el);
        apply();
      });
    });

    /* 预设色板 */
    const swatches = el.querySelector('[data-bind="presets"]');
    PRESETS.forEach((p) => {
      const s = document.createElement("div");
      s.className = "dsh-swatch";
      s.dataset.id = p.id;
      s.title = p.name;
      s.innerHTML = `<span style="background:${p.css === "none" ? "repeating-linear-gradient(45deg,#c7c7cc 0 4px,#ededf0 4px 8px)" : p.css};border-radius:7px;"></span>`;
      s.addEventListener("click", () => {
        settings.bgType = "preset";
        settings.presetId = p.id;
        save();
        refreshPanel(el);
        apply();
      });
      swatches.appendChild(s);
    });

    /* 自定义 URL */
    el.querySelector('[data-act="apply-url"]').addEventListener("click", () => {
      const input = el.querySelector('[data-bind="bgUrl"]');
      const url = input.value.trim();
      if (!url) return;
      settings.bgType = "url";
      settings.bgValue = url;
      save();
      refreshPanel(el);
      apply();
    });

    /* 本地图片 → dataURL（小图可行，大图会触发配额提示） */
    const fileInput = el.querySelector('[data-bind="file"]');
    el.querySelector('[data-act="pick-file"]').addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (f.size > 4 * 1024 * 1024) {
        alert("图片超过 4MB，可能超出浏览器本地存储限制。\n建议压缩后再上传，或改用图片链接。");
      }
      const reader = new FileReader();
      reader.onload = () => {
        settings.bgType = "image";
        settings.bgValue = String(reader.result);
        save();
        refreshPanel(el);
        apply();
      };
      reader.readAsDataURL(f);
      fileInput.value = "";
    });

    /* 清除背景 */
    el.querySelector('[data-act="clear-bg"]').addEventListener("click", () => {
      settings.bgType = "none";
      settings.bgValue = "";
      save();
      refreshPanel(el);
      apply();
    });

    /* 透明度滑块 */
    const alphaSlider = el.querySelector('[data-bind="alpha"]');
    alphaSlider.addEventListener("input", () => {
      settings.alpha = Number(alphaSlider.value) / 100;
      el.querySelector('[data-bind="alphaVal"]').textContent = alphaSlider.value + "%";
      apply();
    });
    alphaSlider.addEventListener("change", save);

    /* 模糊滑块 */
    const blurSlider = el.querySelector('[data-bind="blur"]');
    blurSlider.addEventListener("input", () => {
      settings.blur = Number(blurSlider.value);
      el.querySelector('[data-bind="blurVal"]').textContent = settings.blur + "px";
      apply();
    });
    blurSlider.addEventListener("change", save);

    /* 恢复默认 */
    el.querySelector('[data-act="reset"]').addEventListener("click", () => {
      const keepFab = { fabX: settings.fabX, fabY: settings.fabY };
      settings = { ...DEFAULTS, ...keepFab };
      save();
      refreshPanel(el);
      apply();
    });
  }

  /* 把 settings 同步到面板控件显示 */
  function refreshPanel(el) {
    const sw = el.querySelector('[data-bind="enabled"]');
    sw.classList.toggle("dsh-switch--on", settings.enabled);

    el.querySelectorAll('[data-bind="mode"] button').forEach((b) => {
      b.classList.toggle("dsh-active", b.dataset.val === settings.mode);
    });

    el.querySelectorAll(".dsh-swatch").forEach((s) => {
      s.classList.toggle(
        "dsh-swatch--active",
        settings.bgType === "preset" && s.dataset.id === settings.presetId
      );
    });

    const urlInput = el.querySelector('[data-bind="bgUrl"]');
    if (document.activeElement !== urlInput) {
      urlInput.value = settings.bgType === "url" ? settings.bgValue : "";
    }

    const alphaSlider = el.querySelector('[data-bind="alpha"]');
    alphaSlider.value = Math.round(settings.alpha * 100);
    el.querySelector('[data-bind="alphaVal"]').textContent =
      Math.round(settings.alpha * 100) + "%";

    const blurSlider = el.querySelector('[data-bind="blur"]');
    blurSlider.value = settings.blur;
    el.querySelector('[data-bind="blurVal"]').textContent = settings.blur + "px";
  }

  /* ----------------------------------------------------------
   * 启动
   * ---------------------------------------------------------- */
  function boot() {
    apply();
    buildUI();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
