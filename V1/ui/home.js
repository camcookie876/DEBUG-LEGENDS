// https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/home.js
import { h } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/utils/dom.js";

export function mountHome(container, ctx){
  const heroLeft = h("div", {class:"card panel"}, [
    h("h1", {}, "Enter the Coding World"),
    h("p", {}, "Journey through circuits, battle corrupted code, and restore the motherboard’s harmony."),
    h("div", {class:"cta"}, [
      h("button", {class:"button primary", onclick: ()=> ctx.routeTo("play")}, "Start Adventure"),
      h("button", {class:"button", onclick: ()=> ctx.routeTo("character")}, "Customize Character"),
      h("button", {class:"button", onclick: ()=> ctx.routeTo("save")}, "Manage Saves"),
    ]),
    h("div", {style:"margin-top:12px; color:var(--ink-dim)"}, 
      "Best experienced on desktops or tablets in landscape mode."
    )
  ]);

  const heroRight = h("div", {class:"card-visual panel"}, [
    sceneSVG()
  ]);

  const hero = h("div", {class:"hero"}, [heroLeft, heroRight]);
  container.appendChild(hero);
}

/**
 * Creates an animated SVG “coding scene” for the right panel.
 * This keeps the V1 homepage from feeling static.
 */
function sceneSVG(){
  const wrap = h("div", {style:"width:100%; max-width:520px"});
  wrap.innerHTML = `
  <svg viewBox="0 0 600 360" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-bg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stop-color="#66e9ff" stop-opacity=".9"/>
        <stop offset="1" stop-color="#8b7dff" stop-opacity=".9"/>
      </linearGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="b"/>
        <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Outer rounded backdrop -->
    <rect x="0" y="0" width="600" height="360" rx="18" fill="url(#grad-bg)" opacity=".08"/>

    <!-- Code window -->
    <g transform="translate(40,40)">
      <rect x="0" y="0" width="520" height="120" rx="12" fill="#101733" stroke="rgba(255,255,255,.2)"/>
      <g font-family="monospace" font-size="16" fill="#eaf1ff">
        <text x="16" y="36">function heal(node){</text>
        <text x="32" y="62">node.status = "stable"</text>
        <text x="16" y="88">}</text>
      </g>
    </g>

    <!-- “Avatar in world” chip -->
    <g transform="translate(300,200)">
      <circle cx="0" cy="0" r="42" fill="#0f1836" stroke="rgba(255,255,255,.2)"/>
      <circle cx="0" cy="0" r="42" fill="none" stroke="#66e9ff" stroke-width="2" filter="url(#glow)">
        <animate attributeName="stroke-dasharray" dur="4s" repeatCount="indefinite"
          values="10,264; 60,264; 10,264"/>
      </circle>
      <text text-anchor="middle" dominant-baseline="middle" 
            font-family="monospace" font-size="12" fill="#eaf1ff">YOU</text>
    </g>

    <!-- Decorative circuits -->
    <g stroke="#66e9ff" stroke-width="2" opacity=".6">
      <line x1="342" y1="200" x2="400" y2="200">
        <animate attributeName="stroke-dasharray" dur="3s" repeatCount="indefinite"
          values="0,200; 40,160; 0,200"/>
      </line>
      <line x1="258" y1="200" x2="200" y2="200">
        <animate attributeName="stroke-dasharray" dur="3s" begin="1.5s" repeatCount="indefinite"
          values="0,200; 40,160; 0,200"/>
      </line>
    </g>
  </svg>
  `;
  return wrap;
}