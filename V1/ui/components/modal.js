import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function modal({title, body, actions=[]}){
  const root = document.getElementById("modal-root");
  root.innerHTML = "";
  const onClose = () => root.innerHTML = "";

  const header = h("div", {class:"form-row", style:"justify-content:space-between"},
    [ h("strong", {}, title || "Dialog"), h("button", {class:"button", onclick:onClose}, "Close") ]
  );

  const btns = h("div", {class:"cta"},
    actions.map(a => h("button", {
      class:`button ${a.kind||""}`, onclick: async ()=>{
        const res = await a.onClick?.();
        if(a.close !== false) onClose();
        return res;
      }
    }, a.label))
  );

  const sheet = h("div", {class:"panel", style:"padding:16px"},
    [ header, h("div", {style:"margin:12px 0"}, body), btns ]
  );

  root.appendChild(h("div", {class:"overlay"}, h("div", {class:"sheet"}, sheet)));
  return { close:onClose };
}