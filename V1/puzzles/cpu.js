export const cpuPuzzle = {
  title: "Stabilize the ALU: Summation Routine",
  brief: "The ALU’s add microcode is glitching. Implement sumArray(nums) to return the correct total for an array of numbers.",
  starter:
`// Fix this function.
// Requirements:
// - Return the sum of all numbers in the array.
// - Treat non-finite values (NaN, Infinity) as 0.
// - Must be a pure function (no side effects).
function sumArray(nums){
  // TODO: implement
  let total = 0;
  for (let i = 0; i < nums.length; i++){
    const v = nums[i];
    // BUG: currently adds raw value (including NaN/Infinity)
    total += v;
  }
  return total;
}

// Export for test harness
return { sumArray };`,
  testsDescription:
`expect(sumArray([1,2,3])).toBe(6)
expect(sumArray([-2, 5, 7])).toBe(10)
expect(sumArray([])).toBe(0)
expect(sumArray([NaN, 1, 2])).toBe(3)
expect(sumArray([Infinity, -Infinity, 5])).toBe(5)
expect(sumArray([1e6, 2e6, 3])).toBe(3000003)`,
  scene,
  heal,
  run: runHarness
};

function scene(){
  const svgNS = "http://www.w3.org/2000/svg";
  const s = document.createElementNS(svgNS, "svg");
  s.setAttribute("viewBox","0 0 640 260");
  s.innerHTML = `
    <defs>
      <linearGradient id="chipGrad" x1="0" x2="1">
        <stop offset="0%" stop-color="#1e2d4f"/><stop offset="100%" stop-color="#13203a"/>
      </linearGradient>
      <filter id="glitch">
        <feTurbulence type="turbulence" baseFrequency="0.9" numOctaves="1" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale="10" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="heal">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="#0a1120"/>
    <g transform="translate(20,20)">
      <rect x="0" y="0" width="600" height="220" rx="18" fill="url(#chipGrad)" stroke="#2b3f6d" stroke-width="2" />
      ${Array.from({length:24}).map((_,i)=> {
        const x = 12 + (i%12)*48; const y = 200 + Math.floor(i/12)*10;
        return `<rect x="${x}" y="${y}" width="24" height="20" rx="4" fill="#0d1a33" stroke="#273a64"/>`;
      }).join("")}
      <g id="core" filter="url(#glitch)">
        <rect x="200" y="60" width="240" height="120" rx="12" fill="#1a2b4d" stroke="#2d4579"/>
        <text x="320" y="126" text-anchor="middle" fill="#ff6a6a" font-size="20" font-family="monospace">ALU ERROR</text>
      </g>
      <text id="okText" x="320" y="126" text-anchor="middle" fill="#2bd56f" font-size="20" font-family="monospace" opacity="0">ALU STABLE</text>
    </g>
  `;
  return s;
}

function heal(sceneEl){
  const core = sceneEl.querySelector("#core");
  const ok = sceneEl.querySelector("#okText");
  if (core) core.setAttribute("filter","url(#heal)");
  if (ok) ok.setAttribute("opacity","1");
}

async function runHarness(userCode){
  const log = [];
  const out = (s)=> log.push(String(s));
  const sandbox = (code) => Function(`"use strict"; ${code}`)();

  function expect(actual){
    return {
      toBe: (exp) => {
        const pass = Object.is(actual, exp);
        if (!pass) throw new Error(`Expected ${JSON.stringify(actual)} to be ${JSON.stringify(exp)}`);
      }
    };
  }

  let api;
  try { api = sandbox(userCode); }
  catch (e) { return { passed:false, log: [`Syntax/Runtime error: ${e.message}`] }; }

  if (!api || typeof api.sumArray !== "function"){
    return { passed:false, log: ["sumArray function not found. Ensure you return { sumArray } at the end."] };
  }

  try {
    const { sumArray } = api;
    const safe = a => a.map(v => Number.isFinite(v)? v : 0);
    const oracle = a => safe(a).reduce((t,v)=>t+v,0);

    expect(sumArray([1,2,3])).toBe(6);
    expect(sumArray([-2,5,7])).toBe(10);
    expect(sumArray([])).toBe(0);
    expect(sumArray([NaN,1,2])).toBe(3);
    expect(sumArray([Infinity,-Infinity,5])).toBe(5);
    expect(sumArray([1e6,2e6,3])).toBe(3000003);

    for (let i=0;i<5;i++){
      const arr = Array.from({length:5},()=> Math.random()>0.2 ? +(Math.random()*10).toFixed(2) : NaN);
      const ex = oracle(arr);
      const got = sumArray(arr);
      expect(+(+got).toFixed(2)).toBe(+ex.toFixed(2));
    }

    out("All tests passed.");
    return { passed:true, log };
  } catch (e) {
    log.push("Test failed: " + e.message);
    return { passed:false, log };
  }
}