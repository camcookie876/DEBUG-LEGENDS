// https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/play.js
import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function mountPlay(container, ctx){
  const mapArea = h("div", {class:"map panel"}, [
    node(200, 180, "Intro Node", ()=> ctx.notify("Start your first code quest!", "success")),
    node(400, 300, "Locked Node", null, true)
  ]);

  const sidebar = h("div", {class:"sidebar panel"}, [
    h("h2", {}, "Quest Log"),
    h("p", {}, "Select a glowing node to begin a coding challenge."),
    h("button", {class:"button", onclick: ()=> ctx.routeTo("home")}, "Back to Home")
  ]);

  const world = h("div", {class:"world"}, [mapArea, sidebar]);
  container.appendChild(world);
}

function node(x, y, label, onClick, locked=false){
  return h("div", {
    class:`node ${locked?"locked":""}`,
    style:`left:${x}px; top:${y}px`,
    onclick: locked ? null : onClick
  }, h("div", {class:"label"}, label));
}