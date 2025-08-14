import { cpuPuzzle } from "../puzzles/cpu.js";
import { gpuPuzzle } from "../puzzles/gpu.js";

export function mountPlay(root, ctx) {
  const el = document.createElement("section");
  el.className = "vstack";

  const chapters = [
    { id: "CPU", title: "CPU — Logic Core", puzzle: cpuPuzzle },
    { id: "GPU", title: "GPU — Shader Forge", puzzle: gpuPuzzle }
  ];

  el.innerHTML = `
    <div class="panel vstack">
      <h2>Select Chapter</h2>
      <div class="hstack" id="chapters"></div>
    </div>
    <div id="puzzleHost" class="grid cols-2"></div>
  `;

  const chaptersEl = el.querySelector("#chapters");
  chapters.forEach(ch => {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = ch.title;
    b.addEventListener("click", () => loadPuzzle(ch));
    chaptersEl.appendChild(b);
  });

  const host = el.querySelector("#puzzleHost");
  root.appendChild(el);
  loadPuzzle(chapters[0]);

  async function loadPuzzle(ch){
    host.innerHTML = "";
    const left = document.createElement("div");
    const right = document.createElement("div");
    left.className = "vstack"; right.className = "vstack";
    left.innerHTML = `
      <div class="panel vstack">
        <span class="kicker">${ch.title}</span>
        <h3>${ch.puzzle.title}</h3>
        <p>${ch.puzzle.brief}</p>
      </div>
      <div class="panel vstack">
        <h3>Editor</h3>
        <textarea class="code" id="editor"></textarea>
        <div class="hstack">
          <button class="btn primary" id="run">Run Tests</button>
          <span id="status" class="status warn">Waiting to run…</span>
        </div>
        <details class="panel" open>
          <summary><strong>Output</strong></summary>
          <pre class="code" id="output" aria-live="polite"></pre>
        </details>
      </div>
    `;

    right.innerHTML = `
      <div class="panel vstack">
        <h3>World State</h3>
        <div class="scene" id="scene"></div>
        <small class="mono">Heal the chip by passing all tests.</small>
      </div>
      <div class="panel vstack">
        <h3>Tests</h3>
        <pre class="code"><code>${escapeHTML(ch.puzzle.testsDescription)}</code></pre>
      </div>
    `;

    host.appendChild(left); host.appendChild(right);

    const editor = left.querySelector("#editor");
    editor.value = ch.puzzle.starter;

    const sceneEl = right.querySelector("#scene");
    sceneEl.appendChild(ch.puzzle.scene());

    const runBtn = left.querySelector("#run");
    const statusEl = left.querySelector("#status");
    const outputEl = left.querySelector("#output");

    runBtn.onclick = async () => {
      outputEl.textContent = "";
      statusEl.className = "status warn";
      statusEl.textContent = "Running…";
      try {
        const result = await ch.puzzle.run(editor.value);
        outputEl.textContent = result.log.join("\n");
        if (result.passed) {
          statusEl.className = "status ok";
          statusEl.textContent = "All tests passed — world heals!";
          ch.puzzle.heal(sceneEl);
          await updateProgress(ch.id, ctx);
        } else {
          statusEl.className = "status err";
          statusEl.textContent = "Some tests failed.";
        }
      } catch (e) {
        statusEl.className = "status err";
        statusEl.textContent = "Error";
        outputEl.textContent = String(e);
      }
    };
  }
}

function escapeHTML(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

async function updateProgress(chapterId, { get save, setSave }){
  const s = structuredClone(save);
  if (!s.progress.chaptersUnlocked.includes(chapterId)) s.progress.chaptersUnlocked.push(chapterId);
  s.progress.lastCheckpoint = chapterId + ":puzzle-1";
  s.telemetry.puzzlesSolved = (s.telemetry.puzzlesSolved||0) + 1;
  await setSave(s);
}