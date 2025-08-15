// https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/gate.js
import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function mountGate(overlayRoot, assessment, onContinue){
  overlayRoot.innerHTML = "";

  if(assessment.allowed && !assessment.unknown) return; // no overlay needed

  const body = [];

  if(assessment.unknown){
    body.push(h("p", {}, "We couldn't determine your device type. You can try playing, but some layouts may not display correctly."));
    body.push(h("button", {class:"button primary", onclick:onContinue}, "Continue Anyway"));
  } else {
    body.push(h("h2", {}, "Device Not Supported"));
    assessment.reasons.forEach(r => body.push(h("p", {}, r)));
  }

  const overlay = h("div", {class:"overlay"}, [
    h("div", {class:"sheet"}, body)
  ]);
  overlayRoot.appendChild(overlay);
}