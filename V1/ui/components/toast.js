import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function toast(message, kind="info", ms=3000){
  const root = document.getElementById("toast-root");
  const t = h("div", {class:"toast kard", role:"status"}, [
    h("div", {class:"form-row"}, [
      h("div", {style:`width:10px; height:10px; border-radius:999px; background:${kindColor(kind)}; box-shadow:0 0 12px ${kindColor(kind)};`}),
      h("div", {}, message)
    ])
  ]);
  root.appendChild(t);
  setTimeout(()=> t.remove(), ms);
}
function kindColor(kind){
  if(kind === "success") return "var(--good)";
  if(kind === "warn") return "var(--warn)";
  if(kind === "error") return "var(--bad)";
  return "var(--accent)";
}