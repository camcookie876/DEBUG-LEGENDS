import { DataStore, defaultSave } from "./datastore.js";
import { mountHome } from "./ui/home.js";
import { mountPlay } from "./ui/play.js";
import { mountSave } from "./ui/save.js";

const appEl = document.getElementById("app");
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));

const store = new DataStore();
let save = defaultSave();

function routeTo(name) {
  navButtons.forEach(b => b.classList.toggle("is-active", b.dataset.route === name));
  appEl.innerHTML = "";
  switch (name) {
    case "home": mountHome(appEl, ctx()); break;
    case "play": mountPlay(appEl, ctx()); break;
    case "save": mountSave(appEl, ctx()); break;
    default: mountHome(appEl, ctx());
  }
}

function ctx(){
  return {
    get save(){ return save; },
    setSave: async (next) => { save = next; },
    store,
    routeTo
  };
}

navButtons.forEach(btn => btn.addEventListener("click", () => routeTo(btn.dataset.route)));
routeTo("home");

// For console debugging
window.__debug_legends__ = { get save(){return save;}, setSave: (s)=> (save=s) };