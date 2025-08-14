export class DataStore {
  async save(){ /* V1: no auto-persist */ }
  async load(){ return null; }

  async exportFile(data){
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "debug-legends-save.json" });
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  async importFile(file){
    const raw = await file.text();
    return JSON.parse(raw);
  }
}

export function defaultSave() {
  const now = new Date().toISOString();
  return {
    version: 1,
    profile: { playerId: "V1-offline", displayName: "Code Warden", createdAt: now, lastSeenAt: now },
    progress: { chaptersUnlocked: ["CPU","GPU"], lastCheckpoint: null, bossesDefeated: [] },
    inventory: { chips: ["debug-blade"], fragments: 0, keys: [] },
    settings: { difficulty: "standard", accessibility: { highContrast: false, textScale: 1.0 }, audio: { music: 0.6, sfx: 0.9 } },
    telemetry: { playtimeSeconds: 0, puzzlesSolved: 0 },
    integrity: { lastWriteAt: now, checksum: "init" }
  };
}