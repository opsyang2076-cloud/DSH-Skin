/**
 * 构建 client.js：把 lib/page.css 与 lib/page.js 内联进
 * DeepSeek Harness 客户端模块加载器要求的工厂函数格式。
 *
 * 用法：node scripts/build-client.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("..", import.meta.url);
const css = readFileSync(new URL("lib/page.css", root), "utf8");
const js = readFileSync(new URL("lib/page.js", root), "utf8");

const out = `/* ============================================================
 * DSH Skin - client.js（由 scripts/build-client.mjs 生成，勿手改）
 * DeepSeek Harness 客户端模块：注入玻璃拟态样式 + 悬浮球设置面板
 * ============================================================ */
window.__ModuleLoader__.load({
  id: 'dsh-skin',
  factory(require) {
    const CSS = ${JSON.stringify(css)};

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

${js}

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
`;

writeFileSync(new URL("client.js", root), out);
console.log("client.js 生成完成:", out.length, "字符");
