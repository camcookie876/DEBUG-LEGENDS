const LS_PREFIX = "DLV1:";

export function defaultSave(){
  return {
    meta: { version: 1, introSeen:false, by:"Camcookie" },
    player: {
      name: "Apprentice",
      style: { primary:"#66e9ff", secondary:"#8b7dff", skin:"#f2c7a5" },
    },
    progress: {
      world: { nodesCleared: [] },
    }
  };
}

export class DataStore{
  constructor(key){
    this.key = `${LS_PREFIX}${key}`;
  }
  async load(){
    try{
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    }catch(e){ console.warn("Load failed", e); return null; }
  }
  async save(data){
    try{
      localStorage.setItem(this.key, JSON.stringify(data));
      return true;
    }catch(e){ console.warn("Save failed", e); return false; }
  }
  async exportJSON(){
    const raw = localStorage.getItem(this.key) ?? JSON.stringify(defaultSave());
    return raw;
  }
  async importJSON(raw){
    const parsed = JSON.parse(raw);
    if(!parsed?.meta || !parsed?.player) throw new Error("Invalid save file.");
    await this.save(parsed);
    return parsed;
  }
  async reset(){
    const d = defaultSave();
    await this.save(d);
    return d;
  }
}