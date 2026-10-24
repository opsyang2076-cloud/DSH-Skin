/**
 * DSH Skin - Apple Style for DeepSeek Harness
 * Cordis 服务端插件入口。
 *
 * 原理：监听 webserver/index-inject，在每次 index 响应中注入
 *   1. 一段 <style>（苹果风格玻璃拟态 + 悬浮球面板样式）
 *   2. 一段 <script>（悬浮球设置面板：换背景 / 透明度 / 模糊）
 *
 * 设置持久化在浏览器 localStorage（键名 dsh-skin:settings），
 * 不依赖宿主的配置系统，所有调整实时生效。
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("./page.css", import.meta.url), "utf8");
const js = readFileSync(new URL("./page.js", import.meta.url), "utf8");

/**
 * @param {import('cordis').Context} ctx 宿主插件上下文
 */
export function apply(ctx) {
  ctx.on("webserver/index-inject", (table) => {
    table.push(
      { kind: "style", text: css },
      { kind: "script", placement: "body", text: js },
    );
  });
}
