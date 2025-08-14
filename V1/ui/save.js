export function mountSave(root, { get save, setSave, store }) {
  const el = document.createElement("section");
  el.className = "vstack";

  el.innerHTML = `
    <div class="panel vstack">
      <h2>Save & Load</h2>
      <p>In V1, your progress is not stored between sessions — download your save as JSON to keep it, and import it later to continue.</p>
      <div class="hstack">
        <button class="btn ok" id="export">Download Save (JSON)</button>
        <label class="file">
          <input id="import" type="file" accept="application/json" />
          <span>Import Save…</span>
        </label>
      </div>
      <hr />
      <div class="grid cols-2">
        <div class="vstack">
          <h3>Profile</h3>
          <p><strong>ID:</strong> <small class="mono" id="pid"></small></p>
          <p><strong>Name:</strong> <span id="pname"></span></p>
          <p><strong>Last Checkpoint:</strong> <span id="cp"></span></p>
        </div>
        <div class="vstack">
          <h3>Progress</h3>
          <p><strong>Unlocked:</strong> <span id="un"></span></p>
          <p><strong>Puzzles Solved:</strong> <span id="ps"></span></p>
          <p><strong>Checksum:</strong> <small class="mono" id="cs"></small></p>
        </div>
      </div>
    </div>
  `;

  const s = save;
  el.querySelector("#pid").textContent = s.profile.playerId;
  el.querySelector("#pname").textContent = s.profile.displayName;
  el.querySelector("#cp").textContent = s.progress.lastCheckpoint || "—";
  el.querySelector("#un").textContent = s.progress.chaptersUnlocked.join(", ");
  el.querySelector("#ps").textContent = s.telemetry.puzzlesSolved;
  el.querySelector("#cs").textContent = s.integrity.checksum;

  el.querySelector("#export").addEventListener("click", () => store.exportFile(save));
  el.querySelector("#import").addEventListener("change", async (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const imported = await store.importFile(file);
    await setSave(imported);
    location.reload();
  });

  root.appendChild(el);
}