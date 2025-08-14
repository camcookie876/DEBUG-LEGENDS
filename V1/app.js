import { createShell } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/shell.js";
import { mountHome } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/home.js";
import { mountPlay } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/play.js";
import { mountSave } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/save.js";
import { mountCharacter } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/character.js";
import { Router } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/router.js";
import { DataStore, defaultSave } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/datastore.js";
import { DeviceGate } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/device.js";
import { mountGate } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/gate.js";
import { toast } from "https://camcookie876.github.io/DEBUG-LEGENDS/V1/ui/components/toast.js";

const appEl = document.getElementById("app");
const overlayRoot = document.getElementById("overlay-root");

const store = new DataStore("debug-legends.v1");
let save = await store.load() ?? defaultSave();

const deviceGate = new DeviceGate();

function ctx(){
  return {
    get save(){ return save; },
    async setSave(newSave){
      save = newSave;
      await store.save(save);
    },
    store,
    routeTo: (r) => router.go(r),
    notify: (m, kind="info") => toast(m, kind),
  };
}

const router = new Router({
  routes: ["home","play","character","save"],
  onChange(route){
    // repaint main content
    const main = document.querySelector(".main");
    main.innerHTML = "";
    if(route === "home") mountHome(main, ctx());
    else if(route === "play") mountPlay(main, ctx());
    else if(route === "character") mountCharacter(main, ctx());
    else if(route === "save") mountSave(main, ctx());
    // update nav
    document.querySelectorAll(".nav .btn").forEach(b=>{
      b.classList.toggle("active", b.dataset.route === route);
    });
  }
});

// Boot UI shell
appEl.innerHTML = "";
appEl.appendChild(createShell(router));

// Device gating (block phones/tiny screens; tablets must be landscape)
function applyGate(){
  const assessment = deviceGate.assess();
  mountGate(overlayRoot, assessment, () => {
    // only called when the overlay is informational (unknown) or resolved (tablet rotated)
    overlayRoot.innerHTML = "";
  });
}
applyGate();
window.addEventListener("resize", applyGate);
window.addEventListener("orientationchange", applyGate);

// Start at home
router.go("home");

// First-time nudge
if(!save.meta.introSeen){
  toast("Welcome to Debug Legends V1 — By Camcookie.", "success");
  save.meta.introSeen = true;
  await store.save(save);
}