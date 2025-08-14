export function mountHome(root, { routeTo }) {
  const el = document.createElement("section");
  el.className = "vstack";
  el.innerHTML = `
    <div class="panel vstack">
      <span class="kicker">Pre‑Release</span>
      <h1>Debug Legends: The Silicon Siege</h1>
      <p>The system is under attack. A shapeshifting Virus is corrupting the chips — from the heart of the CPU to the threshold of the USB Port.</p>
      <p>You are the Code Warden. Code you write becomes the power to heal this world.</p>
      <div class="hstack">
        <button class="btn primary" id="start">Start Playing</button>
        <span class="badge"><span class="tag">V1</span> Browser Realms Preview</span>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="panel vstack">
        <h2>What’s in V1</h2>
        <ul>
          <li>CPU and GPU preview puzzles</li>
          <li>Save/Load via JSON export/import</li>
          <li>SVG chip scenes that heal on success</li>
        </ul>
        <small class="mono">Full content ships in V2.</small>
      </div>
      <div class="panel vstack">
        <h2>How to play</h2>
        <p>Open a chapter, read the brief, then fix the code in the editor. Run the tests — if they pass, the world heals.</p>
      </div>
    </div>
  `;
  el.querySelector("#start").addEventListener("click", () => routeTo("play"));
  root.appendChild(el);
}