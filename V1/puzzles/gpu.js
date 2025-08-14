export const gpuPuzzle = {
  title: "Reforge the Shader: Clamp Color",
  brief: "The fragment shader outputs invalid color values, blowing out highlights. Implement clampColor(r,g,b) to return values clamped to [0,255].",
  starter:
`// Implement clampColor(r,g,b) returning an object { r,g,b } with each in [0,255].
function clampColor(r,g,b){
  // TODO: fix. Current version returns raw values.
  return { r, g, b };
}

return { clampColor };`,
  testsDescription:
`expect(clampColor(300, -20, 128)).toEqual({r:255,g:0,b:128})
expect(clampColor(0,0,0)).toEqual({r:0,g:0,b:0})
expect(clampColor(255,255,255)).toEqual({r:255,g:255,b:255})
expect(clampColor(12.7, 200.9, 255.1)).toEqual({r:13,g:201,b:255})`,
  scene,
  heal,
  run: runHarness
};

function scene(){
  const svgNS="http://www.w3.org/2000/svg";
  const s = document.createElementNS(svgNS,"svg");
  s.setAttribute("viewBox","0 0 640 260");
  s.innerHTML = `
    <defs>
      <linearGradient id="gpuGrad" x1="0" x2="1"><stop offset="0%" stop-color="#1d2847"/><stop offset="100%" stop-color="#0f1a33"/></linearGradient>
      <filter id="scan"><feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="1" result="n"/><feColorMatrix type="saturate" values="0"/><feBlend in="SourceGraphic" in2="n" mode="multiply"/></filter>
    </defs>
    <rect width="100%" height="100%" fill="#0a1120"/>
    <g transform="translate(20,20)">
      <rect x="0" y="0" width="600" height="220" rx="18" fill="url(#gpuGrad)" stroke="#2b3f6d" stroke-width="2"/>
      <g id="display" filter="url(#scan)">
        <rect x="40" y="40" width="300" height="160" rx="8" fill="#0b0f1f" stroke="#273a64"/>
        <g transform="translate(50,50)">
          <rect id="pix" x="0" y="0" width="280" height="140" fill="rgb(320,-40,290)"/>
        </g>
      </g>
      <text id="err" x="360" y="120" fill="#ff6a6a" font-family="monospace">Fragment overflow</text>
      <text id="ok" x="360" y="150" fill="#2bd56f" font-family="monospace" opacity="0">Shader stable</text>
    </g>
  `;
  return s;
}

function heal(sceneEl){
  const pix = sceneEl.querySelector("#pix");
  const err = sceneEl.querySelector("#err");
  const ok = sceneEl.querySelector("#ok");
  if (pix) pix.setAttribute("fill","rgb(40,120,220)");
  if (err) err.setAttribute("opacity","0");
  if (ok) ok.setAttribute("opacity","1");
}

async function runHarness(userCode){
  const log = [];
  const sandbox = (code) => Function(`"use strict"; ${code}`)();

  function expect(actual){
    return {
      toEqual: (obj) => {
        const pass = deepEq(actual, obj);
        if (!pass) throw new Error(`Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(obj)}`);
      }
    };
  }

  function deepEq(a,b){
    if (a===b) return true;
    if (a && b && typeof a==="object" && typeof b==="object"){
      const ka=Object.keys(a), kb=Object.keys(b);
      if (ka.length!==kb.length) return false;
      return ka.every(k => deepEq(a[k], b[k]));
    }
    return false;
  }

  let api;
  try { api = sandbox(userCode); }
  catch (e){ return { passed:false, log:[`Syntax/Runtime error: ${e.message}`] }; }

  if (!api || typeof api.clampColor !== "function"){
    return { passed:false, log:["clampColor function not found. Ensure you return { clampColor }."] };
  }

  try {
    const { clampColor } = api;
    const clamp = v => Math.max(0, Math.min(255, Math.round(v)));

    expect(clampColor(300,-20,128)).toEqual({ r:255, g:0, b:128 });
    expect(clampColor(0,0,0)).toEqual({ r:0, g:0, b:0 });
    expect(clampColor(255,255,255)).toEqual({ r:255, g:255, b:255 });
    expect(clampColor(12.7,200.9,255.1)).toEqual({ r:13, g:201, b:255 });

    for (let i=0;i<5;i++){
      const r = (Math.random()*400)-50, g=(Math.random()*400)-50, b=(Math.random()*400)-50;
      const exp = { r: clamp(r), g: clamp(g), b: clamp(b) };
      expect(clampColor(r,g,b)).toEqual(exp);
    }

    log.push("All tests passed.");
    return { passed:true, log };
  } catch (e) {
    log.push("Test failed: " + e.message);
    return { passed:false, log };
  }
}