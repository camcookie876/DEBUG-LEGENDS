// https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/character.js
import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function mountCharacter(container, ctx){
  container.appendChild(h("h2", {}, "Customize Your Character"));

  const avatar = h("div", {class:"avatar"}, [
    h("img", {src:"https://camcookie876.github.io/DEBUG-LEGENDS/V1/assets/svg/character-base.svg", alt:"Avatar"}),
    h("div", {class:"pulse"})
  ]);

  container.appendChild(avatar);

  // Simple name/color form
  const form = h("div", {class:"form-row"}, [
    h("input", {class:"input", value: ctx.save.player.name, oninput:(e)=> ctx.save.player.name = e.target.value}),
    h("input", {type:"color", value: ctx.save.player.style.primary, oninput:(e)=> ctx.save.player.style.primary = e.target.value})
  ]);

  container.appendChild(form);
}