import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function createShell(router){
  const header = h("div", {class:"header"}, [
    h("div", {class:"brand"}, [
      h("img", {src:"https://camcookie876.github.io/DEBUG-LEGENDS/V1/assets/svg/logo.svg", alt:"Camcookie Logo"}),
      h("div", {}, "Debug Legends V1"),
      h("div", {class:"badge"}, "By Camcookie")
    ]),
    h("div", {class:"nav"}, [
      navBtn("Home","home",router),
      navBtn("Play","play",router),
      navBtn("Character","character",router),
      navBtn("Save","save",router),
    ])
  ]);
  const main = h("div", {class:"main panel"});
  const footer = h("div", {class:"footer"}, [
    h("div", {}, "© " + new Date().getFullYear() + " Camcookie"),
    h("div", {}, "A coding world adventure")
  ]);
  const shell = h("div", {}, [header, main, footer]);
  shell.classList.add("shell");
  return shell;
}

function navBtn(label, route, router){
  return h("button", {
    class:"btn",
    "data-route":route,
    onclick:()=> router.go(route)
  }, label);
}